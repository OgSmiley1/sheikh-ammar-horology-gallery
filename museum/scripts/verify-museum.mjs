import { existsSync, readFileSync, statSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

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
// Films (owner direction, 29 Sep 2026): «المجموعة بعدسة الإعلام» on the Collection page only.
// Nothing from the video host may load with a page: the static HTML carries no player, no
// iframe and no host name (checked above), and app.js may reach the host only through
// loadFilmApi(), called from playFilm(), which runs on a visitor's click. Privacy-enhanced
// host only; never a native <video>.
if (/<video|<iframe/i.test(app)) fail('app.js: no native video element or literal iframe');
const hosts = [...app.matchAll(/https:\/\/[a-z.-]*youtube[a-z.-]*\.com[^'"`\s]*/gi)].map(m => m[0]);
if (hosts.some(h => !['https://www.youtube.com/iframe_api', 'https://www.youtube-nocookie.com'].includes(h))) fail(`app.js: unexpected video host reference ${hosts.join(', ')}`);
const loadCalls = [...app.matchAll(/(?<!function )loadFilmApi\(\)/g)].length;
const playBody = (app.split('async function playFilm(')[1] || '').split('\nfunction ')[0];
if (hosts.length && (loadCalls !== 1 || !playBody.includes('loadFilmApi()'))) fail('app.js: the film API may load only from playFilm, on a click');
if (!/fig\.querySelector\('\.film-play'\)\?\.addEventListener\('click'/.test(app)) fail('app.js: films must start only from their play control');
for (const [route, doc] of Object.entries(html)) {
  const films = [...doc.matchAll(/<figure class="film" data-film="([\w-]{11})">/g)].map(m => m[1]);
  if (films.length && route !== 'dist/collection/index.html') fail(`${route}: films belong on the Collection page only`);
  if (route === 'dist/collection/index.html' && films.join() !== 'Air31Kly7Ys') fail(`${route}: expected the one owner-kept film, found ${films.join() || 'none'}`);
}
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

// The marbled paper behind every light page: its darkest vein, in every mood the hour
// can carry (dawn → sand → pearl), under the grain at its mean, still holds AAA for
// every text colour that sits on paper.
const royal = read('dist/royal.js');
const vec = prefix => { const m = royal.match(new RegExp(`${prefix}vec3\\(([.\\d]+),([.\\d]+),([.\\d]+)\\)`)); if (!m) fail(`royal.js: paper shader colour ${prefix} missing`); return m.slice(1).map(Number); };
const moods = ['dawn=', 'sand=', 'pearl='].map(vec), veinTint = vec('vein=base\\*');
const grainOpacity = Number((css.match(/html::after\{[^}]*opacity:([.\d]+)/) || fail('styles.css: film grain missing'))[1]);
if (grainOpacity > .05) fail(`styles.css: film grain at ${grainOpacity} would muddy the paper`);
const lumRGB = c => { const l = c.map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * l[0] + .7152 * l[1] + .0722 * l[2]; };
let darkest = null;
for (let m = 0; m <= 2.0001; m += .02) {
  const [a, b, f] = m < 1 ? [moods[0], moods[1], m] : [moods[1], moods[2], m - 1];
  const vein = a.map((v, i) => (v + (b[i] - v) * f) * veinTint[i]).map(v => v * (1 - grainOpacity) + .5 * grainOpacity);
  if (!darkest || lumRGB(vein) < lumRGB(darkest)) darkest = vein;
}
for (const fg of ['ink', 'ink-2', 'bronze']) {
  const r = (lumRGB(darkest) + .05) / (lum(token(fg)) + .05);
  if (r < 7) fail(`royal.js: --${fg} on the paper shader's darkest vein is ${r.toFixed(2)}:1, below WCAG AAA 7:1`);
}
const paperFloor = (lumRGB(darkest) + .05) / (lum(token('bronze')) + .05);

// The motion language: three curves and nothing else, in CSS and in GSAP alike.
// Each CSS curve is the published bezier of its GSAP twin, so both speak one language.
const TWINS = { entry: 'cubic-bezier(.16,1,.3,1)', ambient: 'cubic-bezier(.37,0,.63,1)', hover: 'cubic-bezier(.33,1,.68,1)' };
const curves = [...new Set(css.match(/cubic-bezier\([^)]*\)/g) || [])];
if (curves.length !== 3 || !Object.entries(TWINS).every(([n, c]) => css.includes(`--ease-${n}:${c}`))) fail(`styles.css: the motion language is expo.out, sine.inOut and power2.out as --ease-entry/ambient/hover, found ${curves.join(' ')}`);
for (const decl of css.match(/(?:transition|animation)(?:-timing-function)?:[^;}]*/g) || [])
  if (/(?<![-\w])(?:linear|ease|ease-in|ease-out|ease-in-out)(?![-\w])/.test(decl)) fail(`styles.css: "${decl}" uses a curve outside the three`);
if (!/const EASE = \{ entry: 'expo\.out', ambient: 'sine\.inOut', hover: 'power2\.out' \}/.test(royal)) fail('royal.js: GSAP eases must be the same three curves');
if (/ease:\s*['"]/.test(royal)) fail('royal.js: every GSAP ease goes through EASE');

// Weight: the motion libraries load only from royal.js, and never under reduced motion;
// the whole of the shipped script stays inside the build pack's budget
// (~70 KB gzip added on top of the ~14 KB app.js that preceded it).
for (const [route, doc] of Object.entries(html)) if (doc.includes('/vendor/')) fail(`${route}: vendor scripts load from royal.js, not the page`);
if (!/if \(reduce\) reduced\(\); else motion\(\);/.test(royal)) fail('royal.js: reduced motion must never fetch the motion libraries');
const gz = file => gzipSync(readFileSync(path.join(root, file)), { level: 9 }).length;
const scriptKB = ['dist/vendor/gsap.min.js', 'dist/vendor/lenis.min.js', 'dist/royal.js', 'dist/app.js'].reduce((s, f) => s + gz(f), 0) / 1024;
if (scriptKB > 84) fail(`scripts weigh ${scriptKB.toFixed(1)} KB gzip, over the 84 KB budget`);

// The 3D anatomy watch: a separate bundle that only the Watchmaking stage may fetch,
// on demand, with WebGL; never named by a page, never part of the page budget above.
for (const [route, doc] of Object.entries(html)) if (doc.includes('watch3d')) fail(`${route}: watch3d.js loads from app.js on demand, not from the page`);
if ((app.match(/import\('\/watch3d\.js'\)/g) || []).length !== 1 || !/WebGL2RenderingContext[\s\S]{0,200}IntersectionObserver[\s\S]{0,400}import\('\/watch3d\.js'\)/.test(app)) fail('app.js: the 3D watch may load only from the anatomy stage, with WebGL, as it nears the screen');
const w3dKB = gz('dist/watch3d.js') / 1024;
if (w3dKB > 160) fail(`watch3d.js weighs ${w3dKB.toFixed(1)} KB gzip, over its 160 KB budget`);
const w3dSrc = read('scripts/watch3d.src.js');
for (const part of ['case', 'bezel', 'crystal', 'dial', 'hands', 'crown', 'calibre', 'escapement', 'balance', 'barrel', 'rotor', 'bridges'])
  if (!new RegExp(`add\\('${part}'`).test(w3dSrc)) fail(`watch3d: the ${part} is not a 3D part`);

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
if (!Array.isArray(data.watches) || data.watches.length !== 45) fail('watches.json: expected exactly 45 records');
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
// Provenance: every record states how His Highness appears and what the image rests on.
const TYPES = new Set(['owner_archive', 'manufacturer', 'auction', 'sighting_report']);
const STATUSES = new Set(['url-cited', 'cited-no-url', 'pending-owner', 'owner-confirmed']);
const pending = { 'pending-owner': 0, 'owner-confirmed': 0, 'cited-no-url': 0, 'url-cited': 0 };
for (const watch of data.watches) {
  const expected = watch.royalPairing === 'portrait' ? 'portrait_pair' : 'wrist';
  if (watch.imageClass !== expected) fail(`watches.json: ${watch.slug} imageClass must be ${expected}`);
  if (watch.wornClaim !== (expected === 'wrist')) fail(`watches.json: ${watch.slug} wornClaim contradicts its image class — a portrait pairing never claims wear`);
  if (!Array.isArray(watch.provenance) || !watch.provenance.length) fail(`watches.json: ${watch.slug} has no provenance trail`);
  if (!watch.provenance.some(p => p.type === 'owner_archive')) fail(`watches.json: ${watch.slug} does not say where its image of His Highness comes from`);
  for (const p of watch.provenance) {
    if (!TYPES.has(p.type) || !STATUSES.has(p.status) || !p.source || !p.permission) fail(`watches.json: ${watch.slug} malformed provenance entry`);
    if (p.status === 'url-cited' && !/^https:\/\//.test(p.url || '')) fail(`watches.json: ${watch.slug} url-cited entry without an https URL`);
    pending[p.status]++;
  }
}

const royalFiles = readdirSync(path.join(root, 'dist/assets/royal'));
if (royalFiles.length !== 45) fail(`assets/royal: expected 45 images, found ${royalFiles.length}`);
if (statSync(path.join(root, 'dist/images/sheikh/sheikh-portrait-1.webp')).size < 10000) fail('hero portrait missing');

console.log(`Museum verification passed: ${routes.length} routes, ${data.watches.length} records, each shown with His Highness (${data.watches.filter(w => w.royalPairing === 'photograph').length} photographs, ${data.watches.filter(w => w.royalPairing === 'portrait').length} portrait pairings).`);
console.log(`Motion: three curves; paper shader floor ${paperFloor.toFixed(2)}:1 for bronze; scripts ${scriptKB.toFixed(1)} KB gzip; 3D watch ${w3dKB.toFixed(1)} KB gzip, on demand.`);
console.log(`Provenance: ${pending['owner-confirmed']} confirmed by the owner, ${pending['pending-owner']} awaiting the owner, ${pending['cited-no-url']} citations without links, ${pending['url-cited']} links not re-checked; ${data.watches.filter(w => w.identityReview).length} identity reviews.`);
