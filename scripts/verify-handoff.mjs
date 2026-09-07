import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requiredFiles = [
  "README.md",
  "package.json",
  "todo.md",
  "client/src/pages/Home.tsx",
  "client/src/pages/Collection.tsx",
  "client/src/pages/WatchDetail.tsx",
  "client/src/pages/ConstellationOfTime.tsx",
  "client/src/components/WatchMedia.tsx",
  "client/src/components/ImageGallery.tsx",
  "server/db.ts",
  "server/routers.ts",
  "server/_core/index.ts",
  "drizzle/schema.ts",
  "docs/CLAUDE_CODE_HANDOFF.md",
];

const failures = [];
for (const relativePath of requiredFiles) {
  if (!existsSync(join(root, relativePath))) failures.push(`Missing required file: ${relativePath}`);
}

const read = (relativePath) => readFileSync(join(root, relativePath), "utf8");
if (existsSync(join(root, "client/src/components/WatchMedia.tsx"))) {
  const watchMedia = read("client/src/components/WatchMedia.tsx");
  for (const token of ["project", "archive", "language"]) {
    if (!watchMedia.toLowerCase().includes(token)) {
      failures.push(`WatchMedia is missing expected contract token: ${token}`);
    }
  }
}

if (existsSync(join(root, "client/src/pages/Home.tsx"))) {
  const home = read("client/src/pages/Home.tsx");
  for (const token of ["PRIVATE HOROLOGY MUSEUM", "متحف الساعات الخاص", "Enter the story", "ادخل إلى الحكاية"]) {
    if (!home.includes(token)) failures.push(`Homepage ceremonial token not found: ${token}`);
  }
}

if (existsSync(join(root, "client/src/pages/ConstellationOfTime.tsx"))) {
  const constellation = read("client/src/pages/ConstellationOfTime.tsx");
  if (!constellation.includes("artisans-de-geneve-andrea-pirlo-rolex-submariner")) {
    failures.push("Constellation is missing the supplied Artisans de Geneve museum exhibit slug.");
  }
}

const todo = existsSync(join(root, "todo.md")) ? read("todo.md") : "";
const unchecked = todo.match(/^- \[ \]/gm) ?? [];
if (unchecked.length > 0) failures.push(`todo.md still contains ${unchecked.length} unchecked item(s).`);

if (failures.length) {
  console.error("Handoff validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Handoff validation passed: ${requiredFiles.length} required files, museum opening contracts, Constellation exhibit linkage, and TODO completion are present.`);
