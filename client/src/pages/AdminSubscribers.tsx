import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail, Trash2, Download, ArrowLeft, Search, Users
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSubscribers() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const { data: subscribers, isLoading, refetch } = trpc.admin.getSubscribers.useQuery(undefined, {
    retry: false,
    onError: () => {
      toast.error("Unauthorized — please log in");
      setLocation("/admin/login");
    },
  });

  const deleteMutation = trpc.admin.deleteSubscriber.useMutation({
    onSuccess: () => {
      toast.success("Subscriber removed");
      setConfirmDeleteId(null);
      refetch();
    },
    onError: () => toast.error("Failed to delete subscriber"),
  });

  const filtered = (subscribers ?? []).filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    if (!subscribers || subscribers.length === 0) return;
    const rows = [
      ["ID", "Email", "Status", "Source", "Subscribed At"],
      ...subscribers.map((s) => [
        s.id,
        s.email,
        s.status,
        s.source,
        new Date(s.createdAt).toLocaleDateString(),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="container max-w-5xl mx-auto pt-24 pb-16 px-4">
        {/* Header Row */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setLocation("/admin/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-gold-500 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gold-500 flex items-center gap-3">
              <Users className="w-8 h-8" />
              Subscribers
            </h1>
            <p className="text-gray-400 mt-1">
              {subscribers?.length ?? 0} total newsletter subscribers
            </p>
          </div>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="border-gold-500/40 text-gold-500 hover:bg-gold-500/10 flex items-center gap-2"
            disabled={!subscribers?.length}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email..."
            className="pl-10 bg-gray-900 border-gold-500/20 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Table */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gold-500/20 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12 text-gray-400">Loading subscribers...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 flex flex-col items-center gap-3">
              <Mail className="w-10 h-10 text-gold-500/30" />
              <p>{search ? "No subscribers match your search." : "No subscribers yet."}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-500/20 bg-black/30">
                  <th className="text-left px-6 py-4 text-gold-500 text-sm font-semibold">Email</th>
                  <th className="text-left px-6 py-4 text-gold-500 text-sm font-semibold">Status</th>
                  <th className="text-left px-6 py-4 text-gold-500 text-sm font-semibold">Source</th>
                  <th className="text-left px-6 py-4 text-gold-500 text-sm font-semibold">Subscribed</th>
                  <th className="text-right px-6 py-4 text-gold-500 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub, i) => (
                  <tr
                    key={sub.id}
                    className={`border-b border-gold-500/10 hover:bg-gold-500/5 transition-colors ${
                      i % 2 === 0 ? "bg-transparent" : "bg-black/20"
                    }`}
                  >
                    <td className="px-6 py-4 text-white text-sm font-medium">{sub.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          sub.status === "active"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{sub.source}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {confirmDeleteId === sub.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 text-xs"
                            onClick={() => deleteMutation.mutate({ id: sub.id })}
                            disabled={deleteMutation.isPending}
                          >
                            Confirm Delete
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-gray-400"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(sub.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded"
                          title="Remove subscriber"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
