import { useLanguage } from '@/contexts/LanguageContext';
import { Top5WatchesSlideshow } from '@/components/Top5WatchesSlideshow';

export default function Top10Page() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-black">
      {/* Page Header */}
      <div className="relative z-10 pt-20 pb-6 text-center bg-gradient-to-b from-black via-black/90 to-transparent">
        <h1 className={`text-3xl md:text-4xl font-bold text-gold tracking-widest uppercase mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
          {language === 'ar' ? 'أفضل 10 ساعات في المجموعة' : 'Top 10 Watches in the Collection'}
        </h1>
        <p className={`text-white/60 text-sm tracking-wider ${language === 'ar' ? 'font-arabic' : ''}`}>
          {language === 'ar'
            ? 'الشيخ عمار بن حميد النعيمي — مجموعة الساعات الملكية'
            : 'Sheikh Ammar bin Humaid Al Nuaimi — Royal Timepiece Collection'}
        </p>
      </div>

      {/* Full-Screen Slideshow */}
      <Top5WatchesSlideshow />
    </div>
  );
}
