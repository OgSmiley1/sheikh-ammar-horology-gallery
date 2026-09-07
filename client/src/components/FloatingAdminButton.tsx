import { useLocation } from "wouter";
import { Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function FloatingAdminButton() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const adminLabel = language === "ar" ? "لوحة الإدارة" : "Admin Panel";

  return (
    <button
      onClick={() => setLocation("/admin/login-mvp")}
      className="fixed bottom-8 right-8 z-40 group"
      title={adminLabel}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-primary/70 blur-lg opacity-0 transition-opacity duration-300 group-hover:opacity-75"></div>
      
      {/* Button */}
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/65">
        <Lock className="h-8 w-8 text-primary-foreground" />
      </div>

      {/* Label on hover */}
      <div className="pointer-events-none absolute bottom-20 right-0 whitespace-nowrap rounded border border-primary/50 bg-card px-3 py-2 text-xs font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {adminLabel}
      </div>
    </button>
  );
}
