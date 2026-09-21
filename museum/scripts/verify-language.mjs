import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>readFileSync(path.join(root,file),'utf8');
const fail=message=>{throw new Error(message)};

const app=read('dist/app.js');
const watchmaking=read('dist/watchmaking/index.html');
const exhibition=read('dist/exhibition/index.html');
const primaryHtml=['dist/index.html','dist/collection/index.html','dist/his-highness/index.html','dist/exhibition/index.html'].map(read).join('\n');
const manifest=JSON.parse(read('../release/v1-manifest.json'));
const data=JSON.parse(read('dist/watches.json'));
const exactOwnerPhrase='One of not many';
for(const forbiddenPhrasePattern of [/One of the few\./,/One, not many/]){
  if(forbiddenPhrasePattern.test(watchmaking))fail('language gate: deprecated owner phrase variant found');
}


for(const [bad,preferred] of [
  ['السوع','الساعات / الساعة'],
  ['اقترب من المينا','اقترب من الميناء'],
  ['شخصية المينا','شخصية الميناء'],
  ['حكاية السوع','مجلس الوقت / حكاية الساعات']
]){
  if(new RegExp(bad+'(?![ء-ي])','u').test(app)||new RegExp(bad+'(?![ء-ي])','u').test(primaryHtml))fail(`language gate: found Arabic museum copy "${bad}", prefer "${preferred}"`);
}

for(const [bad,preferred] of [
  ['Functions','Complications'],
  ['Dual Time / GMT','Dual Time & GMT'],
  ['Split-seconds / Rattrapante','Split-seconds Chronograph / Rattrapante'],
  ["collection:'The Timepieces'","collection:'The Collection'"],
  ['watch collection','horological collection'],
  ['The art in motion · Watch','Watchmaking in Motion']
]){
  if(app.includes(bad)||watchmaking.includes(bad))fail(`language gate: found "${bad}", prefer "${preferred}"`);
}

for(const required of [
  'Haute Horlogerie','craftsmanship','horological heritage',
  'Calibre / movement','Case material','Case dimensions','Complications',
  'Three Timepieces. Three Expressions of Time.','When a Moment Deserves to Last.'
]) if(!app.includes(required))fail(`language gate: app missing "${required}"`);

if(!watchmaking.includes(`data-en="${exactOwnerPhrase}"`))fail('language gate: exact owner phrase must be One of not many');
if(watchmaking.includes('One of not many.')||watchmaking.includes('One of not many '))fail('language gate: owner phrase must not be extended or punctuated');

for(const required of [
  'Timeless timepieces.','One of not many',
  'Complications & mechanisms','Chronograph','Tourbillon','Dual Time & GMT',
  'Perpetual Calendar','Minute Repeater','Split-seconds Chronograph / Rattrapante',
  'World Time','Flyback Chronograph','Moon-phase Indication',
  'A turbine is not a tourbillon.'
]) if(!watchmaking.includes(required))fail(`language gate: watchmaking missing "${required}"`);

for(const required of [
  'صناعة الساعات الراقية','المهارة الحرفية','إرث صناعة الساعات','التعقيدات',
  'العيار / الحركة','مادة العلبة','أبعاد العلبة','الميناء'
]) if(!app.includes(required))fail(`language gate: Arabic app missing "${required}"`);

if(!Array.isArray(data.watches)||data.watches.length!==44)fail('language gate: canonical collection count must be 44');
const maisons=new Set(data.watches.map(w=>w.brand));
if(maisons.size!==8)fail(`language gate: canonical Maison count must be 8, found ${maisons.size}`);
if(manifest.site.recordCount!==44)fail('language gate: release manifest recordCount must be 44');
if(exhibition.includes('<b>7</b><span data-i18n="maisons"'))fail('language gate: exhibition still shows 7 Maisons');

for(const watch of data.watches){
  const en=String(watch.movementEn||watch.movement||'');
  if(/\bCaliber\b/.test(en)){
    // Source data is preserved; runtime must normalize display to British horological spelling.
    if(!app.includes("replace(/\\bCaliber\\b/g,'Calibre')"))fail('language gate: Caliber source values exist without runtime normalization');
    break;
  }
}

const namedChecks=new Map(data.watches.map(w=>[w.id,w]));
if(namedChecks.get(60028)?.nameEn!=='Chronomètre à Résonance')fail('language gate: F.P. Journe Résonance spelling regressed');
if(namedChecks.get(90006)?.nameAr!=='FFC — عيار 1300.3')fail('language gate: Arabic calibre terminology regressed');
if([...data.watches].some(w=>w.brand==='Artisans de Geneve'))fail('language gate: Artisans de Genève accent regressed');
console.log('Language gate passed: English/Arabic terminology, 44 timepieces, 8 Maisons.');

