# Sheikh Ammar Horology Museum — Project State

## Release
Version: V1.0.0
Status: IN PROGRESS — SOURCE CONSOLIDATED, RAILWAY PROMOTION BLOCKED

## Canonical source
Repository: `OgSmiley1/sheikh-ammar-horology-gallery`
Integration branch: `astro/v1-completion`
Last source head inspected before this state update: `68ae7cc514f354d2e1515df98eb36eeaaf1f6513`
Target release branch: `main`
Target tag: `v1.0.0`

## Canonical public application
Production source: `museum/dist/`
Reference / Claude archive: `docs/`
Collection: **42 bilingual records**

The V1 integration branch now contains both the current Railway museum and the strongest verified Claude work. Do not deploy the older 33-record `docs/` experience over the 42-record museum.

## Implemented in canonical V1 source
- Owner-video headline: «ثلاث قطع. ثلاث لغات للوقت.»
- English counterpart: “Three Timepieces. Three Expressions of Time.”
- Film chapter: «حين تستحق اللحظة أن تطول.» / “When a Moment Deserves to Last.”
- Haute Horlogerie vocabulary pass.
- Curated featured three made explicit rather than JSON-order dependent.
- Mobile detail dialog rebuilt as a full-screen editorial sheet; story precedes technical record and specs collapse to one column.
- Repeated film/story portrait usage reduced with a separate film poster.
- Favicon added to remove the live 404.
- Exhibition route consolidated into V1 with Quraysh / FFC / RM 65-01 McLaren W1.
- Five-link navigation includes Exhibition, with a 1000px pre-wrap mobile-menu breakpoint.
- Railway Dockerfile now runs `npm test` before serving the release.
- `railway.json` restored to source control.

## Verified source gates
- 42/42 canonical records present.
- 42/42 records have local display images.
- 4/4 V1 route shells contain the Exhibition link and favicon.
- `app.js` syntax valid.
- `vision.js` syntax valid.
- All three Exhibition slugs exist in the 42-record ledger.
- Remote recursive Git-tree verification found zero missing V1 source requirements.

## Media audit
- 45 watch-image assets: ~4.61 MB total.
- Largest watch image: ~395 KB.
- Sheikh image set: ~0.54 MB total.
- Collection film: ~8.9 MB; loaded on demand and served with byte-range support.

## Railway
Project: Sheikh Ammar Horology Museum
Environment: production
Current public service: `museum-current`
Secondary service: `museum-vision`

Production has **not** been modified.

### Verified deployment blocker
Both existing Railway services remain pinned to old source commit SHAs. A Railway redeploy reuses the old snapshot and does not fetch the new GitHub HEAD.

Attempts made:
- Repoint through Railway AI agent: blocked by Railway agent usage limit.
- Create a replacement `museum-v1` service from the correct branch: blocked by Free plan resource provision limit.
- Git branch advancement + normal redeploy: Railway still reports the old pinned commit.

Therefore no final live V1 claim is permitted yet.

## GitHub QA infrastructure
A V1 workflow was added, but hosted jobs currently fail before any step is allocated across multiple commits. The workflow is now manual-only to avoid false failing PR noise. This is tracked as infrastructure, not as a passing test claim.

## Exact next action
Once Railway source editing becomes available (agent limit reset or plan/resource capacity changes), point one existing service—preferably `museum-current`—to the final V1 release commit/branch, allow its Docker build to run `npm test`, then perform live Arabic/English/mobile/desktop visual QA. Only after that: merge/tag/promote and retire competing old services.
