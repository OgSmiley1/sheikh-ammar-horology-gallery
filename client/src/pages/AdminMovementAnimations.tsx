import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Edit, Trash2, Layers, UploadCloud, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

type AnimationType = "rotate" | "oscillate" | "pulse" | "none";
type RotationDirection = "cw" | "ccw";

interface LayerForm {
  layerName: string;
  layerNameAr: string;
  imageUrl: string;
  imageKey: string;
  zIndex: number;
  animationType: AnimationType;
  animationDuration: string;
  animationDelay: string;
  rotationDirection: RotationDirection;
  isActive: boolean;
}

const defaultForm: LayerForm = {
  layerName: "",
  layerNameAr: "",
  imageUrl: "",
  imageKey: "",
  zIndex: 0,
  animationType: "none",
  animationDuration: "4s",
  animationDelay: "0s",
  rotationDirection: "cw",
  isActive: true,
};

export default function AdminMovementAnimations() {
  const { watchId } = useParams<{ watchId: string }>();
  const [, setLocation] = useLocation();
  const [adminSession, setAdminSession] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<LayerForm>(defaultForm);
  const [uploading, setUploading] = useState(false);

  const watchIdNum = parseInt(watchId ?? "0", 10);

  useEffect(() => {
    const session = localStorage.getItem("adminSession");
    if (!session) {
      toast.error("Please login to access admin panel");
      setLocation("/admin/login");
      return;
    }
    try {
      setAdminSession(JSON.parse(session));
    } catch {
      setLocation("/admin/login");
    }
  }, []);

  const { data: watch } = trpc.watches.getAll.useQuery(undefined, {
    enabled: !!adminSession,
    select: (watches) => watches.find((w) => w.id === watchIdNum),
  });

  const { data: layers, refetch } = trpc.admin.getMovementLayers.useQuery(
    { watchId: watchIdNum },
    { enabled: !!adminSession && watchIdNum > 0 }
  );

  const createMutation = trpc.admin.createMovementLayer.useMutation({
    onSuccess: () => {
      toast.success("Layer created successfully");
      setShowForm(false);
      setForm(defaultForm);
      refetch();
    },
    onError: (e) => toast.error(e.message || "Failed to create layer"),
  });

  const updateMutation = trpc.admin.updateMovementLayer.useMutation({
    onSuccess: () => {
      toast.success("Layer updated");
      setEditingId(null);
      setShowForm(false);
      setForm(defaultForm);
      refetch();
    },
    onError: (e) => toast.error(e.message || "Failed to update layer"),
  });

  const deleteMutation = trpc.admin.deleteMovementLayer.useMutation({
    onSuccess: () => {
      toast.success("Layer deleted");
      refetch();
    },
    onError: (e) => toast.error(e.message || "Failed to delete layer"),
  });

  const reorderMutation = trpc.admin.reorderMovementLayers.useMutation({
    onSuccess: () => refetch(),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload-admin", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const { url, key } = await res.json();
      setForm((f) => ({ ...f, imageUrl: url, imageKey: key }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!form.layerName || !form.imageUrl) {
      toast.error("Layer name and image are required");
      return;
    }
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate({ watchId: watchIdNum, ...form });
    }
  };

  const handleEdit = (layer: NonNullable<typeof layers>[number]) => {
    setForm({
      layerName: layer.layerName,
      layerNameAr: layer.layerNameAr ?? "",
      imageUrl: layer.imageUrl,
      imageKey: layer.imageKey,
      zIndex: layer.zIndex,
      animationType: layer.animationType as AnimationType,
      animationDuration: layer.animationDuration,
      animationDelay: layer.animationDelay,
      rotationDirection: layer.rotationDirection as RotationDirection,
      isActive: layer.isActive,
    });
    setEditingId(layer.id);
    setShowForm(true);
  };

  const handleMoveUp = (idx: number) => {
    if (!layers || idx === 0) return;
    const updated = [...layers].map((l, i) => ({ id: l.id, zIndex: i }));
    // Swap zIndex values with previous
    const tmp = updated[idx].zIndex;
    updated[idx].zIndex = updated[idx - 1].zIndex;
    updated[idx - 1].zIndex = tmp;
    reorderMutation.mutate({ layers: updated });
  };

  const handleMoveDown = (idx: number) => {
    if (!layers || idx === layers.length - 1) return;
    const updated = [...layers].map((l, i) => ({ id: l.id, zIndex: i }));
    const tmp = updated[idx].zIndex;
    updated[idx].zIndex = updated[idx + 1].zIndex;
    updated[idx + 1].zIndex = tmp;
    reorderMutation.mutate({ layers: updated });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#d4af37]/20 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/admin/watches")}
              className="p-2 rounded-lg text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#d4af37]" />
                Movement Engineering
              </h1>
              {watch && (
                <p className="text-sm text-gray-500">{watch.nameEn} — {watch.referenceNumber}</p>
              )}
            </div>
          </div>
          <Button
            onClick={() => { setForm(defaultForm); setEditingId(null); setShowForm(true); }}
            className="bg-[#d4af37] hover:bg-[#b8961f] text-black font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Layer
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Add / Edit Form */}
        {showForm && (
          <div className="mb-8 bg-gray-900/60 border border-[#d4af37]/20 rounded-xl p-6">
            <h2 className="text-[#d4af37] font-semibold mb-6">
              {editingId ? "Edit Layer" : "New Movement Layer"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Layer name EN */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
                  Layer Name (EN) *
                </label>
                <Input
                  value={form.layerName}
                  onChange={(e) => setForm((f) => ({ ...f, layerName: e.target.value }))}
                  placeholder="e.g. Main Plate"
                  className="bg-black border-gray-700 text-white"
                />
              </div>

              {/* Layer name AR */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
                  Layer Name (AR)
                </label>
                <Input
                  value={form.layerNameAr}
                  onChange={(e) => setForm((f) => ({ ...f, layerNameAr: e.target.value }))}
                  placeholder="اسم الطبقة بالعربية"
                  dir="rtl"
                  className="bg-black border-gray-700 text-white font-arabic"
                />
              </div>

              {/* zIndex */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
                  Z-Index (layer order)
                </label>
                <Input
                  type="number"
                  value={form.zIndex}
                  onChange={(e) => setForm((f) => ({ ...f, zIndex: parseInt(e.target.value) || 0 }))}
                  className="bg-black border-gray-700 text-white"
                />
              </div>

              {/* Animation type */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
                  Animation Type
                </label>
                <select
                  value={form.animationType}
                  onChange={(e) => setForm((f) => ({ ...f, animationType: e.target.value as AnimationType }))}
                  className="w-full bg-black border border-gray-700 text-white rounded-md px-3 py-2 text-sm"
                >
                  <option value="none">None (static)</option>
                  <option value="rotate">Rotate (continuous spin)</option>
                  <option value="oscillate">Oscillate (back-and-forth)</option>
                  <option value="pulse">Pulse (scale breathe)</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
                  Animation Duration
                </label>
                <Input
                  value={form.animationDuration}
                  onChange={(e) => setForm((f) => ({ ...f, animationDuration: e.target.value }))}
                  placeholder="4s"
                  className="bg-black border-gray-700 text-white"
                />
              </div>

              {/* Delay */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
                  Animation Delay
                </label>
                <Input
                  value={form.animationDelay}
                  onChange={(e) => setForm((f) => ({ ...f, animationDelay: e.target.value }))}
                  placeholder="0s"
                  className="bg-black border-gray-700 text-white"
                />
              </div>

              {/* Rotation direction */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
                  Rotation Direction
                </label>
                <select
                  value={form.rotationDirection}
                  onChange={(e) => setForm((f) => ({ ...f, rotationDirection: e.target.value as RotationDirection }))}
                  className="w-full bg-black border border-gray-700 text-white rounded-md px-3 py-2 text-sm"
                >
                  <option value="cw">Clockwise</option>
                  <option value="ccw">Counter-clockwise</option>
                </select>
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-[#d4af37]"
                />
                <label htmlFor="isActive" className="text-sm text-gray-300 cursor-pointer">
                  Active (visible in visualization)
                </label>
              </div>
            </div>

            {/* Image upload */}
            <div className="mt-6">
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">
                Layer Image *
              </label>
              {form.imageUrl && (
                <div className="mb-3 w-24 h-24 rounded-lg overflow-hidden border border-gray-700">
                  <img src={form.imageUrl} alt="Layer preview" className="w-full h-full object-contain bg-gray-900" />
                </div>
              )}
              <label className="flex items-center gap-3 px-4 py-3 bg-black border border-dashed border-gray-600 hover:border-[#d4af37]/50 rounded-lg cursor-pointer transition-colors">
                <UploadCloud className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-400">
                  {uploading ? "Uploading..." : "Upload PNG/WebP layer image"}
                </span>
                <input
                  type="file"
                  accept="image/png,image/webp,image/jpeg"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <p className="text-xs text-gray-600 mt-1">
                Tip: Use PNG with transparency for layered movement components
              </p>
            </div>

            {/* Form actions */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-[#d4af37] hover:bg-[#b8961f] text-black font-semibold"
              >
                {editingId ? "Save Changes" : "Create Layer"}
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowForm(false); setEditingId(null); setForm(defaultForm); }}
                className="border-gray-700 text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Layer list */}
        {!layers || layers.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <Layers className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No movement layers yet</p>
            <p className="text-sm mt-2">Add PNG layer images for the watch movement visualization</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-4">
              {layers.length} Layer{layers.length !== 1 ? "s" : ""}
            </h2>
            {layers.map((layer, idx) => (
              <div
                key={layer.id}
                className={`flex items-center gap-4 bg-gray-900/60 border rounded-xl p-4 transition-all ${
                  layer.isActive ? "border-gray-800" : "border-gray-900 opacity-50"
                }`}
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-700 shrink-0 bg-gray-950">
                  <img src={layer.imageUrl} alt={layer.layerName} className="w-full h-full object-contain" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{layer.layerName}</p>
                  {layer.layerNameAr && (
                    <p className="text-gray-500 text-xs font-arabic" dir="rtl">{layer.layerNameAr}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-600">z:{layer.zIndex}</span>
                    <span className="text-xs text-[#d4af37]/70">{layer.animationType}</span>
                    <span className="text-xs text-gray-600">{layer.animationDuration}</span>
                    {!layer.isActive && (
                      <span className="text-xs text-red-500/70">inactive</span>
                    )}
                  </div>
                </div>

                {/* Reorder buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className="p-1 rounded text-gray-600 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === layers.length - 1}
                    className="p-1 rounded text-gray-600 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(layer)}
                    className="p-2 rounded-lg text-gray-400 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete layer "${layer.layerName}"?`)) {
                        deleteMutation.mutate({ id: layer.id });
                      }
                    }}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
