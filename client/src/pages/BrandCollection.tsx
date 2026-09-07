import { trpc } from "@/lib/trpc";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, ExternalLink, Landmark } from "lucide-react";
import { WatchMedia } from "@/components/WatchMedia";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizeRarityLabel } from "@/lib/timelinePresentation";
import { hasArabicScript, isSourceBoundedEditorialDescription } from "@/lib/localizationGuard";
import { vacheronDossier } from "@/data/vacheronDossier";

export default function BrandCollection() {
  const { slug } = useParams<{ slug: string }>();
  const { language, isRTL } = useLanguage();
  const isArabic = language === "ar";
  const { data: brand, isLoading: brandLoading, isError: brandError, refetch: refetchBrand } = trpc.brands.getBySlug.useQuery({ slug: slug! });
  const { data: watches, isLoading: watchesLoading, isError: watchesError, refetch: refetchWatches } = trpc.watches.getByBrand.useQuery({ brandId: brand?.id! }, { enabled: !!brand?.id });
  const backArrow = isRTL ? ArrowRight : ArrowLeft;
  const isVacheron = slug === "vacheron-constantin";
  const recoveryCopy = isArabic
    ? {
        eyebrow: "اتصال مباشر",
        title: "سجل الدار غير متاح مؤقتاً",
        body: "تعذر الوصول إلى بيانات هذه الدار الآن. يمكنك المحاولة مجدداً أو العودة إلى المجموعة.",
        retry: "إعادة المحاولة",
        back: "العودة إلى المجموعة",
      }
    : {
        eyebrow: "LIVE CONNECTION",
        title: "This maison record is temporarily unavailable",
        body: "The live data for this maison could not be reached right now. You can retry or return to the collection.",
        retry: "Try again",
        back: "Back to Collection",
      };

  if (brandError || watchesError) {
    return (
      <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
        <Header />
        <main className="flex min-h-[70vh] items-center justify-center px-4 pt-24">
          <section className={`luxury-panel max-w-lg p-8 sm:p-10 ${isRTL ? "text-right" : "text-left"}`}>
            <p className="overline text-primary">{recoveryCopy.eyebrow}</p>
            <h1 className="mt-4 text-3xl text-foreground" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{recoveryCopy.title}</h1>
            <p className="mt-4 leading-relaxed text-muted-foreground">{recoveryCopy.body}</p>
            <div className={`mt-8 flex flex-wrap gap-3 ${isRTL ? "justify-start" : "justify-end"}`}>
              <button type="button" onClick={() => { void refetchBrand(); if (brand) void refetchWatches(); }} className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85">{recoveryCopy.retry}</button>
              <Link href="/collection" className="rounded-md border border-primary/45 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10">{recoveryCopy.back}</Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (brandLoading || watchesLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
        <Header />
        <main className="flex min-h-[70vh] items-center justify-center px-4 pt-24"><p className="text-2xl text-primary" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{isArabic ? "جاري التحميل..." : "Loading..."}</p></main>
        <Footer />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
        <Header />
        <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 pt-24"><p className="text-2xl text-primary" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{isArabic ? "المجموعة غير موجودة" : "Collection not found"}</p><Link href="/collections" className="text-muted-foreground transition-colors hover:text-primary">{isArabic ? "العودة للمجموعات" : "Back to Collections"}</Link></main>
        <Footer />
      </div>
    );
  }

  const brandName = isArabic ? brand.nameAr || brand.nameEn : brand.nameEn;
  const brandDescription = isArabic ? brand.descriptionAr : brand.descriptionEn;
  const dossierCopy = isArabic
    ? {
        collectionTitle: "خريطة المجموعات",
        collectionBody: "أسماء ومفردات المجموعات كما تظهر في صفحة الدار الرسمية، تُقرأ هنا كإطار ثقافي لا كفهرس ملكية.",
        source: "مصدر الدار الرسمي",
        heritage: "صفحة المصنع",
        recordsEyebrow: "سجلات الأرشيف",
        recordsTitle: "ما يمكن أن يثبته هذا الأرشيف",
        emptyTitle: "لا توجد ساعة من هذه الدار موثقة في الأرشيف حتى الآن.",
        emptyBody: "سيُضاف أي سجل فقط عند توفر مصدر علني مستقل يربطه بظهور محدد.",
      }
    : {
        collectionTitle: "A collection map",
        collectionBody: "Collection names and themes appear here as published maison vocabulary, read as cultural context rather than an ownership index.",
        source: "Official collections source",
        heritage: "Manufacture source",
        recordsEyebrow: "ARCHIVE RECORDS",
        recordsTitle: "What this archive can establish",
        emptyTitle: "No Vacheron Constantin timepiece is documented in this archive yet.",
        emptyBody: "A record will appear only when an independent public source connects it to a specific appearance.",
      };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <main>
        {isVacheron ? (
          <>
            <section className="vacheron-dossier relative overflow-hidden border-b border-primary/15 px-4 pb-20 pt-32">
              <div className="vacheron-dossier__arc vacheron-dossier__arc--one" aria-hidden="true" />
              <div className="vacheron-dossier__arc vacheron-dossier__arc--two" aria-hidden="true" />
              <div className="container relative z-10 mx-auto max-w-6xl">
                <Link href="/collections" className="mb-12 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary">
                  {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                  {isArabic ? "العودة للمجموعات" : "Back to Maisons"}
                </Link>
                <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                  <div className={isRTL ? "text-left lg:order-2" : "text-left"}>
                    <p className="ornament-line">{isArabic ? vacheronDossier.eyebrow.ar : vacheronDossier.eyebrow.en}</p>
                    <h1 className="vacheron-dossier__title mt-6 text-foreground">{brandName}</h1>
                    <h2 className="mt-4 max-w-3xl text-4xl leading-none text-primary md:text-6xl" style={{ fontFamily: isArabic ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>
                      {isArabic ? vacheronDossier.title.ar : vacheronDossier.title.en}
                    </h2>
                    <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">{isArabic ? vacheronDossier.lede.ar : vacheronDossier.lede.en}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <a href={vacheronDossier.officialSourceUrl} target="_blank" rel="noopener noreferrer" className="vacheron-dossier__source-link">
                        {dossierCopy.source}<ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                      <a href={vacheronDossier.heritageSourceUrl} target="_blank" rel="noopener noreferrer" className="vacheron-dossier__source-link">
                        {dossierCopy.heritage}<ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                  <aside className={`vacheron-dossier__boundary ${isRTL ? "text-left lg:order-1" : "text-left"}`}>
                    <Landmark className={`h-6 w-6 text-primary ${isRTL ? "ml-auto" : ""}`} aria-hidden="true" />
                    <p className="mt-5 text-base leading-7 text-foreground/80">{isArabic ? vacheronDossier.boundary.ar : vacheronDossier.boundary.en}</p>
                  </aside>
                </div>
                <div className="vacheron-dossier__pillars mt-16 grid gap-px border border-primary/25 bg-primary/25 md:grid-cols-3">
                  {vacheronDossier.pillars.map((pillar) => (
                    <div key={pillar.value} className={`bg-background/90 p-7 ${isRTL ? "text-left" : "text-left"}`}>
                      <p className="vacheron-dossier__value">{pillar.value}</p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-primary">{isArabic ? pillar.label.ar : pillar.label.en}</p>
                      <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">{isArabic ? pillar.detail.ar : pillar.detail.en}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="vacheron-map border-b border-primary/15 px-4 py-24 md:py-32">
              <div className="container mx-auto max-w-6xl">
                <div className={`grid gap-10 lg:grid-cols-[0.68fr_1.32fr] ${isRTL ? "text-left" : "text-left"}`}>
                  <div>
                    <p className="ornament-line">{isArabic ? "مفردات الدار" : "MAISON VOCABULARY"}</p>
                    <h2 className="section-heading mt-5 text-foreground">{dossierCopy.collectionTitle}</h2>
                    <p className="mt-5 max-w-md text-lg leading-8 text-muted-foreground">{dossierCopy.collectionBody}</p>
                  </div>
                  <div className="grid border border-primary/25 sm:grid-cols-2">
                    {vacheronDossier.collections.map((collection, index) => (
                      <div key={collection.name} className={`vacheron-map__cell p-6 ${isRTL ? "text-left" : "text-left"}`}>
                        <span className="text-xs font-bold tracking-[0.16em] text-primary/75">{String(index + 1).padStart(2, "0")}</span>
                        <h3 className="mt-7 text-3xl leading-none text-foreground" style={{ fontFamily: isArabic ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{isArabic ? collection.arName : collection.name}</h3>
                        <p className="mt-4 text-sm leading-6 text-muted-foreground">{isArabic ? collection.ar : collection.en}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
        <section className="page-hero border-b border-primary/15 px-4 pb-20 pt-32">
          <div className="container mx-auto max-w-6xl">
            <Link href="/collections" className="mb-10 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary">
              {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              {isArabic ? "العودة للمجموعات" : "Back to Maisons"}
            </Link>
            <div className="mx-auto max-w-4xl text-center">
              <p className="overline mb-4 text-primary">{isArabic ? "دار الساعات" : "MAISON ARCHIVE"}</p>
              <h1 className="section-heading text-gold-gradient mb-6 text-5xl md:text-7xl">{brandName}</h1>
              <div className="mb-8 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                {brand.foundedYear && <span>{isArabic ? `تأسست ${brand.foundedYear}` : `Founded ${brand.foundedYear}`}</span>}
                {!isArabic && brand.country && <><span aria-hidden="true">•</span><span>{brand.country}</span></>}
              </div>
              {brandDescription && <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">{brandDescription}</p>}
            </div>
          </div>
        </section>
        )}

        <section className="px-4 py-20">
          <div className="container mx-auto max-w-7xl">
            {watches?.length ? (
              <>
                <div className={`mb-12 ${isRTL ? "text-right" : "text-left"}`}>
                  <p className="overline mb-3 text-primary">{isVacheron ? dossierCopy.recordsEyebrow : isArabic ? "سجل الدار" : "MAISON RECORDS"}</p>
                  <h2 className="section-heading mb-2 text-3xl">{isVacheron ? dossierCopy.recordsTitle : isArabic ? "الساعات في هذا الأرشيف" : "Timepieces in this Archive"}</h2>
                  <p className="text-muted-foreground">{watches.length} {isArabic ? "ساعة موثقة" : watches.length === 1 ? "documented timepiece" : "documented timepieces"}</p>
                </div>
                <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                  {watches.map((watch) => {
                    const watchName = isArabic ? watch.nameAr || watch.nameEn : watch.nameEn;
                    const rawWatchDescription = isArabic
                      ? hasArabicScript(watch.descriptionAr) ? watch.descriptionAr : null
                      : watch.descriptionEn;
                    const watchDescription = isSourceBoundedEditorialDescription(rawWatchDescription) ? rawWatchDescription : null;
                    return (
                      <Link key={watch.id} href={`/watch/${watch.slug}`} className="card-luxury watch-card group block overflow-hidden rounded-xl">
                        <div className="relative aspect-square overflow-hidden bg-muted/25">
                          <WatchMedia
                            imageUrl={watch.mainImageUrl}
                            alt={watchName}
                            brandName={brandName}
                            watchName={watchName}
                            reference={watch.referenceNumber}
                            language={language}
                            fit="contain"
                            className="watch-media-fill"
                          />
                          <div className={`absolute top-4 flex gap-2 ${isRTL ? "left-4" : "right-4"}`}>
                            {watch.rarity && <span className="rounded-full border border-primary/30 bg-background/85 px-3 py-1 text-xs font-medium text-primary backdrop-blur">{localizeRarityLabel(watch.rarity, language)}</span>}
                            {watch.isFeatured && <span className="rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-bold text-primary backdrop-blur">{isArabic ? "مميزة" : "Featured"}</span>}
                          </div>
                        </div>
                        <div className={`p-6 ${isRTL ? "text-right" : "text-left"}`}>
                          <h3 className="mb-2 line-clamp-2 text-3xl leading-none text-primary transition-opacity group-hover:opacity-75" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{watchName}</h3>
                          {watch.referenceNumber && <p className="mb-4 text-sm text-muted-foreground">{isArabic ? "المرجع" : "Reference"}: {watch.referenceNumber}</p>}
                          {watchDescription && <p className="mb-5 line-clamp-2 text-sm leading-6 text-muted-foreground">{watchDescription}</p>}
                          <div className="flex items-center justify-end border-t border-primary/15 pt-4">
                            {isRTL ? <ArrowLeft className="h-5 w-5 text-primary transition-transform group-hover:-translate-x-1" /> : <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className={`luxury-panel py-20 ${isVacheron ? (isRTL ? "text-left" : "text-left") : "text-center"}`}>
                <p className="text-xl text-muted-foreground">{isVacheron ? dossierCopy.emptyTitle : isArabic ? "لا توجد سجلات ساعات لهذه الدار حالياً" : "No documented timepieces are currently available for this maison."}</p>
                {isVacheron && <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{dossierCopy.emptyBody}</p>}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
