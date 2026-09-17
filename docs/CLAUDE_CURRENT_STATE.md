# Project state — working file

Working notes so context survives compaction. Not linked from the site;
excluded in `robots.txt`. Contains no credentials and nothing private.

## Current objective

Raise the static site in `docs/` to a private royal horology museum standard:
header/navigation, homepage hero, featured pieces, collection and folio
records, Arabic/RTL, a film room, the Patron page and timeline — then full
responsive QA.

## Architecture (verified, not assumed)

- The live site is **static HTML/CSS/JS in `docs/`**, served by GitHub Pages
  from `main` → `/docs`. No build step, no framework. (`CLAUDE.md` §2)
- The React/Express/Drizzle app at the repo root (`client/`, `server/`,
  `vite.config.ts`, `package.json`) is the **retired Manus build**: no
  `node_modules`, no CI workflow, no Railway/nixpacks/Procfile config.
  It is not deployed and is out of scope. (`CLAUDE.md` §2)
- Therefore `pnpm check` / `pnpm test` / `pnpm build` gate the retired app,
  not the live site. The live site's real gates are: zero JS/HTTP errors,
  zero overlap/overflow at six viewports in both languages, and Lighthouse.

## Completed

- Full repo + rendered-site audit (branch, history, deployment, page counts).
- Multi-viewport defect sweep harness: 12 pages × 2 languages × 6 viewports,
  checking overlap, spill, horizontal scroll, JS/HTTP errors, sub-44px touch
  targets and image distortion.
- **Design tokens** extended: type scale (`--t-hero/h2/h3/h4/lede/eyebrow/micro`),
  separate Arabic scale, rhythm (`--maxw`, `--gutter`, `--sec-y`, `--grid-gap`),
  motion (`--dur*`, `--ease`), `--tap`, `--hdr-h`. 25 ad-hoc heading clamps and
  15 ad-hoc durations collapsed onto the scale.
- **Header redesigned**: boxed ☰ replaced by a borderless twin-rule mark that
  becomes a cross when open; language control de-boxed to a typographic control
  with a hairline; one hairline divider; the monogram circle is now the only
  bordered element. All controls 44×44.
- **IA simplified 7 → 5** (Home · Exhibition · Collection · Films · Sheikh Ammar).
  Masterpieces/Maisons/Timeline kept as `.lenses` on `collection.html` + footer.
- **Burger breakpoint 1300px → 1000px**, re-measured (see `CLAUDE.md` §4).
- **Featured three** rebuilt as an asymmetric editorial opening with full museum
  records (lot, maison, reference, year, rarity) from verified site data.
- **`films.html`** screening room built.
- **Menu a11y fixed**: `#omenu` kept `aria-hidden="true"` even when open, so the
  menu was invisible to assistive tech. Now `aria-expanded`/`aria-hidden` track
  state, focus moves to close and returns, Escape closes.
- `scroll-padding-top` added so in-page anchors clear the fixed header.
- Mobile type: wordmark and dial caption no longer wrap (tracking gives, not size).

## Remaining

- Arabic/RTL deep pass beyond what the sweep covers.
- Patron + timeline editorial refinement.
- Performance (responsive images / AVIF) — currently unoptimised.

## Known defects (measured)

- **Fixed**: mobile header touch targets (burger was 37×43, language 59–73×37)
  are now 44×44; the three competing bordered elements are down to one.
- **Remaining, accepted**: short Arabic nav words ("الدور", "الأفلام") give
  targets ~31–41px *wide* though 44px tall. Adding horizontal padding pushed the
  English nav onto two rows below 1000px, so the height bar is met and the width
  is left to the generous nav gap. Not a blocker.
- `assets/emblem.png` 404s by design until the owner supplies it; the slot
  self-hides via `onerror`. Documented in `CLAUDE.md` §7.
- The root React/Express app does not build (no `node_modules`, not deployed).
  Out of scope — `CLAUDE.md` §2 retires it.

## Constraints that override the brief

- **No wrist/candid photography.** `CLAUDE.md` §3 retired the split-screen
  watch-spotter collages (one carried a watermark, one showed an identifiable
  child, one was not His Highness). Featured pieces therefore use studio
  plates, not "Sheikh wearing the watch" imagery, until the owner supplies
  licensed photography.
- **No invented films.** Only one verified video ID exists (`NKhO0HmOJbw`).
  The film room is built to hold more, but no entries are fabricated.
- Valuations are not to be touched without the owner's instruction
  (`CLAUDE.md` §2, open decision).

## Branch / commit

- Branch: `claude/watch-website-master-plan-x2gsgo`
- Commit at start of this pass: `3092924`
- Commit at end of this pass: `b4fdf21` (pushed; PR #22, still draft)
- Final matrix: 12 pages x 2 languages x 6 viewports = 144 combinations,
  **zero** overlap / spill / horizontal-scroll / JS / HTTP / distortion.

## Exact next action

Arabic/RTL deep pass: audit heading line-heights, numeral rendering and
optical alignment on `patron.html` and `timeline.html` specifically, then
responsive images (the plates are served at one size to every viewport).
