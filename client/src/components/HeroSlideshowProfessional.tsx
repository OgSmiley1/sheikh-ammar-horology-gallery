import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSlide {
  id: number;
  type: 'sheikh' | 'watch';
  brand?: { en: string; ar: string };
  model?: { en: string; ar: string };
  image: string;
  story?: { en: string; ar: string };
  rarity?: string;
  price?: { min: number; max: number };
  reference?: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    type: 'sheikh',
    image: '/slideshow-sheikh-only/IMG_7787.webp',
  },
  {
    id: 2,
    type: 'watch',
    brand: { en: 'Richard Mille', ar: 'ريتشارد ميل' },
    model: { en: 'RM 26-02 Evil Eye', ar: 'RM 26-02 عين الشر' },
    reference: 'RM 26-02',
    image: '/watches-optimized/rm-26-02.webp',
    story: {
      en: 'A masterpiece combining aerospace materials with traditional craftsmanship. The "Evil Eye" tourbillon represents the pinnacle of technical innovation and artistic vision.',
      ar: 'تحفة فنية تجمع بين مواد الطيران والحرفية التقليدية. يمثل توربيون "عين الشر" قمة الابتكار التقني والرؤية الفنية.',
    },
    rarity: 'Ultra Rare - Limited Production',
    price: { min: 600000, max: 900000 },
  },
  {
    id: 3,
    type: 'watch',
    brand: { en: 'Patek Philippe', ar: 'باتيك فيليب' },
    model: { en: 'Nautilus 5711/1300A', ar: 'نوتيلوس 5711/1300A' },
    reference: '5711/1300A-001',
    image: '/watches-optimized/nautilus-5711.webp',
    story: {
      en: 'The olive green dial Nautilus represents the ultimate in rarity. Only a handful were produced before discontinuation, making it one of the most sought-after modern Patek Philippe watches.',
      ar: 'يمثل نوتيلوس بالميناء الأخضر الزيتوني قمة الندرة. تم إنتاج حفنة فقط قبل التوقف، مما يجعلها واحدة من أكثر ساعات باتيك فيليب الحديثة المطلوبة.',
    },
    rarity: 'Extremely Rare - Discontinued',
    price: { min: 450000, max: 600000 },
  },
  {
    id: 4,
    type: 'watch',
    brand: { en: 'Patek Philippe', ar: 'باتيك فيليب' },
    model: { en: 'Ref. 5470P-001', ar: 'المرجع 5470P-001' },
    reference: '5470P-001',
    image: '/watches-optimized/patek-5470p.webp',
    story: {
      en: 'A unique 1/1 piece created for Only Watch 2019. This platinum chronograph with perpetual calendar represents the absolute pinnacle of Swiss watchmaking excellence.',
      ar: 'قطعة فريدة 1/1 تم إنشاؤها لمزاد Only Watch 2019. يمثل هذا الكرونوغراف البلاتيني مع التقويم الدائم قمة التميز السويسري المطلقة في صناعة الساعات.',
    },
    rarity: 'Unique Piece - 1/1',
    price: { min: 350000, max: 500000 },
  },
  {
    id: 5,
    type: 'watch',
    brand: { en: 'Patek Philippe', ar: 'باتيك فيليب' },
    model: { en: 'Ref. 5959P-001', ar: 'المرجع 5959P-001' },
    reference: '5959P-001',
    image: '/watches-optimized/patek-5959p.webp',
    story: {
      en: 'The split-seconds chronograph in platinum represents centuries of horological expertise. A masterpiece of technical complexity and refined elegance.',
      ar: 'يمثل الكرونوغراف المنقسم الثواني من البلاتين قروناً من الخبرة في صناعة الساعات. تحفة من التعقيد التقني والأناقة الراقية.',
    },
    rarity: 'Very Rare - Limited Production',
    price: { min: 300000, max: 450000 },
  },
];

export function HeroSlideshowProfessional() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const { isRTL } = useLanguage();

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 8000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 8000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 8000);
  };

  const slide = heroSlides[currentSlide];

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={slide.image}
          alt={slide.type === 'sheikh' ? 'Sheikh Ammar' : slide.model?.en}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Sheikh Slide */}
            {slide.type === 'sheikh' && (
              <div className="text-center z-10">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h1 className="text-5xl md:text-7xl font-serif text-[#d4af37] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {isRTL ? 'الشيخ عمار بن حميد' : 'Sheikh Ammar'}
                  </h1>
                  <p className="text-2xl md:text-3xl text-[#f5f2e8] mb-2">
                    {isRTL ? 'ولي عهد عجمان' : 'Crown Prince of Ajman'}
                  </p>
                  <p className="text-lg text-[#f5f2e8]/70">
                    {isRTL ? 'مجموعة الساعات الملكية' : 'Royal Horology Collection'}
                  </p>
                </motion.div>
              </div>
            )}

            {/* Watch Slide */}
            {slide.type === 'watch' && (
              <div className="max-w-5xl mx-auto px-6 z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  {/* Left: Watch Details */}
                  <motion.div
                    initial={{ x: isRTL ? 50 : -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <p className="text-[#d4af37] text-sm font-semibold mb-2 uppercase tracking-widest">
                      {slide.brand?.en}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif text-[#f5f2e8] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {isRTL ? slide.model?.ar : slide.model?.en}
                    </h2>
                    <p className="text-[#d4af37] text-lg font-semibold mb-4">
                      {slide.reference}
                    </p>

                    <p className="text-[#f5f2e8]/80 text-lg leading-relaxed mb-6">
                      {isRTL ? slide.story?.ar : slide.story?.en}
                    </p>

                    <div className="flex gap-4 mb-6">
                      <div className="px-4 py-2 border border-[#d4af37] rounded">
                        <p className="text-[#d4af37] text-xs uppercase tracking-widest">
                          {isRTL ? 'الندرة' : 'Rarity'}
                        </p>
                        <p className="text-[#f5f2e8] font-semibold">{slide.rarity}</p>
                      </div>
                      <div className="px-4 py-2 border border-[#d4af37] rounded">
                        <p className="text-[#d4af37] text-xs uppercase tracking-widest">
                          {isRTL ? 'السعر' : 'Price Range'}
                        </p>
                        <p className="text-[#f5f2e8] font-semibold">
                          ${slide.price?.min?.toLocaleString()} - ${slide.price?.max?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right: Watch Image */}
                  <motion.div
                    initial={{ x: isRTL ? -50 : 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex justify-center"
                  >
                    <img
                      src={slide.image}
                      alt={slide.model?.en}
                      className="w-full max-w-sm h-auto object-contain drop-shadow-2xl"
                    />
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Header with SA Logo - Single Instance */}
      <div className="absolute top-6 left-6 z-20">
        <div className="flex items-center gap-2">
          <span className="text-3xl">👑</span>
          <span className="text-2xl font-serif text-[#d4af37]" style={{ fontFamily: 'Playfair Display, serif' }}>
            SA
          </span>
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 z-20 text-[#d4af37] text-sm font-semibold">
        {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border border-[#d4af37] hover:bg-[#d4af37]/10 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-[#d4af37]" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border border-[#d4af37] hover:bg-[#d4af37]/10 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-[#d4af37]" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentSlide ? 'bg-[#d4af37] w-8' : 'bg-[#d4af37]/40 hover:bg-[#d4af37]/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
