# Claude PR #21 Handoff Review

The merged GitHub pull request **#21** was reviewed as implementation context for the active React, tRPC, and database-backed Royal Horology Collection project. Its intended quality goals—accurate watch data, responsive navigation, readable gold text, reduced-motion-aware media, and careful image sourcing—align with the active project’s standards.

| PR #21 area | Review finding | Active-project disposition |
| --- | --- | --- |
| DiW Motley data | The PR describes a DiW Motley Carbon Daytona, with review corrections for a NATO-nylon strap and 5 ATM water resistance. The active project’s source ledger independently found a public DIW/Instagram size discrepancy and treats the model only as a qualified source-linked appearance lead. | Do not import the static-page data or imagery. Retain the active project’s stricter model/appearance distinction and source boundaries. |
| Navigation breakpoint | The PR corrects a static-site desktop navigation wrap between 961 px and 1220 px. | Verify the active shared React header independently; do not copy CSS from the unrelated static implementation. |
| Gold contrast | The PR reports a normal-text contrast refinement for two static-site gold tokens. | Audit the active calm-luxury tokens and real shared components independently; do not transplant unrelated colour literals. |
| Gallery banners | The PR adds slideshow banners to static `docs/` pages using collection photography. | Not adopted. The active application already has a source-documented, reduced-motion-aware homepage slideshow and must not reuse images without clear permission. |
| Repository structure | PR #21 changes `docs/assets`, static HTML, PDFs, and `seed-data.json`; the active website is a React, Vite, tRPC, and managed-database application. | The PR is **not a merge candidate** for this runtime. Individual findings are being independently verified where relevant. |

> **Conclusion:** The active project will adopt verified principles, not an incompatible static implementation. The public-watch ledger and source-bound corrections remain the authoritative active-project workstream.
