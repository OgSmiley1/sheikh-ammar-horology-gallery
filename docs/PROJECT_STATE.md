# Sheikh Ammar Horology Museum — Current Project State

Updated: 20 September 2026

## V1 production
- Canonical public source: `museum/dist/`
- Production platform: Railway
- Active service: `museum-current`
- Production service: `museum-current`
- Railway direct source metadata remains pinned to a legacy branch snapshot; canonical main is therefore served through an exact-SHA runtime bootstrap until Railway source editing is available.
- Latest pre-expansion bootstrap deployment: `68338aad-3175-458c-957b-186f91a59d9a` — SUCCESS
- Last fully rendered/audited production lineage: `aa8527fbd1d4757059d5d83e258b61e6c39f893f`
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
- Pre-expansion bootstrap deployment `68338aad-3175-458c-957b-186f91a59d9a` reached SUCCESS. The 44-record Rolex 6100 expansion requires a fresh production gate before it is called live-verified.
- Production Watchmaking route passed Railway healthcheck.

## Rule going forward
Do not reintroduce a second public version. Do not restore stale 42/43 or 7-Maison counts. Do not bypass `verify-language.mjs`. New public English and Arabic must follow `content/horology-lexicon.json`.

## 20 September 2026 — Rolex 6100 expansion
- Added Rolex ref. 6100 “Chinese Dragon” as the 44th canonical record.
- Relationship to H.H. Sheikh Ammar is classified as a reported public appearance, not private-ownership proof.
- Technical identity and rarity language are bounded to Christie’s catalogue; Waqt is retained as the public-appearance report.
- A cropped owner-supplied documentary image is used provisionally without the surrounding collage/person; a higher-resolution master remains desirable.
- The Rolex 6100 now leads the homepage three-piece curatorial selection because of its enamel craft and historical significance.
