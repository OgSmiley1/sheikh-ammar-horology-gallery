import { lazy, Suspense } from "react";
import { useParams, Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCreative } from "@/contexts/CreativeContext";
import { Header } from "@/components/Header";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { Cog, ArrowLeft, Clock, Layers, Zap, Droplets } from "lucide-react";
import { MovementEngineering } from "@/components/watch/MovementEngineering";

// Lazy-load 3D component to avoid Three.js bundle on non-cinematic pages
const MovementEngineering3D = lazy(() =>
  import("@/components/watch/MovementEngineering3D").then((m) => ({
    default: m.MovementEngineering3D,
  }))
);

export default function MovementEngineeringPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, language, isRTL } = useLanguage();
  const { isCinematic } = useCreative();

  const { data: watch, isLoading } = trpc.watches.getBySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Header />
        <div className="flex flex-col items-center gap-4">
          <Cog className="w-12 h-12 text-gold-500 animate-spin" style={{ animationDuration: "2s" }} />
          <p className={`text-gray-400 ${language === "ar" ? "font-arabic" : ""}`}>
            {t("common.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (!watch) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Header />
        <div className="text-center">
          <p className={`text-gray-400 text-lg ${language === "ar" ? "font-arabic" : ""}`}>
            {t("common.watchNotFound")}
          </p>
          <Link href="/collections" className="text-gold-500 mt-4 inline-block hover:underline">
            {t("common.backToCollections")}
          </Link>
        </div>
      </div>
    );
  }

  const watchName = language === "ar" ? (watch.nameAr || watch.nameEn) : watch.nameEn;
  const movementText = language === "ar" ? (watch.movementAr || watch.movement) : watch.movement;
  const complicationsText = language === "ar" ? (watch.complicationsAr || watch.complications) : watch.complications;

  const specs = [
    { icon: Clock, label: t("common.movement"), value: movementText },
    { icon: Zap, label: t("common.complications"), value: complicationsText },
    { icon: Layers, label: t("common.powerReserve"), value: watch.powerReserve },
    { icon: Droplets, label: t("common.waterResistance"), value: language === "ar" ? (watch.waterResistanceAr || watch.waterResistance) : watch.waterResistance },
  ].filter((s) => s.value);

  return (
    <div className="min-h-screen bg-black" dir={isRTL ? "rtl" : "ltr"}>
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-10 px-4 bg-gradient-to-b from-black via-gray-900/40 to-black">
        <div className="container max-w-6xl mx-auto">
          {/* Back link */}
          <Link
            href={`/watch/${watch.slug}`}
            className="inline-flex items-center gap-2 text-gold-500/70 hover:text-gold-500 text-sm mb-8 transition-colors group"
          >
            <ArrowLeft className={`w-4 h-4 transition-transform group-hover:${isRTL ? "translate-x-1" : "-translate-x-1"}`} />
            <span className={language === "ar" ? "font-arabic" : ""}>{t("movement.backToWatch")}</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 rounded-full px-4 py-1.5 mb-4">
              <Cog className="w-4 h-4 text-gold-500" />
              <span className="text-gold-500 text-xs font-semibold tracking-widest uppercase">
                {t("movement.pageTitle")}
              </span>
            </div>

            <h1 className={`text-3xl md:text-5xl font-bold text-white mb-2 ${language === "ar" ? "font-arabic" : ""}`}>
              {watchName}
            </h1>
            <p className={`text-gray-500 text-base md:text-lg ${language === "ar" ? "font-arabic" : ""}`}>
              {t("movement.pageSubtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-10 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left: Visualization */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className={`text-gold-500 text-xs font-semibold tracking-widest uppercase mb-6 ${language === "ar" ? "font-arabic" : ""}`}>
                {t("movement.layers")}
              </h2>

              {/* Switch between 2D (default) and 3D (cinematic) */}
              {isCinematic ? (
                <Suspense
                  fallback={
                    <div className="w-full aspect-square max-w-md mx-auto rounded-xl bg-gray-950 flex items-center justify-center">
                      <Cog className="w-10 h-10 text-gold-500/40 animate-spin" style={{ animationDuration: "2s" }} />
                    </div>
                  }
                >
                  <MovementEngineering3D imageUrl={watch.mainImageUrl ?? ""} />
                  {/* Also show 2D layer legend below 3D */}
                  <div className="mt-6">
                    <MovementEngineering watchId={watch.id} mainImageUrl={null} />
                  </div>
                </Suspense>
              ) : (
                <MovementEngineering watchId={watch.id} mainImageUrl={watch.mainImageUrl} />
              )}
            </motion.div>

            {/* Right: Technical specs + story */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Specs */}
              {specs.length > 0 && (
                <div className="mb-10">
                  <h2 className={`text-gold-500 text-xs font-semibold tracking-widest uppercase mb-6 ${language === "ar" ? "font-arabic" : ""}`}>
                    {t("movement.techSpecs")}
                  </h2>
                  <div className="space-y-4">
                    {specs.map((spec, i) => (
                      <motion.div
                        key={i}
                        className="flex gap-4 items-start border-b border-gray-800 pb-4"
                        initial={isCinematic ? { opacity: 0, y: 15 } : undefined}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <spec.icon className="w-4 h-4 text-gold-500" />
                        </div>
                        <div>
                          <p className={`text-xs text-gray-500 mb-1 uppercase tracking-wider ${language === "ar" ? "font-arabic" : ""}`}>
                            {spec.label}
                          </p>
                          <p className={`text-white text-sm leading-relaxed ${language === "ar" ? "font-arabic" : ""}`}>
                            {spec.value}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Story / Description */}
              {(watch.descriptionEn || watch.descriptionAr) && (
                <div>
                  <h2 className={`text-gold-500 text-xs font-semibold tracking-widest uppercase mb-4 ${language === "ar" ? "font-arabic" : ""}`}>
                    {t("common.story")}
                  </h2>
                  <p className={`text-gray-400 leading-relaxed text-sm ${language === "ar" ? "font-arabic" : ""}`}>
                    {language === "ar" ? (watch.descriptionAr || watch.descriptionEn) : (watch.descriptionEn || watch.descriptionAr)}
                  </p>
                </div>
              )}

              {/* Reference / year */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {watch.referenceNumber && (
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                    <p className={`text-xs text-gray-600 uppercase tracking-wider mb-1 ${language === "ar" ? "font-arabic" : ""}`}>
                      {t("common.reference")}
                    </p>
                    <p className="text-white text-sm font-mono">{watch.referenceNumber}</p>
                  </div>
                )}
                {watch.yearReleased && (
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                    <p className={`text-xs text-gray-600 uppercase tracking-wider mb-1 ${language === "ar" ? "font-arabic" : ""}`}>
                      {t("common.year")}
                    </p>
                    <p className="text-white text-sm">{watch.yearReleased}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
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
