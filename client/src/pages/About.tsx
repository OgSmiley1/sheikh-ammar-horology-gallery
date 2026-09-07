import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Landmark, ShieldCheck, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const officialBiographyUrl = "https://ajmanmedia.ae/en/crown-prince";

export default function About() {
  const { language, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const copy = isRTL
    ? {
        eyebrow: "نبذة موثّقة",
        title: "صاحب السمو الشيخ عمار بن حميد النعيمي",
        role: "ولي عهد عجمان — رئيس المجلس التنفيذي",
        introduction: "صفحة تحريرية تستند إلى السيرة المنشورة من المكتب الإعلامي لحكومة عجمان، وتفصل بوضوح بين السجل المؤسسي وسرد أرشيف الساعات في هذا الموقع.",
        biographyLabel: "المسار العام",
        biographyTitle: "قيادة تتصل بالمؤسسة والمجتمع",
        biography: "وُلِد صاحب السمو في إمارة عجمان في 31 مارس 1969. وعُيّن ولياً للعهد في 9 أكتوبر 1993، ثم تولّى رئاسة المجلس التنفيذي لإمارة عجمان في عام 2003. وتعرض السيرة الرسمية مساراً يركز على التحديث وجودة الحياة وتكامل الجهود الحكومية مع الحفاظ على الهوية والتراث.",
        institutionsLabel: "أدوار مؤسسية",
        institutionsTitle: "مسؤوليات مذكورة في السجل الرسمي",
        institutions: [
          ["مؤسسة حميد بن راشد النعيمي الخيرية", "الرئيس"],
          ["جامعة عجمان", "رئيس مجلس الأمناء"],
          ["مصرف عجمان", "رئيس مجلس الإدارة"],
        ],
        archiveLabel: "معيار الأرشيف",
        archiveTitle: "عن هذا الموقع",
        archive: "لا يقدم الموقع نفسه جرداً كاملاً أو إثباتاً للملكية. بل يوثق ساعات ظهرت علناً، مع فصل الظهور العام عن المواصفات المعتمدة من دور الساعات وعن أي ادعاء بالملكية. وتُراجع الإشارات والمصادر قبل أن تُعرض كسجل داخل الأرشيف.",
        source: "عرض المصدر الرسمي",
        collection: "استكشف المجموعة",
        constellation: "كوكبة الزمن",
        faqLabel: "أسئلة الأرشيف",
        faqTitle: "كيف تُقرأ هذه السجلات؟",
        faqs: [
          ["هل يمثل الموقع جرداً كاملاً لمجموعة خاصة؟", "لا. يوثق الموقع ظهورات علنية وإشارات مدعومة بالمصدر، ولا يقدم نفسه كجرد كامل أو كإثبات مستقل للملكية."],
          ["كيف تُراجع مواصفات الساعة؟", "تُقارن الإشارات العامة بمعلومات الدار المصنعة أو بمراجع متخصصة موثوقة قبل تقديمها كسجل تحريري."],
          ["ماذا يعني الظهور العلني؟", "يعني أن الساعة ظهرت في مادة منشورة أو صورة عامة. لا يتحول ذلك وحده إلى تأكيد دائم للملكية."],
          ["لماذا قد تكون بعض البيانات محدودة؟", "الدقة أهم من الاكتمال الظاهري. تُترك التفاصيل غير المدعومة خارج السجل إلى أن يتوافر مصدر مناسب."],
        ],
      }
    : {
        eyebrow: "A VERIFIED PROFILE",
        title: "His Highness Sheikh Ammar bin Humaid Al Nuaimi",
        role: "Crown Prince of Ajman — Chairman of the Executive Council",
        introduction: "An editorial profile grounded in the biography published by the Ajman Government Media Office, with a clear distinction between public institutional history and this site’s watch archive.",
        biographyLabel: "PUBLIC SERVICE",
        biographyTitle: "Leadership connected to institution and community",
        biography: "His Highness was born in the Emirate of Ajman on 31 March 1969. He was appointed Crown Prince on 9 October 1993 and assumed the chairmanship of the Ajman Executive Council in 2003. The official biography describes a public-service path centred on modernisation, quality of life, and government integration while preserving heritage and identity.",
        institutionsLabel: "INSTITUTIONAL ROLES",
        institutionsTitle: "Responsibilities named in the official profile",
        institutions: [
          ["Humaid bin Rashid Al Nuaimi Charitable Foundation", "Chairman"],
          ["Ajman University", "Chairman, Board of Trustees"],
          ["Ajman Bank", "Chairman, Board of Directors"],
        ],
        archiveLabel: "ARCHIVE STANDARD",
        archiveTitle: "About this website",
        archive: "This website does not present a complete inventory or proof of ownership. It documents timepieces publicly sighted in credible sources, separating public appearances from maison specifications and any claim of ownership. References are reviewed before a timepiece is framed as a record within the archive.",
        source: "View official source",
        collection: "Explore the Collection",
        constellation: "Constellation of Time",
        faqLabel: "ARCHIVE QUESTIONS",
        faqTitle: "How should these records be read?",
        faqs: [
          ["Is this website a complete private inventory?", "No. It documents publicly observed appearances and source-supported leads; it is not presented as a complete inventory or independent proof of ownership."],
          ["How are watch specifications reviewed?", "Public leads are compared with maison information or trusted specialist references before they are presented as editorial records."],
          ["What does a public appearance mean?", "It means the timepiece appeared in a published item or public image. That alone does not become a continuing confirmation of ownership."],
          ["Why can some records be limited?", "Accuracy matters more than apparent completeness. Unsupported detail stays outside the record until a suitable source is available."],
        ],
      };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <main>
        <section className="page-hero border-b border-primary/15 px-6 pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="absolute inset-0 -z-10 opacity-45 [background-image:radial-gradient(circle_at_center,rgba(168,139,87,.35)_0_1px,transparent_1.5px)] [background-size:53px_53px]" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.94fr_1.06fr] lg:gap-20">
            <div className={`relative lg:order-2 ${isRTL ? "lg:text-right" : "lg:text-left"}`}>
              <p className={`ornament-line mb-5 flex items-center gap-2 ${isRTL ? "lg:justify-end" : ""}`}><Sparkles className="h-4 w-4" />{copy.eyebrow}</p>
              <h1 className="sheikh-name max-w-4xl text-gold-gradient">{copy.title}</h1>
              <p className="mt-6 text-xl text-primary md:text-2xl" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{copy.role}</p>
              <p className="sheikh-bio mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">{copy.introduction}</p>
              <div className={`mt-9 flex flex-wrap gap-3 ${isRTL ? "lg:justify-end" : ""}`}>
                <a href={officialBiographyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-primary/50 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10">{copy.source}<Arrow className="h-4 w-4" /></a>
                <Link href="/constellation" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">{copy.constellation}<Arrow className="h-4 w-4" /></Link>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[31rem] lg:order-1">
              <div className="image-corner-accent absolute -inset-4 z-0 border border-primary/25" />
              <img src="/sheikh-portrait-1.jpeg" alt="" className="relative aspect-[4/5] w-full object-cover object-top shadow-[0_26px_75px_rgba(0,0,0,.45)]" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/85 to-transparent" />
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[.9fr_1.1fr] lg:py-28">
          <div className={isRTL ? "lg:text-right" : "lg:text-left"}>
            <p className="overline mb-4 text-primary">{copy.biographyLabel}</p>
            <h2 className="section-heading text-4xl md:text-5xl">{copy.biographyTitle}</h2>
          </div>
          <p className="sheikh-bio text-lg leading-8 text-muted-foreground">{copy.biography}</p>
        </section>

        <section className="border-y border-primary/15 bg-card/35 px-6 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className={isRTL ? "text-right" : "text-left"}>
              <p className="overline mb-4 text-primary">{copy.institutionsLabel}</p>
              <h2 className="section-heading text-4xl md:text-5xl">{copy.institutionsTitle}</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {copy.institutions.map(([institution, role], index) => (
                <article key={institution} className={`luxury-panel p-7 ${isRTL ? "text-right" : "text-left"}`}>
                  <Landmark className="h-5 w-5 text-primary" aria-hidden="true" />
                  <p className="mt-8 text-xs font-semibold tracking-[.16em] text-primary">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-2xl leading-tight" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{institution}</h3>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{role}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_.9fr] lg:py-28">
          <div className={isRTL ? "lg:order-2 lg:text-right" : "lg:text-left"}>
            <p className="overline mb-4 text-primary">{copy.archiveLabel}</p>
            <h2 className="section-heading text-4xl md:text-5xl">{copy.archiveTitle}</h2>
            <p className="sheikh-bio mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{copy.archive}</p>
            <Link href="/collection" className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">{copy.collection}<Arrow className="h-4 w-4" /></Link>
          </div>
          <div className={`luxury-panel relative overflow-hidden p-9 ${isRTL ? "lg:order-1 lg:text-right" : "text-left"}`}>
            <div className="archive-quote-glow absolute inset-0" />
            <ShieldCheck className="relative h-10 w-10 text-primary" aria-hidden="true" />
            <blockquote className="relative mt-10 text-3xl leading-tight md:text-4xl" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{isRTL ? "«المعلومة الدقيقة جزء من فخامة الحكاية.»" : "“Accuracy is part of the luxury of the story.”"}</blockquote>
          </div>
        </section>

        <section className="border-t border-primary/15 bg-card/35 px-6 py-20 lg:py-28">
          <div className="mx-auto max-w-5xl">
            <div className={isRTL ? "text-right" : "text-left"}>
              <p className="overline mb-4 text-primary">{copy.faqLabel}</p>
              <h2 className="section-heading text-4xl md:text-5xl">{copy.faqTitle}</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {copy.faqs.map(([question, answer], index) => (
                <details key={question} className={`group luxury-panel p-0 ${isRTL ? "text-right" : "text-left"}`}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-7 text-xl leading-snug marker:hidden" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>
                    <span>{question}</span>
                    <span className="shrink-0 text-primary transition-transform duration-300 group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="border-t border-primary/15 px-7 pb-7 pt-5 text-sm leading-7 text-muted-foreground">{answer}</p>
                  <span className={`absolute top-5 text-xs font-semibold tracking-[.16em] text-primary/60 ${isRTL ? "left-5" : "right-5"}`}>{String(index + 1).padStart(2, "0")}</span>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
