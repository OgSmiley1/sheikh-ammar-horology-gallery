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
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const { isRTL } = useLanguage();

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Auto-play effect (respects reduced motion and hover state)
  useEffect(() => {
    if (!autoPlay || isHovered || prefersReducedMotion) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayMs);

    return () => clearInterval(timer);
  }, [autoPlay, isHovered, prefersReducedMotion, autoPlayMs, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setAutoPlay(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Preload next slide images for better performance
  useEffect(() => {
    const nextSlideIndex = (currentSlide + 1) % slides.length;
    const nextSlide = slides[nextSlideIndex];
    
    // Preload both Sheikh and watch images for next slide
    const sheikhImg = new Image();
    const watchImg = new Image();
    sheikhImg.src = nextSlide.sheikhImage;
    watchImg.src = nextSlide.watchImage;
  }, [currentSlide, slides]);

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

  // Touch handlers for swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const slide = slides[currentSlide];

  return (
    <section 
      className="relative w-full min-h-screen bg-[#0a0a0a] py-12 md:py-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-label="Watch collection slideshow"
      role="region"
    >
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
        {/* Desktop: Relative container for overlay | Mobile: Normal flow */}
        <div className="lg:relative">
          {/* Images Grid */}
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
                alt={`Sheikh Ammar bin Humaid Al Nuaimi wearing ${slide.titleEn}`}
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
                loading="lazy"
                decoding="async"
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
                alt={`${slide.titleEn} - ${slide.subtitleEn || 'Luxury timepiece'}`}
                className="w-full h-full object-contain p-8"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>
          </div>

          {/* Content Band - Below on Mobile, Overlaid on Desktop */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 space-y-6 lg:mt-0 lg:absolute lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 lg:w-[90%] lg:max-w-5xl lg:backdrop-blur-xl lg:bg-[#0a0a0a]/80 lg:border lg:border-[#d4af37]/20 lg:rounded-2xl lg:p-8 lg:shadow-2xl"
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
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border border-[#d4af37]/50 hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
        aria-label={`Previous slide (${currentSlide} of ${slides.length})`}
        title="Previous slide (← arrow key)"
      >
        <ChevronLeft className="w-6 h-6 text-[#d4af37] group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border border-[#d4af37]/50 hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
        aria-label={`Next slide (${currentSlide + 2} of ${slides.length})`}
        title="Next slide (→ arrow key)"
      >
        <ChevronRight className="w-6 h-6 text-[#d4af37] group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${
              idx === currentSlide ? 'bg-[#d4af37] w-8' : 'bg-[#d4af37]/30 w-2 hover:bg-[#d4af37]/60'
            }`}
            whileHover={{ scale: 1.2 }}
            aria-label={`Go to slide ${idx + 1} of ${slides.length}`}
            aria-current={idx === currentSlide ? 'true' : 'false'}
            title={`Slide ${idx + 1}: ${slides[idx].titleEn}`}
          />
        ))}
      </div>
    </section>
  );
}
