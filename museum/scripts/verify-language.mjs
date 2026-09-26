import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFileSync(path.join(root, file), 'utf8');
const fail = message => { throw new Error(message); };

const app = read('dist/app.js');
const pages = ['dist/index.html', 'dist/collection/index.html', 'dist/his-highness/index.html', 'dist/exhibition/index.html', 'dist/watchmaking/index.html'].map(read).join('\n');
const watchmaking = read('dist/watchmaking/index.html');
// The release manifest lives outside museum/, so the Docker build context does not carry it.
const manifestPath = path.join(root, '../release/v1-manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : null;
const data = JSON.parse(read('dist/watches.json'));
const all = app + '\n' + pages;

// Arabic spelling and register.
for (const [bad, preferred] of [
  ['السوع', 'الساعات'],
  ['وللسوع حكاية', 'وللساعات حكاية'],
  ['اقترب من المينا ', 'اقترب من الميناء'],
  ['شخصية المينا ', 'شخصية الميناء'],
  ['من القلائل', 'واحدةٌ من قِلّة'],
  ['سي آي سي', 'إنفيرتو'],
  ['آر إم', 'the reference code (RM 26-02) with an Arabic name'],
  ['توربيون سوفيرين', 'توربيون سوفران']
]) {
  if (all.includes(bad) || JSON.stringify(data).includes(bad)) fail(`language gate: found "${bad}", prefer "${preferred}"`);
}
if (!pages.includes('للوقت قدر.<em>وللساعات حكاية.</em>')) fail('language gate: the hero must read «للوقت قدر. وللساعات حكاية.»');

// English register.
for (const [bad, preferred] of [['Functions', 'Complications'], ['Dual Time / GMT', 'Dual Time & GMT'], ['Split-seconds / Rattrapante', 'Split-seconds Chronograph / Rattrapante'], ['watch collection', 'horological collection']])
  if (all.includes(bad)) fail(`language gate: found "${bad}", prefer "${preferred}"`);
for (const required of ['Haute Horlogerie', 'craftsmanship', 'horological heritage', 'Calibre / movement', 'Case material', 'Case dimensions', 'Complications', 'Three Timepieces. Three Expressions of Time.', 'When a Moment Deserves to Last.'])
  if (!all.includes(required)) fail(`language gate: missing "${required}"`);
for (const required of ['صناعة الساعات الراقية', 'المهارة الحرفية', 'إرث صناعة الساعات', 'التعقيدات', 'العيار / الحركة', 'مادة العلبة', 'أبعاد العلبة', 'الميناء', 'ثلاث قطع. ثلاث لغات للوقت.', 'حين تستحق اللحظة أن تطول.', 'السجل التقني'])
  if (!all.includes(required)) fail(`language gate: missing Arabic "${required}"`);

// The owner's phrase, exactly.
if (!watchmaking.includes('data-en="One of not many"')) fail('language gate: exact owner phrase must be One of not many');
if (/One of not many[ .]/.test(watchmaking) || /One of the few\.|One, not many/.test(watchmaking)) fail('language gate: owner phrase must not be altered');

// Arabic purity: what the Arabic visitor reads carries no English words.
// Reference codes (5270P, RM 26-02, CH 29-535) are codes, as a maison writes them.
const allowedLatin = new Set(['FFC', 'GMT', 'CIC', 'W1']);
for (const w of data.watches) {
  for (const field of ['nameAr', 'editorialAr', 'referenceAr']) {
    const words = String(w[field] || '').match(/[A-Za-z][A-Za-z]+/g) || [];
    const leak = words.filter(x => !allowedLatin.has(x) && !/^[A-Z]{1,3}$/.test(x) && !/^(BLRO|XT|HP|CS|CB|BC|CE|PS|QL|HU)$/.test(x));
    if (leak.length) fail(`language gate: ${w.slug}.${field} shows English in Arabic view: ${leak.join(', ')}`);
  }
  if (/[a-z]{3,}/.test(String(w.referenceNumber || '')) && !w.referenceAr) fail(`language gate: ${w.slug} reference "${w.referenceNumber}" needs an Arabic reading (referenceAr)`);
}
for (const m of pages.matchAll(/data-ar="([^"]*)"/g)) {
  const leak = (m[1].match(/[A-Za-z]{3,}/g) || []).filter(x => !['GMT'].includes(x));
  if (leak.length) fail(`language gate: Arabic page copy contains English: ${m[1].slice(0, 60)}`);
}

// Counts.
if (!Array.isArray(data.watches) || data.watches.length !== 45) fail('language gate: canonical collection count must be 45');
const maisons = new Set(data.watches.map(w => w.brand));
if (maisons.size !== 8) fail(`language gate: canonical Maison count must be 8, found ${maisons.size}`);
if (manifest && manifest.site.recordCount !== 45) fail('language gate: release manifest recordCount must be 45');
if (!app.includes("replace(/\\bCaliber\\b/g, 'Calibre')")) fail('language gate: Caliber source values need runtime normalisation');

const named = new Map(data.watches.map(w => [w.id, w]));
if (named.get(60028)?.nameEn !== 'Chronomètre à Résonance') fail('language gate: F.P. Journe Résonance spelling regressed');
if (named.get(90006)?.nameAr !== 'FFC — عيار 1300.3') fail('language gate: Arabic calibre terminology regressed');
if (data.watches.some(w => w.brand === 'Artisans de Geneve')) fail('language gate: Artisans de Genève accent regressed');
if (data.watches.some(w => /^\d{8}$/.test(String(w.yearReleased)))) fail('language gate: malformed year in ledger');
console.log('Language gate passed: Arabic-first purity, English register, 45 timepieces, 8 Maisons.');
