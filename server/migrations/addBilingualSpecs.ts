/**
 * addBilingualSpecs migration — runs at server startup (idempotent).
 *
 * 1. ALTERs the watches table to add Arabic spec columns (if not present).
 * 2. Populates Arabic translations for all existing watches.
 */

import { getDb } from "../db";
import { sql } from "drizzle-orm";
import { watches } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

// ── Arabic translation maps ──────────────────────────────────────────────────

const materialMap: Record<string, string> = {
  "Titanium": "تيتانيوم",
  "Titanium / 18K Red Gold movement dial": "تيتانيوم / ميناء محرك ذهب أحمر 18 قيراط",
  "18K White Gold": "ذهب أبيض 18 قيراط",
  "18K White Gold, Diamond-set bezel & lugs": "ذهب أبيض 18 قيراط، إطار وأذنا مرصعان بالماس",
  "18K Red Gold": "ذهب أحمر 18 قيراط",
  "18K Yellow Gold": "ذهب أصفر 18 قيراط",
  "Platinum 950": "بلاتين 950",
  "Stainless Steel": "فولاذ مقاوم للصدأ",
  "Carbon TPT® / Titanium": "كاربون TPT® / تيتانيوم",
  "Carbon TPT® / TZP Black Ceramic": "كاربون TPT® / سيراميك أسود TZP",
  "Carbon TPT®": "كاربون TPT®",
  "Quartz TPT® — Italian flag colours": "كوارتز TPT® — ألوان العلم الإيطالي",
  "Quartz TPT®": "كوارتز TPT®",
  "Grade 5 Titanium": "تيتانيوم من الدرجة الخامسة",
  "Red Gold / Carbon TPT®": "ذهب أحمر / كاربون TPT®",
  "Blue Ceramic": "سيراميك أزرق",
  "Sapphire Crystal": "كريستال الياقوت",
  "Black Ceramic": "سيراميك أسود",
  "White Ceramic": "سيراميك أبيض",
  "Titanium / Carbon": "تيتانيوم / كاربون",
  "NTPT Carbon": "كاربون NTPT",
  "Rose Gold": "ذهب وردي",
  "18K Rose Gold": "ذهب وردي 18 قيراط",
};

const rarityMap: Record<string, string> = {
  "Unique — 1 of 1": "فريدة — قطعة واحدة",
  "Extremely Rare": "نادر للغاية",
  "Very Rare": "نادر جداً",
  "Very Rare — 500 pieces": "نادر جداً — 500 قطعة",
  "Very Rare — 150 pieces": "نادر جداً — 150 قطعة",
  "Very Rare — 30 pieces": "نادر جداً — 30 قطعة",
  "Very Rare — 50 pieces": "نادر جداً — 50 قطعة",
  "Very Rare — 100 pieces": "نادر جداً — 100 قطعة",
  "Rare": "نادر",
  "Ultra Rare — 25 pieces": "نادر بشكل استثنائي — 25 قطعة",
  "Ultra Rare — First Full Blue Ceramic": "نادر بشكل استثنائي — أول سيراميك أزرق كامل",
  "Ultra Rare — Custom Creation": "نادر بشكل استثنائي — إبداع مخصص",
  "Ultra Rare": "نادر بشكل استثنائي",
  "Limited — 30 pieces": "محدود — 30 قطعة",
  "Limited — 50 pieces": "محدود — 50 قطعة",
  "Limited — 100 pieces": "محدود — 100 قطعة",
  "Limited — 150 pieces": "محدود — 150 قطعة",
  "Limited — 300 pieces": "محدود — 300 قطعة",
  "Limited — 500 pieces": "محدود — 500 قطعة",
  "Limited — 25 pieces": "محدود — 25 قطعة",
};

/** Convert "40mm" or "44.5 x 49.94mm" → "40 مم" / "44.5 × 49.94 مم" */
function translateCaseSize(size: string): string {
  return size.replace(/(\d[\d.]*)\s*x\s*(\d[\d.]*)\s*mm/i, "$1 × $2 مم")
             .replace(/(\d[\d.]*)\s*mm/i, "$1 مم");
}

function lookupMaterial(mat: string | null): string | null {
  if (!mat) return null;
  return materialMap[mat] ?? mat;
}

function lookupRarity(rar: string | null): string | null {
  if (!rar) return null;
  return rarityMap[rar] ?? rar;
}

export async function addBilingualSpecs() {
  const db = await getDb();
  if (!db) {
    console.warn("[Migration] addBilingualSpecs: DB not available, skipping.");
    return;
  }

  // ── Step 1: Add new columns (idempotent — MySQL ignores duplicate column errors) ──
  try {
    await db.execute(sql`
      ALTER TABLE \`watches\`
        ADD COLUMN IF NOT EXISTS \`materialAr\` varchar(255),
        ADD COLUMN IF NOT EXISTS \`dialColorAr\` varchar(100),
        ADD COLUMN IF NOT EXISTS \`caseSizeAr\` varchar(50),
        ADD COLUMN IF NOT EXISTS \`movementAr\` varchar(255),
        ADD COLUMN IF NOT EXISTS \`complicationsAr\` text,
        ADD COLUMN IF NOT EXISTS \`waterResistanceAr\` varchar(50),
        ADD COLUMN IF NOT EXISTS \`rarityAr\` varchar(100)
    `);
    console.log("[Migration] addBilingualSpecs: columns ensured.");
  } catch (err: any) {
    // Already exist — safe to continue
    if (!err?.message?.includes("Duplicate column")) {
      console.error("[Migration] addBilingualSpecs: ALTER TABLE error:", err?.message);
    }
  }

  // ── Step 2: Populate Arabic translations for existing watches ──────────────
  const allWatches = await db.select({
    id: watches.id,
    material: watches.material,
    caseSize: watches.caseSize,
    rarity: watches.rarity,
    materialAr: watches.materialAr,
  }).from(watches);

  let updated = 0;
  for (const w of allWatches) {
    // Only update if materialAr is not yet populated
    if (w.materialAr) continue;

    const materialAr = lookupMaterial(w.material);
    const caseSizeAr = w.caseSize ? translateCaseSize(w.caseSize) : null;
    const rarityAr   = lookupRarity(w.rarity);

    await db.update(watches).set({
      materialAr:  materialAr  ?? undefined,
      caseSizeAr:  caseSizeAr  ?? undefined,
      rarityAr:    rarityAr    ?? undefined,
    }).where(eq(watches.id, w.id));

    updated++;
  }

  console.log(`[Migration] addBilingualSpecs: translated ${updated} watches.`);
}
