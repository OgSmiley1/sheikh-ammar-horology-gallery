import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { completeCollection } from '@/data/completeCollection';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { localizeRarityLabel } from '@/lib/timelinePresentation';
import { WatchMedia } from '@/components/WatchMedia';
import { canDisplayInArabic } from '@/lib/localizationGuard';

export default function Top10Watches() {
  const { language, isRTL } = useLanguage();
  // Curate a technical editorial selection without ranking or presenting monetary value.
  const top10Watches = useMemo(() => {
    return completeCollection
      .filter((watch) => ["perpetual-calendar", "tourbillon", "complications", "chronograph"].includes(watch.category))
      .slice(0, 10);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentWatch = top10Watches[currentIndex];
  const rarityLabel = localizeRarityLabel(currentWatch?.specifications.rarity, language);
  const movement = !isRTL || canDisplayInArabic(currentWatch?.specifications.movement)
    ? currentWatch?.specifications.movement
    : null;
  const caseMaterial = !isRTL || canDisplayInArabic(currentWatch?.specifications.case)
    ? currentWatch?.specifications.case
    : null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? top10Watches.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === top10Watches.length - 1 ? 0 : prev + 1));
  };

  if (!currentWatch) return null;

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />

      {/* Main Content */}
      <main className="container px-4 py-32">
        {/* Title */}
        <div className="page-hero -mx-4 mb-14 px-4 py-14 text-center sm:rounded-xl">
          <p className="ornament-line mb-5">{language === 'ar' ? 'اختيارات الأرشيف' : 'ARCHIVE SELECTION'}</p>
          <h1 className="sheikh-name mb-4 text-gold-gradient">{language === 'ar' ? 'أبرز عشر ساعات' : 'Top 10 Timepieces'}</h1>
          <p className="sheikh-bio mx-auto max-w-2xl text-muted-foreground">{language === 'ar' ? 'اختيارات تحريرية تُقرأ من خلال الحرفية والتعقيد والشخصية التصميمية.' : 'An editorial selection read through craft, complication, and design character.'}</p>
        </div>

        {/* Carousel Container */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          {/* Left: Sheikh's Portrait */}
          <div className={`flex justify-center ${isRTL ? 'md:order-2' : 'md:order-1'}`}>
            <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-primary/30 bg-card shadow-[0_24px_60px_color-mix(in_srgb,var(--secondary)_18%,transparent)]">
              <img
                src="/sheikh-portrait-1.jpeg"
                alt={language === 'ar' ? 'صاحب السمو الشيخ عمار' : 'His Highness Sheikh Ammar'}
                className="h-auto w-full"
              />
              <div className="gallery-overlay-surface absolute bottom-4 left-4 right-4 rounded-lg p-4 backdrop-blur">
                <p className="text-sm font-semibold">{language === 'ar' ? 'صاحب السمو' : 'His Highness'}</p>
                <p className="text-lg font-bold text-primary">{language === 'ar' ? 'الشيخ عمار بن حميد النعيمي' : 'Sheikh Ammar bin Humaid Al Nuaimi'}</p>
              </div>
            </div>
          </div>

          {/* Right: Watch Display */}
          <div className={`space-y-6 ${isRTL ? 'md:order-1' : 'md:order-2'}`}>
            {/* Watch Image */}
            <div className="flex min-h-[400px] items-center justify-center overflow-hidden rounded-xl border border-primary/25 bg-secondary shadow-[0_22px_50px_color-mix(in_srgb,var(--secondary)_22%,transparent)]">
              <WatchMedia
                imageUrl={currentWatch.watchImage}
                alt={currentWatch.model}
                brandName={currentWatch.brand}
                watchName={currentWatch.model}
                reference={currentWatch.reference}
                language={language}
                priority="high"
                className="watch-media-fill"
              />
            </div>

            {/* Watch Details */}
            <div className="luxury-panel space-y-5 p-6 sm:p-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{language === 'ar' ? 'الدار' : 'Brand'}</p>
                <h2 className="text-4xl text-primary" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{currentWatch.brand}</h2>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">{language === 'ar' ? 'الطراز' : 'Model'}</p>
                <h3 className="text-3xl leading-tight" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{currentWatch.model}</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 border-y border-primary/15 py-5">
                <div className="spec-card rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{language === 'ar' ? 'المرجع' : 'Reference'}</p>
                  <p className="font-semibold">{currentWatch.reference}</p>
                </div>
                <div className="spec-card rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{language === 'ar' ? 'السنة' : 'Year'}</p>
                  <p className="font-semibold">{currentWatch.specifications.year}</p>
                </div>
                {movement && <div className="spec-card rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{language === 'ar' ? 'الحركة' : 'Movement'}</p>
                  <p className="font-semibold text-sm">{movement}</p>
                </div>}
                {caseMaterial && <div className="spec-card rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{language === 'ar' ? 'العلبة' : 'Case'}</p>
                  <p className="font-semibold text-sm">{caseMaterial}</p>
                </div>}
              </div>

              {/* Rarity Badge */}
              {currentWatch.specifications.rarity && (
                <div className="inline-block">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    currentWatch.specifications.rarity === 'ULTRA RARE'
                      ? 'bg-secondary text-secondary-foreground'
                      : currentWatch.specifications.rarity === 'RARE'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary/75 text-primary-foreground'
                  }`}>
                    {rarityLabel}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div
          className="flex items-center justify-between mt-12"
          role="group"
          aria-label={language === 'ar' ? 'التنقل بين الساعات المختارة' : 'Featured timepiece navigation'}
        >
          <Button
            onClick={handlePrevious}
            variant="outline"
            size="lg"
            className="rounded-full w-12 h-12 p-0"
            aria-label={language === 'ar' ? 'الساعة السابقة' : 'Previous timepiece'}
          >
            {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </Button>

          {/* Slide Indicators */}
          <div className="flex items-center gap-2">
            {top10Watches.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                }`}
                    aria-label={language === 'ar' ? `الانتقال إلى الساعة ${index + 1}` : `Go to watch ${index + 1}`}
                    aria-current={index === currentIndex ? 'true' : undefined}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            variant="outline"
            size="lg"
            className="rounded-full w-12 h-12 p-0"
            aria-label={language === 'ar' ? 'الساعة التالية' : 'Next timepiece'}
          >
            {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
          </Button>
        </div>

        {/* Watch Counter */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground" aria-live="polite">
            <span className="font-bold text-primary">{currentIndex + 1}</span> / {top10Watches.length}
          </p>
        </div>

        {/* Branding */}
        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">{language === 'ar' ? 'أرشيف الساعات الملكية' : 'ROYAL HOROLOGY ARCHIVE'}</p>
          <p className="text-lg font-semibold text-primary">{language === 'ar' ? 'دراسات في الحرفية والزمن' : 'STUDIES IN CRAFT AND TIME'}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
