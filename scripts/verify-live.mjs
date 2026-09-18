const BASE = process.env.BASE_URL || "https://museum-current-production.up.railway.app";
const paths = [
  "/healthz", "/", "/index.html", "/collection.html", "/exhibition.html",
  "/films.html", "/patron.html", "/timeline.html",
  "/watch/rolex-daytona-6263-quraysh.html"
];

let failures = 0;

for (const pathname of paths) {
  const url = new URL(pathname, BASE);
  try {
    const response = await fetch(url, { redirect: "follow" });
    const body = pathname === "/healthz" ? "" : await response.text();
    console.log(`${response.ok ? "PASS" : "FAIL"} ${response.status} ${url}`);
    if (!response.ok) failures++;
    if (body && /cannot get|not found|application error/i.test(body)) {
      console.error(`FAIL content check: ${url}`);
      failures++;
    }
  } catch (error) {
    console.error(`FAIL request ${url}: ${error.message}`);
    failures++;
  }
}

if (failures) {
  console.error(`LIVE FAILURES: ${failures}`);
  process.exit(1);
}
console.log("RAILWAY HTTP V1 CHECK PASSED");
