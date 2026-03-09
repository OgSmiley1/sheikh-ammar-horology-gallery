#!/usr/bin/env node
/**
 * QA Script: Find hardcoded English UI strings that should be translated
 * Usage: node scripts/find-hardcoded-ui.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(process.cwd(), "client", "src");
const TARGET_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"];

// Phrases that should be using t() keys instead of hardcoded strings
const SUSPICIOUS = [
  "View Details",
  "All Watches",
  "All Brands",
  "Case Size",
  "Specifications",
  "The Story",
  "Loading...",
  "Top 10 Timepieces",
  "Horological Comparison",
  "Price on Request",
  "Back to Collection",
  "Water Resistance",
  "Power Reserve",
  "Market Value",
  "Retail Price",
  "Year Released",
  "Limited Edition",
  "Ultra Rare",
  "Go Home",
  "Page Not Found",
  "Compare Watches",
  "Explore Collection",
];

// Files/directories to skip
const SKIP_DIRS = ["node_modules", ".git", "dist", "build", "ui", "__tests__"];
const SKIP_FILES = ["LanguageContext.tsx", "en.json", "ar.json"];

function walk(dir, results = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, results);
    } else if (
      TARGET_EXTENSIONS.includes(path.extname(entry.name)) &&
      !SKIP_FILES.includes(entry.name)
    ) {
      results.push(full);
    }
  }
  return results;
}

const files = walk(ROOT);
const findings = [];

for (const file of files) {
  let content;
  try {
    content = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }
  for (const phrase of SUSPICIOUS) {
    // Only flag if it's a string literal (inside quotes), not a comment
    const regex = new RegExp(`["'\`]${phrase}["'\`]`, "g");
    if (regex.test(content)) {
      findings.push({ file: path.relative(process.cwd(), file), phrase });
    }
  }
}

if (findings.length === 0) {
  console.log("✅ No suspicious hardcoded UI phrases found.");
} else {
  console.log(`⚠️  Found ${findings.length} potential hardcoded UI string(s):\n`);
  for (const f of findings) {
    console.log(`  "${f.phrase}" in ${f.file}`);
  }
  console.log("\nThese should use t() keys from the locale JSON files.");
}
