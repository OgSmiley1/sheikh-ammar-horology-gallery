import { useState } from "react";
import { Link, useLocation } from "wouter";
import { X, Menu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSwipe } from "@/hooks/useSwipe";
import { isMainNavigationActive, MORE_NAVIGATION, PRIMARY_NAVIGATION } from "@/lib/navigation";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { language, setLanguage } = useLanguage();
  const labels = language === "ar"
    ? { open: "فتح القائمة", close: "إغلاق القائمة", guide: "دليل البداية", stories: "قصص الساعات", archive: "أطلس الأرشيف", film: "مرجع الفيديو", explore: "استكشف الأرشيف" }
    : { open: "Open menu", close: "Close menu", guide: "START HERE", stories: "Watch stories", archive: "Archive atlas", film: "Film reference", explore: "Explore the archive" };

  useSwipe({
    onSwipeRight: () => {
      if (language === "ar" && isOpen) setIsOpen(false);
    },
    onSwipeLeft: () => {
      if (language === "en" && isOpen) setIsOpen(false);
    },
  });

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="xl:hidden p-2 text-foreground hover:text-primary transition-colors"
        aria-label={isOpen ? labels.close : labels.open}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-[9998] xl:hidden"
            onClick={closeMenu}
          />

          {/* Menu Panel */}
          <div dir={language === "ar" ? "rtl" : "ltr"} className={`fixed top-0 h-full w-64 bg-card shadow-2xl z-[9999] xl:hidden ${
            language === 'ar' ? 'left-0 border-r border-border' : 'right-0 border-l border-border'
          }`}>
            <div className="flex flex-col h-full">
              {/* Close Button */}
              <div className="flex justify-end p-4 border-b border-border">
                <button
                  onClick={closeMenu}
                  className="p-2 text-foreground hover:text-primary transition-colors"
                  aria-label={labels.close}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className={`flex-1 flex flex-col gap-2 p-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className="mb-3 border border-primary/25 bg-primary/5 p-3">
                  <p className="text-[0.62rem] font-bold tracking-[0.14em] text-primary">{labels.guide}</p>
                  <div className={`mt-2 grid gap-1 text-sm ${language === "ar" ? "text-right" : "text-left"}`}>
                    <a href="/#watch-stories" onClick={closeMenu} className="rounded px-2 py-1.5 text-foreground transition-colors hover:bg-background hover:text-primary">01 — {labels.stories}</a>
                    <Link href="/collection" onClick={closeMenu} className="rounded px-2 py-1.5 text-foreground transition-colors hover:bg-background hover:text-primary">02 — {labels.archive}</Link>
                    <Link href="/collection#collection-film" onClick={closeMenu} className="rounded px-2 py-1.5 text-foreground transition-colors hover:bg-background hover:text-primary">03 — {labels.film}</Link>
                  </div>
                </div>
                {PRIMARY_NAVIGATION.map((item) => {
                  const active = isMainNavigationActive(location, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={`px-4 py-3 rounded-lg transition-colors font-medium ${
                        active
                          ? "bg-primary/15 text-primary"
                          : "text-foreground hover:text-primary hover:bg-muted"
                      }`}
                    >
                      {language === "ar" ? item.ar : item.en}
                    </Link>
                  );
                })}
                <div className="mt-3 border-t border-border pt-4">
                  <p className="px-4 text-[0.62rem] font-bold tracking-[0.14em] text-primary">{labels.explore}</p>
                  <div className="mt-2 grid gap-1">
                    {MORE_NAVIGATION.map((item) => {
                      const active = isMainNavigationActive(location, item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenu}
                          aria-current={active ? "page" : undefined}
                          className={`rounded px-4 py-2.5 text-sm transition-colors ${active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-primary"}`}
                        >
                          {language === "ar" ? item.ar : item.en}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </nav>

              {/* Language Selector */}
                <div className={`p-4 border-t border-border ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                  {language === "ar" ? "اللغة" : "Language"}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setLanguage("en");
                      closeMenu();
                    }}
                    className={`flex-1 px-4 py-2 rounded transition-colors font-medium ${
                      language === "en"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-primary"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("ar");
                      closeMenu();
                    }}
                    className={`flex-1 px-4 py-2 rounded transition-colors font-medium ${
                      language === "ar"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-primary"
                    }`}
                  >
                    AR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
