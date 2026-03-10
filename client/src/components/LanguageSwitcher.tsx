import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center border border-primary/30 rounded-md overflow-hidden text-xs font-bold">
      <button
        onClick={() => setLanguage("ar")}
        className={`px-3 py-1.5 transition-colors font-arabic ${
          language === "ar"
            ? "bg-primary text-black"
            : "text-foreground/70 hover:bg-primary/10"
        }`}
        aria-label="Arabic"
        lang="ar"
        translate="no"
      >
        عربي
      </button>
      <span className="w-px h-4 bg-primary/30" />
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 transition-colors ${
          language === "en"
            ? "bg-primary text-black"
            : "text-foreground/70 hover:bg-primary/10"
        }`}
        aria-label="English"
        lang="en"
        translate="no"
      >
        English
      </button>
    </div>
  );
}
