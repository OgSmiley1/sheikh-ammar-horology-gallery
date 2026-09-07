const routes = [
  "/",
  "/collection",
  "/collection/rolex",
  "/about",
  "/watch/rolex-daytona-diw-motley-carbon",
  "/compare",
  "/stories",
  "/virtual-tour",
  "/advanced-search",
  "/timeline",
  "/top10",
  "/sheikh-gallery",
  "/constellation",
  "/discovery",
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
  if (response.result.exceptionDetails) {
    const detail = response.result.exceptionDetails;
    throw new Error(`${detail.text}: ${detail.exception?.description || expression}`);
  }
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

await command("Page.navigate", { url: "http://localhost:3000/" });
await wait(1500);

const report = [];
const unintendedUiTerms = {
  ar: [
    "A legacy in time",
    "Collection Tools",
    "Advanced Search",
    "Horological Comparison",
    "Explore the Archive with Care",
    "Browse Records",
    "Stay Updated",
    "Subscribe for updates",
    "His Highness with Timepieces",
    "The Story",
    "Specifications",
  ],
  en: [
    "إرث من الزمن",
    "أدوات المجموعة",
    "البحث المتقدم",
    "مقارنة الساعات الفاخرة",
    "استكشف الأرشيف بتأنٍّ",
    "استكشف السجلات",
    "ابقَ على اطلاع بأحدث الإضافات",
    "صاحب السمو مع الساعات",
    "القصة",
    "المواصفات",
  ],
};
for (const route of routes) {
  for (const language of ["en", "ar"]) {
    for (const viewport of viewports) {
      await command("Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.mobile,
      });
      await command("Page.navigate", { url: `http://localhost:3000${route}` });
      await wait(350);
      await evaluate(`localStorage.setItem("language", "${language}")`);
      await command("Page.navigate", { url: `http://localhost:3000${route}` });
      await wait(1200);
      for (let attempt = 0; attempt < 6; attempt += 1) {
        const direction = await evaluate("document.documentElement?.dir || ''");
        if (direction === (language === "ar" ? "rtl" : "ltr")) break;
        await evaluate(`Array.from(document.querySelectorAll("button")).find((button) => button.textContent?.trim() === "${language === "ar" ? "AR" : "EN"}")?.click()`);
        await wait(300);
      }
      for (let attempt = 0; attempt < 20; attempt += 1) {
        const content = await evaluate("document.body.innerText.trim()");
        if (content.length >= 160 && !/Loading|جاري التحميل/.test(content)) break;
        await wait(300);
      }
      const result = JSON.parse(await evaluate(`JSON.stringify({
        direction: document.documentElement.dir,
        noDocumentOverflow: document.documentElement.scrollWidth <= window.innerWidth,
        noRootOverflow: (document.querySelector("#root")?.scrollWidth ?? Infinity) <= window.innerWidth,
        contentLength: document.body.innerText.trim().length,
        hasFatalError: /Something went wrong|Critical Error|حدث خطأ/i.test(document.body.innerText),
        unexpectedUiTerms: ${JSON.stringify(unintendedUiTerms)}[${JSON.stringify(language)}].filter((term) => document.body.innerText.includes(term)),
      })`));
      report.push({ route, language, viewport: viewport.name, ...result });
    }
  }
}

const failures = report.filter((entry) => !entry.noDocumentOverflow || !entry.noRootOverflow || entry.contentLength < 80 || entry.hasFatalError || entry.direction !== (entry.language === "ar" ? "rtl" : "ltr") || entry.unexpectedUiTerms.length > 0);
console.log(JSON.stringify({ report, failures }, null, 2));
socket.close();
if (failures.length) process.exitCode = 1;
