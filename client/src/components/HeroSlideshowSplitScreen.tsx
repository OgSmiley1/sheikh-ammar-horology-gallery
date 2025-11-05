import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { HeroSlide } from '@/data/heroSlides';

type Props = {
  slides: HeroSlide[];
  autoPlayMs?: number;
};

export function HeroSlideshowSplitScreen({ slides, autoPlayMs = 7000 }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const { isRTL } = useLanguage();

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayMs);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayMs, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), autoPlayMs * 2);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), autoPlayMs * 2);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), autoPlayMs * 2);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full min-h-screen bg-[#0a0a0a] py-12 md:py-20">
      {/* Header with SA Logo */}
      <div className="absolute top-6 left-6 right-6 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif text-[#d4af37]">SA</span>
            <span className="text-3xl">👑</span>
          </div>
          <div className="text-right text-[#d4af37] text-sm font-semibold">
            {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left Side: Sheikh Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`sheikh-${slide.id}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className="relative h-96 md:h-[600px] flex items-center justify-center"
            >
              <img
                src={slide.sheikhImage}
                alt={`Sheikh Ammar with ${slide.titleEn}`}
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent rounded-2xl" />
            </motion.div>
          </AnimatePresence>

          {/* Right Side: Watch Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`watch-${slide.id}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.6 }}
              className="relative h-96 md:h-[600px] flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-2xl border border-[#d4af37]/20 overflow-hidden"
            >
              <img
                src={slide.watchImage}
                alt={slide.titleEn}
                className="w-full h-full object-contain p-8"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content Band Below Images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${slide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 space-y-6"
          >
            {/* Titles */}
            <div className="text-center space-y-2">
              <p className="text-sm text-[#d4af37] font-semibold tracking-widest uppercase">
                {isRTL ? slide.titleAr : slide.titleEn}
              </p>
              {slide.subtitleEn && (
                <h2 className="text-2xl md:text-3xl font-serif text-[#f5f2e8]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {isRTL ? slide.subtitleAr : slide.subtitleEn}
                </h2>
              )}
            </div>

            {/* Description */}
            <p
              className="text-[#f5f2e8]/80 leading-relaxed text-sm md:text-base text-center max-w-4xl mx-auto"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {isRTL ? slide.descriptionAr : slide.descriptionEn}
            </p>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {slide.specs.map((spec, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.05 }}
                  className="border border-[#d4af37]/30 rounded-2xl p-4 bg-[#1a1a1a]/50"
                >
                  <p className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider mb-2">
                    {isRTL ? spec.labelAr : spec.labelEn}
                  </p>
                  <p className="text-[#f5f2e8] text-sm" dir={isRTL ? 'rtl' : 'ltr'}>
                    {isRTL ? spec.valueAr : spec.valueEn}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border border-[#d4af37]/50 hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-[#d4af37] group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border border-[#d4af37]/50 hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-[#d4af37] group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'bg-[#d4af37] w-8' : 'bg-[#d4af37]/30 w-2 hover:bg-[#d4af37]/60'
            }`}
            whileHover={{ scale: 1.2 }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
