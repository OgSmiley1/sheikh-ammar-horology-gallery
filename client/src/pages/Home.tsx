import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { VideoBackground } from "@/components/VideoBackground";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SITE_CONFIG, SHEIKH_INFO, COLLECTION_INTRO } from "@shared/constants";
import { ArrowRight, Crown, Watch } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { t, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Video Background */}
      <VideoBackground>
        <div className="container h-full flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-6"
            >
              <Crown className="w-16 h-16 mx-auto text-primary mb-4" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-shadow heading-luxury"
            >
              <span className="text-gold-gradient">
                {isRTL ? SHEIKH_INFO.nameAr : SHEIKH_INFO.nameEn}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-xl md:text-2xl text-primary/90 mb-4 text-shadow font-semibold"
            >
              {isRTL ? SHEIKH_INFO.titleAr : SHEIKH_INFO.titleEn}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-lg md:text-xl text-foreground/80 mb-12 text-shadow max-w-3xl mx-auto leading-relaxed"
            >
              {isRTL ? SITE_CONFIG.descriptionAr : SITE_CONFIG.descriptionEn}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/collections">
                <Button
                  size="lg"
                  className="btn-luxury group gap-2 text-base"
                >
                  <Watch className="w-5 h-5" />
                  {isRTL ? "استكشف المجموعة" : "Explore Collection"}
                  <ArrowRight
                    className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${
                      isRTL ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </Link>

              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary text-base"
                >
                  {isRTL ? "عن سموه" : "About His Highness"}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-primary/60">
            <span className="text-sm">
              {isRTL ? "مرر للأسفل" : "Scroll Down"}
            </span>
            <div className="w-6 h-10 border-2 border-primary/40 rounded-full flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-primary rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </VideoBackground>

      {/* Collection Introduction Section */}
      <section className="py-24 bg-background pattern-bg">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 heading-luxury">
              {isRTL
                ? COLLECTION_INTRO.titleAr
                : COLLECTION_INTRO.titleEn}
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed mb-12">
              {isRTL
                ? COLLECTION_INTRO.descriptionAr
                : COLLECTION_INTRO.descriptionEn}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gold-gradient mb-2">
                  34+
                </div>
                <div className="text-sm text-muted-foreground">
                  {isRTL ? "ساعة فاخرة" : "Timepieces"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gold-gradient mb-2">
                  8
                </div>
                <div className="text-sm text-muted-foreground">
                  {isRTL ? "علامة تجارية" : "Brands"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gold-gradient mb-2">
                  $10M+
                </div>
                <div className="text-sm text-muted-foreground">
                  {isRTL ? "القيمة الإجمالية" : "Total Value"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gold-gradient mb-2">
                  15+
                </div>
                <div className="text-sm text-muted-foreground">
                  {isRTL ? "إصدارات محدودة" : "Limited Editions"}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Brands Section */}
      <section className="py-24 bg-card/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 heading-luxury">
              {isRTL ? "العلامات التجارية المميزة" : "Featured Brands"}
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              {isRTL
                ? "من أرقى صانعي الساعات في العالم"
                : "From the world's finest watchmakers"}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Patek Philippe", nameAr: "باتيك فيليب", count: 8 },
              { name: "Richard Mille", nameAr: "ريتشارد ميل", count: 6 },
              { name: "Audemars Piguet", nameAr: "أوديمار بيغيه", count: 6 },
              { name: "Rolex", nameAr: "رولكس", count: 9 },
              { name: "F.P. Journe", nameAr: "إف بي جورن", count: 2 },
              { name: "H. Moser & Cie", nameAr: "إتش موزر", count: 1 },
              { name: "Tudor", nameAr: "تيودور", count: 1 },
              { name: "Artisans de Geneve", nameAr: "أرتيزان دو جنيف", count: 1 },
            ].map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/brands/${brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                  <div className="card-luxury p-8 text-center cursor-pointer h-full">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {isRTL ? brand.nameAr : brand.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {brand.count} {isRTL ? "ساعات" : "watches"}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/brands">
              <Button size="lg" className="btn-luxury">
                {isRTL ? "عرض جميع العلامات التجارية" : "View All Brands"}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-primary/20">
        <div className="container text-center">
          <div className="text-primary font-semibold mb-2">
            {isRTL ? SHEIKH_INFO.nameAr : SHEIKH_INFO.nameEn}
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            {isRTL ? SHEIKH_INFO.titleAr : SHEIKH_INFO.titleEn}
          </div>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}{" "}
            {isRTL ? "جميع الحقوق محفوظة" : "All rights reserved"}
          </div>
        </div>
      </footer>
    </div>
  );
}
