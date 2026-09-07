import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { language, isRTL } = useLanguage();
  const isArabic = language === "ar";

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <main className="container flex min-h-[72vh] items-center justify-center px-6 pt-28 pb-16">
        <section className="luxury-panel relative w-full max-w-2xl overflow-hidden px-6 py-14 text-center sm:px-12">
          <div className="ornament-line mx-auto mb-8 max-w-xs" />
          <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
            <AlertCircle className="h-7 w-7 text-primary" aria-hidden="true" />
          </div>
          <p className="overline mb-3">404</p>
          <h1 className="section-heading text-gold-gradient mb-4 text-4xl sm:text-5xl">
            {isArabic ? "هذه الصفحة خارج نطاق المجموعة" : "This Page Is Beyond the Collection"}
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-muted-foreground leading-relaxed">
            {isArabic
              ? "قد تكون الصفحة قد انتقلت أو لم تعد متاحة. عُد إلى المجموعة الملكية لمتابعة استكشاف روائع صناعة الساعات."
              : "The page may have moved or is no longer available. Return to the Royal Collection to continue exploring exceptional horology."}
          </p>
          <Button
            onClick={handleGoHome}
            className="bg-primary px-6 py-2.5 text-primary-foreground transition-all duration-200 hover:bg-primary/90"
          >
            <Home className={isArabic ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
            {isArabic ? "العودة إلى الرئيسية" : "Return Home"}
          </Button>
          <div className="ornament-line mx-auto mt-8 max-w-xs" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
