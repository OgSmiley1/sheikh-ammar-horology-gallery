import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="maison-language-switcher flex h-9 items-center p-0.5"
      role="group"
      aria-label={language === "ar" ? "اختيار اللغة" : "Language selection"}
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`maison-language-switcher__option h-8 px-3 text-[0.62rem] font-bold tracking-[0.12em] transition-colors duration-200 ${
          language === "en"
            ? "is-active"
            : ""
        }`}
        aria-label="English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("ar")}
        aria-pressed={language === "ar"}
        className={`maison-language-switcher__option h-8 px-3 text-[0.62rem] font-bold tracking-[0.12em] transition-colors duration-200 ${
          language === "ar"
            ? "is-active"
            : ""
        }`}
        aria-label="العربية"
      >
        AR
      </button>
    </div>
  );
}
