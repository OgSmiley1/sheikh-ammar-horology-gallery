import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  image: string;
  quoteEn: string;
  quoteAr: string;
}

const SLIDES: Slide[] = [
  {
    image: "/slideshow/images(1).jpeg",
    quoteEn: "Excellence is not a destination, it is a journey of continuous improvement.",
    quoteAr: "التميز ليس وجهة، بل رحلة من التحسن المستمر.",
  },
  {
    image: "/slideshow/images(2).jpeg",
    quoteEn: "A timepiece is not just an instrument; it is a reflection of one's character.",
    quoteAr: "الساعة ليست مجرد أداة؛ بل انعكاس لشخصية الإنسان.",
  },
  {
    image: "/slideshow/images(3).jpeg",
    quoteEn: "Craftsmanship transcends generations, connecting past, present, and future.",
    quoteAr: "الحرفية تتجاوز الأجيال، وتربط الماضي والحاضر والمستقبل.",
  },
  {
    image: "/slideshow/images(4).jpeg",
    quoteEn: "In every watch, there is a story of dedication and passion.",
    quoteAr: "في كل ساعة، هناك قصة من التفاني والشغف.",
  },
  {
    image: "/slideshow/images(5).jpeg",
    quoteEn: "The pursuit of perfection is what defines true leadership.",
    quoteAr: "السعي نحو الكمال هو ما يحدد القيادة الحقيقية.",
  },
  {
    image: "/slideshow/images(6).jpeg",
    quoteEn: "Heritage and innovation must walk hand in hand.",
    quoteAr: "التراث والابتكار يجب أن يسيرا جنباً إلى جنب.",
  },
  {
    image: "/slideshow/images(7).jpeg",
    quoteEn: "Time is the most precious commodity we possess.",
    quoteAr: "الوقت هو أثمن سلعة نملكها.",
  },
  {
    image: "/slideshow/images(8).jpeg",
    quoteEn: "Elegance is the art of being remembered without being loud.",
    quoteAr: "الأناقة هي فن أن تُذكر دون أن تكون صاخبة.",
  },
  {
    image: "/slideshow/images(9).jpeg",
    quoteEn: "A collector's passion is a testament to their vision.",
    quoteAr: "شغف المجمع هو شهادة على رؤيته.",
  },
  {
    image: "/slideshow/download.jpeg",
    quoteEn: "Every moment matters; every watch tells a story.",
    quoteAr: "كل لحظة مهمة؛ كل ساعة تحكي قصة.",
  },
  {
    image: "/slideshow/download(1).jpeg",
    quoteEn: "Luxury is not about excess; it is about excellence.",
    quoteAr: "الفخامة ليست عن الإفراط؛ بل عن التميز.",
  },
  {
    image: "/slideshow/download(2).jpeg",
    quoteEn: "The true measure of success is the legacy you leave behind.",
    quoteAr: "المقياس الحقيقي للنجاح هو الإرث الذي تتركه وراءك.",
  },
  {
    image: "/slideshow/download(3).jpeg",
    quoteEn: "Innovation without tradition is progress without purpose.",
    quoteAr: "الابتكار بدون تقليد هو تقدم بدون هدف.",
  },
  {
    image: "/slideshow/download(4).jpeg",
    quoteEn: "A leader inspires not by words, but by actions.",
    quoteAr: "القائد يلهم ليس بالكلمات، بل بالأفعال.",
  },
  {
    image: "/slideshow/download(6).jpeg",
    quoteEn: "Passion is the fuel that drives extraordinary achievements.",
    quoteAr: "الشغف هو الوقود الذي يدفع الإنجازات الاستثنائية.",
  },
  {
    image: "/slideshow/download(7).jpeg",
    quoteEn: "In the pursuit of excellence, there is no finish line.",
    quoteAr: "في السعي نحو التميز، لا توجد خط نهاية.",
  },
  {
    image: "/slideshow/13.webp",
    quoteEn: "The greatest collections are built on passion, not possession.",
    quoteAr: "أعظم المجموعات تُبنى على الشغف، وليس الملكية.",
  },
];

export function HeroSlideshow() {
  const { isRTL } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000); // Resume autoplay after 10 seconds
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const slide = SLIDES[currentSlide];
  const quote = isRTL ? slide.quoteAr : slide.quoteEn;

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Slideshow Container */}
      <div className="relative w-full h-full">
        {SLIDES.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <img
              src={s.image}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover"
              loading={idx <= 2 ? "eager" : "lazy"}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
          </div>
        ))}
      </div>

      {/* Quote Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        <div className="text-center max-w-2xl">
          {/* Crown Icon */}
          <div className="mb-6 text-gold-400 text-4xl animate-pulse">
            👑
          </div>

          {/* Quote Text */}
          <p
            className={`text-2xl md:text-4xl font-light text-white mb-4 leading-relaxed ${
              isRTL ? "font-arabic" : ""
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            "{quote}"
          </p>

          {/* Sheikh's Name */}
          <p className="text-gold-400 text-lg font-semibold mt-6">
            {isRTL ? "الشيخ عمار بن حميد النعيمي" : "Sheikh Ammar bin Humaid Al Nuaimi"}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 transition-all p-3 rounded-full backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 transition-all p-3 rounded-full backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 flex-wrap justify-center max-w-lg">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentSlide
                ? "bg-gold-400 w-3 h-3"
                : "bg-white/40 hover:bg-white/60 w-2 h-2"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 z-20 text-white/80 text-sm font-light">
        {currentSlide + 1} / {SLIDES.length}
      </div>
    </div>
  );
}
