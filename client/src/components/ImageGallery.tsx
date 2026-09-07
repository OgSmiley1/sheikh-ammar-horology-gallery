import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from "lucide-react";
import { WatchMedia, normaliseProjectImageUrl } from "@/components/WatchMedia";

interface ImageGalleryProps {
  images: string[];
  altText: string;
  language?: "en" | "ar";
}

export function ImageGallery({ images, altText, language = "en" }: ImageGalleryProps) {
  const isRTL = language === "ar";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const labels = language === "ar"
    ? {
        previous: "الصورة السابقة",
        next: "الصورة التالية",
        zoomOut: "تصغير",
        zoomIn: "تكبير",
        reset: "إعادة الضبط",
        fullscreen: "عرض بملء الشاشة",
        closeFullscreen: "إغلاق العرض بملء الشاشة",
        selectImage: "اختيار الصورة",
        imagePending: "صورة السجل قيد الربط",
        imagePendingBody: "لا تتوفر صورة مؤكدة من ملفات المشروع لهذا العرض حالياً.",
      }
    : {
        previous: "Previous image",
        next: "Next image",
        zoomOut: "Zoom out",
        zoomIn: "Zoom in",
        reset: "Reset",
        fullscreen: "View Fullscreen",
        closeFullscreen: "Close fullscreen",
        selectImage: "Select image",
        imagePending: "Archive image pending",
        imagePendingBody: "No confirmed image from the project files is available for this view yet.",
      };

  const projectImages = useMemo(
    () => Array.from(new Set(images.map(normaliseProjectImageUrl).filter((image): image is string => Boolean(image)))),
    [images],
  );
  const availableImages = useMemo(
    () => projectImages.filter((image) => !failedImages.has(image)),
    [failedImages, projectImages],
  );
  const safeIndex = availableImages.length ? Math.min(currentIndex, availableImages.length - 1) : 0;
  const currentImage = availableImages[safeIndex];
  const isZoomed = zoomLevel > 1;

  useEffect(() => {
    setCurrentIndex((previous) => availableImages.length ? Math.min(previous, availableImages.length - 1) : 0);
  }, [availableImages.length]);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
        setZoomLevel(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const resetZoom = () => setZoomLevel(1);
  const handlePrevious = () => {
    if (availableImages.length < 2) return;
    setCurrentIndex((previous) => (previous === 0 ? availableImages.length - 1 : previous - 1));
    resetZoom();
  };
  const handleNext = () => {
    if (availableImages.length < 2) return;
    setCurrentIndex((previous) => (previous === availableImages.length - 1 ? 0 : previous + 1));
    resetZoom();
  };
  const handleZoomIn = () => {
    if (!currentImage) return;
    setZoomLevel((previous) => Math.min(previous + 0.2, 3));
  };
  const handleZoomOut = () => setZoomLevel((previous) => Math.max(previous - 0.2, 1));
  const handleImageError = (image: string) => {
    setFailedImages((previous) => {
      const next = new Set(previous);
      next.add(image);
      return next;
    });
    resetZoom();
  };

  return (
    <>
      <div className="space-y-4">
        <div className="gallery-media-frame relative overflow-hidden rounded-lg bg-muted">
          <div className="relative flex aspect-square items-center justify-center overflow-hidden">
            {currentImage ? (
              <img
                src={currentImage}
                alt={altText}
                decoding="async"
                fetchPriority="high"
                className={`h-full w-full object-contain transition-transform duration-300 ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center" }}
                onClick={() => (isZoomed ? resetZoom() : handleZoomIn())}
                onError={() => handleImageError(currentImage)}
              />
            ) : (
              <WatchMedia
                imageUrl={null}
                alt={altText}
                watchName={altText}
                language={language}
                pendingTitle={labels.imagePending}
                pendingBody={labels.imagePendingBody}
                className="watch-media-fill"
              />
            )}
          </div>

          {availableImages.length > 1 && (
            <>
              <button type="button" onClick={handlePrevious} className={`gallery-overlay-button absolute top-1/2 z-10 -translate-y-1/2 rounded-full p-2 transition-all ${isRTL ? "right-4" : "left-4"}`} aria-label={labels.previous}>
                {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </button>
              <button type="button" onClick={handleNext} className={`gallery-overlay-button absolute top-1/2 z-10 -translate-y-1/2 rounded-full p-2 transition-all ${isRTL ? "left-4" : "right-4"}`} aria-label={labels.next}>
                {isRTL ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
            </>
          )}

          <div className="gallery-overlay-surface absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg p-2">
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleZoomOut} disabled={!currentImage || zoomLevel <= 1} className="gallery-overlay-control p-1 transition-colors disabled:opacity-50" aria-label={labels.zoomOut}>
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="min-w-[3rem] text-center text-xs font-medium">{Math.round(zoomLevel * 100)}%</span>
              <button type="button" onClick={handleZoomIn} disabled={!currentImage || zoomLevel >= 3} className="gallery-overlay-control p-1 transition-colors disabled:opacity-50" aria-label={labels.zoomIn}>
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
            {isZoomed && <button type="button" onClick={resetZoom} className="gallery-overlay-reset rounded px-2 py-1 text-xs transition-colors">{labels.reset}</button>}
          </div>

          {availableImages.length > 1 && <div className={`gallery-overlay-surface absolute top-4 rounded-full px-3 py-1 text-sm font-medium ${isRTL ? "left-4" : "right-4"}`}>{safeIndex + 1} / {availableImages.length}</div>}
        </div>

        {availableImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2" aria-label={labels.selectImage}>
            {availableImages.map((image, index) => (
              <button
                type="button"
                key={image}
                onClick={() => {
                  setCurrentIndex(index);
                  resetZoom();
                }}
                aria-label={`${labels.selectImage} ${index + 1}`}
                aria-current={index === safeIndex ? "true" : undefined}
                className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${index === safeIndex ? "border-primary ring-2 ring-primary/50" : "border-border hover:border-primary/50"}`}
              >
                <img src={image} alt={`${altText} ${index + 1}`} loading="lazy" decoding="async" className="h-full w-full object-cover" onError={() => handleImageError(image)} />
              </button>
            ))}
          </div>
        )}
      </div>

      {currentImage && (
        <div className="mt-4 flex justify-end">
          <button type="button" onClick={() => setIsFullscreen(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-primary/90">
            {labels.fullscreen}
          </button>
        </div>
      )}

      {isFullscreen && currentImage && (
        <div className="gallery-fullscreen-surface fixed inset-0 z-50 flex items-center justify-center">
          <button type="button" onClick={() => { setIsFullscreen(false); resetZoom(); }} className="gallery-overlay-control absolute right-4 top-4 z-10 p-2 transition-colors" aria-label={labels.closeFullscreen}>
            <X className="h-8 w-8" />
          </button>
          <div className="relative flex h-full w-full items-center justify-center">
            <img src={currentImage} alt={altText} decoding="async" className="max-h-full max-w-full object-contain transition-transform duration-300" style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center" }} onError={() => { handleImageError(currentImage); setIsFullscreen(false); }} />
            {availableImages.length > 1 && (
              <>
                <button type="button" onClick={handlePrevious} className={`gallery-fullscreen-button absolute top-1/2 -translate-y-1/2 rounded-full p-3 transition-all ${isRTL ? "right-4" : "left-4"}`} aria-label={labels.previous}>
                  {isRTL ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
                </button>
                <button type="button" onClick={handleNext} className={`gallery-fullscreen-button absolute top-1/2 -translate-y-1/2 rounded-full p-3 transition-all ${isRTL ? "left-4" : "right-4"}`} aria-label={labels.next}>
                  {isRTL ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
                </button>
              </>
            )}
            <div className="gallery-overlay-surface absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg p-3">
              <button type="button" onClick={handleZoomOut} disabled={zoomLevel <= 1} className="gallery-overlay-control p-1 transition-colors disabled:opacity-50" aria-label={labels.zoomOut}><ZoomOut className="h-5 w-5" /></button>
              <span className="min-w-[4rem] text-center text-sm font-medium">{Math.round(zoomLevel * 100)}%</span>
              <button type="button" onClick={handleZoomIn} disabled={zoomLevel >= 3} className="gallery-overlay-control p-1 transition-colors disabled:opacity-50" aria-label={labels.zoomIn}><ZoomIn className="h-5 w-5" /></button>
            </div>
            {availableImages.length > 1 && <div className={`absolute top-4 text-lg font-medium ${isRTL ? "right-4" : "left-4"}`}>{safeIndex + 1} / {availableImages.length}</div>}
          </div>
        </div>
      )}
    </>
  );
}
