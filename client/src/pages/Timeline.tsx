import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { Calendar, Clock, Award } from "lucide-react";
import { Link } from "wouter";

export default function Timeline() {
  const { t, language, isRTL } = useLanguage();
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
    <div className="min-h-screen bg-black" dir={isRTL ? "rtl" : "ltr"}>
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 bg-gradient-to-b from-black via-gray-900/50 to-black text-center">
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
          <h1 className={`text-4xl md:text-6xl font-bold text-white mb-4 ${language === "ar" ? "font-arabic" : ""}`}>
            {t("timeline.title")}
          </h1>
          <p className={`text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed ${language === "ar" ? "font-arabic" : ""}`}>
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
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      selectedYear === year
                        ? "bg-gold-500 border-gold-500 text-black"
                        : "bg-transparent border-gold-500/30 text-gray-400 hover:border-gold-500/60 hover:text-gold-500"
                    }`}
                  >
                    {year}
                  </button>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedWatches.map((watch, i) => (
                        <motion.div
                          key={watch.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: i * 0.08 }}
                        >
                          <Link href={`/watch/${watch.slug}`}>
                            <div className="group bg-gradient-to-br from-gray-900 to-black border border-gold-500/20 hover:border-gold-500/50 rounded-xl overflow-hidden transition-all duration-500 cursor-pointer">
                              {/* Image */}
                              <div className="relative h-48 bg-gray-800 overflow-hidden">
                                {watch.mainImageUrl ? (
                                  <img
                                    src={watch.mainImageUrl}
                                    alt={language === "ar" ? (watch.nameAr || watch.nameEn) : watch.nameEn}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
                                <h3 className={`text-white font-bold text-base mb-1 group-hover:text-gold-400 transition-colors ${language === "ar" ? "font-arabic" : ""}`}>
                                  {language === "ar" ? (watch.nameAr || watch.nameEn) : watch.nameEn}
                                </h3>
                                <p className="text-gray-500 text-xs mb-3">{watch.referenceNumber}</p>
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                  <span className={language === "ar" ? "font-arabic" : ""}>{t("common.year")}: {watch.yearReleased}</span>
                                  <span className={`text-gold-500 font-medium ${language === "ar" ? "font-arabic" : ""}`}>{t("common.viewDetails")} →</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gold-500/20 py-8 px-4 mt-10">
        <div className="container max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p className={language === "ar" ? "font-arabic" : ""}>
            © 2025 {language === "ar" ? "المجموعة الملكية" : "Royal Collection"}
          </p>
        </div>
      </footer>
    </div>
  );
}
