// Refreshes the two self-hosted motion libraries in dist/vendor from the npm registry.
// Pinned on purpose: bump the versions here, run it, and re-run the gates.
//   node scripts/vendor.mjs
// GSAP core only (no ScrollTrigger/Draggable/SplitText/Flip — the museum's own
// reveal, drag, word-split and flip code replaces them to stay inside the
// build pack's ~70 KB gzip budget). GSAP: https://gsap.com/standard-license.
// Lenis: MIT.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, copyFileSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const PINS = { gsap: '3.15.0', lenis: '1.3.26' };
const dir = mkdtempSync(path.join(tmpdir(), 'vendor-'));
execFileSync('npm', ['i', '--no-audit', '--no-fund', '--prefix', dir, ...Object.entries(PINS).map(([n, v]) => `${n}@${v}`)], { stdio: 'inherit' });
const out = new URL('../dist/vendor/', import.meta.url).pathname;
copyFileSync(path.join(dir, 'node_modules/gsap/dist/gsap.min.js'), path.join(out, 'gsap.min.js'));
const lenis = path.join(out, 'lenis.min.js');
copyFileSync(path.join(dir, 'node_modules/lenis/dist/lenis.min.js'), lenis);
// the shipped file points at a source map the museum does not serve
writeFileSync(lenis, readFileSync(lenis, 'utf8').replace(/\/\/# sourceMappingURL=\S+\s*$/, ''));
rmSync(dir, { recursive: true, force: true });
console.log('vendored', PINS);
