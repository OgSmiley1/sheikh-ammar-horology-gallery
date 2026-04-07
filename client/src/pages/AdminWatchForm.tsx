import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, LogOut, ArrowLeft, Save, Upload } from "lucide-react";
import { toast } from "sonner";

// ── helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

interface WatchFormData {
  brandId: number;
  referenceNumber: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionEn: string;
  descriptionAr: string;
  storyEn: string;
  storyAr: string;
  material: string;
  materialAr: string;
  dialColor: string;
  dialColorAr: string;
  caseSize: string;
  caseSizeAr: string;
  movement: string;
  movementAr: string;
  complications: string;
  complicationsAr: string;
  waterResistance: string;
  waterResistanceAr: string;
  rarity: string;
  rarityAr: string;
  yearReleased: string;
  retailPrice: string;
  marketValue: string;
  limitedEdition: boolean;
  productionQuantity: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: string;
  mainImageUrl: string;
}

const EMPTY: WatchFormData = {
  brandId: 0,
  referenceNumber: "",
  nameEn: "",
  nameAr: "",
  slug: "",
  descriptionEn: "",
  descriptionAr: "",
  storyEn: "",
  storyAr: "",
  material: "",
  materialAr: "",
  dialColor: "",
  dialColorAr: "",
  caseSize: "",
  caseSizeAr: "",
  movement: "",
  movementAr: "",
  complications: "",
  complicationsAr: "",
  waterResistance: "",
  waterResistanceAr: "",
  rarity: "",
  rarityAr: "",
  yearReleased: "",
  retailPrice: "",
  marketValue: "",
  limitedEdition: false,
  productionQuantity: "",
  isFeatured: false,
  isActive: true,
  displayOrder: "0",
  mainImageUrl: "",
};

// ── component ─────────────────────────────────────────────────────────────────

export default function AdminWatchForm() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id?: string }>();
  const watchId = params.id ? parseInt(params.id, 10) : null;
  const isEdit = watchId !== null;

  const [adminSession, setAdminSession] = useState<any>(null);
  const [form, setForm] = useState<WatchFormData>(EMPTY);
  const [uploading, setUploading] = useState(false);

  // Auth check
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

  const { data: brands } = trpc.brands.getAll.useQuery(undefined, { enabled: !!adminSession });

  // Load existing watch when editing
  const { data: allWatches } = trpc.watches.getAll.useQuery(undefined, {
    enabled: !!adminSession && isEdit,
  });

  useEffect(() => {
    if (!isEdit || !allWatches) return;
    const w = allWatches.find((x: any) => x.id === watchId);
    if (!w) return;
    setForm({
      brandId: w.brandId ?? 0,
      referenceNumber: w.referenceNumber ?? "",
      nameEn: w.nameEn ?? "",
      nameAr: w.nameAr ?? "",
      slug: w.slug ?? "",
      descriptionEn: w.descriptionEn ?? "",
      descriptionAr: w.descriptionAr ?? "",
      storyEn: w.storyEn ?? "",
      storyAr: w.storyAr ?? "",
      material: w.material ?? "",
      materialAr: w.materialAr ?? "",
      dialColor: w.dialColor ?? "",
      dialColorAr: w.dialColorAr ?? "",
      caseSize: w.caseSize ?? "",
      caseSizeAr: w.caseSizeAr ?? "",
      movement: w.movement ?? "",
      movementAr: w.movementAr ?? "",
      complications: w.complications ?? "",
      complicationsAr: w.complicationsAr ?? "",
      waterResistance: w.waterResistance ?? "",
      waterResistanceAr: w.waterResistanceAr ?? "",
      rarity: w.rarity ?? "",
      rarityAr: w.rarityAr ?? "",
      yearReleased: w.yearReleased?.toString() ?? "",
      retailPrice: w.retailPrice?.toString() ?? "",
      marketValue: w.marketValue?.toString() ?? "",
      limitedEdition: w.limitedEdition ?? false,
      productionQuantity: w.productionQuantity?.toString() ?? "",
      isFeatured: w.isFeatured ?? false,
      isActive: w.isActive ?? true,
      displayOrder: w.displayOrder?.toString() ?? "0",
      mainImageUrl: w.mainImageUrl ?? "",
    });
  }, [allWatches, watchId, isEdit]);

  const createMutation = trpc.admin.createWatch.useMutation({
    onSuccess: () => {
      toast.success("Watch created successfully");
      setLocation("/admin/watches");
    },
    onError: (err) => toast.error(err.message || "Failed to create watch"),
  });

  const updateMutation = trpc.admin.updateWatch.useMutation({
    onSuccess: () => {
      toast.success("Watch updated successfully");
      setLocation("/admin/watches");
    },
    onError: (err) => toast.error(err.message || "Failed to update watch"),
  });

  function set(field: keyof WatchFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image must be under 20 MB");
      return;
    }
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch("/api/upload-admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: base64, filename: file.name }),
        });
        const json = await res.json();
        if (json.ok) {
          set("mainImageUrl", json.url);
          toast.success("Image uploaded");
        } else {
          toast.error(json.error || "Upload failed");
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Upload error");
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nameEn || !form.nameAr || !form.referenceNumber || !form.slug || !form.brandId) {
      toast.error("Please fill in all required fields (EN name, AR name, reference, slug, brand)");
      return;
    }

    const payload = {
      brandId: form.brandId,
      referenceNumber: form.referenceNumber,
      nameEn: form.nameEn,
      nameAr: form.nameAr,
      slug: form.slug,
      descriptionEn: form.descriptionEn || undefined,
      descriptionAr: form.descriptionAr || undefined,
      storyEn: form.storyEn || undefined,
      storyAr: form.storyAr || undefined,
      material: form.material || undefined,
      materialAr: form.materialAr || undefined,
      dialColor: form.dialColor || undefined,
      dialColorAr: form.dialColorAr || undefined,
      caseSize: form.caseSize || undefined,
      caseSizeAr: form.caseSizeAr || undefined,
      movement: form.movement || undefined,
      movementAr: form.movementAr || undefined,
      complications: form.complications || undefined,
      complicationsAr: form.complicationsAr || undefined,
      waterResistance: form.waterResistance || undefined,
      waterResistanceAr: form.waterResistanceAr || undefined,
      rarity: form.rarity || undefined,
      rarityAr: form.rarityAr || undefined,
      yearReleased: form.yearReleased ? parseInt(form.yearReleased) : undefined,
      retailPrice: form.retailPrice ? parseInt(form.retailPrice) : undefined,
      marketValue: form.marketValue ? parseInt(form.marketValue) : undefined,
      limitedEdition: form.limitedEdition,
      productionQuantity: form.productionQuantity ? parseInt(form.productionQuantity) : undefined,
      isFeatured: form.isFeatured,
      displayOrder: form.displayOrder ? parseInt(form.displayOrder) : 0,
    };

    if (isEdit && watchId) {
      updateMutation.mutate({
        id: watchId,
        data: {
          ...payload,
          isActive: form.isActive,
          mainImageUrl: form.mainImageUrl || undefined,
        },
      });
    } else {
      createMutation.mutate(payload);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (!adminSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold-500 text-xl">Loading...</div>
      </div>
    );
  }

  // ── field helpers ────────────────────────────────────────────────────────────

  function BilingualField({
    label,
    fieldEn,
    fieldAr,
    textarea = false,
    required = false,
    rows = 3,
  }: {
    label: string;
    fieldEn: keyof WatchFormData;
    fieldAr: keyof WatchFormData;
    textarea?: boolean;
    required?: boolean;
    rows?: number;
  }) {
    const sharedClass = "bg-gray-900 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-500";
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            {label} <span className="text-blue-400">(EN{required ? " *" : ""})</span>
          </label>
          {textarea ? (
            <textarea
              rows={rows}
              value={form[fieldEn] as string}
              onChange={(e) => set(fieldEn, e.target.value)}
              className={`w-full rounded-md border px-3 py-2 text-sm resize-y ${sharedClass}`}
              required={required}
            />
          ) : (
            <Input
              value={form[fieldEn] as string}
              onChange={(e) => set(fieldEn, e.target.value)}
              className={sharedClass}
              required={required}
            />
          )}
        </div>
        <div dir="rtl">
          <label className="block text-xs text-gray-400 mb-1">
            {label} <span className="text-gold-400">(AR{required ? " *" : ""})</span>
          </label>
          {textarea ? (
            <textarea
              rows={rows}
              value={form[fieldAr] as string}
              onChange={(e) => set(fieldAr, e.target.value)}
              className={`w-full rounded-md border px-3 py-2 text-sm resize-y font-arabic ${sharedClass}`}
              required={required}
            />
          ) : (
            <Input
              value={form[fieldAr] as string}
              onChange={(e) => set(fieldAr, e.target.value)}
              className={`font-arabic ${sharedClass}`}
              required={required}
            />
          )}
        </div>
      </div>
    );
  }

  function SectionHeader({ title }: { title: string }) {
    return (
      <h3 className="text-lg font-bold text-gold-500 border-b border-gold-500/20 pb-2 mb-4 mt-6">
        {title}
      </h3>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-black border-b border-gold-500/30 px-6 py-4">
        <div className="container max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation("/admin/watches")}
              variant="ghost"
              className="text-gray-400 hover:text-gold-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Crown className="w-7 h-7 text-gold-500" />
              <h1 className="text-xl font-bold text-gold-500">
                {isEdit ? "Edit Watch" : "Add New Watch"}
              </h1>
            </div>
          </div>
          <Button
            onClick={() => {
              localStorage.removeItem("adminSession");
              setLocation("/admin/login");
            }}
            variant="outline"
            className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container max-w-5xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-2">

          {/* ── BASIC INFO ── */}
          <SectionHeader title="Basic Information" />

          {/* Brand */}
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">Brand <span className="text-red-400">*</span></label>
            <select
              value={form.brandId}
              onChange={(e) => set("brandId", e.target.value)}
              className="w-full bg-gray-900 border border-gold-500/30 text-white rounded-md px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
              required
            >
              <option value={0}>— Select brand —</option>
              {brands?.map((b: any) => (
                <option key={b.id} value={b.id}>
                  {b.nameEn} / {b.nameAr}
                </option>
              ))}
            </select>
          </div>

          {/* Reference number */}
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">Reference Number <span className="text-red-400">*</span></label>
            <Input
              value={form.referenceNumber}
              onChange={(e) => set("referenceNumber", e.target.value)}
              className="bg-gray-900 border-gold-500/30 text-white"
              required
            />
          </div>

          <BilingualField label="Watch Name" fieldEn="nameEn" fieldAr="nameAr" required />

          {/* Slug */}
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">URL Slug <span className="text-red-400">*</span></label>
            <div className="flex gap-2">
              <Input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                className="bg-gray-900 border-gold-500/30 text-white flex-1"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10 shrink-0"
                onClick={() => set("slug", slugify(form.nameEn))}
              >
                Auto
              </Button>
            </div>
          </div>

          {/* ── DESCRIPTION & STORY ── */}
          <SectionHeader title="Description & Story" />
          <BilingualField label="Description" fieldEn="descriptionEn" fieldAr="descriptionAr" textarea rows={4} />
          <BilingualField label="Story" fieldEn="storyEn" fieldAr="storyAr" textarea rows={5} />

          {/* ── SPECIFICATIONS ── */}
          <SectionHeader title="Specifications (bilingual)" />
          <BilingualField label="Material" fieldEn="material" fieldAr="materialAr" />
          <BilingualField label="Case Size" fieldEn="caseSize" fieldAr="caseSizeAr" />
          <BilingualField label="Movement" fieldEn="movement" fieldAr="movementAr" textarea rows={2} />
          <BilingualField label="Dial Color" fieldEn="dialColor" fieldAr="dialColorAr" />
          <BilingualField label="Water Resistance" fieldEn="waterResistance" fieldAr="waterResistanceAr" />
          <BilingualField label="Complications" fieldEn="complications" fieldAr="complicationsAr" textarea rows={2} />
          <BilingualField label="Rarity" fieldEn="rarity" fieldAr="rarityAr" />

          {/* ── METADATA ── */}
          <SectionHeader title="Metadata & Pricing" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Year Released</label>
              <Input
                type="number"
                value={form.yearReleased}
                onChange={(e) => set("yearReleased", e.target.value)}
                className="bg-gray-900 border-gold-500/30 text-white"
                placeholder="2020"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Retail Price (USD)</label>
              <Input
                type="number"
                value={form.retailPrice}
                onChange={(e) => set("retailPrice", e.target.value)}
                className="bg-gray-900 border-gold-500/30 text-white"
                placeholder="50000"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Market Value (USD)</label>
              <Input
                type="number"
                value={form.marketValue}
                onChange={(e) => set("marketValue", e.target.value)}
                className="bg-gray-900 border-gold-500/30 text-white"
                placeholder="75000"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Display Order</label>
              <Input
                type="number"
                value={form.displayOrder}
                onChange={(e) => set("displayOrder", e.target.value)}
                className="bg-gray-900 border-gold-500/30 text-white"
              />
            </div>
          </div>

          {/* Limited Edition */}
          <div className="flex flex-wrap gap-6 mb-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
              <input
                type="checkbox"
                checked={form.limitedEdition}
                onChange={(e) => set("limitedEdition", e.target.checked)}
                className="accent-gold-500 w-4 h-4"
              />
              Limited Edition
            </label>
            {form.limitedEdition && (
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400">Production Qty:</label>
                <Input
                  type="number"
                  value={form.productionQuantity}
                  onChange={(e) => set("productionQuantity", e.target.value)}
                  className="bg-gray-900 border-gold-500/30 text-white w-28"
                  placeholder="500"
                />
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => set("isFeatured", e.target.checked)}
                className="accent-gold-500 w-4 h-4"
              />
              Featured
            </label>
            {isEdit && (
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => set("isActive", e.target.checked)}
                  className="accent-gold-500 w-4 h-4"
                />
                Active
              </label>
            )}
          </div>

          {/* ── IMAGE ── */}
          <SectionHeader title="Main Image" />
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gold-500/30 text-gold-500 hover:bg-gold-500/10 transition-colors text-sm font-medium">
                  <Upload className="w-4 h-4" />
                  {uploading ? "Uploading…" : "Upload Image"}
                </span>
              </label>
              <span className="text-xs text-gray-500">or paste URL below</span>
            </div>
            <Input
              value={form.mainImageUrl}
              onChange={(e) => set("mainImageUrl", e.target.value)}
              placeholder="/uploads/watch-image.jpg"
              className="bg-gray-900 border-gold-500/30 text-white"
            />
            {form.mainImageUrl && (
              <img
                src={form.mainImageUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-gold-500/30"
              />
            )}
          </div>

          {/* ── SUBMIT ── */}
          <div className="flex gap-4 pt-4 border-t border-gold-500/20">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-gold-500 hover:bg-gold-600 text-black font-bold px-8"
            >
              <Save className="w-4 h-4 mr-2" />
              {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Watch"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/admin/watches")}
              className="border-gray-600 text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
