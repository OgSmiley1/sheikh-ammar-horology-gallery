'use strict';
// The Majlis of Time — one runtime for every page.
// Static copy is bilingual in the markup (data-ar / data-en); this file swaps it,
// renders the collection from /watches.json, and runs the detail sheet, the
// screening room and the exhibition. Arabic is the default language.

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const page = document.body.dataset.page;
const state = { ar: true, all: [], filter: 'all', query: '', list: [], selected: null, loading: true, error: false };
try { state.ar = localStorage.getItem('museum-language') !== 'en'; } catch {}

const words = {
  ar: {
    all: 'جميع الدور', explore: 'اكتشف القطعة', loading: 'جارٍ فتح المجموعة…',
    empty: 'لم نجد قطعة بهذه الكلمات. جرّب اسم الدار أو رقم المرجع.',
    failure: 'تعذّر فتح المجموعة. يُرجى المحاولة مرة أخرى.',
    count: (n, total) => `${n} من ${total} قطعة`,
    zoom: 'تكبير الصورة', zoomOut: 'تصغير الصورة', zoomHint: 'اضغط على الصورة للتكبير',
    reference: 'المرجع', material: 'مادة العلبة', movement: 'العيار / الحركة', caseSize: 'أبعاد العلبة',
    powerReserve: 'احتياطي الطاقة', complications: 'التعقيدات', yearReleased: 'عام طرح الطراز',
    editorialRecord: 'حكاية القطعة', technicalRecord: 'السجل التقني', understandCraft: 'اكتشف العيار والتعقيدات',
    pairedPhotograph: 'صاحب السمو مع القطعة.',
    pairedPortrait: 'صورة رسمية لصاحب السمو، تُعرض إلى جانب القطعة.',
    royalAlt: w => `صاحب السمو الشيخ عمّار بن حميد النعيمي — ${w}`,
    open: 'افتح القائمة', close: 'أغلق القائمة', lang: 'Switch to English',
    pause: 'إيقاف مؤقت', resume: 'متابعة', tourPlay: 'جولة تلقائية', tourPause: 'إيقاف الجولة',
    craftGuide: 'تأمّل القطعة',
    image: 'تعذّر عرض الصورة', ajman: 'الوقت في عجمان'
  },
  en: {
    all: 'All maisons', explore: 'Discover the timepiece', loading: 'Opening the collection…',
    empty: 'No timepiece matches those words. Try a maison or a reference number.',
    failure: 'The collection could not be opened. Please try again.',
    count: (n, total) => `${n} of ${total} timepieces`,
    zoom: 'Enlarge image', zoomOut: 'Reduce image', zoomHint: 'Select the image to enlarge',
    reference: 'Reference', material: 'Case material', movement: 'Calibre / movement', caseSize: 'Case dimensions',
    powerReserve: 'Power reserve', complications: 'Complications', yearReleased: 'Model introduction',
    editorialRecord: 'The story of the timepiece', technicalRecord: 'Technical record', understandCraft: 'Explore the calibre and complications',
    pairedPhotograph: 'His Highness with the timepiece.',
    pairedPortrait: 'An official portrait of His Highness, presented beside the timepiece.',
    royalAlt: w => `His Highness Sheikh Ammar bin Humaid Al Nuaimi — ${w}`,
    open: 'Open menu', close: 'Close menu', lang: 'التبديل إلى العربية',
    pause: 'Pause', resume: 'Resume', tourPlay: 'Guided tour', tourPause: 'Pause the tour',
    craftGuide: 'Look closer',
    image: 'Image unavailable', ajman: 'Time in Ajman'
  }
};
// Register reminders for editors: Haute Horlogerie, craftsmanship, horological heritage;
// صناعة الساعات الراقية، المهارة الحرفية، إرث صناعة الساعات، الميناء.
const t = k => words[state.ar ? 'ar' : 'en'][k];
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const local = (w, k) => w[k + (state.ar ? 'Ar' : 'En')] || w[k] || '';
const indic = v => String(v).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

const maisonAr = {
  'Patek Philippe': 'باتيك فيليب', 'Audemars Piguet': 'أوديمار بيغيه', 'Rolex': 'رولكس',
  'Richard Mille': 'ريشار ميل', 'F.P. Journe': 'إف. بي. جورن', 'H. Moser & Cie': 'إتش. موزر وشركاه',
  'Artisans de Genève': 'أرتيزان دو جنيف', 'Lederer': 'ليديرير'
};
const maison = w => state.ar ? (maisonAr[w.brand] || w.brand) : w.brand;
const reference = w => local(w, 'reference') || w.referenceNumber || '';
const royalImage = w => w.royalImage || w.displayImage;

// ————— language —————
function applyLanguage() {
  const ar = state.ar;
  document.documentElement.lang = ar ? 'ar' : 'en';
  document.documentElement.dir = ar ? 'rtl' : 'ltr';
  $$('[data-ar][data-en]').forEach(el => {
    const v = el.getAttribute(ar ? 'data-ar' : 'data-en');
    if (el.hasAttribute('data-html')) el.innerHTML = v; else el.textContent = v;
  });
  const title = $('title');
  if (title?.dataset.ar) document.title = ar ? title.dataset.ar : title.dataset.en;
  $$('[data-label-ar]').forEach(el => el.setAttribute('aria-label', el.getAttribute(ar ? 'data-label-ar' : 'data-label-en')));
  $$('[data-alt-ar]').forEach(el => el.alt = el.getAttribute(ar ? 'data-alt-ar' : 'data-alt-en'));
  $$('[data-placeholder-ar]').forEach(el => el.placeholder = el.getAttribute(ar ? 'data-placeholder-ar' : 'data-placeholder-en'));
  $$('time[data-year]').forEach(el => el.textContent = ar ? indic(el.dataset.year) : el.dataset.year);
  $$('#lang,#detailLang').forEach(b => {
    b.textContent = ar ? 'EN' : 'عربي';
    b.lang = ar ? 'en' : 'ar';
    b.setAttribute('aria-label', t('lang'));
  });
  syncMenuLabel();
  renderAll();
  if ($('#detail')?.open) renderDetail();
  updateScreenButtons();
  if (page === 'exhibition') showStop(tour.index, false);
}
function changeLanguage() {
  state.ar = !state.ar;
  try { localStorage.setItem('museum-language', state.ar ? 'ar' : 'en'); } catch {}
  applyLanguage();
}

// ————— masthead & menu —————
function setMenu(open) {
  const menu = $('#siteMenu'), btn = $('#menu');
  if (!menu || !btn) return;
  menu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  btn.setAttribute('aria-expanded', String(open));
  syncMenuLabel();
  if (open) menu.querySelector('a')?.focus({ preventScroll: true });
}
function syncMenuLabel() {
  const btn = $('#menu');
  if (btn) btn.setAttribute('aria-label', t(btn.getAttribute('aria-expanded') === 'true' ? 'close' : 'open'));
}
function initMasthead() {
  const head = $('#masthead'), hero = $('.hero');
  if (!head || !hero || !('IntersectionObserver' in window)) { head?.classList.remove('over'); return; }
  new IntersectionObserver(([e]) => head.classList.toggle('over', e.isIntersecting), { rootMargin: '-72px 0px 0px 0px' }).observe(hero);
}

// ————— Ajman time —————
function ajmanNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(new Date());
  const get = k => Number(parts.find(p => p.type === k)?.value || 0);
  return { h: get('hour') % 24, m: get('minute'), s: get('second') };
}
function tickClock() {
  const { h, m, s } = ajmanNow();
  const pad = n => String(n).padStart(2, '0');
  const label = $('#ajmanTime');
  if (label) label.textContent = `${t('ajman')} · ${state.ar ? indic(pad(h) + ':' + pad(m)) : pad(h) + ':' + pad(m)}`;
  const rot = (id, deg) => $(id)?.setAttribute('transform', `rotate(${deg.toFixed(2)} 200 200)`);
  rot('#hourHand', (h % 12) * 30 + m * .5);
  rot('#minuteHand', m * 6 + s * .1);
  rot('#secondHand', s * 6);
}

// ————— cards —————
function royalFigure(w, { lot = false, loading = 'lazy' } = {}) {
  const n = state.all.indexOf(w) + 1;
  return `<figure class="royal">${lot ? `<span class="lot" dir="ltr">${state.ar ? indic(String(n).padStart(2, '0')) : String(n).padStart(2, '0')}</span>` : ''}<img src="${esc(royalImage(w))}" alt="${esc(t('royalAlt')(local(w, 'name')))}" width="800" height="800" loading="${loading}" decoding="async"></figure>`;
}
function card(w, opts = {}) {
  return `<article class="piece${opts.reveal ? ' reveal' : ''}"><button type="button" class="card" data-watch="${esc(w.slug)}" aria-label="${esc(t('explore') + ' — ' + local(w, 'name'))}">${royalFigure(w, { lot: opts.lot, loading: opts.loading })}<div class="meta"><span class="maison">${esc(maison(w))}</span><h3>${esc(local(w, 'name'))}</h3><span class="ref" dir="ltr">${esc(reference(w))}</span><span class="discover">${esc(t('explore'))}</span></div></button></article>`;
}
const bySlug = slug => state.all.find(w => w.slug === slug);
const FEATURED = ['rolex-6100-chinese-dragon-cloisonne', 'patek-philippe-perpetual-calendar-5270p-green', 'patek-philippe-nautilus-perpetual-calendar-5740'];
const HOME_SIX = ['rolex-daytona-6263-quraysh-hawk', 'fp-journe-tourbillon-souverain', 'patek-philippe-perpetual-calendar-5271p-blue-sapphire', 'audemars-piguet-royal-oak-flying-tourbillon-salmon-26522ce', 'fp-journe-chronometre-a-resonance-platinum-grey', 'richard-mille-rm-26-02-tourbillon-evil-eye'];

function renderFeatured() {
  const grid = $('#featuredGrid');
  if (!grid || state.loading) return;
  grid.innerHTML = FEATURED.map(bySlug).filter(Boolean).map(w => card(w, { loading: 'eager' })).join('');
  grid.setAttribute('aria-busy', 'false');
}
function renderFilters() {
  const box = $('#filters');
  if (!box) return;
  const brands = ['all', ...new Set(state.all.map(w => w.brand))];
  box.innerHTML = brands.map(b => `<button type="button" class="filter" data-brand="${esc(b)}" aria-pressed="${state.filter === b}">${esc(b === 'all' ? t('all') : (state.ar ? maisonAr[b] || b : b))}</button>`).join('');
}
function renderGrid() {
  const grid = $('#grid');
  if (!grid) return;
  if (state.loading) return;
  const q = state.query.toLocaleLowerCase().trim();
  state.list = state.all.filter(w => (state.filter === 'all' || w.brand === state.filter) &&
    (!q || [w.nameAr, w.nameEn, w.referenceNumber, w.brand, maisonAr[w.brand]].join(' ').toLocaleLowerCase().includes(q)));
  const shown = page === 'home' ? HOME_SIX.map(bySlug).filter(Boolean) : state.list;
  if (page === 'home') state.list = shown;
  grid.setAttribute('aria-busy', 'false');
  grid.innerHTML = state.error ? `<p class="empty">${esc(t('failure'))}</p>`
    : shown.length ? shown.map(w => card(w, { lot: page === 'collection' })).join('') : `<p class="empty">${esc(t('empty'))}</p>`;
  const count = $('#resultCount');
  if (count) count.textContent = state.error ? '' : state.ar ? indic(t('count')(state.list.length, state.all.length)) : t('count')(state.list.length, state.all.length);
  const retry = $('#retry');
  if (retry) retry.hidden = !state.error;
}
function renderMaisons() {
  const list = $('#maisons');
  if (!list || state.loading) return;
  list.innerHTML = [...new Set(state.all.map(w => w.brand))].map(b => `<li>${esc(state.ar ? maisonAr[b] || b : b)}</li>`).join('');
}
function renderAll() {
  renderFilters(); renderGrid(); renderFeatured(); renderMaisons(); buildFrames();
  observeReveals();
}

// ————— detail sheet —————
const COMPLICATIONS = [
  ['chronograph', 'Chronograph', 'الكرونوغراف', /chronograph|كرونوغراف/],
  ['tourbillon', 'Tourbillon', 'التوربيون', /tourbillon|توربيون/],
  ['dual-time', 'Dual Time & GMT', 'التوقيت المزدوج وGMT', /dual time|gmt|التوقيت المزدوج/],
  ['perpetual-calendar', 'Perpetual Calendar', 'التقويم الدائم', /perpetual calendar|تقويم دائم|التقويم الدائم/],
  ['minute-repeater', 'Minute Repeater', 'مُكرِّر الدقائق', /minute repeater|مكرر الدقائق|مُكرِّر الدقائق|مكرّر/],
  ['rattrapante', 'Split-seconds Chronograph / Rattrapante', 'كرونوغراف الثواني المنقسمة / راترابانت', /split-seconds|rattrapante|المنقسمة|راترابانت/],
  ['world-time', 'World Time', 'التوقيت العالمي', /world time|التوقيت العالمي/],
  ['flyback', 'Flyback Chronograph', 'كرونوغراف فلاي باك', /flyback|فلاي باك/],
  ['moon-phase', 'Moon-phase Indication', 'مؤشر أطوار القمر', /moon ?phase|أطوار القمر/]
];
function complicationLinks(w) {
  const raw = [w.nameEn, w.complicationsEn, w.complicationsAr, w.movementEn, w.movement].flat().filter(Boolean).join(' ').toLowerCase();
  const hits = COMPLICATIONS.filter(c => c[3].test(raw));
  return hits.length ? `<div class="guide-tags complication-guide-tags">${hits.map(([id, en, ar]) => `<a href="/watchmaking/#complication-${id}">${esc(state.ar ? ar : en)}</a>`).join('')}</div>` : '';
}
function normaliseEnglish(v) {
  return String(v).replace(/\bCaliber\b/g, 'Calibre').replace(/\bAutomatic Chronograph\b/gi, 'Self-winding chronograph')
    .replace(/\bAutomatic\b/gi, 'Self-winding').replace(/\bManual Chronograph\b/gi, 'Manual-winding chronograph')
    .replace(/\bManual Tourbillon\b/gi, 'Manual-winding tourbillon').replace(/\bManual\b(?=\s+[A-Z0-9])/g, 'Manual-winding')
    .replace(/\bSplit Seconds\b/gi, 'Split-seconds').replace(/power-reserve/gi, 'power reserve');
}
const materialAr = { 'Platinum': 'بلاتين', 'White Gold': 'ذهب أبيض', '18k White Gold': 'ذهب أبيض عيار 18', 'Stainless Steel': 'فولاذ مقاوم للصدأ', 'Steel': 'فولاذ', 'Titanium': 'تيتانيوم', 'White Ceramic': 'سيراميك أبيض', 'Blue Ceramic': 'سيراميك أزرق', 'Sapphire': 'ياقوت صناعي', 'Yellow Gold': 'ذهب أصفر', 'Carbon': 'كربون' };
function normaliseArabic(v) {
  return String(v).replace(/,\s*/g, '، ').replace(/;\s*/g, ' · ').replace(/(\d(?:\.\d+)?)مم/g, '$1 مم')
    .replace(/^ذاتية التعبئة$/, 'حركة ذاتية التعبئة').replace(/^يدوية التعبئة$/, 'حركة يدوية التعبئة')
    .replace(/مكرر الدقائق|مكرّر الدقائق/g, 'مُكرِّر الدقائق');
}
function spec(w, k) {
  let v = k === 'yearReleased' ? (local(w, 'yearLabel') || w.yearReleased) : local(w, k);
  if (!v) return '';
  if (Array.isArray(v)) v = v.join(' · ');
  if (k === 'yearReleased') return state.ar ? indic(v) : String(v);
  return state.ar ? normaliseArabic(materialAr[v] || v) : normaliseEnglish(v);
}
function renderDetail() {
  const w = state.selected;
  if (!w) return;
  const i = state.list.indexOf(w);
  const specs = ['reference', 'material', 'caseSize', 'movement', 'powerReserve', 'complications', 'yearReleased']
    .map(k => [k, k === 'reference' ? reference(w) : spec(w, k)]).filter(([, v]) => v);
  $('#detailContent').innerHTML = `<div class="sheet-layout">
<div class="sheet-visual"><div><button type="button" id="zoom" class="zoom" aria-pressed="false" aria-label="${esc(t('zoom'))}"><img src="${esc(royalImage(w))}" alt="${esc(t('royalAlt')(local(w, 'name')))}" width="800" height="800"></button><p class="zoom-hint">${esc(t('zoomHint'))}</p></div></div>
<div class="sheet-copy">
<span class="maison">${esc(maison(w))}</span>
<h2 id="detailTitle" tabindex="-1">${esc(local(w, 'name'))}</h2>
<span class="ref" dir="ltr">${esc(reference(w))}</span>
<p class="pairing">${esc(t(w.royalPairing === 'portrait' ? 'pairedPortrait' : 'pairedPhotograph'))}</p>
<p class="label story-label detail-kicker">${esc(t('editorialRecord'))}</p>
<p class="story description">${esc(local(w, 'editorial') || local(w, 'description'))}</p>
<h3 class="specs-title detail-tech-title">${esc(t('technicalRecord'))}</h3>
<dl class="specs">${specs.map(([k, v]) => `<div><dt>${esc(t(k))}</dt><dd${k === 'reference' ? ' dir="ltr"' : ''}>${esc(v)}</dd></div>`).join('')}</dl>
${complicationLinks(w)}
<p style="margin-top:2rem"><a class="link" href="/watchmaking/#complications"><span>${esc(t('understandCraft'))}</span><span class="arrow" aria-hidden="true">→</span></a></p>
</div></div>`;
  const pos = $('#detailPosition');
  pos.textContent = state.ar ? `${indic(i + 1)} / ${indic(state.list.length)}` : `${i + 1} / ${state.list.length}`;
  $('#detailPrev').disabled = i <= 0;
  $('#detailNext').disabled = i < 0 || i >= state.list.length - 1;
  const zoom = $('#zoom');
  zoom.onclick = e => {
    const on = zoom.getAttribute('aria-pressed') !== 'true';
    if (on && e.clientX) {
      const r = zoom.getBoundingClientRect();
      zoom.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100) + '%');
      zoom.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100) + '%');
    }
    zoom.setAttribute('aria-pressed', String(on));
    zoom.setAttribute('aria-label', t(on ? 'zoomOut' : 'zoom'));
  };
}
function openDetail(w) {
  if (!w) return;
  if (!state.list.includes(w)) state.list = state.all;
  state.selected = w;
  renderDetail();
  const d = $('#detail');
  if (!d.open) d.showModal();
  $('#detailBody').scrollTop = 0;
  $('#detailTitle').focus({ preventScroll: true });
}
function stepDetail(n) {
  const next = state.list[state.list.indexOf(state.selected) + n];
  if (next) openDetail(next);
}
function initDetail() {
  const d = $('#detail');
  if (!d) return;
  $('#detailClose').onclick = () => d.close();
  $('#detailLang').onclick = changeLanguage;
  $('#detailPrev').onclick = () => stepDetail(-1);
  $('#detailNext').onclick = () => stepDetail(1);
  d.addEventListener('close', () => {
    const slug = state.selected?.slug;
    state.selected = null;
    $$('[data-watch]').find(el => el.dataset.watch === slug)?.focus({ preventScroll: true });
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-watch]');
    if (b) openDetail(bySlug(b.dataset.watch));
  });
}

// ————— screening room —————
// A projection of photographs of His Highness: never a third-party reel, never
// player chrome. One trigger, then a discreet pause and a way out.
const FRAMES = [
  { img: '/images/sheikh/sheikh-portrait-1.webp', ar: 'من عجمان تبدأ الحكاية.', en: 'The story begins in Ajman.' },
  { slug: 'rolex-daytona-6263-quraysh-hawk', ar: 'صقر قريش على ميناء دايتونا — أثرٌ من التاريخ على المعصم.', en: 'The Hawk of Quraysh on a Daytona dial — history, worn on the wrist.' },
  { slug: 'fp-journe-tourbillon-souverain', ar: 'توربيونٌ يدور على مرأى العين، إلى جانب ميناءٍ من اليشم.', en: 'A tourbillon turning in plain sight beside a jade dial.' },
  { slug: 'patek-philippe-perpetual-calendar-5270p-green', ar: 'تقويمٌ دائم وكرونوغراف، في أخضرٍ عميق.', en: 'A perpetual calendar and chronograph, in deep green.' },
  { slug: 'audemars-piguet-royal-oak-flying-tourbillon-salmon-26522ce', ar: 'رويال أوك بتوربيون طائر، على ميناءٍ بلون السلمون.', en: 'A Royal Oak flying tourbillon on a salmon dial.' },
  { slug: 'rolex-6100-chinese-dragon-cloisonne', ar: 'تنّينٌ من المينا الزجاجية — من أندر ما صنعت رولكس.', en: 'A dragon in cloisonné enamel — among the rarest Rolex ever made.' },
  { img: '/images/sheikh-examining-watches.webp', ar: 'للوقت قدر. وللساعات حكاية.', en: 'Time has its measure. Every timepiece, its story.' }
];
const screen = { i: 0, playing: false, timer: null };
function buildFrames() {
  const box = $('#frames');
  if (!box || box.childElementCount || state.loading || !state.all.length) return;
  box.innerHTML = FRAMES.map((f, i) => {
    const src = f.img || royalImage(bySlug(f.slug) || {}) || '';
    return `<div class="frame${i === 0 ? ' on' : ''}"><img class="fill" src="${esc(src)}" alt="" loading="lazy"><img class="still" src="${esc(src)}" alt="" loading="lazy" width="800" height="800"></div>`;
  }).join('');
}
function showFrame(i) {
  screen.i = i;
  $$('#frames .frame').forEach((f, n) => f.classList.toggle('on', n === i));
  const line = $('#screenLine'), f = FRAMES[i];
  if (line) { line.textContent = state.ar ? f.ar : f.en; line.dataset.ar = f.ar; line.dataset.en = f.en; }
  const bar = $('#screenProgress');
  if (bar) bar.style.width = ((i + 1) / FRAMES.length * 100) + '%';
}
function updateScreenButtons() {
  const b = $('#screenPause');
  if (!b) return;
  const paused = $('#screen').classList.contains('paused');
  b.setAttribute('aria-pressed', String(paused));
  const span = b.querySelector('span');
  span.dataset.ar = paused ? words.ar.resume : words.ar.pause;
  span.dataset.en = paused ? words.en.resume : words.en.pause;
  span.textContent = state.ar ? span.dataset.ar : span.dataset.en;
}
function runScreen() {
  clearInterval(screen.timer);
  screen.timer = setInterval(() => {
    if (document.hidden) return;
    if (screen.i >= FRAMES.length - 1) return endScreen();
    showFrame(screen.i + 1);
  }, 6000);
}
function endScreen() {
  clearInterval(screen.timer);
  const s = $('#screen');
  s.classList.remove('playing', 'paused');
  $('#film').classList.remove('playing', 'paused');
  screen.playing = false;
  showFrame(0);
  $('#screenPlay').focus({ preventScroll: true });
}
function initScreen() {
  const s = $('#screen');
  if (!s) return;
  $('#screenPlay').onclick = () => {
    s.classList.add('playing'); s.classList.remove('paused');
    $('#film').classList.add('playing'); $('#film').classList.remove('paused');
    screen.playing = true; showFrame(0); runScreen(); updateScreenButtons();
    $('#screenPause').focus({ preventScroll: true });
  };
  $('#screenPause').onclick = () => {
    const paused = !s.classList.contains('paused');
    s.classList.toggle('paused', paused); s.classList.toggle('playing', !paused);
    $('#film').classList.toggle('paused', paused); $('#film').classList.toggle('playing', !paused);
    if (paused) clearInterval(screen.timer); else runScreen();
    updateScreenButtons();
  };
  $('#screenStop').onclick = endScreen;
}

// ————— exhibition —————
const STOPS = [
  { slug: 'rolex-daytona-6263-quraysh-hawk', chapterAr: 'أثر التاريخ', chapterEn: 'The imprint of history',
    ar: 'ميناءٌ لا تخطئه العين: صقر قريش، شعار الدولة، على كرونوغراف دايتونا من سبعينيات القرن الماضي.',
    en: 'A dial of unmistakable character: the Hawk of Quraysh, emblem of the nation, on a Daytona chronograph of the 1970s.' },
  { slug: 'fp-journe-tourbillon-souverain', chapterAr: 'خيال الحركة', chapterEn: 'Mechanical imagination',
    ar: 'توربيونٌ يدور على مرأى العين، إلى جانب ميناءٍ من اليشم الأخضر؛ هندسةٌ تُرى قبل أن تُفهم.',
    en: 'A tourbillon turning in plain sight beside a green jade dial: engineering you see before you understand it.' },
  { slug: 'richard-mille-rm-26-02-tourbillon-evil-eye', chapterAr: 'جرأة الرمز', chapterEn: 'The daring of symbol',
    ar: 'عينٌ ولهبٌ منحوتان تحت زجاج توربيون يدوي التعبئة من ريشار ميل؛ جرأةٌ في المادة والرمز معاً.',
    en: 'An eye and a flame sculpted beneath the crystal of a hand-wound Richard Mille tourbillon: daring in material and symbol alike.' }
];
const tour = { index: 0, timer: null };
function showStop(i, updateHash = true) {
  if (!state.all.length) return;
  tour.index = (i + STOPS.length) % STOPS.length;
  const stop = STOPS[tour.index], w = bySlug(stop.slug);
  if (!w) return;
  const img = $('#tourImage');
  img.src = royalImage(w);
  img.alt = t('royalAlt')(local(w, 'name'));
  $('#tourChapter').textContent = state.ar ? stop.chapterAr : stop.chapterEn;
  $('#tourBrand').textContent = maison(w);
  $('#tourName').textContent = local(w, 'name');
  $('#tourRef').textContent = reference(w);
  $('#tourText').textContent = state.ar ? stop.ar : stop.en;
  $('#tourCount').textContent = state.ar ? `${indic(tour.index + 1)} / ${indic(STOPS.length)}` : `${tour.index + 1} / ${STOPS.length}`;
  $('#tourPrev').disabled = tour.index === 0;
  $('#tourNext').disabled = tour.index === STOPS.length - 1;
  $('#tourDots').innerHTML = STOPS.map((s, n) => `<button type="button" aria-label="${esc(local(bySlug(s.slug) || {}, 'name'))}" aria-current="${n === tour.index}" data-stop="${n}"></button>`).join('');
  const play = $('#tourPlay'), playing = !!tour.timer;
  play.setAttribute('aria-pressed', String(playing));
  const span = play.querySelector('span');
  span.dataset.ar = playing ? words.ar.tourPause : words.ar.tourPlay;
  span.dataset.en = playing ? words.en.tourPause : words.en.tourPlay;
  span.textContent = state.ar ? span.dataset.ar : span.dataset.en;
  if (updateHash) history.replaceState(null, '', '#' + stop.slug);
}
function initExhibition() {
  if (page !== 'exhibition') return;
  const stopTour = () => { clearInterval(tour.timer); tour.timer = null; };
  $('#tourPrev').onclick = () => { stopTour(); showStop(tour.index - 1); };
  $('#tourNext').onclick = () => { stopTour(); showStop(tour.index + 1); };
  $('#tourDots').onclick = e => { const b = e.target.closest('[data-stop]'); if (b) { stopTour(); showStop(Number(b.dataset.stop)); } };
  $('#tourDetail').onclick = () => { state.list = STOPS.map(s => bySlug(s.slug)).filter(Boolean); openDetail(bySlug(STOPS[tour.index].slug)); };
  $('#tourPlay').onclick = () => {
    if (tour.timer) { stopTour(); showStop(tour.index, false); return; }
    tour.timer = setInterval(() => { if (!document.hidden && !$('#detail').open) showStop(tour.index + 1); }, 7000);
    showStop(0);
  };
}
function exhibitionStartIndex() {
  const hash = decodeURIComponent(location.hash.slice(1));
  const i = STOPS.findIndex(s => s.slug === hash);
  return i < 0 ? 0 : i;
}

// ————— scroll reveals —————
let revealObserver;
function observeReveals() {
  const els = $$('.reveal:not(.seen)');
  if (!('IntersectionObserver' in window) || reduceMotion()) { els.forEach(e => e.classList.add('seen')); return; }
  revealObserver ||= new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('seen'); revealObserver.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach(e => revealObserver.observe(e));
}

// ————— data —————
async function load() {
  state.loading = true; state.error = false;
  const grid = $('#grid'), retry = $('#retry');
  if (grid) { grid.setAttribute('aria-busy', 'true'); grid.innerHTML = `<p class="status">${esc(t('loading'))}</p>`; }
  if (retry) retry.hidden = true;
  try {
    const r = await fetch('/watches.json');
    if (!r.ok) throw Error('load');
    const d = await r.json();
    // Pieces photographed with His Highness lead; portrait pairings follow.
    state.all = d.watches.slice().sort((a, b) => Number(a.royalPairing === 'portrait') - Number(b.royalPairing === 'portrait') || (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
    state.list = state.all;
    state.loading = false;
  } catch {
    state.loading = false; state.error = true;
  }
  renderAll();
  if (page === 'exhibition') showStop(exhibitionStartIndex(), false);
}

// ————— wiring —————
$('#lang')?.addEventListener('click', changeLanguage);
$('#menu')?.addEventListener('click', () => setMenu($('#menu').getAttribute('aria-expanded') !== 'true'));
$('#siteMenu')?.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
$('#filters')?.addEventListener('click', e => {
  const b = e.target.closest('[data-brand]');
  if (!b) return;
  state.filter = b.dataset.brand; renderFilters(); renderGrid();
});
$('#search')?.addEventListener('input', e => { state.query = e.target.value; renderGrid(); });
$('#retry')?.addEventListener('click', load);
document.addEventListener('keydown', e => {
  const d = $('#detail');
  if (e.key === 'Escape' && $('#menu')?.getAttribute('aria-expanded') === 'true') { setMenu(false); $('#menu').focus(); }
  if (d?.open && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
    e.preventDefault();
    stepDetail((e.key === 'ArrowRight' ? 1 : -1) * (state.ar ? -1 : 1));
  }
  if (d?.open && e.key === 'Escape') d.close();
});
document.addEventListener('error', e => {
  const img = e.target;
  if (img.tagName === 'IMG' && img.closest('.royal,.zoom')) {
    img.hidden = true;
    const note = document.createElement('span');
    note.className = 'status'; note.textContent = t('image');
    img.after(note);
  }
}, true);

initMasthead();
initDetail();
initScreen();
initExhibition();
applyLanguage();
tickClock();
setInterval(tickClock, 1000);
if (!$('#grid') && !$('#featuredGrid') && !$('#frames') && page !== 'exhibition') state.loading = false;
else load();
