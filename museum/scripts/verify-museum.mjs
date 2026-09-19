import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const fail = (message) => { throw new Error(message); };
const read = (file) => readFileSync(path.join(root, file), 'utf8');

const routes = ['dist/index.html', 'dist/collection/index.html', 'dist/his-highness/index.html', 'dist/watchmaking/index.html'];
if (existsSync(path.join(root, 'dist/vision.js'))) routes.push('dist/exhibition/index.html');
for (const route of routes) {
  const html = read(route);
  if (!html.includes('<html') || !html.includes('<body')) fail(`${route}: malformed document shell`);
  const runtime = route.includes('/watchmaking/') ? '/watchmaking.js' : '/app.js';
  if (!html.includes(runtime) || !html.includes('/styles.css')) fail(`${route}: missing runtime assets`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (duplicates.length) fail(`${route}: duplicate ids ${[...new Set(duplicates)].join(', ')}`);
}

const app = read('dist/app.js');
for (const token of ['initAmbient', 'initWatchAmbient', 'renderFeatured', 'ensureAmbientControl', 'changeLanguage', 'openDetail', 'slidePause', 'collectionVideo']) {
  if (!app.includes(token)) fail(`app.js: missing runtime feature ${token}`);
}
if (!app.includes('prefers-reduced-motion')) fail('app.js: reduced-motion handling missing');
if (!read('dist/styles.css').includes('.featured-stage')) fail('styles.css: featured watch stage missing');
if (!existsSync(path.join(root, 'dist/favicon.svg'))) fail('favicon.svg missing');
const watchmaking = read('dist/watchmaking/index.html');
for (const token of [
  'Timeless timepieces.',
  'One of the few. Never one of many.',
  'Chronograph',
  'Tourbillon',
  'Dual Time / GMT',
  'Perpetual Calendar',
  'Minute Repeater',
  'Split-seconds / Rattrapante',
  'World Time',
  'A turbine is not a tourbillon.',
  'Turbine'
]) if (!watchmaking.toLowerCase().includes(token.toLowerCase())) fail(`watchmaking guide: missing ${token}`);
if (!existsSync(path.join(root, 'dist/watchmaking.js'))) fail('watchmaking.js missing');
for (const page of ['dist/index.html','dist/collection/index.html','dist/exhibition/index.html','dist/his-highness/index.html']) {
  if (!read(page).includes('href="/watchmaking/"')) fail(`${page}: watchmaking navigation link missing`);
}
for (const required of ['dist/robots.txt','dist/sitemap.xml','dist/site.webmanifest']) {
  if (!existsSync(path.join(root, required))) fail(`${required} missing`);
}
const sitemap = read('dist/sitemap.xml');
for (const route of ['/collection/','/exhibition/','/watchmaking/','/his-highness/']) {
  if (!sitemap.includes(route)) fail(`sitemap missing ${route}`);
}
if (!existsSync(path.join(root, 'dist/images/sheikh/watchmaking-event.webp'))) fail('latest owner-supplied watchmaking image missing');
const allHtmlForMedia = routes.map(route => read(route)).join('\n');
const watchmakingEventRefs = (allHtmlForMedia.match(/watchmaking-event\.webp/g) || []).length;
if (watchmakingEventRefs !== 1) fail(`latest watchmaking image must appear exactly once, found ${watchmakingEventRefs}`);

for (const token of [
  "featuredTitle:'ثلاث قطع. ثلاث لغات للوقت.'",
  "featuredTitle:'Three Timepieces. Three Expressions of Time.'",
  "filmTitle:'حين تستحق اللحظة أن تطول.'",
  "filmTitle:'When a Moment Deserves to Last.'",
  "technicalRecord:'السجل التقني'",
  "patek-philippe-perpetual-calendar-5270p-green",
  "patek-philippe-nautilus-perpetual-calendar-5740",
  "artisans-de-geneve-la-montoya-platinum-challenge"
]) if (!app.includes(token)) fail(`app.js: missing V1 requirement ${token}`);
if (!read('dist/styles.css').includes('V1 mobile timepiece sheet')) fail('styles.css: V1 mobile detail treatment missing');

const data = JSON.parse(read('dist/watches.json'));
if (!Array.isArray(data.watches) || data.watches.length !== 43) fail('watches.json: expected exactly 43 records');
const ids = new Set();
for (const watch of data.watches) {
  if (ids.has(watch.id)) fail(`watches.json: duplicate id ${watch.id}`);
  ids.add(watch.id);
  for (const field of ['nameAr', 'nameEn', 'editorialAr', 'editorialEn']) {
    if (!watch[field] || !String(watch[field]).trim()) fail(`watches.json: ${watch.id} missing ${field}`);
  }
  if (!watch.displayImage) fail(`watches.json: ${watch.id} missing displayImage`);
  const asset = path.join(root, 'dist', watch.displayImage.replace(/^\//, ''));
  if (!existsSync(asset) || statSync(asset).size < 100) fail(`watches.json: missing/empty asset for ${watch.id}`);
}

if (!existsSync(path.join(root, 'dist/collection-film.mp4'))) fail('collection-film.mp4 missing');
console.log(`Museum verification passed: ${routes.length} routes, ${data.watches.length} bilingual records, ${data.watches.length} local media assets.`);
