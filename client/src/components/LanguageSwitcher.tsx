import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 text-foreground/80 hover:text-foreground hover:bg-primary/10"
    >
      <Languages className="h-4 w-4" />
      <span className="font-semibold">
        {language === "en" ? "العربية" : "English"}
      </span>
    </Button>
  );
}
