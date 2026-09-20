> **Current V1 continuation (19 September 2026):** read `docs/PROJECT_STATE.md` first. Historical GitHub Pages, counts and completed-QA statements below are not current release evidence. Railway is the intended sole public host; no final V1 deployment is verified. The newer integration currently serves static `museum/dist/`; the owner's requested `docs/` path still needs reconciliation. Do not discard either tree.

# CLAUDE.md — Sheikh Ammar Royal Horology Collection
**Single source of truth. Read this before touching anything.**
Last updated: 17 September 2026 (third pass) · Owner: Smiley (OgSmiley1)

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

- **33** timepieces
- **9** maisons: Patek Philippe, Audemars Piguet, Richard Mille, Rolex, F.P. Journe, H. Moser & Cie, Artisans de Genève, Tudor, Lederer
- **1963 – 2025** (six decades)
- **US$ 11.7M+** combined valuation (the Lederer is carried at its published CHF 152,000 — the only piece not quoted in US$)
- **17** pieces carry the RRR (highest rarity) hallmark — verified by counting `RRR</b>` markers in `docs/watch/*.html`

> **Certificates are one short.** There are 16 Certificate of Provenance PDFs for 17 RRR
> pieces. The Lederer folio deliberately omits the download link rather than ship a
> certificate numbered "X OF 16". Regenerating the set as 17 renumbers every existing PDF.

### 33rd piece — provenance note (16 September 2026)
**Lederer CIC 39 InVerto Titanium.** Identified from an ARABWATCHGUIDE carousel the owner
supplied, then verified independently against the maker and watch press: Grade 5 titanium,
39 × 10.5 mm, calibre 9019, dual detent escapement with twin constant-force remontoirs,
3 Hz, 38 h, CHF 152,000, presented at **Dubai Watch Week, November 2025**, allocated in full
until summer 2027. The fair setting in the supplied photograph is consistent with that launch.
Lederer joins as the ninth maison. The watch plate was cut from the product render in the
supplied card — the candid half was discarded, as with the other 32.

### 32nd piece — provenance note (31 July 2026)
Rolex Daytona DiW "Motley 3S" Carbon was added from a photo Smiley uploaded directly in chat (not sourced from `client/public/watches-collection/` like the original 31). Identified by web research against watch-spotter coverage of the Sheikh's collection (IFL Watches, Superwatchman) and DiW's own published specs — not guessed. Same research pass also surfaced open questions about the identity of three *existing* pieces (`patek-philippe-5470p` may actually be a 5271P "Blue Sapphire"; the two `fp-journe-tourbillon-souverain-*` entries may both describe one real sapphire-dial piece rather than two separate blue/mint watches) — flagged to Smiley, not yet acted on. See PR history for sources.

---

### Image provenance — read before touching `docs/assets/`

Every photograph originally in this repo came from third-party watch-spotter
social posts, not from a commissioned shoot. Twenty-seven of the thirty-two were
**split-screen collages**: a candid photograph of a person on the left, a studio
watch render on the right, divided by a hard black seam. They were being rendered
full-bleed as the homepage hero, as ambient page banners, and as every card and
vitrine image on the site.

What was wrong with them, beyond the seam:

- one clip carried a **burned-in IFL Watches watermark**;
- one showed an **identifiable child**;
- one appears not to depict H.H. Sheikh Ammar at all;
- `patron.jpg` is an Arab Watch Guide card, watermark and caption baked in;
- the hero laid the live dial and the page headline **across His Highness's face**.

**The fix:** `docs/assets/plates/` now holds one uniform 800×800 plate per piece —
the watch half, trimmed of its black surround and centred on black. Every page
renders from `plates/`. The originals are untouched on disk and the four hero
clips were moved to `retired-assets/` (see the README there).

**Rules from here:**
1. Never render a source file from `docs/assets/*.webp|jpeg|jpg` directly — use its plate.
2. Do not restore anything from `retired-assets/`.
3. The only image of His Highness the site will show is one the owner supplies as
   `docs/assets/patron-official.jpg`. If it is ever removed, the slot falls back to a
   ع monogram medallion on its own. Do not substitute a candid, and do not generate a
   portrait of him.

**Portrait rights.** On 16 September 2026 the owner supplied the current
`patron-official.jpg` and stated he holds publication rights for images of His Highness,
naming Khamis Salem Al Matrooshi, authorised through the Office of the Ruler's Court of
Ajman. Recorded here as the owner's representation — it has not been independently
verified from this repo. If that permission lapses, remove the file; the monogram returns
by itself.

### Evidence from the owner's watch-spotter screenshots (16 September 2026)

The owner supplied a set of Instagram posts (`arabswatchspotting`, `watchleaderskw`,
`timekeeperkw`, `arabwatchguide`). Read as evidence, they **settle two of the open
questions** and surface pieces the ledger does not hold. Nothing below has been applied
to the site yet — each needs the owner's word on whether the fix is the name, the image,
or a new entry.

**Settled — the name is right, the picture is wrong:**

- `richard-mille-rm-65-01` — the real piece is the **RM 65-01 McLaren**, carbon on an
  orange strap (quoted ~US$ 460,000). The picture currently filed under this slug is a
  **Cartier Tank**, which is a different watch he also owns.
- `patek-philippe-5470p` — the real 5470P is **platinum, black dial, red 1/10th-second
  hand** (quoted ~US$ 500,000 at retail). The picture currently filed under this slug is
  the **baguette-sapphire perpetual calendar chronograph** — i.e. the 5271P long suspected
  in §3. The collection appears to hold **both**, filed as one.

**Evidenced but not in the ledger** (each would need its own folio and plate):

- **F.P. Journe Chronographe Monopoussoir Rattrapante** — Tokyo boutique 20th anniversary,
  200 pieces, 40 mm titanium with red-gold crown and pushers, 80 h, ~US$ 101,000
- **F.P. Journe FFC** — platinum, the hand that tells the hours
- **Breitling Avenger Blackbird** — DLC titanium, 44 × 12.7 mm, 38 h (would be a 10th maison)
- **Rolex Day-Date "Puzzle"** — rose gold, 36 mm, 70 h
- **Patek Philippe ref. 1463 "Tasti Tondi"** — gold chronograph
- **Cartier Tank** — salmon dial, and a second steel Tank (would be an 11th maison)

**Not his.** One post shows the **RM 67-01 Automatic Extra Flat** on
H.H. Sheikh Humaid bin Rashid Al Nuaimi, **Ruler of Ajman** — his father. Do not add it
to this collection. (The site's `richard-mille-rm-67-02-alexis-pinturault` is a different
reference and is unaffected.)

**Caution on captions.** The Tudor Black Bay post names Sheikh Ammar but the photograph
shows a different man. Spotter captions are a lead, not a provenance. Verify against the
maker before anything enters the ledger.

### Pieces whose photograph does not match their name

Found while auditing the plates. **Not corrected — these need Smiley's call**, because
the fix might be the name, the image, or both:

- `richard-mille-rm-65-01` — the image is a **Cartier Tank with an Arabic-numeral salmon dial**. Not a Richard Mille, and Cartier is not among the eight maisons.
- `tudor-black-bay-chronograph-pink-dial` — the image is a **skeletonised dress watch on a brown alligator strap**. Not a Black Bay chronograph.
- `patek-philippe-5470p` — the image is a **baguette-sapphire-set perpetual calendar chronograph, blue dial**, consistent with the **5271/11P "Blue Sapphire"** already suspected in §3, not a 5470P.
- `patron.jpg`'s own caption names a **Cartier Crash** in the collection — a piece the ledger does not list at all.

### The provenance line

Every folio carries one bilingual line under the rarity hallmark, in the small-caps gold
eyebrow style, set off by a short gold rule:

> EN — *Borne on the wrist of His Highness the Crown Prince of Ajman.*
> AR — «رُصدت على معصم سموّ ولي عهد عجمان.»

It keeps the ARABWATCHGUIDE verb (رُصد) and its parallel bilingual structure, in the
register of a maison's own catalogue rather than a spotter's headline. Class `.observed`.
Any new piece gets the same line — do not reword it per watch.

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
│  ├─ maisons.html        9 houses
│  ├─ films.html         THE SCREENING ROOM — the one verified film, presented as a
│  │                     featured editorial record, plus two honest onward routes into
│  │                     moving image the site actually has. No fabricated entries.
│  ├─ timeline.html       every dated piece, by decade
│  ├─ patron.html         سيرة الشيخ عمار — royal biography timeline, ambient video banner
│  ├─ watch/<slug>.html   32 individual folios (16 of them link a PDF certificate)
│  ├─ certificates/       16 bilingual "Certificate of Provenance" PDFs, one per RRR piece
│  └─ assets/
│     ├─ style.css        entire design system
│     ├─ app.js           lang, dial, video hero, filters, share, Piece of the Day, reveals,
│     │                   exhibition hall (exhibition()), vitrine lightbox (vitrine())
│     ├─ plates/          33 uniform 800×800 studio plates — the images the site renders
│     ├─ favicon.svg      ع monogram favicon (done — used on all 39 pages)
│     ├─ og-cover.jpg     social link preview
│     ├─ patron-official.jpg  the portrait, supplied by the owner (see §3, Portrait rights);
│     │                   remove it and the slot falls back to a ع monogram medallion
│     ├─ emblem.png       ← DROP OFFICIAL AJMAN EMBLEM HERE (see §7) — still not present
│     └─ *.webp/jpeg      33 images (32 watches + patron portrait)
└─ BLUEPRINT.md           strategy: launch plan, captions, next-level ideas
```

**39 HTML pages + 16 certificate PDFs.** Verified in-browser: 0 JS errors, video hero crossfades and advances chapters correctly, Arabic-first load confirmed.

**Header nav carries 5 links** — Home · Exhibition · Collection · Films · Sheikh Ammar.
Masterpieces, Maisons and Timeline were not deleted: they are lenses on the collection,
reached from the `.lenses` row at the top of `collection.html` and from the footer, which
still carries all eight destinations. The burger takes over below **1000px** (measured
17 Sept 2026: with five links the nav itself fits to ~820px in both languages, but
`.mono .nm` is now `white-space:nowrap`, so the wordmark stops shrinking and the nav
wraps at 980px; 1000 clears that with margin). If you change the link count **or** the
wordmark's wrapping, re-measure with `hdr2.mjs`-style row/collision checks — don't guess.

---

## 5. FEATURES BUILT (don't rebuild these)

- Cinematic veil entrance (ع monogram lifts on load) + film-grain texture
- Live engraved guilloché dial showing real Ajman time (GST, UTC+4)
- **Chapter hero**: four studio plates (Quraysh Daytona, Manama World Time, Chronomètre à Résonance, RM 68-01 Kongo) crossfading on a slow ken-burns drift, with bilingual chapter captions and clickable progress ticks; the drift is dropped under `prefers-reduced-motion`
- Crossfading gallery banners on the Patron and Masterpieces page headers
- Live crossfading gallery banners (stills from the collection's own photography) on Collection, Maisons, Timeline
- **The Exhibition Hall** (`exhibition.html`) — the museum: 32 vitrines walked one per screen (scroll-snap), each under its own spotlight with a brass placard; ← → keys (mirrored in RTL), Home/End, a 32-tick rail, a hall map by maison, and a **Curator's Tour** that auto-advances every 7.2s (space to pause; hidden under `prefers-reduced-motion`). Opens with the royal Rolex wing, Quraysh first. Arabic reading uses Arabic-Indic numerals.
- **The vitrine lightbox, with a loupe** — clicking the watch image on any folio (or any case in the hall) opens a spotlit glass-case view with the piece's lot and name. It **genuinely magnifies**: wheel, pinch, or double-click to go to 4.5×, drag to pan, `+` `-` `0` on the keyboard, and the pan is clamped to the plate's edges so it never drifts into empty black. ESC / click-outside / ✕ closes and focus returns. No zoom bars, no percentages.
- **The Patron** (`patron.html`) — the full record, bilingual: the arch portrait, the life timeline, **The House of Al Nuaimi** (an eight-row register: name, birth, father, mother, consort, children, schooling, training), **Offices** (five chairmanships with dates), **The Works** (seven numbered cards — Ajman Vision 2030, the Excellence Programme, Zero Bureaucracy, the Global Star Rating, the Mystery Shopper, Treatment Abroad, Private Education Coordination), and **Honours** (the Mohammed bin Rashid Sash, December 2024). Sourced from the Ajman Media Office, the Government of Ajman and UAE press — not invented.
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
- [x] Replace the split-screen collage imagery with uniform studio plates — done (§3, Image provenance)
- [x] Supply `docs/assets/patron-official.jpg` — done, supplied by the owner
- [ ] Regenerate the certificate set as 17 so the Lederer can carry one (see §3)
- [ ] Swap in the correct plates for `richard-mille-rm-65-01` and `patek-philippe-5470p`, and decide whether the Cartier Tank and the 5271P become entries of their own (§3, Evidence)
- [ ] Decide on the six evidenced-but-unlisted pieces, and whether Breitling and Cartier join as maisons (§3, Evidence)
- [ ] Resolve the remaining identity questions in §3 (the two Tourbillon Souverain entries; the unlisted Cartier Crash)
- [x] Lighthouse pass — target ≥90 performance, ≥95 accessibility — done (17 Sept 2026): homepage 95/100/96/100 (perf/a11y/BP/SEO), exhibition 94/100/96/100, watch folio 97/100/96/100. Fixed two real findings along the way: `<h5>` skipping heading levels on all 33 folios (now `<h2>`), and the header logo/lang-button aria-labels not containing their visible text (WCAG 2.5.3). The one remaining Best Practices point on every page is a documented `emblem.png` 404 — deliberately absent per §7 until the owner supplies the file, and it self-hides via `onerror`.
- [ ] Verify OG cards unfurl correctly once the site is live
- [ ] Do **not** touch valuations without Smiley's instruction (§2)

---

*Built for Smiley — Ajman, MMXXVI.*
