import { useLanguage } from '@/contexts/LanguageContext';
import { Top5WatchesSlideshow } from '@/components/Top5WatchesSlideshow';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

export default function Top10Page() {
  const { t, language, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Header />

      {/* Luxury Hero */}
      <section className="relative pt-36 pb-16 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: "radial-gradient(circle, #d4af37 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 rounded-full px-4 py-1.5 mb-6">
            <Award className="w-4 h-4 text-gold-500" />
            <span className={`text-gold-500 text-sm font-semibold tracking-widest uppercase ${language === 'ar' ? 'font-arabic' : ''}`}>
              {isRTL ? "المجموعة الملكية" : "Royal Collection"}
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 mb-7">
            <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/65 rotate-45" />
            <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
          </div>
          <h1
            className={`text-[#f5f2e8] mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}
            style={{
              fontFamily: isRTL ? undefined : 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.015em',
            }}
          >
            {t("top10.title")}
          </h1>
          <p className={`text-[#f5f2e8]/55 text-lg max-w-2xl mx-auto leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t("top10.subtitle")}
          </p>
        </motion.div>
      </section>

      {/* Full-Screen Slideshow */}
      <Top5WatchesSlideshow />

      <Footer />
    </div>
  );
}
