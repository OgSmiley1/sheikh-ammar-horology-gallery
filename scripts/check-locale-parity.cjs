#!/usr/bin/env node
/**
 * QA Script: Check that en.json and ar.json have the same keys (locale parity)
 * Usage: node scripts/check-locale-parity.js
 */

const fs = require("fs");
const path = require("path");

const EN_FILE = path.join(process.cwd(), "client", "src", "i18n", "locales", "en.json");
const AR_FILE = path.join(process.cwd(), "client", "src", "i18n", "locales", "ar.json");

function flattenKeys(obj, prefix = "") {
  const keys = [];
  for (const key of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      keys.push(...flattenKeys(obj[key], full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

const en = JSON.parse(fs.readFileSync(EN_FILE, "utf8"));
const ar = JSON.parse(fs.readFileSync(AR_FILE, "utf8"));

const enKeys = new Set(flattenKeys(en));
const arKeys = new Set(flattenKeys(ar));

const missingInAr = [...enKeys].filter((k) => !arKeys.has(k));
const missingInEn = [...arKeys].filter((k) => !enKeys.has(k));

let hasIssues = false;

if (missingInAr.length > 0) {
  hasIssues = true;
  console.log(`\n❌ Keys present in en.json but MISSING in ar.json (${missingInAr.length}):`);
  for (const k of missingInAr) console.log(`   ${k}`);
}

if (missingInEn.length > 0) {
  hasIssues = true;
  console.log(`\n⚠️  Keys present in ar.json but MISSING in en.json (${missingInEn.length}):`);
  for (const k of missingInEn) console.log(`   ${k}`);
}

if (!hasIssues) {
  console.log(`✅ en.json and ar.json are in parity — both have ${enKeys.size} keys.`);
} else {
  console.log(`\nTotal EN keys: ${enKeys.size} | Total AR keys: ${arKeys.size}`);
}
