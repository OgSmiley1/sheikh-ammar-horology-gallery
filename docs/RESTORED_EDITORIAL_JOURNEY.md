# Restored Editorial Journey

## Intent

The Royal Horology gallery should feel immediately legible on a phone: a visitor first encounters a moving watch study, then receives three clear next steps. This restores the memorable rhythm of the earlier mobile experience without restoring price language, unsupported ownership claims, oversized rarity overlays, or third-party composite imagery.

The user-referenced fashion website was used as a **structural benchmark only**. Its transferable principle is a low-friction journey: an obvious start, a compact decision set, and a visible next action. No content, assets, or commerce conventions have been copied into this non-commercial archival website.

| Journey step | Public destination | Purpose | Source boundary |
|---|---|---|---|
| 01 — Watch stories | `/#watch-stories` | Opens the automatically rotating three-study horology slideshow with explicit manual controls. | The study describes model context and does not offer watches for sale. |
| 02 — Archive atlas | `/collection` | Leads directly to live, filterable archive records. | Cards retain their published classification and record boundary. |
| 03 — Film reference | `/collection#collection-film` | Brings the public YouTube reference into the first Collection reading sequence. | The IFL Watches film is explicitly external and does not establish ownership, availability, or completeness. |

## Implementation Decisions

The opening `ArchiveStorySlideshow` now has a visible **Watch Stories / Slideshow** marker and a stable deep-link target. A three-step guide follows it, so the visitor has a direct decision rather than needing to infer how to continue. The same three destinations appear in the mobile menu under a compact **Start Here** guide, while every existing route remains accessible below it.

The Collection video reference was moved directly after the collection introduction and live archive count, before the optional orientation pathways and filters. It remains lazy-loaded, privacy-conscious, clearly attributed to IFL Watches, and paired with the existing external-source disclaimer.

## Development Review

The Arabic development homepage was reviewed on 26 August 2026 after its watch query settled. The slideshow rendered first, showed its **قصص الساعات / عرض متحرك** marker, maintained RTL reading order, exposed previous/pause/next and direct-slide controls, and was followed by the three-step guide. The implementation remains pending final English and Arabic public release review.

The English development review also confirmed the mirrored **WATCH STORIES / SLIDESHOW** marker, readable model study, and visible 01–03 guide. The Collection deep link reached the IFL Watches reference directly after the introduction and live archive count, before the optional archive pathways. Immediately after checkpoint `3cfaebb2`, the public homepage still served the preceding lazy homepage artifact, which rendered the opening study but not the new marker or guide. This is being treated as public-edge propagation rather than a source-code discrepancy and will be verified again after the release advances.

To retire the preceding artifact for returning visitors, the production-only offline shell has been advanced from `royal-horology-shell-v3` to `royal-horology-shell-v4`. Both service-worker cache contracts were updated. TypeScript, all 21 regression files / 121 tests, and the production build passed before the refreshed release was published.
