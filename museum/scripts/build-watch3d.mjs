// Bundles scripts/watch3d.src.js with the parts of three.js it uses into dist/watch3d.js.
// Pinned on purpose; the tools install into a temp directory so the museum's own
// dependencies stay as they are.   node scripts/build-watch3d.mjs
// three.js: MIT. esbuild: MIT.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const PINS = { three: '0.186.1', esbuild: '0.25.10' };
const dir = mkdtempSync(path.join(tmpdir(), 'watch3d-'));
execFileSync('npm', ['i', '--no-audit', '--no-fund', '--prefix', dir, ...Object.entries(PINS).map(([n, v]) => `${n}@${v}`)], { stdio: 'inherit' });
const esbuild = createRequire(path.join(dir, 'x.js'))('esbuild');
const here = path.dirname(new URL(import.meta.url).pathname);
await esbuild.build({
  entryPoints: [path.join(here, 'watch3d.src.js')],
  outfile: path.join(here, '../dist/watch3d.js'),
  bundle: true, minify: true, format: 'esm', target: 'es2020', legalComments: 'none',
  nodePaths: [path.join(dir, 'node_modules')]
});
rmSync(dir, { recursive: true, force: true });
console.log('built dist/watch3d.js with', PINS);
