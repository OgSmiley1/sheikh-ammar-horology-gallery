# Museum readability and photograph repair — 21 September 2026

DONE
- Restored 30 primary records to archive imagery, including Sheikh/wrist context. Existing matched full images retained; close-ups moved into a supplementary details disclosure.
- Replaced the cropped, enlarged Rolex 6100 image with the 1262 × 835 original from https://waqt.com/ar/article/rolex-6100-with-chinese-dragon-cloisonne-enamel-dial (image QH5h7VMQu8dl4obrKCf6ogzAFjDpxbom2TI626fe.jpg).
- Added shared reading.css after page styles, with 18–19 px explanatory text, Noto Sans Arabic body and guide headings, ivory reading cards, dark ink, brass accents and emerald framing. This is a design proposal; no claim is made about His Highness's personal colour preferences or formal Ajman brand compliance.
- Navigation moved to its own always-visible horizontal row; raised cards and restrained shadows. Small screens use one-column reading layouts; reduced motion is respected.
- Added chapter navigation, direct links to all nine complications, bilingual current-location indication, travel example, and a separate Submariner model-name explanation (source https://www.rolex.com/watches/submariner).
- Corrected a stale first-featured test and Arabic spelling gate that falsely matched المينا inside the correct الميناء.

VERIFIED
- Live browser inspection of /watchmaking/#complication-dual-time confirmed near-black headings on the dark background, narrow title columns and weak hierarchy.
- 22 runtime tests passed, including 44 detail records in Arabic and English and restored image/close-up behavior.
- Language gate passed: 44 timepieces and eight maisons.
- Additional JSDOM interaction check passed for all chapter/complication destinations, language direction and selected link.
- All primary and supplementary image files open successfully.
- Calculated token contrasts: main ink/card 12.62:1, secondary text/paper 6.54:1, brass/card 6.28:1, light navigation/emerald 11.37:1. These are token checks, not a rendered accessibility certification.

BLOCKED / NEEDS VERIFICATION
- The revised pages have NOT passed rendered desktop/mobile visual QA or been deployed.
- Cloud Browser could inspect the public production site but could not access the local preview. Do not claim screenshots of the modified pages exist.
- Railway museum-current has an unrelated staged isDeleted:true change (patch 18db2ead-cb4a-4b74-b085-a86eccbb6985). Do not accept/deploy this batch: it would delete the canonical service. No staged settings were modified.
- Railway web UI requires sign-in to inspect/discard the staged deletion; the connector has no discard-patch tool.
- Production currently pins ab7b82fb7b45926c756ac92cde47366ecde58d5a. After resolving the deletion, merge the reviewed repair, update that exact runtime pin and verify Arabic/English, desktop/mobile, gallery details, navigation, guide anchors and console health.
- Full npm test was not run successfully in this partial local checkout because collection-film.mp4 was not materialized. Existing remote film remains untouched.

NEXT
Complete safe Railway access and remove only the staged canonical-service deletion with the user's authorization; then publish the reviewed commit and perform rendered visual QA. Preserve one canonical V1.
