import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const fail = (message) => { throw new Error(message); };
const read = (file) => readFileSync(path.join(root, file), 'utf8');

const routes = ['dist/index.html', 'dist/collection/index.html', 'dist/his-highness/index.html'];
for (const route of routes) {
  const html = read(route);
  if (!html.includes('<html') || !html.includes('<body')) fail(`${route}: malformed document shell`);
  if (!html.includes('/app.js') || !html.includes('/styles.css')) fail(`${route}: missing shared runtime assets`);
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

const data = JSON.parse(read('dist/watches.json'));
if (!Array.isArray(data.watches) || data.watches.length !== 42) fail('watches.json: expected exactly 42 records');
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
