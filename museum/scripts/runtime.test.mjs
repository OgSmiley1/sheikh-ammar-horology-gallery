import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const data = JSON.parse(readFileSync(new URL('../dist/watches.json', import.meta.url)));
const code = readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8');
const files = { home: 'index.html', collection: 'collection/index.html', biography: 'his-highness/index.html', exhibition: 'exhibition/index.html', watchmaking: 'watchmaking/index.html' };
const paths = { home: '', collection: 'collection/', biography: 'his-highness/', exhibition: 'exhibition/', watchmaking: 'watchmaking/' };

// every window is closed at the end even if its test throws first — an open window
// keeps its animation frames running and would hold the run open forever
const opened = [];
after(() => opened.forEach(w => w.close()));

async function mount(route = 'collection', lang = 'ar', { reduce = false, fail = false, hash = '' } = {}) {
  const html = readFileSync(new URL('../dist/' + files[route], import.meta.url), 'utf8');
  const dom = new JSDOM(html, { url: 'https://museum.test/' + paths[route] + hash, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window, timers = [];
  opened.push(w);
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
    if (route === 'collection') assert.equal(doc.querySelectorAll('#grid .card').length, 45);
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
  test('all 45 details open with the royal image ' + lang, async () => {
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
  assert.equal(doc.querySelectorAll('.card').length, 45);
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
  assert.equal(doc.querySelectorAll('.card').length, 45);
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
  assert.equal(data.watches.length, 45);
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

// ————— One of not many —————
const decadeOf = x => { const y = Number(x.yearReleased); if (y) return Math.floor(y / 10) * 10; const m = /^(\d{4})s$/.exec(x.yearLabelEn || ''); return m ? Number(m[1]) : null; };
const key = (w, el, k) => el.dispatchEvent(new w.KeyboardEvent('keydown', { key: k, bubbles: true }));

for (const lang of ['ar', 'en'])
  test('the time machine travels the ledger by crown, key and rail ' + lang, async () => {
    const { dom, w, doc } = await mount('watchmaking', lang, { reduce: true });
    const svg = doc.querySelector('#timeMachine');
    const eras = [...doc.querySelectorAll('#eraRail [data-era]')].map(b => b.dataset.era);
    const undated = data.watches.filter(x => decadeOf(x) === null);
    assert.deepEqual(eras, ['1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020', ...(undated.length ? ['undated'] : [])]);
    assert.equal(svg.getAttribute('aria-valuetext'), lang === 'ar' ? 'الآن — بتوقيت عجمان' : 'Now — Ajman time', 'at rest it names the present');
    assert.equal(doc.querySelectorAll('#eraCards .era-card').length, 0);
    // the digits in the year window follow the reading
    assert.equal(doc.querySelector('#yearWindow text[data-d="7"]').textContent, lang === 'ar' ? '٧' : '7');

    key(w, svg, 'Home');
    assert.equal(svg.getAttribute('aria-valuenow'), '1954');
    assert.match(svg.getAttribute('aria-valuetext'), lang === 'ar' ? /^١٩٥٤ — الخمسينيات/ : /^1954 — The 1950s/, 'the year it reaches is announced');
    assert.ok(doc.querySelector('#tm').classList.contains('travelling'));
    assert.equal(doc.querySelector('#tmNow').hidden, false);
    // forward is toward the reading direction: ← in Arabic, → in English
    key(w, svg, lang === 'ar' ? 'ArrowLeft' : 'ArrowRight');
    const next = Number(svg.getAttribute('aria-valuenow'));
    const detents = [...new Set(data.watches.map(x => Number(x.yearReleased)).filter(Boolean))].sort((a, b) => a - b);
    assert.equal(next, detents.find(y => y > 1954), 'the crown clicks to the next year the ledger holds');
    key(w, svg, lang === 'ar' ? 'ArrowRight' : 'ArrowLeft');
    assert.equal(svg.getAttribute('aria-valuenow'), '1954');

    doc.querySelector('#eraRail [data-era="1970"]').click();
    assert.match(svg.getAttribute('aria-valuenow'), /^197\d$/);
    assert.equal(doc.querySelector('#eraRail [data-era="1970"]').getAttribute('aria-pressed'), 'true');
    assert.equal(w.location.hash, '#era-1970s');
    const seventies = data.watches.filter(x => decadeOf(x) === 1970);
    assert.equal(doc.querySelectorAll('#eraCards .era-card').length, seventies.length);
    for (const img of doc.querySelectorAll('#eraCards img')) assert.match(img.getAttribute('src'), /^\/assets\/royal\//);
    doc.querySelector('#eraCards [data-watch]').click();
    assert.equal(doc.querySelector('#detail').open, true, 'an era card opens its sheet');
    doc.querySelector('#detailClose').click();

    if (undated.length) {
      doc.querySelector('#eraRail [data-era="undated"]').click();
      assert.equal(doc.querySelectorAll('#eraCards .era-card').length, undated.length);
      assert.equal(w.location.hash, '#era-undated');
    }
    // a language switch mid-journey re-announces the year in the new language
    doc.querySelector('#eraRail [data-era="1960"]').click();
    doc.querySelector('#lang').click();
    assert.match(svg.getAttribute('aria-valuetext'), lang === 'ar' ? /The 1960s/ : /الستينيات/);
    doc.querySelector('#lang').click();

    key(w, svg, 'Escape');
    assert.ok(!doc.querySelector('#tm').classList.contains('travelling'));
    assert.equal(doc.querySelector('#tmNow').hidden, true);
    assert.equal(svg.getAttribute('aria-valuetext'), lang === 'ar' ? 'الآن — بتوقيت عجمان' : 'Now — Ajman time');
    assert.equal(w.location.hash, '');
    dom.window.close();
  });

test('an era link opens the time machine on its decade', async () => {
  const { dom, doc } = await mount('watchmaking', 'ar', { reduce: true, hash: '#era-1960s' });
  assert.equal(doc.querySelector('#eraRail [data-era="1960"]').getAttribute('aria-pressed'), 'true');
  assert.equal(doc.querySelectorAll('#eraCards .era-card').length, data.watches.filter(x => decadeOf(x) === 1960).length);
  dom.window.close();
});

test('six crown pieces, each shown with His Highness and numbered in the reading', async () => {
  const crowns = ['rolex-6100-chinese-dragon-cloisonne', 'rolex-daytona-6263-quraysh-hawk', 'patek-philippe-minute-repeater-tourbillon-3939hp',
    'fp-journe-ffc-francis-ford-coppola-calibre-13003', 'richard-mille-rm-68-01-tourbillon-cyril-kongo', 'patek-philippe-nautilus-5711-1300a-olive-green'];
  const { dom, doc } = await mount('home', 'ar');
  const stages = [...doc.querySelectorAll('#crownPieces .crown-stage')];
  assert.deepEqual(stages.map(s => s.dataset.watch), crowns);
  stages.forEach((s, i) => assert.equal(s.querySelector('img').getAttribute('src'), data.watches.find(x => x.slug === crowns[i]).royalImage));
  assert.deepEqual([...doc.querySelectorAll('.crown-num')].map(n => n.textContent), ['١', '٢', '٣', '٤', '٥', '٦']);
  doc.querySelector('#lang').click();
  assert.deepEqual([...doc.querySelectorAll('.crown-num')].map(n => n.textContent), ['I', 'II', 'III', 'IV', 'V', 'VI']);
  assert.match(doc.querySelector('#crownPieces').textContent, /The rarity of survival/);
  doc.querySelectorAll('#crownPieces .crown-stage')[3].click();
  assert.equal(doc.querySelector('#detailTitle').textContent, data.watches.find(x => x.slug === crowns[3]).nameEn);
  dom.window.close();
});

test('films load nothing until asked, then play under our own controls', async () => {
  const { dom, w, doc } = await mount('collection', 'en');
  const figs = [...doc.querySelectorAll('.film[data-film]')];
  assert.deepEqual(figs.map(f => f.dataset.film), ['Air31Kly7Ys']);
  const api = () => [...doc.querySelectorAll('script[src*="youtube"]')];
  assert.equal(api().length, 0, 'nothing from the video host at load');
  for (const f of figs) assert.match(f.querySelector('img').getAttribute('src'), /^\/images\/(sheikh\/|sheikh-examining-watches)/, 'our poster, not the host thumbnail');
  figs[0].querySelector('.film-play').click();
  figs[0].querySelector('.film-play').click();
  assert.equal(api().length, 1, 'the API script is requested once, on the click');
  assert.equal(api()[0].src, 'https://www.youtube.com/iframe_api');
  const made = [];
  w.YT = { Player: class { constructor(el, opts) { made.push(opts); opts.events.onReady({ target: { playVideo() {} } }); } destroy() {} } };
  w.onYouTubeIframeAPIReady();
  await new Promise(r => setImmediate(r));
  assert.equal(made.length, 1);
  assert.equal(made[0].host, 'https://www.youtube-nocookie.com');
  assert.equal(made[0].videoId, 'Air31Kly7Ys');
  assert.equal(made[0].playerVars.controls, 0);
  assert.equal(made[0].playerVars.rel, 0);
  assert.ok(figs[0].classList.contains('playing'));
  assert.deepEqual([...figs[0].querySelectorAll('.film-bar button')].map(b => b.textContent), ['Pause', 'Mute', 'Close the film']);
  assert.doesNotMatch(doc.querySelector('#films').textContent, /youtube/i, 'no host title or channel in our frame');
  figs[0].querySelector('[data-film-act="close"]').click();
  assert.ok(!figs[0].classList.contains('playing'));
  assert.equal(figs[0].querySelector('.film-stage'), null);
  dom.window.close();
});

test('the second film is told as a written story, and each chapter opens its piece', async () => {
  const { dom, doc } = await mount('collection', 'en');
  const chapters = [...doc.querySelectorAll('.story-chapters .chapter')];
  assert.equal(chapters.length, 5);
  for (const c of chapters) {
    const slug = c.querySelector('[data-open-slug]').dataset.openSlug;
    assert.ok(data.watches.some(w => w.slug === slug), `${slug} is in the ledger`);
    assert.equal(c.querySelector('img').getAttribute('src'), `/assets/royal/${slug}.webp`);
  }
  assert.doesNotMatch(doc.querySelector('#story').textContent, /\$|US\$|AED|million|مليون/i, 'no prices in the story');
  chapters[2].querySelector('[data-open-slug]').click();
  assert.equal(doc.querySelector('#detailTitle').textContent, data.watches.find(w => w.slug === 'patek-philippe-calatrava').nameEn);
  dom.window.close();
});

test('a film that cannot load says so, in the reader\'s language', async () => {
  const { dom, w, doc } = await mount('collection', 'ar');
  const fig = doc.querySelector('.film[data-film]');
  fig.querySelector('.film-play').click();
  doc.querySelector('script[src*="youtube"]').dispatchEvent(new w.Event('error'));
  await new Promise(r => setImmediate(r));
  assert.match(fig.querySelector('.film-note').textContent, /تعذّر تشغيل الفيلم/);
  assert.ok(!fig.classList.contains('loading'));
  dom.window.close();
});

test('anatomy hotspots N°1–N°12 answer the cards, and the callout keeps the card\'s number', async () => {
  const { dom, w, doc } = await mount('watchmaking', 'en');
  const hots = [...doc.querySelectorAll('.hotspot')];
  assert.equal(hots.length, 12);
  assert.deepEqual(hots.map(h => Number(h.querySelector('text').textContent)).sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const crown = doc.querySelector('.hotspot[data-part="crown"]');
  crown.querySelector('.hot-hit').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  const card = doc.querySelector('.anatomy-card[data-part="crown"]');
  assert.equal(card.getAttribute('aria-pressed'), 'true');
  const caption = doc.querySelector('#stageCaption');
  assert.equal(caption.querySelector('.callout-n').textContent, card.querySelector('.num').textContent);
  doc.querySelector('.anatomy-card[data-part="escapement"]').click();
  assert.ok(doc.querySelector('#stageInner').classList.contains('flipped'), 'the movement parts turn the watch over');
  doc.querySelector('#lang').click();
  assert.match(caption.querySelector('.callout-n').textContent, /^[٠-٩]+$/);
  assert.deepEqual(hots.map(h => h.querySelector('text').textContent).every(t => /^[٠-٩]+$/.test(t)), true);
  dom.window.close();
});

test('the veil tells the motion layer when it lifts, and lifts at once under reduced motion', async () => {
  const first = await mount('home', 'ar');
  let heard = 0;
  first.doc.addEventListener('museum:veil', () => heard++);
  assert.equal(first.doc.documentElement.dataset.veil, undefined);
  first.doc.querySelector('#veil').click();
  assert.equal(first.doc.documentElement.dataset.veil, 'lifted');
  assert.equal(heard, 1);
  first.doc.querySelector('#veil').click();
  assert.equal(heard, 1, 'lifts once');
  first.dom.window.close();
  const calm = await mount('home', 'ar', { reduce: true });
  assert.equal(calm.doc.documentElement.dataset.veil, 'lifted');
  calm.dom.window.close();
});

const royalCode = readFileSync(new URL('../dist/royal.js', import.meta.url), 'utf8');
for (const reduce of [true, false])
  test(`the motion layer ${reduce ? 'stays still' : 'fetches only its two libraries'} ${reduce ? 'under reduced motion' : 'otherwise'}`, async () => {
    const { dom, w, doc } = await mount('home', 'ar', { reduce });
    w.HTMLCanvasElement.prototype.getContext = () => null; // no WebGL here: the paper must bow out quietly
    w.eval(royalCode);
    await new Promise(r => setImmediate(r));
    const vendor = [...doc.querySelectorAll('script[src*="/vendor/"]')].map(s => s.getAttribute('src'));
    assert.deepEqual(vendor, reduce ? [] : ['/vendor/gsap.min.js', '/vendor/lenis.min.js']);
    assert.equal(doc.querySelector('canvas.paper'), null);
    assert.ok(!doc.documentElement.classList.contains('has-cursor'), 'the cursor waits for a hand');
    dom.window.close();
  });
