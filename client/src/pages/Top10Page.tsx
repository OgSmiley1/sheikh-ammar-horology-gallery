import { useLanguage } from '@/contexts/LanguageContext';
import { Top5WatchesSlideshow } from '@/components/Top5WatchesSlideshow';
import { Header } from '@/components/Header';

export default function Top10Page() {
  const { t, language, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-black" dir={isRTL ? "rtl" : "ltr"}>
      {/* Page Header */}
      <Header />
      <div className="relative z-10 pt-24 pb-6 text-center bg-gradient-to-b from-black via-black/90 to-transparent">
        <h1 className={`text-3xl md:text-4xl font-bold text-gold tracking-widest uppercase mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {t("top10.title")}
        </h1>
        <p className={`text-white/60 text-sm tracking-wider ${language === 'ar' ? 'font-arabic' : ''}`}>
          {t("top10.subtitle")}
        </p>
      </div>

      {/* Full-Screen Slideshow */}
      <Top5WatchesSlideshow />
    </div>
  );
}
