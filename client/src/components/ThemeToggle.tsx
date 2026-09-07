import { Moon, Sun } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme, switchable } = useTheme();
  const { isRTL } = useLanguage();

  if (!switchable || !toggleTheme) return null;

  const isDark = theme === "dark";
  const label = isRTL
    ? (isDark ? "التبديل إلى المظهر الفاتح" : "التبديل إلى المظهر الداكن")
    : (isDark ? "Switch to light theme" : "Switch to dark theme");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/35 bg-background/80 text-primary shadow-sm backdrop-blur transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}
