import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const data = JSON.parse(readFileSync(new URL('../dist/watches.json', import.meta.url)));
const code = readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8');
const files = { home: 'index.html', collection: 'collection/index.html', biography: 'his-highness/index.html', exhibition: 'exhibition/index.html', watchmaking: 'watchmaking/index.html' };
const paths = { home: '', collection: 'collection/', biography: 'his-highness/', exhibition: 'exhibition/', watchmaking: 'watchmaking/' };

async function mount(route = 'collection', lang = 'ar', { reduce = false, fail = false, hash = '' } = {}) {
  const html = readFileSync(new URL('../dist/' + files[route], import.meta.url), 'utf8');
  const dom = new JSDOM(html, { url: 'https://museum.test/' + paths[route] + hash, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window, timers = [];
  w.localStorage.setItem('museum-language', lang);
  w.matchMedia = () => ({ matches: reduce, addEventListener() {} });
  w.IntersectionObserver = class { observe() {} unobserve() {} };
  w.setInterval = (fn, ms) => { timers.push({ fn, ms }); return timers.length; };
  w.clearInterval = () => {};
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { if (this.open) { this.open = false; this.dispatchEvent(new w.Event('close')); } };
  w.fetch = async () => ({ ok: !fail, json: async () => structuredClone(data) });
  w.eval(code);
  await new Promise(r => setImmediate(r));
  return { dom, w, doc: w.document, timers };
}

for (const route of ['home', 'collection', 'biography', 'exhibition', 'watchmaking']) for (const lang of ['ar', 'en'])
  test(`startup ${route} ${lang}`, async () => {
    const { dom, doc } = await mount(route, lang);
    assert.equal(doc.documentElement.lang, lang);
    assert.equal(doc.documentElement.dir, lang === 'ar' ? 'rtl' : 'ltr');
    if (route === 'home') { assert.equal(doc.querySelectorAll('#grid .card').length, 6); assert.equal(doc.querySelectorAll('#featuredGrid .card').length, 3); }
    if (route === 'collection') assert.equal(doc.querySelectorAll('#grid .card').length, 44);
    assert.equal(doc.querySelector('#menu').getAttribute('aria-expanded'), 'false');
    dom.window.close();
  });

test('Arabic is the default and the language switch is complete', async () => {
  const { dom, doc } = await mount('home', 'ar');
  assert.match(doc.querySelector('#heroTitle').innerHTML, /للوقت قدر\.<em>وللساعات حكاية\.<\/em>/);
  assert.equal(doc.querySelector('#featuredTitle').textContent, 'ثلاث قطع. ثلاث لغات للوقت.');
  assert.equal(doc.querySelector('#filmTitle').textContent, 'حين تستحق اللحظة أن تطول.');
  assert.equal(doc.querySelector('#featuredGrid .maison').textContent, 'رولكس');
  doc.querySelector('#lang').click();
  assert.equal(doc.documentElement.dir, 'ltr');
  assert.equal(doc.querySelector('#featuredTitle').textContent, 'Three Timepieces. Three Expressions of Time.');
  assert.equal(doc.querySelector('#filmTitle').textContent, 'When a Moment Deserves to Last.');
  assert.equal(doc.querySelector('#featuredGrid .maison').textContent, 'Rolex');
  assert.equal(doc.querySelector('#lang').textContent, 'عربي');
  assert.equal(dom.window.localStorage.getItem('museum-language'), 'en');
  dom.window.close();
});

test('the curated three open with the 6100 Chinese Dragon', async () => {
  const { dom, doc } = await mount('home', 'ar');
  const slugs = [...doc.querySelectorAll('#featuredGrid [data-watch]')].map(b => b.dataset.watch);
  assert.deepEqual(slugs, ['rolex-6100-chinese-dragon-cloisonne', 'patek-philippe-perpetual-calendar-5270p-green', 'patek-philippe-nautilus-perpetual-calendar-5740']);
  dom.window.close();
});

test('every rendered timepiece image shows His Highness', async () => {
  for (const route of ['home', 'collection']) {
    const { dom, doc } = await mount(route, 'ar');
    const srcs = [...doc.querySelectorAll('main img')].map(i => i.getAttribute('src'));
    assert.ok(srcs.length > 0);
    for (const src of srcs) assert.match(src, /^\/(images\/sheikh|images\/sheikh-examining-watches|assets\/royal\/)/, `${route}: ${src}`);
    dom.window.close();
  }
});

for (const lang of ['ar', 'en'])
  test('all 44 details open with the royal image ' + lang, async () => {
    const { dom, doc } = await mount('collection', lang);
    for (const b of doc.querySelectorAll('#grid [data-watch]')) {
      const record = data.watches.find(x => x.slug === b.dataset.watch);
      b.click();
      assert.equal(doc.querySelector('#detailTitle').textContent, record[lang === 'ar' ? 'nameAr' : 'nameEn']);
      assert.equal(doc.querySelector('#zoom img').getAttribute('src'), record.royalImage);
      assert.ok(doc.querySelector('.pairing').textContent.length > 10);
      const description = doc.querySelector('.sheet-copy .description'), technical = doc.querySelector('.detail-tech-title');
      assert.ok(description.compareDocumentPosition(technical) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING);
      doc.querySelector('#detailClose').click();
    }
    dom.window.close();
  });

test('portrait pairings are labelled honestly', async () => {
  const { dom, doc } = await mount('collection', 'en');
  const portrait = data.watches.find(w => w.royalPairing === 'portrait');
  const photo = data.watches.find(w => w.royalPairing === 'photograph');
  doc.querySelector(`[data-watch="${portrait.slug}"]`).click();
  assert.match(doc.querySelector('.pairing').textContent, /official portrait/i);
  doc.querySelector('#detailClose').click();
  doc.querySelector(`[data-watch="${photo.slug}"]`).click();
  assert.match(doc.querySelector('.pairing').textContent, /with the timepiece/);
  dom.window.close();
});

test('Arabic detail shows no English words in name, maison or reference readings', async () => {
  const { dom, doc } = await mount('collection', 'ar');
  for (const slug of ['fp-journe-tourbillon-souverain', 'artisans-de-geneve-la-montoya-platinum-challenge', 'lederer-cic-39-inverto-titanium', 'fp-journe-linesport-chronographe-rattrapante']) {
    doc.querySelector(`[data-watch="${slug}"]`).click();
    const text = ['#detailTitle', '.sheet-copy .maison', '.sheet-copy .ref'].map(s => doc.querySelector(s).textContent).join(' ');
    assert.doesNotMatch(text, /[a-z]{3,}/, slug + ': ' + text);
    doc.querySelector('#detailClose').click();
  }
  dom.window.close();
});

test('filters, search, empty state, zoom and RTL keyboard navigation', async () => {
  const { dom, w, doc } = await mount('collection', 'ar');
  doc.querySelector('[data-brand="Rolex"]').click();
  assert.ok(doc.querySelectorAll('.card').length > 0);
  assert.ok([...doc.querySelectorAll('.card')].every(c => data.watches.find(x => x.slug === c.dataset.watch).brand === 'Rolex'));
  const input = doc.querySelector('#search');
  input.value = 'zzzzz'; input.dispatchEvent(new w.Event('input'));
  assert.equal(doc.querySelectorAll('.card').length, 0);
  assert.ok(doc.querySelector('.empty'));
  input.value = ''; input.dispatchEvent(new w.Event('input'));
  doc.querySelector('[data-brand="all"]').click();
  assert.equal(doc.querySelectorAll('.card').length, 44);
  doc.querySelector('.card').click();
  doc.querySelector('#zoom').click();
  assert.equal(doc.querySelector('#zoom').getAttribute('aria-pressed'), 'true');
  const first = doc.querySelector('#detailTitle').textContent;
  doc.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowLeft' }));
  assert.notEqual(doc.querySelector('#detailTitle').textContent, first, 'ArrowLeft advances in RTL');
  doc.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape' }));
  assert.equal(doc.querySelector('#detail').open, false);
  dom.window.close();
});

test('Lederer record survives in its maison filter', async () => {
  const { dom, doc } = await mount('collection', 'en');
  doc.querySelector('[data-brand="Lederer"]').click();
  assert.equal(doc.querySelectorAll('#grid .card').length, 1);
  doc.querySelector('#grid [data-watch]').click();
  assert.match(doc.querySelector('#detailTitle').textContent, /InVerto/);
  assert.match(doc.querySelector('.specs').textContent, /9019/);
  dom.window.close();
});

test('detail links known complications to watchmaking definitions', async () => {
  const { dom, doc } = await mount('collection', 'en');
  for (const [slug, href] of [
    ['rolex-daytona-6263-quraysh-hawk', '/watchmaking/#complication-chronograph'],
    ['richard-mille-rm-26-02-tourbillon-evil-eye', '/watchmaking/#complication-tourbillon'],
    ['patek-philippe-perpetual-calendar-5271p-blue-sapphire', '/watchmaking/#complication-perpetual-calendar'],
    ['patek-philippe-grand-complications-minute-repeater', '/watchmaking/#complication-minute-repeater'],
    ['richard-mille-rm-65-01-automatic-split-seconds-chronograph-mclaren-w1', '/watchmaking/#complication-rattrapante']
  ]) {
    doc.querySelector(`[data-watch="${slug}"]`).click();
    assert.ok([...doc.querySelectorAll('.complication-guide-tags a')].some(a => a.getAttribute('href') === href), `${slug} → ${href}`);
    doc.querySelector('#detailClose').click();
  }
  dom.window.close();
});

test('failure offers a working retry', async () => {
  const { dom, w, doc } = await mount('collection', 'ar', { fail: true });
  assert.equal(doc.querySelector('#retry').hidden, false);
  w.fetch = async () => ({ ok: true, json: async () => structuredClone(data) });
  doc.querySelector('#retry').click();
  await new Promise(r => setImmediate(r));
  assert.equal(doc.querySelectorAll('.card').length, 44);
  assert.equal(doc.querySelector('#retry').hidden, true);
  dom.window.close();
});

test('header carries no play control and the page carries no player', async () => {
  for (const route of Object.keys(files)) {
    const { dom, doc } = await mount(route, 'ar');
    assert.equal(doc.querySelector('#masthead').querySelectorAll('button').length, 2, route);
    assert.doesNotMatch(doc.querySelector('#masthead').textContent, /[▶►]/);
    assert.equal(doc.querySelectorAll('video,iframe').length, 0, route);
    dom.window.close();
  }
});

test('screening room plays photographs of His Highness with discreet controls', async () => {
  const { dom, doc, timers } = await mount('home', 'en');
  const frames = [...doc.querySelectorAll('#frames .still')];
  assert.equal(frames.length, 7);
  for (const f of frames) assert.match(f.getAttribute('src'), /^\/(images\/sheikh|images\/sheikh-examining-watches|assets\/royal\/)/);
  doc.querySelector('#screenPlay').click();
  assert.ok(doc.querySelector('#screen').classList.contains('playing'));
  const tick = timers.findLast(t => t.ms === 6000);
  tick.fn();
  assert.ok(doc.querySelectorAll('#frames .frame')[1].classList.contains('on'));
  doc.querySelector('#screenPause').click();
  assert.equal(doc.querySelector('#screenPause').getAttribute('aria-pressed'), 'true');
  assert.equal(doc.querySelector('#screenPause').textContent, 'Resume');
  doc.querySelector('#screenStop').click();
  assert.ok(!doc.querySelector('#screen').classList.contains('playing'));
  dom.window.close();
});

for (const lang of ['ar', 'en'])
  test('exhibition stops, detail and deep link ' + lang, async () => {
    const { dom, doc, w } = await mount('exhibition', lang);
    assert.match(doc.querySelector('#tourRef').textContent, /6263/);
    assert.match(doc.querySelector('#tourImage').getAttribute('src'), /^\/assets\/royal\//);
    doc.querySelector('#tourNext').click();
    assert.match(w.location.hash, /fp-journe-tourbillon-souverain/);
    doc.querySelector('#tourDetail').click();
    assert.equal(doc.querySelector('#detail').open, true);
    doc.querySelector('#detailClose').click();
    doc.querySelectorAll('#tourDots button')[2].click();
    assert.match(w.location.hash, /evil-eye/);
    assert.equal(doc.querySelector('#tourNext').disabled, true);
    doc.querySelector('#tourPlay').click();
    assert.equal(doc.querySelector('#tourPlay').getAttribute('aria-pressed'), 'true');
    assert.match(doc.querySelector('#tourRef').textContent, /6263/);
    dom.window.close();
    const deep = await mount('exhibition', lang, { hash: '#richard-mille-rm-26-02-tourbillon-evil-eye' });
    assert.match(deep.doc.querySelector('#tourRef').textContent, /RM 26-02/);
    deep.dom.window.close();
  });

test('watchmaking guide is bilingual and keeps the owner phrase', async () => {
  const { dom, doc } = await mount('watchmaking', 'ar');
  assert.equal(doc.documentElement.dir, 'rtl');
  assert.match(doc.querySelector('.craft-hero h1').textContent, /تتجاوز الزمن/);
  assert.equal(doc.querySelector('.craft-manifesto').textContent, 'واحدةٌ من قِلّة.');
  assert.equal(doc.querySelectorAll('.anatomy-grid article').length, 12);
  assert.equal(doc.querySelectorAll('.complication-list article').length, 9);
  doc.querySelector('#lang').click();
  assert.equal(doc.querySelector('.craft-hero h1').textContent.trim(), 'Timeless timepieces.');
  assert.equal(doc.querySelector('.craft-manifesto').textContent.trim(), 'One of not many');
  const names = [...doc.querySelectorAll('.complication-list h3')].map(x => x.textContent);
  for (const n of ['Tourbillon', 'Dual Time & GMT', 'Split-seconds Chronograph / Rattrapante']) assert.ok(names.includes(n), n);
  dom.window.close();
});

test('royal biography keeps Gregorian dates with Arabic-Indic years', async () => {
  const { dom, doc } = await mount('biography', 'ar');
  const times = [...doc.querySelectorAll('.bio-timeline time')];
  assert.equal(times.length, 6);
  assert.equal(times[0].textContent, '١٩٦٩');
  assert.equal(times[0].getAttribute('datetime'), '1969');
  assert.equal(doc.querySelectorAll('.records article').length, 3);
  assert.match(doc.querySelector('#royalChaptersTitle').textContent, /المكان/);
  doc.querySelector('#lang').click();
  assert.equal(times[0].textContent, '1969');
  assert.match(doc.querySelector('#royalChaptersTitle').textContent, /lasting interest/);
  assert.doesNotMatch(doc.querySelector('.bio-timeline').textContent, /السوع/);
  dom.window.close();
});

test('menu opens, labels itself and closes on Escape', async () => {
  const { dom, w, doc } = await mount('collection', 'en');
  doc.querySelector('#menu').click();
  assert.equal(doc.querySelector('#menu').getAttribute('aria-expanded'), 'true');
  assert.equal(doc.querySelector('#menu').getAttribute('aria-label'), 'Close menu');
  assert.equal(doc.querySelector('#navigation [aria-current="page"]').getAttribute('href'), '/collection/');
  doc.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape' }));
  assert.equal(doc.querySelector('#menu').getAttribute('aria-expanded'), 'false');
  dom.window.close();
});

test('every record carries a royal image and a declared pairing', () => {
  assert.equal(data.watches.length, 44);
  for (const w of data.watches) {
    assert.match(w.royalImage, /^\/assets\/royal\/.+\.webp$/, w.slug);
    assert.ok(['photograph', 'portrait'].includes(w.royalPairing), w.slug);
  }
  assert.ok(data.watches.filter(w => w.royalPairing === 'photograph').length >= 35);
});

test('a private invitation turns the visit into a one-of-one edition', async () => {
  const { dom, doc } = await mount('home', 'ar', { hash: '?for=' + encodeURIComponent('ضيف المجلس<script>') });
  assert.equal(doc.querySelector('#invite').hidden, false);
  assert.equal(doc.querySelector('#invite').textContent, 'بدعوةٍ خاصة · ضيف المجلسscript');
  assert.equal(doc.querySelector('#invite').children.length, 0, 'guest name is text, never markup');
  assert.match(doc.querySelector('#edition').textContent, /نسخةٌ خاصة/);
  doc.querySelector('#lang').click();
  assert.match(doc.querySelector('#invite').textContent, /^A private invitation · /);
  dom.window.close();
  const plain = await mount('home', 'ar');
  assert.equal(plain.doc.querySelector('#invite').hidden, true);
  plain.dom.window.close();
});

test('the opening veil shows once and never under reduced motion', async () => {
  const first = await mount('home', 'ar');
  assert.equal(first.doc.querySelector('#veil').hidden, false);
  first.doc.querySelector('#veil').click();
  assert.ok(first.doc.querySelector('#veil').classList.contains('lift'));
  first.dom.window.close();
  const calm = await mount('home', 'ar', { reduce: true });
  assert.equal(calm.doc.querySelector('#veil').hidden, true);
  calm.dom.window.close();
});

test('time band reads Ajman time with Hijri and Gregorian dates', async () => {
  const { dom, doc } = await mount('home', 'ar');
  assert.match(doc.querySelector('#bandTime').textContent, /^[٠-٩]{2}:[٠-٩]{2}:[٠-٩]{2}$/);
  assert.match(doc.querySelector('#bandHijri').textContent, /هـ/);
  doc.querySelector('#lang').click();
  assert.match(doc.querySelector('#bandTime').textContent, /^\d{2}:\d{2}:\d{2}$/);
  assert.match(doc.querySelector('#bandHijri').textContent, /AH/);
  dom.window.close();
});

test('piece of the day is a photograph of His Highness and opens its sheet', async () => {
  const { dom, doc } = await mount('home', 'en');
  const slug = doc.querySelector('#todayOpen').dataset.watch;
  const w = data.watches.find(x => x.slug === slug);
  assert.equal(w.royalPairing, 'photograph');
  assert.equal(doc.querySelector('#todayFigure img').getAttribute('src'), w.royalImage);
  doc.querySelector('#todayOpen').click();
  assert.equal(doc.querySelector('#detailTitle').textContent, w.nameEn);
  dom.window.close();
});

test('the collection dial places every dated piece in order and opens it', async () => {
  const { dom, w, doc } = await mount('home', 'en');
  const marks = [...doc.querySelectorAll('#dialMarks .dial-mark')];
  const dated = data.watches.filter(x => Number(x.yearReleased) > 1900 || x.yearLabelEn);
  assert.equal(marks.length, dated.length);
  assert.equal(marks.filter(m => m.tabIndex === 0).length, 1);
  assert.match(doc.querySelector('#dialCaption h3').textContent, /6100/, 'the dial opens on the oldest piece');
  marks[0].dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  assert.equal(marks[1].getAttribute('aria-selected'), 'true');
  assert.match(doc.querySelector('#dialHand').style.transform, /rotate\(/);
  const labels = [...doc.querySelectorAll('#dialDecades text')].map(t => t.textContent);
  assert.ok(labels.length >= 3 && new Set(labels).size === labels.length);
  marks[1].click();
  assert.equal(doc.querySelector('#detail').open, true);
  dom.window.close();
});

test('detail sheet carries a loupe over the royal image', async () => {
  const { dom, doc } = await mount('collection', 'en');
  doc.querySelector('.card').click();
  assert.ok(doc.querySelector('#zoom .loupe'));
  dom.window.close();
});
