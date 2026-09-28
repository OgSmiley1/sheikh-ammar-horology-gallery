---
name: royal-museum-qa
description: Sheikh Ammar museum design, bilingual content, artwork and royal release gates. Use for any museum UI/content/asset edit and before claiming release.
---
# Royal Museum QA
Read docs/PROJECT_STATE.md FIRST and inspect main, open PRs, live Railway museum-current service and existing test scripts. Root CLAUDE.md has older contradictory rules; newer verified project state and owner directives take precedence.
- This is a museum and verified public-life profile of H.H. Sheikh Ammar bin Humaid Al Nuaimi, not a watch storefront. Arabic default; English full counterpart; narrative, typography, restraint and accessible legibility take priority over gratuitous animation.
- Canonical working site is museum/dist generated from museum/scripts; preserve latest gallery and data. Derive collection count from current canonical records (45 in 26-27 Sep checkpoint, re-count before editing); never reinstate stale 33/44 references. Do not infer ownership or provenance from a composite image.
- Each watch display must include authentic H.H.-with-watch visual evidence where available or an explicitly labeled portrait+verified watch pairing, never imply he wore a pairing. Do not fabricate his face, watch history, personal tastes or authorship. Respect provenance and image-use rights.
- Separate gates: (A) Engineering: test/build and exact SHA; (B) Museum: completeness, bilingual copy, technical correctness, image/portrait pairing; (C) Royal presentation: actual desktop/mobile screenshots, visual composition and legibility. Green test counts cannot automatically approve all three.
- Automate 375/390/412/430/768/1024/1440/1920 px when scripts support them, AR+EN+reduced motion; check typography contrast, no face-covered text, crop, overflow, overlap, RTL, no raw player UI and correct image-to-reference mapping. Browser-verify the exact candidate and keep an owner-visible evidence report.
- Source of truth for deployment: Railway Sheikh Ammar Horology Museum > museum-current, verified current main commit and health. Museum-vision is legacy; never delete or modify infrastructure without owner approval. Do not widen public access; distinguish currently public repo/service from owner's desired private presentation.
- Before PR: attach screenshot evidence, test output, unresolved provenance approvals, rollback path and exact next step. Do not announce royalty-ready until real visual owner acceptance.
