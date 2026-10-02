# Sheikh Ammar Horology Museum — Current Project State

Updated: 2 October 2026

## 2 October 2026 — `museum-vision` is now the preview of PR #43
- **Live site (unchanged):** `museum-current` → https://museum-current-production.up.railway.app,
  deployment `c0fe8fe2`, serving `main` @ `88013ab`. GitHub Pages (`docs/`) is historical, not the site.
- **Preview:** Railway's free plan refused a new service, so the owner chose to reuse the legacy
  `museum-vision` (idle; last build failed 26 Sep). It is now pinned to `feat/one-of-not-many`
  @ `847b068`, built by `museum/Dockerfile` (which runs `npm test`), started with
  `node scripts/serve.mjs`, healthcheck `/healthz`, no watch patterns (the old `__retired__/never/**` pattern, and then
  `museum/**` on a docs-only commit, made Railway skip the build). Sleep mode stays on.
  URL: https://museum-vision-production.up.railway.app
- To preview a later commit, reconnect `museum-vision` to that SHA. Production is released only
  by the owner's merge to `main`, then reconnecting `museum-current` (see 26 Sep notes).
- PR #42 (Codex) adds shared Claude/Codex rules only (`AGENTS.md`, three skills mirrored in
  `.claude/skills/` and `.agents/skills/`); no site code.

## 29 September 2026 — "One of not many" (branch `feat/one-of-not-many`, draft PR — not merged, not deployed)
Built from the owner's *Cloud Code Build Pack — One of Not Many*. The companion vision brief
(`cloud-code-brief-one-of-not-many.md`) was **not** attached — the build pack arrived twice —
so every judgement of tone below was made from the pack alone. The owner reviews before any merge.

**Audit appendix (commit `e8a7bca`, executed first, line by line).** Nav back to plain names
(الرئيسية / المجموعة / المعرض / صاحب السمو / صناعة الساعات) — this **supersedes the 27 Sept
Diwan / Riwaq / Craft names** below. «مجلس الوقت / The Majlis of Time» is gone from wordmark,
veil, colophon and titles, replaced by his name. The two AI-written couplets are replaced by the
owner's line «الوقتُ انعكاسٌ للقيادة والانضباط والوعي الراقي», **unattributed** — no published
source was found in that exact wording. Outbound timeline links removed; sources kept in
`build-pages.mjs` as provenance only. Not needed: `collection-film.mp4`, stale
`watchmaking.js` / `vision.*` are not on main; every page already had a `<title>`.

**Motion foundation.** GSAP **core only** (3.15.0) + Lenis (1.3.26), self-hosted in
`dist/vendor/`, refreshed only by `scripts/vendor.mjs` (pinned). No ScrollTrigger / Draggable /
Inertia / SplitText / Flip — the museum's own reveal, drag, inertia and word-split code replaces
them (with them the budget would have been ~68 KB before any of our code). `dist/royal.js` is the
motion layer and the **only** place the libraries load; under `prefers-reduced-motion` it paints
one still frame of the paper and fetches nothing. One loop: `gsap.ticker` drives Lenis and the
paper. **Three curves, nothing else**, CSS and GSAP alike: entry `expo.out` = `--ease-entry`,
ambient `sine.inOut` = `--ease-ambient`, hover `power2.out` = `--ease-hover` (150 ms).

**The paper.** Raw WebGL1 marbling, half resolution, 24 fps, behind every light page. Its mood
follows Ajman's hour (dawn → sand → pearl). Film grain at 3.5 % over everything; gold dust in the
dark rooms (Time Machine, crown room). The veins are deliberately shallow: bronze labels hold
**7.18:1** on the darkest vein with the grain at its mean (gated — a first draft measured 6.98).

**The Time Machine** (Watchmaking hero). A drawn watch that keeps Ajman time at rest (8 beats/s)
and names *the present* to screen readers. Pull and turn the crown (or the dial, wheel, keys) and
the hands, era register and year aperture travel 1954 → 2025, clicking into detents at each year
a model in the ledger was introduced; the decade's pieces appear beneath. Decade rail with counts,
`#era-1970s`-style deep links, ← → mirrored in Arabic, Escape returns to the present, haptic tick
only under a hand on the crown. Every year and count comes from `watches.json`.

**Crown pieces** (Home, «ستُّ قطع. كلٌّ منها واحدةٌ من قِلّة.»). Chosen by one rule: six kinds of
rarity, each named from the piece's own ledger record — survival (6100 Chinese Dragon), emblem
(6263 Quraysh), mechanism (3939HP), hand (FFC), art (RM 68-01 Kongo), ending (5711 Olive). Each
enthroned with His Highness, with a liquid-metal hover on fine pointers only. **Owner to confirm
the six.**

**Films** (Collection only): `Air31Kly7Ys`, `HFt8kspnTwg`, behind our own posters of His Highness.
Nothing from the host loads until the play button is pressed; then the no-cookie player runs with
`controls:0` under our own pause / mute / close bar, its title and chrome cropped out of frame. If it
cannot load, a quiet bilingual note says so. **The IDs could not be played from the build sandbox
(egress blocked), so the owner should press play once on a preview.**

**Also:** the veil exits as a clip-path wipe with a hard 7 s fallback and tells the hero when it
lifts; anatomy hotspots N°1–N°12 sit on the stage below the Time Machine, and the callout carries
the card's own number; a jeweller's cursor and magnetic buttons on fine pointers only, appearing
on the first mouse move.

**Weight.** All shipped script 59.3 KB gzip (gated ≤ 84): GSAP 28.3 + Lenis 5.4 + `royal.js` 6.3 +
`app.js` 20.5. Added over main ≈ **46.7 KB** against the pack's ~70 KB.

**Gates added** (`verify-museum.mjs`, all mutation-checked — 14 mutations, 14 caught): shader AAA
floor, grain ceiling, the three curves pinned to their GSAP twins, no bare keyword curves, vendor
never in a page, reduced motion never fetches, script budget, and the owner's film rule (host
references, one API load from `playFilm`, click-only start, Collection-only, exact IDs).
**Tests:** 47 (was 37) — Time Machine in both readings, deep link, crowns, films (one load, our
controls, error path), hotspots, veil event, `royal.js` smoke; windows now always close, so a
failing test can no longer hang the run. Rendered gate 160/160.

**Flagged, deliberately not fixed** (each needs the owner):
- `rolex-daytona-paul-newman-6264-green-strap` and `rolex-daytona-6241-john-player-special` — the
  images look like the same watch (identity review open).
- Undated: `rolex-daytona-diw-motley-carbon`, `artisans-de-geneve-andrea-pirlo-rolex-submariner`
  (shown under "Undated" on the rail). `rolex-daytona-6265-black-dial` carries only "1970s", so it
  sits in that decade with no detent.
- The 45th piece (`fp-journe-chronographe-monopoussoir-rattrapante-titanium`) — still unrequested
  by the build pack; untouched.
- 13 citations without URLs — untouched.

## 27 September 2026 — nav names, a verse, and the anatomy stage (rest of the wider pass)
The owner chose the recommended option on all four questions this pass raised (see the
session record for the options put to him). This closes it out.
- **Nav names** (`NAV` in `build-pages.mjs`, site-wide): المجموعة → **الديوان** (Diwan —
  a ruler's register, and historically a poet's collected verse too), قاعة العرض →
  **الرواق** (a palace portico), فن صناعة الساعات → **الصنعة** (Craft). Home and His
  Highness unchanged. Only the nav/footer label changed; each page's own `<h1>` and
  meta description keep their fuller original wording.
- **The verse**, His Highness page, new section between the portrait-hero and "Life and
  heritage": two original couplets, «ديوان الوقت» (From the Diwan of Time). Not a lifted
  poem — no verifiably-authored Nabati poem about time or watches turned up in search, and
  reusing an unverified one under his name was the wrong kind of risk for this project. The
  Arabic verse never swaps away in English view (no `data-ar`/`data-en` on it); a small
  italic rendering sits beneath it instead, the way translated verse is set under the
  original in print. Caught a real bug: the English rendering needs `dir="ltr"` explicitly,
  or its em dash lands on the wrong side under the page's default RTL bidi context.
- **The anatomy stage** (`#watchStage`, `museum/dist/app.js` + `styles.css`), Watchmaking
  page, phase one of two (complications are phase two, not started): a still illustration —
  not any one maison's watch, hand-drawn SVG line art in the site's own gold-on-paper
  language — that turns to its caseback on a CSS 3D flip (`perspective` + `rotateY`, two
  `backface-visibility:hidden` faces; no library, no engine) for the six parts only visible
  there. Clicking one of the 12 anatomy cards highlights that part with a soft glow and
  dims the rest; the caption below the stage updates via the site's existing bilingual
  `data-ar`/`data-en` swap, so it tracks a language switch correctly even after selection.
  `<article>` stays a bare tag (the `<article>` count gate matches the literal substring
  with no attributes) — the click target is a `<button class="anatomy-card">` inside it.
  Two real layout bugs caught before shipping:
  1. `.stage-col{margin:0 auto}` with no explicit width overrode the grid item's default
     stretch-to-fill behaviour, collapsing the stage to 0×0 on desktop. Fixed with an
     explicit `width:100%` (mobile) / `margin-inline:0` (desktop).
  2. On mobile the stage sits above the anatomy cards in a single stacked column; making it
     `position:sticky` without full row width let the scrolling cards' text show through at
     its sides as they passed underneath. Fixed by keeping the *sticky bar* full width with
     an opaque `background:var(--paper)`, and capping only the *watch illustration inside it*
     to a small centred size. Also had to offset the sticky `top` past the page's own sticky
     chapters nav (measured: ~137px tall where its links wrap below 980px, ~85px on one
     line above it) or the two sticky elements overlapped.
- Verified: `npm test` 37/37, `verify-rendered.mjs` 160/160, plus manual clicks confirming
  the flip fires only for caseback parts, the highlight and caption are correct per part,
  keyboard activation works (native `<button>`, Enter fires `aria-pressed`), and the mobile
  sticky bar fully occludes the scrolling list behind it.

## 27 September 2026 — an engraved background texture (first piece of a wider pass)
The owner asked for the whole site to be reviewed again: wording, a page background with
more life in it, new tab names, a Gulf poetic touch, and a possible 3D interactive watch
diagram on the Watchmaking page. This entry covers the one piece shipped so far; the rest
(nav names, the poetry, the 3D feature) are proposals awaiting the owner's direction —
see the session record, not this file, for the options put to him.
- **`body::before`, `museum/dist/styles.css`:** a fixed, centred, radially-masked
  `repeating-radial-gradient` — a faint engraved-ring medallion in the site's own bronze
  tone, echoing the guilloché already used on the live dial. Not a photograph, so it
  carries none of the risk a photograph would (never near his face, never a contrast
  question). Confirmed visually behind the home page's ivory sections.
- **Regression caught before shipping:** the first attempt also set `body{position:relative}`
  so the fixed pseudo-element would have an explicit stacking context. That was unnecessary
  (`position:fixed` doesn't need one) and it changed the containing block for other
  absolutely-positioned elements on the page — `verify-rendered.mjs` caught a new
  text-over-his-portrait failure on the home hero as a result. Removed the property; the
  gate returned to 160/160 with the texture still fully in place.
- A literal use of his photography as ambient background was considered and set aside for
  now — put to the owner as an option rather than shipped blind, since it runs closer to
  the "nothing distracting near his face" rule than an abstract motif does.

## 27 September 2026 — the Collection reel, and an appreciation pass
The owner asked for motion at the top of the Collection page — "the video that has to be
played" — and for copy that shows how craft lovers admire the collection. No rights-cleared
video exists (the one film in the repo, `collection-film-third-party-reel.mp4`, was retired
precisely because it carries a watermark, captions and prices — see §2 below), so this was
built as **plain photography crossfading on its own**, the same technique the home Screening
Room already uses, just autoplaying instead of click-triggered. No `<video>`, no iframe, no
YouTube, no player controls — `verify-museum.mjs`'s existing gates pass unmodified.
- **The reel** (`#reelFrames`/`#reelCaption`, `museum/dist/app.js`, `museum/dist/styles.css`):
  6 royal photographs crossfade every 6.5s above the Collection page's own title, each under
  a one-line admiring caption (bilingual) about how collectors and connoisseurs regard the
  piece. Freezes on frame one under `prefers-reduced-motion` (verified: same caption before
  and after a 7s wait); advances normally otherwise (verified: caption text changes).
- **Appreciation copy**, added in three places (not the whole site — see the owner's answer
  recorded here): a line on the home page after the existing "record of discernment" lede;
  the six reel captions on Collection; one added sentence in the "An eye for craft" article
  on the His Highness page. All written in the established maison register, not hype — and
  checked against the language gate's banned-phrase list (avoid "من القلائل" literal, use
  "قلّة" instead, per that list's own preferred style).
- **Bug fixed in the same pass:** the Collection page's meta description and on-page lede
  still read "Forty-four" / "أربعٌ وأربعون" after the 45th piece was added on 26 Sep — missed
  because it's prose, not a gated count. Now reads 45 throughout.
- Verified: `npm test` 37/37, `verify-rendered.mjs` 160/160 (including AAA contrast and the
  no-text-over-his-portrait check, unaffected since the caption sits below the photography,
  never on top of it — same layout the Screening Room already uses).

## 26 September 2026 — owner photographs: 45th piece, clean Lederer, new portrait
- **45th timepiece: F.P. Journe Chronographe Monopoussoir Rattrapante, titanium** (calibre 1518,
  44 × 12.1 mm, 80 h, slate-grey dial, large date). From an owner-supplied watch-spotter post showing
  it on His Highness's wrist; identified from the maker's render in the same post (round case,
  tachymeter, two sapphire counters, large date). It is distinct from the existing lineSport record.
  The published image is cropped so that the **price badge and publisher mark are excluded**
  (valuations stay unpublished). Maisons stay at 8. The count gates now require 45.
- **Lederer:** the owner supplied the clean original, with no W mark and no pasted render. The royal image is
  rebuilt from it, and the watermarked source is removed.
- **New portrait source:** His Highness reading a watch book (`source-media/sheikh-ammar-reading-watch-book.jpg`)
  replaces the fourth framing of `sheikh-examining-watches` in the portrait pairings. The dHash guard passed.
- Leads from the same batch, **not added** (thumbnails only, too small to publish): Greubel Forsey
  GMT Sport, Rolex Day-Date "Puzzle", Patek 5178G, a red-dial F.P. Journe, and a Cartier Tank on
  a bracelet (would be a 9th maison). Send full-size originals to add them.

## 26 September 2026 — audit follow-up (owner authorised A1, A2, A6 and the recommended set)
- **A1** Two portrait pairings (5470P, RD#2) had near-identical crops of one portrait. Both now use
  distinct framings, and `build_royal_media.py` refuses to build if any two portrait panels are
  perceptually alike (dHash distance < 12 of 64; the defect measured 0).
- **A2** `verify-rendered.mjs` now covers 375, 390, 412, 430, 768, 1024, 1440 and 1920 px
  (160 route/language/viewport/motion checks) and opens all 44 detail sheets at 375, 390 and 1440.
- **A3/A4** Every record carries `imageClass` (wrist | portrait_pair), `wornClaim` (false for every
  pairing) and a typed `provenance` trail built only from evidence already in the repo
  (`scripts/add-provenance.mjs`). Nothing is invented: statuses are `pending-owner`,
  `cited-no-url` or `url-cited` (link recorded, not re-checked — egress to the sources was blocked
  where this ran). `verify-museum.mjs` enforces the structure and prints what is still open.
  Open today: 44 owner confirmations, 13 citations without links, 2 unchecked links.
- **Identity review** 6264 (green strap) and 6241 (JPS) appear to show the same black-and-gold
  dial on different straps. Both records carry `identityReview` until the owner or an expert rules.
- **Correction (important).** Deployment `7b1c39e2` (24 Sep), reported as serving `dbf552c`, actually
  logged `Serving canonical V1 ab7b82f…` — the pre-redesign site. Railway's `redeploy` replays the
  previous deployment's snapshot *including its frozen start command*; editing the service's start
  command does not reach a redeploy. The redesign was therefore **not live until 26 Sep**.
- **Live since 26 Sep 2026, 11:08 UTC:** deployment `d3eb375e`, log line
  `Serving canonical V1 5c67ebe5c920c55a5b3fb1b44fabaac952eccb0b` (main after PR #34), healthcheck
  SUCCESS. A variable change (`MUSEUM_RELEASE_SHA` = that commit, A6) creates a genuinely new
  deployment that picks up the current service settings; `redeploy` does not.
  To release a later commit the same way: update the SHA inside the service start command, then
  change `MUSEUM_RELEASE_SHA` to the same SHA — and confirm the `Serving canonical V1` log line.
  Rollback: Railway rollback to `665e1fcf` (serves `ab7b82f`, the pre-redesign site).
- **A5 done (26 Sep 2026, 11:16 UTC).** The owner granted Railway's GitHub app access to the repo.
  `museum-current` is now connected to `main`, **pinned to commit `1cb1867`**, built by
  `museum/Dockerfile`, and started with `node scripts/serve.mjs`. The build runs `npm test` on the
  exact code it serves (37/37 in deployment `f411e160`'s build log), the image carries `dist/`
  (no download at boot), and the healthcheck passed. The repo no longer needs to be public for the
  site to run.
- **Incident, 26 Sep 11:12 UTC.** All `museum-current` deployments were removed and its domain
  detached (the staged deletion patch disappeared at the same time), and `museum-vision` was
  connected to `feat/majlis-of-time-v2`, whose build failed (19 tests, 1 failing — that branch's
  older suite). The A5 build above restored the service, and the domain
  `museum-current-production.up.railway.app` was regenerated on port 3000.
- **How to release from now on:** merge to `main`, then reconnect the service source to the new
  commit (Railway → museum-current → Settings → Source, or `connect-service-source` with
  `commitSha`). The build refuses to ship if `npm test` fails. Rollback: redeploy the previous
  deployment in Railway, or reconnect the previous commit.
- **Live visual check** could not be done from the build environment (its egress policy refuses
  `railway.app`). The owner must look at the site.

Railway facts at audit time: running deployment `7b1c39e2` (SUCCESS) serves `dbf552c` through a
start command that downloads the GitHub archive at boot; its Docker image (and so its `npm test`
gate) was built from the older `0a37206` on `release/museum-current-v2`. Staged patch `18db2ead`
still deletes both services — **only the owner can discard it, in the dashboard; never deploy it.**
It was still staged after the 26 Sep 11:08 deployment and was gone by 11:15 (see the incident note).

## 24 September 2026 — Royal redesign (supersedes the design notes below)
The public site in `museum/dist/` was redesigned end to end in a Haute Horlogerie
maison register (ivory paper, ink type, hairlines, spaced small capitals, full-bleed
photography). Owner directive, now enforced by the test gates:

1. **Every timepiece is shown with His Highness.** `museum/dist/assets/royal/<slug>.webp`
   (built by `museum/scripts/build_royal_media.py`) is the only image of a timepiece any
   page renders. 35 are real photographs of H.H. with the piece; 9 pair an official
   portrait with the maker's image and are labelled as such (`royalPairing: "portrait"`).
   `/assets/watches`, `/assets/plates` and `/assets/watches-verified` are source material
   and must never be rendered directly. His face is never retouched.
2. **No player chrome.** No play icon in the header, no YouTube embed, no native video
   controls. The home "screening room" is a projection of photographs of His Highness.
   The old `collection-film.mp4` (a third-party reel with watermark, captions and prices)
   was moved to `museum/source-media/` and is not public.
3. **Arabic first, and pure.** Arabic is default; the Arabic view shows no English words
   (reference codes excepted). Hero: «للوقت قدر. وللساعات حكاية.»
4. **AAA contrast.** Palette ratios are checked in `verify-museum.mjs`; every visible line
   of text is checked in the browser by `verify-rendered.mjs`.
5. **Text never crosses His Highness's portrait** (checked in the rendered gate).

Signature features (home):
- **Private invitation** — `/?for=<name>` turns the visit into a one-of-one edition: the
  name appears in the opening veil, the hero and the colophon (kept for the session, text only).
- **Opening veil** — the ع monogram engraves itself once per session; never under reduced motion.
- **Time in Ajman** — live, with the Umm al-Qura Hijri date and the Gregorian date.
- **Piece of the day** — rotates each Gulf day through the pieces photographed with H.H.
- **The collection on a single dial** — every dated piece is an index in chronological order;
  the hand follows hover/arrow keys; the centre shows His Highness with the piece.
- **The loupe** — a jeweller's lens over the royal image in the detail sheet (fine pointers).

Pages are generated from one template: edit `museum/scripts/build-pages.mjs`, then
`node scripts/build-pages.mjs`. Runtime is one file, `museum/dist/app.js`.
Retired: `vision.js`, `vision.css`, `reading.css`, `watchmaking.js`.

Open items for the owner:
- Resend the clean original of the Lederer photograph (a publisher "W" sits over the headdress).
- Resend the watchmaking-event photograph — the committed WebP is truncated and was rendering broken.
- Wrist photographs for the 9 portrait-paired pieces, when available.
- "One of not many" is Vacheron Constantin's own brand line; confirm you want to keep it.

QA on the 24 Sept change: `npm test` 31/31 (later 37/37); `verify-rendered.mjs` 120/120 (5 routes × 6 viewports ×
AR/EN × normal/reduced motion, all 44 detail sheets opened at 390 and 1440).


## V1 production
- Canonical public source: `museum/dist/`
- Production platform: Railway
- Active service: `museum-current`
- Production service: `museum-current`
- Railway direct source metadata remains pinned to a legacy branch snapshot; canonical main is therefore served through an exact-SHA runtime bootstrap until Railway source editing is available.
- Current optimized production deployment: `c6dafa99-9e86-4251-86e1-4b80441040c9` — SUCCESS
- Served 44-record content commit: `a24d468b50f46cf48aca12f321dafe0a861cc8d6`
- Normal healthcheck: `/healthz`
- `/watchmaking/` was used as the promotion healthcheck and passed before the normal healthcheck was restored.
- `museum-vision` is dormant and excluded from normal auto-deploys.

## Canonical collection
**44 timepieces across 8 Maisons.**

Arabic is the default language. English is the complete alternate language.

## Claude Code audit retained
Claude's latest audit commit `f024ceeb08bc37694db0ae289ba37756117cd1b7` found three genuine user-visible defects:
1. reduced-motion ambient imagery could render as an empty panel;
2. the Quraysh Exhibition image path contained a one-digit filename error;
3. the owner-supplied Watchmaking image had been committed as corrupt WebP bytes.

The first two Claude fixes are retained. The third was completed by rebuilding a valid WebP from the original owner-supplied JPEG and restoring it exactly once in the Watchmaking chapter.

Claude's rendered gate passed 60/60 route/language/viewport combinations after its fixes. The permanent rendered script has since been expanded to 120 combinations covering both normal and reduced motion; this expanded 120-case matrix is prepared for future runs and is not falsely recorded as already executed.

## Canonical English
Public English now follows one restrained Haute Horlogerie register:
- Maison
- timepiece
- calibre
- movement
- complications
- power reserve
- self-winding
- manual-winding
- chronograph
- tourbillon
- dual time & GMT
- perpetual calendar
- minute repeater
- split-seconds chronograph / rattrapante
- world time
- flyback chronograph
- moon-phase indication
- craftsmanship
- horological heritage
- Haute Horlogerie
- technical record
- provenance

The visible technical record normalises legacy raw values such as `Caliber`, `Automatic`, and `Manual` into the canonical display register without changing official model names that legitimately contain words such as “Automatic”.

## Canonical Arabic
- الدار
- الساعة / القطعة
- المجموعة
- المرجع
- العيار
- الحركة
- التعقيدات
- احتياطي الطاقة
- حركة ذاتية التعبئة
- حركة يدوية التعبئة
- الكرونوغراف
- التوربيون
- التوقيت المزدوج وGMT
- التقويم الدائم
- مُكرِّر الدقائق
- كرونوغراف الثواني المنقسمة / راترابانت
- التوقيت العالمي
- كرونوغراف فلاي باك
- مؤشر أطوار القمر
- صناعة الساعات الراقية
- المهارة الحرفية
- إرث صناعة الساعات
- السجل التقني
- توثيق المنشأ

## Signature language
- «ثلاث قطع. ثلاث لغات للوقت.» / “Three Timepieces. Three Expressions of Time.”
- «حين تستحق اللحظة أن تطول.» / “When a Moment Deserves to Last.”
- «قطعٌ تتجاوز الزمن.» / “Timeless timepieces.”
- «من القلائل.» / “One of not many”

## Watchmaking chapter
`/watchmaking/` contains:
- 12 anatomy concepts;
- 9 complications / mechanisms;
- a clear distinction between turbine and tourbillon;
- a guide to reading the technical record;
- direct complication links from relevant timepiece detail sheets;
- the restored owner-supplied image, used once only.

## Automated language gate
`museum/scripts/verify-language.mjs` is part of `npm test` and fails on:
- stale `Functions` terminology;
- `Caliber` display without runtime normalisation;
- obsolete tagline variants;
- stale Dual Time / Rattrapante labels;
- stale 42/43-piece or 7-Maison counts;
- old English navigation/copy layers.

## QA evidence
- Claude audit: 60/60 rendered cases passed after three defects were corrected.
- Claude audit: 23/23 Node/JSDOM/server tests passed.
- Final audit candidate: Railway staging deployment `f5438eb0-6b64-4271-8057-eebe0616a4f5` reached SUCCESS after `npm ci && npm test`.
- 44-record verification bootstrap ran `npm ci && npm test` before server start and reached SUCCESS; optimized deployment `c6dafa99-9e86-4251-86e1-4b80441040c9` then reached SUCCESS on the same content commit.
- Production Watchmaking route passed Railway healthcheck.

## Rule going forward
Do not reintroduce a second public version. Do not restore stale 42/43 or 7-Maison counts. Do not bypass `verify-language.mjs`. New public English and Arabic must follow `content/horology-lexicon.json`.

## 20 September 2026 — Rolex 6100 expansion
- Added Rolex ref. 6100 “Chinese Dragon” as the 44th canonical record.
- Relationship to H.H. Sheikh Ammar is classified as a reported public appearance, not private-ownership proof.
- Technical identity and rarity language are bounded to Christie’s catalogue; Waqt is retained as the public-appearance report.
- A cropped owner-supplied documentary image is used provisionally without the surrounding collage/person; a higher-resolution master remains desirable.
- The Rolex 6100 now leads the homepage three-piece curatorial selection because of its enamel craft and historical significance.
- Production promotion is live-verified on content commit `a24d468b50f46cf48aca12f321dafe0a861cc8d6`.
