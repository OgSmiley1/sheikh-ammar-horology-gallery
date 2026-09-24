import { existsSync, readFileSync, statSync, readdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const fail = (message) => { throw new Error(message); };
const read = (file) => readFileSync(path.join(root, file), 'utf8');

const routes = ['dist/index.html', 'dist/collection/index.html', 'dist/exhibition/index.html', 'dist/his-highness/index.html', 'dist/watchmaking/index.html'];
const html = Object.fromEntries(routes.map(r => [r, read(r)]));
for (const [route, doc] of Object.entries(html)) {
  if (!doc.includes('<html lang="ar" dir="rtl"') || !doc.includes('<body')) fail(`${route}: must open in Arabic, right-to-left`);
  if (!doc.includes('/app.js') || !doc.includes('/styles.css')) fail(`${route}: missing runtime assets`);
  const ids = [...doc.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (duplicates.length) fail(`${route}: duplicate ids ${[...new Set(duplicates)].join(', ')}`);
  for (const href of ['/', '/collection/', '/exhibition/', '/his-highness/', '/watchmaking/'])
    if (!doc.includes(`href="${href}"`)) fail(`${route}: navigation link ${href} missing`);
  // Royal rules — see CLAUDE.md and the owner's 24 Sept 2026 directive.
  const header = doc.slice(doc.indexOf('<header'), doc.indexOf('</header>'));
  if (/[▶►]|ambientPause|play/i.test(header)) fail(`${route}: the header must carry no play control`);
  if (/youtube|<video|<iframe/i.test(doc)) fail(`${route}: no raw video player or YouTube embed on a royal page`);
  for (const [, src] of doc.matchAll(/<img[^>]+src="([^"]+)"/g))
    if (!/^\/(images\/sheikh|images\/sheikh-examining-watches|assets\/royal)\b/.test(src)) fail(`${route}: image ${src} is not a photograph of His Highness`);
  if (doc.includes('watchmaking-event.webp')) fail(`${route}: watchmaking-event.webp is truncated and must not be published until re-supplied`);
}

const app = read('dist/app.js');
for (const token of ['applyLanguage', 'changeLanguage', 'openDetail', 'renderFeatured', 'initScreen', 'initExhibition', 'prefers-reduced-motion', 'royalImage'])
  if (!app.includes(token)) fail(`app.js: missing runtime feature ${token}`);
if (/youtube|<video/i.test(app)) fail('app.js: no YouTube or native video player');
for (const retired of ['vision.js', 'vision.css', 'reading.css', 'watchmaking.js', 'collection-film.mp4'])
  if (existsSync(path.join(root, 'dist', retired))) fail(`dist/${retired} was retired and must not return`);

// Palette: every text colour meets WCAG AAA (7:1) on the surface it is used on.
const css = read('dist/styles.css');
const token = name => (css.match(new RegExp(`--${name}:(#[0-9a-f]{6})`, 'i')) || fail(`styles.css: token --${name} missing`))[1];
const lum = hex => {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(token(a)), lum(token(b))].sort((m, n) => n - m); return (x + .05) / (y + .05); };
for (const [fg, bg] of [['ink', 'paper'], ['ink-2', 'paper'], ['bronze', 'paper'], ['ink', 'white'], ['ink-2', 'white'], ['bronze', 'white'], ['ink-2', 'stone'], ['bronze', 'stone'], ['moon', 'night'], ['moon-2', 'night'], ['gold', 'night'], ['moon-2', 'night-2']]) {
  const r = ratio(fg, bg);
  if (r < 7) fail(`styles.css: --${fg} on --${bg} is ${r.toFixed(2)}:1, below WCAG AAA 7:1`);
}
if (!/\.on-night \.body-2\{color:var\(--moon-2\)\}|\.on-night \.body-2\{color:var\(--moon-2\)/.test(css)) fail('styles.css: body copy on dark sections must switch to the light tone');

const watchmaking = html['dist/watchmaking/index.html'];
for (const tokenText of ['Timeless timepieces.', 'One of not many', 'Chronograph', 'Tourbillon', 'Dual Time &amp; GMT', 'Perpetual Calendar', 'Minute Repeater', 'Split-seconds Chronograph / Rattrapante', 'World Time', 'A turbine is not a tourbillon.'])
  if (!watchmaking.includes(tokenText)) fail(`watchmaking guide: missing ${tokenText}`);
if ((watchmaking.match(/<article>/g) || []).length !== 12) fail('watchmaking guide: expected 12 anatomy entries');
if ((watchmaking.match(/<article id="complication-/g) || []).length !== 9) fail('watchmaking guide: expected 9 complications');

for (const required of ['dist/robots.txt', 'dist/sitemap.xml', 'dist/site.webmanifest', 'dist/favicon.svg'])
  if (!existsSync(path.join(root, required))) fail(`${required} missing`);
const sitemap = read('dist/sitemap.xml');
for (const route of ['/collection/', '/exhibition/', '/watchmaking/', '/his-highness/'])
  if (!sitemap.includes(route)) fail(`sitemap missing ${route}`);

const data = JSON.parse(read('dist/watches.json'));
if (!Array.isArray(data.watches) || data.watches.length !== 44) fail('watches.json: expected exactly 44 records');
const ids = new Set();
const isWebp = file => { const b = readFileSync(file); return b.length > 1000 && b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP' && b.readUInt32LE(4) + 8 === b.length; };
for (const watch of data.watches) {
  if (ids.has(watch.id)) fail(`watches.json: duplicate id ${watch.id}`);
  ids.add(watch.id);
  for (const field of ['nameAr', 'nameEn', 'editorialAr', 'editorialEn'])
    if (!watch[field] || !String(watch[field]).trim()) fail(`watches.json: ${watch.id} missing ${field}`);
  if (!watch.royalImage?.startsWith('/assets/royal/')) fail(`watches.json: ${watch.slug} has no royal image — every timepiece is shown with His Highness`);
  if (!['photograph', 'portrait'].includes(watch.royalPairing)) fail(`watches.json: ${watch.slug} must declare how His Highness appears (photograph | portrait)`);
  const asset = path.join(root, 'dist', watch.royalImage.slice(1));
  if (!existsSync(asset) || !isWebp(asset)) fail(`watches.json: royal image for ${watch.slug} is missing or not a complete WebP`);
}
const royalFiles = readdirSync(path.join(root, 'dist/assets/royal'));
if (royalFiles.length !== 44) fail(`assets/royal: expected 44 images, found ${royalFiles.length}`);
if (statSync(path.join(root, 'dist/images/sheikh/sheikh-portrait-1.webp')).size < 10000) fail('hero portrait missing');

console.log(`Museum verification passed: ${routes.length} routes, ${data.watches.length} records, each shown with His Highness (${data.watches.filter(w => w.royalPairing === 'photograph').length} photographs, ${data.watches.filter(w => w.royalPairing === 'portrait').length} portrait pairings).`);
