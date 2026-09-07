# Cross-Feature QA Record

This record distinguishes **verified application evidence** from checks that can only be completed after publication. It consolidates the browser and automated validation completed during the calm-luxury redesign, moderated-comment rollout, active-image audit, and latest homepage enhancements.

## Current-session preview availability note

On 17 August 2026, the managed temporary preview URL initially returned the platform’s unavailable/hibernated screen. A wake request was initiated, but the session did not yield an application page within the available interaction window. This is a **preview-availability observation**, not evidence of an application failure and not a substitute for the deterministic typecheck, regression suite, production build, or public-domain verification recorded below.

## Current-checkpoint live-domain review

After checkpoint `d9efe929` propagated, the public domain rendered the current royal editorial homepage in both Arabic and English. The Arabic pass showed the portrait on the right and editorial text on the left; the English pass showed the mirrored portrait-left/editorial-text-right composition. Both passes exposed the shared header, language controls, source-bound archive statement, motion control, official-gallery attribution, reader-reflections empty state, and the bilingual Instagram footer pathway. This review confirms the deployed page is mounting and presenting the current bilingual public shell; the responsive breakpoint and semantic contrast behavior remain additionally protected by automated contracts and the deterministic contrast audit.

## Verified evidence

| Surface | Verified interactions or contracts | Evidence status |
| --- | --- | --- |
| Public bilingual shell | English and Arabic routes were checked across desktop and compact breakpoints in the 60-case refined public-route sweep. Shared navigation, footer, directionality, source-bounded copy, and recovery states are also protected by public-shell contracts. | Passed in the prior route sweep; current shared-shell changes are covered by the 32-contract suite. |
| Collection and watch records | Collection recovery, filters, wishlist, comparison, sourced watch detail, Arabic isolation, image-gallery behavior, native sharing, and approved-comment boundaries have focused regression coverage. | Passed in current automated suite. |
| Homepage | Hero portrait delivery hints, bilingual social link, and reader-reflections section have dedicated source contracts. The reflections surface has loading, temporary-error retry, genuine empty, and approved-content states. | Passed in current automated suite. |
| Administrator workspace | Watches, Subscribers, CSV Import, Gallery, and Comments tabs were exercised under the server-backed MVP administrator session. Gallery upload, edit, batch upload, reorder, public refresh, and test-fixture deletion were verified. | Completed in authenticated browser QA before this record. |
| Comment moderation | New visitor submissions are pending by default; administrators can approve or reject them; public reads are language-scoped and approval-only. | Covered by four moderation contracts and browser verification of the Arabic/English form plus administrator empty state. |
| Build integrity | Static type checking, the complete Vitest suite, and the production build were run after the latest homepage enhancements. | `pnpm check` passed; 100 tests in 13 files passed; `pnpm build` passed. |
| Collection compass refinement | The English local collection journey was reviewed after adding the metadata-driven “Ways of reading time” compass. An initial intermediate-width review showed crowded card measures; the pathway grid was adjusted to retain two cards per row until extra-wide screens, then re-reviewed with all title and body content visible. Arabic copy and mirrored layout are protected by the shared language-rendering code and collection compass contract; the final direct Arabic click was limited by a transient browser-session reset. | Focused public-shell contract passed after the correction. |

## Explicit boundaries

The full headless public-route verifier was not repeated after the latest small homepage additions because the sandbox previously terminated it under memory pressure. Its earlier 60-case run remains valid evidence for the larger shared-shell redesign; the new social and reflections pathways are instead protected by focused source contracts, type checking, the full test suite, and a production build.

> This record does **not** claim live-domain verification. The published domain still serves an earlier checkpoint until the project owner publishes a newer checkpoint.

The deployed-domain review performed after the royal-editorial request confirmed that the public domain is still serving the older catalogue-oriented homepage. The temporary local preview address was unavailable at the time of the review, so the redesigned local composition remains subject to the automated typecheck, source contracts, production build, and a new live visual review after publication.

After the owner published the newer checkpoint, the first two live-domain checks rendered the site chrome and platform marker but no application content. This is recorded as an initial deployment warm-up observation rather than a successful live verification; the domain must be rechecked after the deployment has settled.

A subsequent warm-up retry remained blank and the browser console reported no client-side messages. Live-domain verification therefore remains open pending deployment diagnosis or recovery.

The recovery checkpoint’s locally served production preview mounted correctly. However, the live domain continued to reference the older `index-BAnxLsQp.js` entry bundle and remained blank even with a cache-busting query parameter, so the live environment has not yet picked up the repaired publication artifact.

After an additional propagation interval, a second cache-busted request still referenced `index-BAnxLsQp.js` and the React root remained empty. The automatic-chunking recovery is verified locally, while the domain remains on the stale deployment artifact.

Following the deployment-success notification, the live domain updated and mounted the full royal editorial homepage. English and Arabic were checked on the public domain: the archive-led hero, Archive Prelude, three discovery pathways, approved-reflections empty state, Instagram footer pathway, and Arabic desktop image-right/text-left composition all rendered successfully.

## Remaining production-only checks

| Check | Why it remains separate |
| --- | --- |
| Live deployed-domain verification | Requires the owner to publish the latest checkpoint, then inspect the deployed runtime. |
| Search Console validation | Requires access to the site’s Google Search Console property and post-crawl data. |
| Web Vitals monitoring | Requires live traffic and production analytics observations over time. |
