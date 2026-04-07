{/* Mobile Navigation Links */}
{navLinks.map((link) => {
  const isActive = location.pathname === link.href;
  
  return (
    <motion.div
      key={link.href}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={link.href}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium ${
          isActive
            ? "text-[#d4af37] bg-[#d4af37]/10"
            : "text-[#f5f2e8]/80 hover:text-[#d4af37] hover:bg-[#d4af37]/10"
        } ${language === "ar" ? "font-arabic" : ""}`}
      >
        {link.label}
      </Link>
    </motion.div>
  );
})}

{/* Admin Login Link */}
<div className="pt-4 border-t border-[#d4af37]/20 mt-4">
  <Link
    href="/admin/login"
    onClick={() => setMobileOpen(false)}
    className={`flex items-center px-4 py-3 rounded-lg text-[#f5f2e8]/50 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-200 text-sm ${
      language === "ar" ? "font-arabic" : ""
    }`}
  >
    {t("common.admin")}
  </Link>
</div>

{/* Footer */}
<div className="px-6 py-4 border-t border-[#d4af37]/20 text-center">
  <p className={`text-xs text-[#f5f2e8]/30 ${language === "ar" ? "font-arabic" : ""}`}>
    © 2025 {t("common.copyright")}
  </p>
</div>