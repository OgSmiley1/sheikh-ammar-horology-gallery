import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { language, isRTL } = useLanguage();
  const navItems = [
    { href: "/collection", en: "Collection", ar: "المجموعة" },
    { href: "/top10", en: "Highlights", ar: "الأبرز" },
    { href: "/sheikh-gallery", en: "The Gallery", ar: "المعرض" },
    { href: "/about", en: "The Patron", ar: "عن صاحب السمو" },
    { href: "/contact", en: "Contact", ar: "تواصل" },
  ];

  return (
    <footer className="border-t border-primary/20 bg-card/60" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-6 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center">
          <span className="ornament-line">
            {language === "ar" ? "إرث من الزمن" : "A legacy in time"}
          </span>
          <p className="max-w-xl text-2xl leading-relaxed text-foreground sm:text-3xl" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>
            {language === "ar"
              ? "أرشيف تحريري يوثق الساعات التي ظهرت علناً، بحرفية ودقة ومسؤولية في الإسناد."
              : "An editorial archive documenting publicly observed timepieces with craft, accuracy, and care for attribution."}
          </p>
          <nav className={`flex flex-wrap justify-center gap-x-6 gap-y-3 ${isRTL ? "flex-row-reverse" : ""}`} aria-label={language === "ar" ? "تذييل الموقع" : "Footer navigation"}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-[0.68rem] font-bold tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary">
                {language === "ar" ? item.ar : item.en}
              </Link>
            ))}
            <a
              href="https://www.instagram.com/aj.ammar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.68rem] font-bold tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary"
            >
              {language === "ar" ? "إنستغرام" : "Instagram"}
            </a>
          </nav>
          <p className="text-xs text-muted-foreground/75">
            © {new Date().getFullYear()} {language === "ar" ? "مجموعة الشيخ عمار بن حميد النعيمي" : "Sheikh Ammar bin Humaid Al Nuaimi Collection"}
          </p>
        </div>
      </div>
    </footer>
  );
}
