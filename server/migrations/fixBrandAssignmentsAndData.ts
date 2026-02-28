/**
 * Fix migration — runs at server startup (idempotent).
 * 1. Fixes RM 26-02 brand assignment: FP Journe → Richard Mille
 * 2. Adds the RM 26-02 Tourbillon Evil Eye with full correct data
 * 3. Updates watches that have missing / placeholder Arabic descriptions
 * 4. Removes breitling dependency from enrichWatchCollection by adding RM 26-02 here
 */
import { eq, or } from "drizzle-orm";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";

async function getBrandId(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  slug: string
): Promise<number | null> {
  const rows = await db
    .select({ id: schema.brands.id })
    .from(schema.brands)
    .where(eq(schema.brands.slug, slug))
    .limit(1);
  return rows.length ? rows[0].id : null;
}

export async function fixBrandAssignmentsAndData() {
  const db = await getDb();
  if (!db) {
    console.warn("[Migration] fixBrandAssignmentsAndData: DB not available, skipping.");
    return;
  }

  // ── 1. Fix RM 26-02 brand assignment ──────────────────────────────────────
  const rmBrandId = await getBrandId(db, "richard-mille");
  const fpjBrandId = await getBrandId(db, "fp-journe");

  if (rmBrandId && fpjBrandId) {
    // Find any RM 26-02 watches wrongly assigned to FP Journe
    const wrongBrandWatches = await db
      .select({ id: schema.watches.id, referenceNumber: schema.watches.referenceNumber })
      .from(schema.watches)
      .where(
        eq(schema.watches.brandId, fpjBrandId)
      );

    for (const w of wrongBrandWatches) {
      const refNum = (w.referenceNumber || "").toUpperCase();
      if (refNum.startsWith("RM")) {
        await db
          .update(schema.watches)
          .set({ brandId: rmBrandId })
          .where(eq(schema.watches.id, w.id));
        console.log(`[Migration] Fixed brand for watch id=${w.id} ref=${w.referenceNumber} → Richard Mille`);
      }
    }
  }

  // ── 2. Upsert RM 26-02 Tourbillon Evil Eye with complete correct data ──────
  if (rmBrandId) {
    const existing = await db
      .select({ id: schema.watches.id })
      .from(schema.watches)
      .where(eq(schema.watches.referenceNumber, "RM 26-02"))
      .limit(1);

    const rm2602Data: schema.InsertWatch = {
      brandId: rmBrandId,
      referenceNumber: "RM 26-02",
      nameEn: "Richard Mille RM 26-02 Tourbillon Evil Eye",
      nameAr: "ريتشارد ميل RM 26-02 توربيون العين الشريرة",
      slug: "richard-mille-rm-26-02-tourbillon-evil-eye",
      descriptionEn: "The RM 26-02 Tourbillon 'Evil Eye' is one of Richard Mille's most iconic and visually striking creations. Its White Gold case is set with black spinels forming the legendary evil-eye motif on the dial. Famously spotted on Ed Sheeran's wrist, this watch blends haute horlogerie with artistic symbolism at its finest.",
      descriptionAr: "تعدّ RM 26-02 توربيون 'العين الشريرة' واحدة من أكثر إبداعات ريتشارد ميل أيقونيةً وجاذبيةً بصرياً. تتزيّن علبتها من الذهب الأبيض بحجارة سبينيل سوداء تشكّل نقش 'العين الشريرة' الأسطوري على الميناء. شوهدت على معصم إد شيران الشهير، وتجمع هذه الساعة بين فن صناعة الساعات الراقية والرمزية الفنية في أبهى صورها.",
      storyEn: "Richard Mille created the RM 26-02 as a talisman — the evil eye motif, feared and revered across cultures from the Middle East to the Mediterranean, is rendered in black spinels against White Gold. The manual-winding flying tourbillon regulator is visible through the sapphire crystal, making this watch as technically breathtaking as it is artistically compelling. Ed Sheeran's public appearances wearing this piece elevated it to global icon status.",
      storyAr: "أنشأ ريتشارد ميل الـ RM 26-02 كتميمة حظ: نقش العين الشريرة المهابة والمُجلَّة عبر الثقافات من الشرق الأوسط إلى المتوسط، مُصوَّر بحجارة سبينيل سوداء على ذهب أبيض. التوربيون الطائر يدوي التعبئة مرئي من خلال الكريستال الياقوتي. ظهور إد شيران مرتدياً هذه الساعة علناً رفعها إلى مصافّ الأيقونات العالمية.",
      material: "White Gold with Black Spinels & Diamonds",
      dialColor: "Evil Eye motif — Black Spinels on White Gold",
      caseSize: "42.7 x 50 mm",
      movement: "Caliber RM 26-02 — Manual-winding Flying Tourbillon",
      complications: "Flying Tourbillon, Hours, Minutes",
      powerReserve: "42 hours",
      waterResistance: "50m",
      limitedEdition: true,
      productionQuantity: 30,
      yearReleased: 2014,
      retailPrice: 680000,
      marketValue: 950000,
      rarity: "Ultra Rare — 30 pieces",
      mainImageUrl: "/watches-collection/rm26-02-1674211731885_800x.webp",
      isFeatured: true,
      displayOrder: 9,
      isActive: true,
    };

    if (existing.length) {
      await db
        .update(schema.watches)
        .set(rm2602Data)
        .where(eq(schema.watches.id, existing[0].id));
      console.log("[Migration] Updated RM 26-02 Evil Eye with correct data and brand");
    } else {
      await db.insert(schema.watches).values(rm2602Data);
      console.log("[Migration] Inserted RM 26-02 Evil Eye");
    }
  }

  // ── 3. Fill Arabic descriptions for RM 65-01 (image was RM26-02, fix image too) ─
  if (rmBrandId) {
    const rm6501 = await db
      .select({ id: schema.watches.id })
      .from(schema.watches)
      .where(eq(schema.watches.referenceNumber, "RM 65-01"))
      .limit(1);

    if (rm6501.length) {
      await db
        .update(schema.watches)
        .set({
          mainImageUrl: "/watches-collection/rm65-01-mclaren-1674211731886_800x.webp",
          nameAr: "ريتشارد ميل RM 65-01 ماكلارين كرونوغراف الثواني المنقسمة",
          descriptionAr: "طُوِّرت بالشراكة مع ماكلارين، تحتضن RM 65-01 كرونوغراف الثواني المنقسمة في غلاف Carbon TPT® مقاس 44.5 مم بوزن 38.3 جرام — من أكثر ساعات المعصم طموحاً من الناحية التقنية على الإطلاق.",
          storyAr: "تُعدّ RM 65-01 أكثر محركات ريتشارد ميل الأوتوماتيكية تعقيداً: عقارب الثواني المنقسمة وعجلة العمود والقابض الرأسي مرئية من خلال الميناء الهيكلي. ألوان ماكلارين البرتقالية تستحضر أسطورة سباقات الخليج.",
        })
        .where(eq(schema.watches.id, rm6501[0].id));
      console.log("[Migration] Fixed RM 65-01 Arabic data");
    }
  }

  // ── 4. Update RM 68-01 with correct display order (after RM 26-02) ─────────
  if (rmBrandId) {
    await db
      .update(schema.watches)
      .set({ displayOrder: 10 })
      .where(eq(schema.watches.referenceNumber, "RM 67-02"));

    await db
      .update(schema.watches)
      .set({ displayOrder: 11 })
      .where(eq(schema.watches.referenceNumber, "RM 68-01"));
  }

  console.log("[Migration] fixBrandAssignmentsAndData: complete.");
}
