# Customer Journey Audit

**Purpose:** Verify the public site as a first-time visitor would experience it before any uploaded-media work resumes.

## Initial Live Findings

| Journey | Result | Evidence / action |
|---|---|---|
| Public homepage | **Working** | The public Arabic homepage loaded its dark-vault hero, Watch Stories controls, primary navigation, 41-record / nine-maison measures, and entry links. |
| Primary Collection navigation | **Working** | The header route reached the Collection, which rendered 41 archive records, source boundary, Archive Lens, search, brand filter, rarity filter, sort, record links, and source-clearance plates. |
| Non-commercial wording | **Corrected and verified** | The Patek Philippe ref. 5326G-001 availability-like classification was removed. Its public Collection card no longer presents “available” or comparable commercial wording. |
| Primary Stories navigation | **Working after normal route load** | The initial loading state resolved into the Arabic editorial-stories page, which exposes three direct story controls, Previous / Next controls, and a return-to-Collection link. |
| Stories interaction | **Working** | The Next control advanced the public visitor journey from story 1 / 3 (Rolex Daytona Paul Newman) to story 2 / 3 (Patek Philippe Nautilus). |
| English language switch | **Working** | The Stories route switched from Arabic to English and retained the same story position, readable copy, carousel controls, return path, and primary navigation. |
| Primary About navigation | **Working after normal route load** | The route resolved into the full public profile with its official-source link, archive-boundary explanation, cultural context, FAQ disclosure controls, and Collection path. |
| More navigation | **Working** | The open More menu exposes eight secondary visitor routes: Sheikh Gallery, Constellation of Time, Horology Discovery, Compare, Virtual Tour, Advanced Search, Timeline, and Contact. Representative route checks continue. |
| Sheikh Gallery | **Working after normal route load** | The route resolves into the curated DIW Motley Carbon Daytona feature, displays the existing project-supplied feature photo, concise specifications, the detail-record link, and Previous / Next feature controls. |

Further route, language, and interaction checks continue after this wording correction.

## Full-Site Visual Rollback

The public interface previously mixed a dark-vault homepage with light secondary pages. The shared public theme now defaults to the historic dark-and-gold system for every route, replacing the preceding green-tinted dark mode with near-black ink, burnished gold, warm paper, and restrained bronze surfaces. Existing visitor layouts, bilingual RTL behavior, source boundaries, live archive data, and administrator session protection are retained. The legacy light-theme preference key is intentionally superseded so returning visitors receive the restored default once; the theme control remains available after the reset. TypeScript, the full regression suite, and the production build pass before public verification.
