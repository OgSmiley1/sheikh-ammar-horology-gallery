import { useState } from 'react';
import { Header } from "@/components/Header";
import { HeroSlideshowSplitScreen } from '@/components/HeroSlideshowSplitScreen';
import { slides } from '@/data/heroSlides';
import { ExploreMoreCollection } from '@/components/ExploreMoreCollection';
import { CollectorStory } from '@/components/CollectorStory';
import { CustomCursor } from '@/components/CustomCursor';
import { ScrollProgress } from '@/components/ScrollProgress';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { COLLECTION_INTRO } from "@shared/constants";
import { ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Home() {
  const { t, isRTL, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubscribed(true);
      setEmail("");
      toast.success(language === "ar" ? "تم الاشتراك بنجاح!" : "Successfully subscribed!");
    },
    onError: (err) => {
      toast.error(err.message || (language === "ar" ? "فشل الاشتراك" : "Subscription failed"));
    },
  });

  return (
    <>
      {/* Custom cursor */}
      <CustomCursor />

      {/* Scroll progress bar */}
      <ScrollProgress />

      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />

        {/* Hero Slideshow: Split-Screen Layout with Sheikh + Watch Images */}
        <HeroSlideshowSplitScreen slides={slides} autoPlayMs={7000} />

        {/* Collector's Story — personal imagery (father + MBZ) + editorial text */}
        <CollectorStory />

        {/* Explore More Collection */}
        <ExploreMoreCollection />

            {/* Featured Brands Section */}
            <section className="py-20 bg-[#0a0a0a]">
              <div className="container">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-16"
                >
                  <h2 className={`text-4xl md:text-5xl font-serif text-[#f5f2e8] mb-4 ${isRTL ? "font-arabic" : ""}`} style={{ fontFamily: isRTL ? undefined : 'Playfair Display, serif' }}>
                    {t("home.featuredBrands")}
                  </h2>
                  <p className={`text-lg text-[#f5f2e8]/70 ${isRTL ? "font-arabic" : ""}`}>
                    {t("home.discoverWatchmakers")}
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
                    { name: "Artisans de Geneve", year: "2011", country: "Switzerland" },
                  ].map((brand, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="rounded-lg p-6 cursor-pointer group"
                      style={{
                        background: 'rgba(17, 20, 26, 0.6)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                      }}
                    >
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-[#d4af37] mb-2 group-hover:text-[#f5f2e8] transition-colors">
                          {brand.name}
                        </h3>
                        <p className={`text-sm text-[#f5f2e8]/60 mb-1 ${isRTL ? "font-arabic" : ""}`}>
                          {t("common.founded")} {brand.year}
                        </p>
                        <p className="text-xs text-[#f5f2e8]/50">{brand.country}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Collection Stats */}
            <section className="py-20 border-y border-[#d4af37]/20" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
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
                      <div className="text-3xl md:text-4xl font-bold text-[#d4af37] mb-2">
                        {stat.value}
                      </div>
                      <p className="text-[#f5f2e8]/70">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Collection Intro */}
            <section className="py-20 bg-[#0a0a0a]">
              <div className="container">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-3xl mx-auto text-center"
                >
                  <h2 className={`text-4xl md:text-5xl font-serif text-[#f5f2e8] mb-6 ${isRTL ? "font-arabic" : ""}`} style={{ fontFamily: isRTL ? undefined : 'Playfair Display, serif' }}>
                    {t("home.collectionTitle")}
                  </h2>

                  <p
                    className="text-lg text-[#f5f2e8]/80 mb-8 leading-relaxed"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {isRTL
                      ? COLLECTION_INTRO.descriptionAr
                      : COLLECTION_INTRO.descriptionEn}
                  </p>

                  <Link href="/collections">
                    <Button className={`bg-[#d4af37] hover:bg-[#f5f2e8] text-black font-semibold px-8 py-6 text-lg inline-flex items-center gap-2 transition-all duration-300 ${isRTL ? "font-arabic" : ""}`}>
                      {t("common.exploreCollection")}
                      {isRTL ? null : <ArrowRight className="w-5 h-5" />}
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </section>

        {/* Newsletter Section */}
        <section className="py-20 border-t border-[#d4af37]/20" style={{ background: 'rgba(212, 175, 55, 0.04)' }} dir={isRTL ? "rtl" : "ltr"}>
          <div className="container max-w-xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#d4af37]/10 rounded-full border border-[#d4af37]/30 mb-6">
                <Mail className="w-6 h-6 text-[#d4af37]" />
              </div>
              <h2 className={`text-3xl font-bold text-[#f5f2e8] mb-3 ${isRTL ? "font-arabic" : ""}`}>
                {t("home.newsletterTitle")}
              </h2>
              <p className={`text-[#f5f2e8]/60 mb-8 leading-relaxed ${isRTL ? "font-arabic" : ""}`}>
                {t("home.newsletterSubtitle")}
              </p>
              {subscribed ? (
                <p className={`text-[#d4af37] font-semibold text-lg ${isRTL ? "font-arabic" : ""}`}>
                  {language === "ar" ? "شكراً على اشتراكك!" : "Thank you for subscribing!"}
                </p>
              ) : (
                <form
                  className="flex gap-3 max-w-sm mx-auto"
                  dir={isRTL ? "rtl" : "ltr"}
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!email) return;
                    subscribeMutation.mutate({ email });
                  }}
                >
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("common.emailPlaceholder")}
                    className="bg-[#1a1a1a] border-[#d4af37]/30 text-[#f5f2e8] placeholder:text-[#f5f2e8]/30 focus:border-[#d4af37] flex-1"
                    required
                  />
                  <Button
                    type="submit"
                    className={`bg-[#d4af37] hover:bg-[#f5f2e8] text-black font-semibold transition-all ${isRTL ? "font-arabic" : ""}`}
                    disabled={subscribeMutation.isPending}
                  >
                    {subscribeMutation.isPending
                      ? "..."
                      : t("common.subscribe")}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#d4af37]/20 py-12" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
          <div className="container text-center text-[#f5f2e8]/60">
            <p>
              © 2025 {isRTL ? "مجموعة الشيخ عمار الملكية" : "Sheikh Ammar Royal Collection"}. {isRTL ? "جميع الحقوق محفوظة." : "All rights reserved."}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
