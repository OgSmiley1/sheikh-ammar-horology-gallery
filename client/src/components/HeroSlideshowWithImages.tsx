import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeroSlide {
  id: number;
  image: string;
  title: { en: string; ar: string };
  subtitle?: { en: string; ar: string };
  reference?: string;
  price?: { min: number; max: number };
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: '/slideshow-sheikh-only/slide-01.webp',
    title: { en: 'Sheikh Ammar bin Humaid Al Nuaimi', ar: 'الشيخ عمار بن حميد النعيمي' },
    subtitle: { en: 'Crown Prince of Ajman', ar: 'ولي عهد عجمان' },
  },
  {
    id: 2,
    image: '/slideshow-optimized/download(2).webp',
    title: { en: 'Richard Mille RM 26-02', ar: 'ريتشارد ميل RM 26-02' },
    subtitle: { en: 'Evil Eye Tourbillon', ar: 'توربيون عين الشر' },
    reference: 'RM 26-02',
    price: { min: 600000, max: 900000 },
  },
  {
    id: 3,
    image: '/slideshow-optimized/download(3).webp',
    title: { en: 'Patek Philippe Nautilus', ar: 'باتيك فيليب نوتيلوس' },
    subtitle: { en: 'Ref. 5711/1300A', ar: 'المرجع 5711/1300A' },
    reference: '5711/1300A-001',
    price: { min: 450000, max: 600000 },
  },
  {
    id: 4,
    image: '/slideshow-optimized/download(4).webp',
    title: { en: 'Patek Philippe Ref. 5470P', ar: 'باتيك فيليب المرجع 5470P' },
    subtitle: { en: 'Perpetual Calendar Chronograph', ar: 'كرونوغراف التقويم الدائم' },
    reference: '5470P-001',
    price: { min: 350000, max: 500000 },
  },
  {
    id: 5,
    image: '/slideshow-optimized/download(6).webp',
    title: { en: 'Patek Philippe Ref. 5959P', ar: 'باتيك فيليب المرجع 5959P' },
    subtitle: { en: 'Split-Seconds Chronograph', ar: 'كرونوغراف الثواني المنقسمة' },
    reference: '5959P-001',
    price: { min: 300000, max: 450000 },
  },
];

export function HeroSlideshowWithImages() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const { isRTL } = useLanguage();

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title.en}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </motion.div>
      </AnimatePresence>

      {/* Header with SA Logo */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif text-[#d4af37]">SA</span>
            <span className="text-3xl">👑</span>
          </div>
          <div className="text-right text-[#d4af37] text-sm font-semibold">
            {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-serif text-[#f5f2e8] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              {isRTL ? slide.title.ar : slide.title.en}
            </h1>
            {slide.subtitle && (
              <p className="text-xl md:text-2xl text-[#d4af37] mb-4">
                {isRTL ? slide.subtitle.ar : slide.subtitle.en}
              </p>
            )}
            {slide.reference && (
              <>
                <p className="text-lg text-[#f5f2e8]/70 mb-2">{slide.reference}</p>
                <p className="text-lg text-[#d4af37] font-semibold">
                  ${slide.price?.min.toLocaleString()} - ${slide.price?.max.toLocaleString()}
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border border-[#d4af37]/50 hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-[#d4af37] group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border border-[#d4af37]/50 hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-[#d4af37] group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroSlides.map((_, idx) => (
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
