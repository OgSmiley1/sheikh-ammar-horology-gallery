import { FormEvent, useState } from "react";
import { Mail, Send, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";

type ContactState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
};

const initialState: ContactState = { name: "", email: "", subject: "", message: "", website: "" };

export default function Contact() {
  const { language, isRTL } = useLanguage();
  const [form, setForm] = useState<ContactState>(initialState);
  const [error, setError] = useState<"invalid" | "failed" | "">("");
  const [sent, setSent] = useState(false);
  const copy = isRTL
    ? {
        eyebrow: "مراسلات الأرشيف",
        title: "ابدأ محادثة مدروسة.",
        intro: "للاستفسارات التحريرية أو تصحيحات المصدر أو المقترحات المتعلقة بالسجل المنشور، اترك رسالة واضحة وسيراجعها فريق الأرشيف.",
        note: "لا يؤكد هذا النموذج ملكية أي ساعة أو يطلب أي معلومات مالية.",
        name: "الاسم",
        email: "البريد الإلكتروني",
        subject: "الموضوع — اختياري",
        message: "الرسالة",
        namePlaceholder: "اسمك الكامل",
        subjectPlaceholder: "مثلًا: تصحيح أو مصدر محتمل",
        messagePlaceholder: "اكتب رسالتك بوضوح، مع ذكر المرجع أو الرابط إن وجد.",
        submit: "إرسال الرسالة",
        sending: "جارٍ الإرسال...",
        successTitle: "وصلت رسالتك إلى سجل المراجعة.",
        success: "شكرًا لاهتمامك بالدقة. سيُراجع فريق الأرشيف رسالتك ضمن السياق التحريري المناسب.",
        privacy: "تُستخدم بيانات الاتصال هذه لمراجعة هذه المراسلة فقط.",
        invalid: "يرجى إدخال الاسم وبريد إلكتروني صالح ورسالة لا تقل عن 10 أحرف.",
        failed: "تعذر إرسال الرسالة الآن. يرجى المحاولة مجددًا لاحقًا.",
      }
    : {
        eyebrow: "Archive correspondence",
        title: "Begin a considered conversation.",
        intro: "For editorial enquiries, source corrections, or submissions relevant to the published archive, leave a clear note for the archive team to review.",
        note: "This form does not verify ownership of any timepiece and does not request financial information.",
        name: "Name",
        email: "Email",
        subject: "Subject — optional",
        message: "Message",
        namePlaceholder: "Your full name",
        subjectPlaceholder: "For example: a source correction or lead",
        messagePlaceholder: "Write your message clearly, including a reference or link where relevant.",
        submit: "Send message",
        sending: "Sending...",
        successTitle: "Your note has reached the review register.",
        success: "Thank you for your care with accuracy. The archive team will consider your message in its editorial context.",
        privacy: "These contact details are used only to review this correspondence.",
        invalid: "Please enter your name, a valid email address, and a message of at least 10 characters.",
        failed: "Your message could not be sent at this time. Please try again later.",
      };

  const submit = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSent(true);
      setForm(initialState);
      setError("");
    },
    onError: () => setError("failed"),
  });

  const update = (key: keyof ContactState, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (form.name.trim().length < 2 || !validEmail || form.message.trim().length < 10) {
      setError("invalid");
      return;
    }
    submit.mutate({ ...form, language });
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <main className="pt-28 sm:pt-32">
        <section className="container mx-auto px-6 pb-20 lg:px-8 lg:pb-28">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="luxury-panel relative overflow-hidden p-8 sm:p-10">
              <div className="image-corner-accent" aria-hidden="true" />
              <span className="ornament-line">{copy.eyebrow}</span>
              <h1 className="sheikh-title mt-6 text-4xl sm:text-5xl">{copy.title}</h1>
              <p className="sheikh-bio mt-6 text-muted-foreground">{copy.intro}</p>
              <div className="mt-8 flex items-start gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <p>{copy.note}</p>
              </div>
            </div>

            <section className="luxury-panel p-6 sm:p-10" aria-labelledby="contact-form-title">
              <div className="mb-7 flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 id="contact-form-title" className="text-xl font-semibold text-foreground">{copy.eyebrow}</h2>
              </div>
              {sent ? (
                <div className="status-success-surface rounded-xl border p-7" role="status">
                  <h2 className="status-success-emphasis text-xl font-semibold">{copy.successTitle}</h2>
                  <p className="status-success-text mt-3 leading-7">{copy.success}</p>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                  <label className="block text-sm font-medium text-foreground">
                    {copy.name}
                    <input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder={copy.namePlaceholder} className="mt-2 h-12 w-full rounded-md border border-input bg-card px-4 text-foreground outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25" autoComplete="name" />
                  </label>
                  <label className="block text-sm font-medium text-foreground">
                    {copy.email}
                    <input value={form.email} onChange={(event) => update("email", event.target.value)} type="email" dir="ltr" placeholder="name@example.com" className="mt-2 h-12 w-full rounded-md border border-input bg-card px-4 text-foreground outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25" autoComplete="email" />
                  </label>
                  <label className="block text-sm font-medium text-foreground">
                    {copy.subject}
                    <input value={form.subject} onChange={(event) => update("subject", event.target.value)} placeholder={copy.subjectPlaceholder} className="mt-2 h-12 w-full rounded-md border border-input bg-card px-4 text-foreground outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25" />
                  </label>
                  <label className="block text-sm font-medium text-foreground">
                    {copy.message}
                    <textarea value={form.message} onChange={(event) => update("message", event.target.value)} placeholder={copy.messagePlaceholder} rows={6} className="mt-2 w-full resize-y rounded-md border border-input bg-card px-4 py-3 text-foreground outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25" />
                  </label>
                  <input value={form.website} onChange={(event) => update("website", event.target.value)} className="absolute -left-[10000px] h-px w-px overflow-hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                  {error && <p className="status-danger-text text-sm" role="alert">{copy[error]}</p>}
                  <Button type="submit" disabled={submit.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Send className={isRTL ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} aria-hidden="true" />
                    {submit.isPending ? copy.sending : copy.submit}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">{copy.privacy}</p>
                </form>
              )}
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
