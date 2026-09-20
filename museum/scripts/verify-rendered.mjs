// Release gate, separate from Docker's source/runtime gate. Requires Chromium.
// MUSEUM_URL=https://... npm run test:rendered
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.MUSEUM_URL || 'http://127.0.0.1:3000';
const evidence = process.env.MUSEUM_QA_DIR || '/tmp/majlis-v1-qa';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch();
const results = [];
const routes = ['/', '/collection/', '/his-highness/', '/exhibition/', '/watchmaking/'];
const sizes = [[390,844],[412,915],[768,1024],[1024,768],[1440,900],[1920,1080]];
try {
 for (const motion of ['no-preference','reduce']) for (const [width,height] of sizes) for (const lang of ['ar','en']) {
  const context = await browser.newContext({ viewport:{width,height}, reducedMotion:motion });
  await context.addInitScript(lang => localStorage.setItem('museum-language',lang), lang);
  const page = await context.newPage();
  for (const route of routes) {
   const errors=[];
   const onError=e=>errors.push(e.message);
   const onResponse=r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(`${r.status()} ${r.url()}`)};
   page.on('pageerror',onError);page.on('response',onResponse);
   await page.goto(base+route,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   if(route!='/watchmaking/') await page.locator('#grid[aria-busy="false"]').waitFor({state:'attached'});
   assert.equal(await page.locator('html').getAttribute('lang'),lang);
   const findings=await page.evaluate(()=>{
    const visible=e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'};
    const bad=[];
    if(document.documentElement.scrollWidth>innerWidth+1)bad.push('horizontal overflow');
    if(![...document.querySelectorAll('h1')].some(visible))bad.push('no visible H1');
    for(const e of document.querySelectorAll('h1,h2,h3,.hero-description,.bio-timeline time')) {
     if(!visible(e))continue;
     if(e.scrollWidth>e.clientWidth+2)bad.push(`text overflow: ${e.textContent.slice(0,70)}`);
    }
    for(const e of document.querySelectorAll('button'))if(visible(e)){
     const r=e.getBoundingClientRect();if(r.width<43.5||r.height<43.5)bad.push(`small control: ${e.getAttribute('aria-label')||e.textContent}`);
    }
    for(const img of document.images)if(visible(img)&&img.complete&&!img.naturalWidth)bad.push(`missing image: ${img.getAttribute('src')}`);
    const nav=[...document.querySelectorAll('.nav .identity,.nav nav,.nav-actions')].filter(visible).map(e=>e.getBoundingClientRect());
    for(let i=0;i<nav.length;i++)for(let j=i+1;j<nav.length;j++){
     const a=nav[i],b=nav[j];if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)bad.push('header collision');
    }
    return bad;
   });
   assert.deepEqual([...errors,...findings],[],`${route} ${lang} ${width} ${motion}`);
   if(route==='/his-highness/'){
    const years=await page.locator('.bio-timeline time').allTextContents();
    assert.equal(years[0],lang==='ar'?'١٩٦٩':'1969');
    for(const year of await page.locator('.bio-timeline time').all())assert.ok(await year.isVisible());
   }
   if(motion==='reduce'&&(width===390||width===1440))await page.screenshot({path:`${evidence}/${route.replaceAll('/','_')}-${lang}-${width}.png`,fullPage:true});
   if(route==='/collection/'&&(width===390||width===1440)){
    const cards=page.locator('#grid [data-watch]');const count=await cards.count();
    for(let i=0;i<count;i++){
     await cards.nth(i).click();
     await page.locator('#detail[open]').waitFor();
     const order=await page.locator('.detail-copy').evaluate(e=>Boolean(e.querySelector('.description').compareDocumentPosition(e.querySelector('.detail-tech-title'))&Node.DOCUMENT_POSITION_FOLLOWING));
     assert.ok(order,'story must precede technical record');
     if(lang==='en'){
      const specText=await page.locator('.specs').innerText();
      assert.ok(!/\bCaliber\b|\bAutomatic\b/.test(specText),'English technical record must use Calibre / Self-winding terminology');
      assert.ok(!/\bFunctions\b/.test(specText),'English technical record must use Complications');
     }
     assert.ok(await page.locator('#detailClose').isVisible());
     if(width===390)assert.ok(await page.locator('#detail').evaluate(e=>Math.abs(e.getBoundingClientRect().width-innerWidth)<2));
     await page.keyboard.press('Escape');
    }
    await page.locator('#search').fill('no-matching-timepiece-qa');
    assert.equal(await page.locator('#grid .card').count(),0);
    await page.locator('#search').fill('');
    assert.equal(await page.locator('#grid .card').count(),count);
   }
   if(route==='/watchmaking/'&&lang==='en'){
    assert.equal((await page.locator('.craft-hero h1').innerText()).trim(),'Timeless timepieces.');
    assert.equal((await page.locator('.craft-manifesto').innerText()).trim(),'One of not many');
    assert.ok((await page.locator('#complications').innerText()).toLowerCase().includes('complications & mechanisms'));
   }
   if(route==='/exhibition/'){
    assert.equal((await page.locator('.museum-ledger .ledger-item').nth(1).locator('b').innerText()).trim(),'8');
   }
   results.push({route,lang,width,height,motion,status:'passed'});
   page.off('pageerror',onError);page.off('response',onResponse);
  }
  await context.close();
 }
 await writeFile(`${evidence}/results.json`,JSON.stringify({base,results},null,2));
 console.log(`${results.length} rendered route/language/viewport/motion checks passed.`);
} finally { await browser.close(); }
