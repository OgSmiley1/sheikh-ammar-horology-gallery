import { ChevronLeft, ChevronRight, Crown, Filter, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeRarityLabel } from "@/lib/timelinePresentation";
import { trpc } from "@/lib/trpc";
import { WatchMedia } from "@/components/WatchMedia";

export default function Compare() {
  const { language, isRTL } = useLanguage();
  const isArabic = language === "ar";
  const [selectedWatches, setSelectedWatches] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: allWatches = [] } = trpc.watches.getAll.useQuery();
  const { data: allBrands = [] } = trpc.brands.getAll.useQuery();

  const brandMap = useMemo(() => {
    const map: Record<number, { en: string; ar: string }> = {};
    allBrands.forEach((brand) => {
      map[brand.id] = { en: brand.nameEn, ar: brand.nameAr || brand.nameEn };
    });
    return map;
  }, [allBrands]);

  const filteredWatches = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return allWatches.filter((watch) => {
      const brand = brandMap[watch.brandId];
      return !query || [watch.nameEn, watch.nameAr, watch.referenceNumber, brand?.en, brand?.ar]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query));
    });
  }, [allWatches, brandMap, searchTerm]);

  const comparedWatches = allWatches.filter((watch) => selectedWatches.includes(watch.id));
  const text = {
    title: isArabic ? "مقارنة الساعات الفاخرة" : "Horological Comparison",
    subtitle: isArabic ? "قارن بين أرقى الساعات من المجموعة الملكية" : "Juxtapose the finest timepieces from the Royal Collection",
    select: isArabic ? "اختر حتى 3 ساعات للمقارنة" : "Select up to 3 timepieces for comparison",
    search: isArabic ? "ابحث حسب الدار أو الموديل أو المرجع..." : "Search by maison, model, or reference...",
    empty: isArabic ? "اختر الساعات لبدء المقارنة" : "Select timepieces to begin your comparison",
    specs: isArabic ? "المواصفات التقنية" : "Technical Specifications",
    clear: isArabic ? "مسح الكل" : "Clear All",
    details: isArabic ? "عرض التفاصيل" : "View Details",
  };

  const getName = (watch: (typeof allWatches)[number]) => isArabic ? (watch.nameAr || watch.nameEn) : watch.nameEn;
  const getBrand = (watch: (typeof allWatches)[number]) => brandMap[watch.brandId]?.[isArabic ? "ar" : "en"] || "";
  const toggleWatch = (watchId: number) => {
    setSelectedWatches((current) => current.includes(watchId)
      ? current.filter((id) => id !== watchId)
      : current.length < 3 ? [...current, watchId] : current);
  };

  const specifications = [
    { key: "movement", label: isArabic ? "الحركة" : "Movement", value: (watch: (typeof allWatches)[number]) => watch.movement || "—" },
    { key: "case", label: isArabic ? "مادة العلبة" : "Case Material", value: (watch: (typeof allWatches)[number]) => watch.material || "—" },
    { key: "diameter", label: isArabic ? "قطر العلبة" : "Case Diameter", value: (watch: (typeof allWatches)[number]) => watch.caseSize || "—" },
    { key: "year", label: isArabic ? "سنة الإصدار" : "Release Year", value: (watch: (typeof allWatches)[number]) => watch.yearReleased || "—" },
    { key: "reference", label: isArabic ? "الرقم المرجعي" : "Reference", value: (watch: (typeof allWatches)[number]) => watch.referenceNumber || "—" },
    { key: "rarity", label: isArabic ? "حالة الندرة" : "Rarity Status", value: (watch: (typeof allWatches)[number]) => localizeRarityLabel(watch.rarity || undefined, language) || "—" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <main className="container mx-auto px-4 pt-32 pb-12">
        <section className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
            <p className="overline">{isArabic ? "أدوات المجموعة" : "Collection Tools"}</p>
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="section-heading text-gold-gradient mb-3 text-4xl md:text-6xl">{text.title}</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">{text.subtitle}</p>
        </section>

        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="luxury-panel sticky top-28 p-5">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-primary">
                <Crown className="h-5 w-5" aria-hidden="true" />
                {text.select}
              </h2>
              <input
                type="search"
                placeholder={text.search}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="mb-4 w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                {filteredWatches.map((watch) => {
                  const selected = selectedWatches.includes(watch.id);
                  return (
                    <button
                      key={watch.id}
                      type="button"
                      onClick={() => toggleWatch(watch.id)}
                      aria-pressed={selected}
                      className={`w-full rounded-lg border p-3 transition-colors ${isRTL ? "text-right" : "text-left"} ${selected ? "border-primary bg-primary/10" : "border-border/50 bg-card hover:border-primary/60"}`}
                    >
                      <span className="block text-sm font-semibold">{getBrand(watch)}</span>
                      <span className="block text-xs text-muted-foreground">{getName(watch)}</span>
                    </button>
                  );
                })}
              </div>
              {selectedWatches.length ? (
                <Button type="button" variant="outline" onClick={() => setSelectedWatches([])} className="mt-4 w-full">
                  {text.clear}
                </Button>
              ) : null}
            </div>
          </aside>

          <section className="min-w-0 lg:col-span-3">
            {!selectedWatches.length ? (
              <div className="luxury-panel py-16 text-center">
                <Crown className="mx-auto mb-4 h-10 w-10 text-primary/60" aria-hidden="true" />
                <p className="text-muted-foreground">{text.empty}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {comparedWatches.map((watch) => (
                    <article key={watch.id} className="overflow-hidden rounded-xl border border-border/50 bg-card">
                      <div className="relative h-48 bg-muted">
                        <WatchMedia
                          imageUrl={watch.mainImageUrl}
                          alt={getName(watch)}
                          brandName={getBrand(watch)}
                          watchName={getName(watch)}
                          reference={watch.referenceNumber}
                          language={language}
                          className="watch-media-fill"
                        />
                        <button
                          type="button"
                          onClick={() => setSelectedWatches((current) => current.filter((id) => id !== watch.id))}
                          aria-label={isArabic ? `إزالة ${getName(watch)} من المقارنة` : `Remove ${getName(watch)} from comparison`}
                          className={`absolute top-2 rounded-full bg-background/90 p-1.5 text-foreground shadow ${isRTL ? "left-2" : "right-2"}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-semibold text-primary">{getBrand(watch)}</p>
                        <p className="mb-3 text-sm text-muted-foreground">{getName(watch)}</p>
                        <Link href={`/watch/${watch.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80">
                          {text.details}
                          {isRTL ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
                  <div className="border-b border-border/50 p-5"><h2 className="text-xl font-bold text-primary">{text.specs}</h2></div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <tbody>
                        {specifications.map((specification) => (
                          <tr key={specification.key} className="border-t border-border/40 first:border-0">
                            <th scope="row" className={`${isRTL ? "text-right" : "text-left"} min-w-36 bg-muted/50 px-4 py-3 font-semibold text-primary`}>{specification.label}</th>
                            {comparedWatches.map((watch) => <td key={`${watch.id}-${specification.key}`} className="min-w-48 border-s border-border/40 px-4 py-3 text-muted-foreground">{specification.value(watch)}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
