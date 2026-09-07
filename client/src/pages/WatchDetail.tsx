import { trpc } from "@/lib/trpc";
import { Header } from "@/components/Header";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Award, BookOpen, Calendar, Check, ChevronDown, Package, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ImageGallery } from "@/components/ImageGallery";
import { WatchMedia } from "@/components/WatchMedia";
import { WatchComments } from "@/components/WatchComments";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { DIW_DAYTONA_SLUG, localizeDIWDaytonaRarity, localizeDIWDaytonaSpecification } from "@/lib/diwDaytona";
import { canDisplayInArabic, hasArabicScript, isSourceBoundedEditorialDescription } from "@/lib/localizationGuard";

const WATCH_DETAIL_RELEASE = "source-boundary-description-v2";

export default function WatchDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language, isRTL } = useLanguage();
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [shareStatus, setShareStatus] = useState<"shared" | "copied" | "unavailable" | null>(null);
  const { data: watch, isLoading: watchLoading, isError: watchError, refetch: refetchWatch } = trpc.watches.getBySlug.useQuery({ slug: slug! });
  const { data: allBrands } = trpc.brands.getAll.useQuery();
  const brand = allBrands?.find((entry) => entry.id === watch?.brandId);
  const { data: images } = trpc.watches.getImages.useQuery({ watchId: watch?.id! }, { enabled: !!watch?.id });
  const { data: sheikhPhotos } = trpc.sheikhPhotos.getByWatch.useQuery({ watchId: watch?.id! }, { enabled: !!watch?.id });
  const trackPageView = trpc.analytics.trackPageView.useMutation();
  const Arrow = isRTL ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (!watch) return;
    trackPageView.mutate({
      pageType: "watch_detail",
      pagePath: `/watch/${slug}`,
      watchId: watch.id,
      brandId: watch.brandId,
      sessionId,
      userAgent: navigator.userAgent,
    });
  }, [watch?.id]);

  if (watchLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
        <Header />
        <div className="flex min-h-screen items-center justify-center"><p className="text-2xl text-primary" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{isRTL ? "جاري التحميل..." : "Loading..."}</p></div>
      </div>
    );
  }

  if (!watch) {
    const unavailableCopy = isRTL
      ? {
          title: "سجل الساعة غير متاح مؤقتاً",
          body: "تعذر الوصول إلى السجل المباشر الآن. يمكنك المحاولة مجدداً أو العودة إلى المجموعة.",
          retry: "إعادة المحاولة",
          back: "العودة للمجموعة",
        }
      : {
          title: "This watch record is temporarily unavailable",
          body: "The live record could not be reached right now. Please retry or return to the collection.",
          retry: "Try again",
          back: "Back to Collection",
        };
    return (
      <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
        <Header />
        <main className="flex min-h-[70vh] items-center justify-center px-4 py-32">
          <section className={`luxury-panel max-w-lg p-8 sm:p-10 ${isRTL ? "text-right" : "text-left"}`}>
            <p className="overline text-primary">{watchError ? (isRTL ? "اتصال مباشر" : "Live connection") : (isRTL ? "السجل" : "Record")}</p>
            <h1 className="mt-4 text-3xl text-foreground" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{watchError ? unavailableCopy.title : (isRTL ? "الساعة غير موجودة" : "Watch not found")}</h1>
            <p className="mt-4 leading-relaxed text-muted-foreground">{watchError ? unavailableCopy.body : (isRTL ? "لا يتوفر سجل مطابق في هذا الأرشيف." : "No matching record is available in this archive.")}</p>
            <div className={`mt-8 flex flex-wrap gap-3 ${isRTL ? "justify-start" : "justify-end"}`}>
              {watchError && <button type="button" onClick={() => { void refetchWatch(); }} className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85">{unavailableCopy.retry}</button>}
              <Link href="/collection" className="rounded-md border border-primary/45 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10">{watchError ? unavailableCopy.back : (isRTL ? "العودة للمجموعة" : "Back to Collection")}</Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const galleryImages = watch.mainImageUrl ? [watch.mainImageUrl, ...(images?.map((image) => image.imageUrl) || [])] : images?.map((image) => image.imageUrl) || [];
  const displaySpecification = (value: string | null) => watch.slug === DIW_DAYTONA_SLUG ? localizeDIWDaytonaSpecification(value, language) : value;
  const localizedRarity = (() => {
    if (!watch.rarity || !isRTL || hasArabicScript(watch.rarity)) return watch.rarity;

    const ArabicRarityLabels: Record<string, string> = {
      "Common Luxury": "فاخرة شائعة",
      "Limited Edition": "إصدار محدود",
      Rare: "نادرة",
      "Ultra Rare": "نادرة للغاية",
    };

    return watch.slug === DIW_DAYTONA_SLUG
      ? localizeDIWDaytonaRarity(watch.rarity, language)
      : ArabicRarityLabels[watch.rarity] ?? null;
  })();
  const specifications = [
    [isRTL ? "المادة" : "Material", watch.material],
    [isRTL ? "الحجم" : "Case Size", watch.caseSize],
    [isRTL ? "الحركة" : "Movement", watch.movement],
    [isRTL ? "لون القرص" : "Dial Color", watch.dialColor],
    [isRTL ? "مقاومة الماء" : "Water Resistance", watch.waterResistance],
  ].filter(([, value]) => Boolean(value) && (!isRTL || canDisplayInArabic(value)));
  const localizedDescriptionCandidate = isRTL
    ? hasArabicScript(watch.descriptionAr) ? watch.descriptionAr : null
    : watch.descriptionEn;
  const localizedDescription = isSourceBoundedEditorialDescription(localizedDescriptionCandidate) ? localizedDescriptionCandidate : null;
  const localizedStory = isRTL
    ? hasArabicScript(watch.storyAr) ? watch.storyAr : null
    : watch.storyEn;
  const localizedComplications = !watch.complications || !isRTL || canDisplayInArabic(watch.complications)
    ? watch.complications
    : null;
  const shareCopy = isRTL
    ? {
        action: "مشاركة السجل",
        shared: "تمت المشاركة.",
        copied: "تم نسخ رابط السجل.",
        unavailable: "تعذرت المشاركة من هذا المتصفح.",
      }
    : {
        action: "Share record",
        shared: "Shared successfully.",
        copied: "Record link copied.",
        unavailable: "Sharing is unavailable in this browser.",
      };
  const shareWatch = async () => {
    const shareData = {
      title: isRTL ? watch.nameAr : watch.nameEn,
      text: brand ? `${isRTL ? brand.nameAr : brand.nameEn} — ${isRTL ? watch.nameAr : watch.nameEn}` : (isRTL ? watch.nameAr : watch.nameEn),
      url: window.location.href,
    };

    try {
      if (typeof navigator.share === "function") {
        await navigator.share(shareData);
        setShareStatus("shared");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareData.url);
        setShareStatus("copied");
      } else {
        setShareStatus("unavailable");
      }
    } catch {
      setShareStatus("unavailable");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"} data-watch-detail-release={WATCH_DETAIL_RELEASE}>
      <Header />
      <main>
        <section className="page-hero border-b border-primary/15 px-4 py-28 lg:py-32">
          <div className="container mx-auto max-w-7xl">
            <Link href={brand ? `/collection/${brand.slug}` : "/collection"} className="mb-10 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary"><Arrow className="h-4 w-4" />{isRTL ? "العودة للمجموعة" : "Back to Collection"}</Link>
            <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
              <div className="w-full space-y-4 lg:w-[55%]">
                {galleryImages.length ? <ImageGallery images={galleryImages} altText={isRTL ? watch.nameAr : watch.nameEn} language={language} /> : <div className="aspect-square overflow-hidden rounded-lg border border-primary/30 bg-muted/40"><WatchMedia imageUrl={null} alt={isRTL ? watch.nameAr : watch.nameEn} brandName={brand ? (isRTL ? brand.nameAr || brand.nameEn : brand.nameEn) : undefined} watchName={isRTL ? watch.nameAr : watch.nameEn} reference={watch.referenceNumber} language={language} pendingTitle={isRTL ? "صورة السجل قيد الربط" : "Archive image pending"} pendingBody={isRTL ? "لا تتوفر صورة مؤكدة من ملفات المشروع لهذا العرض حالياً." : "No confirmed image from the project files is available for this view yet."} className="watch-media-fill" /></div>}
                <div className="flex flex-wrap gap-2">
                  {localizedRarity && <div className="rounded-full border border-primary/50 bg-background/80 px-4 py-2 backdrop-blur-sm"><span className="text-sm font-medium text-primary">{localizedRarity}</span></div>}
                  {watch.isFeatured && <div className="rounded-full border border-primary bg-primary/20 px-4 py-2 backdrop-blur-sm"><span className="text-sm font-bold text-primary">{isRTL ? "مميزة" : "Featured"}</span></div>}
                </div>
              </div>
              <div className={`w-full space-y-8 lg:w-[45%] ${isRTL ? "lg:text-right" : "lg:text-left"}`}>
                {brand && <Link href={`/collection/${brand.slug}`} className="font-medium text-primary transition-colors hover:text-primary/75">{isRTL ? brand.nameAr : brand.nameEn}</Link>}
                <div>
                  <h1 className="sheikh-name mb-5 text-gold-gradient">{isRTL ? watch.nameAr : watch.nameEn}</h1>
                  <div className="flex flex-wrap items-center gap-3">
                    {watch.referenceNumber && <p className="text-muted-foreground">{isRTL ? "المرجع" : "Reference"}: {watch.referenceNumber}</p>}
                    <button type="button" onClick={() => { void shareWatch(); }} className="inline-flex items-center gap-2 rounded-md border border-primary/35 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                      <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {shareCopy.action}
                    </button>
                  </div>
                  {shareStatus && <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground" role="status" aria-live="polite"><Check className="h-4 w-4 text-primary" aria-hidden="true" />{shareCopy[shareStatus]}</p>}
                </div>
                {localizedDescription && <p className="text-lg leading-relaxed text-muted-foreground">{localizedDescription}</p>}
                {(specifications.length > 0 || localizedComplications) && <div className="space-y-4">
                  <h2 className="text-3xl text-primary" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{isRTL ? "المواصفات" : "Specifications"}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {specifications.map(([label, value]) => <div key={label} className="spec-card rounded-lg p-4"><p className="mb-1 text-sm text-muted-foreground">{label}</p><p className="font-medium text-foreground">{displaySpecification(value)}</p></div>)}
                    {localizedComplications && <div className="spec-card col-span-2 rounded-lg p-4"><p className="mb-1 text-sm text-muted-foreground">{isRTL ? "التعقيدات" : "Complications"}</p><p className="font-medium text-foreground">{displaySpecification(localizedComplications)}</p></div>}
                  </div>
                </div>}
                <div className="flex flex-wrap gap-4">
                  {watch.yearReleased && <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-5 w-5" />{isRTL ? "سنة الإصدار" : "Released"}: {watch.yearReleased}</div>}
                  {watch.limitedEdition && watch.productionQuantity && <div className="flex items-center gap-2 text-primary"><Package className="h-5 w-5" />{isRTL ? "إصدار محدود" : "Limited Edition"}: {watch.productionQuantity} {isRTL ? "قطعة" : "pieces"}</div>}
                </div>
              </div>
            </div>
          </div>
        </section>

        {localizedStory && (
          <section className="border-y border-primary/15 bg-card/20 px-4 py-20">
            <div className="container mx-auto max-w-4xl">
              <details className="luxury-panel group overflow-hidden" open={false}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-6 text-foreground transition-colors hover:text-primary sm:p-8">
                  <span className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                      <BookOpen className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-primary">{isRTL ? "سياق السجل" : "Archive context"}</span>
                      <span className="mt-1 block text-2xl" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{isRTL ? "اقرأ السرد المرتبط بالسجل" : "Read the record context"}</span>
                    </span>
                  </span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="border-t border-primary/15 px-6 pb-7 pt-6 sm:px-8 sm:pb-9">
                  <div className="mb-5 flex items-center gap-3 text-primary">
                    <Award className="h-5 w-5" aria-hidden="true" />
                    <h2 className="text-2xl" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{isRTL ? "السياق التحريري" : "Editorial context"}</h2>
                  </div>
                  <p className="text-lg leading-relaxed text-muted-foreground">{localizedStory}</p>
                </div>
              </details>
            </div>
          </section>
        )}

        {sheikhPhotos?.length ? <section className="px-4 py-20"><div className="container mx-auto max-w-7xl"><h2 className="mb-12 text-center text-4xl text-primary" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{isRTL ? "صور سمو الشيخ عمار مع الساعة" : "His Highness Sheikh Ammar with the Watch"}</h2><div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">{sheikhPhotos.map((photo) => <article key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl border border-primary/30 bg-card transition-all duration-500 hover:border-primary/60"><img src={photo.imageUrl} alt={(isRTL ? photo.captionAr : photo.captionEn) || ""} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />{(isRTL ? photo.captionAr : photo.captionEn) && <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-4"><p className="text-sm text-foreground">{isRTL ? photo.captionAr : photo.captionEn}</p></div>}</article>)}</div></div></section> : null}
        <WatchComments watchId={watch.id} />
      </main>
      <Footer />
    </div>
  );
}
