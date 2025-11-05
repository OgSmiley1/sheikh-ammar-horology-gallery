import { useState } from 'react';
import { Header } from "@/components/Header";
import { HeroSlideshowProfessional } from '@/components/HeroSlideshowProfessional';
import { ExploreMoreCollection } from '@/components/ExploreMoreCollection';
import { CustomCursor } from '@/components/CustomCursor';
import { ScrollProgress } from '@/components/ScrollProgress';
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { COLLECTION_INTRO } from "@shared/constants";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

// Top 5 watches data
const top5Watches = [
  {
    id: 1,
    brand: { en: 'Richard Mille', ar: 'ريتشارد ميل' },
    model: { en: 'RM 26-02 Evil Eye', ar: 'RM 26-02 عين الشر' },
    reference: 'RM 26-02',
    price: { min: 600000, max: 900000 },
    story: {
      en: 'A masterpiece combining aerospace materials with traditional craftsmanship. The "Evil Eye" tourbillon represents the pinnacle of technical innovation and artistic vision.',
      ar: 'تحفة فنية تجمع بين مواد الطيران والحرفية التقليدية. يمثل توربيون "عين الشر" قمة الابتكار التقني والرؤية الفنية.',
    },
    movement: 'Caliber RM 26-02, Manual-winding tourbillon',
    case: 'Titanium with Evil Eye decoration',
    diameter: '38mm x 47mm',
    complications: ['Tourbillon', 'Hours', 'Minutes'],
    sheikhImage: '/watches-optimized/images(8).webp',
    watchImage: '/watches-optimized/rm-26-02.webp',
    rarity: 'Ultra Rare - Limited Production',
    year: '2018',
  },
  {
    id: 2,
    brand: { en: 'Patek Philippe', ar: 'باتيك فيليب' },
    model: { en: 'Nautilus 5711/1300A', ar: 'نوتيلوس 5711/1300A' },
    reference: '5711/1300A-001',
    price: { min: 450000, max: 600000 },
    story: {
      en: 'The olive green dial Nautilus represents the ultimate in rarity. Only a handful were produced before discontinuation, making it one of the most sought-after modern Patek Philippe watches.',
      ar: 'يمثل نوتيلوس بالميناء الأخضر الزيتوني قمة الندرة. تم إنتاج حفنة فقط قبل التوقف، مما يجعلها واحدة من أكثر ساعات باتيك فيليب الحديثة المطلوبة.',
    },
    movement: 'Caliber 26-330 S C, Automatic',
    case: 'Stainless Steel',
    diameter: '40mm',
    complications: ['Date', 'Center seconds'],
    sheikhImage: '/watches-optimized/images(9).webp',
    watchImage: '/watches-optimized/nautilus-5711.webp',
    rarity: 'Extremely Rare - Discontinued',
    year: '2021',
  },
  {
    id: 3,
    brand: { en: 'Patek Philippe', ar: 'باتيك فيليب' },
    model: { en: 'Ref. 5470P-001', ar: 'المرجع 5470P-001' },
    reference: '5470P-001',
    price: { min: 350000, max: 500000 },
    story: {
      en: 'A unique 1/1 piece created for Only Watch 2019. This platinum chronograph with perpetual calendar represents the absolute pinnacle of Swiss watchmaking excellence.',
      ar: 'قطعة فريدة 1/1 تم إنشاؤها لمزاد Only Watch 2019. يمثل هذا الكرونوغراف البلاتيني مع التقويم الدائم قمة التميز السويسري المطلقة في صناعة الساعات.',
    },
    movement: 'Caliber CHR 27-525 PS Q, Manual-winding',
    case: 'Platinum 950',
    diameter: '41mm',
    complications: ['Perpetual Calendar', 'Chronograph', 'Moon Phase'],
    sheikhImage: '/watches-optimized/download(7).webp',
    watchImage: '/watches-optimized/patek-5470p.webp',
    rarity: 'Unique Piece - 1/1',
    year: '2019',
  },
  {
    id: 4,
    brand: { en: 'Patek Philippe', ar: 'باتيك فيليب' },
    model: { en: 'Ref. 5959P-001', ar: 'المرجع 5959P-001' },
    reference: '5959P-001',
    price: { min: 300000, max: 450000 },
    story: {
      en: 'The split-seconds chronograph in platinum represents centuries of horological expertise. A masterpiece of technical complexity and refined elegance.',
      ar: 'يمثل الكرونوغراف المنقسم الثواني من البلاتين قروناً من الخبرة في صناعة الساعات. تحفة من التعقيد التقني والأناقة الراقية.',
    },
    movement: 'Caliber CHR 27-525 PS, Manual-winding',
    case: 'Platinum 950',
    diameter: '33mm',
    complications: ['Split-Seconds Chronograph', 'Hours', 'Minutes'],
    sheikhImage: '/watches-optimized/download(4).webp',
    watchImage: '/watches-optimized/patek-5959p.webp',
    rarity: 'Very Rare - Limited Production',
    year: '2020',
  },
  {
    id: 5,
    brand: { en: 'Audemars Piguet', ar: 'أوديمار بيغيه' },
    model: { en: 'Royal Oak 26579CS', ar: 'رويال أوك 26579CS' },
    reference: '26579CS.OO.1225CS.01',
    price: { min: 200000, max: 300000 },
    story: {
      en: 'The Royal Oak Perpetual Calendar in stainless steel represents the perfect balance of sportiness and haute horlogerie. A modern icon with timeless appeal.',
      ar: 'يمثل رويال أوك بالتقويم الدائم من الفولاذ المقاوم للصدأ التوازن المثالي بين الرياضة والساعات الراقية. أيقونة عصرية بجاذبية خالدة.',
    },
    movement: 'Caliber 5134, Automatic',
    case: 'Stainless Steel',
    diameter: '41mm',
    complications: ['Perpetual Calendar', 'Moon Phase', 'Week Display'],
    sheikhImage: '/watches-optimized/download(3).webp',
    watchImage: '/watches-optimized/ap-26579cs.webp',
    rarity: 'Rare - Limited Production',
    year: '2022',
  },
];

export default function Home() {
  const { t, isRTL } = useLanguage();

  return (
    <>
      {/* Custom cursor */}
      <CustomCursor />

      {/* Scroll progress bar */}
      <ScrollProgress />

      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />

        {/* Hero Slideshow: 4 Watches + Sheikh Portrait */}
        <HeroSlideshowProfessional />

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
                  <h2 className="text-4xl md:text-5xl font-serif text-[#f5f2e8] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {isRTL ? "العلامات التجارية المميزة" : "Featured Brands"}
                  </h2>
                  <p className="text-lg text-[#f5f2e8]/70">
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
                        <p className="text-sm text-[#f5f2e8]/60 mb-1">
                          {isRTL ? "تأسس عام" : "Founded"} {brand.year}
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
                  <h2 className="text-4xl md:text-5xl font-serif text-[#f5f2e8] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {isRTL ? "إرث من التميز" : "A Legacy of Excellence"}
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
                    <Button className="bg-[#d4af37] hover:bg-[#f5f2e8] text-black font-semibold px-8 py-6 text-lg inline-flex items-center gap-2 transition-all duration-300">
                      {isRTL ? "استكشف المجموعة" : "Explore Collection"}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
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
