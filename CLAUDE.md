# CLAUDE.md — Sheikh Ammar Royal Horology Collection
**Single source of truth. Read this before touching anything.**
Last updated: 6 September 2026 · Owner: Smiley (OgSmiley1)

---

## 0. RULES FOR ANY AI WORKING ON THIS REPO

1. **Do not create a second version of this website.** This project already suffered from two divergent builds (Manus React app vs static gallery). One public site only — see §2.
2. **`docs/` is the public website.** It is finished, tested, and deploys via GitHub Pages. Edit it, don't replace it.
3. **`data/watches.json` is a reference export of all 32 pieces**, not yet wired as a live data source for `docs/`. The HTML pages under `docs/watch/` still carry their own data inline (by design — zero build step, zero dependencies). If you introduce a generator that regenerates `docs/watch/*.html` from this JSON, verify it preserves every hand-authored addition first (provenance certificates, the falcon note on the Quraysh page, per-watch OG tags, share bar, "You may also admire") — do not let an automated regen silently drop them.
4. **Never commit credentials.** See §6 — this is not hypothetical, it already happened once.
5. **Arabic is the default language.** English is the toggle. Do not reverse this.
6. When in doubt, ask before deleting. This carries a Crown Prince's name.

---

## 1. WHAT THIS IS

A private digital gallery presenting the horological collection of
**H.H. Sheikh Ammar bin Humaid Al Nuaimi, Crown Prince of Ajman** — "The Majlis of Time."

Not e-commerce. Not a catalogue for sale. A private salon, in the register of an auction house's provenance essay crossed with an Islamic manuscript.

**Governing principle:** discretion beats display. "Kept, not owned."

---

## 2. CANONICAL DECISIONS (already made — do not relitigate)

| Question | Decision | Why |
|---|---|---|
| Which site is public? | **The static site in `docs/`** | Loads in <1s on iPhone. No backend to hack. No vendor lock-in. Free forever on GitHub Pages. |
| The Manus React app? | Private admin/workshop only, or retire it | Its URL is a sandbox link that can expire; MySQL is Manus-hosted |
| Default language? | **Arabic (RTL)**, English via toggle | He is Khaleeji royalty; Arabic-first content also outperforms in-region |
| Hero / Lot I? | **Rolex Daytona 6263 "Quraysh"** | Royal-emblem dials command up to 3× premiums; the hawk is the strongest hook we own |
| Build system? | **None.** Plain HTML/CSS/JS | Zero dependencies = zero rot. Works offline. |
| Framework? | None. Do not add React to `docs/` | |

### OPEN DECISION (needs Smiley's call)
- **Public valuations.** Currently every watch shows a US$ figure. Consider showing valuations only on the six masterpiece lots and using RRR hallmarks elsewhere. Publishing the value of a sitting Crown Prince's private property is a discretion + security question, not a design one. **Do not change without instruction.**

---

## 3. THE NUMBERS (authoritative — fix any doc that disagrees)

- **32** timepieces
- **8** maisons: Patek Philippe, Audemars Piguet, Richard Mille, Rolex, F.P. Journe, H. Moser & Cie, Artisans de Genève, Tudor
- **1963 – 2024** (six decades)
- **US$ 11.7M+** combined valuation
- **16** pieces carry the RRR (highest rarity) hallmark — verified by counting `RRR</b>` markers in `docs/watch/*.html`

### 32nd piece — provenance note (31 July 2026)
Rolex Daytona DiW "Motley 3S" Carbon was added from a photo Smiley uploaded directly in chat (not sourced from `client/public/watches-collection/` like the original 31). Identified by web research against watch-spotter coverage of the Sheikh's collection (IFL Watches, Superwatchman) and DiW's own published specs — not guessed. Same research pass also surfaced open questions about the identity of three *existing* pieces (`patek-philippe-5470p` may actually be a 5271P "Blue Sapphire"; the two `fp-journe-tourbillon-souverain-*` entries may both describe one real sapphire-dial piece rather than two separate blue/mint watches) — flagged to Smiley, not yet acted on. See PR history for sources.

---

## 4. STRUCTURE

```
/
├─ CLAUDE.md              ← you are here
├─ data/watches.json      ← reference export of all 32 pieces (see §0.3 — not yet the live source)
├─ docs/                  ← THE PUBLIC WEBSITE (GitHub Pages serves this)
│  ├─ sitemap.xml         all 39 pages, for search engines
│  ├─ robots.txt          allows all crawlers, points at sitemap.xml
│  ├─ index.html          Home: veil, video hero (4 films, chapter captions),
│  │                      live Ajman dial, ledger, Piece of the Day, hawk
│  │                      band, catalogue teaser, film section, dedication
│  ├─ exhibition.html     THE EXHIBITION HALL — 32 spotlit vitrines, one per screen,
│  │                      museum placards (lot · maison · ref · year · hallmark),
│  │                      arrow/keyboard/rail navigation, hall map by maison,
│  │                      Curator's Tour autoplay. Generated once from data/watches.json
│  │                      (generator lives outside the repo; the HTML is the artifact)
│  ├─ collection.html     All 32, grouped by maison, live filters + search
│  ├─ masterpieces.html   6 lots, ivory catalogue paper, ambient video banner
│  ├─ maisons.html        8 houses
│  ├─ timeline.html       every dated piece, by decade
│  ├─ patron.html         سيرة الشيخ عمار — royal biography timeline, ambient video banner
│  ├─ watch/<slug>.html   32 individual folios (16 of them link a PDF certificate)
│  ├─ certificates/       16 bilingual "Certificate of Provenance" PDFs, one per RRR piece
│  └─ assets/
│     ├─ style.css        entire design system
│     ├─ app.js           lang, dial, video hero, filters, share, Piece of the Day, reveals,
│     │                   exhibition hall (exhibition()), vitrine lightbox (vitrine())
│     ├─ films/           4 produced hero video clips (mp4+webm+poster) + posters for banners
│     ├─ favicon.svg      ع monogram favicon (done — used on all 39 pages)
│     ├─ og-cover.jpg     social link preview
│     ├─ patron-arch.jpg  clean-cropped patron portrait (the original patron.jpg carries a
│     │                   burned-in third-party watermark — use the -arch version everywhere)
│     ├─ emblem.png       ← DROP OFFICIAL AJMAN EMBLEM HERE (see §7) — still not present
│     └─ *.webp/jpeg      33 images (32 watches + patron portrait)
└─ BLUEPRINT.md           strategy: launch plan, captions, next-level ideas
```

**39 HTML pages + 16 certificate PDFs.** Verified in-browser: 0 JS errors, video hero crossfades and advances chapters correctly, Arabic-first load confirmed.

**Header nav carries 7 links.** The burger menu takes over below **1300px** (measured: the full 7-link nav needs ~1260px in English, ~1240px in Arabic; 1300 leaves margin for Marcellus rendering wider than the test fallback). If you add an 8th link, re-measure — don't guess.

---

## 5. FEATURES BUILT (don't rebuild these)

- Cinematic veil entrance (ع monogram lifts on load) + film-grain texture
- Live engraved guilloché dial showing real Ajman time (GST, UTC+4)
- **Video hero**: 4 produced films (Quraysh Daytona, Manama World Time, Chronomètre à Résonance, RM 68-01 Kongo) crossfading with bilingual chapter captions and clickable progress ticks; falls back to still posters under `prefers-reduced-motion` or data-saver
- Ambient video banners on the Patron and Masterpieces page headers
- Live crossfading gallery banners (stills from the collection's own photography) on Collection, Maisons, Timeline
- **The Exhibition Hall** (`exhibition.html`) — the museum: 32 vitrines walked one per screen (scroll-snap), each under its own spotlight with a brass placard; ← → keys (mirrored in RTL), Home/End, a 32-tick rail, a hall map by maison, and a **Curator's Tour** that auto-advances every 7.2s (space to pause; hidden under `prefers-reduced-motion`). Opens with the royal Rolex wing, Quraysh first. Arabic reading uses Arabic-Indic numerals.
- **The vitrine lightbox** — clicking the watch image on any folio (or any case in the hall) opens a spotlit glass-case view with the piece's lot and name; ESC / click-outside / ✕ closes, focus returns. No zoom bars, no percentages.
- **The doorway** on the homepage — an arched, spotlit invitation into the Exhibition Hall, placed after Piece of the Day
- The Film facade shows the site's own film poster (`films/film-kongo.jpg`), never YouTube's thumbnail — the video still plays on click
- Full-bleed parallax "chapter band" — «الوقت لا يُملك… بل يُحفظ»
- Full bilingual EN/AR with RTL, persisted across pages via `?lang=` (Arabic is default; `.pdf` links are excluded from this decoration)
- RRR · RR · R rarity hallmarks (auction convention) — 16 pieces carry RRR
- **Bilingual "Certificate of Provenance" PDF** for each of the 16 RRR pieces — gold seal, ivory folio register, downloadable from that watch's page
- **"For the Falconer"** — a connoisseur's note on the Quraysh Daytona page connecting صقر قريش to the Sheikh's own falconry (consistent with, not inventing beyond, the biography already on `patron.html`)
- **"His Highness's Piece of the Day"** — a compact strip on the homepage, rotating once per Gulf day through the 16 RRR pieces, computed client-side (no backend)
- Live filter chips by maison + instant search
- Per-page Open Graph cards (each watch unfurls with its own photo)
- Share bar: WhatsApp / X / Copy link on every watch page
- "You may also admire" — 3 related pieces, no dead ends
- Fullscreen overlay menu on mobile
- Count-up ledger stats, back-to-top, scroll reveals
- Gold khatam ornament under every section title
- YouTube film embed (click-to-load facade, video ID `NKhO0HmOJbw`)
- `prefers-reduced-motion` respected throughout

---

## 6. SECURITY — ACT ON THIS

- The credentials `MOATH / MOATH123` appeared in plaintext across this repo's markdown docs (README.md, userGuide.md, todo.md, TESTING_REPORT.md, REMAINING_WORK.md) **and in `seed-database.ts`**, which is the code that actually creates that account. The markdown occurrences have been redacted (19 July 2026); **`seed-database.ts` still hardcodes the real password** and was deliberately left untouched — changing a live credential's source without the owner rotating it through the running app first risks a lockout, so this needs Smiley to do it directly (log in as MOATH, change the password in the admin panel, then update `seed-database.ts` to stop hardcoding a real value — e.g. require an env var with no baked-in default).
- Audit git history for any earlier commits with the plaintext value: `git log -p -- README.md userGuide.md todo.md TESTING_REPORT.md REMAINING_WORK.md seed-database.ts | grep -i MOATH123`. Redacting the current file content does not remove it from history — if this repo is ever made public, history should be scrubbed or the credential rotated (rotation is simpler and sufficient).
- Never place credentials in markdown, README, or code. Use environment variables.
- The static site in `docs/` has no login, no database, no attack surface — this is a feature.

---

## 7. TO GO LIVE

```bash
git add . && git commit -m "Majlis of Time — consolidated" && git push origin main
```
Then once, by hand: **Settings → Pages → Deploy from a branch → main → /docs → Save**

Live at: `https://ogsmiley1.github.io/sheikh-ammar-horology-gallery/`

**Remaining manual items:**
1. Drop the official Ajman emblem into `docs/assets/emblem.png` (header + footer slots are already coded; if the file is absent the slot hides itself). Use an authentic official file — do not generate a state emblem.
2. Custom domain (e.g. `majlisoftime.com`) → Settings → Pages → Custom domain
3. Rotate the `MOATH123` credential (§6) — this is the one item here with real security weight, do it before the site draws attention
4. Compress the heaviest images in `docs/assets/` if any exceed ~250KB (spot-check; most are already reasonably sized)

---

## 8. IF YOU ARE CLAUDE CODE, GOOD FIRST TASKS

- [x] Add `favicon.svg` from the ع monogram — done, on all 38 pages
- [x] Video hero, ambient banners, certificates, falcon note, Piece of the Day — done (§5)
- [x] Redact leaked credential from markdown docs — done (§6); `seed-database.ts` still needs Smiley's hand
- [x] Add `sitemap.xml` + `robots.txt` to `docs/` — done, plus `rel="canonical"` on all pages
- [x] Full-site image audit — watermarks removed, wrong images flagged (not guessed at), Arabic translation gaps fixed
- [x] The Exhibition Hall, the vitrine lightbox, the homepage doorway — done (§5)
- [ ] Rotate the live `MOATH123` credential and remove the hardcoded default from `seed-database.ts` (needs Smiley — see §6)
- [ ] Resolve the three flagged piece-identity questions in §3 (5470P vs 5271P; the two Tourbillon Souverain entries)
- [ ] Lighthouse pass — target ≥90 performance, ≥95 accessibility
- [ ] Verify OG cards unfurl correctly once the site is live
- [ ] Do **not** touch valuations without Smiley's instruction (§2)

---

*Built for Smiley — Ajman, MMXXVI.*
