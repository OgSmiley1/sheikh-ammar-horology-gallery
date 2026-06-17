import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { t, language, isRTL } = useLanguage();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{ background: "oklch(0.12 0.01 40)" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Dot texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle, #d4af37 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden text-center p-10"
        style={{
          background: "rgba(17, 20, 26, 0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(212, 175, 55, 0.15)",
          boxShadow: "0 28px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.06)",
        }}
      >
        {/* Corner accents */}
        <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-[#d4af37]/30 pointer-events-none" />
        <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-[#d4af37]/30 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-[#d4af37]/30 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-[#d4af37]/30 pointer-events-none" />

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full animate-pulse"
              style={{ background: "rgba(212,175,55,0.12)" }}
            />
            <AlertCircle className="relative h-14 w-14 text-gold-500" />
          </div>
        </div>

        {/* Ornament */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/40" />
          <p
            className="text-[4rem] font-bold leading-none"
            style={{
              background: "linear-gradient(135deg, #C9A961 0%, #D4B896 50%, #A67C52 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "Playfair Display, Georgia, serif",
            }}
          >
            404
          </p>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/40" />
        </div>

        <h2
          className={`text-[#f5f2e8] mb-3 ${language === "ar" ? "font-arabic" : ""}`}
          style={{
            fontFamily: isRTL ? undefined : "Playfair Display, Georgia, serif",
            fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
            fontWeight: 600,
          }}
        >
          {t("errors.404Title")}
        </h2>

        <p
          className={`text-[#f5f2e8]/45 mb-8 leading-relaxed text-sm ${language === "ar" ? "font-arabic" : ""}`}
        >
          {t("errors.404Body")}
        </p>

        <button
          onClick={handleGoHome}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg font-semibold transition-all duration-300 text-sm"
          style={{
            background: "#d4af37",
            color: "#0a0a0a",
            boxShadow: "0 4px 20px rgba(212,175,55,0.3)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 30px rgba(212,175,55,0.45)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(212,175,55,0.3)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          <Home className="w-4 h-4" />
          <span className={language === "ar" ? "font-arabic" : ""}>{t("common.goHome")}</span>
        </button>
      </div>
    </div>
  );
}
