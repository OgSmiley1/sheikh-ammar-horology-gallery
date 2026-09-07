import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NavigationDropdown } from "./NavigationDropdown";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { isMainNavigationActive, PRIMARY_NAVIGATION } from "@/lib/navigation";
import { useState, useEffect } from "react";

export function Header() {
  const { isRTL } = useLanguage();
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [crownMode, setCrownMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`maison-header fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "shadow-[0_12px_32px_color-mix(in_srgb,var(--secondary)_10%,transparent)]" : ""
      }`}
    >
      <div className="w-full px-4 md:px-8">
        {/* Top Row: Maison signature + utility controls */}
        <div className="flex h-20 items-center justify-between md:h-[4.75rem]">
          {/* Maison signature */}
          <Link 
            href="/" 
            className="group flex min-w-0 items-center gap-2.5"
            onMouseEnter={() => setCrownMode(true)}
            onMouseLeave={() => setCrownMode(false)}
          >
              <div 
                className="maison-monogram flex h-9 w-9 shrink-0 items-center justify-center transition-all duration-300"
              style={{
                boxShadow: crownMode ? '0 0 0 4px color-mix(in srgb, var(--primary) 8%, transparent)' : 'none',
                background: crownMode ? 'color-mix(in srgb, var(--primary) 7%, var(--card))' : undefined,
              }}
            >
              <span className="font-serif text-[0.88rem] font-semibold tracking-[0.06em] text-primary">
                RRR
              </span>
            </div>
              <div className="hidden min-w-0 md:block">
                <div className="maison-signature font-serif text-[0.72rem] font-semibold uppercase tracking-[0.14em]">
                {isRTL ? "المجموعة الملكية" : "Royal Collection"}
              </div>
                <div className="maison-descriptor mt-0.5 text-[0.54rem] font-medium uppercase tracking-[0.12em]">
                {isRTL ? "سجل الساعات" : "Horology Archive"}
              </div>
            </div>
          </Link>

          {/* Visitor utilities: administrator entry remains available only at its direct protected route. */}
          <div className={`flex items-center gap-1.5 md:gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ThemeToggle />
            <LanguageSwitcher />
            <MobileMenu />
          </div>
        </div>

        {/* Bottom Row: Navigation */}
        <nav className={`maison-navigation hidden items-center gap-7 pb-3 xl:flex ${isRTL ? 'flex-row-reverse' : ''}`} aria-label={isRTL ? "التنقل الرئيسي" : "Primary navigation"}>
          {PRIMARY_NAVIGATION.map((item) => {
            const active = isMainNavigationActive(location, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`maison-navigation__link relative whitespace-nowrap text-[0.7rem] font-bold tracking-[0.12em] transition-colors ${active ? "is-active" : ""}`}
              >
                {isRTL ? item.ar : item.en}
                <span className={`absolute -bottom-2 left-1/2 h-px w-6 -translate-x-1/2 transition-all ${active ? "opacity-100" : "opacity-0"}`} />
              </Link>
            );
          })}
          <div className="border-l border-border/50 px-4" />
          <NavigationDropdown />
        </nav>
      </div>
    </header>
  );
}
