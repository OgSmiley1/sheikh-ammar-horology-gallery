import { useState, useMemo, useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Compass, Gem, Heart, Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { WatchGridSkeleton } from "@/components/SkeletonLoaders";
import { rankRarity } from "@/lib/collectionSort";
import { localizeRarityLabel } from "@/lib/timelinePresentation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { loadWishlist, toggleWishlist } from "@/lib/wishlist";
import { WatchMedia } from "@/components/WatchMedia";

const ARCHIVE_LENS_RELEASE = "source-safe-archive-lens-v1";

const content = {
  en: {
    overline: "The Archive Atlas",
    title: "Timepieces in view",
    subtitle: "A considered reading of published archive records, from landmark complications to distinctive limited editions.",
    search: "Search by name, reference, or brand...",
    allBrands: "All Maisons",
    allRarity: "All Classifications",
    sortBy: "Sort",
    sortBrand: "By Maison",
    sortYear: "Newest First",
    sortRarity: "By Classification",
    maisons: "Maisons",
    records: "archive records",
    showing: "Showing",
    of: "of",
    timepieces: "timepieces",
    noResults: "No archive records match your criteria",
    clearFilters: "Clear Filters",
    dataUnavailable: "The live collection archive is temporarily unavailable. Please try again shortly.",
    tryAgain: "Try again",
    discover: "View Details",
    filters: "Filters",
    favorites: "Saved records",
    save: "Save to wishlist",
    saved: "Remove from wishlist",
    footerQuote: "Simplicity is the ultimate sophistication.",
    footerAttrib: "Leonardo da Vinci",
    footerRights: "All Rights Reserved",
    footerCurated: "Curated by His Highness Sheikh Ammar bin Humaid Al Nuaimi",
    waysOfReading: "Ways of reading time",
    waysBody: "Begin with a lens rather than a list. These pathways reorganise the live archive without changing what it can establish.",
    pathwayRarity: "By classification",
    pathwayRarityBody: "Bring the archive’s published classifications into focus without changing their evidence boundary.",
    pathwayMaison: "By maison",
    pathwayMaisonBody: "Trace the vocabulary of the houses represented in this archive.",
    pathwayYear: "By chronology",
    pathwayYearBody: "Arrange documented records around their published release years.",
    openPath: "Open pathway",
    filmOverline: "External Watch Film",
    filmTitle: "A supplementary viewing pathway",
    filmBody: "This public YouTube feature is offered as an external editorial reference. It is not the archive’s source of record and makes no claim about ownership, availability, or completeness.",
    filmCredit: "Published on YouTube by IFL Watches.",
    filmLink: "Watch on YouTube",
    sourceOverline: "Source Boundary",
    sourceTitle: "Records, not rumours.",
    sourceBody: "Published archive records are research-led. Maison information, auction documentation, and reported public appearances are kept distinct so each record can be read with appropriate care.",
    sourceDetail: "A model context is not an ownership statement.",
    lensOverline: "Archive Lens",
    lensTitle: "Choose a way to read the archive.",
    lensBody: "A single lens rearranges the same live records by their published metadata. It changes the view, never the evidentiary boundary.",
    record: "Record",
    visualPending: "Record visual pending source clearance",
    visualPendingBody: "The published record remains available while an original or licensed image is prepared.",
  },
  ar: {
    overline: "أطلس الأرشيف",
    title: "ساعات في المشهد",
    subtitle: "قراءة مدروسة لسجلات الأرشيف المنشورة، من التعقيدات البارزة إلى الإصدارات المحدودة المميزة.",
    search: "ابحث بالاسم أو الرقم المرجعي أو العلامة التجارية...",
    allBrands: "جميع الدور",
    allRarity: "جميع التصنيفات",
    sortBy: "ترتيب",
    sortBrand: "حسب الدار",
    sortYear: "الأحدث أولاً",
    sortRarity: "حسب التصنيف",
    maisons: "الدور",
    records: "سجلاً أرشيفياً",
    showing: "عرض",
    of: "من",
    timepieces: "ساعة",
    noResults: "لا توجد سجلات أرشيفية تطابق معاييرك",
    clearFilters: "مسح الفلاتر",
    dataUnavailable: "أرشيف المجموعة المباشر غير متاح مؤقتاً. يرجى المحاولة بعد قليل.",
    tryAgain: "حاول مرة أخرى",
    discover: "عرض التفاصيل",
    filters: "الفلاتر",
    favorites: "السجلات المحفوظة",
    save: "حفظ في المفضلة",
    saved: "إزالة من المفضلة",
    footerQuote: "البساطة هي قمة التطور.",
    footerAttrib: "ليوناردو دا فينشي",
    footerRights: "جميع الحقوق محفوظة",
    footerCurated: "بإشراف صاحب السمو الشيخ عمار بن حميد النعيمي",
    waysOfReading: "مسارات لقراءة الزمن",
    waysBody: "ابدأ بمنظور لا بقائمة. تعيد هذه المسارات ترتيب الأرشيف المباشر من دون تغيير ما يمكنه إثباته.",
    pathwayRarity: "من زاوية التصنيف",
    pathwayRarityBody: "قرّب التصنيفات المنشورة في الأرشيف من دون تغيير حدود الدليل المرتبطة بها.",
    pathwayMaison: "من زاوية الدار",
    pathwayMaisonBody: "تتبّع مفردات الدور الممثلة في هذا الأرشيف.",
    pathwayYear: "من زاوية التسلسل",
    pathwayYearBody: "رتّب السجلات الموثقة حول سنوات إصدارها المنشورة.",
    openPath: "فتح المسار",
    filmOverline: "مرجع فيديو خارجي",
    filmTitle: "مسار مشاهدة إضافي",
    filmBody: "يُقدَّم هذا الفيديو العام على يوتيوب كمرجع تحريري خارجي. ليس مصدراً رسمياً لسجلات الأرشيف، ولا يتضمن أي ادعاء بالملكية أو التوافر أو الاكتمال.",
    filmCredit: "نُشر على يوتيوب بواسطة IFL Watches.",
    filmLink: "المشاهدة على يوتيوب",
    sourceOverline: "حدود المصدر",
    sourceTitle: "سجلات لا روايات مرسلة.",
    sourceBody: "السجلات المنشورة يقودها البحث. تُفصل معلومات الدور وتوثيق المزادات والظهورات العامة المنسوبة حتى يُقرأ كل سجل بالعناية المناسبة.",
    sourceDetail: "سياق الطراز ليس بياناً بالملكية.",
    lensOverline: "عدسة الأرشيف",
    lensTitle: "اختر زاوية لقراءة الأرشيف.",
    lensBody: "تعيد عدسة واحدة ترتيب السجلات المباشرة نفسها وفق بياناتها المنشورة. تتغير زاوية العرض، ولا تتغير حدود الدليل.",
    record: "سجل",
    visualPending: "الصورة بانتظار توثيق المصدر",
    visualPendingBody: "يبقى السجل المنشور متاحًا ريثما تُجهّز صورة أصلية أو مرخصة.",
  },
};

function FadeCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

export default function Collection() {
  const { language, isRTL } = useLanguage();
  const t = content[language];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<number | "all">("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("brand");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<number[]>(() => loadWishlist());
  const [savedOnly, setSavedOnly] = useState(false);
  const filterSurfaceRef = useRef<HTMLDivElement>(null);

  // Fetch ALL watches from database
  const { data: allWatches = [], isLoading, isError: watchesError, refetch: refetchWatches } = trpc.watches.getAll.useQuery();
  const { data: allBrands = [], isError: brandsError, refetch: refetchBrands } = trpc.brands.getAll.useQuery();
  const dataUnavailable = watchesError || brandsError;

  // Get unique rarities
  const rarities = useMemo(() => {
    const r = new Set(allWatches.map((w) => w.rarity).filter(Boolean));
    return Array.from(r) as string[];
  }, [allWatches]);

  // Brand lookup
  const brandMap = useMemo(() => {
    const map: Record<number, typeof allBrands[0]> = {};
    allBrands.forEach((b) => (map[b.id] = b));
    return map;
  }, [allBrands]);

  // Filter
  const filteredWatches = useMemo(() => {
    return allWatches.filter((watch) => {
      const brand = brandMap[watch.brandId];
      const brandName = brand ? brand.nameEn : "";
      const watchName = language === "ar" ? (watch.nameAr || watch.nameEn) : watch.nameEn;

      const matchesSearch =
        !searchQuery ||
        watchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (watch.referenceNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        brandName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBrand = selectedBrand === "all" || watch.brandId === selectedBrand;
      const matchesRarity = selectedRarity === "all" || watch.rarity === selectedRarity;
      const matchesWishlist = !savedOnly || wishlistIds.includes(watch.id);

      return matchesSearch && matchesBrand && matchesRarity && matchesWishlist;
    });
  }, [allWatches, searchQuery, selectedBrand, selectedRarity, brandMap, language, savedOnly, wishlistIds]);

  // Sort
  const sortedWatches = useMemo(() => {
    return [...filteredWatches].sort((a, b) => {
      switch (sortBy) {
        case "brand": {
          const brandA = brandMap[a.brandId]?.nameEn || "";
          const brandB = brandMap[b.brandId]?.nameEn || "";
          return brandA.localeCompare(brandB);
        }
        case "year":
          return (b.yearReleased || 0) - (a.yearReleased || 0);
        case "rarity":
          return rankRarity(b.rarity) - rankRarity(a.rarity);
        default:
          return 0;
      }
    });
  }, [filteredWatches, sortBy, brandMap]);

  const hasFilters = searchQuery || selectedBrand !== "all" || selectedRarity !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBrand("all");
    setSelectedRarity("all");
    setSavedOnly(false);
  };

  const handleWishlistToggle = (watchId: number) => setWishlistIds(toggleWishlist(watchId));

  const applyCollectionPathway = (pathway: "rarity" | "maison" | "year") => {
    setSearchQuery("");
    setSelectedBrand("all");
    setSelectedRarity("all");
    setSavedOnly(false);
    setSortBy(pathway === "rarity" ? "rarity" : pathway === "year" ? "year" : "brand");
    requestAnimationFrame(() => filterSurfaceRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"} data-archive-release={ARCHIVE_LENS_RELEASE}>
      <Header />

      {/* Hero */}
      <section className="collection-page-hero page-hero pb-16 pt-32 lg:pb-24 lg:pt-40">
        <div className="container relative mx-auto px-6 text-center lg:px-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5 flex items-center justify-center">
            <span className="ornament-line">{t.overline}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="collection-page-hero__title section-heading mb-5 text-foreground"
          >
            {t.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sheikh-bio mx-auto max-w-2xl text-muted-foreground"
          >
            {t.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="collection-archive-metrics border-b border-primary/15 py-8 lg:py-10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className={`flex justify-center gap-0 text-center ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="min-w-36 border-e border-primary/20 px-8 last:border-e-0 sm:min-w-44 sm:px-12">
              <div className="stat-display text-gold-gradient">
                {allWatches.length}
              </div>
              <div className="mt-2 text-[0.64rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">{t.records}</div>
            </div>
            <div className="min-w-36 px-8 sm:min-w-44 sm:px-12">
              <div className="stat-display text-gold-gradient">
                {allBrands.length}
              </div>
              <div className="mt-2 text-[0.64rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">{t.maisons}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="archive-source-note border-b border-primary/15 px-4 py-10 md:py-12">
        <div className="container mx-auto max-w-6xl px-2 lg:px-8">
          <div className={`archive-source-note__frame grid gap-7 p-6 sm:p-8 lg:grid-cols-[auto_minmax(0,1fr)_minmax(15rem,0.58fr)] lg:items-center ${isRTL ? "text-right" : "text-left"}`}>
            <div className="archive-source-note__mark" aria-hidden="true">
              <span>R</span>
              <i />
              <small>{t.record}</small>
            </div>
            <div>
              <p className="ornament-line">{t.sourceOverline}</p>
              <h2 className="section-heading mt-4 text-foreground">{t.sourceTitle}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{t.sourceBody}</p>
            </div>
            <p className={`archive-source-note__detail ${isRTL ? "lg:text-right" : "lg:text-left"}`}>{t.sourceDetail}</p>
          </div>
        </div>
      </section>

      <section id="collection-film" className="scroll-mt-24 border-b border-primary/15 bg-card/35 px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-2 lg:px-8">
          <div className={`grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-center ${isRTL ? "lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]" : ""}`}>
            <div className={`overflow-hidden rounded-xl border border-primary/25 bg-background shadow-[0_20px_55px_rgba(26,24,20,0.12)] ${isRTL ? "lg:order-2" : ""}`}>
              <div className="relative aspect-video bg-[color:var(--nocturne-olive)]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube-nocookie.com/embed/Air31Kly7Ys"
                  title="Sheikh Ammar Al Nuaimi's MAJESTIC Watch Collection Exposed! — YouTube"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
            <div className={`${isRTL ? "text-right lg:order-1" : "text-left"}`}>
              <p className="ornament-line">{t.filmOverline}</p>
              <h2 className="section-heading mt-5 text-foreground">{t.filmTitle}</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">{t.filmBody}</p>
              <p className="mt-6 text-sm text-muted-foreground">{t.filmCredit}</p>
              <a
                href="https://youtu.be/Air31Kly7Ys"
                target="_blank"
                rel="noreferrer"
                className={`mt-6 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-primary transition-colors hover:text-primary/75 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                {t.filmLink}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="collection-compass archive-lens border-b border-primary/15 px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-2 lg:px-8">
          <div className={`grid gap-10 lg:grid-cols-[minmax(14rem,0.55fr)_1.45fr] lg:items-end ${isRTL ? "text-right" : "text-left"}`}>
            <div>
              <p className="ornament-line">{t.lensOverline}</p>
              <h2 className="section-heading mt-5 text-foreground">{t.lensTitle}</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">{t.lensBody}</p>
            </div>
            <div className="archive-lens__paths grid gap-px border border-primary/25 bg-primary/25 sm:grid-cols-2 2xl:grid-cols-3">
              {[
                { id: "rarity" as const, title: t.pathwayRarity, body: t.pathwayRarityBody, icon: Gem },
                { id: "maison" as const, title: t.pathwayMaison, body: t.pathwayMaisonBody, icon: Compass },
                { id: "year" as const, title: t.pathwayYear, body: t.pathwayYearBody, icon: ArrowUpRight },
              ].map((pathway, pathwayIndex) => {
                const Icon = pathway.icon;
                const activeLens = sortBy === (pathway.id === "rarity" ? "rarity" : pathway.id === "year" ? "year" : "brand");
                return (
                  <button
                    key={pathway.id}
                    type="button"
                    onClick={() => applyCollectionPathway(pathway.id)}
                    aria-controls="collection-filters"
                    aria-pressed={activeLens}
                    className={`collection-compass__pathway archive-lens__pathway group relative bg-background/95 p-6 text-left transition-colors ${activeLens ? "is-active" : ""} ${isRTL ? "text-right" : "text-left"}`}
                  >
                    <span className={`archive-lens__number ${isRTL ? "left-6" : "right-6"}`} aria-hidden="true">0{pathwayIndex + 1}</span>
                    <Icon className={`h-5 w-5 text-primary ${isRTL ? "ml-auto" : ""}`} aria-hidden="true" />
                    <h3 className="mt-10 text-3xl leading-none text-foreground" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{pathway.title}</h3>
                    <p className="mt-4 min-h-16 text-sm leading-6 text-muted-foreground">{pathway.body}</p>
                    <span className={`mt-8 inline-flex items-center gap-2 text-[0.64rem] font-bold uppercase tracking-[0.14em] text-primary ${isRTL ? "flex-row-reverse" : ""}`}>
                      {t.openPath}<ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="border-b border-primary/10 py-9 lg:py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div ref={filterSurfaceRef} id="collection-filters" className="collection-filter-surface filter-surface space-y-6 rounded-xl p-5 sm:p-7">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-border/70 bg-background/70 py-3 ps-10 pe-4 text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/70 focus:outline-none"
              />
            </div>

            {/* Filter Controls */}
            <div className={`flex flex-wrap gap-3 items-center ${isRTL ? "flex-row-reverse" : ""}`}>
              <select
                value={selectedBrand === "all" ? "all" : selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                className="bg-card border border-border/50 rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="all">{t.allBrands}</option>
                {allBrands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {language === "ar" ? (b.nameAr || b.nameEn) : b.nameEn}
                  </option>
                ))}
              </select>

              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="bg-card border border-border/50 rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="all">{t.allRarity}</option>
                {rarities.map((r) => (
                  <option key={r} value={r}>
                    {localizeRarityLabel(r, language)}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-card border border-border/50 rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="brand">{t.sortBrand}</option>
                <option value="year">{t.sortYear}</option>
                <option value="rarity">{t.sortRarity}</option>
              </select>

              <button
                type="button"
                onClick={() => setSavedOnly((current) => !current)}
                aria-pressed={savedOnly}
                className={`inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm transition-colors ${savedOnly ? "border-primary bg-primary/10 text-primary" : "border-border/70 bg-background/70 text-foreground hover:border-primary/50"}`}
              >
                <Heart className={`h-4 w-4 ${savedOnly ? "fill-current" : ""}`} aria-hidden="true" />
                {t.favorites}{wishlistIds.length ? ` (${wishlistIds.length})` : ""}
              </button>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  {t.clearFilters}
                </button>
              )}
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              {dataUnavailable
                ? t.dataUnavailable
                : isLoading
                ? (language === "ar" ? "جاري تحميل الساعات…" : "Loading timepieces…")
                : `${t.showing} ${sortedWatches.length} ${t.of} ${allWatches.length} ${t.records}`}
            </div>
          </div>
        </div>
      </section>

      {/* Watches Grid */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-6 lg:px-8">
          {dataUnavailable ? (
            <div className="mx-auto max-w-xl rounded-lg border border-primary/25 bg-card p-8 text-center shadow-sm">
              <p className="text-muted-foreground">{t.dataUnavailable}</p>
              <button
                type="button"
                onClick={() => { void refetchWatches(); void refetchBrands(); }}
                className="mt-5 rounded-md border border-primary/45 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {t.tryAgain}
              </button>
            </div>
          ) : isLoading ? (
            <WatchGridSkeleton count={6} />
          ) : sortedWatches.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">{t.noResults}</p>
              <button onClick={clearFilters} className="text-primary hover:text-primary/80 transition-colors">
                {t.clearFilters}
              </button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" : "space-y-6"}>
              {sortedWatches.map((watch, index) => {
                const brand = brandMap[watch.brandId];
                const watchName = language === "ar" ? (watch.nameAr || watch.nameEn) : watch.nameEn;
                const brandName = brand ? (language === "ar" ? (brand.nameAr || brand.nameEn) : brand.nameEn) : "";
                const recordIndex = String(index + 1).padStart(2, "0");
                const hasQualifiedImage = Boolean(watch.mainImageUrl) && !/(arabwatchguide|iflwatches|time-keeper|timekeeper)/i.test(watch.mainImageUrl || "");
                const projectImageUrl = hasQualifiedImage ? watch.mainImageUrl : null;

                return (
                  <FadeCard key={watch.id} delay={index * 0.05}>
                    <div className="relative">
                      <span className={`collection-record__index ${isRTL ? "right-4" : "left-4"}`} aria-hidden="true">{recordIndex}</span>
                      <button
                        type="button"
                        onClick={() => handleWishlistToggle(watch.id)}
                        aria-label={wishlistIds.includes(watch.id) ? t.saved : t.save}
                        aria-pressed={wishlistIds.includes(watch.id)}
                        className={`absolute top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-primary/35 bg-background/90 text-primary shadow-sm backdrop-blur transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground ${isRTL ? "left-4" : "right-4"}`}
                      >
                        <Heart className={`h-4 w-4 ${wishlistIds.includes(watch.id) ? "fill-current" : ""}`} aria-hidden="true" />
                      </button>
                      <Link href={`/watch/${watch.slug}`} className="block">
                        <div className="card-luxury watch-card group overflow-hidden rounded-xl">
                        <div className="relative aspect-square bg-muted/25 img-hover-zoom">
                          <WatchMedia
                            imageUrl={projectImageUrl}
                            alt={watchName}
                            brandName={brandName}
                            watchName={watchName}
                            reference={watch.referenceNumber}
                            language={language}
                            recordIndex={recordIndex}
                            pendingTitle={t.visualPending}
                            pendingBody={t.visualPendingBody}
                            className="watch-media-fill"
                          />
                          <div aria-hidden="true" className={`pointer-events-none absolute inset-x-4 bottom-4 translate-y-2 border-t border-primary/25 bg-background/90 p-3 text-xs text-foreground opacity-0 shadow-lg backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 ${isRTL ? "text-right" : "text-left"}`}>
                            <p className="font-semibold text-primary">{brandName}</p>
                            {watch.referenceNumber && <p className="mt-1 text-muted-foreground">{isRTL ? "المرجع" : "Reference"}: {watch.referenceNumber}</p>}
                            {watch.rarity && <p className="mt-1 text-muted-foreground">{isRTL ? "تصنيف الأرشيف" : "Archive classification"}: {localizeRarityLabel(watch.rarity, language)}</p>}
                          </div>
                        </div>
                        <div className="p-5 sm:p-6">
                          <div className="mb-2 text-[0.64rem] font-bold uppercase tracking-[0.17em] text-muted-foreground">
                            {brandName}
                          </div>
                          {watch.rarity && (
                            <div className="collection-card__classification mb-3 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-primary">
                              {isRTL ? "تصنيف الأرشيف" : "Archive classification"} · {localizeRarityLabel(watch.rarity, language)}
                            </div>
                          )}
                          <h3 className="mb-2 text-2xl leading-none text-foreground" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>
                            {watchName}
                          </h3>
                          <div className="text-xs text-muted-foreground mb-3">{watch.referenceNumber}</div>
                          <div className="flex items-center justify-end">
                            <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                              {t.discover} {isRTL ? "←" : "→"}
                            </span>
                          </div>
                        </div>
                        </div>
                      </Link>
                    </div>
                  </FadeCard>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
