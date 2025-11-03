import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NAV_ITEMS } from "@shared/constants";
import { useState, useEffect } from "react";

export function Header() {
  const { t, isRTL } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

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
          <Link href="/">
            <a className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/30 group-hover:border-primary transition-all">
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
            </a>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/">
              <a className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                {t(NAV_ITEMS.home)}
              </a>
            </Link>
            <Link href="/collection">
              <a className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                {t(NAV_ITEMS.collection)}
              </a>
            </Link>
            <Link href="/brands">
              <a className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                {t(NAV_ITEMS.brands)}
              </a>
            </Link>
            <Link href="/about">
              <a className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                {t(NAV_ITEMS.about)}
              </a>
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/admin">
              <a className="hidden sm:block text-sm font-medium text-foreground/60 hover:text-primary transition-colors">
                {t(NAV_ITEMS.admin)}
              </a>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
