import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t, isRTL, language } = useLanguage();

  const navLinks = [
    { href: "/", labelEn: "Home", labelAr: "الرئيسية" },
    { href: "/collections", labelEn: "Collection", labelAr: "المجموعة" },
    { href: "/sheikh-gallery", labelEn: "Gallery", labelAr: "معرض الصور" },
    { href: "/compare", labelEn: "Compare", labelAr: "المقارنة" },
    { href: "/top10", labelEn: "Top 10", labelAr: "أفضل ١٠" },
    { href: "/timeline", labelEn: "Timeline", labelAr: "الجدول الزمني" },
    { href: "/stories", labelEn: "Stories", labelAr: "القصص" },
  ];

  return (
    <footer
      className="relative border-t border-[#d4af37]/20 mt-20"
      style={{ background: "rgba(212, 175, 55, 0.03)" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Top ornament */}
      <div className="flex items-center justify-center gap-4 pt-10 pb-4">
        <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#d4af37]/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/60 rotate-45" />
        <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#d4af37]/40" />
      </div>

      <div className="container pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border border-[#d4af37]/40 bg-[#d4af37]/08 group-hover:border-[#d4af37]/70 transition-all">
                <span
                  className="text-sm font-bold"
                  style={{
                    background: "linear-gradient(135deg, #C9A961 0%, #D4B896 50%, #A67C52 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  SA
                </span>
              </div>
              <div>
                <p
                  className="text-sm font-semibold text-[#d4af37]"
                  style={{ fontFamily: isRTL ? undefined : "Playfair Display, serif" }}
                >
                  {isRTL ? "الشيخ عمار بن حميد النعيمي" : "Sheikh Ammar"}
                </p>
                <p className="text-xs text-[#f5f2e8]/40">
                  {isRTL ? "المجموعة الملكية" : "Royal Collection"}
                </p>
              </div>
            </Link>
            <p className="text-xs text-[#f5f2e8]/35 leading-relaxed max-w-xs text-center md:text-start">
              {isRTL
                ? "مجموعة من أرقى الساعات الفاخرة في العالم العربي."
                : "One of the Arab world's most distinguished private horology collections."}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] text-[#d4af37]/50 tracking-[0.4em] uppercase font-medium mb-1">
              {isRTL ? "التنقل" : "Navigate"}
            </p>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-[#f5f2e8]/50 hover:text-[#d4af37] transition-colors"
                >
                  {isRTL ? link.labelAr : link.labelEn}
                </Link>
              ))}
            </nav>
          </div>

          {/* Provenance */}
          <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-end">
            <p className="text-[10px] text-[#d4af37]/50 tracking-[0.4em] uppercase font-medium mb-1">
              {isRTL ? "الهوية" : "Provenance"}
            </p>
            <p
              className="text-sm font-semibold text-[#f5f2e8]/70"
              style={{ fontFamily: isRTL ? undefined : "Playfair Display, serif" }}
            >
              {isRTL ? "الشيخ عمار بن حميد النعيمي" : "Sheikh Ammar bin Humaid Al Nuaimi"}
            </p>
            <p className="text-xs text-[#f5f2e8]/40">
              {isRTL ? "ولي عهد إمارة عجمان" : "Crown Prince of Ajman"}
            </p>
            <p className="text-xs text-[#f5f2e8]/30">
              {isRTL ? "الإمارات العربية المتحدة" : "United Arab Emirates"}
            </p>
          </div>
        </div>

        {/* Bottom divider + copyright */}
        <div className="border-t border-[#d4af37]/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-[#f5f2e8]/25">
            © {new Date().getFullYear()}{" "}
            {isRTL ? "مجموعة الشيخ عمار الملكية" : "Sheikh Ammar Royal Collection"}.{" "}
            {isRTL ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
          <Link
            href="/admin/login"
            className="text-[11px] text-[#f5f2e8]/20 hover:text-[#d4af37]/50 transition-colors"
          >
            {isRTL ? "لوحة الإدارة" : "Admin"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
