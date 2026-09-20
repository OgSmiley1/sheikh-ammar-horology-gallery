# Sheikh Ammar Horology Museum — V1

**The Majlis of Time / مجلس الوقت**

This directory contains the canonical public museum deployed through Railway.

## Canonical public source

- Public files: `museum/dist/`
- Runtime: `museum/scripts/serve.mjs`
- Railway build: `museum/Dockerfile`
- Health check: `/healthz`
- Default language: Arabic
- Alternate language: English
- Collection ledger: 42 bilingual records in `museum/dist/watches.json`

The older `docs/` site remains in the repository as a design/editorial reference and as the record of substantial Claude Code work. It is **not** the production V1 application and must not be deployed over `museum/dist`.

## V1 routes

- `/` — The Majlis / home
- `/collection/` — full 42-piece collection
- `/exhibition/` — curated three-stop exhibition
- `/watchmaking/` — bilingual anatomy, complications and technical-record guide
- `/his-highness/` — H.H. Sheikh Ammar profile and leadership timeline

## V1 editorial direction

The museum is not ecommerce. Public copy uses a restrained Haute Horlogerie register:
Maison / الدار, timepiece / الساعة or القطعة, craftsmanship / المهارة الحرفية,
Haute Horlogerie / صناعة الساعات الراقية, calibre / العيار, complications / التعقيدات.

Owner-video language incorporated into V1:
- «ثلاث قطع. ثلاث لغات للوقت.»
- “Three Timepieces. Three Expressions of Time.”
- «حين تستحق اللحظة أن تطول.»
- “When a Moment Deserves to Last.”

## Featured three

The opening selection is intentionally curated and no longer depends on JSON order:
1. Patek Philippe Perpetual Calendar Chronograph 5270P Green
2. Patek Philippe Nautilus Perpetual Calendar 5740
3. Artisans de Genève La Montoya Platinum Challenge

The exhibition route separately presents:
- Rolex Daytona 6263 “Quraysh Hawk Dial”
- F.P. Journe FFC
- Richard Mille RM 65-01 McLaren W1

## Quality gates

```bash
cd museum
npm ci
npm test
```

The Railway Dockerfile runs `npm test` before producing the runtime image. A failed museum test therefore blocks a V1 Railway build.

Source-level V1 checks cover:
- 42 bilingual watch records
- local media existence
- duplicate IDs
- JS syntax
- featured-three selection
- owner-video copy
- exhibition route
- mobile editorial detail treatment
- favicon
- server routes, health check and byte-range video serving

## Current release workflow

Integration branch: `astro/v1-completion`  
Target release branch: `main`  
Target tag: `v1.0.0`  
Target platform: Railway

See:
- `/release/v1-manifest.json`
- `/release/v1-completion.json`
- `/docs/PROJECT_STATE.md`

Do not declare V1 complete until the final Railway source is updated to the release commit and the actual public deployment is verified in Arabic, English, mobile and desktop.


## Watchmaking chapter

The canonical V1 includes a bilingual Watchmaking chapter with the editorial lines:
- “Timeless timepieces.”
- “One of the few. Never one of many.”

It explains 12 elements of timepiece anatomy and 9 complications, including Chronograph, Tourbillon,
Dual Time / GMT, Perpetual Calendar, Minute Repeater, Split-seconds / Rattrapante, World Time,
Flyback and Moon Phase. Timepiece technical records link directly into this chapter.
