import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Edit2, Trash2, Plus, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { hasArabicScript } from "@/lib/localizationGuard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import AdminWatchImageManager from "@/components/admin/AdminWatchImageManager";

export default function AdminWatchesMvp() {
  const { isRTL } = useLanguage();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedWatch, setSelectedWatch] = useState<any>(null);
  const [editData, setEditData] = useState<any>({});
  const copy = isRTL
    ? {
        title: "إدارة الساعات",
        add: "إضافة ساعة جديدة",
        updated: "تم تحديث الساعة بنجاح.",
                updateFailed: "تعذر تحديث الساعة.",
        images: "إدارة الصور",
        deleted: "تم حذف الساعة بنجاح.",
        deleteFailed: "تعذر حذف الساعة.",
        confirmDelete: "هل أنت متأكد من حذف هذه الساعة؟",
        editTitle: "تعديل الساعة",
        editDescription: "حدّث معلومات الساعة",
        nameEn: "الاسم بالإنجليزية",
        nameAr: "الاسم بالعربية",
        descriptionEn: "الوصف بالإنجليزية",
        descriptionAr: "الوصف بالعربية",
        retail: "سعر التجزئة",
        market: "القيمة السوقية",
        saving: "جارٍ الحفظ...",
        save: "حفظ التغييرات",
        reference: "المرجع",
        noWatches: "لا توجد ساعات.",
      }
    : {
        title: "Watches Management",
        add: "Add New Watch",
        updated: "Watch updated successfully.",
        updateFailed: "Failed to update watch.",
        images: "Manage images",
        deleted: "Watch deleted successfully.",
        deleteFailed: "Failed to delete watch.",
        confirmDelete: "Are you sure you want to delete this watch?",
        editTitle: "Edit Watch",
        editDescription: "Update watch information",
        nameEn: "Name (English)",
        nameAr: "Name (Arabic)",
        descriptionEn: "Description (English)",
        descriptionAr: "Description (Arabic)",
        retail: "Retail Price",
        market: "Market Value",
        saving: "Saving...",
        save: "Save Changes",
        reference: "Ref",
        noWatches: "No watches found.",
      };

  const { data: watches, isLoading, refetch } = trpc.adminMvp.watches.getList.useQuery({
    limit: 20,
    offset: 0,
  });

  const updateMutation = trpc.adminMvp.watches.update.useMutation({
    onSuccess: () => {
      toast.success(copy.updated);
      setIsEditDialogOpen(false);
      refetch();
    },
    onError: () => {
      toast.error(copy.updateFailed);
    },
  });

  const deleteMutation = trpc.adminMvp.watches.delete.useMutation({
    onSuccess: () => {
      toast.success(copy.deleted);
      refetch();
    },
    onError: () => {
      toast.error(copy.deleteFailed);
    },
  });

  const handleEdit = (watch: any) => {
    setSelectedWatch(watch);
    setEditData(watch);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedWatch) return;
    await updateMutation.mutateAsync({
      id: selectedWatch.id,
      ...editData,
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm(copy.confirmDelete)) {
      await deleteMutation.mutateAsync({ id });
    }
  };

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
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className={isRTL ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
          {copy.add}
        </Button>
      </div>

      <div className="grid gap-4">
        {watches && watches.length > 0 ? (
          watches.map((watch: any) => (
            <Card key={watch.id} className="border-primary/20 bg-card">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {isRTL ? watch.nameAr || watch.nameEn : watch.nameEn || watch.nameAr}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">{copy.reference}: {watch.referenceNumber}</p>
                    {(!isRTL ? watch.descriptionEn : hasArabicScript(watch.descriptionAr) ? watch.descriptionAr : null) && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {isRTL ? watch.descriptionAr : watch.descriptionEn}
                      </p>
                    )}
                    <div className="flex gap-4 mt-3 text-sm">
                      {watch.retailPrice && (
                        <span className="text-primary">
                          {copy.retail}: ${watch.retailPrice.toLocaleString()}
                        </span>
                      )}
                      {watch.marketValue && (
                        <span className="text-primary">
                          {copy.market}: ${watch.marketValue.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={isEditDialogOpen && selectedWatch?.id === watch.id}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(watch)}
                          className="border-primary/30"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                        <DialogTitle>{copy.editTitle}</DialogTitle>
                        <DialogDescription>{copy.editDescription}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">{copy.nameEn}</label>
                            <Input
                              value={editData.nameEn || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, nameEn: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">{copy.nameAr}</label>
                            <Input
                              value={editData.nameAr || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, nameAr: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">{copy.descriptionEn}</label>
                            <Textarea
                              value={editData.descriptionEn || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, descriptionEn: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">{copy.descriptionAr}</label>
                            <Textarea
                              value={editData.descriptionAr || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, descriptionAr: e.target.value })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">{copy.retail}</label>
                              <Input
                                type="number"
                                value={editData.retailPrice || ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    retailPrice: parseInt(e.target.value),
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">{copy.market}</label>
                              <Input
                                type="number"
                                value={editData.marketValue || ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    marketValue: parseInt(e.target.value),
                                  })
                                }
                              />
                            </div>
                          </div>
                          <Button
                            onClick={handleSaveEdit}
                            disabled={updateMutation.isPending}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            {updateMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {copy.saving}
                              </>
                            ) : (
                              copy.save
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-primary/30" aria-label={`${copy.images} ${isRTL ? watch.nameAr : watch.nameEn}`}>
                          <ImagePlus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                        <DialogHeader><DialogTitle>{copy.images}</DialogTitle><DialogDescription>{isRTL ? watch.nameAr || watch.nameEn : watch.nameEn || watch.nameAr}</DialogDescription></DialogHeader>
                        <AdminWatchImageManager watchId={watch.id} watchName={isRTL ? watch.nameAr || watch.nameEn : watch.nameEn || watch.nameAr} />
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(watch.id)}
                      disabled={deleteMutation.isPending}
                      className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
            <Card className="border-primary/20 bg-card">
              <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">{copy.noWatches}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
