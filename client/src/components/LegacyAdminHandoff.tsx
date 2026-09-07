import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Database, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function LegacyAdminHandoff() {
  const { isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const copy = isRTL
    ? {
        eyebrow: "مدخل إداري سابق",
        title: "توجد الإدارة الموثّقة في مساحة العمل النشطة.",
        description: "لم يعد هذا المسار يعرض نماذج تجريبية أو إحصاءات غير موثّقة. انتقل إلى مساحة الإدارة النشطة لإدارة السجلات الحالية من قاعدة البيانات.",
        openTitle: "فتح مساحة العمل النشطة",
        openBody: "إدارة الساعات والمشتركين وسجلات الاستيراد في لوحة الإدارة الحالية.",
        openAction: "متابعة إلى الإدارة",
        returnTitle: "العودة إلى الأرشيف",
        returnBody: "استعرض الأرشيف التحريري ثنائي اللغة وسجلات الساعات المنشورة فيه.",
        returnAction: "عرض الأرشيف",
      }
    : {
        eyebrow: "Legacy admin entry",
        title: "Verified administration lives in the active workspace.",
        description: "This route no longer shows placeholder controls or unsupported analytics. Continue to the active administrative workspace to manage current database-backed records.",
        openTitle: "Open active workspace",
        openBody: "Manage current watch, subscriber, and import records from the live administration dashboard.",
        openAction: "Continue to administration",
        returnTitle: "Return to the archive",
        returnBody: "Explore the bilingual editorial archive and its source-bounded watch records.",
        returnAction: "View archive",
      };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <main className="container max-w-4xl px-4 py-20 md:py-28">
        <section className="luxury-panel overflow-hidden border-primary/25 p-0">
          <div className="border-b border-primary/15 bg-card/70 p-8 md:p-12">
            <div className="flex items-center gap-3 text-primary">
              <ShieldCheck className="h-8 w-8" aria-hidden="true" />
              <p className="overline">{copy.eyebrow}</p>
            </div>
            <h1 className="section-heading mt-7 text-4xl leading-tight md:text-5xl">{copy.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{copy.description}</p>
          </div>
          <div className="grid gap-4 p-8 md:grid-cols-2 md:p-12">
            <Link href="/admin/login-mvp" className="group rounded-xl border border-primary/30 bg-background p-6 transition-colors hover:bg-primary/10">
              <Database className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-5 text-2xl" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{copy.openTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.openBody}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">{copy.openAction}<Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" /></span>
            </Link>
            <Link href="/" className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
              <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-5 text-2xl" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{copy.returnTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.returnBody}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">{copy.returnAction}<Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" /></span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
