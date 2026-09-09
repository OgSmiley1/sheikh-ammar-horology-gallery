import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const source = '/workspace/scratch/54cc65725608/research-assets';
const assetDir = path.join(root, 'dist/assets/watches');
const dataPath = path.join(root, 'dist/watches.json');

const media = {
  90001: ['90001-5178G-official.png', 'Patek Philippe official model image'],
  90002: ['90002-journe-jade-crop.jpg', 'Public appearance crop; product details remain source-reviewed'],
  90003: ['90003-rm65-mclaren-official.png', 'Richard Mille official model image'],
  90004: ['90004-5470P-official.png', 'Patek Philippe official model image'],
  90005: ['90005-rm35-nadal-official.png', 'Richard Mille official model image'],
  90006: ['90006-ffc-waqt-hero.jpg', 'Waqt editorial product image'],
  90007: ['90007-linesport-official.png', 'F.P. Journe official model image'],
  90008: ['90008-instagram-appearance.jpg', 'Public appearance image; model association kept editorially bounded'],
  90009: ['90009-rd2-official.png', 'Audemars Piguet official model image'],
  90010: ['90010-aquanaut-official.png', 'Patek Philippe official model image'],
  150001: ['150001-3939HP-white-product.jpg', 'Patek Philippe model image'],
};

fs.mkdirSync(assetDir, { recursive: true });
const payload = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
for (const watch of payload.watches) {
  const entry = media[watch.id];
  if (!entry) continue;
  const [filename, note] = entry;
  const from = path.join(source, filename);
  if (!fs.existsSync(from)) throw new Error(`Missing researched asset: ${from}`);
  const ext = path.extname(filename).toLowerCase();
  const safeExt = ext === '.png' ? '.png' : '.jpg';
  const out = `${watch.slug}${safeExt}`;
  fs.copyFileSync(from, path.join(assetDir, out));
  watch.displayImage = `/assets/watches/${out}`;
  watch.mediaNoteEn = note;
  watch.mediaNoteAr = note === 'Public appearance crop; product details remain source-reviewed'
    ? 'قصاصة من ظهور علني؛ تبقى تفاصيل الطراز موثقة بمصادرها المستقلة.'
    : note === 'Public appearance image; model association kept editorially bounded'
      ? 'صورة من ظهور علني؛ حُفظ الربط بالطراز ضمن حدود التحرير والمصدر.'
      : 'صورة مرجعية للطراز من مصدر مراجَع.';
}
fs.writeFileSync(dataPath, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Integrated ${Object.keys(media).length} researched media assets.`);
