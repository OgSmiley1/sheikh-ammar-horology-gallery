// Release gate, separate from Docker's source/runtime gate. Requires Chromium.
// MUSEUM_URL=https://... npm run test:rendered
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.MUSEUM_URL || 'http://127.0.0.1:3000';
const evidence = process.env.MUSEUM_QA_DIR || '/tmp/majlis-v1-qa';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const contextOptions = { ignoreHTTPSErrors: process.env.QA_IGNORE_TLS === '1' };
const results = [];
const routes = ['/', '/collection/', '/his-highness/', '/exhibition/', '/watchmaking/'];
const sizes = [[390,844],[412,915],[768,1024],[1024,768],[1440,900],[1920,1080]];
try {
 for (const motion of ['no-preference','reduce']) for (const [width,height] of sizes) for (const lang of ['ar','en']) {
  const context = await browser.newContext({ ...contextOptions, viewport:{width,height}, reducedMotion:motion });
  await context.addInitScript(lang => localStorage.setItem('museum-language',lang), lang);
  const page = await context.newPage();
  for (const route of routes) {
   const errors=[];
   const onError=e=>errors.push(e.message);
   const onResponse=r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(`${r.status()} ${r.url()}`)};
   page.on('pageerror',onError);page.on('response',onResponse);
   await page.goto(base+route,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   if(['/','/collection/'].includes(route)) await page.locator('#grid[aria-busy="false"]').waitFor({state:'attached'});
   if(route==='/exhibition/') await page.locator('#tourName:not(:empty)').waitFor();
   assert.equal(await page.locator('html').getAttribute('lang'),lang);
   const findings=await page.evaluate(()=>{
    const visible=e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'};
    const bad=[];
    if(document.documentElement.scrollWidth>innerWidth+1)bad.push('horizontal overflow');
    if(![...document.querySelectorAll('h1')].some(visible))bad.push('no visible H1');
    for(const e of document.querySelectorAll('h1,h2,h3,.standfirst,.bio-timeline time,.piece h3,.specs dd')) {
     if(!visible(e)||e.closest('.sr-only'))continue;
     if(e.scrollWidth>e.clientWidth+2)bad.push(`text overflow: ${e.textContent.slice(0,70)}`);
     const s=getComputedStyle(e);
     if(s.overflowY!=='visible'&&e.scrollHeight>e.clientHeight+2)bad.push(`vertical text clipping: ${e.textContent.slice(0,70)}`);
    }
    for(const e of document.querySelectorAll('button'))if(visible(e)){
     const r=e.getBoundingClientRect();if(r.width<43.5||r.height<43.5)bad.push(`small control: ${e.getAttribute('aria-label')||e.textContent}`);
    }
    for(const img of document.images)if(visible(img)&&img.complete&&!img.naturalWidth)bad.push(`missing image: ${img.getAttribute('src')}`);
    // Royal rule: a timepiece is only ever shown with His Highness.
    for(const img of document.images){const src=img.getAttribute('src')||'';if(/\/assets\/(watches|plates|watches-verified)\//.test(src))bad.push(`watch-only image rendered: ${src}`)}
    // Nothing may be laid over His Highness's hero portrait.
    const portrait=document.querySelector('.hero-media img,.portrait-hero figure img');
    if(portrait&&visible(portrait)){const p=portrait.getBoundingClientRect();for(const e of document.querySelectorAll('.hero-copy h1,.hero-copy p,.portrait-hero .words h1')){if(!visible(e))continue;const r=e.getBoundingClientRect();if(Math.min(r.right,p.right)-Math.max(r.left,p.left)>2&&Math.min(r.bottom,p.bottom)-Math.max(r.top,p.top)>2)bad.push(`text over His Highness: ${e.textContent.slice(0,40)}`)}}
    // Contrast: every visible run of text on a solid ground must reach WCAG AAA (7:1).
    const rgb=c=>(c.match(/[\d.]+/g)||[]).map(Number);
    const lum=([r,g,b])=>[r,g,b].map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
    const ground=e=>{for(let n=e;n;n=n.parentElement){const s=getComputedStyle(n);if(s.backgroundImage!=='none'&&!n.matches('body'))return null;const c=rgb(s.backgroundColor);if(c.length>=3&&(c[3]===undefined||c[3]>.9))return c;if(n.matches('.hero-media,.royal,.screen,.zoom,figure,.masthead.over'))return null}return rgb('rgb(246,243,238)')};
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const checked=new Set();
    for(let t;t=walker.nextNode();){const e=t.parentElement;if(!t.textContent.trim()||checked.has(e)||!visible(e)||e.closest('.sr-only,[hidden],button:disabled,.menu:not(.open),dialog:not([open]),noscript'))continue;checked.add(e);
     const s=getComputedStyle(e);if(+s.opacity<1)continue;const bg=ground(e);if(!bg)continue;const fg=rgb(s.color);
     const [a,b]=[lum(fg),lum(bg)].sort((x,y)=>y-x);const ratio=(a+.05)/(b+.05);
     if(ratio<7)bad.push(`contrast ${ratio.toFixed(2)}:1 — ${t.textContent.trim().slice(0,40)}`)}
    if(document.querySelector('iframe[src*="youtube"],video[controls]'))bad.push('player chrome on page');
    if(/[▶►]/.test(document.querySelector('.masthead')?.textContent||''))bad.push('play icon in header');
    const nav=[...document.querySelectorAll('.masthead .menu-toggle,.masthead .wordmark,.masthead .lang-toggle')].filter(visible).map(e=>e.getBoundingClientRect());
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
     const order=await page.locator('.sheet-copy').evaluate(e=>Boolean(e.querySelector('.description').compareDocumentPosition(e.querySelector('.detail-tech-title'))&Node.DOCUMENT_POSITION_FOLLOWING));
     assert.ok(order,'story must precede technical record');
     if(lang==='en'){
      const specText=await page.locator('.specs').innerText();
      assert.ok(!/\bCaliber\b|\bAutomatic\b/.test(specText),'English technical record must use Calibre / Self-winding terminology');
      assert.ok(!/\bFunctions\b/.test(specText),'English technical record must use Complications');
     }
     assert.ok(await page.locator('#detailClose').isVisible());
     if(width===390)assert.ok(await page.locator('#detail').evaluate(e=>Math.abs(e.getBoundingClientRect().width-innerWidth)<2));
     const detailFindings=await page.locator('#detail').evaluate(dialog=>{
      const visible=e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'};
      const bad=[];
      if(dialog.scrollWidth>dialog.clientWidth+2)bad.push('detail horizontal overflow');
      const text=[...dialog.querySelectorAll('.sheet-copy h2,.sheet-copy .description,.detail-tech-title,.specs dt,.specs dd')].filter(visible);
      for(const e of text)if(e.scrollWidth>e.clientWidth+2)bad.push(`detail text overflow: ${e.textContent.slice(0,70)}`);
      const blocks=[...dialog.querySelectorAll('.sheet-copy > .maison,.sheet-copy > h2,.sheet-copy > .ref,.sheet-copy > .pairing,.sheet-copy > .detail-kicker,.sheet-copy > .description,.sheet-copy > .detail-tech-title,.sheet-copy > .specs,.sheet-copy > .complication-guide-tags')].filter(visible);
      for(let j=1;j<blocks.length;j++){
       const prev=blocks[j-1].getBoundingClientRect(),next=blocks[j].getBoundingClientRect();
       if(next.top<prev.bottom-1)bad.push(`detail text collision: ${blocks[j-1].textContent.slice(0,35)} / ${blocks[j].textContent.slice(0,35)}`);
      }
      return bad;
     });
     assert.deepEqual(detailFindings,[],`detail layout ${lang} ${width} ${cards.nth(i)}`);
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
    assert.match(await page.locator('#tourRef').innerText(),/6263/);
   }
   results.push({route,lang,width,height,motion,status:'passed'});
   page.off('pageerror',onError);page.off('response',onResponse);
  }
  await context.close();
 }
 await writeFile(`${evidence}/results.json`,JSON.stringify({base,results},null,2));
 console.log(`${results.length} rendered route/language/viewport/motion checks passed.`);
} finally { await browser.close(); }
