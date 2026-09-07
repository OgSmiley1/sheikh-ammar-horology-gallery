import { useMemo, useState } from "react";
import { Award, Calendar, Loader2, RefreshCw, Zap } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { isSinglePublishedYear, localizeTimelineRarity } from "@/lib/timelinePresentation";
import { WatchMedia } from "@/components/WatchMedia";

const copy = {
  en: {
    title: "Record chronology",
    subtitle: "Read documented timepiece records through their published release years. This chronology describes the archive, not private acquisition or ownership.",
    publishedSpan: "Published years represented",
    documentedYears: "Years with documented records",
    documentedRecords: "Documented records",
    years: "Years",
    viewYear: (year: number) => `View records from ${year}`,
    timepieces: "timepieces",
    selectedYear: "Records published in",
    yearSummary: (count: number) => `${count} documented ${count === 1 ? "record" : "records"} published in this year`,
    chooseYear: "Choose a year to read the documented records",
    distribution: "Records by published year",
    unavailable: "The record chronology is temporarily unavailable. Please try again shortly.",
    retry: "Try again",
    empty: "No records with published release years are available yet.",
  },
  ar: {
    title: "تسلسل السجلات الزمني",
    subtitle: "اقرأ السجلات الموثقة عبر سنوات إصدارها المنشورة. يصف هذا التسلسل الأرشيف ولا يثبت اقتناءً خاصاً أو ملكية.",
    publishedSpan: "سنوات الإصدار الممثلة",
    documentedYears: "سنوات بسجلات موثقة",
    documentedRecords: "سجلات موثقة",
    years: "السنوات",
    viewYear: (year: number) => `عرض سجلات سنة ${year}`,
    timepieces: "ساعات",
    selectedYear: "سجلات منشورة في",
    yearSummary: (count: number) => `${count} ${count === 1 ? "سجل موثق" : "سجلات موثقة"} منشورة في هذه السنة`,
    chooseYear: "اختر سنة لقراءة السجلات الموثقة",
    distribution: "السجلات حسب سنة الإصدار المنشورة",
    unavailable: "تسلسل السجلات غير متاح مؤقتاً. يرجى المحاولة بعد قليل.",
    retry: "حاول مرة أخرى",
    empty: "لا تتوفر سجلات ذات سنوات إصدار منشورة بعد.",
  },
};

export default function Timeline() {
  const { language, isRTL } = useLanguage();
  const t = copy[language];
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const { data: watches = [], isLoading: watchesLoading, isError: watchesError, refetch: refetchWatches } = trpc.watches.getAll.useQuery();
  const { data: brands = [], isLoading: brandsLoading, isError: brandsError, refetch: refetchBrands } = trpc.brands.getAll.useQuery();
  const isLoading = watchesLoading || brandsLoading;
  const isError = watchesError || brandsError;

  const brandMap = useMemo(() => new Map(brands.map((brand) => [brand.id, brand])), [brands]);
  const timelineEvents = useMemo(() => {
    const grouped = new Map<number, typeof watches>();
    watches.forEach((watch) => {
      if (!isSinglePublishedYear(watch.yearReleased)) return;
      const records = grouped.get(watch.yearReleased) ?? [];
      records.push(watch);
      grouped.set(watch.yearReleased, records);
    });

    return Array.from(grouped.entries())
      .map(([year, records]) => ({
        year,
        watches: [...records].sort((first, second) => (brandMap.get(first.brandId)?.nameEn ?? "").localeCompare(brandMap.get(second.brandId)?.nameEn ?? "")),
      }))
      .sort((first, second) => first.year - second.year);
  }, [watches, brandMap]);

  const selectedYearData = selectedYear ? timelineEvents.find((event) => event.year === selectedYear) : null;
  const minYear = timelineEvents.at(0)?.year;
  const maxYear = timelineEvents.at(-1)?.year;
  const publishedSpan = minYear && maxYear ? maxYear - minYear + 1 : 0;
  const totalDocumented = timelineEvents.reduce((sum, event) => sum + event.watches.length, 0);
  const maxRecords = Math.max(1, ...timelineEvents.map((event) => event.watches.length));
  const retry = () => { void refetchWatches(); void refetchBrands(); };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-32 sm:px-6 lg:px-8">
        <header className={isRTL ? "text-right" : "text-left"}>
          <p className="ornament-line">{isRTL ? "أرشيف منشور" : "PUBLISHED ARCHIVE"}</p>
          <h1 className="section-heading mt-5 text-foreground">{t.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{t.subtitle}</p>
        </header>

        {isError ? (
          <section className="mt-12 rounded-xl border border-primary/25 bg-card p-8 text-center shadow-sm">
            <p className="text-muted-foreground">{t.unavailable}</p>
            <button type="button" onClick={retry} className="mt-5 inline-flex items-center gap-2 rounded-md border border-primary/45 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
              <RefreshCw className="h-4 w-4" aria-hidden="true" />{t.retry}
            </button>
          </section>
        ) : isLoading ? (
          <section className="flex min-h-80 items-center justify-center" aria-live="polite"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span className="sr-only">{language === "ar" ? "جارٍ تحميل تسلسل السجلات" : "Loading record chronology"}</span></section>
        ) : timelineEvents.length === 0 ? (
          <section className="mt-12 rounded-xl border border-primary/20 bg-card p-10 text-center text-muted-foreground">{t.empty}</section>
        ) : (
          <>
            <section className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                { icon: Calendar, value: publishedSpan, label: t.publishedSpan },
                { icon: Award, value: timelineEvents.length, label: t.documentedYears },
                { icon: Zap, value: totalDocumented, label: t.documentedRecords },
              ].map(({ icon: Icon, value, label }) => <article key={label} className="rounded-xl border border-border/40 bg-card p-6 text-center shadow-sm"><Icon className="mx-auto mb-3 h-8 w-8 text-primary" aria-hidden="true" /><p className="text-3xl font-bold text-primary">{value}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></article>)}
            </section>

            <section className="mt-12 grid gap-8 lg:grid-cols-3">
              <aside className="lg:col-span-1"><div className="sticky top-24 rounded-xl border border-border/40 bg-card p-6"><h2 className="text-lg font-bold text-foreground">{t.years}</h2><div className="mt-4 max-h-96 space-y-2 overflow-y-auto">{timelineEvents.map((event) => <button key={event.year} type="button" onClick={() => setSelectedYear(event.year)} aria-pressed={selectedYear === event.year} aria-label={t.viewYear(event.year)} className={`w-full rounded-lg px-4 py-3 transition-all ${isRTL ? "text-right" : "text-left"} ${selectedYear === event.year ? "bg-primary font-bold text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}><div className="font-bold">{event.year}</div><div className="text-xs opacity-75">{event.watches.length} {t.timepieces}</div></button>)}</div></div></aside>
              <div className="lg:col-span-2">{selectedYearData ? <div className="space-y-6"><div className="rounded-xl border border-primary/20 bg-primary/5 p-8"><h2 className="text-4xl font-bold text-primary">{t.selectedYear} {selectedYearData.year}</h2><p className="mt-3 text-sm text-muted-foreground">{t.yearSummary(selectedYearData.watches.length)}</p></div><div className="grid gap-4 sm:grid-cols-2">{selectedYearData.watches.map((watch) => { const brand = brandMap.get(watch.brandId); const name = language === "ar" ? watch.nameAr || watch.nameEn : watch.nameEn; return <Link key={watch.id} href={`/watch/${watch.slug}`} className="group overflow-hidden rounded-lg border border-border/40 bg-card transition-all hover:border-primary/50 hover:shadow-lg"><div className="relative aspect-square overflow-hidden bg-muted/35"><WatchMedia imageUrl={watch.mainImageUrl} alt={name} brandName={language === "ar" ? brand?.nameAr || brand?.nameEn : brand?.nameEn} watchName={name} reference={watch.referenceNumber} language={language} className="watch-media-fill" />{watch.rarity && <span className={`absolute top-3 rounded-full bg-background/90 px-2 py-1 text-[0.62rem] font-bold text-primary shadow-sm ${isRTL ? "right-3" : "left-3"}`}>{localizeTimelineRarity(watch.rarity, language)}</span>}</div><div className="p-4"><p className="text-xs text-muted-foreground">{language === "ar" ? brand?.nameAr || brand?.nameEn : brand?.nameEn}</p><h3 className="mt-2 text-lg text-foreground transition-colors group-hover:text-primary" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{name}</h3></div></Link>; })}</div></div> : <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-border/40 bg-card p-12 text-center"><Calendar className="mb-4 h-12 w-12 text-muted-foreground/50" aria-hidden="true" /><p className="text-muted-foreground">{t.chooseYear}</p></div>}</div>
            </section>

            <section className="mt-12 rounded-xl border border-border/40 bg-card p-6 sm:p-8"><h2 className="text-xl font-bold text-foreground">{t.distribution}</h2><div className="mt-8 flex h-48 items-end gap-2" aria-label={t.distribution}>{timelineEvents.map((event) => { const height = (event.watches.length / maxRecords) * 100; return <button key={event.year} type="button" onClick={() => setSelectedYear(event.year)} aria-label={t.viewYear(event.year)} className="group flex flex-1 flex-col items-center self-stretch"><span className="sr-only">{event.year}: {event.watches.length} {t.timepieces}</span><span className="relative mt-auto w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/60 transition-colors group-hover:from-primary/80 group-hover:to-primary/40" style={{ height: `${height}%` }} /><span className="mt-2 text-xs text-muted-foreground">{event.year}</span></button>; })}</div></section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
