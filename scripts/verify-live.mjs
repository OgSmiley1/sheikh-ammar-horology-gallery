const BASE = process.env.BASE_URL || "https://museum-current-production.up.railway.app";

const checks = [
  { path: "/healthz", expect: /ok/i },
  { path: "/", expect: /متحف الشيخ عمار|Sheikh Ammar/i },
  { path: "/collection/", expect: /المجموعة|Collection/i },
  { path: "/his-highness/", expect: /الشيخ عمار|Sheikh Ammar/i },
  { path: "/watches.json", expect: /"brand"|"name"/i },
  { path: "/app.js", expect: /data-i18n|translations|i18n/i },
  { path: "/styles.css", expect: /detail-layout|featured/i }
];

let failures = 0;

for (const check of checks) {
  const url = new URL(check.path, BASE);
  try {
    const response = await fetch(url, { redirect: "follow" });
    const body = await response.text();
    const ok = response.ok && check.expect.test(body);
    console.log(`${ok ? "PASS" : "FAIL"} ${response.status} ${url}`);
    if (!ok) failures++;
  } catch (error) {
    console.error(`FAIL request ${url}: ${error.message}`);
    failures++;
  }
}

if (failures) {
  console.error(`LIVE FAILURES: ${failures}`);
  process.exit(1);
}
console.log("RAILWAY V1 HTTP CHECK PASSED");
