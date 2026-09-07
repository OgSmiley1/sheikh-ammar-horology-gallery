export const DIW_DAYTONA_SLUG = "rolex-daytona-diw-motley-carbon";

const arabicSpecifications: Record<string, string> = {
  "DIW Motley 3S / bespoke": "DIW Motley 3S / تصميم خاص",
  "Carbon fibre — DIW custom case": "ألياف كربون — علبة مخصصة من DIW",
  "40 mm": "40 مم",
  "Rolex Calibre 4130, automatic chronograph": "رولكس كاليبر 4130، كرونوغراف أوتوماتيكي",
  "Black paint-splash dial with green, yellow and red chronograph counters": "مينا أسود بتأثيرات لونية فنية مع عدادات كرونوغراف بالأخضر والأصفر والأحمر",
  "50 m": "50 متراً",
  "Chronograph; central seconds; 30-minute and 12-hour counters": "كرونوغراف؛ ثوانٍ مركزية؛ عداد 30 دقيقة وعداد 12 ساعة",
};

export function localizeDIWDaytonaSpecification(value: string | null, language: "en" | "ar") {
  if (!value || language !== "ar") return value;
  return arabicSpecifications[value] || value;
}

export function localizeDIWDaytonaRarity(value: string | null, language: "en" | "ar") {
  if (!value || language !== "ar") return value;
  return value === "Limited Edition" ? "إصدار محدود" : value;
}
