# Rendered gate RUN — 20 September 2026

The 60-case rendered matrix that the 19 Sep note recorded as **NOT RUN** (Cloud Browser
rejects localhost, no local Chromium) has now been executed against `museum/dist/` with a
local Chromium. It **failed three times on real defects**, each fixed, and now passes.

**60/60 rendered route/language/viewport checks pass. 23/23 Node/JSDOM/server tests pass.**

## Defects the gate caught

1. **Ambient backdrop rendered as an empty element for every reduced-motion visitor.**
   `initWatchAmbient()` appended `<img id="watchAmbientImage">` to the DOM *before* any
   `src` was assigned, and the only assignment sits inside `show()`, which returns early
   when `state.ambientPaused` is true. That flag is initialised from
   `prefers-reduced-motion`, so under reduced motion the image never received a src and sat
   visible at 410×886 with nothing in it. Fixed: candidates are computed first and the
   function bails if there are none, a first frame is always painted, and only the
   *cycling* is suppressed when paused — reduced motion now gets a still image, not a hole.

2. **404 on the Quraysh image on `/exhibition/`** — the collection's Lot I. A one-digit
   corruption in the filename: `...-1674302164605_800x.webp` referenced,
   `...-1674202164605_800x.webp` on disk.

3. **`images/sheikh/watchmaking-event.webp` is corrupt** — 29,998 bytes with no RIFF/WEBP
   magic; `file` reports plain `data` and no decoder accepts it. It has been corrupt since
   the commit that introduced it (`f71075a`, owner-supplied, 19 Sep), there is no valid
   copy anywhere in the repo, and it rendered as an empty 520px panel beside its caption.
   The craft scene is caption-only until a good file arrives.

## Gate hardening

`verify-museum.mjs` and `runtime.test.mjs` both asserted that this image is referenced
exactly once — an assertion about a *filename*, which a corrupt file satisfies. Both now
read the file's magic bytes and require the reference only while the image is actually
decodable. A broken image therefore cannot ship, and a correct re-supply makes the
reference mandatory again with no further code change.

## Still needs the owner

- **Re-supply `watchmaking-event.webp`.** The current bytes are unrecoverable.
- **Public path reconciliation** — unchanged and still release-blocking. `museum/dist/`
  (43 records) is what is served; the owner's directive names `docs/` (33 folios). Neither
  tree has been discarded and nothing has been deployed over the other.
- **Railway authentication** for the service source binding, per the 19 Sep next action.

## Evidence

21 screenshots at `/tmp/qa/museum-evidence` (ephemeral). Reproduce with:
`node scripts/serve.mjs` then
`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers MUSEUM_URL=http://127.0.0.1:3000 node scripts/verify-rendered.mjs`
(`museum/node_modules` needs `jsdom` plus a Playwright whose browser build matches the
installed Chromium.)

---

# Verified continuation — 19 September 2026

**V1 remains IN PROGRESS. Not deployed or accepted.**

## Current evidence (supersedes older notes below)
- Recovered remote `astro/v1-completion` at `77d61bd`, PR #26. Claude PR #22 remains draft at `4c34216`.
- Current deployed source is the static `museum/dist/` tree, served by `museum/scripts/serve.mjs`; `docs/` retains Claude's static folios and archive. No React migration. The latest owner directive names `docs/` as public: this path discrepancy needs final reconciliation before release; do not discard either tree or silently deploy the older 33-record site.
- Found two actual failing source gates: watchmaking incorrectly required app.js, and a case-sensitive Turbine check. Fixed both without removing the guide checks.
- Runtime tests incorrectly injected exhibition-only vision.js into every route. Fixed mounting to match each actual page.
- Added royal editorial chapters on education, heritage and horology, with the official biography linked. Verified biography, title and selected milestones against the official biography and WAM on this date.
- Arabic-Indic timeline years now remain visible and preserve Gregorian datetime values across toggles.
- Added a calmer, biography-led homepage introduction and formal museum vocabulary.
- Reused 29 existing studio plates, replaced the blue-ceramic Royal Oak's wrong skeleton image with the existing blue Royal Oak asset, and retained original source files.
- Recovered the omitted Lederer record from Claude's folio. Canonical ledger now has **43** bilingual records. This restores prior work; it does not independently certify ownership.
- Film poster now uses an existing watch-only photograph, reducing portrait repetition.
- **23/23 Node/JSDOM/server tests pass**, including both languages, all 43 detail sheets, filters, search, zoom, navigation, exhibition, media ranges, biography years and restored Lederer.
- Added `museum/scripts/verify-rendered.mjs`: permanent 60-case route/language/viewport matrix, plus all-detail checks at mobile and desktop widths. **NOT RUN**: Cloud Browser rejects localhost (`ERR_BLOCKED_BY_CLIENT`), local Chromium is absent, and its download timed out. No visual-pass claim.

## Three release gates
1. Engineering: source/runtime checks PASS; rendered responsive matrix PENDING.
2. Museum: editorial implementation PARTIAL; four candid/collage assets, complete model/media provenance and film rights remain NEEDS VERIFICATION. See `release/media-review.json`. Do not infer that a photo assignment proves reference or ownership.
3. Royal presentation: PENDING visual inspection of the new candidate in Arabic/English at six viewports. Old live screenshots are not evidence for this candidate.

## Railway — observed in this session
`museum-current` source: `release/museum-current-v2`, pinned commit `284c19c`. Both museum services exist and were sleeping. Plugin source editing is not exposed by update_service. Browser settings route requires login. No production mutation, no third service, no retirement, no main merge, no v1.0.0 tag.

## Next action
Securely authenticate Railway to inspect and correct the existing service's source binding. Before a final release: reconcile public static path, resolve outstanding media/provenance, run the rendered gate, visually inspect and fix findings, then promote the verified commit to main and tag v1.0.0. Retire museum-vision only after canonical V1 verification. Do not call a local test pass a deployment.

---
Historical state follows for continuity; current evidence above takes precedence.

# Sheikh Ammar Horology Museum — Project State

## Release
Version: V1.0.0
Status: V1 LIVE — PRODUCTION VERIFIED

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


## Watchmaking guide
- New canonical route: `/watchmaking/`
- Bilingual Arabic/English explanation of timepiece anatomy.
- Covers case, bezel, crystal, dial, hands, crown/pushers, calibre, escapement, balance wheel, mainspring barrel, rotor, bridges and jewels.
- Complications chapter covers Chronograph, Tourbillon, Dual Time / GMT, Perpetual Calendar, Minute Repeater, Split-seconds / Rattrapante, World Time, Flyback and Moon Phase.
- Technical-record chapter explains Reference, Case Material, Diameter, Calibre, Power Reserve and Complications.
- Editorial language includes “Timeless timepieces.” and “One of the few. Never one of many.”
- Primary navigation on Home, Collection, Exhibition and His Highness now links to the Watchmaking route.
- Existing watch-detail label corrected from “Functions” to “Complications”.

Current integration head after this work: `1336c30056293179dab577c423edb24bebc9632c`


## Production resolution — 2026-09-20
- PR #26 merged to `main`.
- Canonical V1 release commit: `91d82e0d7302811d8c4028e91ff544ee78a56d9e`.
- Release tree: `8c21af18a4f7510c8d8e0101c120ccc0ba7a6968`.
- Railway service: `museum-current`.
- Verified production deployment: `bdd4374e-1684-45a7-974f-8d4d89d2d3eb` — SUCCESS.
- A prior verification deployment used `/watchmaking/` as the Railway healthcheck and succeeded, proving the new V1 route was actually being served.
- Normal healthcheck restored to `/healthz`.
- Railway source pin remains stale internally, so the service temporarily bootstraps the immutable V1 release commit from GitHub at container start. This preserves one production service and avoids a duplicate Railway project/service.
- Temporary PR #27 was closed without merge.
