import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { DIW_DAYTONA_SLUG, localizeDIWDaytonaSpecification } from "@/lib/diwDaytona";
import { Link } from "wouter";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Crown, Gauge, Watch } from "lucide-react";
import { canDisplayInArabic, hasArabicScript } from "@/lib/localizationGuard";

type Bilingual = { en: string; ar: string };

interface SheikhFeature {
  id: string;
  imageUrl: string;
  watchSlug?: string;
  label: Bilingual;
  title: Bilingual;
  description: Bilingual;
  isNew?: boolean;
}

const features: SheikhFeature[] = [
  {
    id: "sheikh-diw-motley-carbon-daytona",
    imageUrl: "/manus-storage/diw-rolex-daytona-sheikh-ammar_cabe91c8.jpg",
    watchSlug: DIW_DAYTONA_SLUG,
    label: { en: "Sheikh-worn feature", ar: "اختيار ارتداه صاحب السمو" },
    title: { en: "DIW Motley Carbon Daytona", ar: "رولكس دايتونا DIW موتلي كاربون" },
    description: {
      en: "A bespoke interpretation based on the Rolex Daytona. Carbon fibre gives the 40 mm case its featherweight presence, while the black paint-splash dial and green, yellow and red chronograph counters deliver a rare burst of contemporary colour.",
      ar: "تجسيد خاص مبني على رولكس دايتونا. تمنح ألياف الكربون العلبة بقياس 40 مم حضوراً خفيفاً وفريداً، فيما تضيف المينا السوداء ذات اللمسات الفنية وعدادات الكرونوغراف بالأخضر والأصفر والأحمر جرأة لونية معاصرة نادرة.",
    },
    isNew: true,
  },
  {
    id: "sheikh-patek-philippe-nautilus",
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/93809117/zdyffIlsSytQAOOj.jpg",
    watchSlug: "patek-philippe-nautilus-5711-1a-010-blue",
    label: { en: "The sporting classic", ar: "الأيقونة الرياضية" },
    title: { en: "Patek Philippe Nautilus", ar: "باتيك فيليب ناوتيلوس" },
    description: {
      en: "A publicly observed appearance alongside one of modern horology’s defining sports watches, noted for its proportion, poise and enduring collector appeal.",
      ar: "ظهور علني إلى جانب واحدة من أبرز الساعات الرياضية في صناعة الساعات المعاصرة، تُعرف بتوازنها وأناقتها وجاذبيتها الخالدة لدى الجامعين.",
    },
  },
  {
    id: "sheikh-richard-mille-rm67",
    imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/93809117/ubqjnpsTbyBxwveh.jpg",
    watchSlug: "richard-mille-rm-67-02-automatic-alexis-pinturault",
    label: { en: "Technical refinement", ar: "رقي تقني" },
    title: { en: "Richard Mille RM 67-01 Extra Flat", ar: "ريتشارد ميل RM 67-01 إكسترا فلات" },
    description: {
      en: "An ultra-slim expression of Richard Mille engineering, shaped for exceptional comfort without sacrificing the maison’s signature technical character.",
      ar: "تعبير فائق النحافة عن هندسة ريتشارد ميل، صُمم لراحة استثنائية من دون التخلي عن الطابع التقني المميز للدار.",
    },
  },
];

export default function SheikhGallery() {
  const { language, isRTL } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: managedPhotos = [] } = trpc.sheikhPhotos.getAll.useQuery();
  const managedFeatures: SheikhFeature[] = managedPhotos.map((photo) => {
    const approvedFeature = photo.watchSlug ? features.find((feature) => feature.watchSlug === photo.watchSlug) : undefined;
    return {
      id: `managed-gallery-${photo.id}`,
      imageUrl: photo.imageUrl,
      watchSlug: photo.watchSlug || approvedFeature?.watchSlug,
      label: { en: photo.eventName || approvedFeature?.label.en || "Editorial gallery", ar: hasArabicScript(photo.eventName) ? photo.eventName! : approvedFeature?.label.ar || "معرض تحريري" },
      title: { en: photo.watchNameEn || approvedFeature?.title.en || "Royal Horology", ar: photo.watchNameAr || approvedFeature?.title.ar || "الساعات الملكية" },
      description: { en: photo.captionEn || approvedFeature?.description.en || "An editorial gallery record preserving a publicly shared visual moment.", ar: hasArabicScript(photo.captionAr) ? photo.captionAr! : approvedFeature?.description.ar || "سجل تحريري يحفظ لحظة بصرية منشورة ضمن سياقها." },
      isNew: approvedFeature?.isNew,
    };
  });
  const galleryFeatures = managedFeatures.length ? managedFeatures : features;
  const activeFeature = galleryFeatures[Math.min(currentIndex, galleryFeatures.length - 1)];
  const { data: watch } = trpc.watches.getBySlug.useQuery({ slug: activeFeature.watchSlug || "" }, { enabled: Boolean(activeFeature.watchSlug) });

  const step = (direction: number) => {
    setCurrentIndex((current) => (current + direction + galleryFeatures.length) % galleryFeatures.length);
  };

  const specs = watch
    ? [
        { label: language === "ar" ? "المرجع" : "Reference", value: watch.referenceNumber },
        { label: language === "ar" ? "العلبة" : "Case", value: watch.caseSize },
        { label: language === "ar" ? "المادة" : "Material", value: watch.material },
        { label: language === "ar" ? "الحركة" : "Movement", value: watch.movement },
      ].map((item) => {
        if (activeFeature.watchSlug !== DIW_DAYTONA_SLUG) return item;
        return { ...item, value: localizeDIWDaytonaSpecification(item.value, language) };
      }).filter((item): item is { label: string; value: string } => Boolean(item.value) && (!isRTL || canDisplayInArabic(item.value)))
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <main>
        <section className="px-4 pb-20 pt-32 lg:pb-28 lg:pt-40">
          <div className="container mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
              <span className="ornament-line">{language === "ar" ? "حضور مميز" : "A distinguished presence"}</span>
              <h1 className="sheikh-name mt-5 text-foreground">
                {language === "ar" ? "صاحب السمو مع الساعات" : "His Highness with Timepieces"}
              </h1>
              <p className="sheikh-bio mt-5">
                {language === "ar"
                  ? "لحظات مختارة تكشف علاقة شخصية مع الحرفية والندرة والابتكار في عالم الساعات الراقية."
                  : "Selected moments revealing a personal dialogue with craftsmanship, rarity, and innovation in haute horlogerie."}
              </p>
            </div>

            <article className="luxury-panel overflow-hidden rounded-2xl p-3 sm:p-5 lg:flex lg:flex-row lg:p-6">
              <div className="relative overflow-hidden rounded-xl lg:w-[55%]">
                <img src={activeFeature.imageUrl} alt={activeFeature.title[language]} className="aspect-[4/5] h-full w-full object-cover" />
                <span className="image-corner-accent image-corner-accent--top-left" aria-hidden="true" />
                <span className="image-corner-accent image-corner-accent--bottom-right" aria-hidden="true" />
                <div className={`absolute top-5 ${isRTL ? "right-5" : "left-5"} rounded-full border border-gold-300/70 bg-background/85 px-4 py-2 text-xs font-bold tracking-[0.15em] text-gold-700 backdrop-blur-sm`}>
                  {activeFeature.isNew ? (language === "ar" ? "إضافة جديدة" : "NEW FEATURE") : activeFeature.label[language]}
                </div>
              </div>

              <div className={`flex flex-col justify-center p-6 sm:p-8 lg:w-[45%] lg:p-10 ${isRTL ? "text-right" : "text-left"}`}>
                <p className="sheikh-title">{activeFeature.label[language]}</p>
                <h2 className="mt-3 text-4xl text-foreground sm:text-5xl" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>
                  {watch ? (language === "ar" ? watch.nameAr : watch.nameEn) : activeFeature.title[language]}
                </h2>
                <p className="sheikh-bio mt-5">{activeFeature.description[language]}</p>

                {specs.length > 0 && (
                  <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5">
                    {specs.map((spec) => (
                      <div key={spec.label} className="border-s border-primary/25 ps-3">
                        <p className="text-xs font-bold tracking-[0.12em] text-muted-foreground">{spec.label}</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeFeature.watchSlug && <Link href={`/watch/${activeFeature.watchSlug}`} className="mt-8 inline-flex w-fit items-center gap-2 border border-gold-500 bg-gold-500 px-5 py-3 text-sm font-bold text-gold-900 transition-all hover:-translate-y-0.5 hover:bg-gold-400">
                  {language === "ar" ? "استكشف التفاصيل الكاملة" : "Explore full details"}
                  {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </Link>}
              </div>
            </article>

            <div className={`mt-8 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <button type="button" onClick={() => step(-1)} aria-label={language === "ar" ? "الصورة السابقة" : "Previous feature"} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 text-primary transition-colors hover:border-primary hover:bg-primary/10">
                {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </button>
              <div className="flex items-center gap-2" aria-label={language === "ar" ? "مؤشر المعرض" : "Gallery progress"}>
                {galleryFeatures.map((feature, index) => (
                  <button key={feature.id} type="button" onClick={() => setCurrentIndex(index)} aria-label={`${language === "ar" ? "انتقل إلى" : "Go to"} ${index + 1}`} className={`h-2 rounded-full transition-all ${index === currentIndex ? "w-8 bg-gold-500" : "w-2 bg-primary/30 hover:bg-primary/60"}`} />
                ))}
              </div>
              <button type="button" onClick={() => step(1)} aria-label={language === "ar" ? "الصورة التالية" : "Next feature"} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 text-primary transition-colors hover:border-primary hover:bg-primary/10">
                {isRTL ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </section>

        <section className="border-y border-primary/15 bg-muted/30 px-4 py-14">
          <div className="container mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {[
              { icon: Crown, en: "Editorial context", ar: "سياق تحريري", enText: "Stories that place exceptional watches within the moments that give them meaning.", arText: "قصص تضع الساعات الاستثنائية ضمن اللحظات التي تمنحها معناها." },
              { icon: Watch, en: "Distinguished selection", ar: "اختيار مميز", enText: "A considered dialogue between historic craft and contemporary expression.", arText: "حوار متوازن بين الحرفية التاريخية والتعبير المعاصر." },
              { icon: Gauge, en: "Technical character", ar: "طابع تقني", enText: "Specifications presented with clarity, respect, and collector context.", arText: "مواصفات تُعرض بوضوح واحترام وسياق يليق بالجامعين." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.en} className={`text-center ${isRTL ? "md:text-right" : "md:text-left"}`}>
                  <Icon className={`mx-auto mb-4 h-8 w-8 text-gold-500 ${isRTL ? "md:ms-0" : "md:me-0"}`} />
                  <h3 className="text-xl text-foreground" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{language === "ar" ? item.ar : item.en}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{language === "ar" ? item.arText : item.enText}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
