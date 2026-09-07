# Claude Code Handoff — Sheikh Ammar Royal Horology Gallery

## Purpose

This repository is a bilingual, non-commercial private horology museum for His Highness Sheikh Ammar bin Humaid Al Nuaimi. It is not an online shop, valuation catalogue, or claims-of-ownership database. Every change must preserve the historic dark-luxury composition, the museum tone, the Arabic editorial character, the English LTR / Arabic RTL spatial discipline, and the source-bounded wording already present in the live project.

The current project is a React 19, Vite, Tailwind 4, Express, tRPC 11, Drizzle ORM, MySQL-compatible database application. The managed project is the source of truth for the published Manus deployment. The GitHub repository is the collaboration and handoff mirror; do not copy secrets into it.

## Operating boundaries

Claude Code may read and write application source, tests, documentation, and project-safe assets. Claude Code may create branches, commits, and pull requests. It must not expose or commit `DATABASE_URL`, `JWT_SECRET`, OAuth secrets, Forge keys, storage credentials, GitHub tokens, administrator passwords, or `.env` files. Use the protected project environment for secrets.

Do not add prices, market values, sale language, promotional calls to action, fabricated testimonials, invented ownership claims, or unverified watch associations. If a source is incomplete, use neutral museum language such as “publicly observed” or “source-bounded archive record” and leave the unsupported field empty.

All watch imagery must come from an existing project asset or a user-supplied asset that has been intentionally uploaded into project-managed storage. Never download a replacement image from an arbitrary website and never generate a watch photograph to fill an empty card.

## Repository map

| Area | Responsibility |
|---|---|
| `client/src/pages/Home.tsx` | Ceremonial bilingual homepage, watch-story opening, archive pathways |
| `client/src/pages/Collection.tsx` | Live archive atlas, filters, card display, collection film |
| `client/src/pages/WatchDetail.tsx` | Museum record detail, localized metadata, image gallery, reflections |
| `client/src/pages/ConstellationOfTime.tsx` | 3D orbital timeline/gallery with active record navigation |
| `client/src/components/ArchiveStorySlideshow.tsx` | Homepage editorial slideshow and project-only story media |
| `client/src/components/WatchMedia.tsx` | Shared resilient project-only image surface and bilingual fallback |
| `client/src/components/ImageGallery.tsx` | Detail-view zoom, fullscreen, image deduplication, broken-image handling |
| `client/src/index.css` | Global luxury tokens, RTL/LTR rules, media surfaces, orbital stage, entrance plaque |
| `drizzle/schema.ts` | Database schema and inferred watch/brand types |
| `server/db.ts` | Database reads, writes, watch queries, brand queries, and image ordering |
| `server/routers.ts` | Public and protected tRPC contracts |
| `server/_core/index.ts` | Express startup, OAuth, tRPC, storage proxy, Vite/static serving |
| `server/migrations/` | Idempotent data-enrichment migrations run by the application startup path |
| `client/src/lib/*Contracts.test.ts` | Source-contract regression tests for public and migration behavior |
| `todo.md` | Historical project register; never delete entries, and mark completed work with evidence |
| `docs/live-customer-journey-audit.md` | Browser QA evidence and route observations |

## Safe development order

Start every session by reading `README.md`, `todo.md`, this guide, the relevant page/component, and the latest server logs. Check the current branch and working tree before editing:

```bash
git status --short
git branch --show-current
pnpm check
pnpm test
```

Before changing a feature, append an unchecked item to `todo.md`. Add or update a focused Vitest contract before implementation whenever the change affects a source contract, migration, route, or security boundary. Implement the smallest change that preserves the historic layout. Use the existing `WatchMedia` component for every public watch-image surface instead of creating a new raw-image branch.

After implementation, run the complete validation sequence:

```bash
pnpm check
pnpm test
pnpm build
```

For browser QA, use the local application and check both languages. At minimum, verify `/`, `/collection`, `/constellation`, `/stories`, `/about`, `/advanced-search`, `/compare`, `/top10`, one brand route, `/timeline`, one image-backed watch detail, and one fallback watch detail. Confirm that Arabic puts the visual asset on the right with right-aligned copy and English puts the visual asset on the left with left-aligned copy.

## DiW Motley Carbon Daytona handoff

The supplied handoff describes a 32nd record named **Rolex Daytona DiW “Motley 3S” Carbon**. The handoff package is only safe to apply when all of its files are present and individually reviewed:

```text
addDiWMotleyCarbon.ts
WIRING.diff
diWMotleyCarbonContracts.ts
rolex-daytona-diw-motley-carbon.webp
README.md
```

At the time of this guide’s creation, only `README.md` was available in the sandbox upload directory. Do not fabricate the missing migration, test, or image files. When the complete package is supplied, use this order:

1. Inspect the migration imports against the live project. The current project uses `server/db.ts` and `drizzle/schema.ts`; do not assume a copied import path is correct.
2. Upload the WebP through project-managed storage. Never commit a secret URL or local upload path into a public source file.
3. Verify the Rolex brand slug with a read-only database query before calling the migration.
4. Review the draft English and Arabic copy through the project’s source-boundary rules. Correct wording only to remove unsupported claims; do not add commercial metadata.
5. Verify that the migration is idempotent and cannot create duplicates on application restart.
6. Place a startup import/call only where the live `server/_core/index.ts` actually supports it. The current file does not show migration imports, so do not paste a diff blindly.
7. Add the supplied contract test and extend rendering-route coverage for the exact slug.
8. Run the complete test/build/browser sequence and query the inserted row before checkpointing.

A safe read-only database check is:

```sql
SELECT id, slug, nameEn, nameAr, mainImageUrl, retailPrice, marketValue, isActive
FROM watches
WHERE slug IN ('rolex-daytona-diw-motley-carbon', 'rolex-daytona-diw-motley-3s-carbon');

SELECT id, slug, nameEn, nameAr
FROM brands
WHERE LOWER(nameEn) LIKE '%rolex%' OR LOWER(slug) LIKE '%rolex%';
```

The exhibit must have `retailPrice` and `marketValue` set to `NULL`, and its editorial note must remain a museum record rather than a sale listing or unsupported ownership assertion. Correct technical facts must be structured in fields such as `movement`, `complications`, `caseMaterial`, `caseSize`, `waterResistance`, and `strap`, not hidden only in prose.

## Database safety

Do not use destructive SQL in a normal feature task. Do not insert test data. For schema changes, edit `drizzle/schema.ts`, generate the migration using the project’s database workflow, execute it through the managed database tooling, and verify the result with a read-only query. Data migrations must use an existence guard or a deterministic slug guard and must be safe to run more than once.

## GitHub workflow

The GitHub repository is `OgSmiley1/sheikh-ammar-horology-gallery`. Use the GitHub CLI for GitHub operations:

```bash
gh auth status
gh repo view OgSmiley1/sheikh-ammar-horology-gallery
gh pr list --repo OgSmiley1/sheikh-ammar-horology-gallery --state open
```

Create a branch with a descriptive name, commit using Conventional Commits, and push the branch:

```bash
git switch -c feat/royal-gallery-update-YYYY-MM-DD
git add client server drizzle shared docs scripts todo.md
 git commit -m "feat: reconcile royal gallery updates"
git push --set-upstream origin HEAD
```

If the managed checkout uses an internal storage remote instead of GitHub, do not replace that remote blindly. Clone GitHub into a separate directory, compare the application trees, and open a pull request from a dedicated synchronization branch. Preserve useful GitHub documentation only after auditing it against the current application; do not merge a static duplicate site over the managed React application without an explicit decision.

The current open Claude Code pull request is documentation-heavy and should be reviewed file-by-file. Static `docs/` pages may provide useful copy references, but they are not automatically the live React application. Prefer the managed project source for production behavior.

## Suggested validation script

The repository-safe validator is `scripts/verify-handoff.mjs`. It must check only local source contracts and file presence; it must never print secret values. A minimal invocation is:

```bash
node scripts/verify-handoff.mjs
pnpm check
pnpm test
pnpm build
```

## Rollback

Before a risky change, save a managed project checkpoint. If a change breaks the project and cannot be repaired with a focused edit, use the project rollback mechanism rather than `git reset --hard`. For GitHub, close or revert the synchronization PR rather than force-pushing over collaborators’ work.

## Completion checklist

A change is ready for delivery only when the focused tests, the full Vitest suite, TypeScript, and production build pass; browser QA has covered both languages; no public commercial wording has been introduced; image sources are project-only; the working tree is clean or intentionally documented; the GitHub branch/PR status is known; and the task register contains no unchecked item for the completed scope.
