import { useLanguage } from "@/contexts/LanguageContext";
import { useCreative } from "@/contexts/CreativeContext";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/Header";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Eye, TrendingUp, Calendar, Package, Award } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
// WatchDetail — full bilingual support via LanguageContext

export default function WatchDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t, isRTL } = useLanguage();
  const { isCinematic } = useCreative();
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [dominantColor, setDominantColor] = useState("rgba(212,175,55,0.08)");
  const imgRef = useRef<HTMLImageElement>(null);

  // Extract dominant color from watch image for cinematic background
  const extractColor = useCallback(() => {
    if (!isCinematic || !imgRef.current || !imgRef.current.complete) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(imgRef.current, 0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      setDominantColor(`rgba(${r},${g},${b},0.15)`);
    } catch {
      // CORS or other error — keep default gold
    }
  }, [isCinematic]);

  const { data: watch, isLoading: watchLoading } = trpc.watches.getBySlug.useQuery({ slug: slug! });
  const { data: allBrands } = trpc.brands.getAll.useQuery();
  const brand = allBrands?.find((b) => b.id === watch?.brandId);
  const { data: images } = trpc.watches.getImages.useQuery(
    { watchId: watch?.id! },
    { enabled: !!watch?.id }
  );
  const { data: sheikhPhotos } = trpc.sheikhPhotos.getByWatch.useQuery(
    { watchId: watch?.id! },
    { enabled: !!watch?.id }
  );

  const trackPageView = trpc.analytics.trackPageView.useMutation();

  useEffect(() => {
    if (watch) {
      trackPageView.mutate({
        pageType: "watch_detail",
        pagePath: `/watch/${slug}`,
        watchId: watch.id,
        brandId: watch.brandId,
        sessionId,
        userAgent: navigator.userAgent,
      });
    }
  }, [watch?.id]);

  if (watchLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className={`text-gold-500 text-2xl ${language === "ar" ? "font-arabic" : ""}`}>
            {t("common.loading")}
          </div>
        </div>
      </div>
    );
  }

  if (!watch) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4" dir={isRTL ? "rtl" : "ltr"}>
          <div className={`text-gold-500 text-2xl ${language === "ar" ? "font-arabic" : ""}`}>
            {t("common.watchNotFound")}
          </div>
          <Link href="/collections" className={`text-gray-400 hover:text-gold-500 transition-colors ${language === "ar" ? "font-arabic" : ""}`}>
            {t("common.backToCollections")}
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number | null) => {
    if (!price) return t("common.priceOnRequest");
    return new Intl.NumberFormat(language === "ar" ? "ar-AE" : "en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-black" dir={isRTL ? "rtl" : "ltr"}>
      <Header />

      {/* Hero Section */}
      <section
        className="relative py-16 px-4 bg-gradient-to-b from-black via-gray-900 to-black"
        style={isCinematic ? {
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${dominantColor}, transparent 70%), linear-gradient(to bottom, #000, #111827, #000)`,
          transition: "background 1.5s ease-in-out",
        } : undefined}
      >
        <div className="container max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href={brand ? `/collection/${brand.slug}` : "/collections"} className="inline-flex items-center gap-2 text-gray-400 hover:text-gold-500 transition-colors mb-8">
            {language === "ar" ? (
              <>
                <ArrowRight className="w-5 h-5" />
                <span>العودة للمجموعة</span>
              </>
            ) : (
              <>
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Collection</span>
              </>
            )}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gold-500/30">
                {watch.mainImageUrl ? (
                  <img
                    ref={imgRef}
                    src={watch.mainImageUrl}
                    alt={language === "ar" ? watch.nameAr : watch.nameEn}
                    className={`w-full h-full object-cover${isCinematic ? " transition-transform duration-700 hover:scale-110" : ""}`}
                    crossOrigin="anonymous"
                    onLoad={extractColor}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <Eye className="w-24 h-24" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {watch.rarity && (
                    <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gold-500/50">
                      <span className="text-gold-500 text-sm font-medium">
                        {language === "ar" ? (watch.rarityAr || watch.rarity) : watch.rarity}
                      </span>
                    </div>
                  )}
                  {watch.isFeatured && (
                    <div className="bg-gold-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-gold-500">
                      <span className="text-gold-500 text-sm font-bold">
                        {t("admin.featured")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              {images && images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {images.slice(0, 3).map((img) => (
                    <div
                      key={img.id}
                      className="aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gold-500/20 hover:border-gold-500/50 transition-colors cursor-pointer"
                    >
                      <img
                        src={img.imageUrl}
                        alt={(language === "ar" ? img.captionAr : img.captionEn) || ""}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Watch Info */}
            <div className="space-y-8">
              {/* Brand */}
              {brand && (
                <div>
                  <Link href={`/collection/${brand.slug}`} className="text-gold-500 hover:text-gold-400 transition-colors font-medium">
                    {language === "ar" ? (brand.nameAr || brand.nameEn) : brand.nameEn}
                  </Link>
                </div>
              )}

              {/* Watch Name */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gold-500 mb-4">
                  {language === "ar" ? (watch.nameAr || watch.nameEn) : watch.nameEn}
                </h1>
                {watch.referenceNumber && (
                  <p className="text-gray-400">
                    {t("common.reference")}: {watch.referenceNumber}
                  </p>
                )}
              </div>

              {/* Description */}
              {(watch.descriptionEn || watch.descriptionAr) && (
                <p className="text-gray-300 text-lg leading-relaxed">
                  {language === "ar" ? (watch.descriptionAr || watch.descriptionEn) : (watch.descriptionEn || watch.descriptionAr)}
                </p>
              )}

              {/* Price */}
              <div className="py-6 border-y border-gold-500/20 space-y-3">
                {watch.retailPrice && (
                  <div className="flex items-center gap-4">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">
                        {language === "ar" ? "سعر الريتيل التقريبي" : "Retail Price"}
                      </p>
                      <p className="text-xl font-semibold text-gray-300">{formatPrice(watch.retailPrice)}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <TrendingUp className="w-6 h-6 text-gold-500" />
                  <div>
                    <p className="text-sm text-gray-400">
                      {language === "ar" ? "سعر السوق التقريبي" : "Market Value"}
                    </p>
                    <p className="text-3xl font-bold text-gold-500">{formatPrice(watch.marketValue)}</p>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4">
                <motion.h3
                  className="text-2xl font-bold text-gold-500"
                  initial={isCinematic ? { opacity: 0, x: isRTL ? 30 : -30 } : undefined}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  {t("common.specifications")}
                </motion.h3>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    watch.material && { label: t("common.material"), value: language === "ar" ? (watch.materialAr || watch.material) : watch.material },
                    watch.caseSize && { label: t("common.caseSize"), value: language === "ar" ? (watch.caseSizeAr || watch.caseSize) : watch.caseSize },
                    watch.movement && { label: t("common.movement"), value: language === "ar" ? (watch.movementAr || watch.movement) : watch.movement },
                    watch.dialColor && { label: t("common.dial"), value: language === "ar" ? (watch.dialColorAr || watch.dialColor) : watch.dialColor },
                    watch.waterResistance && { label: t("common.waterResistance"), value: language === "ar" ? (watch.waterResistanceAr || watch.waterResistance) : watch.waterResistance },
                    watch.powerReserve && { label: language === "ar" ? "احتياطي الطاقة" : "Power Reserve", value: watch.powerReserve },
                  ].filter(Boolean).map((spec, idx) => (
                    <motion.div
                      key={idx}
                      className={`bg-gray-900/50 p-4 rounded-lg border border-gold-500/10${isCinematic ? " hover:border-[#d4af37]/40 hover:shadow-[0_4px_20px_rgba(212,175,55,0.1)] transition-all duration-300" : ""}`}
                      initial={isCinematic ? { opacity: 0, y: 20 } : undefined}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: isCinematic ? idx * 0.08 : 0 }}
                      viewport={{ once: true }}
                    >
                      <p className="text-gray-400 text-sm mb-1">{spec!.label}</p>
                      <p className="text-gray-200 font-medium">{spec!.value}</p>
                    </motion.div>
                  ))}

                  {watch.complications && (
                    <motion.div
                      className={`bg-gray-900/50 p-4 rounded-lg border border-gold-500/10 col-span-2${isCinematic ? " hover:border-[#d4af37]/40 hover:shadow-[0_4px_20px_rgba(212,175,55,0.1)] transition-all duration-300" : ""}`}
                      initial={isCinematic ? { opacity: 0, y: 20 } : undefined}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: isCinematic ? 0.5 : 0 }}
                      viewport={{ once: true }}
                    >
                      <p className="text-gray-400 text-sm mb-1">{t("common.complications")}</p>
                      <p className="text-gray-200 font-medium">
                        {language === "ar" ? (watch.complicationsAr || watch.complications) : watch.complications}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Movement Engineering Link */}
              {watch.movement && (
                <Link
                  href={`/movement/${watch.slug}`}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gold-500/30 bg-gold-500/5 hover:bg-gold-500/10 hover:border-gold-500/60 text-gold-500 text-sm font-medium transition-all duration-300 group ${language === "ar" ? "font-arabic" : ""}`}
                >
                  <span className="text-base">⚙️</span>
                  <span>{t("movement.pageTitle")}</span>
                  <ArrowRight className={`w-4 h-4 transition-transform group-hover:${isRTL ? "-translate-x-1" : "translate-x-1"}`} />
                </Link>
              )}

              {/* Additional Info */}
              <div className="flex flex-wrap gap-4">
                {watch.yearReleased && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {t("common.year")}: {watch.yearReleased}
                    </span>
                  </div>
                )}

                {watch.limitedEdition && watch.productionQuantity && (
                  <div className="flex items-center gap-2 text-gold-500">
                    <Package className="w-5 h-5" />
                    <span>
                      {t("common.limitedEdition")}: {watch.productionQuantity}{" "}
                      {language === "ar" ? "قطعة" : "pieces"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      {(watch.storyEn || watch.storyAr) && (
        <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
          <div className="container max-w-4xl mx-auto">
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={isCinematic ? { opacity: 0, x: isRTL ? 40 : -40 } : undefined}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Award className="w-8 h-8 text-gold-500" />
              <h2 className="text-3xl font-bold text-gold-500">
                {t("common.story")}
              </h2>
            </motion.div>
            <motion.div
              className="prose prose-invert prose-lg max-w-none"
              initial={isCinematic ? { opacity: 0, y: 30 } : undefined}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className={`text-gray-300 leading-relaxed text-lg${isCinematic ? " first-letter:text-5xl first-letter:font-serif first-letter:text-[#d4af37] first-letter:float-left first-letter:mr-3 first-letter:mt-1" : ""}`}>
                {language === "ar" ? (watch.storyAr || watch.storyEn) : (watch.storyEn || watch.storyAr)}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Sheikh Photos Section */}
      {sheikhPhotos && sheikhPhotos.length > 0 && (
        <section className="py-20 px-4">
          <div className="container max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gold-500 mb-12 text-center">
              {language === "ar" ? "صور سمو الشيخ عمار مع الساعة" : "His Highness Sheikh Ammar with the Watch"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sheikhPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gold-500/30 hover:border-gold-500/60 transition-all duration-500 group"
                >
                  <img
                    src={photo.imageUrl}
                    alt={(language === "ar" ? photo.captionAr : photo.captionEn) || ""}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {((language === "ar" ? photo.captionAr : photo.captionEn)) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                      <p className="text-gray-200 text-sm">{language === "ar" ? photo.captionAr : photo.captionEn}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gold-500/20 py-8 px-4 mt-20">
        <div className="container max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p className="mb-2">
            {language === "ar"
              ? "الشيخ عمار بن حميد النعيمي"
              : "Sheikh Ammar bin Humaid Al Nuaimi"}
          </p>
          <p>
            {language === "ar" ? "ولي عهد إمارة عجمان" : "Crown Prince of Ajman"}
          </p>
          <p className="mt-4 text-xs">
            © 2025 {language === "ar" ? "جميع الحقوق محفوظة" : "All Rights Reserved"}
          </p>
        </div>
      </footer>
    </div>
  );
}
