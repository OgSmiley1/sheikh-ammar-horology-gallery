// Arabic-first ledger refinement (24 Sept 2026).
// Replaces weak transliterations with museum-register Arabic names, gives word-based
// references an Arabic reading so no English leaks into the Arabic view, and repairs
// data errors. Codes (5270P, RM 26-02, calibre numbers) stay as codes, as a maison writes them.
// Idempotent: node scripts/refine-arabic-ledger.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../dist/watches.json', import.meta.url);
const data = JSON.parse(readFileSync(file, 'utf8'));
const edits = {
  'artisans-de-geneve-la-montoya-platinum-challenge': { nameAr: 'لا مونتويا — تحدّي البلاتين', referenceEn: 'Bespoke', referenceAr: 'قطعة مخصّصة' },
  'fp-journe-tourbillon-souverain-red-dial': { nameAr: 'توربيون سوفران', referenceEn: 'Red dial', referenceAr: 'الميناء الأحمر' },
  'fp-journe-tourbillon-souverain': { nameAr: 'توربيون سوفران', referenceEn: 'Jade dial', referenceAr: 'ميناء اليشم' },
  'richard-mille-rm-68-01-tourbillon-cyril-kongo': { nameAr: 'توربيون سيريل كونغو' },
  'richard-mille-rm-26-02-tourbillon-evil-eye': { nameAr: 'توربيون «عين الشرّ»', editorialAr: 'عينٌ تتوسّط المشهد ولهبٌ يحيط بها. يلتقي النحت والمينا الفنية بميكانيكا التوربيون في المرجع RM 26-02.' },
  'richard-mille-rm-67-02-alexis-pinturault': { nameAr: 'إصدار ألكسيس بانتورو' },
  'rolex-cosmograph-daytona-abu-dhabi-aet-remould': { nameAr: 'كوزموغراف دايتونا «أبوظبي»', referenceEn: 'Bespoke · AET Remould', referenceAr: 'قطعة مخصّصة' },
  'rolex-daytona-diw-motley-carbon': { nameAr: 'دايتونا «موتلي» من الكربون', referenceEn: 'DiW Motley 3S · bespoke', referenceAr: 'قطعة مخصّصة' },
  'rolex-daytona-6265-black-dial': { yearReleased: null, yearLabelEn: '1970s', yearLabelAr: 'سبعينيات القرن العشرين' },
  'h-moser-endeavour-tourbillon-vantablack-1804-0212': { nameAr: 'إنديفر توربيون كونسبت · فانتابلاك' },
  'rolex-gmt-master-ii-pepsi-meteorite-126719': { nameAr: 'جي إم تي-ماستر ٢ «بيبسي» بميناء نيزكي' },
  'rolex-gmt-master-ii-pepsi-126710blro': { nameAr: 'جي إم تي-ماستر ٢ «بيبسي»', editorialAr: 'لونان على الإطار وقراءة واضحة للتوقيت. يحتفظ المرجع 126710BLRO بحضور جي إم تي-ماستر ٢ المألوف.' },
  'audemars-piguet-royal-oak-extra-thin-jumbo-15202': { nameAr: 'رويال أوك «جامبو» فائقة النحافة' },
  'fp-journe-chronometre-a-resonance-platinum-grey': { nameAr: 'كرونومتر الرنين', referenceEn: 'Platinum · grey dial', referenceAr: 'بلاتين · ميناء رمادي' },
  'richard-mille-rm-65-01-automatic-split-seconds-chronograph-mclaren-w1': { nameAr: 'كرونوغراف الثواني المنقسمة — ماكلارين W1' },
  'patek-philippe-grand-complications-110th-second-monopusher-chronograph': { nameAr: 'كرونوغراف أحادي الزر بدقة عُشر الثانية' },
  'richard-mille-rm-35-03-automatic-rafael-nadal': { nameAr: 'إصدار رافائيل نادال', editorialAr: 'حركةٌ مكشوفة وشخصيةٌ رياضية. في إصدار رافائيل نادال، يتيح الدوّار الفراشي التحكم في تعبئة الساعة، وتكشف الجسور طبقات الصنعة.' },
  'fp-journe-linesport-chronographe-rattrapante': { nameAr: 'لاينسبورت — كرونوغراف راترابانت', referenceEn: 'Calibre 1518', referenceAr: 'العيار 1518' },
  'audemars-piguet-royal-oak-perpetual-calendar-rd2-ultra-thin': { nameAr: 'رويال أوك بالتقويم الدائم فائقة النحافة' },
  'patek-philippe-minute-repeater-tourbillon-3939hp': { nameAr: 'مُكرِّر الدقائق مع التوربيون' },
  'artisans-de-geneve-andrea-pirlo-rolex-submariner': { referenceEn: 'Andrea Pirlo project · Calibre 3130', referenceAr: 'مشروع أندريا بيرلو · العيار 3130' },
  'lederer-cic-39-inverto-titanium': { nameAr: 'إنفيرتو ٣٩ — علبة من التيتانيوم', referenceAr: 'CIC 39' },
  'rolex-6100-chinese-dragon-cloisonne': { nameAr: 'رولكس 6100 «التنين الصيني» بميناء من المينا الزجاجية' },
  'patek-philippe-perpetual-calendar-5270p-green': { movementAr: 'عيار CH 29-535 PS Q، كرونوغراف بحركة يدوية التعبئة وتقويم دائم' },
  'patek-philippe-nautilus-perpetual-calendar-5740': { movementAr: 'عيار 240 Q، حركة فائقة النحافة بتقويم دائم' },
  'rolex-daytona-6241-john-player-special': { movementAr: 'كرونوغراف بحركة يدوية التعبئة، من عائلة العيار 722' }
};
let changed = 0;
for (const w of data.watches) {
  const e = edits[w.slug];
  if (!e) continue;
  for (const [k, v] of Object.entries(e)) if (w[k] !== v) { w[k] = v; changed++; }
}
const missing = Object.keys(edits).filter(slug => !data.watches.some(w => w.slug === slug));
if (missing.length) throw new Error('unknown slugs: ' + missing.join(', '));
writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(`Arabic ledger refined: ${changed} field changes.`);
