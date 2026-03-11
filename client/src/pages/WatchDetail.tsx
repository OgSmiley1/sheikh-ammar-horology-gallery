import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/Header";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Eye, TrendingUp, Calendar, Package, Award } from "lucide-react";
import { useEffect, useState } from "react";
// WatchDetail — full bilingual support via LanguageContext

export default function WatchDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t, isRTL } = useLanguage();
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

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
      <section className="relative py-16 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
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
                    src={watch.mainImageUrl}
                    alt={language === "ar" ? watch.nameAr : watch.nameEn}
                    className="w-full h-full object-cover"
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
              <div className="flex items-center gap-4 py-6 border-y border-gold-500/20">
                <TrendingUp className="w-6 h-6 text-gold-500" />
                <div>
                  <p className="text-sm text-gray-400">
                    {t("common.marketValue")}
                  </p>
                  <p className="text-3xl font-bold text-gold-500">{formatPrice(watch.marketValue)}</p>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gold-500">
                  {t("common.specifications")}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {watch.material && (
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gold-500/10">
                      <p className="text-gray-400 text-sm mb-1">
                        {t("common.material")}
                      </p>
                      <p className="text-gray-200 font-medium">
                        {language === "ar" ? (watch.materialAr || watch.material) : watch.material}
                      </p>
                    </div>
                  )}

                  {watch.caseSize && (
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gold-500/10">
                      <p className="text-gray-400 text-sm mb-1">
                        {t("common.caseSize")}
                      </p>
                      <p className="text-gray-200 font-medium">
                        {language === "ar" ? (watch.caseSizeAr || watch.caseSize) : watch.caseSize}
                      </p>
                    </div>
                  )}

                  {watch.movement && (
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gold-500/10">
                      <p className="text-gray-400 text-sm mb-1">
                        {t("common.movement")}
                      </p>
                      <p className="text-gray-200 font-medium">
                        {language === "ar" ? (watch.movementAr || watch.movement) : watch.movement}
                      </p>
                    </div>
                  )}

                  {watch.dialColor && (
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gold-500/10">
                      <p className="text-gray-400 text-sm mb-1">
                        {t("common.dial")}
                      </p>
                      <p className="text-gray-200 font-medium">
                        {language === "ar" ? (watch.dialColorAr || watch.dialColor) : watch.dialColor}
                      </p>
                    </div>
                  )}

                  {watch.waterResistance && (
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gold-500/10">
                      <p className="text-gray-400 text-sm mb-1">
                        {t("common.waterResistance")}
                      </p>
                      <p className="text-gray-200 font-medium">
                        {language === "ar" ? (watch.waterResistanceAr || watch.waterResistance) : watch.waterResistance}
                      </p>
                    </div>
                  )}

                  {watch.complications && (
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gold-500/10 col-span-2">
                      <p className="text-gray-400 text-sm mb-1">
                        {t("common.complications")}
                      </p>
                      <p className="text-gray-200 font-medium">
                        {language === "ar" ? (watch.complicationsAr || watch.complications) : watch.complications}
                      </p>
                    </div>
                  )}
                </div>
              </div>

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
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-8 h-8 text-gold-500" />
              <h2 className="text-3xl font-bold text-gold-500">
                {t("common.story")}
              </h2>
            </div>
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-gray-300 leading-relaxed text-lg">
                {language === "ar" ? (watch.storyAr || watch.storyEn) : (watch.storyEn || watch.storyAr)}
              </p>
            </div>
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
