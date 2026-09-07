# Royal Gallery Editorial Refinement

## Non-commercial boundary

The public experience was revised from a sales-adjacent catalogue to a gallery. Visible “Price on Request,” valuation rows, value filters, price-ranked curation, offer schema, and public reference-value treatments were removed from the principal visitor journeys. Administrative import fields remain internal content-management data and are not presented to visitors as commercial offers.

## Homepage story sequence

The homepage now introduces a three-part autonomous **Model Study** sequence. It uses existing archive-record media only, adds no downloaded third-party assets, pauses for reduced-motion preferences, exposes accessible previous/pause/next/progress controls, and clearly states that it does not offer watches for sale. The English and Arabic copy is written separately, with Arabic model names supplied for the new story treatment rather than falling back to English.

| Story | Existing archive record | Editorial focus | Boundary |
| --- | --- | --- | --- |
| 01 | H. Moser Endeavour Tourbillon Concept Vantablack, ref. 1804-0212 | Vantablack dial and flying tourbillon | Source-conscious model study; no ownership or sales assertion. |
| 02 | Audemars Piguet Royal Oak Perpetual Calendar, ref. 26579CS | Blue ceramic and perpetual calendar | Source-conscious model study; no ownership or sales assertion. |
| 03 | Audemars Piguet Royal Oak Perpetual Calendar, ref. 26579CB | White ceramic and perpetual calendar | Source-conscious model study; no ownership or sales assertion. |

## Visual observation

The selected local H. Moser asset exists and contains a composited portrait-and-watch image. A subsequent fresh rendering pass confirmed that the large image and softened full-bleed backdrop render correctly. Arabic story names were corrected to avoid English fallbacks. A further English pass showed the carousel had advanced from its initial H. Moser frame to an Audemars Piguet frame, confirming autonomous progression. Both language layouts preserve the requested composition: image on the right and editorial copy on the left in Arabic; image on the left and copy on the right in English.

After checkpoint `e8a36a82`, two cache-busted public-domain requests still returned the prior portrait-led homepage artifact. This is deployment propagation behavior, not a local application regression: the running application and production build contain the new sequence, but the live domain has not yet served it. The final live-domain validation remains pending until the current artifact propagates.

A browser service-worker diagnostic found an active public-site worker. Unregistering it locally and reloading with a fresh cache-busting URL still returned the same prior homepage artifact. The stale response is therefore not explained by the local browser service-worker cache.

After the subsequent successful deployment notification, the public domain served the new homepage sequence. The English view showed the H. Moser model study, large image frame, softened watch backdrop, non-commercial boundary, and story controls. The Arabic view showed the Audemars Piguet blue-ceramic study with Arabic model name and copy, image placed on the right and text on the left, and the same pause/previous/next/progress controls. The current public release therefore completes the English/Arabic live review.
