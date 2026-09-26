# Sheikh Ammar Horology Museum — Current Project State

Updated: 24 September 2026

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
- **A5/A6** Deploy hardening — see the Railway section of the PR that carries this change.

Railway facts at audit time: running deployment `7b1c39e2` (SUCCESS) serves `dbf552c` through a
start command that downloads the GitHub archive at boot; its Docker image (and so its `npm test`
gate) was built from the older `0a37206` on `release/museum-current-v2`. Staged patch `18db2ead`
still deletes both services — **only the owner can discard it, in the dashboard; never deploy it.**

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
