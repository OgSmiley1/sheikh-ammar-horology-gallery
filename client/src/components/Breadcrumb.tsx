import { Link, useLocation } from "wouter";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BreadcrumbItem {
  label: string;
  labelAr: string;
  href: string;
}

const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
  "/collection": [
    { label: "Home", labelAr: "الرئيسية", href: "/" },
    { label: "Collection", labelAr: "المجموعة", href: "/collection" },
  ],
  "/compare": [
    { label: "Home", labelAr: "الرئيسية", href: "/" },
    { label: "Compare", labelAr: "المقارنة", href: "/compare" },
  ],
  "/stories": [
    { label: "Home", labelAr: "الرئيسية", href: "/" },
    { label: "Stories", labelAr: "القصص", href: "/stories" },
  ],
  "/virtual-tour": [
    { label: "Home", labelAr: "الرئيسية", href: "/" },
    { label: "Virtual Tour", labelAr: "جولة افتراضية", href: "/virtual-tour" },
  ],
  "/advanced-search": [
    { label: "Home", labelAr: "الرئيسية", href: "/" },
    { label: "Advanced Search", labelAr: "بحث متقدم", href: "/advanced-search" },
  ],
  "/timeline": [
    { label: "Home", labelAr: "الرئيسية", href: "/" },
    { label: "Timeline", labelAr: "الجدول الزمني", href: "/timeline" },
  ],
  "/about": [
    { label: "Home", labelAr: "الرئيسية", href: "/" },
    { label: "About", labelAr: "حول", href: "/about" },
  ],
  "/sheikh-gallery": [
    { label: "Home", labelAr: "الرئيسية", href: "/" },
    { label: "Sheikh Gallery", labelAr: "معرض الشيخ", href: "/sheikh-gallery" },
  ],
  "/discovery": [
    { label: "Home", labelAr: "الرئيسية", href: "/" },
    { label: "Horology Discovery", labelAr: "اكتشاف الساعات", href: "/discovery" },
  ],
};

export function Breadcrumb() {
  const [location] = useLocation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  // Get breadcrumb items for current path
  let items = breadcrumbMap[location] || [];

  // Handle watch detail pages
  if (location.startsWith("/watch/")) {
    const watchSlug = location.split("/").pop();
    items = [
      { label: "Home", labelAr: "الرئيسية", href: "/" },
      { label: "Collection", labelAr: "المجموعة", href: "/collection" },
      { label: watchSlug || "Watch", labelAr: "الساعة", href: location },
    ];
  }

  // Handle brand collection pages
  if (location.startsWith("/collection/")) {
    const brandSlug = location.split("/").pop();
    items = [
      { label: "Home", labelAr: "الرئيسية", href: "/" },
      { label: "Collection", labelAr: "المجموعة", href: "/collection" },
      { label: brandSlug || "Brand", labelAr: "العلامة التجارية", href: location },
    ];
  }

  // Don't show breadcrumb on home page
  if (location === "/" || items.length === 0) {
    return null;
  }

  return (
    <nav
      className={`flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground bg-card/50 border-b border-border ${
        isRTL ? "flex-row-reverse" : ""
      }`}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <div key={item.href} className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          {index > 0 && (
            <ChevronRight
              size={16}
              className={`text-muted-foreground/50 ${isRTL ? "rotate-180" : ""}`}
            />
          )}
          {index === items.length - 1 ? (
            <span className="text-foreground font-medium">
              {isRTL ? item.labelAr : item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-primary hover:text-primary/80 transition-colors hover:underline"
            >
              {isRTL ? item.labelAr : item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
