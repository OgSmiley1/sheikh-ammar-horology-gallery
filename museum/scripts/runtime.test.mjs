import { test } from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const data=JSON.parse(readFileSync(new URL('../dist/watches.json',import.meta.url)));
const code=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
test('Emirati navigation stays bilingual and ambient control stays in header',async()=>{
 const {dom,doc}=await mount('collection','ar');
 assert.equal(doc.querySelector('#navigation [data-i18n=collection]').textContent,'نفائس السوع');
 assert.equal(doc.querySelector('#navigation [data-i18n=home]').textContent,'المجلس');
 assert.ok(doc.querySelector('.nav-actions #ambientPause'));
 doc.querySelector('#lang').click();
 assert.equal(doc.querySelector('#navigation [data-i18n=collection]').textContent,'The Timepieces');
 assert.equal(doc.documentElement.dir,'ltr');
 doc.querySelector('#ambientPause').click();
 assert.equal(doc.querySelector('#ambientPause').getAttribute('aria-pressed'),'true');dom.window.close();
});
test('collection landmark, skip target and one current navigation link',async()=>{
 const {dom,w,doc}=await mount('collection','en');
 assert.equal(doc.querySelector('#collectionTitle').tagName,'H1');
 assert.equal(doc.querySelector('.skip').getAttribute('href'),'#collection');
 doc.querySelector('.skip').click();
 assert.equal(doc.activeElement.id,'collection');
 w.history.replaceState(null,'','/collection/');w.dispatchEvent(new w.HashChangeEvent('hashchange'));
 assert.equal(doc.querySelectorAll('#navigation [aria-current]').length,1);
 assert.equal(doc.querySelector('#navigation [aria-current]').hash,'');
 w.history.pushState(null,'','#film');w.dispatchEvent(new w.HashChangeEvent('hashchange'));
 assert.equal(doc.querySelectorAll('#navigation [aria-current]').length,1);
 assert.equal(doc.querySelector('#navigation [aria-current]').hash,'#film');
 assert.equal(doc.querySelector('#navigation [aria-current]').getAttribute('aria-current'),'location');
 w.history.replaceState(null,'','/collection/');w.dispatchEvent(new w.PopStateEvent('popstate'));
 assert.equal(doc.querySelector('#navigation [aria-current]').hash,'');dom.window.close();
});
async function mount(route='collection',lang='ar',reduce=false,fail=false){
 const html=readFileSync(new URL('../dist/'+({home:'index.html',collection:'collection/index.html',biography:'his-highness/index.html',exhibition:'exhibition/index.html',exhibition:'exhibition/index.html'}[route]),import.meta.url),'utf8');
 const dom=new JSDOM(html,{url:'https://museum.test/'+(route==='home'?'':route+'/'),runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;const timers=[];
 w.localStorage.setItem('museum-language',lang);w.matchMedia=()=>({matches:reduce,addEventListener(){}});w.IntersectionObserver=class{observe(){}};w.setInterval=(fn,ms)=>{timers.push({fn,ms});return timers.length};
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))};
 w.fetch=async()=>({ok:!fail,json:async()=>structuredClone(data)});const vision=new URL('../dist/vision.js',import.meta.url);w.eval(code+'\n'+(existsSync(vision)?readFileSync(vision,'utf8'):''));await new Promise(r=>setImmediate(r));return {dom,w,doc:w.document,timers};
}
for(const route of ['home','collection','biography'])for(const lang of ['ar','en'])test('startup '+route+' '+lang,async()=>{const{dom,doc}=await mount(route,lang);assert.equal(doc.documentElement.lang,lang);assert.equal(doc.querySelectorAll('#grid .card').length,route==='home'?6:42);assert.equal(doc.querySelectorAll('#featured .featured-thumb').length,route==='biography'?0:3);assert.equal(doc.querySelector('#grid').getAttribute('aria-busy'),'false');dom.window.close()});
for(const lang of ['ar','en'])test('all 42 correct details '+lang,async()=>{const{dom,doc}=await mount('collection',lang);for(const b of doc.querySelectorAll('#grid [data-watch]')){const record=data.watches.find(x=>x.slug===b.dataset.watch);b.click();assert.equal(doc.querySelector('#detailTitle').textContent,record[lang==='ar'?'nameAr':'nameEn']);assert.equal(doc.querySelector('#zoom img').getAttribute('src'),record.displayImage);doc.querySelector('#detailClose').click()}dom.window.close()});
test('filters search empty reset zoom and RTL navigation',async()=>{const{dom,w,doc}=await mount();doc.querySelector('[data-brand="Rolex"]').click();assert.ok(doc.querySelectorAll('.card').length>0);const input=doc.querySelector('#search');input.value='zzzzz';input.dispatchEvent(new w.Event('input'));assert.equal(doc.querySelectorAll('.card').length,0);input.value='';input.dispatchEvent(new w.Event('input'));assert.ok(doc.querySelectorAll('.card').length>0);doc.querySelector('.card button').click();doc.querySelector('#zoom').click();assert.equal(doc.querySelector('#zoom').getAttribute('aria-pressed'),'true');const first=doc.querySelector('#detailTitle').textContent;doc.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowLeft'}));assert.notEqual(doc.querySelector('#detailTitle').textContent,first);doc.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'}));assert.equal(doc.querySelector('#detail').open,false);dom.window.close()});
test('V1 editorial copy, curated three and detail hierarchy',async()=>{
 const{dom,doc}=await mount('home','ar');
 assert.equal(doc.querySelector('#featured h2').textContent,'ثلاث قطع. ثلاث لغات للوقت.');
 const featured=[...doc.querySelectorAll('#featured .featured-thumb')].map(b=>b.getAttribute('aria-label'));
 assert.match(featured[0],/التقويم|كرونوغراف|5270|دائم/);
 doc.querySelector('.featured-open').click();
 assert.equal(doc.querySelector('.detail-kicker').textContent,'حكاية القطعة');
 assert.equal(doc.querySelector('.detail-tech-title').textContent,'السجل التقني');
 const description=doc.querySelector('.detail-copy .description');
 const technical=doc.querySelector('.detail-tech-title');
 assert.ok(description.compareDocumentPosition(technical)&dom.window.Node.DOCUMENT_POSITION_FOLLOWING);
 doc.querySelector('#detailClose').click();
 doc.querySelector('#lang').click();
 assert.equal(doc.querySelector('#featured h2').textContent,'Three Timepieces. Three Expressions of Time.');
 assert.equal(doc.querySelector('#filmTitle').textContent,'When a Moment Deserves to Last.');
 dom.window.close();
});
test('featured controls retain focus and manual selection pauses',async()=>{const{dom,doc,timers}=await mount();let b=doc.querySelector('#featuredNext');b.focus();b.click();assert.equal(doc.activeElement.id,'featuredNext');assert.equal(doc.querySelector('#featuredPause').getAttribute('aria-pressed'),'true');assert.equal(doc.querySelector('.featured-thumb.active').dataset.featuredIndex,'1');doc.querySelector('[data-featured-index="2"]').click();doc.querySelector('.featured-open').click();assert.equal(doc.querySelector('#detail').open,true);assert.ok(timers.some(t=>t.ms===7000));dom.window.close()});
test('reduced motion and YouTube lazy embed',async()=>{const{dom,doc}=await mount('home','en',true);assert.equal(doc.querySelector('#featuredPause').getAttribute('aria-pressed'),'true');assert.equal(doc.querySelector('#slidePause').getAttribute('aria-pressed'),'true');assert.equal(doc.querySelectorAll('#youtubeStage iframe').length,0);doc.querySelector('#youtubePlay').click();assert.match(doc.querySelector('#youtubeStage iframe').src,/youtube-nocookie.com\/embed\/Air31Kly7Ys/);dom.window.close()});
test('failure offers successful retry',async()=>{const{dom,w,doc}=await mount('collection','ar',false,true);assert.equal(doc.querySelector('#retry').hidden,false);w.fetch=async()=>({ok:true,json:async()=>structuredClone(data)});doc.querySelector('#retry').click();await new Promise(r=>setImmediate(r));assert.equal(doc.querySelectorAll('.card').length,42);assert.equal(doc.querySelector('#retry').hidden,true);dom.window.close()});

if(existsSync(new URL('../dist/vision.js',import.meta.url))) for(const lang of ['ar','en'])test('exhibition chapters, details and URL '+lang,async()=>{const{dom,doc,w}=await mount('exhibition',lang);assert.match(doc.querySelector('#tourRef').textContent,/6263/);doc.querySelector('#tourNext').click();assert.match(w.location.hash,/fp-journe-ffc/);assert.match(doc.querySelector('#tourName').textContent,/FFC/);doc.querySelector('#tourDetail').click();assert.equal(doc.querySelector('#detail').open,true);doc.querySelector('#detailClose').click();doc.querySelectorAll('#tourDots button')[2].click();assert.match(w.location.hash,/mclaren/);assert.equal(doc.querySelector('#tourNext').disabled,true);doc.querySelector('#tourPlay').click();assert.equal(doc.querySelector('#tourPlay').getAttribute('aria-pressed'),'true');assert.match(doc.querySelector('#tourRef').textContent,/6263/);dom.window.close()});

test('watchmaking guide is bilingual, linked and preserves editorial phrases',async()=>{
 const html=readFileSync(new URL('../dist/watchmaking/index.html',import.meta.url),'utf8');
 const watchmakingCode=readFileSync(new URL('../dist/watchmaking.js',import.meta.url),'utf8');
 const dom=new JSDOM(html,{url:'https://museum.test/watchmaking/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;w.localStorage.setItem('museum-language','ar');
 w.eval(watchmakingCode);
 const doc=w.document;
 assert.equal(doc.documentElement.dir,'rtl');
 assert.match(doc.querySelector('.craft-hero h1').textContent,/تتجاوز الزمن/);
 assert.match(doc.querySelector('.craft-manifesto').textContent,/من القلائل/);
 assert.equal(doc.querySelectorAll('.anatomy-grid article').length,12);
 assert.equal(doc.querySelectorAll('.complication-list article').length,9);
 assert.equal(doc.querySelectorAll('img[src="/images/sheikh/watchmaking-event.webp"]').length,1);
 doc.querySelector('#lang').click();
 assert.equal(doc.documentElement.dir,'ltr');
 assert.equal(doc.querySelector('.craft-hero h1').textContent.trim(),'Timeless timepieces.');
 assert.match(doc.querySelector('.craft-manifesto').textContent,/One of the few\. Never one of many\./);
 assert.ok([...doc.querySelectorAll('.complication-list h3')].some(x=>x.textContent==='Tourbillon'));
 assert.ok([...doc.querySelectorAll('.complication-list h3')].some(x=>x.textContent==='Dual Time / GMT'));
 dom.window.close();
});
