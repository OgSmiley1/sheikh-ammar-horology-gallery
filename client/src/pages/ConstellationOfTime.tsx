import { ArrowLeft, ArrowRight, Compass, Orbit, Pause, Play, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WatchMedia } from "@/components/WatchMedia";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { localizeConstellationModel } from "@/lib/constellationPresentation";

const firstLightMotionUrl = "/manus-storage/FirstLight_ab12bafa.mp4";

export default function ConstellationOfTime() {
  const { language, isRTL } = useLanguage();
  const isArabic = language === "ar";
  const { data: watches = [], isLoading: watchesLoading, error: watchesError } = trpc.watches.getAll.useQuery();
  const { data: brands = [], isLoading: brandsLoading, error: brandsError } = trpc.brands.getAll.useQuery();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const featured = useMemo(() => {
    const museumAddition = watches.find((watch) => watch.slug === "artisans-de-geneve-andrea-pirlo-rolex-submariner");
    const historicSequence = watches.filter((watch) => watch.slug !== museumAddition?.slug).slice(0, 5);
    return museumAddition ? [...historicSequence, museumAddition] : watches.slice(0, 6);
  }, [watches]);
  const activeWatch = featured[activeIndex] ?? featured[0];

  const brandName = (brandId: number) => {
    const brand = brands.find((entry) => entry.id === brandId);
    return isArabic ? (brand?.nameAr || brand?.nameEn) : brand?.nameEn;
  };

  const watchName = (watch: (typeof watches)[number]) => localizeConstellationModel(watch.nameEn, watch.nameAr, language);
  const isLoading = watchesLoading || brandsLoading;
  const hasError = Boolean(watchesError || brandsError);

  useEffect(() => {
    if (activeIndex >= featured.length && featured.length > 0) setActiveIndex(0);
  }, [activeIndex, featured.length]);

  useEffect(() => {
    if (isPaused || featured.length < 2) return;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % featured.length), 7200);
    return () => window.clearInterval(timer);
  }, [featured.length, isPaused]);

  const selectPrevious = () => setActiveIndex((current) => (current - 1 + featured.length) % featured.length);
  const selectNext = () => setActiveIndex((current) => (current + 1) % featured.length);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <main>
        {isLoading ? (
          <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 pt-28"><div className="luxury-panel w-full max-w-xl p-10 text-center" aria-live="polite"><div className="mx-auto mb-5 h-12 w-12 animate-pulse rounded-full border-2 border-primary border-t-transparent" /><p className="overline text-primary">{isArabic ? "جاري معايرة الكوكبة" : "CALIBRATING THE CONSTELLATION"}</p><p className="mt-3 text-muted-foreground">{isArabic ? "يتم الآن إعداد سجلات الساعات." : "Preparing the timepiece records."}</p></div></section>
        ) : hasError ? (
          <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 pt-28"><div className="luxury-panel w-full max-w-xl p-10 text-center"><p className="overline text-primary">{isArabic ? "تعذّر الوصول إلى السجل" : "ARCHIVE UNAVAILABLE"}</p><p className="mt-3 text-muted-foreground">{isArabic ? "تعذّر تحميل سجلات الساعات في الوقت الحالي. يرجى العودة إلى المجموعة الكاملة." : "The timepiece records are temporarily unavailable. Please return to the full collection."}</p><Link href="/collection" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">{isArabic ? "المجموعة" : "Collection"}</Link></div></section>
        ) : !watches.length ? (
          <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 pt-28"><div className="luxury-panel w-full max-w-xl p-10 text-center"><p className="overline text-primary">{isArabic ? "السجل قيد التشكيل" : "ARCHIVE IN FORMATION"}</p><p className="mt-3 text-muted-foreground">{isArabic ? "لا توجد سجلات ساعات متاحة للعرض بعد." : "No timepiece records are available to display yet."}</p></div></section>
        ) : (
          <>
            <section className="constellation-hero isolate px-6 pb-20 pt-32 text-secondary-foreground md:pb-28 md:pt-40">
              <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
                <div className={`${isArabic ? "lg:order-2 lg:text-right" : "lg:order-2 lg:text-left"}`}>
                  <p className="overline mb-5 flex items-center gap-2 text-primary"><Sparkles className="h-4 w-4" /> {isArabic ? "أرشيف المشاهدات الموثقة" : "A PUBLICLY EVIDENCED ARCHIVE"}</p>
                  <h1 className="sheikh-name text-gold-gradient mb-6 max-w-3xl text-5xl leading-[.95] md:text-7xl">{isArabic ? "كوكبة الزمن" : "Constellation of Time"}</h1>
                  <p className="sheikh-bio max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">{isArabic ? "رحلة تحريرية بين الساعات التي ظهرت علنًا، تُقدَّم بدقة المصادر وهدوء المتحف الخاص. كل نقطة ضوء هنا بداية حكاية، لا ادعاء بامتلاك أو جرد كامل." : "An editorial journey through publicly sighted timepieces, presented with source discipline and the calm of a private museum. Each point of light begins a story; none is an assertion of ownership or a complete inventory."}</p>
                  <div className={`mt-9 flex flex-wrap gap-3 ${isArabic ? "lg:justify-end" : ""}`}>
                    <Link href="/collection" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">{isArabic ? "استكشف المجموعة" : "Explore the Collection"}<Arrow className="h-4 w-4" /></Link>
                    <Link href="/sheikh-gallery" className="inline-flex items-center gap-2 rounded-md border border-primary/40 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"><Compass className="h-4 w-4" />{isArabic ? "معرض سمو الشيخ" : "Sheikh Gallery"}</Link>
                  </div>
                </div>

                <div className="constellation-stage-wrap lg:order-1">
                  <div className="constellation-stage" aria-label={isArabic ? "معرض ثلاثي الأبعاد للساعات الموثقة" : "Three-dimensional gallery of documented timepieces"}>
                    <div className="constellation-ring constellation-ring-outer" />
                    <div className="constellation-ring constellation-ring-mid" />
                    <div className="constellation-ring constellation-ring-inner" />
                    <div className="constellation-core"><Orbit className="h-9 w-9 text-primary" aria-hidden="true" /><span>{isArabic ? "كوكبة الزمن" : "TIME CONSTELLATION"}</span></div>
                    {featured.map((watch, index) => {
                      const offset = (index - activeIndex + featured.length) % featured.length;
                      const normalized = offset > featured.length / 2 ? offset - featured.length : offset;
                      const isActive = index === activeIndex;
                      return (
                        <Link key={watch.id} href={`/watch/${watch.slug}`} aria-label={watchName(watch)} className={`constellation-orbit-card ${isActive ? "is-active" : ""}`} style={{ "--orbit-index": normalized, "--orbit-depth": Math.abs(normalized) } as React.CSSProperties} onFocus={() => setActiveIndex(index)} onMouseEnter={() => setActiveIndex(index)}>
                          <WatchMedia imageUrl={watch.mainImageUrl} alt={watchName(watch)} brandName={brandName(watch.brandId)} watchName={watchName(watch)} language={language} recordIndex={String(index + 1).padStart(2, "0")} className="watch-media-fill" />
                          <span className="constellation-card-index">{String(index + 1).padStart(2, "0")}</span>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="constellation-controls" aria-label={isArabic ? "أدوات التنقل في الكوكبة" : "Constellation navigation controls"}>
                    <button type="button" onClick={selectPrevious} aria-label={isArabic ? "العنصر السابق" : "Previous timepiece"} className="constellation-control"><ArrowLeft className="h-4 w-4" /></button>
                    <button type="button" onClick={() => setIsPaused((value) => !value)} aria-label={isPaused ? (isArabic ? "تشغيل الحركة" : "Play constellation") : (isArabic ? "إيقاف الحركة" : "Pause constellation")} className="constellation-control constellation-control-wide">{isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}<span>{isPaused ? (isArabic ? "تشغيل" : "Play") : (isArabic ? "إيقاف" : "Pause")}</span></button>
                    <button type="button" onClick={selectNext} aria-label={isArabic ? "العنصر التالي" : "Next timepiece"} className="constellation-control"><ArrowRight className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </section>

            {activeWatch && <section className="constellation-focus border-y border-primary/15 bg-card/25 px-6 py-12 md:py-16"><div className={`mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[.75fr_1.25fr] ${isArabic ? "lg:[direction:rtl]" : ""}`}><div className="constellation-focus-media luxury-panel overflow-hidden p-2"><WatchMedia imageUrl={activeWatch.mainImageUrl} alt={watchName(activeWatch)} brandName={brandName(activeWatch.brandId)} watchName={watchName(activeWatch)} language={language} recordIndex={String(activeIndex + 1).padStart(2, "0")} className="watch-media-fill" /></div><div className={`${isArabic ? "text-right" : "text-left"}`}><p className="overline mb-3 text-primary">{isArabic ? `المسار ${String(activeIndex + 1).padStart(2, "0")}` : `ORBIT ${String(activeIndex + 1).padStart(2, "0")}`}</p><p className="text-sm tracking-[.16em] text-primary">{brandName(activeWatch.brandId)}{activeWatch.yearReleased ? ` · ${activeWatch.yearReleased}` : ""}</p><h2 className="section-heading mt-3 text-4xl md:text-6xl">{watchName(activeWatch)}</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{isArabic ? "تبدأ كل نقطة ضوء من سجل موثق؛ قراءة هادئة للتصميم والحرفة كما ظهرت في المصادر، بلا ادعاء بامتلاك أو جرد كامل." : "Each point of light begins with a documented record: a quiet reading of design and craft as presented by the sources, without an assertion of ownership or a complete inventory."}</p><Link href={`/watch/${activeWatch.slug}`} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary">{isArabic ? "فتح سجل الساعة" : "Open the timepiece record"}<Arrow className="h-4 w-4" /></Link></div></div></section>}

            <section className="border-y border-primary/15 bg-card/30 px-6 py-16 md:py-20"><div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.92fr_1.08fr]"><div className={`lg:order-2 ${isArabic ? "lg:text-right" : "lg:text-left"}`}><p className="overline mb-4 text-primary">{isArabic ? "دراسة حركية" : "MOTION STUDY"}</p><h2 className="section-heading text-4xl md:text-5xl">{isArabic ? "الضوء الأول" : "First Light"}</h2><p className="sheikh-bio mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{isArabic ? "إشارة متحركة مرسومة خصيصاً للأرشيف: من نقطة ضوء إلى مدارات تتسع بهدوء، قبل أن تعود إلى جوهر الساعة." : "A motion study drawn specifically for the archive: from a single point of light to quietly expanding orbits, before returning to the essence of the timepiece."}</p></div><div className="luxury-panel relative overflow-hidden p-2 lg:order-1"><video autoPlay muted loop playsInline preload="metadata" aria-label={isArabic ? "دراسة الضوء الأول الحركية" : "First Light motion study"} className="aspect-video w-full rounded-sm object-cover"><source src={firstLightMotionUrl} type="video/mp4" /></video></div></div></section>

            <section className="mx-auto max-w-7xl px-6 py-20"><div className={`mb-10 flex flex-wrap items-end justify-between gap-5 ${isArabic ? "text-right" : ""}`}><div><p className="overline mb-3 text-primary">{isArabic ? "ستة مسارات" : "SIX ORBITS"}</p><h2 className="section-heading text-4xl">{isArabic ? "المسارات البارزة" : "Featured Orbits"}</h2></div><p className="max-w-md text-sm leading-6 text-muted-foreground">{isArabic ? "تنتقل كل بطاقة إلى سجل الساعة الكامل داخل الموقع." : "Each orbit opens the full timepiece record within the collection."}</p></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{featured.map((watch, index) => <Link key={watch.id} href={`/watch/${watch.slug}`} className="group luxury-panel relative overflow-hidden p-0 transition duration-500 hover:-translate-y-1"><div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition group-hover:opacity-100" /><div className="grid grid-cols-[.82fr_1.18fr] items-stretch"><div className="min-h-44 overflow-hidden bg-muted/40"><WatchMedia imageUrl={watch.mainImageUrl} alt={watchName(watch)} brandName={brandName(watch.brandId)} watchName={watchName(watch)} language={language} recordIndex={String(index + 1).padStart(2, "0")} className="watch-media-fill" /></div><div className={`flex flex-col justify-between p-5 ${isArabic ? "text-right" : ""}`}><p className="text-xs tracking-[.16em] text-primary">{String(index + 1).padStart(2, "0")} / {brandName(watch.brandId)}</p><h3 className="text-xl leading-tight" style={{ fontFamily: isArabic ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{watchName(watch)}</h3><span className={`mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary ${isArabic ? "justify-end" : ""}`}>{isArabic ? "فتح السجل" : "Open record"}<Arrow className="h-3.5 w-3.5" /></span></div></div></Link>)}</div></section>

            <section className="border-y border-primary/15 bg-card/30 px-6 py-16"><div className={`mx-auto max-w-4xl ${isArabic ? "text-right" : "text-left"}`}><p className="overline mb-4 text-primary">{isArabic ? "معيار التحرير" : "EDITORIAL STANDARD"}</p><blockquote className="sheikh-title text-3xl leading-relaxed md:text-5xl">{isArabic ? "«المعلومة الدقيقة جزء من فخامة الحكاية.»" : '“Accuracy is part of the luxury of the story.”'}</blockquote><p className="mt-6 max-w-3xl leading-7 text-muted-foreground">{isArabic ? "تعتمد هذه المساحة على سجل أدلة داخلي يفرّق بين الظهور العلني، والمواصفات المصنعية، وإثبات الملكية. لا تُستخدم صور خارجية أو تُضاف ساعات جديدة إلا بعد مراجعة المصدر." : "This space follows an internal evidence ledger that separates public sightings, manufacturer specifications, and proof of ownership. No external imagery or new timepiece is promoted without source review."}</p></div></section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
