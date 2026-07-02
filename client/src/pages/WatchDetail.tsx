import { useLanguage } from "@/contexts/LanguageContext";
import { useCreative } from "@/contexts/CreativeContext";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Eye, TrendingUp, Calendar, Package, Award } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function WatchDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t, isRTL } = useLanguage();
  const { isCinematic } = useCreative();
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [dominantColor, setDominantColor] = useState("rgba(212,175,55,0.08)");
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const extractColor = useCallback(() => {
    if (!isCinematic || !imgRef.current || !imgRef.current.complete) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(imgRef.current, 0, 0, 1, 1);
      const { data } = ctx.getImageData(0, 0, 1, 1);
      const [r, g, b] = [data[0], data[1], data[2]];
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

  // Set active image to main image when watch loads
  useEffect(() => {
    if (watch?.mainImageUrl) setActiveImage(watch.mainImageUrl);
  }, [watch?.mainImageUrl]);

  if (watchLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className={`text-gold-500 text-2xl font-serif ${language === "ar" ? "font-arabic" : ""}`}>
            {t("common.loading")}
          </div>
        </div>
      </div>
    );
  }

  if (!watch) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4" dir={isRTL ? "rtl" : "ltr"}>
          <div className={`text-gold-500 text-2xl font-serif ${language === "ar" ? "font-arabic" : ""}`}>
            {t("common.watchNotFound")}
          </div>
          <Link href="/collections" className={`text-[#f5f2e8]/40 hover:text-gold-500 transition-colors ${language === "ar" ? "font-arabic" : ""}`}>
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

  const displayImage = activeImage || watch.mainImageUrl;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Header />

      {/* Hero Section */}
      <section
        className="relative pt-32 pb-20 px-4 overflow-hidden"
        style={
          isCinematic
            ? {
                background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${dominantColor}, transparent 70%)`,
                transition: "background 1.5s ease-in-out",
              }
            : undefined
        }
      >
        {/* Dot texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.018]"
          style={{
            backgroundImage: "radial-gradient(circle, #d4af37 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
          aria-hidden="true"
        />

        <div className="container max-w-7xl mx-auto relative z-10">
          {/* Back Button */}
          <Link
            href={brand ? `/collection/${brand.slug}` : "/collections"}
            className="inline-flex items-center gap-2 text-[#f5f2e8]/40 hover:text-gold-500 transition-colors mb-10 text-sm"
          >
            {language === "ar" ? (
              <>
                <ArrowRight className="w-4 h-4" />
                <span>العودة للمجموعة</span>
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Collection</span>
              </>
            )}
          </Link>

          <div className={`flex flex-col ${isRTL ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 lg:gap-20 items-start`}>
            {/* Image Gallery */}
            <motion.div
              className="space-y-4 w-full lg:w-1/2"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
            >
              {/* Main Image */}
              <div
                className="relative aspect-square rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(10,10,10,0.9)",
                  boxShadow: "0 28px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.09)",
                }}
              >
                {displayImage ? (
                  <img
                    ref={imgRef}
                    src={displayImage}
                    alt={language === "ar" ? (watch.nameAr || watch.nameEn) : watch.nameEn}
                    className={`w-full h-full object-cover${isCinematic ? " transition-transform duration-700 hover:scale-105" : ""}`}
                    crossOrigin="anonymous"
                    onLoad={extractColor}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#f5f2e8]/10">
                    <Eye className="w-24 h-24" />
                  </div>
                )}

                {/* Corner accents */}
                <div className="absolute top-4 start-4 w-5 h-5 border-t border-s border-[#d4af37]/35 pointer-events-none" />
                <div className="absolute top-4 end-4 w-5 h-5 border-t border-e border-[#d4af37]/35 pointer-events-none" />
                <div className="absolute bottom-4 start-4 w-5 h-5 border-b border-s border-[#d4af37]/35 pointer-events-none" />
                <div className="absolute bottom-4 end-4 w-5 h-5 border-b border-e border-[#d4af37]/35 pointer-events-none" />

                {/* Badges */}
                <div className="absolute top-4 end-10 flex flex-col gap-2">
                  {watch.rarity && (
                    <div className="bg-background/85 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gold-500/40">
                      <span className="text-gold-500 text-xs font-medium">
                        {language === "ar" ? (watch.rarityAr || watch.rarity) : watch.rarity}
                      </span>
                    </div>
                  )}
                  {watch.isFeatured && (
                    <div className="bg-gold-500/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gold-500/60">
                      <span className="text-gold-500 text-xs font-bold">
                        {t("admin.featured")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {images && images.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {/* Main image thumbnail */}
                  {watch.mainImageUrl && (
                    <button
                      onClick={() => setActiveImage(watch.mainImageUrl!)}
                      className={`aspect-square rounded-lg overflow-hidden border transition-all duration-300 ${
                        activeImage === watch.mainImageUrl
                          ? "border-gold-500"
                          : "border-[#d4af37]/15 hover:border-[#d4af37]/40"
                      }`}
                      style={{ background: "rgba(10,10,10,0.9)" }}
                    >
                      <img src={watch.mainImageUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  )}
                  {images.slice(0, 3).map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(img.imageUrl)}
                      className={`aspect-square rounded-lg overflow-hidden border transition-all duration-300 ${
                        activeImage === img.imageUrl
                          ? "border-gold-500"
                          : "border-[#d4af37]/15 hover:border-[#d4af37]/40"
                      }`}
                      style={{ background: "rgba(10,10,10,0.9)" }}
                    >
                      <img
                        src={img.imageUrl}
                        alt={(language === "ar" ? img.captionAr : img.captionEn) || ""}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Watch Info */}
            <motion.div
              className="space-y-7 w-full lg:w-1/2"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.15}
            >
              {/* Brand */}
              {brand && (
                <div>
                  <p className="text-[10px] text-gold-500/55 tracking-[0.45em] uppercase font-medium mb-1">
                    {isRTL ? "العلامة التجارية" : "Maison"}
                  </p>
                  <Link
                    href={`/collection/${brand.slug}`}
                    className="text-gold-500 hover:text-gold-400 transition-colors text-sm font-medium"
                  >
                    {language === "ar" ? (brand.nameAr || brand.nameEn) : brand.nameEn}
                  </Link>
                </div>
              )}

              {/* Watch Name */}
              <div>
                <h1
                  className={`text-[#f5f2e8] mb-2 ${language === "ar" ? "font-arabic" : ""}`}
                  style={{
                    fontFamily: isRTL ? undefined : "Playfair Display, Georgia, serif",
                    fontSize: "clamp(1.75rem, 4vw, 3rem)",
                    fontWeight: 600,
                    lineHeight: 1.15,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {language === "ar" ? (watch.nameAr || watch.nameEn) : watch.nameEn}
                </h1>
                {watch.referenceNumber && (
                  <p className="text-[#f5f2e8]/35 text-sm tracking-wider">
                    {t("common.reference")}: {watch.referenceNumber}
                  </p>
                )}
                <div className="h-px w-14 bg-gradient-to-r from-gold-500/60 to-transparent mt-3" />
              </div>

              {/* Description */}
              {(watch.descriptionEn || watch.descriptionAr) && (
                <p
                  className={`text-[#f5f2e8]/62 leading-loose ${language === "ar" ? "font-arabic" : ""}`}
                  style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)", lineHeight: 1.85 }}
                >
                  {language === "ar"
                    ? (watch.descriptionAr || watch.descriptionEn)
                    : (watch.descriptionEn || watch.descriptionAr)}
                </p>
              )}

              {/* Price */}
              <div
                className="py-5 border-y space-y-3"
                style={{ borderColor: "rgba(212,175,55,0.15)" }}
              >
                {watch.retailPrice && (
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-[#f5f2e8]/30" />
                    <div>
                      <p className="text-[10px] text-[#f5f2e8]/35 tracking-widest uppercase">
                        {language === "ar" ? "سعر الريتيل التقريبي" : "Retail Price"}
                      </p>
                      <p className="text-base font-medium text-[#f5f2e8]/60">{formatPrice(watch.retailPrice)}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-gold-500" />
                  <div>
                    <p className="text-[10px] text-[#f5f2e8]/35 tracking-widest uppercase">
                      {language === "ar" ? "سعر السوق التقريبي" : "Market Value"}
                    </p>
                    <p
                      className="text-gold-500 font-bold"
                      style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)" }}
                    >
                      {formatPrice(watch.marketValue)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4">
                <h3
                  className={`text-[#f5f2e8] ${language === "ar" ? "font-arabic" : ""}`}
                  style={{
                    fontFamily: isRTL ? undefined : "Playfair Display, Georgia, serif",
                    fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                    fontWeight: 600,
                  }}
                >
                  {t("common.specifications")}
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    watch.material && {
                      label: t("common.material"),
                      value: language === "ar" ? (watch.materialAr || watch.material) : watch.material,
                    },
                    watch.caseSize && {
                      label: t("common.caseSize"),
                      value: language === "ar" ? (watch.caseSizeAr || watch.caseSize) : watch.caseSize,
                    },
                    watch.movement && {
                      label: t("common.movement"),
                      value: language === "ar" ? (watch.movementAr || watch.movement) : watch.movement,
                    },
                    watch.dialColor && {
                      label: t("common.dial"),
                      value: language === "ar" ? (watch.dialColorAr || watch.dialColor) : watch.dialColor,
                    },
                    watch.waterResistance && {
                      label: t("common.waterResistance"),
                      value: language === "ar" ? (watch.waterResistanceAr || watch.waterResistance) : watch.waterResistance,
                    },
                    watch.powerReserve && {
                      label: language === "ar" ? "احتياطي الطاقة" : "Power Reserve",
                      value: watch.powerReserve,
                    },
                  ]
                    .filter((s): s is { label: string; value: string } => Boolean(s))
                    .map((spec, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg transition-all duration-300 hover:border-gold-500/30"
                        style={{
                          background: "rgba(17, 20, 26, 0.5)",
                          border: "1px solid rgba(212, 175, 55, 0.1)",
                        }}
                      >
                        <p className="text-[10px] text-gold-500/55 tracking-widest uppercase mb-1">{spec.label}</p>
                        <p className="text-[#f5f2e8]/80 text-sm font-medium">{spec.value}</p>
                      </div>
                    ))}

                  {watch.complications && (
                    <div
                      className="p-4 rounded-lg col-span-2"
                      style={{
                        background: "rgba(17, 20, 26, 0.5)",
                        border: "1px solid rgba(212, 175, 55, 0.1)",
                      }}
                    >
                      <p className="text-[10px] text-gold-500/55 tracking-widest uppercase mb-1">{t("common.complications")}</p>
                      <p className="text-[#f5f2e8]/80 text-sm font-medium">
                        {language === "ar" ? (watch.complicationsAr || watch.complications) : watch.complications}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Movement Engineering Link */}
              {watch.movement && (
                <Link
                  href={`/movement/${watch.slug}`}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${language === "ar" ? "font-arabic" : ""}`}
                  style={{
                    border: "1px solid rgba(212,175,55,0.25)",
                    background: "rgba(212,175,55,0.04)",
                    color: "#d4af37",
                  }}
                >
                  <span>⚙️</span>
                  <span>{t("movement.pageTitle")}</span>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform group-hover:${isRTL ? "-translate-x-1" : "translate-x-1"}`}
                  />
                </Link>
              )}

              {/* Additional Info */}
              <div className="flex flex-wrap gap-4">
                {watch.yearReleased && (
                  <div className="flex items-center gap-2 text-[#f5f2e8]/40 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {t("common.year")}: {watch.yearReleased}
                    </span>
                  </div>
                )}
                {watch.limitedEdition && watch.productionQuantity && (
                  <div className="flex items-center gap-2 text-gold-500 text-sm">
                    <Package className="w-4 h-4" />
                    <span>
                      {t("common.limitedEdition")}: {watch.productionQuantity}{" "}
                      {language === "ar" ? "قطعة" : "pieces"}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      {(watch.storyEn || watch.storyAr) && (
        <section className="py-20 px-4" style={{ background: "rgba(212,175,55,0.025)" }}>
          <div className="container max-w-4xl mx-auto">
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <Award className="w-6 h-6 text-gold-500" />
              <h2
                className={`text-[#f5f2e8] ${language === "ar" ? "font-arabic" : ""}`}
                style={{
                  fontFamily: isRTL ? undefined : "Playfair Display, Georgia, serif",
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  fontWeight: 600,
                }}
              >
                {t("common.story")}
              </h2>
            </motion.div>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/40" />
              <div className="w-1 h-1 rounded-full bg-gold-500/50 rotate-45" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/40" />
            </div>

            <motion.p
              className={`text-[#f5f2e8]/65 leading-loose ${language === "ar" ? "font-arabic" : ""}${
                isCinematic
                  ? " first-letter:text-5xl first-letter:font-serif first-letter:text-gold-500 first-letter:float-left first-letter:me-3 first-letter:mt-1"
                  : ""
              }`}
              style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)", lineHeight: 1.9 }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.2}
            >
              {language === "ar" ? (watch.storyAr || watch.storyEn) : (watch.storyEn || watch.storyAr)}
            </motion.p>
          </div>
        </section>
      )}

      {/* Sheikh Photos Section */}
      {sheikhPhotos && sheikhPhotos.length > 0 && (
        <section className="py-20 px-4">
          <div className="container max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-14"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <p className="text-[11px] text-gold-500 font-semibold tracking-[0.45em] uppercase mb-4">
                {language === "ar" ? "مع الساعة" : "With the Watch"}
              </p>
              <h2
                className={`text-[#f5f2e8] ${language === "ar" ? "font-arabic" : ""}`}
                style={{
                  fontFamily: isRTL ? undefined : "Playfair Display, Georgia, serif",
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                  fontWeight: 600,
                }}
              >
                {language === "ar"
                  ? "صور سمو الشيخ عمار مع الساعة"
                  : "His Highness Sheikh Ammar with the Watch"}
              </h2>
              <div className="flex items-center justify-center gap-4 mt-5">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-500/45" />
                <div className="w-1 h-1 rounded-full bg-gold-500/55 rotate-45" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-500/45" />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sheikhPhotos.map((photo, idx) => (
                <motion.div
                  key={photo.id}
                  className="relative aspect-square rounded-2xl overflow-hidden group"
                  style={{
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.1)",
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  custom={idx * 0.1}
                >
                  <img
                    src={photo.imageUrl}
                    alt={(language === "ar" ? photo.captionAr : photo.captionEn) || ""}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {(language === "ar" ? photo.captionAr : photo.captionEn) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent p-5">
                      <p className={`text-[#f5f2e8]/80 text-sm ${language === "ar" ? "font-arabic" : ""}`}>
                        {language === "ar" ? photo.captionAr : photo.captionEn}
                      </p>
                    </div>
                  )}
                  {/* Corner accents */}
                  <div className="absolute top-3 start-3 w-4 h-4 border-t border-s border-[#d4af37]/30 pointer-events-none" />
                  <div className="absolute top-3 end-3 w-4 h-4 border-t border-e border-[#d4af37]/30 pointer-events-none" />
                  <div className="absolute bottom-3 start-3 w-4 h-4 border-b border-s border-[#d4af37]/30 pointer-events-none" />
                  <div className="absolute bottom-3 end-3 w-4 h-4 border-b border-e border-[#d4af37]/30 pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
