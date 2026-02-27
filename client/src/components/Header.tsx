import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NAV_ITEMS } from "@shared/constants";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { t, isRTL } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [crownMode, setCrownMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route changes / resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { href: "/", label: t(NAV_ITEMS.home) },
    { href: "/collections", label: t(NAV_ITEMS.collection) },
    { href: "/brands", label: t(NAV_ITEMS.brands) },
    { href: "/about", label: t(NAV_ITEMS.about) },
  ];

  return (
    <>
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
              onClick={() => setMobileOpen(false)}
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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link href="/admin/login" className="hidden sm:block text-sm font-medium text-foreground/60 hover:text-primary transition-colors">
                {t(NAV_ITEMS.admin)}
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
              <div className="flex items-center justify-between px-6 h-20 border-b border-[#d4af37]/20">
                <div>
                  <p className="text-sm font-semibold text-[#d4af37]">
                    {isRTL ? "الشيخ عمار" : "Sheikh Ammar"}
                  </p>
                  <p className="text-xs text-[#f5f2e8]/50">
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
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-4 py-3 rounded-lg text-[#f5f2e8]/80 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-200 text-base font-medium"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-4 border-t border-[#d4af37]/20 mt-4">
                  <Link
                    href="/admin/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg text-[#f5f2e8]/50 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-200 text-sm"
                  >
                    {t(NAV_ITEMS.admin)}
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#d4af37]/20 text-center">
                <p className="text-xs text-[#f5f2e8]/30">
                  © 2025 {isRTL ? "المجموعة الملكية" : "Royal Collection"}
                </p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
