'use strict';
// Sheikh Ammar bin Humaid Al Nuaimi — the horological collection. One runtime for every page.
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
    tmNow: 'الآن — بتوقيت عجمان', tmUndated: 'بلا عام طرح موثّق', tmThisYear: 'طُرح طرازها في هذا العام',
    tmNone: 'لا قطعة في المجموعة طُرح طرازها في هذا العقد.', tmUndatedNote: 'قطعٌ لم يُسجَّل عام طرح طرازها في سجل المجموعة.',
    tmCount: n => n === 1 ? 'قطعة واحدة' : n === 2 ? 'قطعتان' : n <= 10 ? `${indic(n)} قطع` : `${indic(n)} قطعة`,
    tmValue: (y, era, n) => `${indic(y)} — ${era}، ${n}`,
    craftGuide: 'تأمّل القطعة',
    image: 'تعذّر عرض الصورة', ajman: 'الوقت في عجمان',
    invite: n => `بدعوةٍ خاصة · ${n}`, edition: n => `نسخةٌ خاصة، أُعدّت خصيصاً · ${n}`,
    todayOf: (h, g) => `${h} — ${g}`, dialOpen: 'اكتشف القطعة', dialYear: 'عام الطراز'
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
    tmNow: 'Now — Ajman time', tmUndated: 'Undated', tmThisYear: 'Model introduced this year',
    tmNone: 'No piece in the collection was introduced in this decade.', tmUndatedNote: 'Pieces whose model year is not recorded in the collection ledger.',
    tmCount: n => n === 1 ? 'one piece' : `${n} pieces`,
    tmValue: (y, era, n) => `${y} — ${era}, ${n}`,
    craftGuide: 'Look closer',
    image: 'Image unavailable', ajman: 'Time in Ajman',
    invite: n => `A private invitation · ${n}`, edition: n => `A private edition, prepared for ${n}`,
    todayOf: (h, g) => `${h} — ${g}`, dialOpen: 'Discover the timepiece', dialYear: 'Model year'
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
  tickClock();
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
const fmt = (opts, cal = '') => new Intl.DateTimeFormat((state.ar ? 'ar-AE-u-nu-arab' : 'en-GB') + (cal ? (state.ar ? '-ca-' : '-u-ca-') + cal : ''), { timeZone: 'Asia/Dubai', ...opts });
function datesToday() {
  const now = new Date();
  return {
    hijri: fmt({ day: 'numeric', month: 'long', year: 'numeric' }, 'islamic-umalqura').format(now),
    greg: fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now)
  };
}
function tickClock() {
  const { h, m, s } = ajmanNow();
  const band = $('#bandTime');
  if (band) {
    const pad2 = n => String(n).padStart(2, '0'), text = `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
    band.textContent = state.ar ? indic(text) : text;
    band.dateTime = text;
    if (!band.dataset.lang || band.dataset.lang !== String(state.ar) || s === 0) {
      const d = datesToday();
      $('#bandHijri').textContent = d.hijri;
      $('#bandDate').textContent = d.greg;
      band.dataset.lang = String(state.ar);
    }
  }
  const pad = n => String(n).padStart(2, '0');
  const label = $('#ajmanTime');
  if (label) label.textContent = `${t('ajman')} · ${state.ar ? indic(pad(h) + ':' + pad(m)) : pad(h) + ':' + pad(m)}`;
  // under reduced motion the time machine's hands step once a second from here
  if (reduceMotion() && !TM.travelling) tmLive();
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
document.addEventListener('click', e => {
  const b = e.target.closest('[data-open-slug]');
  if (!b) return;
  const slugs = [...document.querySelectorAll('[data-open-slug]')].map(x => x.dataset.openSlug);
  const w = bySlug(b.dataset.openSlug);
  if (w) { state.list = slugs.map(bySlug).filter(Boolean); openDetail(w); }
});
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
  renderFilters(); renderGrid(); renderFeatured(); renderMaisons(); buildFrames(); buildReel(); renderToday(); renderDial(); renderGuest(); renderTimeMachine(); renderCrowns(); renderHotspotNumbers();
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
<dl class="specs">${specs.map(([k, v]) => `<div><dt>${esc(t(k))}</dt><dd${k === 'reference' ? ' dir="ltr"' : ''}>${esc(k === 'reference' || !state.ar ? v : indic(v))}</dd></div>`).join('')}</dl>
${complicationLinks(w)}
<p style="margin-top:2rem"><a class="link" href="/watchmaking/#complications"><span>${esc(t('understandCraft'))}</span><span class="arrow" aria-hidden="true">→</span></a></p>
</div></div>`;
  const pos = $('#detailPosition');
  pos.textContent = state.ar ? `${indic(i + 1)} / ${indic(state.list.length)}` : `${i + 1} / ${state.list.length}`;
  $('#detailPrev').disabled = i <= 0;
  $('#detailNext').disabled = i < 0 || i >= state.list.length - 1;
  const zoom = $('#zoom');
  attachLoupe(zoom);
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
  if (!d.open) { state.opener = document.activeElement; d.showModal(); }
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
    const back = state.opener?.isConnected && state.opener !== document.body ? state.opener : $$('[data-watch]').find(el => el.dataset.watch === slug);
    state.opener = null;
    back?.focus({ preventScroll: true });
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

// ————— collection reel: photography in motion, ambient, no controls —————
// Plain images only, crossfading on their own above the collection — the royal
// photographs already on the page, nothing streamed and no player chrome.
// Freezes on its first frame under prefers-reduced-motion, like every other
// autoplay on this site.
const REEL_FRAMES = [
  { slug: 'rolex-daytona-6263-quraysh-hawk', ar: 'قطعةٌ يتحدّث عنها هواة الساعات حيث اجتمعوا — صقر قريش، نادرًا ما يُرى خارج صالات المزادات.', en: 'A piece collectors speak of wherever they gather — the Hawk of Quraysh, rarely seen outside an auction room.' },
  { slug: 'fp-journe-chronometre-a-resonance-platinum-grey', ar: 'من الساعات التي يعرفها الهواة بالاسم قبل أن يروها — والآن، على معصم سموّه.', en: 'A watch connoisseurs know by name before they ever see one — and here, on His Highness’s wrist.' },
  { slug: 'richard-mille-rm-68-01-tourbillon-cyril-kongo', ar: 'عملٌ فنيٌّ بقدر ما هو آلة، اختاره سموّه لأن الصنعة عنده لا تقلّ عن الفن.', en: 'As much artwork as mechanism — chosen because, to His Highness, craft and art ask the same standard.' },
  { slug: 'audemars-piguet-royal-oak-flying-tourbillon-salmon-26522ce', ar: 'توربيونٌ طائر يتابعه الهواة بإعجاب — واحدةٌ من قِلّة حول العالم.', en: 'A flying tourbillon collectors follow with real admiration — one of very few in the world.' },
  { slug: 'fp-journe-chronographe-monopoussoir-rattrapante-titanium', ar: 'إضافةٌ حديثة إلى المجموعة، توثّق ذائقةً لا تتوقف عن الاكتشاف.', en: 'A recent addition to the collection — proof that this eye for craft never stops looking.' },
  { slug: 'rolex-6100-chinese-dragon-cloisonne', ar: 'من أندر ما صنعت رولكس على الإطلاق — قطعةٌ يحلم بها كثيرون، وامتلكها القليل.', en: 'Among the rarest pieces Rolex ever made — a piece many dream of, and very few have owned.' }
];
const reel = { i: 0, timer: null };
function showReelFrame(i) {
  reel.i = i;
  $$('#reelFrames .frame').forEach((f, n) => f.classList.toggle('on', n === i));
  const cap = $('#reelCaption'), f = REEL_FRAMES[i];
  if (cap) { cap.textContent = state.ar ? f.ar : f.en; cap.dataset.ar = f.ar; cap.dataset.en = f.en; }
}
function runReel() {
  clearInterval(reel.timer);
  reel.timer = setInterval(() => {
    if (document.hidden) return;
    showReelFrame((reel.i + 1) % REEL_FRAMES.length);
  }, 6500);
}
function buildReel() {
  const box = $('#reelFrames');
  if (!box || box.childElementCount || state.loading || !state.all.length) return;
  box.innerHTML = REEL_FRAMES.map((f, i) => {
    const src = royalImage(bySlug(f.slug) || {}) || '';
    return `<div class="frame${i === 0 ? ' on' : ''}"><img src="${esc(src)}" alt="" loading="${i === 0 ? 'eager' : 'lazy'}" width="800" height="800"></div>`;
  }).join('');
  showReelFrame(0);
  if (!reduceMotion()) runReel();
}

// ————— watchmaking: the anatomy stage —————
// A still illustration that turns to its caseback for the six parts only visible
// there. Not any one maison's watch — plain SVG line art, the same technique as
// the live dial above it. No 3D engine, no new dependency.
const STAGE_BACK_PARTS = new Set(['calibre', 'escapement', 'balance', 'barrel', 'rotor', 'bridges']);
function initAnatomyStage() {
  const stage = $('#watchStage'), grid = $('#anatomyGrid'), inner = $('#stageInner'), caption = $('#stageCaption');
  if (!stage || !grid || !inner) return;
  let w3d = null;
  const choose = btn => {
    const part = btn.dataset.part, n = Number(btn.dataset.n);
    w3d?.select(part);
    $$('.anatomy-card').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    stage.classList.add('picked');
    stage.querySelectorAll('.part,.hotspot').forEach(g => g.classList.toggle('hl', g.dataset.part === part));
    inner.classList.toggle('flipped', STAGE_BACK_PARTS.has(part));
    const h3 = btn.querySelector('h3'), para = btn.querySelector('p'), label = btn.querySelector('.num');
    if (caption && h3) {
      // the callout: the card's own N°, the part, and what it does — kept in step with the language switch
      const html = (num, title, text) => `<span class="callout-n">${esc(num)}</span><b class="callout-title">${esc(title)}</b><span class="callout-text">${esc(text)}</span>`;
      caption.setAttribute('data-html', '');
      caption.dataset.ar = html(label?.dataset.ar || indic(n), h3.dataset.ar, para?.dataset.ar || '');
      caption.dataset.en = html(label?.dataset.en || 'N° ' + n, h3.dataset.en, para?.dataset.en || '');
      caption.innerHTML = state.ar ? caption.dataset.ar : caption.dataset.en;
    }
  };
  grid.addEventListener('click', e => { const btn = e.target.closest('.anatomy-card'); if (btn) choose(btn); });
  // the numbered hotspots on the drawing choose the same part as its card
  stage.addEventListener('click', e => {
    const hot = e.target.closest('.hotspot');
    const btn = hot && grid.querySelector(`.anatomy-card[data-part="${hot.dataset.part}"]`);
    if (btn) choose(btn);
  });
  // the 3D watch: fetched only here, only with WebGL, only as the stage nears the screen
  if (!window.WebGL2RenderingContext || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => {
    if (!entries.some(e => e.isIntersecting)) return;
    io.disconnect();
    import('/watch3d.js').then(m => {
      w3d = m.mount(stage, {
        reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
        onPick: part => { const btn = grid.querySelector(`.anatomy-card[data-part="${part}"]`); if (btn) choose(btn); }
      });
      const sel = grid.querySelector('.anatomy-card[aria-pressed="true"]');
      if (sel) w3d.select(sel.dataset.part);
    }).catch(() => stage.classList.remove('has-3d'));
  }, { rootMargin: '600px 0px' });
  io.observe(stage);
}
function renderHotspotNumbers() {
  $$('.hotspot text[data-num]').forEach(el => { el.textContent = state.ar ? indic(el.dataset.num) : el.dataset.num; });
}

// ————— the crown pieces: six kinds of rarity, each named by the ledger's own record —————
const CROWNS = [
  { slug: 'rolex-6100-chinese-dragon-cloisonne', ar: 'ندرة البقاء', en: 'The rarity of survival' },
  { slug: 'rolex-daytona-6263-quraysh-hawk', ar: 'ندرة الرمز', en: 'The rarity of an emblem' },
  { slug: 'patek-philippe-minute-repeater-tourbillon-3939hp', ar: 'ندرة الآلية', en: 'The rarity of a mechanism' },
  { slug: 'fp-journe-ffc-francis-ford-coppola-calibre-13003', ar: 'ندرة اليد', en: 'The rarity of a hand' },
  { slug: 'richard-mille-rm-68-01-tourbillon-cyril-kongo', ar: 'ندرة الفن', en: 'The rarity of art' },
  { slug: 'patek-philippe-nautilus-5711-1300a-olive-green', ar: 'ندرة الخاتمة', en: 'The rarity of an ending' }
];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
function renderCrowns() {
  const list = $('#crownPieces');
  if (!list || state.loading) return;
  list.innerHTML = CROWNS.map((c, i) => {
    const w = bySlug(c.slug);
    if (!w) return '';
    const src = esc(royalImage(w)), year = w.yearReleased ? tmNum(w.yearReleased) : local(w, 'yearLabel');
    const pairing = w.royalPairing === 'portrait' ? t('pairedPortrait') : t('pairedPhotograph');
    return `<li class="crown reveal" style="--i:${i}">
<button type="button" class="crown-stage" data-watch="${esc(w.slug)}" aria-label="${esc(t('explore') + ' — ' + local(w, 'name'))}">
<span class="crown-num" aria-hidden="true">${state.ar ? indic(i + 1) : ROMAN[i]}</span>
<span class="crown-figure"><img src="${src}" alt="${esc(t('royalAlt')(local(w, 'name')))}" width="800" height="800" loading="lazy" decoding="async"><span class="crown-liquid" aria-hidden="true" style="background-image:url('${src}')"></span></span><svg class="crown-frame" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect x=".5" y=".5" width="99" height="99" pathLength="1"/></svg>
</button>
<div class="crown-words"><p class="crown-kind">${esc(state.ar ? c.ar : c.en)}</p><h3>${esc(local(w, 'name'))}</h3><p class="crown-meta"><span>${esc(maison(w))}</span><span dir="ltr">${esc(year)}</span></p><p class="crown-line">${esc(local(w, 'editorial'))}</p><p class="crown-pairing">${esc(pairing)}</p></div>
</li>`;
  }).join('');
  list.setAttribute('aria-busy', 'false');
}

// ————— the films: the collection through the media's lens —————
// Nothing from the video host loads until a visitor asks for the film. Our poster, our
// controls; the host's own titles and chrome sit outside the frame we show.
const FILM_API = 'https://www.youtube.com/iframe_api', FILM_HOST = 'https://www.youtube-nocookie.com';
let filmApi = null;
function loadFilmApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  return filmApi ||= new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previous?.(); resolve(window.YT); };
    const tag = document.createElement('script');
    tag.src = FILM_API; tag.async = true;
    tag.onerror = () => { filmApi = null; reject(Error('film')); };
    document.head.append(tag);
  });
}
const filmWords = { ar: { play: 'تشغيل', pause: 'إيقاف مؤقت', mute: 'كتم الصوت', unmute: 'تشغيل الصوت', close: 'إغلاق الفيلم', failed: 'تعذّر تشغيل الفيلم الآن. يُرجى المحاولة لاحقاً.' },
  en: { play: 'Play', pause: 'Pause', mute: 'Mute', unmute: 'Sound on', close: 'Close the film', failed: 'The film could not be played just now. Please try again later.' } };
const fw = k => filmWords[state.ar ? 'ar' : 'en'][k];
function closeFilm(fig) {
  fig._player?.destroy?.(); fig._player = null;
  fig.classList.remove('playing', 'loading');
  fig.querySelector('.film-stage')?.remove();
  fig.querySelector('.film-bar')?.remove();
  fig.querySelector('.film-play')?.focus({ preventScroll: true });
}
async function playFilm(fig) {
  if (fig.classList.contains('playing') || fig.classList.contains('loading')) return;
  $$('.film.playing').forEach(closeFilm);
  fig.classList.add('loading');
  const frame = fig.querySelector('.film-frame');
  const stage = document.createElement('div'); stage.className = 'film-stage';
  const mount = document.createElement('div'); stage.append(mount); frame.append(stage);
  const bar = document.createElement('div'); bar.className = 'film-bar';
  bar.innerHTML = `<button type="button" data-film-act="toggle" aria-pressed="false">${esc(fw('pause'))}</button><button type="button" data-film-act="mute" aria-pressed="false">${esc(fw('mute'))}</button><button type="button" data-film-act="close">${esc(fw('close'))}</button>`;
  fig.append(bar);
  try {
    const YT = await loadFilmApi();
    fig._player = new YT.Player(mount, { host: FILM_HOST, videoId: fig.dataset.film,
      playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0, iv_load_policy: 3, playsinline: 1, fs: 0, disablekb: 1 },
      events: { onReady: e => { fig.classList.replace('loading', 'playing'); e.target.playVideo(); bar.querySelector('button')?.focus({ preventScroll: true }); },
        onError: () => { closeFilm(fig); fig.querySelector('.film-note')?.remove(); fig.insertAdjacentHTML('beforeend', `<p class="film-note" role="status">${esc(fw('failed'))}</p>`); } } });
  } catch {
    closeFilm(fig);
    fig.insertAdjacentHTML('beforeend', `<p class="film-note" role="status">${esc(fw('failed'))}</p>`);
  }
}
function initFilms() {
  $$('.film').forEach(fig => {
    fig.querySelector('.film-play')?.addEventListener('click', () => { fig.querySelector('.film-note')?.remove(); playFilm(fig); });
    fig.addEventListener('click', e => {
      const b = e.target.closest('[data-film-act]'), p = fig._player;
      if (!b) return;
      if (b.dataset.filmAct === 'close') return closeFilm(fig);
      if (!p) return;
      if (b.dataset.filmAct === 'toggle') {
        const paused = p.getPlayerState?.() === 2;
        paused ? p.playVideo() : p.pauseVideo();
        b.setAttribute('aria-pressed', String(!paused)); b.textContent = paused ? fw('pause') : fw('play');
      }
      if (b.dataset.filmAct === 'mute') {
        const muted = p.isMuted?.();
        muted ? p.unMute() : p.mute();
        b.setAttribute('aria-pressed', String(!muted)); b.textContent = muted ? fw('mute') : fw('unmute');
      }
    });
  });
}

// ————— the time machine —————
// The Watchmaking hero watch beats in Ajman time until a hand touches it. Then the
// crown comes out (the seconds hand stops, as it does when a watch is set) and turning
// it — or the dial — carries the hands through the years the models in the collection
// were introduced, 1954 to 2025. Every year, decade and count comes from watches.json.
const TM = { start: 1954, end: 2025, t: 2025, v: 0, travelling: false, drag: null, raf: 0, live: 0, year: null, decade: null,
  pieces: [], undated: [], detents: [], sec: 0, visible: true, hinted: false };
const TM_DECADES = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
const TM_DECADE_NAMES = { 1950: ['الخمسينيات', 'The 1950s'], 1960: ['الستينيات', 'The 1960s'], 1970: ['السبعينيات', 'The 1970s'], 1980: ['الثمانينيات', 'The 1980s'],
  1990: ['التسعينيات', 'The 1990s'], 2000: ['العقد الأول من الألفية', 'The 2000s'], 2010: ['العقد الثاني من الألفية', 'The 2010s'], 2020: ['العقد الثالث من الألفية', 'The 2020s'] };
const TM_YEARS_PER_TURN = 5, TM_PX_PER_YEAR = 22;
const tmDecadeOf = w => { const y = Number(w.yearReleased); if (y) return Math.floor(y / 10) * 10; const m = /^(\d{4})s$/.exec(w.yearLabelEn || ''); return m ? Number(m[1]) : null; };
const tmEraName = d => TM_DECADE_NAMES[d]?.[state.ar ? 0 : 1] || '';
const tmClamp = y => Math.min(TM.end, Math.max(TM.start, y));
const tmNum = v => state.ar ? indic(v) : String(v);
function tmSetYearWindow(year) {
  const digits = String(year).padStart(4, '0');
  $$('#yearWindow .tm-digit').forEach((g, c) => g.setAttribute('transform', `translate(0 ${-34 * Number(digits[c])})`));
}
function tmHands(h, m, s) {
  const rot = (id, deg) => $(id)?.setAttribute('transform', `rotate(${deg.toFixed(2)} 200 200)`);
  rot('#hourHand', h); rot('#minuteHand', m); rot('#secondHand', s);
}
function tmEraHand(t) {
  const deg = -120 + Math.max(0, Math.min(7, (t - 1950) / 10)) * (240 / 7);
  $('#eraHand')?.setAttribute('transform', `rotate(${deg.toFixed(2)} 124 200)`);
}
// Ajman keeps UTC+4 all year; eight beats a second, like a 28,800 vph calibre.
function tmLive() {
  const d = new Date(Date.now() + 4 * 3600e3), ms = d.getUTCMilliseconds();
  const s = d.getUTCSeconds() + (reduceMotion() ? 0 : Math.floor(ms / 125) / 8), m = d.getUTCMinutes() + s / 60, h = (d.getUTCHours() % 12) + m / 60;
  TM.sec = s * 6;
  tmHands(h * 30, m * 6, TM.sec);
  const year = d.getUTCFullYear();
  if (TM.year !== year) { TM.year = year; tmSetYearWindow(year); }
  tmEraHand(year);
}
function tmLoop() {
  cancelAnimationFrame(TM.live);
  if (TM.travelling || reduceMotion() || !TM.visible || document.hidden) return;
  tmLive();
  TM.live = requestAnimationFrame(tmLoop);
}
// the state of the machine at a (fractional) year
function tmRender() {
  const t = TM.t, frac = t - Math.floor(t);
  tmHands(((t - TM.start) / 12 * 360) % 360, frac * 360, TM.sec);
  tmEraHand(t);
  $('#tmKnurl')?.setAttribute('transform', `translate(0 ${((t * 24) % 4).toFixed(2)})`);
  const year = Math.floor(t + 1e-6);
  if (year !== TM.year) { TM.year = year; tmSetYearWindow(year); tmOnYear(year); }
  const era = $('#tm'); if (era) era.style.setProperty('--era', ((t - TM.start) / (TM.end - TM.start)).toFixed(3));
}
function tmOnYear(year) {
  const svg = $('#timeMachine');
  const decade = Math.floor(year / 10) * 10;
  svg?.setAttribute('aria-valuenow', String(year));
  tmRestLabel();
  // a detent is felt only under a hand on the crown — never on a deep link or a rail jump
  if (TM.drag && TM.detents.includes(year) && !reduceMotion() && navigator.userActivation?.isActive !== false) try { navigator.vibrate?.(6); } catch {}
  if (decade !== TM.decade) { TM.decade = decade; tmRenderEra(); }
  else tmMarkYear();
}
function tmCard(w) {
  const year = w.yearReleased ? tmNum(w.yearReleased) : local(w, 'yearLabel') || t('tmUndated');
  return `<article class="era-card" data-year="${esc(w.yearReleased || '')}"><button type="button" data-watch="${esc(w.slug)}" aria-label="${esc(t('explore') + ' — ' + local(w, 'name'))}"><figure><img src="${esc(royalImage(w))}" alt="" width="800" height="800" loading="lazy" decoding="async"></figure><span class="era-card-year" dir="ltr">${esc(year)}</span><span class="era-card-maison">${esc(maison(w))}</span><span class="era-card-name">${esc(local(w, 'name'))}</span></button></article>`;
}
function tmRenderEra() {
  const box = $('#eraCards'), cap = $('#eraCaption');
  if (!box || !cap) return;
  if (!TM.travelling && TM.decade === null) {
    cap.textContent = t('tmNow');
    box.innerHTML = '';
    tmMarkRail();
    return;
  }
  const undated = TM.decade === 'undated';
  const list = undated ? TM.undated : TM.pieces.filter(w => tmDecadeOf(w) === TM.decade).sort((a, b) => (a.yearReleased || 0) - (b.yearReleased || 0));
  const title = undated ? t('tmUndated') : tmEraName(TM.decade);
  cap.innerHTML = `<span class="tm-era-name">${esc(title)}</span><span class="tm-era-count">${esc(list.length ? t('tmCount')(list.length) : t('tmNone'))}</span>${undated ? `<span class="tm-era-note">${esc(t('tmUndatedNote'))}</span>` : ''}`;
  box.innerHTML = list.map((w, i) => tmCard(w).replace('<article class="era-card"', `<article class="era-card" style="--i:${i}"`)).join('');
  tmMarkYear(); tmMarkRail();
}
function tmMarkYear() {
  $$('#eraCards .era-card').forEach(c => c.classList.toggle('now', Number(c.dataset.year) === TM.year));
}
function tmMarkRail() {
  $$('#eraRail [data-era]').forEach(b => b.setAttribute('aria-pressed', String(TM.travelling && String(TM.decade) === b.dataset.era)));
}
// what the slider announces, in the current language: at rest the watch keeps today's
// time, so it names the present rather than a year it is not showing
function tmRestLabel() {
  const svg = $('#timeMachine');
  if (!svg) return;
  if (!TM.travelling || !TM.year) return svg.setAttribute('aria-valuetext', t('tmNow'));
  const decade = Math.floor(TM.year / 10) * 10;
  svg.setAttribute('aria-valuetext', t('tmValue')(TM.year, tmEraName(decade), t('tmCount')(TM.pieces.filter(w => tmDecadeOf(w) === decade).length)));
}
function renderTimeMachine() {
  const rail = $('#eraRail');
  if (!rail || state.loading) return;
  TM.pieces = state.all.filter(w => tmDecadeOf(w) !== null);
  TM.undated = state.all.filter(w => tmDecadeOf(w) === null);
  TM.detents = [...new Set(TM.pieces.map(w => Number(w.yearReleased)).filter(Boolean))].sort((a, b) => a - b);
  const count = d => TM.pieces.filter(w => tmDecadeOf(w) === d).length;
  rail.innerHTML = TM_DECADES.map(d => `<button type="button" data-era="${d}" aria-pressed="false" class="${count(d) ? '' : 'empty'}"><b dir="ltr">${esc(tmNum(d))}</b><span>${esc(count(d) ? t('tmCount')(count(d)) : '—')}</span></button>`).join('')
    + (TM.undated.length ? `<button type="button" data-era="undated" aria-pressed="false"><b>${esc(t('tmUndated'))}</b><span>${esc(t('tmCount')(TM.undated.length))}</span></button>` : '');
  $$('#yearWindow text').forEach(el => { el.textContent = tmNum(el.dataset.d); });
  const hint = $('#tmHint'); if (hint) hint.hidden = TM.travelling;
  tmRestLabel();
  tmRenderEra();
  if (!TM.hinted) { TM.hinted = true; const m = /^#era-(\d{4})s$/.exec(location.hash) || (location.hash === '#era-undated' ? [0, 'undated'] : null); if (m) tmGoDecade(m[1] === 'undated' ? 'undated' : Number(m[1]), false); }
}
function tmBegin() {
  if (TM.travelling) return;
  TM.travelling = true;
  cancelAnimationFrame(TM.live);
  TM.t = tmClamp(TM.year || TM.end);
  $('#tm')?.classList.add('travelling');
  const now = $('#tmNow'), hint = $('#tmHint');
  if (now) now.hidden = false;
  if (hint) hint.hidden = true;
  TM.decade = null; TM.year = null;
  tmRender();
}
function tmEnd() {
  cancelAnimationFrame(TM.raf);
  const present = new Date(Date.now() + 4 * 3600e3).getUTCFullYear();
  const finish = () => {
    TM.travelling = false; TM.decade = null; TM.year = null;
    $('#tm')?.classList.remove('travelling');
    const now = $('#tmNow'), hint = $('#tmHint');
    if (now) now.hidden = true;
    if (hint) hint.hidden = false;
    if (location.hash.startsWith('#era-')) history.replaceState(null, '', location.pathname + location.search);
    tmRestLabel(); tmRenderEra(); tmLive(); tmLoop();
    $('#timeMachine')?.focus({ preventScroll: true });
  };
  if (reduceMotion()) return finish();
  tmTween(tmClamp(present), finish);
}
// ease the machine to a year: an expo-out, as everything that arrives on this site
function tmTween(target, done) {
  cancelAnimationFrame(TM.raf);
  const from = TM.t, dist = Math.abs(target - from), dur = Math.min(2200, 500 + dist * 40), t0 = performance.now();
  if (reduceMotion() || dist < .001) { TM.t = target; tmRender(); return done?.(); }
  const step = now => {
    const k = Math.min(1, (now - t0) / dur), e = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
    TM.t = from + (target - from) * e; tmRender();
    if (k < 1) TM.raf = requestAnimationFrame(step); else done?.();
  };
  TM.raf = requestAnimationFrame(step);
}
// the nearest year a model in the collection was introduced — the crown's detents
function tmDetent(t, dir = 0) {
  const d = TM.detents;
  if (!d.length) return Math.round(t);
  if (dir > 0) return d.find(y => y > t + .01) ?? d[d.length - 1];
  if (dir < 0) return [...d].reverse().find(y => y < t - .01) ?? d[0];
  return d.reduce((a, b) => Math.abs(b - t) < Math.abs(a - t) ? b : a);
}
function tmGoDecade(decade, hash = true) {
  tmBegin();
  if (decade === 'undated') {
    TM.decade = 'undated'; tmRenderEra();
    if (hash) history.replaceState(null, '', '#era-undated');
    return;
  }
  const first = TM.detents.find(y => Math.floor(y / 10) * 10 === decade) ?? decade;
  TM.decade = decade;
  tmTween(tmClamp(first), () => { TM.decade = null; TM.year = null; tmRender(); });
  if (hash) history.replaceState(null, '', `#era-${decade}s`);
}
// inertia after a throw, then settle into the nearest detent
function tmCoast() {
  cancelAnimationFrame(TM.raf);
  let last = performance.now();
  const step = now => {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    TM.t = tmClamp(TM.t + TM.v * dt);
    TM.v *= Math.exp(-3.2 * dt);
    if (TM.t === TM.start || TM.t === TM.end) TM.v = 0;
    tmRender();
    if (Math.abs(TM.v) > .7) TM.raf = requestAnimationFrame(step);
    else tmTween(tmDetent(TM.t));
  };
  TM.raf = requestAnimationFrame(step);
}
function initTimeMachine() {
  const svg = $('#timeMachine');
  if (!svg) return;
  const pt = e => { const r = svg.getBoundingClientRect(); return { x: (e.clientX - r.left) * 440 / r.width, y: (e.clientY - r.top) * 400 / r.height }; };
  const angle = p => Math.atan2(p.y - 200, p.x - 200) * 180 / Math.PI;
  svg.addEventListener('pointerdown', e => {
    if (e.button !== undefined && e.button !== 0) return;
    const p = pt(e), crown = e.target.closest?.('#crown');
    if (!crown && Math.hypot(p.x - 200, p.y - 200) > 196) return;
    e.preventDefault();
    tmBegin();
    cancelAnimationFrame(TM.raf);
    TM.drag = { mode: crown ? 'crown' : 'dial', y: p.y, a: angle(p), samples: [[performance.now(), TM.t]] };
    svg.setPointerCapture?.(e.pointerId);
    svg.classList.add('dragging');
  });
  svg.addEventListener('pointermove', e => {
    const g = TM.drag; if (!g) return;
    const p = pt(e);
    if (g.mode === 'crown') { TM.t = tmClamp(TM.t + (g.y - p.y) / TM_PX_PER_YEAR); g.y = p.y; }
    else { const a = angle(p); let da = a - g.a; if (da > 180) da -= 360; if (da < -180) da += 360; g.a = a; TM.t = tmClamp(TM.t + da / 360 * TM_YEARS_PER_TURN); }
    const now = performance.now(); g.samples.push([now, TM.t]); while (g.samples.length > 2 && now - g.samples[0][0] > 90) g.samples.shift();
    tmRender();
  });
  const release = e => {
    const g = TM.drag; if (!g) return;
    TM.drag = null; svg.classList.remove('dragging');
    try { svg.releasePointerCapture?.(e.pointerId); } catch {}
    const [a, b] = [g.samples[0], g.samples[g.samples.length - 1]];
    TM.v = b[0] > a[0] ? (b[1] - a[1]) / ((b[0] - a[0]) / 1000) : 0;
    if (reduceMotion()) { TM.v = 0; TM.t = tmDetent(TM.t); tmRender(); } else tmCoast();
  };
  svg.addEventListener('pointerup', release);
  svg.addEventListener('pointercancel', release);
  let wheelTimer;
  svg.addEventListener('wheel', e => {
    e.preventDefault();
    tmBegin(); cancelAnimationFrame(TM.raf);
    TM.t = tmClamp(TM.t + e.deltaY / 120); tmRender();
    clearTimeout(wheelTimer); wheelTimer = setTimeout(() => tmTween(tmDetent(TM.t)), 220);
  }, { passive: false });
  svg.addEventListener('keydown', e => {
    const fwd = state.ar ? 'ArrowLeft' : 'ArrowRight', back = state.ar ? 'ArrowRight' : 'ArrowLeft';
    const go = y => { e.preventDefault(); tmBegin(); tmTween(tmClamp(y)); };
    if (e.key === fwd || e.key === 'ArrowUp') go(tmDetent(TM.t, 1));
    else if (e.key === back || e.key === 'ArrowDown') go(tmDetent(TM.t, -1));
    else if (e.key === 'PageUp') go(TM.t + 10);
    else if (e.key === 'PageDown') go(TM.t - 10);
    else if (e.key === 'Home') go(TM.start);
    else if (e.key === 'End') go(TM.end);
    else if (e.key === 'Escape' && TM.travelling) { e.preventDefault(); tmEnd(); }
  });
  $('#eraRail')?.addEventListener('click', e => { const b = e.target.closest('[data-era]'); if (b) tmGoDecade(b.dataset.era === 'undated' ? 'undated' : Number(b.dataset.era)); });
  $('#tmNow')?.addEventListener('click', tmEnd);
  const hero = $('.craft-hero');
  if (hero && 'IntersectionObserver' in window) new IntersectionObserver(([en]) => { TM.visible = en.isIntersecting; tmLoop(); }).observe(hero);
  document.addEventListener('visibilitychange', tmLoop);
  tmLive(); tmLoop();
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

// ————— a private invitation: ?for=Name makes this a one-of-one edition —————
function guestName() {
  let name = '';
  try { name = new URLSearchParams(location.search).get('for') || ''; } catch {}
  name = name.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 60);
  try {
    if (name) sessionStorage.setItem('ammar-guest', name);
    else name = sessionStorage.getItem('ammar-guest') || '';
  } catch {}
  return name;
}
const guest = guestName();
function renderGuest() {
  if (!guest) return;
  for (const [id, key] of [['#invite', 'invite'], ['#edition', 'edition'], ['#veilGuest', 'invite']]) {
    const el = $(id);
    if (el) { el.textContent = t(key)(guest); el.hidden = false; }
  }
}
function initVeil() {
  const veil = $('#veil');
  if (!veil) return;
  let seen = false;
  try { seen = sessionStorage.getItem('ammar-veil') === '1'; sessionStorage.setItem('ammar-veil', '1'); } catch {}
  // the motion layer choreographs the hero after this; it listens for 'museum:veil'
  const lifted = () => { document.documentElement.dataset.veil = 'lifted'; document.dispatchEvent(new Event('museum:veil')); };
  if (seen || reduceMotion()) return lifted();
  veil.hidden = false;
  veil.setAttribute('aria-hidden', 'true');
  let done = false;
  const lift = () => { if (done) return; done = true; veil.classList.add('lift'); lifted(); setTimeout(() => { veil.hidden = true; }, 1100); };
  const timer = setTimeout(lift, 2000);
  setTimeout(() => { lift(); veil.hidden = true; }, 7000); // the hard fallback: never a veil past seven seconds
  veil.addEventListener('click', () => { clearTimeout(timer); lift(); }, { once: true });
  document.addEventListener('keydown', () => { clearTimeout(timer); lift(); }, { once: true });
}

// ————— the piece of the day: one photograph of His Highness per Gulf day —————
function pieceOfTheDay() {
  const pool = state.all.filter(w => w.royalPairing === 'photograph').sort((a, b) => a.slug.localeCompare(b.slug));
  if (!pool.length) return null;
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dubai' }).format(new Date());
  const day = Math.floor(Date.parse(parts + 'T00:00:00Z') / 86400000);
  return pool[((day % pool.length) + pool.length) % pool.length];
}
function renderToday() {
  const fig = $('#todayFigure');
  if (!fig || state.loading) return;
  const w = pieceOfTheDay();
  if (!w) return;
  fig.innerHTML = royalFigure(w, { loading: 'lazy' });
  const d = datesToday();
  $('#todayDate').textContent = t('todayOf')(d.hijri, d.greg);
  $('#todayMaison').textContent = maison(w);
  $('#todayTitle').textContent = local(w, 'name');
  $('#todayRef').textContent = reference(w);
  $('#todayStory').textContent = local(w, 'editorial');
  $('#todayOpen').dataset.watch = w.slug;
}

// ————— the collection on a single dial —————
// Every dated piece becomes an index, in chronological order, clockwise from twelve.
const dial = { pieces: [], index: 0 };
const yearOf = w => Number(w.yearReleased) || (w.yearLabelEn ? parseInt(w.yearLabelEn, 10) + 5 : 0);
function renderDial() {
  const marks = $('#dialMarks');
  if (!marks || state.loading) return;
  dial.pieces = state.all.filter(w => yearOf(w) > 1900).sort((a, b) => yearOf(a) - yearOf(b) || a.slug.localeCompare(b.slug));
  const n = dial.pieces.length;
  const angle = i => i * 360 / n;
  marks.innerHTML = dial.pieces.map((w, i) => {
    const a = angle(i) * Math.PI / 180, r = 44;
    return `<button type="button" role="option" class="dial-mark" data-dial="${i}" aria-selected="${i === dial.index}" tabindex="${i === dial.index ? 0 : -1}" aria-label="${esc(local(w, 'name') + ' — ' + (w.yearReleased || local(w, 'yearLabel')))}" style="left:${(50 + r * Math.sin(a)).toFixed(2)}%;top:${(50 - r * Math.cos(a)).toFixed(2)}%;--a:${angle(i).toFixed(2)}deg"><i aria-hidden="true"></i></button>`;
  }).join('');
  const decades = $('#dialDecades');
  const seen = new Set();
  let lastLabel = -Infinity;
  decades.innerHTML = dial.pieces.map((w, i) => {
    const dec = Math.floor(yearOf(w) / 10) * 10;
    if (seen.has(dec)) return '';
    seen.add(dec);
    // numerals only where there is room: never two within 20° of each other
    if (angle(i) - lastLabel < 20) return '';
    lastLabel = angle(i);
    const a = angle(i) * Math.PI / 180;
    return `<text x="${(200 + 128 * Math.sin(a)).toFixed(1)}" y="${(200 - 128 * Math.cos(a) + 4).toFixed(1)}">${state.ar ? indic(dec) : dec}</text>`;
  }).join('');
  selectDial(dial.index, false);
}
function selectDial(i, focus = true) {
  const n = dial.pieces.length;
  if (!n) return;
  dial.index = (i + n) % n;
  const w = dial.pieces[dial.index];
  $$('#dialMarks .dial-mark').forEach((b, k) => { b.setAttribute('aria-selected', String(k === dial.index)); b.tabIndex = k === dial.index ? 0 : -1; });
  if (focus) $(`#dialMarks [data-dial="${dial.index}"]`)?.focus({ preventScroll: true });
  const hand = $('#dialHand');
  if (hand) hand.style.transform = `rotate(${(dial.index * 360 / n).toFixed(2)}deg)`;
  $('#dialCentre').innerHTML = `<img src="${esc(royalImage(w))}" alt="" width="800" height="800" loading="lazy">`;
  const year = w.yearReleased ? (state.ar ? indic(w.yearReleased) : w.yearReleased) : local(w, 'yearLabel');
  $('#dialCaption').innerHTML = `<span class="year">${esc(year)}</span><span class="maison">${esc(maison(w))}</span><h3>${esc(local(w, 'name'))}</h3><button type="button" class="link" data-watch="${esc(w.slug)}"><span>${esc(t('dialOpen'))}</span><span class="arrow" aria-hidden="true">→</span></button>`;
}
function initDial() {
  const marks = $('#dialMarks');
  if (!marks) return;
  marks.addEventListener('pointerover', e => { const b = e.target.closest('[data-dial]'); if (b) selectDial(Number(b.dataset.dial), false); });
  marks.addEventListener('focusin', e => { const b = e.target.closest('[data-dial]'); if (b && Number(b.dataset.dial) !== dial.index) selectDial(Number(b.dataset.dial), false); });
  marks.addEventListener('keydown', e => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (step) { e.preventDefault(); e.stopPropagation(); selectDial(dial.index + step); }
    if (e.key === 'Home') { e.preventDefault(); selectDial(0); }
    if (e.key === 'End') { e.preventDefault(); selectDial(dial.pieces.length - 1); }
  });
  marks.addEventListener('click', e => { const b = e.target.closest('[data-dial]'); if (b) { e.stopPropagation(); openDetail(dial.pieces[Number(b.dataset.dial)]); } });
}

// ————— the loupe: a jeweller's lens over the royal image —————
function attachLoupe(zoom) {
  const img = zoom.querySelector('img');
  const lens = document.createElement('span');
  lens.className = 'loupe'; lens.setAttribute('aria-hidden', 'true');
  zoom.append(lens);
  const power = 2.6;
  zoom.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || zoom.getAttribute('aria-pressed') === 'true') { lens.classList.remove('on'); return; }
    const r = zoom.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, size = lens.offsetWidth || 180;
    lens.style.left = (x - size / 2) + 'px';
    lens.style.top = (y - size / 2) + 'px';
    lens.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
    lens.style.backgroundSize = `${r.width * power}px ${r.height * power}px`;
    lens.style.backgroundPosition = `${-(x * power - size / 2)}px ${-(y * power - size / 2)}px`;
    lens.classList.add('on');
  });
  zoom.addEventListener('pointerleave', () => lens.classList.remove('on'));
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
  // a decorative reel frame that fails is simply skipped
  if (img.tagName === 'IMG' && img.closest('.frame')) { img.closest('.frame').hidden = true; return; }
  if (img.tagName === 'IMG' && img.closest('.royal,.zoom,.crown-figure,.era-card,.chapter,#dialCentre,.royal-frame')) {
    if (img.dataset.failed) return; img.dataset.failed = '1';
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
initAnatomyStage();
initTimeMachine();
initFilms();
applyLanguage();
tickClock();
setInterval(tickClock, 1000);
initDial();
initVeil();
// pages that show no timepieces never fetch the ledger
if (!$('#grid') && !$('#featuredGrid') && !$('#frames') && !$('#eraRail') && !$('#crownPieces') && page !== 'exhibition') state.loading = false;
else load();
