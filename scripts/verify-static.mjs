import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("docs");

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

const files = await walk(ROOT);
const htmlFiles = files.filter(f => f.endsWith(".html"));
const existing = new Set(files.map(f => path.normalize(f)));
let failures = 0;

function fail(message) {
  failures++;
  console.error("FAIL:", message);
}

function cleanRef(value) {
  return value.split("#")[0].split("?")[0].trim();
}

for (const file of htmlFiles) {
  const html = await fs.readFile(file, "utf8");
  const refs = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)].map(m => m[1]);

  for (const raw of refs) {
    if (!raw || raw.startsWith("#") || raw.startsWith("http://") ||
        raw.startsWith("https://") || raw.startsWith("mailto:") ||
        raw.startsWith("tel:") || raw.startsWith("data:") ||
        raw.startsWith("javascript:")) continue;

    const ref = cleanRef(raw);
    if (!ref) continue;
    const absolute = path.normalize(path.resolve(path.dirname(file), ref));
    if (!existing.has(absolute)) fail(`${path.relative(ROOT, file)} -> missing ${raw}`);
  }

  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) fail(`${path.relative(ROOT, file)} duplicate id="${id}"`);
    seen.add(id);
  }
}

const folios = htmlFiles.filter(f => f.includes(`${path.sep}watch${path.sep}`));
for (const file of folios) {
  const html = await fs.readFile(file, "utf8");
  const story = html.indexOf('class="story"');
  const spec = html.indexOf('class="spec"');
  if (story === -1) fail(`${path.relative(ROOT, file)} missing editorial story`);
  if (spec === -1) fail(`${path.relative(ROOT, file)} missing technical record`);
  if (story !== -1 && spec !== -1 && story > spec) {
    fail(`${path.relative(ROOT, file)} technical record appears before story`);
  }
}

console.log(`HTML pages: ${htmlFiles.length}`);
console.log(`Watch folios: ${folios.length}`);
console.log(`Failures: ${failures}`);
if (failures) process.exit(1);
console.log("STATIC V1 CHECK PASSED");
