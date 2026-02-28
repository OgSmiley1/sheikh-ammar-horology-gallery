import { useState, useEffect, useRef } from 'react';
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
  const [progress, setProgress] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const { isRTL } = useLanguage();

  const minSwipeDistance = 50;

  // Reactive prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // RAF-based progress bar
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    if (!autoPlay || isHovered || prefersReducedMotion) {
      setProgress(0);
      return;
    }
    setProgress(0);
    startTimeRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const p = Math.min(elapsed / autoPlayMs, 1);
      setProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [currentSlide, autoPlay, isHovered, prefersReducedMotion, autoPlayMs]);

  // Auto-play
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
      if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
      else if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); setAutoPlay(prev => !prev); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Preload next slide
  useEffect(() => {
    const nextSlideIndex = (currentSlide + 1) % slides.length;
    const next = slides[nextSlideIndex];
    new Image().src = next.sheikhImage;
    new Image().src = next.watchImage;
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

  const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e: React.TouchEvent) => { setTouchEnd(e.targetTouches[0].clientX); };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    else if (distance < -minSwipeDistance) prevSlide();
  };

  const slide = slides[currentSlide];

  // Stagger particle positions — stable across renders
  const particles = [
    { l: 8,  t: 20, dur: 5.2, delay: 0.0 },
    { l: 18, t: 65, dur: 4.1, delay: 0.9 },
    { l: 30, t: 35, dur: 6.0, delay: 1.8 },
    { l: 45, t: 80, dur: 4.8, delay: 0.4 },
    { l: 55, t: 15, dur: 5.5, delay: 2.2 },
    { l: 62, t: 55, dur: 3.9, delay: 1.1 },
    { l: 72, t: 28, dur: 6.3, delay: 0.7 },
    { l: 80, t: 70, dur: 4.4, delay: 1.6 },
    { l: 88, t: 42, dur: 5.7, delay: 2.8 },
    { l: 93, t: 85, dur: 4.0, delay: 0.3 },
    { l: 25, t: 90, dur: 5.0, delay: 3.1 },
    { l: 50, t: 48, dur: 4.6, delay: 1.4 },
  ];

  return (
    <section
      className="relative w-full min-h-screen bg-[#0a0a0a] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-label="Watch collection slideshow"
      role="region"
    >
      {/* ─── Cinematic progress bar ─── */}
      <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-[#d4af37]/10">
        <div
          className="h-full bg-gradient-to-r from-[#d4af37]/60 via-[#f5f2e8]/90 to-[#d4af37] transition-none"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* ─── Ambient blurred background ─── */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`ambient-${slide.id}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <img
            src={slide.sheikhImage}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'blur(80px)', transform: 'scale(1.25)', transformOrigin: 'center center' }}
          />
          {/* Deep dark overlay to keep luxury feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/75 to-[#0a0a0a]/90" />
        </motion.div>
      </AnimatePresence>

      {/* ─── Subtle floating gold particles ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#d4af37]"
            style={{ left: `${p.l}%`, top: `${p.t}%`, width: 2, height: 2 }}
            animate={prefersReducedMotion ? {} : {
              y: [-15, -55, -15],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: p.dur,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ─── Header: monogram + slide counter ─── */}
      <div className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 border border-[#d4af37]/50 rounded-full flex items-center justify-center backdrop-blur-sm bg-black/20">
            <span className="text-xs font-serif text-[#d4af37] tracking-widest">SA</span>
          </div>
          <div className="hidden sm:block h-px w-10 bg-gradient-to-r from-[#d4af37]/50 to-transparent" />
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block h-px w-10 bg-gradient-to-l from-[#d4af37]/50 to-transparent" />
          <span className="text-[#d4af37] font-light tracking-[0.35em] text-sm">
            {String(currentSlide + 1).padStart(2, '0')}
          </span>
          <span className="text-[#d4af37]/30 text-xs mx-0.5">/</span>
          <span className="text-[#d4af37]/40 text-xs tracking-[0.2em]">
            {String(slides.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* ─── Main grid ─── */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-20 md:pt-24 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center min-h-[calc(100vh-10rem)]">

          {/* Left column — Sheikh portrait with Ken Burns */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`sheikh-${slide.id}`}
              className="relative h-[52vh] lg:h-[74vh] rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: isRTL ? 40 : -40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: isRTL ? 20 : -20, scale: 0.98 }}
              transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.12)' }}
            >
              {/* Ken Burns zoom */}
              <motion.div
                className="w-full h-full"
                animate={prefersReducedMotion ? {} : { scale: [1, 1.05] }}
                transition={{ duration: autoPlayMs / 1000, ease: 'easeInOut' }}
              >
                <img
                  src={slide.sheikhImage}
                  alt={`Sheikh Ammar bin Humaid Al Nuaimi wearing ${slide.titleEn}`}
                  className="w-full h-full object-cover"
                  loading={currentSlide === 0 ? 'eager' : 'lazy'}
                  fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
                  decoding="async"
                />
              </motion.div>
              {/* Portrait depth gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />
              {/* Subtle gold frame */}
              <div className="absolute inset-0 border border-[#d4af37]/15 rounded-2xl pointer-events-none" />
              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-[#d4af37]/40 pointer-events-none" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-[#d4af37]/40 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-[#d4af37]/40 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-[#d4af37]/40 pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Right column — Watch panel + info */}
          <div className="flex flex-col gap-4 lg:gap-6">

            {/* Watch image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`watch-${slide.id}`}
                className="relative h-60 lg:h-[34vh] rounded-2xl overflow-hidden border border-[#d4af37]/20 bg-gradient-to-br from-[#141414] to-[#080808]"
                initial={{ opacity: 0, x: isRTL ? -40 : 40, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: isRTL ? -20 : 20, scale: 0.98 }}
                transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.06 }}
                style={{ boxShadow: '0 12px_40px rgba(0,0,0,0.5)' }}
              >
                {/* Gold ambient glow radiating from watch */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse 65% 65% at 50% 55%, rgba(212,175,55,0.14) 0%, transparent 70%)',
                  }}
                />
                <motion.img
                  src={slide.watchImage}
                  alt={`${slide.titleEn} — ${slide.subtitleEn ?? 'Luxury timepiece'}`}
                  className="absolute inset-0 w-full h-full object-contain p-6 lg:p-8"
                  loading={currentSlide === 0 ? 'eager' : 'lazy'}
                  fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
                  decoding="async"
                  animate={prefersReducedMotion ? {} : { scale: [1, 1.02, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            </AnimatePresence>

            {/* Info glass band */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`info-${slide.id}`}
                initial={{ opacity: 0, y: 20, filter: prefersReducedMotion ? 'blur(0px)' : 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: prefersReducedMotion ? 'blur(0px)' : 'blur(4px)' }}
                transition={{ opacity: { duration: 0.55, delay: 0.18 }, y: { duration: 0.55, delay: 0.18 }, filter: { duration: prefersReducedMotion ? 0 : 0.25, delay: 0.18 } }}
                className="rounded-xl border border-[#D4AF37]/25 bg-[#0e0e0e]/80 backdrop-blur-xl px-5 py-5"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.06)' }}
              >
                {/* Title row */}
                <div className="mb-3.5">
                  <p className="text-[11px] text-[#d4af37] font-semibold tracking-[0.28em] uppercase mb-1.5 leading-tight">
                    {isRTL ? slide.titleAr : slide.titleEn}
                  </p>
                  {slide.subtitleEn && (
                    <h2
                      className="font-serif text-[#f5f2e8] leading-snug"
                      style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(1.05rem, 2vw, 1.5rem)',
                      }}
                    >
                      {isRTL ? slide.subtitleAr : slide.subtitleEn}
                    </h2>
                  )}
                </div>

                {/* Gold divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent mb-3.5" />

                {/* Description */}
                <p
                  className="text-[#f5f2e8]/65 text-sm leading-relaxed mb-4"
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  {isRTL ? slide.descriptionAr : slide.descriptionEn}
                </p>

                {/* Specs grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {slide.specs.map((spec, idx) => (
                    <motion.div
                      key={idx}
                      className="border border-[#d4af37]/18 rounded-lg p-2.5 bg-[#181818]/70 cursor-default"
                      whileHover={prefersReducedMotion ? {} : {
                        y: -2,
                        boxShadow: '0 6px 18px rgba(212,175,55,0.15)',
                        borderColor: 'rgba(212,175,55,0.48)',
                      }}
                      transition={{ duration: 0.14 }}
                    >
                      <p className="text-[10px] text-[#d4af37] font-semibold uppercase tracking-wider mb-1 leading-tight">
                        {isRTL ? spec.labelAr : spec.labelEn}
                      </p>
                      <p className="text-[#f5f2e8] text-xs leading-snug" dir={isRTL ? 'rtl' : 'ltr'}>
                        {isRTL ? spec.valueAr : spec.valueEn}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── Navigation arrows ─── */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full border border-[#d4af37]/35 hover:border-[#d4af37] hover:bg-[#d4af37]/10 backdrop-blur-sm transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
        aria-label={`Previous slide (${currentSlide} of ${slides.length})`}
        title="Previous slide (← arrow key)"
      >
        <ChevronLeft className="w-5 h-5 text-[#d4af37] group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full border border-[#d4af37]/35 hover:border-[#d4af37] hover:bg-[#d4af37]/10 backdrop-blur-sm transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
        aria-label={`Next slide (${currentSlide + 2} of ${slides.length})`}
        title="Next slide (→ arrow key)"
      >
        <ChevronRight className="w-5 h-5 text-[#d4af37] group-hover:scale-110 transition-transform" />
      </button>

      {/* ─── Slide indicators ─── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {slides.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-1.5 rounded-full transition-all duration-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${
              idx === currentSlide
                ? 'bg-[#d4af37] w-7'
                : 'bg-[#d4af37]/25 w-1.5 hover:bg-[#d4af37]/55'
            }`}
            whileHover={{ scale: 1.3 }}
            aria-label={`Go to slide ${idx + 1} of ${slides.length}`}
            aria-current={idx === currentSlide ? 'true' : 'false'}
            title={`Slide ${idx + 1}: ${slides[idx].titleEn}`}
          />
        ))}
      </div>

      {/* ─── Vignette bottom ─── */}
      <div
        className="absolute inset-x-0 bottom-0 h-20 pointer-events-none z-[5]"
        style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 100%)' }}
      />
    </section>
  );
}
