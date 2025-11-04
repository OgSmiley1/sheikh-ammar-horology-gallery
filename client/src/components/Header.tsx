import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NAV_ITEMS } from "@shared/constants";
import { useState, useEffect } from "react";

export function Header() {
  const { t, isRTL } = useLanguage();
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-lg border-b border-primary/20 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
            onMouseEnter={() => setCrownMode(true)}
            onMouseLeave={() => setCrownMode(false)}
          >
            <div 
              className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/30 group-hover:border-primary transition-all"
              style={{
                boxShadow: crownMode ? '0 0 30px rgba(212, 175, 55, 0.8)' : 'none',
                background: crownMode ? 'rgba(212, 175, 55, 0.2)' : undefined,
              }}
            >
              <span className="text-2xl font-bold text-gold-gradient">
                {isRTL ? "ع" : "SA"}
              </span>
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold text-primary">
                {isRTL ? "الشيخ عمار بن حميد النعيمي" : "Sheikh Ammar"}
              </div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? "المجموعة الملكية" : "Royal Collection"}
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              {t(NAV_ITEMS.home)}
            </Link>
            <Link href="/collections" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              {t(NAV_ITEMS.collection)}
            </Link>
            <Link href="/brands" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              {t(NAV_ITEMS.brands)}
            </Link>
            <Link href="/about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              {t(NAV_ITEMS.about)}
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/admin/login" className="hidden sm:block text-sm font-medium text-foreground/60 hover:text-primary transition-colors">
              {t(NAV_ITEMS.admin)}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
