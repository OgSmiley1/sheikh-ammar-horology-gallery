import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCreative } from "@/contexts/CreativeContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Award } from "lucide-react";
import { Link } from "wouter";

export default function Timeline() {
  const { t, language, isRTL } = useLanguage();
  const { isCinematic } = useCreative();
  const { data: allWatches, isLoading } = trpc.watches.getAll.useQuery();

  // Group watches by year
  const watchesByYear: Record<number, typeof allWatches> = {};
  if (allWatches) {
    for (const watch of allWatches) {
      if (watch.yearReleased) {
        if (!watchesByYear[watch.yearReleased]) {
          watchesByYear[watch.yearReleased] = [];
        }
        watchesByYear[watch.yearReleased]!.push(watch);
      }
    }
  }

  const years = Object.keys(watchesByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const [selectedYear, setSelectedYear] = useState<number | null>(years[0] ?? null);

  const selectedWatches = selectedYear ? (watchesByYear[selectedYear] ?? []) : [];

  // Stats
  const totalWatches = allWatches?.length ?? 0;
  const yearsWithAdditions = years.length;
  const minYear = years.length ? Math.min(...years) : 2000;
  const maxYear = years.length ? Math.max(...years) : new Date().getFullYear();
  const yearsCollecting = maxYear - minYear + 1;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 rounded-full px-4 py-1.5 mb-6">
            <Calendar className="w-4 h-4 text-gold-500" />
            <span className={`text-gold-500 text-sm font-semibold tracking-widest uppercase ${language === "ar" ? "font-arabic" : ""}`}>
              {t("common.timeline")}
            </span>
          </div>
          <h1
            className={`text-[#f5f2e8] mb-4 ${language === "ar" ? "font-arabic" : ""}`}
            style={{
              fontFamily: isRTL ? undefined : "Playfair Display, Georgia, serif",
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
            }}
          >
            {t("timeline.title")}
          </h1>
          <p className={`text-[#f5f2e8]/55 text-lg max-w-2xl mx-auto leading-relaxed ${language === "ar" ? "font-arabic" : ""}`}>
            {t("timeline.subtitle")}
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-gold-500/20" style={{ background: "rgba(212, 175, 55, 0.04)" }}>
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: totalWatches, label: t("timeline.rareWatches") },
              { value: yearsWithAdditions, label: t("timeline.yearsWithAdditions") },
              { value: yearsCollecting, label: t("timeline.yearsCollecting") },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-gold-500 mb-1">{stat.value}</div>
                <p className={`text-gray-400 text-sm ${language === "ar" ? "font-arabic" : ""}`}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Year Selector */}
      <section className="py-10 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className={`text-gold-500 text-sm font-semibold tracking-widest uppercase mb-6 ${language === "ar" ? "font-arabic" : ""}`}>
            {t("timeline.selectYear")}
          </h2>

          {isLoading ? (
            <div className={`text-gray-400 text-center py-12 ${language === "ar" ? "font-arabic" : ""}`}>
              {t("common.loading")}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-10">
                {years.map((year, idx) => (
                  <motion.button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      selectedYear === year
                        ? "bg-gold-500 border-gold-500 text-black"
                        : "bg-transparent border-gold-500/30 text-gray-400 hover:border-gold-500/60 hover:text-gold-500"
                    }`}
                    initial={isCinematic ? { opacity: 0, scale: 0.8 } : undefined}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: isCinematic ? idx * 0.05 : 0 }}
                    whileHover={isCinematic ? { scale: 1.1, boxShadow: "0 0 20px rgba(212,175,55,0.3)" } : undefined}
                    whileTap={isCinematic ? { scale: 0.95 } : undefined}
                  >
                    {year}
                  </motion.button>
                ))}
              </div>

              {/* Watches for selected year */}
              {selectedYear && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-5 h-5 text-gold-500" />
                    <span className={`text-2xl font-bold text-white ${language === "ar" ? "font-arabic" : ""}`}>
                      {selectedYear} — {selectedWatches.length} {t("timeline.watchesAdded")}
                    </span>
                  </div>

                  {selectedWatches.length === 0 ? (
                    <p className={`text-gray-500 text-center py-12 ${language === "ar" ? "font-arabic" : ""}`}>
                      {t("timeline.noWatchesYear")}
                    </p>
                  ) : (
                    <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedYear}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      initial={isCinematic ? { opacity: 0 } : undefined}
                      animate={{ opacity: 1 }}
                      exit={isCinematic ? { opacity: 0 } : undefined}
                      transition={{ duration: 0.3 }}
                    >
                      {selectedWatches.map((watch, i) => (
                        <motion.div
                          key={watch.id}
                          initial={isCinematic ? { opacity: 0, y: 40, scale: 0.92 } : { opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: isCinematic ? 0.6 : 0.5, delay: i * (isCinematic ? 0.12 : 0.08), ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                          <Link href={`/watch/${watch.slug}`}>
                            <motion.div
                              className="group rounded-xl overflow-hidden transition-all duration-500 cursor-pointer"
                              style={{ background: "rgba(17, 20, 26, 0.55)", border: "1px solid rgba(212,175,55,0.12)" }}
                              whileHover={isCinematic ? { y: -6, boxShadow: "0 20px 40px rgba(212,175,55,0.15), 0 0 0 1px rgba(212,175,55,0.3)" } : undefined}
                              transition={{ duration: 0.3 }}
                            >
                              {/* Image */}
                              <div className="relative h-48 overflow-hidden" style={{ background: "rgba(10,10,10,0.8)" }}>
                                {watch.mainImageUrl ? (
                                  <img
                                    src={watch.mainImageUrl}
                                    alt={language === "ar" ? (watch.nameAr || watch.nameEn) : watch.nameEn}
                                    className={`w-full h-full object-cover transition-transform duration-700 ${isCinematic ? "group-hover:scale-110" : "group-hover:scale-105"}`}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Award className="w-16 h-16 text-gold-500/20" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                {watch.rarity && (
                                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full border border-gold-500/30">
                                    <span className="text-gold-500 text-xs font-medium">{watch.rarity}</span>
                                  </div>
                                )}
                              </div>

                              {/* Content */}
                              <div className="p-5">
                                <h3
                                  className={`text-[#f5f2e8] font-semibold text-base mb-1 group-hover:text-gold-400 transition-colors ${language === "ar" ? "font-arabic" : ""}`}
                                  style={{ fontFamily: isRTL ? undefined : "Playfair Display, serif" }}
                                >
                                  {language === "ar" ? (watch.nameAr || watch.nameEn) : watch.nameEn}
                                </h3>
                                <p className="text-[#f5f2e8]/30 text-xs mb-3">{watch.referenceNumber}</p>
                                <div className="flex items-center justify-between text-xs text-[#f5f2e8]/40">
                                  <span className={language === "ar" ? "font-arabic" : ""}>{t("common.year")}: {watch.yearReleased}</span>
                                  <span className={`text-gold-500 font-medium ${language === "ar" ? "font-arabic" : ""}`}>{t("common.viewDetails")} →</span>
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
