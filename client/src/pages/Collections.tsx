import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Collections() {
  const { language, t, isRTL } = useLanguage();
  const { data: brands, isLoading } = trpc.brands.getAll.useQuery();

  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Header />

      {/* Hero Section */}
      <section className="relative pt-40 pb-28 px-4 overflow-hidden">
        {/* Subtle dot texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.022]"
          style={{
            backgroundImage: "radial-gradient(circle, #d4af37 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
          aria-hidden="true"
        />

        <div className="container max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <p className="text-[11px] text-gold-500 font-semibold tracking-[0.45em] uppercase mb-5">
              {isRTL ? "المجموعة الكاملة" : "The Full Collection"}
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/55" />
              <div className="w-1.5 h-1.5 rounded-full bg-gold-500/65 rotate-45" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/55" />
            </div>

            <h1
              className={`text-[#f5f2e8] mb-6 ${language === "ar" ? "font-arabic" : ""}`}
              style={{
                fontFamily: isRTL ? undefined : "Playfair Display, Georgia, serif",
                fontSize: "clamp(2.5rem, 7vw, 5rem)",
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: "-0.015em",
              }}
            >
              {t("collection.title")}
            </h1>

            <p
              className={`text-[#f5f2e8]/60 max-w-2xl mx-auto leading-relaxed ${language === "ar" ? "font-arabic" : ""}`}
              style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.75 }}
            >
              {t("collection.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="pb-24 px-4">
        <div className="container max-w-7xl mx-auto">
          {brands && brands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {brands.map((brand, idx) => (
                <motion.div
                  key={brand.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  custom={idx * 0.08}
                >
                  <Link href={`/collection/${brand.slug}`}>
                    <div className="group relative rounded-xl overflow-hidden cursor-pointer h-full transition-all duration-500"
                      style={{
                        background: "rgba(17, 20, 26, 0.55)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(212, 175, 55, 0.15)",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                      }}
                    >
                      {/* Hover glow overlay */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.07), transparent 70%)",
                        }}
                      />

                      <div className="relative p-8">
                        {/* Index number */}
                        <div
                          className="absolute top-5 end-6 text-[3rem] font-serif leading-none select-none pointer-events-none"
                          style={{ color: "rgba(212,175,55,0.06)" }}
                          aria-hidden="true"
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </div>

                        {/* Brand Name */}
                        <div className="mb-5">
                          <p className="text-[10px] text-gold-500/50 tracking-[0.45em] uppercase font-medium mb-2">
                            {brand.country || "Switzerland"}
                          </p>
                          <h2
                            className={`text-[#f5f2e8] mb-3 group-hover:text-gold-400 transition-colors duration-300 ${language === "ar" ? "font-arabic" : ""}`}
                            style={{
                              fontFamily: isRTL ? undefined : "Playfair Display, Georgia, serif",
                              fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                              fontWeight: 600,
                              lineHeight: 1.2,
                            }}
                          >
                            {language === "ar" ? (brand.nameAr || brand.nameEn) : brand.nameEn}
                          </h2>
                          <div
                            className="h-px bg-gradient-to-r from-gold-500/50 to-transparent transition-all duration-500 group-hover:from-gold-500"
                            style={{ width: "3rem" }}
                          />
                        </div>

                        {/* Description */}
                        {(language === "ar" ? (brand.descriptionAr || brand.descriptionEn) : brand.descriptionEn) && (
                          <p
                            className={`text-[#f5f2e8]/45 text-sm leading-relaxed mb-6 line-clamp-3 ${language === "ar" ? "font-arabic" : ""}`}
                          >
                            {language === "ar" ? (brand.descriptionAr || brand.descriptionEn) : brand.descriptionEn}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-[#f5f2e8]/30 mb-6">
                          {brand.foundedYear && (
                            <span>
                              {t("common.founded")} {brand.foundedYear}
                            </span>
                          )}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-gold-500 group-hover:text-gold-400 transition-colors duration-300">
                          <span className={`text-sm font-medium ${language === "ar" ? "font-arabic" : ""}`}>
                            {t("common.exploreCollection")}
                          </span>
                          {isRTL ? (
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          ) : (
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          )}
                        </div>
                      </div>

                      {/* Bottom gold line on hover */}
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className={`text-[#f5f2e8]/40 text-xl ${language === "ar" ? "font-arabic" : ""}`}>
                {t("collection.empty")}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
