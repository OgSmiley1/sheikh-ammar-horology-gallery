const ARABIC_RARITY_LABELS: Record<string, string> = {
  "Ultra Rare - Custom Creation": "نادرة للغاية — إبداع خاص",
  "Ultra Rare - Middle East Exclusive": "نادرة للغاية — إصدار حصري للشرق الأوسط",
  "Rare - Special Edition": "نادرة — إصدار خاص",
  "Ultra Rare - Limited Edition": "نادرة للغاية — إصدار محدود",
  "Ultra Rare - Natural Stone Dial": "نادرة للغاية — مينا من حجر طبيعي",
  "Ultra Rare - UAE Royal Commission": "نادرة للغاية — تكليف ملكي إماراتي",
  "Ultra Rare - Artist Collaboration": "نادرة للغاية — تعاون فني",
  "Ultra Rare - Final 5711A": "نادرة للغاية — آخر إصدار 5711A",
  "Ultra Rare - First Full Blue Ceramic": "نادرة للغاية — أول إصدار كامل من السيراميك الأزرق",
  "Ultra Rare": "نادرة للغاية",
  "ULTRA RARE": "نادرة للغاية",
  Rare: "نادرة",
  RARE: "نادرة",
  "Rare - Athlete Edition": "نادرة — إصدار الرياضي",
  Limited: "إصدار محدود",
  "Limited Edition": "إصدار محدود",
  "Limited 500": "إصدار محدود: 500 قطعة",
  "Limited Production": "إنتاج محدود",
  "Limited Annual Production": "إنتاج سنوي محدود",
  "Ultra Limited 35": "إصدار محدود للغاية: 35 قطعة",
  "Very Limited": "إصدار محدود جداً",
  "Extremely Limited": "إصدار محدود للغاية",
  "Common Luxury": "إصدار فاخر متاح",
  "One of a Kind": "قطعة فريدة",
  "Limited edition (50)": "إصدار محدود (50 قطعة)",
  "Limited Edition (50)": "إصدار محدود (50 قطعة)",
  "Limited edition (500)": "إصدار محدود (500 قطعة)",
  "Limited Edition (500)": "إصدار محدود (500 قطعة)",
  "Source-reviewed appearance lead": "ظهور علني موثق بالمصادر",
  "Special-request jade dial (auction reference)": "مينا يشم بطلب خاص (مرجع مزاد)",
  "Grand Complications": "مضاعفات كبرى",
};

export function localizeRarityLabel(rarity: string | undefined, language: "en" | "ar") {
  if (!rarity || language === "en") return rarity;
  return ARABIC_RARITY_LABELS[rarity] ?? "تصنيف أرشيفي";
}

export const localizeTimelineRarity = localizeRarityLabel;

/**
 * The chronology only aggregates a single, defensible published year. Records
 * carrying a range, concatenation, or unknown value remain in the archive but
 * are deliberately excluded rather than being inferred or altered.
 */
export function isSinglePublishedYear(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1800 && value <= 2100;
}
