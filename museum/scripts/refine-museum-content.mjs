import { readFile, writeFile } from 'node:fs/promises';
const path = 'dist/watches.json';
const data = JSON.parse(await readFile(path, 'utf8'));
const byId = id => data.watches.find(w => w.id === id);
// Corrections grounded in manufacturer documentation; preserve stable IDs/slugs.
Object.assign(byId(90005), { movement: 'Self-winding calibre RMAL2', caseSize: null,
  editorialAr: 'حركة مكشوفة وشخصية رياضية. في آر إم 35-03 رافائيل نادال، يتيح الدوّار الفراشي التحكم في تعبئة الساعة، وتكشف الجسور عن طبقات الصنعة.',
  editorialEn: 'An open movement with a sporting character. In the RM 35-03 Rafael Nadal, the butterfly rotor gives the wearer control over winding, while the bridges reveal the craft in layers.' });
Object.assign(byId(90007), { movement: 'Manual-winding calibre 1518' });
Object.assign(byId(90008), { movement: 'Self-winding calibre R 27',
  editorialAr: 'حصان مشغول على الميناء يلتقي بفن مكرّر الدقائق. في المرجع 5278/500G-001، تصبح الحرفة صورةً تتأملها ونغمةً تسمعها.' });
Object.assign(byId(90001), { editorialAr: 'ميناء من المينا الزرقاء يلتقي بفن مكرّر الدقائق. في المرجع 5178G-012، تمتدّ تجربة الوقت من النظر إلى السمع.' });
// The supplied salmon-dial picture conflicts with the ceramic reference 26522CE.
// Do not substitute a guessed steel reference or retain a flying-tourbillon claim.
Object.assign(byId(60005), { nameEn: 'Royal Oak Tourbillon', nameAr: 'رويال أوك توربيون', referenceNumber: null, material: null, movement: null,
  descriptionEn: 'A source-reviewed Royal Oak study: a salmon-toned dial, Eastern Arabic numerals and a tourbillon at six. The exact reference is intentionally left open where the available image does not establish it.',
  descriptionAr: 'دراسة موثقة المصدر من رويال أوك: ميناء بلون السلمون، وأرقام عربية شرقية، وتوربيون عند السادسة. تُترك هوية المرجع مفتوحة عمداً لأن الصورة المتاحة لا تثبتها.',
  editorialAr: 'ميناء بلون السلمون، وأرقام عربية شرقية، وتوربيون عند السادسة. داخل الإطار الثماني لرويال أوك، تمنح هذه التفاصيل القطعة حضوراً خاصاً.',
  editorialEn: 'A salmon-toned dial, Eastern Arabic numerals and a tourbillon at six. Within the Royal Oak’s octagonal frame, these details give the timepiece its distinctive presence.' });
Object.assign(byId(60008), { nameEn: 'Daytona “Quraysh Hawk Dial”', nameAr: 'دايتونا «صقر قريش»' });
const terms = {
  'Self-winding':'ذاتية التعبئة','Manual-winding':'يدوية التعبئة','Manual-wind':'يدوية التعبئة','Manual Chronograph':'كرونوغراف يدوي التعبئة','Manual Tourbillon with Remontoire':'توربيون يدوي التعبئة مع آلية قوة ثابتة',
  'Manual with Resonance':'يدوية التعبئة بتقنية الرنين','Manual tourbillon with power-reserve display':'توربيون يدوي التعبئة مع مؤشر احتياطي الطاقة','manual chronograph':'كرونوغراف يدوي التعبئة','Manual':'يدوية التعبئة','Automatic':'ذاتية التعبئة','automatic':'ذاتية التعبئة',
  'Caliber':'عيار','Calibre':'عيار','calibre':'عيار','Modified Rolex':'رولكس معدّلة','Rolex':'رولكس','Chronograph':'كرونوغراف','chronograph':'كرونوغراف','Perpetual Calendar':'تقويم دائم','perpetual calendar':'تقويم دائم','Ultra-Thin':'فائقة النحافة','Flying Tourbillon':'توربيون طائر','Tourbillon':'توربيون','World Time':'توقيت عالمي','GMT':'توقيت ثانٍ',
  '18k White Gold':'ذهب أبيض عيار 18','White Gold with Gemstones':'ذهب أبيض وأحجار كريمة','White Gold':'ذهب أبيض','Stainless Steel':'فولاذ مقاوم للصدأ','Oystersteel':'أويستر ستيل','Platinum with Baguette Sapphires':'بلاتين وياقوت أزرق بقطع باغيت','Platinum':'بلاتين','Titanium & Bulk Metallic Glass (BMG)':'تيتانيوم وزجاج معدني سائب (BMG)','Titanium/Red Gold/Platinum':'الطراز متاح بالتيتانيوم أو الذهب الأحمر أو البلاتين','Titanium':'تيتانيوم','White Ceramic':'سيراميك أبيض','Blue Ceramic':'سيراميك أزرق','Sapphire Crystal':'كريستال الياقوت','Carbon TPT and Grade 5 Titanium':'كربون TPT وتيتانيوم من الدرجة الخامسة','Carbon TPT and Quartz TPT':'كربون TPT وكوارتز TPT','Carbon/Quartz TPT':'كربون وكوارتز TPT','Carbon fibre — DIW custom case':'ألياف الكربون — علبة مخصصة من DIW',
  'Approximately':'نحو','Around':'نحو','Circa':'نحو','At least':'على الأقل','hours':'ساعة','mm':'مم',
  'Split-seconds chronograph':'كرونوغراف بأجزاء الثانية المنقسمة','split-seconds chronograph':'كرونوغراف بأجزاء الثانية المنقسمة','Minute repeater with cathedral gongs':'مكرّر دقائق بأجراس كاتدرائية','Minute repeater':'مكرّر دقائق','minute repeater calibre':'عيار مكرّر دقائق','minute repeater':'مكرّر دقائق','cathedral gongs':'أجراس كاتدرائية','small seconds':'ثوانٍ صغيرة','central seconds':'ثوانٍ مركزية','30-minute and 12-hour counters':'عدادا 30 دقيقة و12 ساعة','constant-force remontoire':'آلية قوة ثابتة','power reserve':'احتياطي الطاقة','power-reserve display':'مؤشر احتياطي الطاقة','dead-beat seconds':'ثوانٍ قافزة','1/10th-of-a-second monopusher chronograph':'كرونوغراف أحادي الضاغط لقياس عُشر الثانية','date':'التاريخ','rapid winding':'تعبئة سريعة','function selector':'محدّد الوظائف','tourbillon':'توربيون','fully skeletonized and finished in dark ruthenium':'مفرّغة بالكامل ومشطّبة بالروثينيوم الداكن','Fully openworked movement':'حركة مفرّغة بالكامل','hand-bevelled and polished components':'مكوّنات مشطوفة ومصقولة يدوياً','ultra-light balance bridge':'جسر ميزان فائق الخفة'
};
function arabic(value) {
  if (!value) return value;
  let result = String(value);
  const keys = Object.keys(terms).sort((a,b) => b.length-a.length);
  const pattern = new RegExp(keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'), 'g');
  return result.replace(pattern, key => terms[key]);
}
for (const w of data.watches) {
  for (const key of ['material','movement','caseSize','powerReserve','complications']) {
    w[key+'En'] = w[key] ?? null;
    w[key+'Ar'] = arabic(w[key]) ?? null;
  }
}
await writeFile(path, JSON.stringify(data, null, 2)+'\n');
console.log('Preserved',data.watches.length,'records; corrected bounded facts and added bilingual specification fields.');
