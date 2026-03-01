import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/Header";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, TrendingUp, Award, Clock } from "lucide-react";

export default function SheikhGallery() {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: allPhotos } = trpc.sheikhPhotos.getAll.useQuery();
  const { data: allWatches } = trpc.watches.getAll.useQuery();
  const { data: allBrands } = trpc.brands.getAll.useQuery();

  // Photos that have a watchId association
  const photosWithWatches = (allPhotos || []).filter((p) => p.watchId);
  // Photos without a watch link
  const photosGeneral = (allPhotos || []).filter((p) => !p.watchId);
  const allDisplay = [...photosWithWatches, ...photosGeneral];

  const currentPhoto = allDisplay[currentIndex] ?? null;
  const linkedWatch = currentPhoto?.watchId
    ? allWatches?.find((w) => w.id === currentPhoto.watchId)
    : null;
  const linkedBrand = linkedWatch
    ? allBrands?.find((b) => b.id === linkedWatch.brandId)
    : null;

  const formatPrice = (price: number | null) => {
    if (!price) return language === "ar" ? "السعر عند الطلب" : "Price on Request";
    return new Intl.NumberFormat(language === "ar" ? "ar-AE" : "en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const prev = () => setCurrentIndex((i) => (i - 1 + allDisplay.length) % allDisplay.length);
  const next = () => setCurrentIndex((i) => (i + 1) % allDisplay.length);

  // Static gallery items showcasing the collection (shown when no DB photos)
  const staticGalleryItems = [
    {
      imageUrl: "/images/sheikh/IMG_7787(1).png",
      captionEn: "His Highness Sheikh Ammar bin Humaid Al Nuaimi at an official ceremony, wearing the Richard Mille RM 26-02 Tourbillon Evil Eye — one of only 30 pieces ever produced worldwide.",
      captionAr: "سمو الشيخ عمار بن حميد النعيمي في مراسم رسمية، يرتدي ريتشارد ميل RM 26-02 توربيون عين الشر — واحدة من 30 قطعة فقط أُنتجت في العالم.",
      watchNameEn: "Richard Mille RM 26-02 Tourbillon Evil Eye",
      watchNameAr: "ريتشارد ميل RM 26-02 توربيون عين الشر",
      brandEn: "Richard Mille",
      brandAr: "ريتشارد ميل",
      price: 950000,
      rarity: "Ultra Rare — 30 pieces",
    },
    {
      imageUrl: "/images/sheikh/IMG_7788(1).png",
      captionEn: "Sheikh Ammar at an international summit with world leaders, wearing the Patek Philippe Nautilus 5711/1300A with olive-green dial and diamond bezel — the last of its legendary reference.",
      captionAr: "الشيخ عمار في قمة دولية مع زعماء العالم، يرتدي باتيك فيليب ناوتيلوس 5711/1300A بالميناء الأخضر الزيتوني وإطار ماسي — الأخير من مرجعه الأسطوري.",
      watchNameEn: "Patek Philippe Nautilus 5711/1300A Olive Green Diamond",
      watchNameAr: "باتيك فيليب ناوتيلوس 5711/1300A أخضر زيتوني ماسي",
      brandEn: "Patek Philippe",
      brandAr: "باتيك فيليب",
      price: 525000,
      rarity: "Extremely Rare",
    },
    {
      imageUrl: "/images/sheikh/IMG_7789(1).png",
      captionEn: "A diplomatic meeting in Abu Dhabi. His Highness wears the Patek Philippe 5470P — the groundbreaking chronograph measuring time to 1/10th of a second, crafted in Platinum 950.",
      captionAr: "اجتماع دبلوماسي في أبوظبي. سموه يرتدي باتيك فيليب 5470P — الكرونوغراف الرائد الذي يقيس الوقت بدقة 1/10 من الثانية، مصنوع من البلاتين 950.",
      watchNameEn: "Patek Philippe 5470P Chronograph",
      watchNameAr: "باتيك فيليب 5470P كرونوغراف",
      brandEn: "Patek Philippe",
      brandAr: "باتيك فيليب",
      price: 500000,
      rarity: "Extremely Rare",
    },
    {
      imageUrl: "/images/sheikh/IMG_7791(1).png",
      captionEn: "Sheikh Ammar at the World Economic Forum. On his wrist: the Audemars Piguet Royal Oak Perpetual Calendar in blue ceramic — the first Royal Oak ever crafted entirely in ceramic, accurate until year 2100.",
      captionAr: "الشيخ عمار في المنتدى الاقتصادي العالمي. على معصمه: أوديمار بيغيه رويال أوك التقويم الدائم من السيراميك الأزرق — أول رويال أوك تقويم دائم مصنوعة بالكامل من السيراميك، دقيقة حتى عام 2100.",
      watchNameEn: "Audemars Piguet Royal Oak Perpetual Calendar Blue Ceramic",
      watchNameAr: "أوديمار بيغيه رويال أوك التقويم الدائم سيراميك أزرق",
      brandEn: "Audemars Piguet",
      brandAr: "أوديمار بيغيه",
      price: 250000,
      rarity: "Rare",
    },
    {
      imageUrl: "/images/sheikh/IMG_7792(1).png",
      captionEn: "A historic moment at the UAE National Day celebration. Sheikh Ammar wears the F.P. Journe Chronomètre à Résonance — an extraordinary feat of mechanics, limited to 300 pieces worldwide.",
      captionAr: "لحظة تاريخية في احتفالات اليوم الوطني الإماراتي. الشيخ عمار يرتدي إف بي جورن كرونومتر ريزونانس — إنجاز ميكانيكي استثنائي، محدود بـ 300 قطعة في العالم.",
      watchNameEn: "F.P. Journe Chronomètre à Résonance",
      watchNameAr: "إف بي جورن كرونومتر ريزونانس",
      brandEn: "F.P. Journe",
      brandAr: "إف بي جورن",
      price: 340000,
      rarity: "Extremely Rare",
    },
    {
      imageUrl: "/images/sheikh/IMG_7794(1).png",
      captionEn: "Sheikh Ammar with international business leaders. His wrist bears the Richard Mille RM 68-01 Cyril Kongo — a hand-painted graffiti masterpiece limited to just 30 pieces, valued at over $2.5 million.",
      captionAr: "الشيخ عمار مع قادة الأعمال الدوليين. يرتدي ريتشارد ميل RM 68-01 سيريل كونغو — تحفة فنية مرسومة يدويًا بالجرافيتي محدودة بـ 30 قطعة فقط، تُقدَّر قيمتها بأكثر من 2.5 مليون دولار.",
      watchNameEn: "Richard Mille RM 68-01 Cyril Kongo",
      watchNameAr: "ريتشارد ميل RM 68-01 سيريل كونغو",
      brandEn: "Richard Mille",
      brandAr: "ريتشارد ميل",
      price: 2500000,
      rarity: "Ultra Rare — 30 pieces",
    },
    {
      imageUrl: "/images/sheikh/IMG_7796.jpeg",
      captionEn: "A bilateral meeting in Geneva, Switzerland. His Highness wears the Patek Philippe World Time 5527G Manama Edition — specially commissioned to commemorate the Bahrain International Airshow, featuring a cloisonné enamel dial depicting the Manama skyline.",
      captionAr: "اجتماع ثنائي في جنيف، سويسرا. سموه يرتدي باتيك فيليب التوقيت العالمي 5527G إصدار المنامة — مُكلَّف خصيصًا للاحتفال بمعرض البحرين الدولي للطيران، يتميز بميناء مينا يصور أفق مدينة المنامة.",
      watchNameEn: "Patek Philippe World Time 5527G Manama Edition",
      watchNameAr: "باتيك فيليب التوقيت العالمي 5527G إصدار المنامة",
      brandEn: "Patek Philippe",
      brandAr: "باتيك فيليب",
      price: 250000,
      rarity: "Very Rare",
    },
    {
      imageUrl: "/images/sheikh/IMG_7797(1).jpeg",
      captionEn: "His Highness Sheikh Ammar at a Formula 1 Grand Prix. On his wrist gleams the Richard Mille RM 65-01 Automatic Split-Seconds Chronograph — the first ever RM automatic rattrapante, limited to 150 pieces.",
      captionAr: "سمو الشيخ عمار في سباق الفورمولا 1 للجائزة الكبرى. على معصمه يتلألأ ريتشارد ميل RM 65-01 كرونوغراف أوتوماتيكي مقسم الثواني — أول راتراب أوتوماتيكي من ريتشارد ميل، محدود بـ 150 قطعة.",
      watchNameEn: "Richard Mille RM 65-01 Automatic Split-Seconds Chronograph",
      watchNameAr: "ريتشارد ميل RM 65-01 كرونوغراف مقسم الثواني",
      brandEn: "Richard Mille",
      brandAr: "ريتشارد ميل",
      price: 1100000,
      rarity: "Ultra Rare — 150 pieces",
    },
    {
      imageUrl: "/images/sheikh/IMG_7798(1).png",
      captionEn: "An exclusive gala dinner in Dubai. Sheikh Ammar wears the Audemars Piguet Royal Oak Salmon Dial Tourbillon in 18K rose gold — a flying tourbillon that beats at the 6 o'clock position, visible through the open-worked dial.",
      captionAr: "حفل عشاء حصري في دبي. الشيخ عمار يرتدي أوديمار بيغيه رويال أوك توربيون ميناء سلموني من الذهب الوردي عيار 18 قيراطًا — توربيون طائر يدق عند موضع الساعة السادسة.",
      watchNameEn: "Audemars Piguet Royal Oak Salmon Dial Tourbillon",
      watchNameAr: "أوديمار بيغيه رويال أوك توربيون ميناء سلموني",
      brandEn: "Audemars Piguet",
      brandAr: "أوديمار بيغيه",
      price: 380000,
      rarity: "Very Rare",
    },
    {
      imageUrl: "/images/sheikh/IMG_7799(1).png",
      captionEn: "Sheikh Ammar at a state visit with the President of the Republic. His wrist is adorned with the Rolex GMT-Master II 'Pepsi' with Meteorite dial in 18K white gold — a combination of billion-year-old cosmic material and Swiss precision.",
      captionAr: "الشيخ عمار في زيارة رسمية مع رئيس الجمهورية. تزيّن معصمه رولكس GMT-ماستر II 'بيبسي' بميناء نيزكي من الذهب الأبيض — مزيج من مادة كونية تبلغ من العمر مليارات السنين والدقة السويسرية.",
      watchNameEn: "Rolex GMT-Master II 'Pepsi' Meteorite Dial",
      watchNameAr: "رولكس GMT-ماستر II 'بيبسي' ميناء نيزكي",
      brandEn: "Rolex",
      brandAr: "رولكس",
      price: 130000,
      rarity: "Extremely Rare",
    },
  ];

  const hasDBPhotos = allDisplay.length > 0;
  const displayItems = hasDBPhotos
    ? allDisplay.map((p) => {
        const w = allWatches?.find((w) => w.id === p.watchId);
        const b = w ? allBrands?.find((b) => b.id === w.brandId) : null;
        return {
          imageUrl: p.imageUrl,
          captionEn: p.captionEn || "",
          captionAr: p.captionAr || "",
          watchNameEn: w ? w.nameEn : "",
          watchNameAr: w ? (w.nameAr || w.nameEn) : "",
          brandEn: b ? b.nameEn : "",
          brandAr: b ? (b.nameAr || b.nameEn) : "",
          price: w?.marketValue || null,
          rarity: w?.rarity || "",
          slug: w?.slug,
          brandSlug: b?.slug,
        };
      })
    : staticGalleryItems;

  const current = displayItems[currentIndex] ?? displayItems[0];
  const total = displayItems.length;

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero Banner */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-b from-black via-gray-900/50 to-black text-center">
        <div className="container max-w-4xl mx-auto">
          <p className="text-gold-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            {language === "ar" ? "معرض حصري" : "Exclusive Gallery"}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {language === "ar" ? "الشيخ مع الساعات" : "Sheikh with Watches"}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            {language === "ar"
              ? "لحظات حصرية تجسد صاحب السمو مع أندر الساعات في مجموعته الملكية"
              : "Exclusive moments capturing His Highness with the rarest timepieces in the Royal Collection"}
          </p>
        </div>
      </section>

      {/* Main Carousel */}
      <section className="py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gold-500/20">
            {/* Counter */}
            <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gold-500/30">
              <span className="text-gold-500 text-sm font-bold">
                {currentIndex + 1} / {total}
              </span>
            </div>

            {/* Price Tag */}
            {current?.price && (
              <div className="absolute top-4 right-4 z-10 bg-gold-500/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-black text-sm font-bold">
                  {formatPrice(current.price)}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
              {/* Image */}
              <div className="relative overflow-hidden min-h-[350px] lg:min-h-[500px]">
                {current?.imageUrl ? (
                  <img
                    src={current.imageUrl}
                    alt={language === "ar" ? current.captionAr : current.captionEn}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <Clock className="w-24 h-24 text-gold-500/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 pointer-events-none" />
              </div>

              {/* Info Panel */}
              <div className="flex flex-col justify-center p-8 lg:p-12 space-y-6">
                {/* Brand */}
                {(current?.brandEn || current?.brandAr) && (
                  <div>
                    {(current as any).brandSlug ? (
                      <Link to={`/collection/${(current as any).brandSlug}`} className="text-gold-500 hover:text-gold-400 transition-colors text-sm font-semibold tracking-widest uppercase">
                        {language === "ar" ? (current.brandAr || current.brandEn) : current.brandEn}
                      </Link>
                    ) : (
                      <span className="text-gold-500 text-sm font-semibold tracking-widest uppercase">
                        {language === "ar" ? (current.brandAr || current.brandEn) : current.brandEn}
                      </span>
                    )}
                  </div>
                )}

                {/* Watch Name */}
                {(current?.watchNameEn || current?.watchNameAr) && (
                  <div>
                    {(current as any).slug ? (
                      <Link to={`/watch/${(current as any).slug}`} className="block">
                        <h2 className="text-3xl md:text-4xl font-bold text-white hover:text-gold-400 transition-colors">
                          {language === "ar" ? (current.watchNameAr || current.watchNameEn) : current.watchNameEn}
                        </h2>
                      </Link>
                    ) : (
                      <h2 className="text-3xl md:text-4xl font-bold text-white">
                        {language === "ar" ? (current.watchNameAr || current.watchNameEn) : current.watchNameEn}
                      </h2>
                    )}
                  </div>
                )}

                {/* Caption */}
                {(current?.captionEn || current?.captionAr) && (
                  <p className="text-gray-300 text-base leading-relaxed">
                    {language === "ar" ? (current.captionAr || current.captionEn) : (current.captionEn || current.captionAr)}
                  </p>
                )}

                {/* Stats Row */}
                <div className="flex flex-wrap gap-6 pt-4 border-t border-gold-500/20">
                  {current?.price && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-gold-500" />
                      <div>
                        <p className="text-xs text-gray-500">{language === "ar" ? "القيمة السوقية" : "Market Value"}</p>
                        <p className="text-lg font-bold text-gold-500">{formatPrice(current.price)}</p>
                      </div>
                    </div>
                  )}
                  {current?.rarity && (
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-gold-500" />
                      <div>
                        <p className="text-xs text-gray-500">{language === "ar" ? "الندرة" : "Rarity"}</p>
                        <p className="text-sm font-semibold text-white">{current.rarity}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* View Details Button */}
                {(current as any).slug && (
                  <Link to={`/watch/${(current as any).slug}`} className="inline-flex items-center gap-2 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/40 hover:border-gold-500 text-gold-500 px-6 py-3 rounded-lg transition-all duration-300 font-semibold w-fit">
                    {language === "ar" ? "عرض التفاصيل الكاملة" : "View Full Details"}
                    {language === "ar" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Link>
                )}
              </div>
            </div>

            {/* Navigation Arrows */}
            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-gold-500/20 border border-gold-500/30 hover:border-gold-500 rounded-full flex items-center justify-center text-gold-500 transition-all z-10"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-gold-500/20 border border-gold-500/30 hover:border-gold-500 rounded-full flex items-center justify-center text-gold-500 transition-all z-10"
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Dot indicators */}
          {total > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {displayItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "bg-gold-500 w-6" : "bg-gray-600 hover:bg-gray-400"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Collection Highlights */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gold-500 mb-8 text-center">
            {language === "ar" ? "مجموعة ملكية" : "Royal Collection Highlights"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <TrendingUp className="w-8 h-8" />,
                titleEn: "Portfolio Value",
                titleAr: "قيمة المحفظة",
                valueEn: "$5,000,000+",
                valueAr: "أكثر من ٥,٠٠٠,٠٠٠ $",
                descEn: "Estimated total collection market value",
                descAr: "القيمة السوقية التقديرية للمجموعة الكاملة",
              },
              {
                icon: <Award className="w-8 h-8" />,
                titleEn: "Deep Expertise",
                titleAr: "خبرة عميقة",
                valueEn: "30 Timepieces",
                valueAr: "30 ساعة فاخرة",
                descEn: "Comprehensive knowledge of each piece's history and value",
                descAr: "معرفة شاملة بتاريخ وقيمة كل ساعة",
              },
              {
                icon: <Clock className="w-8 h-8" />,
                titleEn: "Exceptional Taste",
                titleAr: "تقدير استثنائي",
                valueEn: "Ultra Rare Pieces",
                valueAr: "قطع نادرة للغاية",
                descEn: "Investments that grow in value over time",
                descAr: "استثمارات تزداد قيمتها بمرور الوقت",
              },
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-900 to-black border border-gold-500/20 rounded-xl p-6 text-center hover:border-gold-500/50 transition-all">
                <div className="text-gold-500 flex justify-center mb-4">{item.icon}</div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                  {language === "ar" ? item.titleAr : item.titleEn}
                </p>
                <p className="text-xl font-bold text-white mb-2">
                  {language === "ar" ? item.valueAr : item.valueEn}
                </p>
                <p className="text-gray-400 text-sm">
                  {language === "ar" ? item.descAr : item.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gold-500/20 py-8 px-4 mt-8">
        <div className="container max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p className="mb-2">
            {language === "ar" ? "الشيخ عمار بن حميد النعيمي" : "Sheikh Ammar bin Humaid Al Nuaimi"}
          </p>
          <p>{language === "ar" ? "ولي عهد إمارة عجمان" : "Crown Prince of Ajman"}</p>
          <p className="mt-4 text-xs">
            © 2025 {language === "ar" ? "جميع الحقوق محفوظة" : "All Rights Reserved"}
          </p>
        </div>
      </footer>
    </div>
  );
}
