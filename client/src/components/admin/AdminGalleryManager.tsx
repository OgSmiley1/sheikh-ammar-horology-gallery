import { useMemo, useState } from "react";
import { ImagePlus, Loader2, Pencil, Save, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

const MAX_FILE_SIZE = 12 * 1024 * 1024;
const SUPPORTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

type GalleryEditor = {
  id: number;
  captionEn: string;
  captionAr: string;
  eventName: string;
  photoDate: string;
  watchId: string;
};

function toDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The selected image could not be read."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export default function AdminGalleryManager() {
  const { isRTL } = useLanguage();
  const utils = trpc.useUtils();
  const { data: galleryPhotos = [], isLoading, error } = trpc.adminMvp.gallery.getAll.useQuery();
  const { data: watches = [] } = trpc.watches.getAll.useQuery();
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [captionEn, setCaptionEn] = useState("");
  const [captionAr, setCaptionAr] = useState("");
  const [eventName, setEventName] = useState("");
  const [photoDate, setPhotoDate] = useState("");
  const [watchId, setWatchId] = useState("");
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [draggedPhotoId, setDraggedPhotoId] = useState<number | null>(null);
  const [editor, setEditor] = useState<GalleryEditor | null>(null);
  const copy = isRTL ? {
    title: "إدارة صور المعرض", subtitle: "أضف صوراً عالية الدقة، وثّق سياقها، ورتّب ظهورها في المعرض العام.", select: "اختيار الصور", drop: "اسحب الصور هنا أو اختر حتى 8 صور", support: "JPEG أو PNG أو WebP · حد أقصى 12 ميغابايت للصورة", selected: "صور محددة", captionEn: "وصف إنجليزي موحّد", captionAr: "وصف عربي موحّد", event: "الحدث أو الوسم", date: "تاريخ الصورة", watch: "ربط بساعة (اختياري)", noWatch: "لا يوجد ربط بساعة", rights: "أقرّ بأن لدي الإذن اللازم لاستخدام هذه الصور وأن بيانات ربط الساعة صحيحة حسب أفضل ما لدي من معلومات.", rightsRequired: "يلزم تأكيد الإذن وبيانات ربط الساعة قبل الرفع.", upload: "رفع إلى المعرض", uploading: "جارٍ الرفع…", edit: "تحرير", save: "حفظ التعديلات", cancel: "إلغاء", delete: "حذف", remove: "إزالة", reorder: "اسحب البطاقات لإعادة ترتيب ظهورها", noPhotos: "لا توجد صور مُدارة بعد.", loadError: "تعذر تحميل سجل الصور.", uploaded: "تمت إضافة الصور إلى المعرض.", saved: "تم حفظ التعديلات.", deleted: "تم حذف سجل الصورة.", reordered: "تم حفظ الترتيب.", badFiles: "يمكن رفع صور JPEG أو PNG أو WebP بحجم لا يتجاوز 12 ميغابايت.", confirmDelete: "هل تريد حذف سجل هذه الصورة؟", image: "صورة المعرض"
  } : {
    title: "Gallery photo management", subtitle: "Add high-resolution imagery, document its context, and order how it appears in the public gallery.", select: "Choose photos", drop: "Drop images here or choose up to 8 files", support: "JPEG, PNG, or WebP · maximum 12 MB per image", selected: "selected", captionEn: "Shared English caption", captionAr: "Shared Arabic caption", event: "Event or label", date: "Photo date", watch: "Link a watch (optional)", noWatch: "No watch link", rights: "I confirm that I am authorized to use these images and that any watch association is accurate to the best of my knowledge.", rightsRequired: "Confirm image rights and watch association before uploading.", upload: "Upload to gallery", uploading: "Uploading…", edit: "Edit", save: "Save changes", cancel: "Cancel", delete: "Delete", remove: "Remove", reorder: "Drag cards to reorder their public appearance", noPhotos: "No managed photos yet.", loadError: "The photo register could not be loaded.", uploaded: "Photos added to the gallery.", saved: "Changes saved.", deleted: "Photo record deleted.", reordered: "Order saved.", badFiles: "Upload JPEG, PNG, or WebP images no larger than 12 MB.", confirmDelete: "Delete this photo record?", image: "Gallery image"
  };
  const orderedPhotos = useMemo(() => [...galleryPhotos].sort((a, b) => a.displayOrder - b.displayOrder), [galleryPhotos]);
  const refresh = async () => {
    await Promise.all([utils.adminMvp.gallery.getAll.invalidate(), utils.sheikhPhotos.getAll.invalidate()]);
  };
  const upload = trpc.adminMvp.gallery.uploadBatch.useMutation({
    onSuccess: async () => { setPendingFiles([]); setCaptionEn(""); setCaptionAr(""); setEventName(""); setPhotoDate(""); setWatchId(""); setRightsConfirmed(false); await refresh(); toast.success(copy.uploaded); },
    onError: (result) => toast.error(result.message),
  });
  const update = trpc.adminMvp.gallery.update.useMutation({ onSuccess: async () => { setEditor(null); await refresh(); toast.success(copy.saved); }, onError: (result) => toast.error(result.message) });
  const remove = trpc.adminMvp.gallery.delete.useMutation({ onSuccess: async () => { await refresh(); toast.success(copy.deleted); }, onError: (result) => toast.error(result.message) });
  const reorder = trpc.adminMvp.gallery.reorder.useMutation({ onSuccess: async () => { await refresh(); toast.success(copy.reordered); }, onError: (result) => toast.error(result.message) });

  const addFiles = (files: FileList | File[]) => {
    const proposed = Array.from(files);
    const valid = proposed.filter((file) => SUPPORTED_TYPES.includes(file.type as typeof SUPPORTED_TYPES[number]) && file.size <= MAX_FILE_SIZE);
    if (valid.length !== proposed.length) toast.error(copy.badFiles);
    setPendingFiles((current) => [...current, ...valid].slice(0, 8));
  };
  const submitUpload = async () => {
    if (!pendingFiles.length) return;
    if (!rightsConfirmed) { toast.error(copy.rightsRequired); return; }
    try {
      const photos = await Promise.all(pendingFiles.map(async (file) => ({
        imageBase64: await toDataUrl(file), fileName: file.name, mimeType: file.type as "image/jpeg" | "image/png" | "image/webp",
        captionEn: captionEn || undefined, captionAr: captionAr || undefined, eventName: eventName || undefined,
        photoDate: photoDate || undefined, watchId: watchId ? Number(watchId) : undefined,
      })));
      upload.mutate({ rightsConfirmed: true, photos });
    } catch (uploadError) {
      toast.error(uploadError instanceof Error ? uploadError.message : copy.badFiles);
    }
  };
  const saveEditor = () => {
    if (!editor) return;
    update.mutate({ id: editor.id, captionEn: editor.captionEn || undefined, captionAr: editor.captionAr || undefined, eventName: editor.eventName || undefined, photoDate: editor.photoDate || undefined, watchId: editor.watchId ? Number(editor.watchId) : undefined });
  };
  const beginEdit = (photo: typeof galleryPhotos[number]) => setEditor({ id: photo.id, captionEn: photo.captionEn || "", captionAr: photo.captionAr || "", eventName: photo.eventName || "", photoDate: photo.photoDate ? new Date(photo.photoDate).toISOString().slice(0, 10) : "", watchId: photo.watchId ? String(photo.watchId) : "" });
  const movePhoto = (targetId: number) => {
    if (draggedPhotoId === null || draggedPhotoId === targetId) return;
    const ids = orderedPhotos.map((photo) => photo.id);
    const from = ids.indexOf(draggedPhotoId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    reorder.mutate({ photoIds: ids });
    setDraggedPhotoId(null);
  };

  return <section className="space-y-7" dir={isRTL ? "rtl" : "ltr"}>
    <div className="rounded-xl border border-primary/20 bg-muted/20 p-5 sm:p-6"><div className="flex items-start gap-4"><ImagePlus className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" /><div><h3 className="text-2xl text-foreground" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{copy.title}</h3><p className="mt-2 max-w-3xl leading-7 text-muted-foreground">{copy.subtitle}</p></div></div></div>
    <div className="grid gap-5 rounded-xl border border-dashed border-primary/40 bg-card/60 p-5 lg:grid-cols-[1.1fr_1fr] lg:p-6">
      <div><input id="gallery-upload" className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => event.target.files && addFiles(event.target.files)} /><label htmlFor="gallery-upload" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addFiles(event.dataTransfer.files); }} className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border border-primary/30 bg-muted/25 p-6 text-center transition-colors hover:border-primary hover:bg-primary/5"><Upload className="mb-3 h-8 w-8 text-primary" aria-hidden="true" /><span className="font-semibold text-foreground">{copy.drop}</span><span className="mt-2 text-sm text-muted-foreground">{copy.support}</span><span className="mt-4 rounded border border-primary/30 px-3 py-2 text-sm font-semibold text-primary">{copy.select}</span></label>{pendingFiles.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{pendingFiles.map((file, index) => <span key={`${file.name}-${index}`} className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background px-3 py-1.5 text-xs text-foreground">{file.name}<button type="button" aria-label={`${copy.remove} ${file.name}`} onClick={() => setPendingFiles((files) => files.filter((_, fileIndex) => fileIndex !== index))}><X className="h-3.5 w-3.5 text-primary" /></button></span>)}</div>}</div>
      <div className="space-y-3"><p className="text-sm font-semibold text-primary">{pendingFiles.length} {copy.selected}</p><label className="block text-sm font-medium text-foreground">{copy.captionEn}<textarea value={captionEn} onChange={(event) => setCaptionEn(event.target.value)} maxLength={255} className="mt-1.5 min-h-20 w-full rounded-md border border-primary/20 bg-background px-3 py-2 text-foreground outline-none focus:border-primary" /></label><label className="block text-sm font-medium text-foreground">{copy.captionAr}<textarea value={captionAr} onChange={(event) => setCaptionAr(event.target.value)} maxLength={255} dir="rtl" className="mt-1.5 min-h-20 w-full rounded-md border border-primary/20 bg-background px-3 py-2 text-foreground outline-none focus:border-primary" /></label><div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium text-foreground">{copy.event}<input value={eventName} onChange={(event) => setEventName(event.target.value)} maxLength={255} className="mt-1.5 h-10 w-full rounded-md border border-primary/20 bg-background px-3 text-foreground outline-none focus:border-primary" /></label><label className="text-sm font-medium text-foreground">{copy.date}<input type="date" value={photoDate} onChange={(event) => setPhotoDate(event.target.value)} className="mt-1.5 h-10 w-full rounded-md border border-primary/20 bg-background px-3 text-foreground outline-none focus:border-primary" /></label></div><label className="block text-sm font-medium text-foreground">{copy.watch}<select value={watchId} onChange={(event) => setWatchId(event.target.value)} className="mt-1.5 h-10 w-full rounded-md border border-primary/20 bg-background px-3 text-foreground outline-none focus:border-primary"><option value="">{copy.noWatch}</option>{watches.map((watch) => <option key={watch.id} value={watch.id}>{isRTL ? watch.nameAr : watch.nameEn}</option>)}</select></label><label className="flex cursor-pointer items-start gap-3 rounded-lg border border-primary/20 bg-muted/20 p-3 text-sm leading-6 text-foreground"><input id="rights-and-association" type="checkbox" checked={rightsConfirmed} onChange={(event) => setRightsConfirmed(event.target.checked)} className="mt-1 size-4 accent-primary" /><span>{copy.rights}</span></label><Button type="button" onClick={submitUpload} disabled={!pendingFiles.length || !rightsConfirmed || upload.isPending} className="w-full gap-2"><Upload className="h-4 w-4" />{upload.isPending ? copy.uploading : copy.upload}</Button></div>
    </div>
    <div className="flex items-center justify-between gap-4"><div><h4 className="text-xl text-foreground" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{copy.title}</h4><p className="mt-1 text-sm text-muted-foreground">{copy.reorder}</p></div>{isLoading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}</div>
    {error ? <p className="status-danger-surface rounded-lg p-4 text-sm">{copy.loadError}</p> : orderedPhotos.length === 0 && !isLoading ? <p className="rounded-lg border border-primary/20 bg-muted/20 p-5 text-muted-foreground">{copy.noPhotos}</p> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{orderedPhotos.map((photo) => <article key={photo.id} draggable onDragStart={() => setDraggedPhotoId(photo.id)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); movePhoto(photo.id); }} className={`overflow-hidden rounded-xl border bg-card transition-all ${draggedPhotoId === photo.id ? "border-primary opacity-60" : "border-primary/20 hover:border-primary/50"}`}><img src={photo.imageUrl} alt={photo.captionEn || copy.image} className="aspect-[4/3] w-full object-cover" loading="lazy" />{editor?.id === photo.id && editor ? <div className="space-y-3 p-4"><input value={editor.captionEn} onChange={(event) => setEditor({ ...editor, captionEn: event.target.value })} placeholder={copy.captionEn} className="h-10 w-full rounded border border-primary/20 bg-background px-3 text-sm text-foreground" /><input value={editor.captionAr} onChange={(event) => setEditor({ ...editor, captionAr: event.target.value })} placeholder={copy.captionAr} dir="rtl" className="h-10 w-full rounded border border-primary/20 bg-background px-3 text-sm text-foreground" /><input value={editor.eventName} onChange={(event) => setEditor({ ...editor, eventName: event.target.value })} placeholder={copy.event} className="h-10 w-full rounded border border-primary/20 bg-background px-3 text-sm text-foreground" /><div className="grid grid-cols-2 gap-2"><input type="date" value={editor.photoDate} onChange={(event) => setEditor({ ...editor, photoDate: event.target.value })} className="h-10 rounded border border-primary/20 bg-background px-2 text-sm text-foreground" /><select value={editor.watchId} onChange={(event) => setEditor({ ...editor, watchId: event.target.value })} className="h-10 rounded border border-primary/20 bg-background px-2 text-sm text-foreground"><option value="">{copy.noWatch}</option>{watches.map((watch) => <option key={watch.id} value={watch.id}>{isRTL ? watch.nameAr : watch.nameEn}</option>)}</select></div><div className="flex gap-2"><Button size="sm" type="button" onClick={saveEditor}><Save className="h-4 w-4" />{copy.save}</Button><Button size="sm" type="button" variant="outline" onClick={() => setEditor(null)}>{copy.cancel}</Button></div></div> : <div className="p-4"><p className="font-medium text-foreground">{photo.eventName || (isRTL ? "صورة معرض" : "Gallery image")}</p><p className="mt-1 min-h-10 text-sm leading-6 text-muted-foreground">{(isRTL ? photo.captionAr : photo.captionEn) || (isRTL ? "لم يُضف وصف بعد." : "No caption added yet.")}</p><div className="mt-4 flex gap-2"><Button size="sm" type="button" variant="outline" onClick={() => beginEdit(photo)}><Pencil className="h-4 w-4" />{copy.edit}</Button><Button size="sm" type="button" variant="destructive" disabled={remove.isPending} onClick={() => { if (window.confirm(copy.confirmDelete)) remove.mutate({ id: photo.id }); }}><Trash2 className="h-4 w-4" />{copy.delete}</Button></div></div>}</article>)}</div>}
  </section>;
}
