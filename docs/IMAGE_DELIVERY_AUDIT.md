# Active Image Delivery Audit

**Scope:** actively rendered public imagery only. This audit deliberately excludes legacy local files that have no current source reference, because generating derivatives for unused assets does not improve visitor delivery and would add deployment weight.

| Active surface | Current delivery | Verified action | Rationale |
| --- | --- | --- | --- |
| Homepage primary scene | Existing WebP hero media | Retained | The primary visual is already delivered as WebP. |
| Homepage portrait | `sheikh-portrait-1.jpeg`, 12.6 KB | Added `decoding="async"` and `fetchPriority="high"` | A quality-82 WebP test saved only 770 bytes, so a second derivative is not justified; the image is now prioritised as a visible hero asset. |
| Hero slideshow manifest | Existing WebP slides | Retained | All manifest slide files are already WebP. |
| Brand archive cards | Managed watch images | Deferred decode, lazy loading, responsive `sizes` already applied | These card images are noncritical and use browser-native deferred delivery. |
| Watch detail gallery | Managed watch images | Native loading, decoding, and fetch-priority hints already applied | Gallery assets remain dynamic and source-sensitive, so they are not frozen into a static cache. |
| Public Sheikh Gallery | Managed S3/media proxy | Retained | Media is persisted through the managed storage path with retry and cache-control handling. |

## Findings

The project contains a large historical local JPEG footprint, but a source-reference audit found that the currently rendered primary slideshow uses WebP and the directly rendered homepage portrait is only 12.6 KB. The two other source-referenced Sheikh JPEGs belong to the dormant `verifiedWatches` dataset; the dataset has no active consumer in the current public route graph. They were therefore not replaced.

The remaining high-resolution image requirement is a **content acquisition** task. Original licensed high-resolution Sheikh and watch assets are required before new gallery media can be prepared and published. No unverified imagery or generated replacement has been added.
