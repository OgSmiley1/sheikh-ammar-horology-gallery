import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>readFileSync(path.join(root,file),'utf8');
const fail=message=>{throw new Error(message)};

const app=read('dist/app.js');
const watchmaking=read('dist/watchmaking/index.html');
const exhibition=read('dist/exhibition/index.html');
const manifest=JSON.parse(read('../release/v1-manifest.json'));
const data=JSON.parse(read('dist/watches.json'));

for(const [bad,preferred] of [
  ['Functions','Complications'],
  ['One of the few. Never one of many.','One of the few. Never one of the many.'],
  ['Dual Time / GMT','Dual Time & GMT'],
  ['Split-seconds / Rattrapante','Split-seconds Chronograph / Rattrapante']
]){
  if(app.includes(bad)||watchmaking.includes(bad))fail(`language gate: found "${bad}", prefer "${preferred}"`);
}

for(const required of [
  'Haute Horlogerie','craftsmanship','horological heritage',
  'Calibre / movement','Case material','Case dimensions','Complications',
  'Three Timepieces. Three Expressions of Time.','When a Moment Deserves to Last.'
]) if(!app.includes(required))fail(`language gate: app missing "${required}"`);

for(const required of [
  'Timeless timepieces.','One of the few. Never one of the many.',
  'Complications & mechanisms','Chronograph','Tourbillon','Dual Time & GMT',
  'Perpetual Calendar','Minute Repeater','Split-seconds Chronograph / Rattrapante',
  'World Time','Flyback Chronograph','Moon-phase Indication',
  'A turbine is not a tourbillon.'
]) if(!watchmaking.includes(required))fail(`language gate: watchmaking missing "${required}"`);

for(const required of [
  'صناعة الساعات الراقية','المهارة الحرفية','إرث صناعة الساعات','التعقيدات',
  'العيار / الحركة','مادة العلبة','أبعاد العلبة'
]) if(!app.includes(required))fail(`language gate: Arabic app missing "${required}"`);

if(!Array.isArray(data.watches)||data.watches.length!==43)fail('language gate: canonical collection count must be 43');
const maisons=new Set(data.watches.map(w=>w.brand));
if(maisons.size!==8)fail(`language gate: canonical Maison count must be 8, found ${maisons.size}`);
if(manifest.site.recordCount!==43)fail('language gate: release manifest recordCount must be 43');
if(exhibition.includes('<b>7</b><span data-i18n="maisons"'))fail('language gate: exhibition still shows 7 Maisons');

for(const watch of data.watches){
  const en=String(watch.movementEn||watch.movement||'');
  if(/\bCaliber\b/.test(en)){
    // Source data is preserved; runtime must normalize display to British horological spelling.
    if(!app.includes("replace(/\\bCaliber\\b/g,'Calibre')"))fail('language gate: Caliber source values exist without runtime normalization');
    break;
  }
}

console.log('Language gate passed: English/Arabic terminology, 43 timepieces, 8 Maisons.');
