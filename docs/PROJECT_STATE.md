# Sheikh Ammar Horology Museum — Current Project State

Updated: 20 September 2026

## V1 production
- Canonical public source: `museum/dist/`
- Production platform: Railway
- Active service: `museum-current`
- Production deployment: `adfe054c-01e9-4518-8cfd-564be9670152` — SUCCESS
- Audited production code commit: `21b733ffc0012dc24b78b0f3b31aff77a695ae3d`
- Normal healthcheck: `/healthz`
- `/watchmaking/` was used as the promotion healthcheck and passed before the normal healthcheck was restored.
- `museum-vision` is dormant and excluded from normal auto-deploys.

## Canonical collection
**43 timepieces across 8 Maisons.**

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
- stale 42-piece or 7-Maison counts;
- old English navigation/copy layers.

## QA evidence
- Claude audit: 60/60 rendered cases passed after three defects were corrected.
- Claude audit: 23/23 Node/JSDOM/server tests passed.
- Final audit candidate: Railway staging deployment `f5438eb0-6b64-4271-8057-eebe0616a4f5` reached SUCCESS after `npm ci && npm test`.
- Production promotion: deployment `adfe054c-01e9-4518-8cfd-564be9670152` reached SUCCESS after the same test gate.
- Production Watchmaking route passed Railway healthcheck.

## Rule going forward
Do not reintroduce a second public version. Do not restore stale 42/7 counts. Do not bypass `verify-language.mjs`. New public English and Arabic must follow `content/horology-lexicon.json`.
