import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FloatingParticles } from "./FloatingParticles";

interface Slide {
  image: string;
  quoteEn: string;
  quoteAr: string;
}

// Using optimized 4K WebP images for crystal-clear quality
const SLIDES: Slide[] = [
  {
    image: "/slideshow-optimized/rzSvrmjbXWne.webp",
    quoteEn: "Excellence is not a destination, it is a journey of continuous improvement.",
    quoteAr: "التميز ليس وجهة، بل رحلة من التحسن المستمر.",
  },
  {
    image: "/slideshow-optimized/lYsm2ZKIOWuC.webp",
    quoteEn: "A timepiece is not just an instrument; it is a reflection of one's character.",
    quoteAr: "الساعة ليست مجرد أداة؛ بل انعكاس لشخصية الإنسان.",
  },
  {
    image: "/slideshow-optimized/obxoBkEjdfBZ.webp",
    quoteEn: "Craftsmanship transcends generations, connecting past, present, and future.",
    quoteAr: "الحرفية تتجاوز الأجيال، وتربط الماضي والحاضر والمستقبل.",
  },
  {
    image: "/slideshow-optimized/U6cjF51DJ9cK.webp",
    quoteEn: "In every watch, there is a story of dedication and passion.",
    quoteAr: "في كل ساعة، هناك قصة من التفاني والشغف.",
  },
  {
    image: "/slideshow-optimized/Yykuc7m6uHlx.webp",
    quoteEn: "The pursuit of perfection is what defines true leadership.",
    quoteAr: "السعي نحو الكمال هو ما يحدد القيادة الحقيقية.",
  },
  {
    image: "/slideshow-optimized/uH9E7Cey9mIy.webp",
    quoteEn: "Heritage and innovation must walk hand in hand.",
    quoteAr: "التراث والابتكار يجب أن يسيرا جنباً إلى جنب.",
  },
  {
    image: "/slideshow-optimized/hOXobwNTfcbv.webp",
    quoteEn: "Time is the most precious commodity we possess.",
    quoteAr: "الوقت هو أثمن سلعة نملكها.",
  },
  {
    image: "/slideshow-optimized/btpcYwiaoBx2.webp",
    quoteEn: "Elegance is the art of being remembered without being loud.",
    quoteAr: "الأناقة هي فن أن تُذكر دون أن تكون صاخبة.",
  },
  {
    image: "/slideshow-optimized/vvLPTZHZb4Ib.webp",
    quoteEn: "A collector's passion is a testament to their vision.",
    quoteAr: "شغف المجمع هو شهادة على رؤيته.",
  },
  {
    image: "/slideshow-optimized/SpV67v1glLG0.webp",
    quoteEn: "Every moment matters; every watch tells a story.",
    quoteAr: "كل لحظة مهمة؛ كل ساعة تحكي قصة.",
  },
  {
    image: "/slideshow-optimized/qOArKA5o5xvv.webp",
    quoteEn: "Luxury is not about excess; it is about excellence.",
    quoteAr: "الفخامة ليست عن الإفراط؛ بل عن التميز.",
  },
  {
    image: "/slideshow-optimized/iSXU64zmoUgr.webp",
    quoteEn: "The true measure of success is the legacy you leave behind.",
    quoteAr: "المقياس الحقيقي للنجاح هو الإرث الذي تتركه وراءك.",
  },
  {
    image: "/slideshow-optimized/zyLtRcxt78ks.webp",
    quoteEn: "Innovation without tradition is progress without purpose.",
    quoteAr: "الابتكار بدون تقليد هو تقدم بدون هدف.",
  },
  {
    image: "/slideshow-optimized/images(1).webp",
    quoteEn: "A leader inspires not by words, but by actions.",
    quoteAr: "القائد يلهم ليس بالكلمات، بل بالأفعال.",
  },
  {
    image: "/slideshow-optimized/images(6).webp",
    quoteEn: "Passion is the fuel that drives extraordinary achievements.",
    quoteAr: "الشغف هو الوقود الذي يدفع الإنجازات الاستثنائية.",
  },
  {
    image: "/slideshow-optimized/images(3).webp",
    quoteEn: "In the pursuit of excellence, there is no finish line.",
    quoteAr: "في السعي نحو التميز، لا توجد خط نهاية.",
  },
  {
    image: "/slideshow-optimized/13.webp",
    quoteEn: "The greatest collections are built on passion, not possession.",
    quoteAr: "أعظم المجموعات تُبنى على الشغف، وليس الملكية.",
  },
];

export function HeroSlideshow() {
  const { isRTL } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const promises = SLIDES.map((slide) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = slide.image;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(promises);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error preloading images:", error);
        setIsLoaded(true); // Continue anyway
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7000); // Change slide every 7 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 12000); // Resume autoplay after 12 seconds
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 12000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 12000);
  };

  const slide = SLIDES[currentSlide];
  const quote = isRTL ? slide.quoteAr : slide.quoteEn;

  if (!isLoaded) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center bg-black">
        <div className="text-gold-400 text-2xl animate-pulse">
          Loading Gallery...
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Floating Gold Particles */}
      <FloatingParticles />

      {/* Slideshow Container with Parallax Effect */}
      <div className="relative w-full h-full">
        {SLIDES.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
              idx === currentSlide 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105"
            }`}
          >
            {/* Background Image - 4K Quality */}
            <img
              src={s.image}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover"
              loading={idx <= 3 ? "eager" : "lazy"}
              style={{
                objectFit: "cover",
              }}
            />

            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          </div>
        ))}
      </div>

      {/* Quote Overlay with Animations */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        <div className="text-center max-w-4xl">
          {/* Crown Icon with Pulse Animation */}
          <div className="mb-8 text-gold-400 text-5xl animate-pulse">
            👑
          </div>

          {/* Quote Text with Fade Animation */}
          <p
            key={currentSlide} // Force re-render for animation
            className={`text-2xl md:text-4xl lg:text-5xl font-light text-white mb-6 leading-relaxed animate-fadeIn ${
              isRTL ? "font-arabic" : ""
            }`}
            dir={isRTL ? "rtl" : "ltr"}
            style={{
              textShadow: "0 4px 12px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)",
            }}
          >
            "{quote}"
          </p>

          {/* Sheikh's Name with Gold Gradient */}
          <p 
            className="text-gold-400 text-xl md:text-2xl font-bold mt-8 animate-fadeIn"
            style={{
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
              animation: "fadeIn 1s ease-in 0.5s both",
            }}
          >
            {isRTL ? "الشيخ عمار بن حميد النعيمي" : "Sheikh Ammar bin Humaid Al Nuaimi"}
          </p>
          
          <p 
            className="text-white/80 text-sm md:text-base mt-2 animate-fadeIn"
            style={{
              animation: "fadeIn 1s ease-in 0.7s both",
            }}
          >
            {isRTL ? "ولي عهد إمارة عجمان" : "Crown Prince of Ajman"}
          </p>
        </div>
      </div>

      {/* Navigation Buttons with Hover Effects */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-gold-400/30 transition-all duration-300 p-4 rounded-full backdrop-blur-md border border-white/20 hover:border-gold-400/50 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-7 h-7 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-gold-400/30 transition-all duration-300 p-4 rounded-full backdrop-blur-md border border-white/20 hover:border-gold-400/50 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-7 h-7 text-white" />
      </button>

      {/* Slide Indicators with Enhanced Design */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2 flex-wrap justify-center max-w-2xl px-4">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`transition-all duration-500 rounded-full ${
              idx === currentSlide
                ? "bg-gold-400 w-12 h-3 shadow-lg shadow-gold-400/50"
                : "bg-white/40 hover:bg-white/70 w-3 h-3 hover:scale-125"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter with Elegant Design */}
      <div className="absolute top-8 right-8 z-20 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
        <span className="text-white/90 text-sm font-light">
          {String(currentSlide + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </span>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
