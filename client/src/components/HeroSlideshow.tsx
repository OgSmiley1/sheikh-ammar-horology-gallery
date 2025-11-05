import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FloatingParticles } from "./FloatingParticles";

interface Slide {
  image: string;
  quoteEn: string;
  quoteAr: string;
}

// 20 slides with Sheikh Ammar's actual personal pictures
const SLIDES: Slide[] = [
  {
    image: "/slideshow-sheikh-only/slide-01.webp",
    quoteEn: "Excellence is not a destination, it is a journey of continuous improvement.",
    quoteAr: "التميز ليس وجهة، بل رحلة من التحسن المستمر.",
  },
  {
    image: "/slideshow-sheikh-only/slide-02.webp",
    quoteEn: "Luxury is not about excess; it is about excellence.",
    quoteAr: "الفخامة ليست عن الإفراط؛ بل عن التميز.",
  },
  {
    image: "/slideshow-sheikh-only/slide-03.webp",
    quoteEn: "The true measure of success is the legacy you leave behind.",
    quoteAr: "المقياس الحقيقي للنجاح هو الإرث الذي تتركه وراءك.",
  },
  {
    image: "/slideshow-sheikh-only/slide-04.webp",
    quoteEn: "A timepiece is not just an instrument; it is a reflection of one's character.",
    quoteAr: "الساعة ليست مجرد أداة؛ بل انعكاس لشخصية الإنسان.",
  },
  {
    image: "/slideshow-sheikh-only/slide-05.webp",
    quoteEn: "Innovation without tradition is progress without purpose.",
    quoteAr: "الابتكار بدون تقليد هو تقدم بدون هدف.",
  },
  {
    image: "/slideshow-sheikh-only/slide-06.webp",
    quoteEn: "Elegance is the art of being remembered without being loud.",
    quoteAr: "الأناقة هي فن أن تُذكر دون أن تكون صاخبة.",
  },
  {
    image: "/slideshow-sheikh-only/slide-07.webp",
    quoteEn: "Time is the most precious commodity we possess.",
    quoteAr: "الوقت هو أثمن سلعة نملكها.",
  },
  {
    image: "/slideshow-sheikh-only/slide-08.webp",
    quoteEn: "Every moment matters; every watch tells a story.",
    quoteAr: "كل لحظة مهمة؛ كل ساعة تحكي قصة.",
  },
  {
    image: "/slideshow-sheikh-only/slide-09.webp",
    quoteEn: "In every watch, there is a story of dedication and passion.",
    quoteAr: "في كل ساعة، هناك قصة من التفاني والشغف.",
  },
  {
    image: "/slideshow-sheikh-only/slide-10.webp",
    quoteEn: "Craftsmanship transcends generations, connecting past, present, and future.",
    quoteAr: "الحرفية تتجاوز الأجيال، وتربط الماضي والحاضر والمستقبل.",
  },
  {
    image: "/slideshow-sheikh-only/slide-11.webp",
    quoteEn: "The pursuit of perfection is what defines true leadership.",
    quoteAr: "السعي نحو الكمال هو ما يحدد القيادة الحقيقية.",
  },
  {
    image: "/slideshow-sheikh-only/slide-12.webp",
    quoteEn: "Heritage and innovation must walk hand in hand.",
    quoteAr: "التراث والابتكار يجب أن يسيرا جنباً إلى جنب.",
  },
  {
    image: "/slideshow-sheikh-only/slide-13.webp",
    quoteEn: "A leader inspires not by words, but by actions.",
    quoteAr: "القائد يلهم ليس بالكلمات، بل بالأفعال.",
  },
  {
    image: "/slideshow-sheikh-only/slide-14.webp",
    quoteEn: "Passion is the fuel that drives extraordinary achievements.",
    quoteAr: "الشغف هو الوقود الذي يدفع الإنجازات الاستثنائية.",
  },
  {
    image: "/slideshow-sheikh-only/slide-15.webp",
    quoteEn: "In the pursuit of excellence, there is no finish line.",
    quoteAr: "في السعي نحو التميز، لا توجد خط نهاية.",
  },
  {
    image: "/slideshow-sheikh-only/slide-16.webp",
    quoteEn: "A collector's passion is a testament to their vision.",
    quoteAr: "شغف المجمع هو شهادة على رؤيته.",
  },
  {
    image: "/slideshow-sheikh-only/slide-17.webp",
    quoteEn: "Wisdom is the crown of knowledge and experience.",
    quoteAr: "الحكمة هي تاج المعرفة والخبرة.",
  },
  {
    image: "/slideshow-sheikh-only/slide-18.webp",
    quoteEn: "True leadership is measured by the legacy you leave.",
    quoteAr: "القيادة الحقيقية تُقاس بالإرث الذي تتركه.",
  },
  {
    image: "/slideshow-sheikh-only/slide-19.webp",
    quoteEn: "Excellence begins with attention to the smallest details.",
    quoteAr: "التميز يبدأ بالاهتمام بأصغر التفاصيل.",
  },
  {
    image: "/slideshow-sheikh-only/slide-20.webp",
    quoteEn: "Patience and perseverance unlock every door.",
    quoteAr: "الصبر والمثابرة يفتحان كل باب.",
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
        setIsLoaded(true);
      }
    };

    preloadImages();
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setIsAutoPlay(false);
  };

  if (!isLoaded) {
    return (
      <div className="relative h-screen w-full bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#d4af37] text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      <FloatingParticles />

      {/* Crown and Initials - Top Left */}
      <div className="absolute top-8 left-8 z-30 flex items-center gap-3">
        <span className="text-[#d4af37] text-4xl md:text-5xl font-serif font-bold tracking-wider">
          SA
        </span>
        <span className="text-5xl md:text-6xl">👑</span>
      </div>

      {/* Slides */}
      <div className="relative h-full w-full">
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
                filter: "brightness(0.7) contrast(1.1)",
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

            {/* Content Container */}
            <div className="relative h-full flex flex-col justify-end items-center pb-32 px-8">
              {/* Quote - Below Picture */}
              <div className="max-w-4xl text-center space-y-4">
                <p className="text-white text-2xl md:text-4xl lg:text-5xl font-serif leading-relaxed drop-shadow-2xl">
                  "{isRTL ? slide.quoteAr : slide.quoteEn}"
                </p>

                {/* Sheikh Name */}
                <div className="mt-8 space-y-2">
                  <h2 className="text-[#d4af37] text-3xl md:text-4xl font-serif font-bold drop-shadow-lg">
                    Sheikh Ammar bin Humaid Al Nuaimi
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl">
                    Crown Prince of Ajman
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 md:p-4 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 md:p-4 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 flex-wrap justify-center max-w-2xl px-4">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-[#d4af37] w-8"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 z-30 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
        <span className="text-[#d4af37] font-semibold">
          {String(currentSlide + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
