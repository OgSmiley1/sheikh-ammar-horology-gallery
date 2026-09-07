import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { MessageSquare, Send } from "lucide-react";
import { useState } from "react";

export function WatchComments({ watchId }: { watchId: number }) {
  const { language, isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"pending" | "error" | null>(null);
  const utils = trpc.useUtils();
  const { data: comments = [] } = trpc.comments.getApprovedByWatch.useQuery({ watchId, language });
  const submit = trpc.comments.submit.useMutation({
    onSuccess: async () => {
      setBody("");
      setStatus("pending");
      await utils.comments.getApprovedByWatch.invalidate({ watchId, language });
    },
    onError: () => setStatus("error"),
  });

  const copy = isRTL
    ? {
        eyebrow: "مساهمات الزوار",
        title: "أضف ملاحظة على هذا السجل",
        body: "تخضع كل المساهمات لمراجعة تحريرية قبل ظهورها علناً. لا تُنشر أي مراجعات أو شهادات مسبقة.",
        placeholder: "اكتب ملاحظة موجزة ومحترمة…",
        submit: "إرسال للمراجعة",
        signIn: "سجّل الدخول لإرسال ملاحظة",
        pending: "تم إرسال ملاحظتك للمراجعة التحريرية.",
        error: "تعذر إرسال الملاحظة الآن. حاول مرة أخرى.",
        approved: "ملاحظات معتمدة",
        empty: "لا توجد ملاحظات معتمدة بهذه اللغة حتى الآن.",
      }
    : {
        eyebrow: "VISITOR REFLECTIONS",
        title: "Add a note to this record",
        body: "Every contribution is reviewed by an editor before public display. No reviews or testimonials are pre-populated.",
        placeholder: "Write a concise, respectful note…",
        submit: "Send for review",
        signIn: "Sign in to add a note",
        pending: "Your note has been submitted for editorial review.",
        error: "Your note could not be submitted right now. Please try again.",
        approved: "Approved reflections",
        empty: "No approved notes in this language yet.",
      };

  const handleSubmit = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    if (body.trim().length < 2) return;
    submit.mutate({ watchId, body: body.trim(), language });
  };

  return (
    <section className="border-t border-primary/15 bg-card/20 px-4 py-20" aria-labelledby="visitor-reflections-title">
      <div className="container mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={isRTL ? "lg:text-right" : "lg:text-left"}>
          <p className="ornament-line mb-5">{copy.eyebrow}</p>
          <h2 id="visitor-reflections-title" className="section-heading text-4xl">{copy.title}</h2>
          <p className="sheikh-bio mt-5 max-w-xl text-muted-foreground">{copy.body}</p>
        </div>
        <div className="luxury-panel p-6 sm:p-8">
          <label className="mb-3 block text-sm font-semibold text-foreground" htmlFor="watch-comment">{copy.title}</label>
          <textarea
            id="watch-comment"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={800}
            rows={4}
            placeholder={copy.placeholder}
            className="w-full resize-y rounded-lg border border-primary/25 bg-background p-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <div className={`mt-4 flex flex-wrap items-center gap-3 ${isRTL ? "justify-start" : "justify-end"}`}>
            <span className="text-xs text-muted-foreground">{body.length}/800</span>
            <button type="button" onClick={handleSubmit} disabled={submit.isPending || (isAuthenticated && body.trim().length < 2)} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85 disabled:cursor-not-allowed disabled:opacity-60">
              {isAuthenticated ? <Send className="h-4 w-4" aria-hidden="true" /> : <MessageSquare className="h-4 w-4" aria-hidden="true" />}
              {isAuthenticated ? copy.submit : copy.signIn}
            </button>
          </div>
          {status && <p className={`mt-4 text-sm ${status === "error" ? "text-destructive" : "text-primary"}`} role="status">{status === "pending" ? copy.pending : copy.error}</p>}
        </div>
      </div>
      <div className="container mx-auto mt-12 max-w-5xl">
        <h3 className="mb-5 text-2xl text-primary" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{copy.approved}</h3>
        {comments.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {comments.map((comment) => <article key={comment.id} className="spec-card rounded-lg p-5"><p className="leading-relaxed text-foreground">{comment.body}</p></article>)}
          </div>
        ) : <p className="text-muted-foreground">{copy.empty}</p>}
      </div>
    </section>
  );
}
