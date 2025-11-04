import { Header } from "@/components/Header";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SITE_CONFIG, COLLECTION_INTRO } from "@shared/constants";
import { ArrowRight, Watch } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Slideshow */}
      <HeroSlideshow />

      {/* Featured Brands Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              {isRTL ? "العلامات التجارية المميزة" : "Featured Brands"}
            </h2>
            <p className="text-lg text-foreground/70">
              {isRTL
                ? "اكتشف أرقى صانعي الساعات في العالم"
                : "Discover the world's finest watchmakers"}
            </p>
          </motion.div>

          {/* Brands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Patek Philippe", year: "1839", country: "Switzerland" },
              { name: "Richard Mille", year: "2001", country: "Switzerland" },
              { name: "F.P. Journe", year: "1999", country: "Switzerland" },
              { name: "Audemars Piguet", year: "1875", country: "Switzerland" },
              { name: "Rolex", year: "1905", country: "Switzerland" },
              { name: "H. Moser & Cie", year: "1828", country: "Switzerland" },
              { name: "Tudor", year: "1926", country: "Switzerland" },
              { name: "Breitling", year: "1884", country: "Switzerland" },
            ].map((brand, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-card border border-primary/20 rounded-lg p-6 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-primary mb-2 group-hover:text-gold-400 transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-foreground/60 mb-1">
                    {isRTL ? "تأسس عام" : "Founded"} {brand.year}
                  </p>
                  <p className="text-xs text-foreground/50">{brand.country}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collection Stats */}
      <section className="py-20 bg-primary/5 border-y border-primary/20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: isRTL ? "ساعة فاخرة" : "Luxury Watches", value: "34+" },
              { label: isRTL ? "علامة تجارية" : "Brands", value: "8" },
              { label: isRTL ? "القيمة الإجمالية" : "Total Value", value: "$10M+" },
              { label: isRTL ? "إصدارات محدودة" : "Limited Editions", value: "15+" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gold-400 mb-2">
                  {stat.value}
                </div>
                <p className="text-foreground/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collection Intro */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              {isRTL ? "إرث من التميز" : "A Legacy of Excellence"}
            </h2>

            <p
              className="text-lg text-foreground/80 mb-8 leading-relaxed"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {isRTL
                ? COLLECTION_INTRO.descriptionAr
                : COLLECTION_INTRO.descriptionEn}
            </p>

            <Link href="/collections">
              <Button className="bg-gold-400 hover:bg-gold-500 text-black font-semibold px-8 py-6 text-lg inline-flex items-center gap-2">
                {isRTL ? "استكشف المجموعة" : "Explore Collection"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/10 border-t border-primary/20 py-12">
        <div className="container text-center text-foreground/60">
          <p>
            © 2025 {isRTL ? "مجموعة الشيخ عمار الملكية" : "Sheikh Ammar Royal Collection"}. {isRTL ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
        </div>
      </footer>
    </div>
  );
}
