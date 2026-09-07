import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { WatchMedia } from "@/components/WatchMedia";

type Bilingual = { en: string; ar: string };

type StoryDefinition = {
  slug: string;
  eyebrow: Bilingual;
  name: Bilingual;
  title: Bilingual;
  body: Bilingual;
  facts: Array<{ label: Bilingual; value: Bilingual }>;
};

const storyDefinitions: StoryDefinition[] = [
  {
    slug: "h-moser-endeavour-tourbillon-vantablack-1804-0212",
    eyebrow: { en: "MODEL STUDY 01", ar: "دراسة طراز 01" },
    name: { en: "Endeavour Tourbillon Concept Vantablack", ar: "إنديفور توربيون كونسبت فانتابلاك" },
    title: { en: "The study in black", ar: "دراسة في السواد" },
    body: {
      en: "A restrained reading of the Endeavour Tourbillon Concept Vantablack: the dial becomes an optical void, leaving the flying tourbillon to carry the composition.",
      ar: "قراءة هادئة لساعة إنديفور توربيون كونسبت فانتابلاك: تتحول المينا إلى فراغ بصري، فيما يحمل التوربيون الطائر مركز التكوين.",
    },
    facts: [
      { label: { en: "Reference", ar: "المرجع" }, value: { en: "1804-0212", ar: "1804-0212" } },
      { label: { en: "Dial", ar: "المينا" }, value: { en: "Vantablack®", ar: "فانتابلاك®" } },
      { label: { en: "Complication", ar: "التعقيد" }, value: { en: "Flying tourbillon", ar: "توربيون طائر" } },
    ],
  },
  {
    slug: "audemars-piguet-royal-oak-perpetual-calendar-blue-ceramic-26579cs",
    eyebrow: { en: "MODEL STUDY 02", ar: "دراسة طراز 02" },
    name: { en: "Royal Oak Perpetual Calendar", ar: "رويال أوك بيربيتوال كالندر" },
    title: { en: "The calendar in blue", ar: "تقويم باللون الأزرق" },
    body: {
      en: "This Royal Oak Perpetual Calendar study focuses on the dialogue between an architectural bracelet, blue ceramic and the quiet density of a complete calendar.",
      ar: "تركز هذه الدراسة لرويال أوك بيربيتوال كالندر على الحوار بين السوار المعماري والسيراميك الأزرق وكثافة التقويم الكامل الهادئة.",
    },
    facts: [
      { label: { en: "Reference", ar: "المرجع" }, value: { en: "26579CS", ar: "26579CS" } },
      { label: { en: "Case", ar: "العلبة" }, value: { en: "Blue ceramic", ar: "سيراميك أزرق" } },
      { label: { en: "Complication", ar: "التعقيد" }, value: { en: "Perpetual calendar", ar: "تقويم دائم" } },
    ],
  },
  {
    slug: "audemars-piguet-royal-oak-perpetual-calendar-white-ceramic-26579cb",
    eyebrow: { en: "MODEL STUDY 03", ar: "دراسة طراز 03" },
    name: { en: "Royal Oak Perpetual Calendar", ar: "رويال أوك بيربيتوال كالندر" },
    title: { en: "The calendar in white", ar: "تقويم بالأبيض" },
    body: {
      en: "A complementary perpetual-calendar study: white ceramic gives the Royal Oak’s exacting geometry a luminous, deliberately modern register.",
      ar: "دراسة مكمّلة للتقويم الدائم: يمنح السيراميك الأبيض هندسة رويال أوك الدقيقة حضوراً مضيئاً ومعاصراً عن قصد.",
    },
    facts: [
      { label: { en: "Reference", ar: "المرجع" }, value: { en: "26579CB", ar: "26579CB" } },
      { label: { en: "Case", ar: "العلبة" }, value: { en: "White ceramic", ar: "سيراميك أبيض" } },
      { label: { en: "Complication", ar: "التعقيد" }, value: { en: "Perpetual calendar", ar: "تقويم دائم" } },
    ],
  },
];

export function ArchiveStorySlideshow() {
  const { language, isRTL } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const { data: watches = [] } = trpc.watches.getAll.useQuery();

  const slides = useMemo(
    () => storyDefinitions
      .map((story) => ({ ...story, watch: watches.find((watch) => watch.slug === story.slug) }))
      .filter((slide): slide is StoryDefinition & { watch: (typeof watches)[number] } => Boolean(slide.watch?.mainImageUrl)),
    [watches],
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (activeIndex >= slides.length && slides.length) setActiveIndex(0);
  }, [activeIndex, slides.length]);

  useEffect(() => {
    if (paused || prefersReducedMotion || slides.length < 2) return;
    const rotation = window.setInterval(() => setActiveIndex((current) => (current + 1) % slides.length), 7200);
    return () => window.clearInterval(rotation);
  }, [paused, prefersReducedMotion, slides.length]);

  useEffect(() => {
    const video = backgroundVideoRef.current;
    if (!video) return;
    if (paused || prefersReducedMotion) {
      video.pause();
      return;
    }
    void video.play().catch(() => {
      // The still poster remains a composed, accessible fallback if autoplay is unavailable.
    });
  }, [paused, prefersReducedMotion]);

  if (!slides.length) return null;

  const activeSlide = slides[activeIndex];
  const activeName = activeSlide.name[language];
  const previous = () => setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  const next = () => {
    setDetailsOpen(false);
    setActiveIndex((current) => (current + 1) % slides.length);
  };
  const movementStopped = paused || prefersReducedMotion;

  return (
    <section id="watch-stories" data-story-release="calm-motion-v2" className="archive-story relative isolate scroll-mt-20 overflow-hidden px-4 pb-16 pt-36 md:pb-20 md:pt-40" aria-labelledby="archive-story-heading" aria-label={isRTL ? "عرض قصص الساعات" : "Watch-story slideshow"}>
      <div className="archive-story__backdrop" aria-hidden="true">
        <video
          ref={backgroundVideoRef}
          autoPlay={!prefersReducedMotion}
          loop
          muted
          playsInline
          preload="metadata"
          poster="/sheikh-photos/sheikh-portrait-1.webp"
        >
          <source src="/manus-storage/royal-horology-cinematic-background_8dac247a.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="archive-story__veil" aria-hidden="true" />
      <div className="archive-story__grid" aria-hidden="true" />

      <div className="container relative z-10 mx-auto">
        <div className="grid items-center gap-11 lg:grid-cols-2 lg:gap-20 xl:gap-28">
          <motion.figure
            key={`${activeSlide.slug}-figure`}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.23, 1, 0.32, 1] }}
            className={`archive-story__stage relative mx-auto w-full max-w-[35rem] ${isRTL ? "lg:order-2" : "lg:order-1"}`}
          >
            <div className="archive-story__watch-frame">
              <div className={`archive-story__overview ${isRTL ? "flex-row-reverse" : ""}`} aria-hidden="true">
                <span>{isRTL ? "قصص الساعات" : "WATCH STORIES"}</span>
                <span>{isRTL ? "عرض متحرك" : "SLIDESHOW"}</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.slug}
                  className="h-full w-full"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: [0.23, 1, 0.32, 1] }}
                >
                  <WatchMedia
                    imageUrl={activeSlide.watch.mainImageUrl}
                    alt={activeName}
                    watchName={activeName}
                    language={language}
                    priority="high"
                    className="watch-media-fill"
                  />
                </motion.div>
              </AnimatePresence>
              <figcaption className="archive-story__image-caption">
                <span>{isRTL ? "دراسة بصرية من الأرشيف" : "ARCHIVE VISUAL STUDY"}</span>
                <span>{String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
              </figcaption>
            </div>
          </motion.figure>

          <motion.div
            key={`${activeSlide.slug}-copy`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className={`archive-story__copy ${isRTL ? "lg:order-1 text-left" : "lg:order-2 text-left"}`}
          >
            <p className="archive-story__eyebrow">{activeSlide.eyebrow[language]}</p>
            <h1 id="archive-story-heading" className="archive-story__name mt-6">{activeName}</h1>
            <h2 className="archive-story__title mt-4">{activeSlide.title[language]}</h2>
            <p className="archive-story__reading mt-6">{activeSlide.body[language]}</p>

            <button type="button" className="archive-story__detail-toggle mt-6" onClick={() => setDetailsOpen((current) => !current)} aria-expanded={detailsOpen}>
              {isRTL ? (detailsOpen ? "إخفاء تفاصيل الدراسة" : "عرض تفاصيل الدراسة") : (detailsOpen ? "Hide study details" : "View study details")}
            </button>

            {detailsOpen && (
              <motion.dl initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.35 }} className="archive-story__facts mt-5 grid gap-px border border-primary/25 bg-primary/25 sm:grid-cols-3">
                {activeSlide.facts.map((fact) => (
                  <div key={fact.label.en} className="bg-background/88 p-4 backdrop-blur-sm">
                    <dt>{fact.label[language]}</dt>
                    <dd>{fact.value[language]}</dd>
                  </div>
                ))}
              </motion.dl>
            )}

            <p className="archive-story__boundary mt-5">
              {isRTL
                ? "يجمع المشهد الخلفي صوراً موثقة من معرض الصور الرسمي وأصول المشروع، ولا يضيف ادعاءات جديدة أو يعرض أي ساعة للبيع."
                : "The background sequence combines documented Official Gallery imagery and project assets; it introduces no new claims and does not offer any watch for sale."}
            </p>
            <a
              href="https://www.ammarbinhumaid.ae/en/media-gallery-photos/"
              target="_blank"
              rel="noopener noreferrer"
              className="archive-story__source-link mt-4"
            >
              {isRTL ? "مرجع الصور الرسمية" : "Official Gallery source"}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href={`/watch/${activeSlide.watch.slug}`} className="royal-action royal-action--primary">
                {isRTL ? "اقرأ السجل" : "Read the record"}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a href="#archive-prelude" className="royal-action royal-action--quiet">
                {isRTL ? "كيف يُقرأ الأرشيف" : "How the archive reads"}
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <div className={`archive-story__controls ${isRTL ? "right-6 md:right-12" : "left-6 md:left-12"}`} role="group" aria-label={isRTL ? "التحكم في قصص الساعات" : "Watch story controls"}>
        <button type="button" className="archive-story__control" onClick={previous} aria-label={isRTL ? "القصة السابقة" : "Previous story"}>
          {isRTL ? <ArrowRight className="h-3.5 w-3.5" /> : <ArrowLeft className="h-3.5 w-3.5" />}
        </button>
        <button
          type="button"
          className="archive-story__control"
          onClick={() => setPaused((current) => !current)}
          aria-pressed={movementStopped}
          aria-label={isRTL ? (movementStopped ? "تشغيل الحركة" : "إيقاف الحركة") : (movementStopped ? "Play motion" : "Pause motion")}
        >
          {movementStopped ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        </button>
        <button type="button" className="archive-story__control" onClick={next} aria-label={isRTL ? "القصة التالية" : "Next story"}>
          {isRTL ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
        </button>
        <div className="archive-story__progress" aria-label={isRTL ? "مؤشر القصة" : "Story progress"}>
          {slides.map((slide, index) => (
            <button key={slide.slug} type="button" onClick={() => setActiveIndex(index)} aria-label={isRTL ? `الانتقال إلى القصة ${index + 1}` : `Go to story ${index + 1}`} aria-current={index === activeIndex ? "true" : undefined} className={index === activeIndex ? "is-active" : ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
