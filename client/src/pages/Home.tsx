import { Link } from "wouter";
import { ArrowUpRight, Quote } from "lucide-react";
import { ArchiveStorySlideshow } from "@/components/ArchiveStorySlideshow";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";

const pathwayCards = [
  {
    href: "/collection",
    index: "01",
    enTitle: "The Collection Atlas",
    arTitle: "أطلس المجموعة",
    enBody: "Source-conscious records, arranged to reward close looking.",
    arBody: "سجلات موثقة تُرتّب لتكافئ النظر المتأني.",
  },
  {
    href: "/constellation",
    index: "02",
    enTitle: "Constellation of Time",
    arTitle: "كوكبة الزمن",
    enBody: "A visual reading of the maisons, movements, and moments that connect the archive.",
    arBody: "قراءة بصرية للدور والحركات واللحظات التي تصل بين سجلات الأرشيف.",
  },
  {
    href: "/sheikh-gallery",
    index: "03",
    enTitle: "The Gallery",
    arTitle: "المعرض",
    enBody: "A quieter view of publicly observed appearances and their editorial context.",
    arBody: "مشهد أكثر هدوءاً للظهورات العلنية وسياقها التحريري.",
  },
] as const;

export default function Home() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { data: archiveRecords = [] } = trpc.watches.getAll.useQuery();
  const { data: maisons = [] } = trpc.brands.getAll.useQuery();
  const {
    data: approvedReflections = [],
    isLoading: reflectionsLoading,
    isError: reflectionsError,
    refetch: refetchReflections,
  } = trpc.comments.getApprovedForHomepage.useQuery({ language, limit: 3 });

  return (
    <div className="reference-vault-home min-h-screen overflow-x-clip bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"} data-home-release="reference-vault-v1">
      <Header />

      <main>
        <section className="reference-vault-hero museum-uae-rule" aria-label={isRTL ? "مدخل المتحف الإماراتي الخاص للساعات" : "Private UAE horology museum opening"}>
          <div className={`reference-vault-hero__prologue ${isRTL ? "text-right" : "text-left"}`} aria-label={isRTL ? "تعريف المتحف الخاص للساعات" : "Private horology museum introduction"}>
            <span className="reference-vault-hero__prologue-mark" aria-hidden="true">RRR</span>
            <div>
              <p className="reference-vault-hero__prologue-kicker">{isRTL ? "متحف الساعات الخاص" : "THE PRIVATE HOROLOGY MUSEUM"}</p>
              <p className="reference-vault-hero__prologue-name">{isRTL ? "من محفوظات صاحب السمو الشيخ عمار بن حميد النعيمي" : "From the archive of His Highness Sheikh Ammar bin Humaid Al Nuaimi"}</p>
            </div>
            <a href="#watch-stories" className="reference-vault-hero__prologue-entry">{isRTL ? "ادخل إلى الحكاية" : "Enter the story"}<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></a>
          </div>
          <ArchiveStorySlideshow />
          <dl className={`reference-vault-hero__metrics ${isRTL ? "text-right" : "text-left"}`} aria-label={isRTL ? "مقياس الأرشيف" : "Archive measures"}>
            <div>
              <dt>{isRTL ? "سجلات الأرشيف" : "ARCHIVE RECORDS"}</dt>
              <dd>{archiveRecords.length || "—"}</dd>
            </div>
            <div>
              <dt>{isRTL ? "الدور" : "MAISONS"}</dt>
              <dd>{maisons.length || "—"}</dd>
            </div>
            <div>
              <dt>{isRTL ? "حدود التحرير" : "EDITORIAL BOUNDARY"}</dt>
              <dd className="reference-vault-hero__metric-word">{isRTL ? "موثق" : "SOURCED"}</dd>
            </div>
          </dl>
        </section>

        <section className="editorial-entry-guide border-b border-primary/15 px-4 py-8 md:py-10" aria-label={isRTL ? "دليل البداية" : "Journey guide"}>
          <div className="container mx-auto">
            <div className={`grid gap-px overflow-hidden border border-primary/25 bg-primary/25 md:grid-cols-3 ${isRTL ? "text-right" : "text-left"}`}>
              <a href="#watch-stories" className="editorial-entry-guide__step group bg-background/90 p-5 transition-colors hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary">
                <span className="editorial-entry-guide__index">01</span>
                <span className="editorial-entry-guide__label">{isRTL ? "ابدأ بقصص الساعات" : "Begin with the watch stories"}</span>
                <span className="editorial-entry-guide__body">{isRTL ? "شاهد الدراسة المتحركة واختر السجل الذي يلفت انتباهك." : "Watch the opening sequence, then choose the record that draws you in."}</span>
              </a>
              <Link href="/collection" className="editorial-entry-guide__step group bg-background/90 p-5 transition-colors hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary">
                <span className="editorial-entry-guide__index">02</span>
                <span className="editorial-entry-guide__label">{isRTL ? "اقرأ أطلس الأرشيف" : "Read the archive atlas"}</span>
                <span className="editorial-entry-guide__body">{isRTL ? "انتقل إلى السجلات، ثم صفِّها بحسب الدار أو السنة أو التصنيف." : "Move into the records and filter by maison, year, or classification."}</span>
              </Link>
              <Link href="/collection#collection-film" className="editorial-entry-guide__step group bg-background/90 p-5 transition-colors hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary">
                <span className="editorial-entry-guide__index">03</span>
                <span className="editorial-entry-guide__label">{isRTL ? "شاهد المرجع المصوّر" : "View the film reference"}</span>
                <span className="editorial-entry-guide__body">{isRTL ? "مرجع فيديو خارجي منسوب بوضوح قبل الانتقال إلى الاستكشاف التفصيلي." : "An attributed external video reference before you continue into the full archive."}</span>
              </Link>
            </div>
          </div>
        </section>

        <section id="archive-prelude" className={`archive-prelude relative overflow-hidden px-4 py-24 md:py-32 ${isRTL ? "text-left" : "text-left"}`} aria-labelledby="archive-prelude-heading">
          <div className="container relative z-10 mx-auto">
            <div className="grid gap-10 lg:grid-cols-[0.42fr_1fr_0.58fr] lg:items-end">
              <div className={`archive-prelude__index ${isRTL ? "lg:order-3" : ""}`} aria-hidden="true">
                <span>01</span>
                <i />
                <small>{isRTL ? "البداية" : "THE OPENING"}</small>
              </div>
              <div className={isRTL ? "lg:order-2" : ""}>
                <p className="ornament-line">{isRTL ? "مدخل الأرشيف" : "THE ARCHIVE PRELUDE"}</p>
                <h2 id="archive-prelude-heading" className="section-heading mt-6 max-w-4xl text-foreground">
                  {isRTL ? "يبدأ الأرشيف بظهور علني، لا بفرضية." : "The archive begins with a public appearance, not an assumption."}
                </h2>
              </div>
              <div className={`${isRTL ? "lg:order-1" : ""} border-primary/35 ${isRTL ? "border-l pl-6" : "border-l pl-6"}`}>
                <p className="text-lg leading-8 text-muted-foreground">
                  {isRTL
                    ? "كل سجل يفصل بين ما شوهد علناً، وما تؤكده الدار المصنعة، وما لم تثبته المصادر بعد. هذه الدقة هي ما يمنح المجموعة حضورها."
                    : "Each record separates what was seen publicly, what the maison confirms, and what evidence does not yet establish. That discipline is what gives the archive its presence."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="collection-constellation relative overflow-hidden px-4 py-24 md:py-32" aria-labelledby="constellation-paths-heading">
          <div className="collection-constellation__grid" aria-hidden="true" />
          <div className="container relative z-10 mx-auto">
            <div className={`mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end ${isRTL ? "md:flex-row-reverse" : ""}`}>
              <div className={isRTL ? "text-left" : "text-left"}>
                <p className="ornament-line">{isRTL ? "مسارات في الزمن" : "PATHWAYS THROUGH TIME"}</p>
                <h2 id="constellation-paths-heading" className="section-heading mt-5 max-w-3xl text-secondary-foreground">
                  {isRTL ? "ثلاث طرق للدخول إلى الحكاية." : "Three ways into the story."}
                </h2>
              </div>
              <p className={`max-w-md text-base leading-7 text-secondary-foreground/72 ${isRTL ? "text-left" : "text-left"}`}>
                {isRTL
                  ? "اختر المسار الذي يلفت نظرك، ثم دع السجل يقودك من التفاصيل إلى المعنى."
                  : "Choose the path that catches your eye, then let the record lead from detail toward meaning."}
              </p>
            </div>

            <div className="grid gap-px overflow-hidden border border-primary/25 bg-primary/25 md:grid-cols-3">
              {pathwayCards.map((card) => (
                <Link key={card.href} href={card.href} className={`collection-constellation__card group ${isRTL ? "text-left" : "text-left"}`}>
                  <span className="collection-constellation__number">{card.index}</span>
                  <div className="relative z-10 mt-20">
                    <h3 className="text-3xl leading-tight text-secondary-foreground md:text-4xl">
                      {isRTL ? card.arTitle : card.enTitle}
                    </h3>
                    <p className="mt-4 max-w-sm text-base leading-7 text-secondary-foreground/70">
                      {isRTL ? card.arBody : card.enBody}
                    </p>
                    <span className="mt-9 inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-primary">
                      {isRTL ? "افتح المسار" : "OPEN PATH"}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={`relative overflow-hidden border-b border-primary/15 bg-card/35 px-4 py-24 md:py-32 ${isRTL ? "text-left" : "text-left"}`} aria-labelledby="reader-reflections-heading">
          <div className="container mx-auto">
            <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
              <div className={isRTL ? "lg:order-2" : ""}>
                <p className="ornament-line">{isRTL ? "ملاحظات موثقة" : "EDITOR-REVIEWED NOTES"}</p>
                <h2 id="reader-reflections-heading" className="section-heading mt-5 text-foreground">
                  {isRTL ? "انطباعات القرّاء" : "Reader reflections"}
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
                  {isRTL
                    ? "تُعرض هنا الملاحظات التي وافق عليها المحررون فقط، وباللغة التي كُتبت بها. لا تُنشئ هذه الصفحة شهادات أو مراجعات مسبقة."
                    : "Only editor-approved notes appear here, in the language in which they were written. This archive does not pre-populate testimonials or reviews."}
                </p>
              </div>

              <div className={`grid gap-4 sm:grid-cols-2 ${isRTL ? "lg:order-1" : ""}`} aria-live="polite">
                {reflectionsLoading ? (
                  <div className="luxury-panel col-span-full border-primary/25 bg-card/55 p-7 text-muted-foreground" aria-busy="true">
                    {isRTL ? "يجري تحميل الملاحظات المعتمدة…" : "Loading approved reflections…"}
                  </div>
                ) : reflectionsError ? (
                  <div className="luxury-panel col-span-full border-primary/30 bg-card/55 p-7">
                    <p className="text-muted-foreground">
                      {isRTL ? "تعذر تحميل الملاحظات المعتمدة مؤقتاً." : "Approved reflections are temporarily unavailable."}
                    </p>
                    <button
                      type="button"
                      onClick={() => void refetchReflections()}
                      className="mt-4 rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                    >
                      {isRTL ? "إعادة المحاولة" : "Try again"}
                    </button>
                  </div>
                ) : approvedReflections.length > 0 ? (
                  approvedReflections.map((reflection) => (
                    <blockquote key={reflection.id} className="luxury-panel flex min-h-56 flex-col border-primary/25 bg-card/55 p-7 text-foreground">
                      <Quote className={`h-6 w-6 text-primary/80 ${isRTL ? "self-end" : ""}`} aria-hidden="true" />
                      <p className="mt-5 flex-1 text-lg leading-8 text-foreground/90">{reflection.body}</p>
                      <footer className="mt-6 border-t border-primary/15 pt-4 text-xs font-semibold tracking-[0.14em] text-primary">
                        {isRTL ? "ملاحظة معتمدة" : "APPROVED REFLECTION"}
                      </footer>
                    </blockquote>
                  ))
                ) : (
                  <div className="luxury-panel col-span-full border-primary/25 bg-card/55 p-7 text-muted-foreground">
                    <p>{isRTL ? "لا توجد انطباعات معتمدة منشورة بهذه اللغة حتى الآن." : "No approved reflections are published in this language yet."}</p>
                    <Link href="/collection" className="mt-4 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline">
                      {isRTL ? "استكشف السجلات الموثقة" : "Explore documented records"}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className={`relative overflow-hidden border-b border-primary/15 bg-[color:var(--nocturne-olive)] px-4 py-24 text-secondary-foreground md:py-32 ${isRTL ? "text-left" : "text-left"}`} aria-labelledby="maison-film-heading">
          <div className="container relative z-10 mx-auto">
            <div className={`grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:items-center ${isRTL ? "lg:grid-cols-[1.16fr_0.84fr]" : ""}`}>
              <div className={isRTL ? "lg:order-2" : ""}>
                <p className="ornament-line text-primary">{isRTL ? "خاتمة الرحلة" : "A CLOSING STUDY"}</p>
                <h2 id="maison-film-heading" className="section-heading mt-5 text-secondary-foreground">
                  {isRTL ? "الفيلم الذي يعود إلى الصمت." : "A film that returns to silence."}
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-secondary-foreground/75">
                  {isRTL
                    ? "فيلم أرشيفي بتعليق عربي أصلي، يجمع بين دراسة تجريدية للحرفة والتسلسل السينمائي المعتمد في هذا الأرشيف. لا يضيف هذا الفيلم ادعاءات عن الملكية أو الجرد أو التوافر."
                    : "An Arabic-narrated archival study, bringing an abstract meditation on craft together with the approved cinematic sequence in this archive. The film adds no claim of ownership, inventory, or availability."}
                </p>
                <div className={`mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs leading-6 text-secondary-foreground/55 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span>{isRTL ? "المراجع العامة المعتمدة في المسار الختامي:" : "Public references credited in the closing pathway:"}</span>
                  <a href="https://youtu.be/P3mrmovvtn8w" target="_blank" rel="noreferrer" className="text-primary transition-colors hover:text-primary/75">
                    {isRTL ? "يا عمار الخير — Ajman Media" : "Ya Ammar Al Khair — Ajman Media"}
                  </a>
                  <a href="https://youtu.be/Air31Kly7Ys" target="_blank" rel="noreferrer" className="text-primary transition-colors hover:text-primary/75">
                    {isRTL ? "مرجع IFL Watches الخارجي" : "IFL Watches external reference"}
                  </a>
                </div>
              </div>
              <div className={`overflow-hidden rounded-xl border border-primary/35 bg-background/20 shadow-[0_28px_80px_rgba(0,0,0,0.34)] ${isRTL ? "lg:order-1" : ""}`}>
                <video
                  className="aspect-video w-full object-cover"
                  controls
                  preload="metadata"
                  playsInline
                  aria-describedby="maison-film-heading"
                >
                  <source src="/manus-storage/royal-horology-maison-film-arabic_5df9808d.mp4" type="video/mp4" />
                  {isRTL ? "المتصفح لا يدعم تشغيل الفيديو." : "Your browser does not support embedded video."}
                </video>
              </div>
            </div>
          </div>
        </section>
      </main>

      <NewsletterSignup />
      <Footer />
    </div>
  );
}
