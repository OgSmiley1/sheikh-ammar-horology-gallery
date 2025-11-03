import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Crown,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminWatches() {
  const [, setLocation] = useLocation();
  const [adminSession, setAdminSession] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Check admin authentication
  useEffect(() => {
    const session = localStorage.getItem("adminSession");
    if (!session) {
      toast.error("Please login to access admin panel");
      setLocation("/admin/login");
      return;
    }
    try {
      const parsed = JSON.parse(session);
      setAdminSession(parsed);
    } catch (error) {
      toast.error("Invalid session");
      setLocation("/admin/login");
    }
  }, []);

  // Fetch all watches
  const { data: watches, refetch } = trpc.watches.getAll.useQuery(undefined, {
    enabled: !!adminSession,
  });

  // Delete watch mutation
  const deleteMutation = trpc.admin.deleteWatch.useMutation({
    onSuccess: () => {
      toast.success("Watch deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete watch");
    },
  });

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate({ id });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    toast.success("Logged out successfully");
    setLocation("/admin/login");
  };

  if (!adminSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold-500 text-xl">Loading...</div>
      </div>
    );
  }

  // Filter watches based on search
  const filteredWatches = watches?.filter((watch: any) =>
    watch.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    watch.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    watch.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-black border-b border-gold-500/30 px-6 py-4">
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation("/admin/dashboard")}
              variant="ghost"
              className="text-gray-400 hover:text-gold-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Crown className="w-8 h-8 text-gold-500" />
              <div>
                <h1 className="text-2xl font-bold text-gold-500">Manage Watches</h1>
                <p className="text-sm text-gray-400">Add, edit, or remove watches from the collection</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-300">Welcome back,</p>
              <p className="text-gold-500 font-medium">{adminSession.username}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-6 py-8">
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search watches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gold-500/30 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <Button
            onClick={() => setLocation("/admin/watches/new")}
            className="bg-gold-500 hover:bg-gold-600 text-black font-bold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Watch
          </Button>
        </div>

        {/* Watches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWatches && filteredWatches.length > 0 ? (
            filteredWatches.map((watch: any) => (
              <div
                key={watch.id}
                className="bg-gradient-to-br from-gray-900 to-black border border-gold-500/30 rounded-lg overflow-hidden hover:border-gold-500/60 transition-all duration-300"
              >
                {/* Watch Image */}
                {watch.mainImageUrl && (
                  <div className="aspect-square bg-gray-800 overflow-hidden">
                    <img
                      src={watch.mainImageUrl}
                      alt={watch.nameEn}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Watch Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gold-500 mb-1">
                    {watch.nameEn}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">{watch.nameAr}</p>
                  <p className="text-gray-500 text-xs mb-3">Ref: {watch.referenceNumber}</p>

                  {watch.estimatedValue && (
                    <p className="text-gray-300 font-medium mb-4">
                      ${watch.estimatedValue.toLocaleString()}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setLocation(`/admin/watches/edit/${watch.id}`)}
                      variant="outline"
                      className="flex-1 border-gold-500/30 text-gold-500 hover:bg-gold-500/10"
                      size="sm"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(watch.id, watch.nameEn)}
                      variant="outline"
                      className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery ? "No watches found matching your search" : "No watches in the collection yet"}
              </p>
              <Button
                onClick={() => setLocation("/admin/watches/new")}
                className="mt-4 bg-gold-500 hover:bg-gold-600 text-black"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Watch
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
