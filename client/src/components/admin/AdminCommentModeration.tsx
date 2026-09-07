import { Check, Loader2, MessageSquare, X } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";

export default function AdminCommentModeration() {
  const { isRTL } = useLanguage();
  const { data: comments = [], isLoading, refetch } = trpc.adminMvp.comments.getPending.useQuery({ limit: 50 });
  const moderate = trpc.adminMvp.comments.moderate.useMutation({
    onSuccess: async (_, variables) => {
      toast.success(isRTL ? (variables.status === "approved" ? "تمت الموافقة على الملاحظة." : "تم رفض الملاحظة.") : (variables.status === "approved" ? "Note approved." : "Note rejected."));
      await refetch();
    },
    onError: () => toast.error(isRTL ? "تعذر تحديث حالة الملاحظة." : "The note status could not be updated."),
  });
  const copy = isRTL ? { empty: "لا توجد ملاحظات معلقة.", approved: "موافقة", rejected: "رفض", pending: "ملاحظات بانتظار المراجعة" } : { empty: "No comments are awaiting review.", approved: "Approve", rejected: "Reject", pending: "Pending visitor notes" };

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-primary" />;
  return <section aria-label={copy.pending}><p className="mb-5 text-sm text-muted-foreground">{copy.pending}</p>{comments.length ? <div className="space-y-4">{comments.map((comment) => <article key={comment.id} className={`luxury-panel p-5 ${isRTL ? "text-right" : "text-left"}`}><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{isRTL ? comment.watchNameAr : comment.watchNameEn}</p><p className="mt-3 leading-relaxed text-foreground">{comment.body}</p><div className={`mt-5 flex gap-3 ${isRTL ? "justify-start" : "justify-end"}`}><button type="button" onClick={() => moderate.mutate({ id: comment.id, status: "rejected" })} disabled={moderate.isPending} className="inline-flex items-center gap-2 rounded-md border border-destructive/40 px-4 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"><X className="h-4 w-4" />{copy.rejected}</button><button type="button" onClick={() => moderate.mutate({ id: comment.id, status: "approved" })} disabled={moderate.isPending} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85"><Check className="h-4 w-4" />{copy.approved}</button></div></article>)}</div> : <div className="flex items-center gap-3 rounded-lg border border-primary/15 bg-muted/30 p-5 text-muted-foreground"><MessageSquare className="h-5 w-5 text-primary" />{copy.empty}</div>}</section>;
}
