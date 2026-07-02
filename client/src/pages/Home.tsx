import { useState } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSlideshowSplitScreen } from '@/components/HeroSlideshowSplitScreen';
import { slides } from '@/data/heroSlides';
import { ExploreMoreCollection } from '@/components/ExploreMoreCollection';
import { CollectorStory } from '@/components/CollectorStory';
import { BillingualLayout } from '@/components/BillingualLayout';
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

        {/* Sheikh Profile — bilingual split layout */}
        <section className="py-24 px-4 border-b border-[#d4af37]/15" style={{ background: 'rgba(212, 175, 55, 0.025)' }}>
          <div className="container max-w-7xl mx-auto">
            <BillingualLayout
              imageSrc="/images/sheikh/IMG_7787(1).png"
              imageAlt={isRTL ? "الشيخ عمار بن حميد النعيمي" : "Sheikh Ammar bin Humaid Al Nuaimi"}
            >
                <p className={`text-[11px] text-[#d4af37] font-semibold tracking-[0.45em] uppercase mb-5 ${isRTL ? 'font-arabic' : ''}`}>
                  {isRTL ? "المجمِّع الملكي" : "The Royal Collector"}
                </p>
                <div className={`flex items-center gap-4 mb-7 ${isRTL ? 'justify-end flex-row-reverse' : ''}`}>
                  <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/65 rotate-45" />
                  <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
                </div>

                <h2 className={`sheikh-name mb-3 ${isRTL ? 'font-arabic' : ''}`}>
                  {isRTL ? "الشيخ عمار بن حميد النعيمي" : "Sheikh Ammar bin Humaid Al Nuaimi"}
                </h2>
                <p className={`sheikh-title mb-8 ${isRTL ? 'font-arabic' : ''}`}>
                  {isRTL ? "ولي عهد عجمان — جامع الساعات الملكي" : "Crown Prince of Ajman — Royal Horologist"}
                </p>

                <p className={`sheikh-bio text-[#f5f2e8]/65 mb-10 ${isRTL ? 'font-arabic' : ''}`}>
                  {isRTL
                    ? "يجسّد سمو الشيخ عمار بن حميد النعيمي قيم التراث والابتكار في عالم الساعات الفاخرة. مجموعته الملكية، التي تضم أكثر من 34 قطعة استثنائية من أعرق دور صناعة الساعات في العالم، هي شهادة حية على الذوق الرفيع والعين الثاقبة للجمال."
                    : "His Highness Sheikh Ammar bin Humaid Al Nuaimi embodies the values of heritage and innovation in the world of fine horology. His Royal Collection — over 34 exceptional timepieces from the world's most distinguished maisons — stands as a testament to refined taste and a discerning eye for beauty."}
                </p>

                {/* Stats */}
                <div
                  className="grid grid-cols-3 gap-6 mb-10 py-8 border-y"
                  style={{ borderColor: 'rgba(212,175,55,0.15)' }}
                >
                  {[
                    { value: '34+', labelEn: 'Rare Pieces', labelAr: 'قطعة نادرة' },
                    { value: '$10M+', labelEn: 'Collection Value', labelAr: 'قيمة المجموعة' },
                    { value: '15+', labelEn: 'Limited Editions', labelAr: 'إصدارات محدودة' },
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <span className="sheikh-stat-value">{stat.value}</span>
                      <span className={`sheikh-stat-label ${isRTL ? 'font-arabic' : ''}`}>
                        {isRTL ? stat.labelAr : stat.labelEn}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className={`flex flex-wrap gap-4 ${isRTL ? 'justify-end' : ''}`}>
                  <Link href="/collections">
                    <button
                      className={`px-8 py-3.5 rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 hover:opacity-90 ${isRTL ? 'font-arabic' : ''}`}
                      style={{ background: '#d4af37', color: '#0a0a0a', boxShadow: '0 4px 20px rgba(212,175,55,0.3)' }}
                    >
                      {isRTL ? "استعرض المجموعة" : "View Collection"}
                    </button>
                  </Link>
                  <Link href="/sheikh-gallery">
                    <button
                      className={`px-8 py-3.5 rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 hover:border-[#d4af37]/70 hover:text-[#f5f2e8] ${isRTL ? 'font-arabic' : ''}`}
                      style={{ background: 'transparent', color: '#d4af37', border: '1px solid rgba(212,175,55,0.4)' }}
                    >
                      {isRTL ? "معرض الصور" : "Photo Gallery"}
                    </button>
                  </Link>
                </div>
            </BillingualLayout>
          </div>
        </section>

        {/* Collector's Story — personal imagery (father + MBZ) + editorial text */}
        <CollectorStory />

        {/* Explore More Collection */}
        <ExploreMoreCollection />

            {/* Featured Brands Section */}
            <section className="py-24 bg-[#0a0a0a]">
              <div className="container">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-16"
                >
                  <p className="text-[11px] text-[#d4af37] font-semibold tracking-[0.45em] uppercase mb-5">
                    {isRTL ? "البيوت العريقة" : "The Maisons"}
                  </p>
                  <div className="flex items-center justify-center gap-4 mb-7">
                    <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/65 rotate-45" />
                    <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
                  </div>
                  <h2
                    className={`text-[#f5f2e8] mb-4 ${isRTL ? "font-arabic" : ""}`}
                    style={{
                      fontFamily: isRTL ? undefined : 'Playfair Display, serif',
                      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                      fontWeight: 600,
                      lineHeight: 1.15,
                      letterSpacing: '-0.015em',
                    }}
                  >
                    {t("home.featuredBrands")}
                  </h2>
                  <p className={`text-[#f5f2e8]/55 ${isRTL ? "font-arabic" : ""}`} style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)' }}>
                    {t("home.discoverWatchmakers")}
                  </p>
                </motion.div>

                {/* Brands Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "Patek Philippe", nameAr: "باتيك فيليب", year: "1839", slug: "patek-philippe" },
                    { name: "Richard Mille", nameAr: "ريتشارد ميل", year: "2001", slug: "richard-mille" },
                    { name: "F.P. Journe", nameAr: "إف.بي. جورن", year: "1999", slug: "fp-journe" },
                    { name: "Audemars Piguet", nameAr: "أوديمار بيغيه", year: "1875", slug: "audemars-piguet" },
                    { name: "Rolex", nameAr: "رولكس", year: "1905", slug: "rolex" },
                    { name: "H. Moser & Cie", nameAr: "هـ. موزر وشركاه", year: "1828", slug: "h-moser-cie" },
                    { name: "Tudor", nameAr: "تيودور", year: "1926", slug: "tudor" },
                    { name: "Artisans de Genève", nameAr: "أرتيزانس دو جنيف", year: "2011", slug: "artisans-de-geneve" },
                  ].map((brand, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.07 }}
                      viewport={{ once: true }}
                    >
                      <Link href={`/collection/${brand.slug}`}>
                        <div
                          className="rounded-xl p-5 cursor-pointer group transition-all duration-300 text-center"
                          style={{
                            background: 'rgba(17, 20, 26, 0.5)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(212, 175, 55, 0.12)',
                          }}
                        >
                          <div
                            className="text-[2rem] font-serif leading-none text-center mb-3 select-none pointer-events-none"
                            style={{ color: 'rgba(212,175,55,0.07)' }}
                            aria-hidden="true"
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </div>
                          <h3
                            className="font-semibold text-[#d4af37] mb-1.5 group-hover:text-[#f5f2e8] transition-colors duration-300 leading-tight"
                            style={{
                              fontFamily: isRTL ? undefined : 'Playfair Display, serif',
                              fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                            }}
                          >
                            {isRTL ? brand.nameAr : brand.name}
                          </h3>
                          <p className="text-[11px] text-[#f5f2e8]/30 tracking-wider">Est. {brand.year}</p>
                          <div className="h-px w-6 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent mx-auto mt-3 group-hover:w-10 transition-all duration-300" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Collection Stats */}
            <section className="py-20 border-y border-[#d4af37]/15" style={{ background: 'rgba(212, 175, 55, 0.04)' }}>
              <div className="container">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { label: isRTL ? "ساعة فاخرة" : "Luxury Watches", value: "34+", sub: isRTL ? "قطعة" : "pieces" },
                    { label: isRTL ? "دور صناعة" : "Maisons", value: "8", sub: isRTL ? "بيت عريق" : "houses" },
                    { label: isRTL ? "القيمة الإجمالية" : "Total Value", value: "$10M+", sub: isRTL ? "تقديري" : "estimated" },
                    { label: isRTL ? "إصدارات محدودة" : "Limited Editions", value: "15+", sub: isRTL ? "قطعة نادرة" : "rare pieces" },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="text-center"
                    >
                      <div
                        className="mb-1"
                        style={{
                          fontFamily: isRTL ? undefined : 'Playfair Display, serif',
                          fontSize: 'clamp(2rem, 5vw, 3rem)',
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #C9A961 0%, #D4B896 50%, #A67C52 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {stat.value}
                      </div>
                      <p className={`text-[#f5f2e8]/65 text-sm ${isRTL ? "font-arabic" : ""}`}>{stat.label}</p>
                      <p className="text-[#f5f2e8]/25 text-[11px] tracking-widest uppercase mt-0.5">{stat.sub}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Collection Intro */}
            <section className="py-24 bg-[#0a0a0a]">
              <div className="container">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="max-w-3xl mx-auto text-center"
                >
                  <p className="text-[11px] text-[#d4af37] font-semibold tracking-[0.45em] uppercase mb-5">
                    {isRTL ? "المجموعة" : "The Collection"}
                  </p>
                  <div className="flex items-center justify-center gap-4 mb-7">
                    <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/65 rotate-45" />
                    <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
                  </div>
                  <h2
                    className={`text-[#f5f2e8] mb-6 ${isRTL ? "font-arabic" : ""}`}
                    style={{
                      fontFamily: isRTL ? undefined : 'Playfair Display, serif',
                      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                      fontWeight: 600,
                      lineHeight: 1.15,
                      letterSpacing: '-0.015em',
                    }}
                  >
                    {t("home.collectionTitle")}
                  </h2>

                  <p
                    className="text-[#f5f2e8]/60 mb-10 leading-loose"
                    dir={isRTL ? "rtl" : "ltr"}
                    style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', lineHeight: 1.85 }}
                  >
                    {isRTL
                      ? COLLECTION_INTRO.descriptionAr
                      : COLLECTION_INTRO.descriptionEn}
                  </p>

                  <Link href="/collections">
                    <Button
                      className={`font-semibold px-9 py-6 text-base inline-flex items-center gap-2.5 transition-all duration-300 ${isRTL ? "font-arabic" : ""}`}
                      style={{
                        background: '#d4af37',
                        color: '#0a0a0a',
                        border: '1px solid rgba(212,175,55,0.8)',
                        boxShadow: '0 4px 20px rgba(212,175,55,0.25)',
                      }}
                    >
                      {t("common.exploreCollection")}
                      {isRTL ? null : <ArrowRight className="w-4 h-4" />}
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </section>

        {/* Newsletter Section */}
        <section className="py-24 border-t border-[#d4af37]/15" style={{ background: 'rgba(212, 175, 55, 0.035)' }} dir={isRTL ? "rtl" : "ltr"}>
          <div className="container max-w-xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#d4af37]/08 rounded-full border border-[#d4af37]/25 mb-6">
                <Mail className="w-6 h-6 text-[#d4af37]" />
              </div>
              <p className="text-[11px] text-[#d4af37] font-semibold tracking-[0.45em] uppercase mb-4">
                {isRTL ? "النشرة البريدية" : "Newsletter"}
              </p>
              <h2
                className={`text-[#f5f2e8] mb-3 ${isRTL ? "font-arabic" : ""}`}
                style={{
                  fontFamily: isRTL ? undefined : 'Playfair Display, serif',
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                {t("home.newsletterTitle")}
              </h2>
              <p className={`text-[#f5f2e8]/50 mb-8 leading-relaxed text-sm ${isRTL ? "font-arabic" : ""}`}>
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

        <Footer />
      </div>
    </>
  );
}
