# Sheikh Ammar Horology Museum — Project State

## Release
Version: V1.0.0
Status: IN PROGRESS

## Canonical source
Repository: `OgSmiley1/sheikh-ammar-horology-gallery`
Integration branch: `astro/v1-completion`
Current integration commit: `582ebdc206125212df2931c0bf74576af1798242`
Target release branch: `main`
Target tag: `v1.0.0`

## Production
Platform: Railway
Project: Sheikh Ammar Horology Museum
Production environment: `20f51a85-d825-498f-9e5a-539310cb2855`
Canonical target service: `museum-current`
Current production branch binding: `release/museum-current-v2`
Current production domain: `museum-current-production.up.railway.app`
Status: NOT YET SYNCED TO V1

Secondary service: `museum-vision`
Current branch binding: `feat/majlis-of-time-v2`
Policy: compare for unique useful work, then retire after V1 is live-verified.

## Completed
- Recovered the real Claude Code state from Git rather than chat claims.
- Created the V1 integration branch from Claude's latest pushed work.
- Added V1 release manifest and completion evidence matrix.
- Added bilingual Haute Horlogerie terminology guidance.
- Added dependency-free static and live verification scripts.
- Rebuilt Timeline presentation so years remain visible on mobile.
- Added Arabic-Indic rendering for visible timeline/biography year markers.
- Reordered all 33 watch folios to an editorial-first hierarchy.
- Verified 33/33 folios remotely: `.story` appears before `.spec`.
- Kept the Quraysh editorial note before the technical record.
- Updated homepage language to incorporate owner-video direction:
  - “Three Timepieces. Three Expressions of Time.”
  - «ثلاث قطع. ثلاث لغات للوقت.»
  - “When a Moment Deserves to Last”
  - «حين تستحق اللحظة أن تطول.»
- Refined the Sheikh Ammar profile with the official title:
  - Crown Prince of Ajman
  - Chairman of the Executive Council
  - ولي عهد عجمان
  - رئيس المجلس التنفيذي
- Upgraded selected bilingual terminology toward a restrained Haute Horlogerie register.

## In progress
- Full Arabic/RTL deep visual audit.
- Patron/Profile visual QA after copy and role treatment changes.
- Timeline visual QA across all six target viewports.
- Owner-video visual acceptance pass.
- Responsive image/media optimization.
- Final public metadata/canonical URL migration away from stale GitHub Pages references.

## Known content issues requiring verification or owner decision
- `richard-mille-rm-65-01` image/identity conflict.
- `patek-philippe-5470p` image/identity conflict and possible 5271P separation.
- `tudor-black-bay-chronograph-pink-dial` image mismatch.
- F.P. Journe Tourbillon Souverain identity/duplication questions.
- Possible additional Cartier, Breitling and other evidenced pieces.
- Certificate count consistency for the RRR set.
- Public valuation policy remains unchanged unless explicitly decided.

## Deployment map
- `main`: older canonical branch, not yet V1.
- `claude/watch-website-master-plan-x2gsgo`: recovered Claude source branch.
- `astro/v1-completion`: active V1 integration branch.
- Railway `museum-current`: older release branch, must move to final `main` only after gates pass.
- Railway `museum-vision`: older vision branch, must not remain a competing production version after V1 verification.

## Release blockers
- Do not merge/deploy as V1 until visual QA and responsive/media pass are complete.
- Do not declare DONE before final Railway deployment is opened and verified in Arabic, English, mobile and desktop.
- Do not enable a second competing GitHub Pages production site.

## Exact next action
Run the full visual/RTL acceptance pass on Timeline, Patron, Home, Films and representative folios; fix any measured defects; then complete responsive media optimization and consolidate into a release candidate for `main`.
