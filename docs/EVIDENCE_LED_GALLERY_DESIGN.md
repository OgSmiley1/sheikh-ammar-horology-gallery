# Evidence-Led Gallery Design

## Creative Direction

The advanced Collection will be a **quiet catalogue of evidence**, not a decorative inventory. The atmosphere is a contemporary study room: mineral paper, bronze index marks, night-olive reference panels, and large breathing space around every watch. The most memorable interaction is an **Archive Lens** that lets a visitor choose a mode of reading—by maison, release chronology, or archival classification—without ever confusing a visual lead with a confirmed personal record.

| Layer | Visitor purpose | Design treatment | Trust boundary |
|---|---|---|---|
| **Archive index** | Understand the scope in one glance | Numbered records and clear maison count on a quiet opening slab | Counts reflect live published records only. |
| **Archive Lens** | Reorganise the same records without extra filtering work | Three editorial buttons that move the visitor directly to a legible filter surface | It changes order, not evidence status. |
| **Record card** | Recognise a watch and read its classification | Controlled image plane, catalogue number, maison, model, reference, and classification line | No image badge makes a source or ownership claim. |
| **Source note** | Understand the collection’s editorial boundary | Short provenance statement before filtering and on each detail page | Public reports and maker information stay distinct. |
| **External film** | Take a supplementary viewing path | Clearly credited external reference, separated from the archive records | The embedded video proves neither ownership nor completeness. |

## Bilingual Composition

English maintains the image-left / contextual-copy-right rhythm on broad editorial modules. Arabic mirrors this to image-right / contextual-copy-left. Record grids use the same card geometry in both languages; the index number moves to the outer edge so the reading direction remains natural.

## Interaction Standard

A visitor reaches an archive lens, applies it, and reaches the live filter surface in no more than two interactions. The first screen contains one clear action; secondary interpretation is progressively disclosed. All movement remains gentle, keyboard-compatible, and disabled for reduced-motion preferences.

## Source and Translation Audit

On 26 August 2026, the supplied research leads were reviewed against manufacturer, auction, and attributable-public-post sources recorded in `SUPPLIED_MEDIA_LEAD_LEDGER.md`. The active Patek Philippe 5278/500G-001, Patek Philippe 5271/11P-010, Richard Mille RM 26-02, Richard Mille RM 68-01, and Rolex 6263 record narratives were reworked to source-bounded model context.

Thirty-two active Arabic descriptions were then audited. Twenty-five translations passed a structured second-pass quality gate and were applied transactionally; three grammar-sensitive translations were corrected manually; the remaining three records were rewritten separately as bilingual source-boundary corrections. Official brand, model, and calibre names are retained where that is clearer than transliteration. No bulk update added ownership, price, availability, or public-appearance claims.

## Source-Safe Visual Remediation

During the Collection implementation review, ten active records were found to use the same third-party Arab Watch Guide composite host as their public card image. The related `watchImages` table held no supporting gallery-image records. These ten `mainImageUrl` values were cleared; the public Collection now renders a bilingual **record visual pending source clearance** plate in their place. A post-update database check confirmed that zero active card images remain on that identified third-party composite host.

The development Collection was reviewed in Arabic after the remediation. It renders the 40-record, nine-maison archive; the source-boundary note, external video separation, Archive Lens, numbered record cards, and clearance plates all remain coherent and keyboard-accessible. English uses the mirrored component order and the same evidence boundary.

## Legacy-Site Video Reference

The user-supplied `..._3970.mp4` was analysed as a visual and structural reference. It is a screen recording of the earlier Royal Collection website and includes an embedded IFL Watches YouTube feature, dated watch labels, and a visible “Made with Manus” mark. It has informed the current gallery’s clean index rhythm and external-film placement only. It is not treated as original watch footage, image permission, or proof of any individual watch pairing.

## Public-Edge Review Status

The public Collection route was checked after checkpoint `c2d9be3e`. Its live database returned the 40-record, nine-maison archive, but the visible page shell still used the preceding module: it showed the prior **Archive Orientation** wording and lacked the source-boundary reading note, the new Archive Lens labels, and the source-clearance record plates. This confirms public-edge propagation of the older lazy module rather than a development or data failure. The route will receive a versioned offline-shell and distinct route-artifact refresh before final public bilingual review.

The offline shell was advanced from `royal-horology-shell-v4` to `royal-horology-shell-v5`, and the Collection route was refreshed with a distinct `source-safe-archive-lens-v1` marker. The cache contracts, TypeScript, all 23 regression files / 125 tests, and the production build passed before republishing.

The public Arabic Collection was then rechecked at `?release=fd8a4d47&cache=v5`. The current source-safe module is live: the 40-record / nine-maison count, **“سجلات لا روايات مرسلة”** source boundary, the three numbered Archive Lens pathways, and multiple **“الصورة بانتظار توثيق المصدر”** plates appeared as intended. No Arab Watch Guide card image was visible in this public render. The remaining public review is the English mirror, lens interactions, and selected bilingual record-detail checks.

The public English mirror was confirmed in the same release. It presents **Records, not rumours**, explicitly states that model context is not an ownership statement, reports 40 archive records across nine maisons, and renders the matching **Record visual pending source clearance** plate. The English classification pathway reaches the live archive controls while preserving the source-boundary panel above it.

During public interaction inspection, the Archive Lens pathways reached the filter surface. A browser-automation click initially reported the default maison sort, but activating the same public classification control directly confirmed the committed interaction: it sets the sort control to `rarity` and moves `aria-pressed="true"` from **By maison** to **By classification**. This is the expected visible reordering and accessible active indication; the remaining checks cover the other two pathways and Arabic mirrored activation.

The public English pathway set was then exercised in sequence. **By classification**, **By maison**, and **By chronology** respectively committed `rarity`, `brand`, and `year` to the public sort control, with the selected pathway reporting `aria-pressed="true"` in each case. The public page was switched back to Arabic and retained the mirrored RTL layout, Arabic source boundary, 40-record count, and right-hand image / left-hand contextual-copy treatment on wide editorial modules.

The Arabic pathway set was also exercised in sequence: **من زاوية التصنيف**, **من زاوية الدار**, and **من زاوية التسلسل** committed `rarity`, `brand`, and `year` respectively. The corrected public Arabic Patek Philippe 5278/500G-001 route was then reviewed. It identifies the 2025 40 mm white-gold cathedral-gong minute repeater “Horse”, the 20-piece edition, and states that the record offers documented model context only and does not establish private ownership or public appearance.

Two further corrected public Arabic routes were reviewed. Patek Philippe 5271/11P-010 is presented as a platinum, manual-wind perpetual-calendar chronograph with blue lacquer / black gradient dial, CH 29-535 PS Q, and a 65-hour reserve, while limiting the record to verified model context. Richard Mille RM 26-02 is presented as a 25-piece manual-wind tourbillon with hours, minutes, power reserve, hand-carved eye-and-flame motif, and Grand Feu dial; it explicitly does not establish public appearance or private ownership. Neither route includes commercial availability or pricing language.

The Rolex 6263 record was confirmed to contain a correct bilingual Sotheby’s auction-context description in the live database, but its Arabic rendering was suppressed because the public guard treated the explicitly negative phrase **“لا يثبت شخصًا بعينه يرتديها”** as a positive wearer claim. The guard now keeps explicitly negated Arabic ownership / wearer boundaries visible while continuing to reject unsupported positive claims. A focused regression test was added; TypeScript, the complete test suite, and the production build pass before publication.

After publication, the live Rolex 6263 route still omitted the Arabic description despite the database read-back and the tested guard update. Browser resource inspection showed a preceding public WatchDetail lazy artifact (`WatchDetail-i9aBKhhO.js`) rather than the newly built module. This is an isolated public-edge artifact propagation issue; a targeted WatchDetail route marker and cache refresh will be issued before the final public confirmation.

The targeted refresh has now been prepared: the WatchDetail route has a `source-boundary-description-v1` release marker and the network-first public shell has advanced to `royal-horology-shell-v6`. TypeScript, the complete test suite, and the production build passed with a fresh WatchDetail output artifact before republishing.

The RM 68-01 detail review also identified that its old local composite asset remained assigned despite the prior source boundary. As no original or explicit rights clearance has been supplied for that composition, its active `mainImageUrl` was cleared from the live record and the database read-back confirmed `NULL`. The Collection will now use the same source-clearance plate as other unqualified records. A rights-cleared original mapped to record `60025` remains required before restoring a watch visual.

Final public verification on release `184d222d` passed. The Arabic Rolex 6263 route now visibly renders the Sotheby’s auction-context narrative and clearly states that it does not establish an identified wearer, public appearance, or private ownership. The RM 68-01 record now appears in the public Arabic Collection as a **“الصورة بانتظار توثيق المصدر”** plate, while the 40-record / nine-maison count, source-boundary note, and Archive Lens remain live. These checks complete the public propagation and evidence-led gallery implementation; the only remaining work is external source confirmation for unresolved leads and owner-provided rights-cleared original imagery.
