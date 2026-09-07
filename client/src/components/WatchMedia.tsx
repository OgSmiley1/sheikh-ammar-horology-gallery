import { ImageOff } from "lucide-react";
import { useState } from "react";

export type WatchMediaLanguage = "en" | "ar";
export type WatchMediaFit = "contain" | "cover";

interface WatchMediaProps {
  imageUrl?: string | null;
  alt: string;
  brandName?: string;
  watchName?: string;
  reference?: string | null;
  language?: WatchMediaLanguage;
  recordIndex?: string;
  fit?: WatchMediaFit;
  className?: string;
  imageClassName?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  pendingTitle?: string;
  pendingBody?: string;
  priority?: "default" | "high";
}

export function normaliseProjectImageUrl(imageUrl?: string | null) {
  const value = imageUrl?.trim();
  if (!value) return null;
  if (value.startsWith("/watches/") || value.startsWith("/watches-verified/") || value.startsWith("/manus-storage/")) return value;
  return null;
}

export function WatchMedia({
  imageUrl,
  alt,
  brandName,
  watchName,
  reference,
  language = "en",
  recordIndex,
  fit = "contain",
  className = "",
  imageClassName = "",
  loading = "lazy",
  fetchPriority = "auto",
  pendingTitle,
  pendingBody,
  priority = "default",
}: WatchMediaProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const source = normaliseProjectImageUrl(imageUrl);
  const hasImage = Boolean(source && source !== failedUrl);
  const isRTL = language === "ar";
  const defaultTitle = isRTL ? "صورة السجل قيد الربط" : "Archive image pending";
  const defaultBody = isRTL
    ? "يُحفظ هذا السجل في الأرشيف إلى حين ربط صورة مؤكدة من ملفات المشروع."
    : "This record remains in the archive until a confirmed project image is associated.";

  return (
    <div
      className={`watch-media-surface relative flex h-full w-full items-center justify-center overflow-hidden ${hasImage ? "watch-media-surface--image" : "watch-media-surface--placeholder"} ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
      data-media-state={hasImage ? "image" : "placeholder"}
    >
      {hasImage ? (
        <img
          src={source!}
          alt={alt}
          className={`watch-media-image h-full w-full transition-transform duration-700 ease-out ${fit === "cover" ? "object-cover" : "object-contain"} ${imageClassName}`}
          loading={loading}
          decoding="async"
          fetchPriority={priority === "high" ? "high" : fetchPriority}
          onError={() => setFailedUrl(source)}
        />
      ) : (
        <div className="watch-media-placeholder" aria-label={pendingTitle || defaultTitle}>
          <span className="watch-media-placeholder__index" aria-hidden="true">{recordIndex || "—"}</span>
          <span className="watch-media-placeholder__ring" aria-hidden="true" />
          <div className={`watch-media-placeholder__copy ${isRTL ? "text-right" : "text-left"}`}>
            <ImageOff className="mb-4 h-5 w-5 text-primary/80" aria-hidden="true" />
            {brandName && <p className="watch-media-placeholder__brand">{brandName}</p>}
            <p className="watch-media-placeholder__title">{pendingTitle || defaultTitle}</p>
            <p className="watch-media-placeholder__body">{pendingBody || defaultBody}</p>
            {(watchName || reference) && (
              <p className="watch-media-placeholder__reference">
                {watchName}{watchName && reference ? " · " : ""}{reference}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
