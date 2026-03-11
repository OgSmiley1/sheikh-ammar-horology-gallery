#!/usr/bin/env node
/**
 * QA Script: Check for duplicate Sheikh/watch image usage in Top 10 data
 * Usage: node scripts/check-top10-duplicates.js
 */

const fs = require("fs");
const path = require("path");

const dataFile = path.join(process.cwd(), "top5-watches-data.json");

if (!fs.existsSync(dataFile)) {
  console.error("❌ Could not find top5-watches-data.json");
  process.exit(1);
}

let raw;
try {
  raw = JSON.parse(fs.readFileSync(dataFile, "utf8"));
} catch (e) {
  console.error("❌ Could not parse top5-watches-data.json:", e.message);
  process.exit(1);
}

const data = raw.top5Watches || raw;

if (!Array.isArray(data)) {
  console.error("❌ Expected an array of watches in the data file.");
  process.exit(1);
}

console.log(`Checking ${data.length} watch entries for duplicate images...\n`);

const sheikhMap = new Map();
const watchMap = new Map();
let hasDupes = false;

for (const item of data) {
  const rank = item.rank || data.indexOf(item) + 1;

  if (item.sheikhImage) {
    const count = sheikhMap.get(item.sheikhImage) || 0;
    sheikhMap.set(item.sheikhImage, count + 1);
    if (count >= 1) {
      hasDupes = true;
      console.log(`⚠️  Duplicate Sheikh image at rank #${rank}: ${item.sheikhImage}`);
    }
  } else {
    console.log(`⚠️  Missing Sheikh image at rank #${rank}: ${item.brand} ${item.model}`);
  }

  if (item.watchImage) {
    const count = watchMap.get(item.watchImage) || 0;
    watchMap.set(item.watchImage, count + 1);
    if (count >= 1) {
      hasDupes = true;
      console.log(`⚠️  Duplicate watch image at rank #${rank}: ${item.watchImage}`);
    }
  } else {
    console.log(`⚠️  Missing watch image at rank #${rank}: ${item.brand} ${item.model}`);
  }

  // Warn if sheikh image and watch image are the same
  if (item.sheikhImage && item.watchImage && item.sheikhImage === item.watchImage) {
    hasDupes = true;
    console.log(`⚠️  Sheikh and watch image are identical at rank #${rank}: ${item.sheikhImage}`);
  }
}

if (!hasDupes) {
  console.log("✅ No duplicate Sheikh/watch image usage found in Top 10 data.");
} else {
  console.log("\n❌ Please fix the duplicate images listed above.");
}

// Summary
console.log(`\nSummary: ${data.length} watches checked.`);
console.log(`  Unique Sheikh images: ${sheikhMap.size}`);
console.log(`  Unique watch images: ${watchMap.size}`);
