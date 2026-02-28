/**
 * CollectorStory — Personal editorial section for Sheikh Ammar's horology gallery.
 *
 * Displays two personal photographs with luxury editorial layout:
 *   1. Sheikh Ammar with his father  → /personal/sheikh-with-father.jpg
 *   2. Sheikh Ammar with H.H. MBZ    → /personal/sheikh-with-mbz.jpg
 *
 * Upload both images via the admin panel or place them at the paths above.
 * The component renders an elegant placeholder if an image is unavailable.
 *
 * Typography:  Playfair Display (headlines) + Inter/system-ui (body)
 * Palette:     #0a0a0a (bg) · #d4af37 (gold) · #f5f2e8 (cream text) · #6b6b6b (caption grey)
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
        en: 'Sheikh Ammar bin Humaid Al Nuaimi with his father in a candid moment',
        ar: 'الشيخ عمار بن حميد النعيمي مع والده في لحظة عفوية',
      },
      caption: {
        en: 'With His Father — the roots of a collector's spirit',
        ar: 'مع والده — جذور روح الجامع',
      },
      heading: { en: 'Roots of a Passion', ar: 'جذور الشغف' },
      body: {
        en: 'Every great collection begins with a story passed quietly between generations. For Sheikh Ammar, the love of precision and beauty was nurtured long before the first watch was acquired — in the unhurried conversations, the values, and the standards his father set. A collection is never merely objects; it is a living record of who taught you to see the world.',
        ar: 'كل مجموعة عظيمة تبدأ بقصة تتناقلها الأجيال بهدوء. بالنسبة للشيخ عمار، نشأ حب الدقة والجمال قبل أن يقتني أولى ساعاته بزمن طويل — في الحوارات الهادئة، والقيم، والمعايير التي غرسها والده. إن المجموعة ليست مجرد أشياء، بل هي سجل حي لمن علّمك رؤية العالم.',
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
        en: 'With H.H. President Mohammed bin Zayed Al Nahyan',
        ar: 'مع صاحب السمو الرئيس الشيخ محمد بن زايد آل نهيان',
      },
      heading: { en: 'In Distinguished Company', ar: 'في صحبة المتميزين' },
      body: {
        en: 'True connoisseurship transcends the object and speaks to character. Sheikh Ammar's refined taste and values are recognised in the highest circles of leadership in the Arab world. A passion for excellence in craft mirrors a commitment to excellence in governance, vision, and legacy — values shared in the distinguished company he keeps.',
        ar: 'إن المعرفة الحقيقية تتجاوز الشيء وتتحدث عن الشخصية. يُعرف الشيخ عمار بذوقه الرفيع في أرقى الأوساط القيادية في العالم العربي. إن الشغف بالتميز في الحرفية يعكس الالتزام بالتميز في القيادة والرؤية والإرث — قيم مشتركة في الصحبة المتميزة التي يحظى بها.',
      },
      imagePosition: 'right' as const,
    },
  ],
};

/* ─── Photo component with graceful fallback ──────────────────────────────── */

function PersonalPhoto({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-[#111] border border-[#d4af37]/20 rounded-2xl ${className}`}
      >
        <div className="text-center px-8 py-12">
          <div className="w-14 h-14 border border-[#d4af37]/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-serif text-[#d4af37]/60">SA</span>
          </div>
          <p className="text-[#f5f2e8]/30 text-xs tracking-widest uppercase">Photo forthcoming</p>
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
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

/* ─── Main component ──────────────────────────────────────────────────────── */

export function CollectorStory() {
  const { isRTL } = useLanguage();

  return (
    <section className="relative bg-[#0a0a0a] py-24 md:py-32 overflow-hidden" aria-label="Collector's Story">
      {/* Subtle texture dots */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, #d4af37 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative z-10">

        {/* ── Section header ── */}
        <motion.div
          className="text-center mb-20 md:mb-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          custom={0}
          variants={fadeUp}
        >
          {/* Label */}
          <p className="text-xs text-[#d4af37] font-semibold tracking-[0.4em] uppercase mb-5">
            {isRTL ? content.sectionLabel.ar : content.sectionLabel.en}
          </p>

          {/* Gold ornamental line */}
          <div className="flex items-center justify-center gap-4 mb-7">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/70 rotate-45" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]/60" />
          </div>

          {/* Headline */}
          <h2
            className="text-[#f5f2e8] mb-6"
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: 1.18,
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            {isRTL ? content.headline.ar : content.headline.en}
          </h2>

          {/* Intro paragraph */}
          <p
            className="max-w-2xl mx-auto text-[#f5f2e8]/65 leading-relaxed"
            style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.125rem)', lineHeight: 1.75 }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {isRTL ? content.intro.ar : content.intro.en}
          </p>
        </motion.div>

        {/* ── Editorial panels ── */}
        <div className="space-y-24 md:space-y-36">
          {content.panels.map((panel, panelIdx) => {
            const imageLeft = isRTL
              ? panel.imagePosition === 'right'
              : panel.imagePosition === 'left';

            return (
              <div
                key={panel.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                  imageLeft ? '' : 'lg:[direction:rtl]'
                }`}
              >
                {/* Photo column */}
                <motion.div
                  className="relative lg:[direction:ltr]"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  custom={0}
                  variants={fadeUp}
                >
                  <div className="relative rounded-2xl overflow-hidden"
                    style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(212,175,55,0.10)' }}
                  >
                    <PersonalPhoto
                      src={panel.image}
                      alt={isRTL ? panel.imageAlt.ar : panel.imageAlt.en}
                      className="w-full h-[420px] lg:h-[520px] object-cover"
                    />
                    {/* Depth gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                    {/* Corner accents */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#d4af37]/45 pointer-events-none" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#d4af37]/45 pointer-events-none" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#d4af37]/45 pointer-events-none" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#d4af37]/45 pointer-events-none" />
                  </div>

                  {/* Caption */}
                  <p className="mt-4 text-center text-xs text-[#6b6b6b] tracking-widest uppercase font-light italic"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {isRTL ? panel.caption.ar : panel.caption.en}
                  </p>

                  {/* Panel number */}
                  <div className="absolute -top-5 -left-2 text-[7rem] font-serif text-[#d4af37]/[0.04] leading-none select-none pointer-events-none" aria-hidden="true">
                    {String(panelIdx + 1).padStart(2, '0')}
                  </div>
                </motion.div>

                {/* Text column */}
                <motion.div
                  className="lg:[direction:ltr] space-y-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  custom={0.15}
                  variants={fadeUp}
                >
                  {/* Section number */}
                  <p className="text-[10px] text-[#d4af37]/50 tracking-[0.5em] uppercase font-medium">
                    {String(panelIdx + 1).padStart(2, '0')} —
                  </p>

                  {/* Heading */}
                  <h3
                    className="text-[#f5f2e8]"
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                      lineHeight: 1.22,
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {isRTL ? panel.heading.ar : panel.heading.en}
                  </h3>

                  {/* Gold rule */}
                  <div className="h-px w-12 bg-gradient-to-r from-[#d4af37]/70 to-transparent" />

                  {/* Body */}
                  <p
                    className="text-[#f5f2e8]/65 leading-loose"
                    style={{ fontSize: 'clamp(0.9rem, 1.35vw, 1.05rem)', lineHeight: 1.85 }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {isRTL ? panel.body.ar : panel.body.en}
                  </p>

                  {/* Pull quote decoration */}
                  <div className="border-l-2 border-[#d4af37]/30 pl-5 mt-6">
                    <p
                      className="text-[#d4af37]/60 text-sm italic font-light leading-relaxed"
                      style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                      {panelIdx === 0
                        ? (isRTL ? '"إرث التميز لا يُقتنى، بل يُورَث"' : '"A legacy of excellence is not acquired — it is inherited."')
                        : (isRTL ? '"الذوق الرفيع لغة تعرفها أرقى العقول"' : '"Refined taste is a language understood only by the finest minds."')
                      }
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom ornament ── */}
        <motion.div
          className="mt-24 md:mt-32 flex items-center justify-center gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#d4af37]/40" />
          <div className="w-2 h-2 border border-[#d4af37]/50 rotate-45" />
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#d4af37]/40" />
        </motion.div>
      </div>
    </section>
  );
}
