import { execFileSync } from 'node:child_process';
import { existsSync, unlinkSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const dataPath = path.join(root, 'dist/watches.json');
const payload = JSON.parse(await import('node:fs/promises').then(fs => fs.readFile(dataPath, 'utf8')));
const ids = new Set([90001, 90002, 90003, 90004, 90005, 90006, 90007, 90008, 90009, 90010, 150001]);
let converted = 0;
for (const watch of payload.watches) {
  if (!ids.has(watch.id) || !watch.displayImage) continue;
  const oldRelative = watch.displayImage.replace(/^\//, '');
  const oldPath = path.join(root, 'dist', oldRelative);
  const targetRelative = oldRelative.replace(/\.(png|jpe?g)$/i, '.webp');
  const targetPath = path.join(root, 'dist', targetRelative);
  if (!existsSync(oldPath) && !existsSync(targetPath)) throw new Error(`Missing source media: ${oldPath}`);
  if (existsSync(oldPath)) {
    execFileSync('convert', [oldPath, '-resize', '1800x1800>', '-define', 'webp:method=6', '-quality', '88', targetPath]);
    unlinkSync(oldPath);
    converted++;
  }
  watch.displayImage = `/${targetRelative}`;
}
await import('node:fs/promises').then(fs => fs.writeFile(dataPath, `${JSON.stringify(payload, null, 2)}\n`));
console.log(`Optimized ${converted} museum media assets to WebP.`);
