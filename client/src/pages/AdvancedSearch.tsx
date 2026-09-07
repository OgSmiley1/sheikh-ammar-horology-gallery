import { ChevronLeft, ChevronRight, Filter, Search, X } from "lucide-react";
import { Link } from "wouter";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WatchGridSkeleton } from "@/components/SkeletonLoaders";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeRarityLabel } from "@/lib/timelinePresentation";
import { trpc } from "@/lib/trpc";
import { WatchMedia } from "@/components/WatchMedia";
import { matchesReleaseYear } from "@/lib/advancedSearchFilters";

interface SearchFilters {
  query: string;
  brandId: number | "";
  yearFrom: number;
  yearTo: number;
  rarity: string;
}

export default function AdvancedSearch() {
  const { language, isRTL } = useLanguage();
  const isArabic = language === "ar";
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    brandId: "",
    yearFrom: 1900,
    yearTo: new Date().getFullYear(),
    rarity: "",
  });
  const [showFilters, setShowFilters] = useState(true);

  const { data: allWatches = [], isLoading } = trpc.watches.getAll.useQuery();
  const { data: allBrands = [] } = trpc.brands.getAll.useQuery();

  const brandMap = useMemo(() => {
    const entries: Record<number, (typeof allBrands)[number]> = {};
    allBrands.forEach((brand) => {
      entries[brand.id] = brand;
    });
    return entries;
  }, [allBrands]);

  const rarities = useMemo(
    () => Array.from(new Set(allWatches.map((watch) => watch.rarity).filter(Boolean))) as string[],
    [allWatches],
  );

  const filteredWatches = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return allWatches.filter((watch) => {
      const brand = brandMap[watch.brandId];
      const displayName = isArabic ? (watch.nameAr || watch.nameEn) : watch.nameEn;
      const displayBrand = brand ? (isArabic ? (brand.nameAr || brand.nameEn) : brand.nameEn) : "";
      const matchesQuery = !query || [displayName, watch.nameEn, displayBrand, watch.referenceNumber]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query));
      const matchesBrand = !filters.brandId || watch.brandId === filters.brandId;
      const matchesYear = matchesReleaseYear(
        watch.yearReleased,
        filters.yearFrom,
        filters.yearTo,
        new Date().getFullYear(),
      );
      const matchesRarity = !filters.rarity || watch.rarity === filters.rarity;

      return matchesQuery && matchesBrand && matchesYear && matchesRarity;
    });
  }, [allWatches, brandMap, filters, isArabic]);

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      query: "",
      brandId: "",
      yearFrom: 1900,
      yearTo: new Date().getFullYear(),
      rarity: "",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <main className="mx-auto max-w-7xl px-4 pt-32 pb-12">
        <div className={isArabic ? "mb-8 text-right" : "mb-8 text-left"}>
          <p className="overline mb-3">{isArabic ? "أدوات المجموعة" : "Collection Tools"}</p>
          <h1 className="section-heading text-gold-gradient mb-2 text-4xl md:text-5xl">
            {isArabic ? "البحث المتقدم" : "Advanced Search"}
          </h1>
          <p className="text-muted-foreground">
            {isArabic
              ? "ابحث في كامل الأرشيف الملكي بالاسم، الدار، المرجع، السنة، أو الندرة."
              : "Search the complete Royal archive by name, maison, reference, year, or rarity."}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <aside className={`lg:col-span-1 ${!showFilters ? "hidden lg:block" : ""}`}>
            <div className="luxury-panel sticky top-28 p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Filter className="h-5 w-5 text-primary" aria-hidden="true" />
                  {isArabic ? "المرشحات" : "Filters"}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="text-muted-foreground hover:text-foreground lg:hidden"
                  aria-label={isArabic ? "إغلاق المرشحات" : "Close filters"}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                <label className="block text-sm font-medium">
                  <span className="mb-2 block">{isArabic ? "البحث" : "Search"}</span>
                  <span className="relative block">
                    <Search className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ${isArabic ? "right-3" : "left-3"}`} aria-hidden="true" />
                    <input
                      type="search"
                      placeholder={isArabic ? "اسم أو مرجع..." : "Name or reference..."}
                      value={filters.query}
                      onChange={(event) => updateFilter("query", event.target.value)}
                      className={`w-full rounded-lg border border-border/40 bg-background py-2 text-sm focus:border-primary focus:outline-none ${isArabic ? "pr-10 pl-4" : "pl-10 pr-4"}`}
                    />
                  </span>
                </label>

                <label className="block text-sm font-medium">
                  <span className="mb-2 block">{isArabic ? "الدار" : "Maison"}</span>
                  <select
                    value={filters.brandId}
                    onChange={(event) => updateFilter("brandId", event.target.value ? Number(event.target.value) : "")}
                    className="w-full rounded-lg border border-border/40 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="">{isArabic ? "جميع الدور" : "All Maisons"}</option>
                    {allBrands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {isArabic ? (brand.nameAr || brand.nameEn) : brand.nameEn}
                      </option>
                    ))}
                  </select>
                </label>

                <fieldset>
                  <legend className="mb-2 text-sm font-medium">{isArabic ? "سنة الإصدار" : "Release Year"}</legend>
                  <div className="space-y-2">
                    <input
                      type="number"
                      min="1900"
                      placeholder={isArabic ? "من" : "From"}
                      value={filters.yearFrom}
                      onChange={(event) => updateFilter("yearFrom", Number(event.target.value) || 1900)}
                      className="w-full rounded-lg border border-border/40 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                    <input
                      type="number"
                      min="1900"
                      placeholder={isArabic ? "إلى" : "To"}
                      value={filters.yearTo}
                      onChange={(event) => updateFilter("yearTo", Number(event.target.value) || new Date().getFullYear())}
                      className="w-full rounded-lg border border-border/40 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </fieldset>

                <label className="block text-sm font-medium">
                  <span className="mb-2 block">{isArabic ? "الندرة" : "Rarity"}</span>
                  <select
                    value={filters.rarity}
                    onChange={(event) => updateFilter("rarity", event.target.value)}
                    className="w-full rounded-lg border border-border/40 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="">{isArabic ? "جميع المستويات" : "All Levels"}</option>
                    {rarities.map((rarity) => (
                      <option key={rarity} value={rarity}>{localizeRarityLabel(rarity, language)}</option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full rounded-lg bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/80"
                >
                  {isArabic ? "إعادة تعيين المرشحات" : "Reset Filters"}
                </button>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">{isArabic ? "النتائج" : "Results"}</h2>
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  {isLoading
                    ? (isArabic ? "جاري تحميل الساعات…" : "Loading timepieces…")
                    : (isArabic ? `عرض ${filteredWatches.length} من ${allWatches.length} ساعة` : `Showing ${filteredWatches.length} of ${allWatches.length} timepieces`)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFilters((current) => !current)}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 lg:hidden"
              >
                <Filter className="h-4 w-4" aria-hidden="true" />
                {isArabic ? "المرشحات" : "Filters"}
              </button>
            </div>

            {isLoading ? (
              <WatchGridSkeleton count={6} />
            ) : filteredWatches.length ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredWatches.map((watch) => {
                  const brand = brandMap[watch.brandId];
                  const name = isArabic ? (watch.nameAr || watch.nameEn) : watch.nameEn;
                  const brandName = brand ? (isArabic ? (brand.nameAr || brand.nameEn) : brand.nameEn) : "";
                  return (
                    <Link
                      key={watch.id}
                      href={`/watch/${watch.slug}`}
                      className="group overflow-hidden rounded-xl border border-border/40 bg-card transition-all hover:border-primary/50 hover:shadow-lg"
                    >
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <WatchMedia
                          imageUrl={watch.mainImageUrl}
                          alt={name}
                          brandName={brandName}
                          watchName={name}
                          reference={watch.referenceNumber}
                          language={language}
                          className="watch-media-fill"
                        />
                        {watch.rarity ? (
                          <div className={`absolute top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-primary-foreground ${isArabic ? "left-3" : "right-3"}`}>
                            {localizeRarityLabel(watch.rarity, language)}
                          </div>
                        ) : null}
                      </div>
                      <div className="p-4">
                        <p className="mb-1 text-xs text-muted-foreground">{brandName}</p>
                        <h3 className="mb-2 text-sm font-bold transition-colors group-hover:text-primary">{name}</h3>
                        <div className="mb-4 space-y-1 text-xs text-muted-foreground">
                          {watch.referenceNumber ? <p>{isArabic ? "المرجع: " : "Ref: "}{watch.referenceNumber}</p> : null}
                          {watch.yearReleased ? <p>{isArabic ? "السنة: " : "Year: "}{watch.yearReleased}</p> : null}
                        </div>
                        <div className="flex items-center justify-end">
                          {isRTL ? <ChevronLeft className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" /> : <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="luxury-panel py-12 text-center">
                <p className="mb-4 text-muted-foreground">{isArabic ? "لم يتم العثور على ساعات تطابق معايير البحث" : "No timepieces match your search criteria"}</p>
                <button type="button" onClick={resetFilters} className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  {isArabic ? "إعادة تعيين البحث" : "Reset Search"}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
