/**
 * Shared constants for the Sheikh Ammar Horology Gallery
 * Includes bilingual content, branding, and configuration
 */

export const SITE_CONFIG = {
  titleEn: "Sheikh Ammar bin Humaid Al Nuaimi - Royal Horology Collection",
  titleAr: "الشيخ عمار بن حميد النعيمي - المجموعة الملكية للساعات",
  descriptionEn: "Explore the extraordinary watch collection of His Highness Sheikh Ammar bin Humaid Al Nuaimi, Crown Prince of Ajman, featuring rare timepieces from the world's finest watchmakers.",
  descriptionAr: "استكشف المجموعة الاستثنائية للساعات الفاخرة لسمو الشيخ عمار بن حميد النعيمي، ولي عهد إمارة عجمان، والتي تضم قطعاً نادرة من أرقى صانعي الساعات في العالم.",
} as const;

export const SHEIKH_INFO = {
  nameEn: "Sheikh Ammar bin Humaid Al Nuaimi",
  nameAr: "الشيخ عمار بن حميد النعيمي",
  titleEn: "Crown Prince of Ajman",
  titleAr: "ولي عهد إمارة عجمان",
  bioEn: "His Highness Sheikh Ammar bin Humaid Al Nuaimi is the Crown Prince of Ajman and Chairman of the Ajman Executive Council. A visionary leader and passionate collector of haute horlogerie, his collection represents some of the finest and rarest timepieces ever created.",
  bioAr: "سمو الشيخ عمار بن حميد النعيمي هو ولي عهد إمارة عجمان ورئيس المجلس التنفيذي لإمارة عجمان. قائد صاحب رؤية وجامع شغوف لفن صناعة الساعات الراقية، تمثل مجموعته بعضاً من أفضل وأندر القطع الزمنية التي تم إنشاؤها على الإطلاق.",
} as const;

export const NAV_ITEMS = {
  home: { en: "Home", ar: "الرئيسية" },
  collection: { en: "Collection", ar: "المجموعة" },
  brands: { en: "Brands", ar: "العلامات التجارية" },
  about: { en: "About", ar: "عن سموه" },
  admin: { en: "Admin", ar: "لوحة التحكم" },
} as const;

export const COLLECTION_INTRO = {
  titleEn: "A Legacy of Horological Excellence",
  titleAr: "إرث من التميز في صناعة الساعات",
  descriptionEn: "This curated collection showcases over 30 exceptional timepieces from the world's most prestigious watchmakers, including Patek Philippe, Richard Mille, F.P. Journe, Audemars Piguet, and Rolex. Each watch tells a story of craftsmanship, innovation, and timeless elegance.",
  descriptionAr: "تعرض هذه المجموعة المنتقاة أكثر من 30 قطعة استثنائية من أرقى صانعي الساعات في العالم، بما في ذلك باتيك فيليب، ريتشارد ميل، إف بي جورن، أوديمار بيغيه، ورولكس. كل ساعة تحكي قصة من الحرفية والابتكار والأناقة الخالدة.",
} as const;

export const WATCH_CATEGORIES = {
  complications: { en: "Complications", ar: "التعقيدات" },
  material: { en: "Material", ar: "المادة" },
  movement: { en: "Movement", ar: "الحركة" },
  caseSize: { en: "Case Size", ar: "حجم العلبة" },
  dialColor: { en: "Dial Color", ar: "لون القرص" },
  waterResistance: { en: "Water Resistance", ar: "مقاومة الماء" },
  powerReserve: { en: "Power Reserve", ar: "احتياطي الطاقة" },
  limitedEdition: { en: "Limited Edition", ar: "إصدار محدود" },
  yearReleased: { en: "Year Released", ar: "سنة الإصدار" },
  retailPrice: { en: "Retail Price", ar: "السعر بالتجزئة" },
  marketValue: { en: "Market Value", ar: "القيمة السوقية" },
  rarity: { en: "Rarity", ar: "الندرة" },
} as const;

export const ADMIN_CONFIG = {
  username: "MOATH",
  // Password will be hashed: MOATH123
} as const;

export const COLORS = {
  primary: "#C9A961", // Royal Gold
  secondary: "#A67C52", // Deep Bronze
  accent: "#D4B896", // Warm Beige
  dark: "#1a1a1a", // Deep Black
  light: "#F5F0E8", // Cream
} as const;

export const ARABIC_FONT = "'Noto Naskh Arabic', 'Amiri', serif";
export const ENGLISH_FONT = "'Playfair Display', 'Cormorant Garamond', serif";

export type Language = "en" | "ar";
