const routes = [
  "/admin/login",
  "/admin/login-mvp",
  "/admin/dashboard-mvp",
  "/admin/dashboard",
  "/admin/watches",
  "/admin/subscribers",
  "/admin/chatgpt",
];
const viewports = [
  { name: "mobile", width: 390, height: 844, mobile: true },
  { name: "desktop", width: 1280, height: 900, mobile: false },
];
const targets = await fetch("http://127.0.0.1:9222/json").then((response) => response.json());
const target = targets.find((entry) => entry.type === "page" && entry.url.includes("localhost:3000")) ?? targets.find((entry) => entry.type === "page");

if (!target?.webSocketDebuggerUrl) throw new Error("No browser page target is available for verification.");

const socket = new WebSocket(target.webSocketDebuggerUrl);
let commandId = 0;
const pending = new Map();
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
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
for (const route of routes) {
  for (const viewport of viewports) {
    await command("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.mobile,
    });
    await command("Page.navigate", { url: `http://localhost:3000${route}` });
    await wait(900);
    const result = JSON.parse(await evaluate(`JSON.stringify({
      noDocumentOverflow: document.documentElement.scrollWidth <= window.innerWidth,
      noRootOverflow: (document.querySelector("#root")?.scrollWidth ?? Infinity) <= window.innerWidth,
      contentLength: document.body.innerText.trim().length,
      hasFatalError: /Something went wrong|Critical Error|حدث خطأ/i.test(document.body.innerText),
    })`));
    report.push({ route, viewport: viewport.name, ...result });
  }
}

const failures = report.filter((entry) => !entry.noDocumentOverflow || !entry.noRootOverflow || entry.contentLength < 80 || entry.hasFatalError);
console.log(JSON.stringify({ report, failures }, null, 2));
socket.close();
if (failures.length) process.exitCode = 1;
