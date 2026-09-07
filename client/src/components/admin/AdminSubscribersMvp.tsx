import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Mail } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminSubscribersMvp() {
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const copy = isRTL
    ? {
        title: "المشتركون في النشرة",
        total: "الإجمالي",
        search: "ابحث بالبريد الإلكتروني أو الاسم...",
        removed: "تمت إزالة المشترك.",
        removeFailed: "تعذر إزالة المشترك.",
        confirmRemove: "هل تريد إزالة {{email}} من النشرة؟",
        subscribed: "اشترك في",
        noResults: "لا يوجد مشتركون مطابقون.",
        noSubscribers: "لا يوجد مشتركون بعد.",
      }
    : {
        title: "Newsletter Subscribers",
        total: "Total",
        search: "Search by email or name...",
        removed: "Subscriber removed.",
        removeFailed: "Failed to remove subscriber.",
        confirmRemove: "Remove {{email}} from newsletter?",
        subscribed: "Subscribed",
        noResults: "No subscribers found.",
        noSubscribers: "No subscribers yet.",
      };

  const { data: subscribers, isLoading, refetch } = trpc.adminMvp.subscribers.getList.useQuery({
    limit: 50,
    offset: 0,
  });

  const unsubscribeMutation = trpc.adminMvp.subscribers.unsubscribe.useMutation({
    onSuccess: () => {
      toast.success(copy.removed);
      refetch();
    },
    onError: () => {
      toast.error(copy.removeFailed);
    },
  });

  const handleUnsubscribe = async (email: string) => {
    if (confirm(copy.confirmRemove.replace("{{email}}", email))) {
      await unsubscribeMutation.mutateAsync({ email });
    }
  };

  const filteredSubscribers = subscribers?.filter(
    (sub: any) =>
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.name && sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground">{copy.title}</h2>
        <div className="text-sm text-muted-foreground">
          {copy.total}: <span className="font-semibold">{subscribers?.length || 0}</span>
        </div>
      </div>

      <Input
        placeholder={copy.search}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border-primary/30"
      />

      <div className="space-y-2">
        {filteredSubscribers && filteredSubscribers.length > 0 ? (
          filteredSubscribers.map((subscriber: any) => (
            <Card key={subscriber.id} className="border-primary/20 bg-card">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">{subscriber.email}</span>
                    </div>
                    {subscriber.name && (
                      <p className={`${isRTL ? "mr-6" : "ml-6"} text-sm text-muted-foreground`}>{subscriber.name}</p>
                    )}
                    <p className={`${isRTL ? "mr-6" : "ml-6"} text-xs text-muted-foreground`}>
                      {copy.subscribed}:{" "}
                      {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnsubscribe(subscriber.email)}
                    disabled={unsubscribeMutation.isPending}
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-primary/20 bg-card">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? copy.noResults : copy.noSubscribers}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
