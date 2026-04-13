import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { t, isRTL, language } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [crownMode, setCrownMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: t("common.home") },
    { href: "/collections", label: t("common.collection") },
    { href: "/sheikh-gallery", label: t("common.gallery") },
    { href: "/compare", label: t("common.compare") },
    { href: "/top10", label: t("common.top10") },
    { href: "/timeline", label: t("common.timeline") },
    { href: "/stories", label: t("common.stories") },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-lg border-b border-primary/20 shadow-lg"
            : "bg-transparent"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo / Brand */}
            <Link
              href="/"
              className="flex items-center gap-3 group min-w-0 shrink-0"
              onMouseEnter={() => setCrownMode(true)}
              onMouseLeave={() => setCrownMode(false)}
              onClick={() => setMobileOpen(false)}
            >
              <div
                className="w-10 h-10 lg:w-12 lg:h-12 shrink-0 bg-primary/10 rounded-full flex items-center justify-center border border-primary/30 group-hover:border-primary transition-all"
                style={{
                  boxShadow: crownMode ? '0 0 30px rgba(212, 175, 55, 0.8)' : 'none',
                  background: crownMode ? 'rgba(212, 175, 55, 0.2)' : undefined,
                }}
              >
                <span className="text-lg lg:text-xl font-bold text-gold-gradient" dir="ltr">
                  SA
                </span>
              </div>
              <div className="hidden md:block min-w-0">
                <div className={`text-xs lg:text-sm font-semibold text-primary truncate max-w-[160px] ${language === "ar" ? "font-arabic" : ""}`}>
                  {isRTL ? "الشيخ عمار بن حميد النعيمي" : "Sheikh Ammar"}
                </div>
                <div className={`text-xs text-muted-foreground ${language === "ar" ? "font-arabic" : ""}`}>
                  {isRTL ? "المجموعة الملكية" : "Royal Collection"}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center flex-wrap justify-center gap-x-4 gap-y-1 xl:gap-x-6 min-w-0 px-2"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {navLinks.map((link) => {
                const active = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs xl:text-sm font-medium whitespace-nowrap transition-colors ${
                      active
                        ? "text-primary font-semibold"
                        : "text-foreground/80 hover:text-primary"
                    } ${language === "ar" ? "font-arabic" : ""}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2 lg:gap-3 shrink-0">
              <LanguageSwitcher />
              <Link href="/admin/login" className="hidden sm:block text-xs lg:text-sm font-medium text-foreground/60 hover:text-primary transition-colors whitespace-nowrap">
                {t("common.admin")}
              </Link>
              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 rounded-md text-primary hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.nav
              key="drawer"
              initial={{ x: isRTL ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "-100%" : "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed top-0 ${isRTL ? "left-0" : "right-0"} z-50 h-full w-72 flex flex-col bg-[#0a0a0a] border-${isRTL ? "r" : "l"} border-[#d4af37]/20 shadow-2xl lg:hidden`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-[#d4af37]/20">
                <div>
                  <p className={`text-sm font-semibold text-[#d4af37] ${language === "ar" ? "font-arabic" : ""}`}>
                    {isRTL ? "الشيخ عمار" : "Sheikh Ammar"}
                  </p>
                  <p className={`text-xs text-[#f5f2e8]/50 ${language === "ar" ? "font-arabic" : ""}`}>
                    {isRTL ? "المجموعة الملكية" : "Royal Collection"}
                  </p>
                </div>
                <button
                  className="p-2 rounded-md text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {navLinks.map((link, i) => {
                  const active = location === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium ${
                          active
                            ? "text-[#d4af37] bg-[#d4af37]/10"
                            : "text-[#f5f2e8]/80 hover:text-[#d4af37] hover:bg-[#d4af37]/10"
                        } ${language === "ar" ? "font-arabic" : ""}`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}

                <div className="pt-4 border-t border-[#d4af37]/20 mt-4">
                  <Link
                    href="/admin/login"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg text-[#f5f2e8]/50 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-200 text-sm ${language === "ar" ? "font-arabic" : ""}`}
                  >
                    {t("common.admin")}
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#d4af37]/20 text-center">
                <p className={`text-xs text-[#f5f2e8]/30 ${language === "ar" ? "font-arabic" : ""}`}>
                  © 2025 {t("common.copyright")}
                </p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
