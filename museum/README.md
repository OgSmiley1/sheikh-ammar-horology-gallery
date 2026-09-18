# Sheikh Ammar museum — current edition

This isolated 42-record bilingual museum is the user-authorized Sites adaptation. It preserves the repository’s managed client/server/drizzle and existing docs website. It does not migrate or replace the Manus database.

Run `npm ci`, `npm test`, `npm start` from museum/. Development preview: `npm run dev`. Authored public files are dist/. The production server has no runtime dependencies, supports video seeking and has /healthz.

Branches: release/museum-current-v2 preserves the refined current presentation; feat/majlis-of-time-v2 contains the separate creative proposal explicitly requested by the owner. No main merge is implied by either branch.

Railway uses the root railway.json and museum/Dockerfile. Only museum/dist is public. Root docs, admin code, databases, source notes and user-uploaded screenshots are not served. No paid AI API is needed.
