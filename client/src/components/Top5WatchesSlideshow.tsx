import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import top5Data from '../../../top5-watches-data.json';

export function Top5WatchesSlideshow() {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const watches = top5Data.top5Watches;
  const currentWatch = watches[currentIndex];

  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % watches.length);
    }, 8000);
    
    return () => clearInterval(timer);
  }, [isPlaying, watches.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % watches.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + watches.length) % watches.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Split Screen Layout */}
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* Left Side - Sheikh Wearing Watch */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">
          <img
            src={currentWatch.sheikhImage}
            alt={language === 'ar' ? currentWatch.nameAr : currentWatch.nameEn}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          
          {/* Watch Info Overlay */}
          <div className={`absolute ${language === 'ar' ? 'right-8' : 'left-8'} top-1/2 -translate-y-1/2 max-w-lg`}>
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-gold" />
              <span className="text-gold text-lg font-arabic">
                {language === 'ar' ? 'الشيخ عمار بن حميد النعيمي' : 'Sheikh Ammar bin Humaid Al Nuaimi'}
              </span>
            </div>
            
            <h2 className={`text-4xl md:text-5xl font-bold text-white mb-4 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>
              {language === 'ar' ? currentWatch.nameAr : currentWatch.nameEn}
            </h2>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-2 bg-gold/20 border border-gold text-gold rounded-full text-sm font-semibold">
                #{currentWatch.rank}
              </span>
              <span className="px-4 py-2 bg-red-600/20 border border-red-600 text-red-400 rounded-full text-sm font-semibold">
                {currentWatch.rarity}
              </span>
            </div>
            
            <p className={`text-2xl md:text-3xl font-bold text-gold mb-6 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>
              {currentWatch.priceRange}
            </p>
            
            <p className={`text-white/90 text-base md:text-lg leading-relaxed line-clamp-4 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>
              {language === 'ar' ? currentWatch.storyAr : currentWatch.storyEn}
            </p>
          </div>
        </div>

        {/* Right Side - Watch Detail */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <img
            src={currentWatch.watchImage}
            alt={`${language === 'ar' ? currentWatch.nameAr : currentWatch.nameEn} Detail`}
            className="w-full h-full object-contain p-8 md:p-16"
          />
          
          {/* Specifications Overlay */}
          <div className={`absolute ${language === 'ar' ? 'left-8' : 'right-8'} bottom-8 bg-black/80 backdrop-blur-lg p-6 rounded-xl border border-gold/30 max-w-md`}>
            <h3 className={`text-xl font-bold text-gold mb-4 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>
              {language === 'ar' ? 'المواصفات' : 'Specifications'}
            </h3>
            
            <div className={`space-y-2 text-sm ${language === 'ar' ? 'font-arabic text-right' : ''}`}>
              <div className="flex justify-between text-white/80">
                <span className="font-semibold">{language === 'ar' ? 'المرجع' : 'Reference'}:</span>
                <span>{currentWatch.referenceNumber}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span className="font-semibold">{language === 'ar' ? 'الحركة' : 'Movement'}:</span>
                <span>{currentWatch.specifications.movement}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span className="font-semibold">{language === 'ar' ? 'العلبة' : 'Case'}:</span>
                <span>{currentWatch.specifications.case}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span className="font-semibold">{language === 'ar' ? 'القطر' : 'Diameter'}:</span>
                <span>{currentWatch.specifications.diameter}</span>
              </div>
              {currentWatch.specifications.limitedEdition && (
                <div className="flex justify-between text-gold font-semibold pt-2 border-t border-gold/30">
                  <span>{language === 'ar' ? 'إصدار محدود' : 'Limited Edition'}:</span>
                  <span>{currentWatch.specifications.limitedEdition}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20`}
        aria-label="Previous watch"
      >
        {language === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
      </button>
      
      <button
        onClick={goToNext}
        className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20`}
        aria-label="Next watch"
      >
        {language === 'ar' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {watches.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-12 h-3 bg-gold'
                : 'w-3 h-3 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full border border-gold/30">
        <span className="text-gold font-semibold text-sm">
          {currentIndex + 1} / {watches.length}
        </span>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
        <span className={`text-white/60 text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
          {language === 'ar' ? 'استكشف المجموعة' : 'Explore Collection'}
        </span>
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center p-2">
          <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
