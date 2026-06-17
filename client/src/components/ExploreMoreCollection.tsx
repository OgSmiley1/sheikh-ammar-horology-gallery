import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { X } from 'lucide-react';

interface Watch {
  id: number;
  brand: { en: string; ar: string };
  model: { en: string; ar: string };
  reference: string;
  price: { min: number; max: number };
  story: { en: string; ar: string };
  movement: string;
  case: string;
  diameter: string;
  complications: string[];
  watchImage: string;
  rarity: string;
  year: string;
}

const allWatches: Watch[] = [
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
    watchImage: '/watches-optimized/ap-26579cs.webp',
    rarity: 'Rare - Limited Production',
    year: '2022',
  },
];

export function ExploreMoreCollection() {
  const [selectedWatch, setSelectedWatch] = useState<Watch | null>(null);
  const { isRTL } = useLanguage();

  return (
    <>
      {/* Explore More Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[11px] text-[#d4af37] font-semibold tracking-[0.45em] uppercase mb-5">
              {isRTL ? 'التحف الاستثنائية' : 'Selected Pieces'}
            </p>
            <div className="flex items-center justify-center gap-4 mb-7">
              <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/65 rotate-45" />
              <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
            </div>
            <h2
              className="text-[#f5f2e8] mb-4"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 600,
                lineHeight: 1.15,
                letterSpacing: '-0.015em',
              }}
            >
              {isRTL ? 'استكشف المجموعة الكاملة' : 'Explore the Full Collection'}
            </h2>
            <p className="text-[#f5f2e8]/55" style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)' }}>
              {isRTL ? 'اكتشف أندر الساعات الفاخرة في العالم' : "Discover the world's rarest luxury timepieces"}
            </p>
          </motion.div>

          {/* Watches Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {allWatches.map((watch, idx) => (
              <motion.button
                key={watch.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                viewport={{ once: true }}
                onClick={() => setSelectedWatch(watch)}
                className="group cursor-pointer text-left"
              >
                <div
                  className="relative overflow-hidden rounded-xl mb-4 aspect-square"
                  style={{
                    background: 'rgba(10, 10, 10, 0.85)',
                    border: '1px solid rgba(212, 175, 55, 0.12)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}
                >
                  <img
                    src={watch.watchImage}
                    alt={watch.model.en}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-center pb-4">
                    <p className="text-[#d4af37] text-xs font-semibold tracking-wider uppercase">
                      {isRTL ? 'عرض التفاصيل' : 'View Details'}
                    </p>
                  </div>
                  {/* Corner accents */}
                  <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t border-l border-[#d4af37]/25 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t border-r border-[#d4af37]/25 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b border-l border-[#d4af37]/25 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b border-r border-[#d4af37]/25 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div>
                  <p className="text-[#d4af37]/65 text-[10px] uppercase tracking-[0.3em] mb-1.5">
                    {watch.brand.en}
                  </p>
                  <h3
                    className="text-[#f5f2e8] group-hover:text-[#d4af37] transition-colors duration-300 mb-1.5 leading-snug"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: 'clamp(0.8rem, 1.3vw, 0.95rem)',
                      fontWeight: 600,
                    }}
                  >
                    {isRTL ? watch.model.ar : watch.model.en}
                  </h3>
                  <p className="text-[#f5f2e8]/30 text-[11px] tracking-wider mb-1">
                    {watch.reference}
                  </p>
                  <p className="text-[#d4af37] font-semibold text-xs">
                    ${watch.price.min.toLocaleString()} – ${watch.price.max.toLocaleString()}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal for Watch Details */}
      <AnimatePresence>
        {selectedWatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedWatch(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#0a0a0a] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#d4af37]/20"
              style={{ boxShadow: '0 28px 70px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.08)' }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedWatch(null)}
                className="absolute top-4 end-4 z-10 p-2 hover:bg-[#d4af37]/10 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-[#d4af37]" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                {/* Watch Image */}
                <motion.div
                  initial={{ x: isRTL ? 50 : -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex items-center justify-center"
                >
                  <img
                    src={selectedWatch.watchImage}
                    alt={selectedWatch.model.en}
                    className="w-full max-w-sm h-auto object-contain"
                  />
                </motion.div>

                {/* Watch Details */}
                <motion.div
                  initial={{ x: isRTL ? -50 : 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <p className="text-[#d4af37] text-sm font-semibold uppercase tracking-widest mb-2">
                    {selectedWatch.brand.en}
                  </p>
                  <h2 className="text-4xl font-serif text-[#f5f2e8] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {isRTL ? selectedWatch.model.ar : selectedWatch.model.en}
                  </h2>
                  <p className="text-[#d4af37] text-lg font-semibold mb-4">
                    {selectedWatch.reference}
                  </p>

                  <p className="text-[#f5f2e8]/80 text-lg leading-relaxed mb-6">
                    {isRTL ? selectedWatch.story.ar : selectedWatch.story.en}
                  </p>

                  {/* Specifications Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="px-4 py-3 border border-[#d4af37]/30 rounded">
                      <p className="text-[#d4af37] text-xs uppercase tracking-widest mb-1">
                        {isRTL ? 'الحركة' : 'Movement'}
                      </p>
                      <p className="text-[#f5f2e8] text-sm">{selectedWatch.movement}</p>
                    </div>
                    <div className="px-4 py-3 border border-[#d4af37]/30 rounded">
                      <p className="text-[#d4af37] text-xs uppercase tracking-widest mb-1">
                        {isRTL ? 'العلبة' : 'Case'}
                      </p>
                      <p className="text-[#f5f2e8] text-sm">{selectedWatch.case}</p>
                    </div>
                    <div className="px-4 py-3 border border-[#d4af37]/30 rounded">
                      <p className="text-[#d4af37] text-xs uppercase tracking-widest mb-1">
                        {isRTL ? 'القطر' : 'Diameter'}
                      </p>
                      <p className="text-[#f5f2e8] text-sm">{selectedWatch.diameter}</p>
                    </div>
                    <div className="px-4 py-3 border border-[#d4af37]/30 rounded">
                      <p className="text-[#d4af37] text-xs uppercase tracking-widest mb-1">
                        {isRTL ? 'السنة' : 'Year'}
                      </p>
                      <p className="text-[#f5f2e8] text-sm">{selectedWatch.year}</p>
                    </div>
                  </div>

                  {/* Price and Rarity */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1 px-4 py-3 border border-[#d4af37] rounded">
                      <p className="text-[#d4af37] text-xs uppercase tracking-widest mb-1">
                        {isRTL ? 'السعر' : 'Price Range'}
                      </p>
                      <p className="text-[#f5f2e8] font-semibold">
                        ${selectedWatch.price.min.toLocaleString()} - ${selectedWatch.price.max.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex-1 px-4 py-3 border border-[#d4af37] rounded">
                      <p className="text-[#d4af37] text-xs uppercase tracking-widest mb-1">
                        {isRTL ? 'الندرة' : 'Rarity'}
                      </p>
                      <p className="text-[#f5f2e8] font-semibold text-sm">{selectedWatch.rarity}</p>
                    </div>
                  </div>

                  {/* Complications */}
                  <div>
                    <p className="text-[#d4af37] text-xs uppercase tracking-widest mb-2">
                      {isRTL ? 'المضاعفات' : 'Complications'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedWatch.complications.map((comp, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded text-[#f5f2e8] text-sm"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
