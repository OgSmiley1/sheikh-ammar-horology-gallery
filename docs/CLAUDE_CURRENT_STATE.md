# Project state — continuity pointer

Updated: 20 September 2026

This file previously described the retired GitHub Pages `docs/` build as the live site. That is no longer true.

## Canonical reality
- Canonical public source: `museum/dist/`
- Production platform: Railway
- Canonical service: `museum-current`
- Canonical branch: `main`
- Default language: Arabic; English is the complete alternate language.
- Canonical ledger: 44 timepieces across 8 Maisons.
- Current continuity source: `docs/PROJECT_STATE.md`
- Release state: `release/v1-manifest.json` and `release/v1-completion.json`

## Current collection expansion
Rolex reference 6100 “Chinese Dragon” cloisonné enamel is the 44th record and leads the homepage three-piece selection. Its relationship to H.H. Sheikh Ammar is presented only as a reported public appearance. Christie’s is the technical/provenance authority for the reference; Waqt is the appearance-report source.

## Deployment constraint
Railway's available direct connector cannot currently rewrite the service's source branch metadata, and the Railway AI agent is usage-limited. Until that can be corrected, `museum-current` serves an exact canonical `main` SHA through a runtime bootstrap. Do not create a second public museum to work around this.

## Next action
Run the full source gate for the 44-record tree, promote that exact SHA to Railway, verify the live Arabic/English collection and Rolex 6100 image, then decide whether the dormant `museum-vision` service can be retired.

Do not resume work from the historical notes previously stored here. Use `docs/PROJECT_STATE.md` as the project brain.
