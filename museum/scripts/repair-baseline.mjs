import { readFileSync, writeFileSync } from 'node:fs';

// Mechanical repair of the three static route copies; original assets remain intact.
for (const path of ['dist/index.html', 'dist/collection/index.html', 'dist/his-highness/index.html']) {
  let html = readFileSync(path, 'utf8');
  html = html.replace(/<section id="archive"[\s\S]*?<\/section>/, '');
  writeFileSync(path, html);
}
const path = 'dist/app.js';
let js = readFileSync(path, 'utf8');
js = js.replace(/const ambientSets=.+;\n/, `const ambientSets={home:['/images/sheikh/sheikh-portrait-1.webp','/images/sheikh/sheikh-portrait-2.jpg','/images/sheikh-examining-watches.webp'],collection:['/images/sheikh-examining-watches.webp','/images/sheikh/sheikh-portrait-1.webp'],biography:['/images/sheikh/sheikh-portrait-2.jpg','/images/sheikh/sheikh-portrait-1.webp']};\n`);
// Until a fully audited shared pause control is added, stop timed background motion.
js = js.replace("if(!matchMedia('(prefers-reduced-motion: reduce)').matches){setInterval(()=>{if(!document.hidden&&!$('#detail').open)show(current+1)},8200)}", '');
writeFileSync(path, js);
