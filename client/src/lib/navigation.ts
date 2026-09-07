export const PRIMARY_NAVIGATION = [
  { href: "/", en: "Home", ar: "الرئيسية" },
  { href: "/collection", en: "Collection", ar: "المجموعة" },
  { href: "/stories", en: "Stories", ar: "القصص" },
  { href: "/about", en: "About", ar: "حول" },
] as const;

export const SHEIKH_GALLERY_NAVIGATION = {
  href: "/sheikh-gallery",
  en: "Sheikh Gallery",
  ar: "معرض سمو الشيخ",
} as const;

export const CONSTELLATION_NAVIGATION = {
  href: "/constellation",
  en: "Constellation of Time",
  ar: "كوكبة الزمن",
} as const;

export const DISCOVERY_NAVIGATION = {
  href: "/discovery",
  en: "Horology Discovery",
  ar: "اكتشاف الساعات",
} as const;

export const MORE_NAVIGATION = [
  SHEIKH_GALLERY_NAVIGATION,
  CONSTELLATION_NAVIGATION,
  DISCOVERY_NAVIGATION,
  { href: "/compare", en: "Compare", ar: "المقارنة" },
  { href: "/virtual-tour", en: "Virtual Tour", ar: "جولة افتراضية" },
  { href: "/advanced-search", en: "Advanced Search", ar: "بحث متقدم" },
  { href: "/timeline", en: "Timeline", ar: "الجدول الزمني" },
  { href: "/contact", en: "Contact", ar: "تواصل" },
] as const;

export function isMainNavigationActive(location: string, href: string) {
  if (href === "/collection" && location.startsWith("/watch/")) return true;
  return href === "/" ? location === "/" : location === href || location.startsWith(`${href}/`);
}
