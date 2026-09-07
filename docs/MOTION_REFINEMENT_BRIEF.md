# Calm Motion Refinement Brief

## Design Direction

The supplied video establishes the correct visual standard for the Royal Horology gallery: **image first, information second, movement felt rather than announced**. The homepage should read as a quiet digital maison rather than a dense catalogue. It will keep the current documentary source boundary and bilingual archive logic, but reduce the number of visual decisions required in the first screen.

| Reference principle | Royal Horology treatment | Boundary preserved |
|---|---|---|
| Full-bleed, softly moving imagery | Keep the existing approved cinematic background as the opening atmosphere, with a slower veil and fewer competing frames. | No third-party footage or audio is imported. |
| Thin persistent utility header | Retain the existing protected shared header, but on small screens privilege the monogram, language, and menu over all secondary utility noise. | No administrator entry is added to the public shell. |
| Short, layered copy | Make the opening title, one-sentence model context, and one primary action legible before supporting details. | Claims remain limited to the source-bounded archive record. |
| Obvious next step | Keep the 01–03 journey, but visually subordinate it to the opening study and make it a clean rail rather than an equal-weight block. | The video remains an attributed external reference. |
| Quiet motion and soft reveal | Retain reduced-motion support; use only gentle opacity, image scale, and background parallax. | No artificial luxury effects, fake reviews, or false ownership claims. |

## Proposed First-Screen Order

1. A restrained header with the archive signature and core utilities.
2. The approved moving cinematic backdrop with the current study image as the dominant visual.
3. A concise watch-study label, model heading, a one-sentence source-bounded reading, and one action: **Read the record**.
4. A subdued 01–03 journey rail after the opening study, leading to the archive atlas and the attributed film reference.

## Implementation Guardrails

The treatment will preserve English image-left / copy-right and Arabic image-right / copy-left on wide screens. On mobile, the image will lead, with the copy kept to a short line measure below it. Technical specifications will remain in the detail record, not the opening screen. Motion will pause for users who prefer reduced motion, and every route will remain reachable with the existing public navigation.

## Development Review

The refined opening was reviewed in English and Arabic on 26 August 2026. The revised public header contains four primary choices—Home, Collection, Stories, and About—with deeper routes grouped in **More**. The opening study keeps the approved moving background but lowers the grid and visual treatment, exposes one compact reading paragraph, and moves the three technical facts behind a bilingual **View study details / عرض تفاصيل الدراسة** control. English retains the study image on the left and copy on the right; Arabic mirrors the composition. The 01–03 journey rail, explicit slideshow controls, reduced-motion behavior, and source notice all remain intact.

Immediately after checkpoint `6dfe9c1d`, the public domain still returned the preceding homepage lazy module, including the eight-link header and always-visible fact grid. The current development source and reviewed local build are correct. This public-edge propagation observation is documented for retry; no source or test regression was detected.

After a further propagation interval, the public homepage continued to serve that same preceding lazy module. The release requires a route-level artifact refresh in addition to the service-worker version; the source-safe motion treatment itself remains verified in the development build.

The homepage route was then refreshed with a distinct calm-motion release marker. TypeScript, all 21 regression files / 122 tests, and the production build passed before the retry publication.

The retry publication was verified successfully on the public domain in English and Arabic. The active header now exposes only Home, Collection, Stories, and About before More; the opening study shows its motion-label, concise reading, optional details control, source boundary, and 01–03 guided journey. Arabic preserves the mirrored image-right / copy-left composition. The current public artifact is the calm-motion release.
