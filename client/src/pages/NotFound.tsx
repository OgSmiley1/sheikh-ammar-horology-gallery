import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { t, language, isRTL } = useLanguage();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-black" dir={isRTL ? "rtl" : "ltr"}>
      <Card className="w-full max-w-lg mx-4 shadow-lg border border-gold-500/20 bg-black/80 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gold-500/20 rounded-full animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-gold-500" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gold-500 mb-2">404</h1>

          <h2 className={`text-xl font-semibold text-gray-200 mb-4 ${language === "ar" ? "font-arabic" : ""}`}>
            {t("errors.404Title")}
          </h2>

          <p className={`text-gray-400 mb-8 leading-relaxed ${language === "ar" ? "font-arabic" : ""}`}>
            {t("errors.404Body")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoHome}
              className="bg-gold-500 hover:bg-gold-400 text-black px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Home className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              <span className={language === "ar" ? "font-arabic" : ""}>{t("common.goHome")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
