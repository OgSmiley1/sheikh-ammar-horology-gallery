import { useState } from "react";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

const MAX_FILE_SIZE = 12 * 1024 * 1024;
const SUPPORTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

function toDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The selected image could not be read."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export default function AdminWatchImageManager({ watchId, watchName }: { watchId: number; watchName: string }) {
  const { isRTL } = useLanguage();
  const utils = trpc.useUtils();
  const { data: images = [], isLoading } = trpc.watches.getImages.useQuery({ watchId });
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [imageType, setImageType] = useState<"studio" | "wrist" | "detail" | "movement">("studio");
  const [captionEn, setCaptionEn] = useState("");
  const [captionAr, setCaptionAr] = useState("");
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const copy = isRTL ? {
    title: "صور الساعة", selected: "صور محددة", drop: "اسحب صور الساعة هنا أو اختر حتى 8 صور", support: "JPEG أو PNG أو WebP · حد أقصى 12 ميغابايت للصورة", choose: "اختيار الصور", imageType: "نوع الصورة", studio: "صورة استوديو", wrist: "على المعصم", detail: "تفصيل", movement: "الحركة", captionEn: "وصف إنجليزي اختياري", captionAr: "وصف عربي اختياري", rights: "أقرّ بأن لدي الإذن اللازم لاستخدام هذه الصور وأنها تخص الساعة المحددة أو مرتبطة بها بدقة حسب أفضل ما لدي من معلومات.", rightsRequired: "يلزم تأكيد الإذن وصحة ربط الساعة قبل الرفع.", upload: "رفع إلى معرض الساعة", uploading: "جارٍ الرفع…", uploaded: "أضيفت الصور إلى معرض الساعة.", badFiles: "يمكن رفع صور JPEG أو PNG أو WebP بحجم لا يتجاوز 12 ميغابايت.", remove: "إزالة", existing: "صور المعرض الحالية", noImages: "لا توجد صور أصلية مرتبطة بهذه الساعة بعد."
  } : {
    title: "Watch images", selected: "selected", drop: "Drop original watch images here or choose up to 8 files", support: "JPEG, PNG, or WebP · maximum 12 MB per image", choose: "Choose images", imageType: "Image type", studio: "Studio", wrist: "On wrist", detail: "Detail", movement: "Movement", captionEn: "Optional English caption", captionAr: "Optional Arabic caption", rights: "I confirm that I am authorized to use these images and that they accurately depict or relate to the selected watch to the best of my knowledge.", rightsRequired: "Confirm image rights and the watch association before uploading.", upload: "Upload to watch gallery", uploading: "Uploading…", uploaded: "Images added to the watch gallery.", badFiles: "Upload JPEG, PNG, or WebP images no larger than 12 MB.", remove: "Remove", existing: "Current gallery images", noImages: "No original images are associated with this watch yet."
  };
  const upload = trpc.adminMvp.watchImages.uploadBatch.useMutation({
    onSuccess: async () => {
      setPendingFiles([]); setCaptionEn(""); setCaptionAr(""); setRightsConfirmed(false);
      await utils.watches.getImages.invalidate({ watchId });
      toast.success(copy.uploaded);
    },
    onError: (result) => toast.error(result.message),
  });
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
      const uploadImages = await Promise.all(pendingFiles.map(async (file) => ({ imageBase64: await toDataUrl(file), fileName: file.name, mimeType: file.type as "image/jpeg" | "image/png" | "image/webp", imageType, captionEn: captionEn || undefined, captionAr: captionAr || undefined })));
      upload.mutate({ rightsConfirmed: true, watchId, images: uploadImages });
    } catch (uploadError) {
      toast.error(uploadError instanceof Error ? uploadError.message : copy.badFiles);
    }
  };

  return <section className="space-y-5" dir={isRTL ? "rtl" : "ltr"}>
    <div className="rounded-xl border border-primary/20 bg-muted/20 p-4"><div className="flex items-start gap-3"><ImagePlus className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><div><h4 className="text-lg text-foreground">{copy.title}</h4><p className="mt-1 text-sm text-muted-foreground">{watchName}</p></div></div></div>
    <div className="grid gap-4 rounded-xl border border-dashed border-primary/35 bg-card/50 p-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div><input id={`watch-image-upload-${watchId}`} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => event.target.files && addFiles(event.target.files)} /><label htmlFor={`watch-image-upload-${watchId}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addFiles(event.dataTransfer.files); }} className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-primary/30 bg-muted/20 p-5 text-center transition-colors hover:border-primary hover:bg-primary/5"><Upload className="mb-3 h-7 w-7 text-primary" aria-hidden="true" /><span className="font-semibold text-foreground">{copy.drop}</span><span className="mt-2 text-xs text-muted-foreground">{copy.support}</span><span className="mt-4 rounded border border-primary/30 px-3 py-1.5 text-sm font-semibold text-primary">{copy.choose}</span></label>{pendingFiles.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{pendingFiles.map((file, index) => <span key={`${file.name}-${index}`} className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background px-3 py-1.5 text-xs text-foreground">{file.name}<button type="button" aria-label={`${copy.remove} ${file.name}`} onClick={() => setPendingFiles((files) => files.filter((_, fileIndex) => fileIndex !== index))}><X className="h-3.5 w-3.5 text-primary" /></button></span>)}</div>}</div>
      <div className="space-y-3"><p className="text-sm font-semibold text-primary">{pendingFiles.length} {copy.selected}</p><label className="block text-sm font-medium text-foreground">{copy.imageType}<select value={imageType} onChange={(event) => setImageType(event.target.value as typeof imageType)} className="mt-1.5 h-10 w-full rounded-md border border-primary/20 bg-background px-3 text-foreground outline-none focus:border-primary"><option value="studio">{copy.studio}</option><option value="wrist">{copy.wrist}</option><option value="detail">{copy.detail}</option><option value="movement">{copy.movement}</option></select></label><label className="block text-sm font-medium text-foreground">{copy.captionEn}<input value={captionEn} onChange={(event) => setCaptionEn(event.target.value)} maxLength={255} className="mt-1.5 h-10 w-full rounded-md border border-primary/20 bg-background px-3 text-foreground outline-none focus:border-primary" /></label><label className="block text-sm font-medium text-foreground">{copy.captionAr}<input value={captionAr} onChange={(event) => setCaptionAr(event.target.value)} maxLength={255} dir="rtl" className="mt-1.5 h-10 w-full rounded-md border border-primary/20 bg-background px-3 text-foreground outline-none focus:border-primary" /></label><label className="flex cursor-pointer items-start gap-3 rounded-lg border border-primary/20 bg-muted/20 p-3 text-sm leading-6 text-foreground"><input id={`watch-rights-and-association-${watchId}`} type="checkbox" checked={rightsConfirmed} onChange={(event) => setRightsConfirmed(event.target.checked)} className="mt-1 size-4 accent-primary" /><span>{copy.rights}</span></label><Button type="button" onClick={submitUpload} disabled={!pendingFiles.length || !rightsConfirmed || upload.isPending} className="w-full gap-2"><Upload className="h-4 w-4" />{upload.isPending ? copy.uploading : copy.upload}</Button></div>
    </div>
    <div><h5 className="text-sm font-semibold text-foreground">{copy.existing}</h5>{isLoading ? <Loader2 className="mt-3 h-5 w-5 animate-spin text-primary" /> : images.length ? <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">{images.map((image) => <img key={image.id} src={image.imageUrl} alt={isRTL ? image.captionAr || watchName : image.captionEn || watchName} className="aspect-square w-full rounded-lg border border-primary/20 object-cover" loading="lazy" />)}</div> : <p className="mt-2 text-sm text-muted-foreground">{copy.noImages}</p>}</div>
  </section>;
}
