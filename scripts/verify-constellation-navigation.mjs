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
  await command("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await command("Page.navigate", { url: "http://localhost:3000/constellation" });
  await wait(700);
  await evaluate(`Array.from(document.querySelectorAll("button")).find((button) => button.textContent?.trim() === "${language === "en" ? "EN" : "AR"}")?.click()`);
  await wait(250);
  await evaluate(`Array.from(document.querySelectorAll("button")).find((button) => button.textContent?.trim() === "${language === "en" ? "More" : "المزيد"}")?.click()`);
  await wait(150);
  const desktop = await evaluate(`JSON.stringify(Array.from(document.querySelectorAll('a[href="/constellation"]')).map((link) => ({ text: link.textContent?.trim(), visible: !!(link.offsetWidth || link.offsetHeight || link.getClientRects().length), direction: document.documentElement.dir })))`);
  report.push({ layout: "desktop", language, entries: JSON.parse(desktop) });

  await command("Emulation.setDeviceMetricsOverride", {
    width: 375,
    height: 812,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await wait(250);
  await evaluate(`Array.from(document.querySelectorAll("button")).find((button) => button.getAttribute("aria-label") === "${language === "en" ? "Open menu" : "فتح القائمة"}")?.click()`);
  await wait(150);
  const mobile = await evaluate(`JSON.stringify(Array.from(document.querySelectorAll('a[href="/constellation"]')).map((link) => ({ text: link.textContent?.trim(), visible: !!(link.offsetWidth || link.offsetHeight || link.getClientRects().length), direction: document.documentElement.dir })))`);
  report.push({ layout: "mobile", language, entries: JSON.parse(mobile) });
}

console.log(JSON.stringify(report, null, 2));
socket.close();
