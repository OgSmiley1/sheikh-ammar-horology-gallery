const targets = await fetch("http://127.0.0.1:9222/json").then((response) => response.json());
const target = targets.find((entry) => entry.type === "page" && entry.url.includes("localhost:3000")) ?? targets.find((entry) => entry.type === "page");

if (!target?.webSocketDebuggerUrl) throw new Error("No browser page target is available for verification.");

const socket = new WebSocket(target.webSocketDebuggerUrl);
let commandId = 0;
const pending = new Map();

const command = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++commandId;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

const evaluate = async (expression) => {
  const response = await command("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (response.result.exceptionDetails) throw new Error(response.result.exceptionDetails.text);
  return response.result.result.value;
};

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  request.resolve(message);
});

const report = [];

for (const language of ["en", "ar"]) {
  await command("Page.navigate", { url: "http://localhost:3000/constellation" });
  await wait(700);
  await evaluate(`Array.from(document.querySelectorAll("button")).find((button) => button.textContent?.trim() === "${language === "en" ? "EN" : "AR"}")?.click()`);
  await wait(900);

  for (const width of [375, 768, 1280]) {
    await command("Emulation.setDeviceMetricsOverride", {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await wait(250);
    const result = await evaluate(`(() => {
      const page = document.querySelector('main > section > div.mx-auto.grid');
      const text = page?.children[0]?.getBoundingClientRect();
      const visual = page?.children[1]?.getBoundingClientRect();
      const root = document.querySelector('#root');
      return JSON.stringify({
        direction: document.documentElement.dir,
        noDocumentOverflow: document.documentElement.scrollWidth <= window.innerWidth,
        noRootOverflow: root ? root.scrollWidth <= window.innerWidth : false,
        textLeft: text?.left ?? null,
        visualLeft: visual?.left ?? null,
        twoColumnComposition: Boolean(text && visual && Math.abs(text.top - visual.top) < 2),
        expectedDesktopOrder: window.innerWidth < 1024 ? Boolean(text && visual) : Boolean(text && visual && (${language === "ar" ? "visual.left > text.left" : "visual.left < text.left"})),
        cardCount: document.querySelectorAll('a[href^="/watch/"]').length,
      });
    })()`);
    report.push({ language, width, ...JSON.parse(result) });
  }
}

console.log(JSON.stringify(report, null, 2));
socket.close();
