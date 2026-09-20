# Sheikh Ammar Horology Museum — Current Project State

Updated: 20 September 2026

## Canonical V1
- Public application: `museum/dist/`
- Reference / historical Claude folios: `docs/`
- Production platform: Railway
- Production service: `museum-current`
- Arabic is the default language; English is the full alternate language.
- Canonical collection ledger: **43 timepieces across 8 Maisons**.

## Claude Code audit
Claude's latest audit commit is `f024ceeb08bc37694db0ae289ba37756117cd1b7`, one commit ahead of the then-current main.

The audit found three genuine user-visible defects:
1. reduced-motion visitors could receive an empty ambient watch image;
2. the Quraysh exhibition image path contained a one-digit filename error;
3. `watchmaking-event.webp` was corrupt and could not decode.

The first two fixes are retained. The third has now been resolved properly by rebuilding the WebP from the original owner-supplied JPEG and restoring it to the Watchmaking chapter exactly once.

Claude's rendered gate passed **60/60** route/language/viewport combinations after its fixes. The matrix runs with `prefers-reduced-motion: reduce`; Claude separately verified the ambient behaviour in normal and reduced-motion modes.

## Language and terminology audit
Canonical English follows a restrained Haute Horlogerie register:
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
- dual time / GMT
- perpetual calendar
- minute repeater
- split-seconds chronograph / rattrapante
- world time
- flyback chronograph
- moon-phase indication
- craftsmanship
- horological heritage
- Haute Horlogerie

Canonical Arabic includes:
- الدار
- القطعة / الساعة
- العيار
- الحركة
- التعقيدات
- احتياطي الطاقة
- حركة ذاتية التعبئة
- حركة يدوية التعبئة
- مُكرِّر الدقائق
- كرونوغراف الثواني المنقسمة / راترابانت
- صناعة الساعات الراقية
- المهارة الحرفية
- إرث صناعة الساعات

Editorial signature lines:
- «ثلاث قطع. ثلاث لغات للوقت.» / “Three Timepieces. Three Expressions of Time.”
- «حين تستحق اللحظة أن تطول.» / “When a Moment Deserves to Last.”
- «قطعٌ تتجاوز الزمن.» / “Timeless timepieces.”
- «من القلائل. لا من بين الكثير.» / “One of the few. Never one of the many.”

A dedicated `museum/scripts/verify-language.mjs` release gate now prevents regressions to inconsistent labels such as `Functions`, `Caliber`, obsolete Watchmaking headings, or stale 42-piece / 7-Maison counts.

## Watchmaking chapter
`/watchmaking/` explains:
- 12 anatomy concepts;
- 9 complications / mechanisms;
- the distinction between a turbine and a tourbillon;
- how to read the technical record.

Timepiece detail sheets link directly to the matching complication explanation.

## Current audit branch
`audit/claude-terminology-v1`

This branch contains:
- Claude's three audited fixes;
- restored valid owner-supplied Watchmaking image;
- final English and Arabic terminology pass;
- canonical count correction to 43 timepieces / 8 Maisons;
- automated terminology regression gate.

## Release rule
Do not promote this audit branch to production until its complete `npm test` gate passes. After merge, Railway must boot the resulting immutable `main` commit and the live routes must be health-checked.
