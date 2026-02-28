/**
 * CollectorStory — Personal editorial section for Sheikh Ammar's horology gallery.
 *
 * Three personal photographs:
 *   1. Sheikh Ammar with his father (intimate conversation)  → /personal/sheikh-with-father.jpg
 *   2. Sheikh Ammar with H.H. President MBZ (laughing)       → /personal/sheikh-with-mbz.jpg
 *   3. Sheikh Ammar at formal conference (blue thobe, watch)  → /personal/sheikh-formal.jpg
 *
 * Upload all 3 images via the admin panel or place them at the paths above.
 * The component renders an elegant placeholder when an image is unavailable.
 *
 * Typography:  Playfair Display (headlines) + system-ui (body)
 * Palette:     #0a0a0a (bg) · #d4af37 (gold) · #f5f2e8 (cream) · #6b6b6b (captions)
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

/* ─── Content ──────────────────────────────────────────────────────────────── */

const content = {
  sectionLabel: { en: 'THE COLLECTOR', ar: 'جامع التحف' },
  headline: { en: 'A Life Curated in Time', ar: 'حياة منقوشة في الزمن' },
  intro: {
    en: 'Sheikh Ammar bin Humaid Al Nuaimi has devoted decades to assembling one of the Arab world's most distinguished private horology collections — not as a pursuit of prestige, but as a lifelong devotion to craftsmanship, heritage, and the quiet art of measured time.',
    ar: 'أمضى الشيخ عمار بن حميد النعيمي عقوداً في تكوين واحدة من أرقى مجموعات الساعات الخاصة في العالم العربي — لا سعياً للمكانة، بل تعبيراً صادقاً عن شغف بالحرفية والتراث وفن الزمن الرفيع.',
  },

  panels: [
    {
      id: 'father',
      image: '/personal/sheikh-with-father.jpg',
      imageAlt: {
        en: 'Sheikh Ammar bin Humaid Al Nuaimi in conversation with his father H.H. Sheikh Humaid bin Rashid Al Nuaimi',
        ar: 'الشيخ عمار بن حميد النعيمي في حوار مع والده صاحب السمو الشيخ حميد بن راشد النعيمي',
      },
      caption: {
        en: 'With His Father H.H. Sheikh Humaid bin Rashid Al Nuaimi, Ruler of Ajman',
        ar: 'مع والده صاحب السمو الشيخ حميد بن راشد النعيمي، حاكم عجمان',
      },
      heading: { en: 'Roots of a Passion', ar: 'جذور الشغف' },
      body: {
        en: 'Every great collection begins with a story passed quietly between generations. For Sheikh Ammar, the love of precision and beauty was nurtured long before the first watch was acquired — in the unhurried conversations, the values, and the standards his father set. A collection is never merely objects; it is a living record of who taught you to see the world.',
        ar: 'كل مجموعة عظيمة تبدأ بقصة تتناقلها الأجيال بهدوء. بالنسبة للشيخ عمار، نشأ حب الدقة والجمال قبل أن يقتني أولى ساعاته بزمن طويل — في الحوارات الهادئة، والقيم، والمعايير التي غرسها والده. إن المجموعة ليست مجرد أشياء، بل هي سجل حي لمن علّمك رؤية العالم.',
      },
      quote: {
        en: '"A legacy of excellence is not acquired — it is inherited."',
        ar: '"إرث التميز لا يُقتنى، بل يُورَث"',
      },
      imagePosition: 'left' as const,
    },
    {
      id: 'mbz',
      image: '/personal/sheikh-with-mbz.jpg',
      imageAlt: {
        en: 'Sheikh Ammar bin Humaid Al Nuaimi with H.H. President Mohammed bin Zayed Al Nahyan',
        ar: 'الشيخ عمار بن حميد النعيمي مع صاحب السمو الرئيس محمد بن زايد آل نهيان',
      },
      caption: {
        en: 'With H.H. President Mohammed bin Zayed Al Nahyan, President of the UAE',
        ar: 'مع صاحب السمو الرئيس محمد بن زايد آل نهيان، رئيس الإمارات العربية المتحدة',
      },
      heading: { en: 'In Distinguished Company', ar: 'في صحبة المتميزين' },
      body: {
        en: 'True connoisseurship transcends the object and speaks to character. Sheikh Ammar's refined taste and values are recognised in the highest circles of leadership in the Arab world. A passion for excellence in craft mirrors a commitment to excellence in governance, vision, and legacy — values shared in the distinguished company he keeps.',
        ar: 'إن المعرفة الحقيقية تتجاوز الشيء وتتحدث عن الشخصية. يُعرف الشيخ عمار بذوقه الرفيع في أرقى الأوساط القيادية في العالم العربي. إن الشغف بالتميز في الحرفية يعكس الالتزام بالتميز في القيادة والرؤية والإرث — قيم مشتركة في الصحبة المتميزة التي يحظى بها.',
      },
      quote: {
        en: '"Refined taste is a language understood only by the finest minds."',
        ar: '"الذوق الرفيع لغة تعرفها أرقى العقول"',
      },
      imagePosition: 'right' as const,
    },
    {
      id: 'formal',
      image: '/personal/sheikh-formal.jpg',
      imageAlt: {
        en: 'Sheikh Ammar bin Humaid Al Nuaimi at a formal occasion in his distinctive blue thobe, wearing a rare timepiece',
        ar: 'الشيخ عمار بن حميد النعيمي في مناسبة رسمية بثوبه الأزرق المميز، يرتدي ساعة نادرة',
      },
      caption: {
        en: 'H.H. Sheikh Ammar at a formal occasion — timepiece on the wrist',
        ar: 'سموه الشيخ عمار في مناسبة رسمية — الساعة على معصمه',
      },
      heading: { en: 'The Timepiece as Statement', ar: 'الساعة كتعبير عن الشخصية' },
      body: {
        en: 'A watch on the wrist of Sheikh Ammar is never incidental. Each piece chosen speaks of a moment, a conversation, a memory. The craft he wears is the craft he lives — a visible extension of the values he holds: precision, rarity, and an unwavering commitment to the exceptional. For him, horology is not worn; it is carried.',
        ar: 'الساعة على معصم الشيخ عمار ليست أمراً عارضاً. كل قطعة مختارة تتحدث عن لحظة، وحوار، وذكرى. الحرفية التي يرتديها هي الحرفية التي يعيشها — امتداد مرئي للقيم التي يحملها: الدقة، والندرة، والالتزام الراسخ بالاستثنائي. فالساعة عنده لا تُلبَس؛ بل تُحمَل.',
      },
      quote: {
        en: '"A great watch is not worn on the wrist — it is carried in the soul."',
        ar: '"الساعة العظيمة لا تُلبَس على المعصم — بل تُحمَل في الروح"',
      },
      imagePosition: 'left' as const,
    },
  ],
};

/* ─── Photo component with graceful fallback ──────────────────────────────── */

function PersonalPhoto({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-[#111] border border-[#d4af37]/15 rounded-2xl ${className}`}>
        <div className="text-center px-8 py-12">
          <div className="w-14 h-14 border border-[#d4af37]/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-serif text-[#d4af37]/50">SA</span>
          </div>
          <p className="text-[#f5f2e8]/20 text-xs tracking-widest uppercase">Photo forthcoming</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
      decoding="async"
    />
  );
}

/* ─── Animation variants ──────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

/* ─── Main component ──────────────────────────────────────────────────────── */

export function CollectorStory() {
  const { isRTL } = useLanguage();

  return (
    <section
      className="relative bg-[#0a0a0a] py-24 md:py-36 overflow-hidden"
      aria-label="Collector's Story"
    >
      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{
          backgroundImage: 'radial-gradient(circle, #d4af37 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative z-10">

        {/* ── Section header ── */}
        <motion.div
          className="text-center mb-20 md:mb-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
        >
          <p className="text-[11px] text-[#d4af37] font-semibold tracking-[0.45em] uppercase mb-5">
            {isRTL ? content.sectionLabel.ar : content.sectionLabel.en}
          </p>

          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]/55" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/65 rotate-45" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]/55" />
          </div>

          <h2
            className="text-[#f5f2e8] mb-7"
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: 1.16,
              fontWeight: 600,
              letterSpacing: '-0.015em',
            }}
          >
            {isRTL ? content.headline.ar : content.headline.en}
          </h2>

          <p
            className="max-w-2xl mx-auto text-[#f5f2e8]/60 leading-relaxed"
            style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', lineHeight: 1.8 }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {isRTL ? content.intro.ar : content.intro.en}
          </p>
        </motion.div>

        {/* ── Editorial panels ── */}
        <div className="space-y-28 md:space-y-40">
          {content.panels.map((panel, panelIdx) => {
            const imageLeft = isRTL
              ? panel.imagePosition === 'right'
              : panel.imagePosition === 'left';

            return (
              <div
                key={panel.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center ${
                  imageLeft ? '' : 'lg:[direction:rtl]'
                }`}
              >
                {/* Photo column */}
                <motion.div
                  className="relative lg:[direction:ltr]"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeUp}
                  custom={0}
                >
                  {/* Giant faded panel number */}
                  <div
                    className="absolute -top-6 -left-3 text-[8rem] font-serif leading-none select-none pointer-events-none"
                    style={{ color: 'rgba(212,175,55,0.045)' }}
                    aria-hidden="true"
                  >
                    {String(panelIdx + 1).padStart(2, '0')}
                  </div>

                  <div
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                      boxShadow: '0 28px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.09)',
                    }}
                  >
                    <PersonalPhoto
                      src={panel.image}
                      alt={isRTL ? panel.imageAlt.ar : panel.imageAlt.en}
                      className="w-full h-[440px] lg:h-[540px] object-cover object-top"
                    />
                    {/* Depth gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                    {/* Corner accents */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#d4af37]/40 pointer-events-none" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#d4af37]/40 pointer-events-none" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#d4af37]/40 pointer-events-none" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#d4af37]/40 pointer-events-none" />
                  </div>

                  {/* Caption */}
                  <p
                    className="mt-4 text-center text-[11px] text-[#6b6b6b] tracking-[0.18em] uppercase font-light italic"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {isRTL ? panel.caption.ar : panel.caption.en}
                  </p>
                </motion.div>

                {/* Text column */}
                <motion.div
                  className="lg:[direction:ltr] space-y-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeUp}
                  custom={0.18}
                >
                  {/* Panel index */}
                  <p className="text-[10px] text-[#d4af37]/45 tracking-[0.55em] uppercase font-medium">
                    {String(panelIdx + 1).padStart(2, '0')} —
                  </p>

                  {/* Heading */}
                  <h3
                    className="text-[#f5f2e8]"
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                      lineHeight: 1.2,
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {isRTL ? panel.heading.ar : panel.heading.en}
                  </h3>

                  {/* Gold rule */}
                  <div className="h-px w-14 bg-gradient-to-r from-[#d4af37]/65 to-transparent" />

                  {/* Body */}
                  <p
                    className="text-[#f5f2e8]/62 leading-loose"
                    style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)', lineHeight: 1.9 }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {isRTL ? panel.body.ar : panel.body.en}
                  </p>

                  {/* Pull quote */}
                  <div className="border-l-2 border-[#d4af37]/25 pl-5 pt-1">
                    <p
                      className="text-[#d4af37]/55 text-sm italic font-light leading-relaxed"
                      style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      {isRTL ? panel.quote.ar : panel.quote.en}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom ornament ── */}
        <motion.div
          className="mt-28 md:mt-40 flex items-center justify-center gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#d4af37]/35" />
          <div className="w-2 h-2 border border-[#d4af37]/45 rotate-45" />
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#d4af37]/35" />
        </motion.div>
      </div>
    </section>
  );
}
