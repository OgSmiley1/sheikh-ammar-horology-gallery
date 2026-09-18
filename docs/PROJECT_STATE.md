# Sheikh Ammar Horology Museum — Project State

## Release
Version: V1.0.0
Status: IN PROGRESS

## Canonical source
Repository: `OgSmiley1/sheikh-ammar-horology-gallery`
Integration branch: `astro/v1-completion`
Current integration commit: `80a3eabf2fed1c3b6869f2c5785471c982673ef3`
Target release branch: `main`
Target tag: `v1.0.0`

## Canonical public application
**Production source:** `museum/dist/`
**Reference / Claude archive:** `docs/`

The current Railway museum is a newer 42-record bilingual experience served from `museum/dist`.
Claude's `docs/` museum contains important design, accessibility and editorial improvements, but it is
not the application currently served by Railway. V1 therefore consolidates the best verified work from
both paths into `museum/dist` rather than replacing the live experience with the older 33-record site.

## Production
Platform: Railway
Project: Sheikh Ammar Horology Museum
Production environment: `20f51a85-d825-498f-9e5a-539310cb2855`
Canonical target service: `museum-current`
Current production branch binding: `release/museum-current-v2`
Current production domain: `museum-current-production.up.railway.app`
Current public app source: `museum/dist`
Status: HEALTHY CURRENT RELEASE, NOT YET SYNCED TO V1

Secondary service: `museum-vision`
Current branch binding: `feat/majlis-of-time-v2`
Policy: compare for unique useful work, then retire after V1 is live-verified.

## Completed
- Recovered the real Claude Code state from Git rather than chat claims.
- Created V1 integration branch from Claude's latest pushed work.
- Imported the complete current Railway `museum/` subtree into the same V1 branch.
- Established `museum/dist` as the canonical public V1 application.
- Preserved `docs/` as a reference/legacy design source instead of deleting Claude's work.
- Added V1 release manifest and evidence matrix.
- Added bilingual Haute Horlogerie terminology guidance.
- Added static and Railway live-verification scripts.
- Reconstructed Claude's interrupted Timeline work in `docs/`.
- Reordered and remotely verified 33/33 legacy watch folios to editorial-first hierarchy.
- Updated legacy homepage wording with the owner's video phrases.
- Refined legacy Sheikh Ammar profile with official title terminology.
- Verified Railway currently serves the newer 42-record museum and real traffic receives HTTP 200 responses.

## In progress — canonical Railway V1
- Port owner-video language and strongest Claude editorial ideas into `museum/dist`.
- Improve the mobile timepiece-detail experience shown in the walkthrough.
- Upgrade Arabic/English horological vocabulary consistently in `museum/dist/app.js`.
- Fix live favicon 404.
- Audit the 42-record `museum/dist/watches.json` rather than regressing to the older 33-record ledger.
- Full Arabic/RTL and English visual QA.
- Responsive media/performance pass.
- Final metadata and production-domain cleanup.

## Deployment map
- `main`: older canonical branch, not yet V1.
- `claude/watch-website-master-plan-x2gsgo`: recovered Claude source.
- `release/museum-current-v2`: source of the current Railway museum imported into V1.
- `astro/v1-completion`: single active V1 integration branch containing both histories.
- Railway `museum-current`: canonical production target after V1 gates pass.
- Railway `museum-vision`: temporary comparison source; retire only after V1 verification.

## Release blockers
- Do not deploy the older `docs/` site over the current 42-record Railway museum.
- Do not merge/deploy until `museum/dist` itself includes the required video/copy/mobile-detail improvements.
- Do not declare DONE until the final Railway V1 is verified in Arabic, English, mobile and desktop.
- Do not maintain a second competing public production version.

## Exact next action
Complete the owner-video and Haute Horlogerie editorial pass directly in `museum/dist`, beginning with
the featured-three language, film chapter and mobile detail dialog; fix favicon; then run full canonical
Railway V1 QA before merging to `main`.
