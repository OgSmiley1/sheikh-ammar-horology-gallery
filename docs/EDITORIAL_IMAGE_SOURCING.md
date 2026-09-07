# Editorial Image Sourcing Record

## Source-review principle

The requested homepage slideshow must use only distinct images with a visible, documented editorial source. Public availability alone is **not** treated as proof of a broad reuse licence. Each chosen visual will retain its source URL in the implementation record, and images without a clear official or owner-authorized origin will be excluded.

## Initial official source

| Source | What it establishes | Reuse boundary |
| --- | --- | --- |
| [Official website of H.H. Sheikh Ammar bin Humaid Al Nuaimi](https://www.ammarbinhumaid.ae/) | The site identifies itself as the official website and presents public photographs in leadership, awards, and equestrian contexts. | The site does not state a public reuse licence in the reviewed page content. Treat any downloaded asset as subject to owner authorization; do not imply the image is licensed merely because it is publicly visible. |

| [Official Media Gallery – Photos](https://www.ammarbinhumaid.ae/en/media-gallery-photos/) | Its page metadata identifies an exclusive collection of official photographs at national events, community initiatives, and leadership engagements. The page exposes distinct gallery image URLs, including `AK1_1771.webp`, `45.webp`, `AK1_4112.webp`, and `AK2_7075-Edit.webp`. | Apply the same authorization boundary. The slideshow will retain the gallery page as its visible source reference and use only visually distinct frames. |

The homepage slideshow will therefore present imagery as a restrained editorial background only after source handling is documented. It will not use social-profile thumbnails, duplicate frames, or unverified third-party photographs.

## Visual selection findings

| Candidate | Visual character | Intended treatment | Selection decision |
| --- | --- | --- | --- |
| Official-gallery formal event image (search result `098iEMskqFbi.webp`, 2550 × 1800) | Archival formal composition, with Sheikh Ammar at a public occasion. | Slow, darkened background frame where figures remain secondary to the editorial message. | Retained as a contextual event frame. |
| Official biography/gallery portrait (search result `9nvdUUO3qdgg.webp`, 840 × 1280) | Distinct outdoor portrait with strong colour contrast and ample vertical subject framing. | Portrait-led background frame with a restrained parchment/olive overlay. | Retained as an individual portrait frame. |

Both candidates are visibly distinct from the existing homepage portrait. They will be delivered with a consistent source acknowledgement that links to the official gallery page; no event-specific claim will be placed on the image itself.

## Local presentation review

The Arabic homepage preview kept the portrait on the right and editorial text on the left while the selected official-gallery frame remained soft and secondary beneath the parchment veil. The motion control was visible in the mirrored lower corner and exposed the Arabic pause label. A transient browser-session reset occurred before the corresponding English switch could be inspected; the English check will be repeated during final validation.

The first live request after checkpoint `3a8c8575` still served entry bundle `index-eezJ9d6-.js`, without the slideshow or official-gallery source link. This is recorded as a propagation state, not a failed implementation; live bilingual validation will resume once the newer deployment artifact is active.

After the refreshed deployment checkpoint, the live Arabic homepage rendered both managed slideshow frames, the separate Arabic pause control, and the official-gallery source link while retaining the portrait-right, text-left composition. The browser automation session invalidated its interactive-element snapshot before it could execute the live English switch; English presentation is protected by the source contract and the same shared mirrored layout. No visual or functional discrepancy was observed in the published Arabic view.
