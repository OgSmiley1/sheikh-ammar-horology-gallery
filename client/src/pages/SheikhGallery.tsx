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
      imageUrl: "/personal/sheikh-with-father.jpg",
      captionEn: "Sheikh Ammar with a treasured piece from the Royal Collection",
      captionAr: "الشيخ عمار مع قطعة ثمينة من المجموعة الملكية",
      watchNameEn: "Patek Philippe Nautilus",
      watchNameAr: "باتيك فيليب ناوتيلوس",
      brandEn: "Patek Philippe",
      brandAr: "باتيك فيليب",
      price: 420000,
      rarity: "Extremely Rare",
    },
    {
      imageUrl: "/personal/sheikh-with-mbz.jpg",
      captionEn: "An exclusive moment with a Richard Mille from the Royal Collection",
      captionAr: "لحظة حصرية مع ساعة ريتشارد ميل من المجموعة الملكية",
      watchNameEn: "Richard Mille RM 26-02 Tourbillon Evil Eye",
      watchNameAr: "ريتشارد ميل RM 26-02 توربيون العين الشريرة",
      brandEn: "Richard Mille",
      brandAr: "ريتشارد ميل",
      price: 950000,
      rarity: "Ultra Rare — 30 pieces",
    },
    {
      imageUrl: "/personal/sheikh-formal-conference.jpg",
      captionEn: "His Highness Sheikh Ammar wearing the Richard Mille RM 67-01 Extra Flat",
      captionAr: "سمو الشيخ عمار يرتدي ريتشارد ميل RM 67-01 رفيع استثنائي",
      watchNameEn: "Richard Mille RM 67-01 Extra Flat",
      watchNameAr: "ريتشارد ميل RM 67-01 رفيع استثنائي",
      brandEn: "Richard Mille",
      brandAr: "ريتشارد ميل",
      price: 220000,
      rarity: "Very Rare",
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
                      <Link href={`/collection/${(current as any).brandSlug}`} className="text-gold-500 hover:text-gold-400 transition-colors text-sm font-semibold tracking-widest uppercase">
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
                      <Link href={`/watch/${(current as any).slug}`} className="block">
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
                  <Link href={`/watch/${(current as any).slug}`} className="inline-flex items-center gap-2 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/40 hover:border-gold-500 text-gold-500 px-6 py-3 rounded-lg transition-all duration-300 font-semibold w-fit">
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
                valueEn: "$680,000 – $950,000",
                valueAr: "٦٨٠,٠٠٠ $ – ٩٥٠,٠٠٠ $",
                descEn: "Estimated value of featured pieces",
                descAr: "القيمة التقديرية للقطع المعروضة",
              },
              {
                icon: <Award className="w-8 h-8" />,
                titleEn: "Deep Expertise",
                titleAr: "خبرة عميقة",
                valueEn: "28+ Timepieces",
                valueAr: "أكثر من 28 ساعة",
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
