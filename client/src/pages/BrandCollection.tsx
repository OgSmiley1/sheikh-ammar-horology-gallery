import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Eye, TrendingUp } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function BrandCollection() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t, isRTL } = useLanguage();

  const { data: brand, isLoading: brandLoading } = trpc.brands.getBySlug.useQuery({ slug: slug! });
  const { data: watches, isLoading: watchesLoading } = trpc.watches.getByBrand.useQuery(
    { brandId: brand?.id! },
    { enabled: !!brand?.id }
  );

  if (brandLoading || watchesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gold-500 text-2xl font-serif">
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </div>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="text-gold-500 text-2xl font-serif">
            {language === "ar" ? "المجموعة غير موجودة" : "Collection not found"}
          </div>
          <Link href="/collections" className="text-[#f5f2e8]/50 hover:text-gold-500 transition-colors">
            {language === "ar" ? "العودة للمجموعات" : "Back to Collections"}
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number | null) => {
    if (!price) return language === "ar" ? "السعر عند الطلب" : "Price on Request";
    return new Intl.NumberFormat(language === "ar" ? "ar-AE" : "en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Header />

      {/* Brand Hero Section */}
      <section className="relative pt-40 pb-24 px-4 overflow-hidden border-b border-[#d4af37]/10">
        {/* Subtle dot texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.022]"
          style={{
            backgroundImage: "radial-gradient(circle, #d4af37 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
          aria-hidden="true"
        />

        <div className="container max-w-6xl mx-auto relative z-10">
          {/* Back Button */}
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-[#f5f2e8]/40 hover:text-gold-500 transition-colors mb-10 text-sm"
          >
            {language === "ar" ? (
              <>
                <ArrowRight className="w-4 h-4" />
                <span>العودة للمجموعات</span>
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Collections</span>
              </>
            )}
          </Link>

          {/* Brand Info */}
          <motion.div
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <p className="text-[11px] text-gold-500 font-semibold tracking-[0.45em] uppercase mb-5">
              {brand.country || "Switzerland"}
            </p>
            <div className="flex items-center justify-center gap-4 mb-7">
              <div className="h-px w-14 bg-gradient-to-r from-transparent to-gold-500/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-gold-500/65 rotate-45" />
              <div className="h-px w-14 bg-gradient-to-l from-transparent to-gold-500/50" />
            </div>
            <h1
              className={`text-[#f5f2e8] mb-5 ${language === "ar" ? "font-arabic" : ""}`}
              style={{
                fontFamily: isRTL ? undefined : "Playfair Display, Georgia, serif",
                fontSize: "clamp(2.5rem, 7vw, 5rem)",
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: "-0.015em",
              }}
            >
              {language === "ar" ? (brand.nameAr || brand.nameEn) : brand.nameEn}
            </h1>
            {brand.foundedYear && (
              <p className="text-xs text-[#f5f2e8]/30 tracking-widest uppercase mb-5">
                {language === "ar" ? "تأسست" : "Est."} {brand.foundedYear}
              </p>
            )}
            {(language === "ar" ? brand.descriptionAr : brand.descriptionEn) && (
              <p
                className={`text-[#f5f2e8]/55 max-w-2xl mx-auto leading-relaxed ${language === "ar" ? "font-arabic" : ""}`}
                style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)", lineHeight: 1.8 }}
              >
                {language === "ar" ? (brand.descriptionAr || brand.descriptionEn) : brand.descriptionEn}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Watches Grid */}
      <section className="py-20 px-4">
        <div className="container max-w-7xl mx-auto">
          {watches && watches.length > 0 ? (
            <>
              <motion.div
                className="mb-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0}
              >
                <h2
                  className={`text-[#f5f2e8] mb-2 ${language === "ar" ? "font-arabic" : ""}`}
                  style={{
                    fontFamily: isRTL ? undefined : "Playfair Display, Georgia, serif",
                    fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                    fontWeight: 600,
                  }}
                >
                  {language === "ar" ? "الساعات في هذه المجموعة" : "Watches in this Collection"}
                </h2>
                <p className="text-[#f5f2e8]/40 text-sm">
                  {watches.length} {language === "ar" ? "ساعة" : watches.length === 1 ? "timepiece" : "timepieces"}
                </p>
                <div className="h-px w-14 bg-gradient-to-r from-gold-500/60 to-transparent mt-3" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {watches.map((watch, idx) => (
                  <motion.div
                    key={watch.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={fadeUp}
                    custom={idx * 0.07}
                  >
                    <Link href={`/watch/${watch.slug}`}>
                      <div
                        className="group relative rounded-xl overflow-hidden cursor-pointer h-full transition-all duration-500"
                        style={{
                          background: "rgba(17, 20, 26, 0.55)",
                          border: "1px solid rgba(212, 175, 55, 0.12)",
                          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                        }}
                      >
                        {/* Watch Image */}
                        <div className="relative aspect-square overflow-hidden" style={{ background: "rgba(10,10,10,0.8)" }}>
                          {watch.mainImageUrl ? (
                            <img
                              src={watch.mainImageUrl}
                              alt={language === "ar" ? (watch.nameAr || watch.nameEn) : watch.nameEn}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#f5f2e8]/10">
                              <Eye className="w-16 h-16" />
                            </div>
                          )}

                          {/* Rarity Badge */}
                          {watch.rarity && (
                            <div className="absolute top-4 end-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gold-500/30">
                              <span className="text-gold-500 text-xs font-medium">
                                {language === "ar" ? (watch.rarityAr || watch.rarity) : watch.rarity}
                              </span>
                            </div>
                          )}

                          {/* Featured Badge */}
                          {watch.isFeatured && (
                            <div className="absolute top-4 start-4 bg-gold-500/15 backdrop-blur-sm px-3 py-1 rounded-full border border-gold-500/50">
                              <span className="text-gold-500 text-xs font-bold">
                                {language === "ar" ? "مميزة" : "Featured"}
                              </span>
                            </div>
                          )}

                          {/* Bottom gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        {/* Watch Info */}
                        <div className="p-6">
                          <h3
                            className={`text-[#f5f2e8] mb-1.5 group-hover:text-gold-400 transition-colors duration-300 line-clamp-2 ${language === "ar" ? "font-arabic" : ""}`}
                            style={{
                              fontFamily: isRTL ? undefined : "Playfair Display, Georgia, serif",
                              fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
                              fontWeight: 600,
                              lineHeight: 1.3,
                            }}
                          >
                            {language === "ar" ? (watch.nameAr || watch.nameEn) : watch.nameEn}
                          </h3>

                          {watch.referenceNumber && (
                            <p className="text-xs text-[#f5f2e8]/30 mb-3 tracking-wider">
                              {language === "ar" ? "المرجع" : "Ref."} {watch.referenceNumber}
                            </p>
                          )}

                          {(watch.descriptionEn || watch.descriptionAr) && (
                            <p
                              className={`text-[#f5f2e8]/45 text-sm leading-relaxed mb-4 line-clamp-2 ${language === "ar" ? "font-arabic" : ""}`}
                            >
                              {language === "ar" ? (watch.descriptionAr || watch.descriptionEn) : (watch.descriptionEn || watch.descriptionAr)}
                            </p>
                          )}

                          {/* Specs */}
                          {(watch.material || watch.caseSize) && (
                            <div className="space-y-1.5 mb-4 text-xs">
                              {watch.material && (
                                <div className="flex justify-between text-[#f5f2e8]/30">
                                  <span>{language === "ar" ? "المادة" : "Material"}</span>
                                  <span className="text-[#f5f2e8]/55">
                                    {language === "ar" ? (watch.materialAr || watch.material) : watch.material}
                                  </span>
                                </div>
                              )}
                              {watch.caseSize && (
                                <div className="flex justify-between text-[#f5f2e8]/30">
                                  <span>{language === "ar" ? "الحجم" : "Size"}</span>
                                  <span className="text-[#f5f2e8]/55">
                                    {language === "ar" ? (watch.caseSizeAr || watch.caseSize) : watch.caseSize}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Price & CTA */}
                          <div className="flex items-center justify-between pt-4 border-t border-[#d4af37]/10">
                            <div className="flex items-center gap-1.5 text-gold-500">
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span className="font-semibold text-sm">{formatPrice(watch.marketValue)}</span>
                            </div>
                            {isRTL ? (
                              <ArrowLeft className="w-4 h-4 text-gold-500/60 group-hover:text-gold-500 group-hover:-translate-x-1 transition-all duration-300" />
                            ) : (
                              <ArrowRight className="w-4 h-4 text-gold-500/60 group-hover:text-gold-500 group-hover:translate-x-1 transition-all duration-300" />
                            )}
                          </div>
                        </div>

                        {/* Bottom accent */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-24">
              <p className={`text-[#f5f2e8]/40 text-xl ${language === "ar" ? "font-arabic" : ""}`}>
                {language === "ar"
                  ? "لا توجد ساعات في هذه المجموعة حالياً"
                  : "No watches in this collection yet"}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
