// Generates the five public pages from one template so the masthead, menu,
// colophon and detail sheet can never drift apart.  Run: node scripts/build-pages.mjs
// Copy is bilingual inline: Arabic is authored as the default text, English lives in
// data-en, and app.js swaps them. Keep the two registers equivalent, not literal.
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const SITE = 'https://museum-current-production.up.railway.app';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
// bilingual text node: <tag data-ar data-en>Arabic</tag>
const b = (tag, ar, en, attrs = '') => {
  const html = /<[a-z]/.test(ar + en) ? ' data-html' : '';
  return `<${tag}${attrs ? ' ' + attrs : ''} data-ar="${esc(ar)}" data-en="${esc(en)}"${html}>${ar}</${tag}>`;
};
const arrow = '<span class="arrow" aria-hidden="true">→</span>';

const NAV = [
  ['/', 'المجلس', 'The Majlis'],
  ['/collection/', 'المجموعة', 'The Collection'],
  ['/exhibition/', 'قاعة العرض', 'The Exhibition'],
  ['/his-highness/', 'صاحب السمو', 'His Highness'],
  ['/watchmaking/', 'فن صناعة الساعات', 'Watchmaking']
];
const arabicDigits = n => String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

function shell({ page, route, titleAr, titleEn, descAr, main, sheet = true }) {
  const nav = NAV.map(([href, ar, en], i) =>
    `<a href="${href}"${href === route ? ' aria-current="page"' : ''}><span aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${b('b', ar, en)}</a>`
  ).join('');
  const foot = NAV.map(([href, ar, en]) => b('a', ar, en, `href="${href}"`)).join('');
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#f6f3ee">
<meta name="description" content="${esc(descAr)}">
<title data-ar="${esc(titleAr)}" data-en="${esc(titleEn)}">${titleAr}</title>
<link rel="canonical" href="${SITE}${route}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="manifest" href="/site.webmanifest">
<meta property="og:title" content="${esc(titleAr)}">
<meta property="og:description" content="${esc(descAr)}">
<meta property="og:image" content="${SITE}/images/sheikh/sheikh-portrait-1.webp">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=IBM+Plex+Sans+Arabic:wght@300;400;500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<script defer src="/app.js"></script>
</head>
<body data-page="${page}">
${b('a', 'انتقل إلى المحتوى', 'Skip to content', 'class="skip" href="#main"')}
<header class="masthead${['home'].includes(page) ? ' over' : ''}" id="masthead">
<button class="menu-toggle" id="menu" aria-expanded="false" aria-controls="siteMenu"><span class="lines" aria-hidden="true"></span>${b('span', 'القائمة', 'Menu')}</button>
<a class="wordmark" href="/" aria-label="مجلس الوقت — الصفحة الرئيسية" data-label-ar="مجلس الوقت — الصفحة الرئيسية" data-label-en="The Majlis of Time — home"><span class="mark" data-ar="مجلس الوقت" data-en="The Majlis of Time">مجلس الوقت</span><span class="sub" data-ar="مجموعة الشيخ عمّار بن حميد النعيمي" data-en="Sheikh Ammar bin Humaid Al Nuaimi">مجموعة الشيخ عمّار بن حميد النعيمي</span></a>
<button class="lang-toggle" id="lang" lang="en" aria-label="Switch to English">EN</button>
</header>
<div class="menu" id="siteMenu">
<nav id="navigation" aria-label="التنقل الرئيسي" data-label-ar="التنقل الرئيسي" data-label-en="Main navigation">${nav}</nav>
<figure class="menu-figure"><img src="/images/sheikh/sheikh-portrait-2.jpg" alt="" width="891" height="768" loading="lazy"></figure>
<div class="menu-foot">${b('span', 'عجمان · الإمارات العربية المتحدة', 'Ajman · United Arab Emirates')}<span id="ajmanTime" dir="ltr"></span></div>
</div>
${page === 'home' ? `<div class="veil" id="veil" hidden><div class="veil-inner"><span class="veil-mark" aria-hidden="true">ع</span><span class="veil-rule" aria-hidden="true"></span><p class="veil-line" data-ar="مجلس الوقت" data-en="The Majlis of Time">مجلس الوقت</p><p class="veil-guest" id="veilGuest" hidden></p></div></div>` : ''}
<main id="main" tabindex="-1">
${main}
</main>
<footer class="colophon">
<span class="monogram" aria-hidden="true">ع</span>
${b('span', 'مجلس الوقت · عجمان', 'The Majlis of Time · Ajman', 'class="sub"')}
<nav aria-label="روابط التذييل" data-label-ar="روابط التذييل" data-label-en="Footer links">${foot}</nav>
${b('p', 'مجموعة خاصة تُعرض للتأمّل، لا للبيع.', 'A private collection, shown for contemplation — never for sale.')}
<p class="edition" id="edition" hidden></p>
</footer>
${sheet ? `<dialog class="sheet" id="detail" aria-labelledby="detailTitle">
<div class="sheet-bar">${b('p', 'من المجموعة', 'From the collection', 'class="label"')}<div class="actions"><button id="detailLang" lang="en" aria-label="Switch to English">EN</button><button id="detailClose" class="close" aria-label="إغلاق" data-label-ar="إغلاق" data-label-en="Close">×</button></div></div>
<div class="sheet-body" id="detailBody"><div id="detailContent"></div></div>
<div class="sheet-nav"><button id="detailPrev">${b('span', 'القطعة السابقة', 'Previous')}</button><p id="detailPosition" dir="ltr" aria-live="polite"></p><button id="detailNext">${b('span', 'القطعة التالية', 'Next')}</button></div>
</dialog>` : ''}
<noscript><p style="padding:2rem;text-align:center">يرجى تفعيل JavaScript لتصفّح المجموعة · Please enable JavaScript to explore the collection.</p></noscript>
</body>
</html>
`;
}

// ————— Home —————
const home = shell({
  page: 'home', route: '/',
  titleAr: 'مجلس الوقت | مجموعة الشيخ عمّار بن حميد النعيمي للساعات',
  titleEn: 'The Majlis of Time | The Horological Collection of Sheikh Ammar bin Humaid Al Nuaimi',
  descAr: 'مجلس الوقت — مجموعة ساعات صاحب السمو الشيخ عمّار بن حميد النعيمي، ولي عهد عجمان.',
  main: `<section class="hero" aria-labelledby="heroTitle">
<figure class="hero-media"><img src="/images/sheikh/sheikh-portrait-1.webp" alt="صاحب السمو الشيخ عمّار بن حميد النعيمي" data-alt-ar="صاحب السمو الشيخ عمّار بن حميد النعيمي" data-alt-en="His Highness Sheikh Ammar bin Humaid Al Nuaimi" width="840" height="1280" fetchpriority="high"></figure>
<div class="hero-copy">
<p class="invite" id="invite" hidden></p>
${b('p', 'عجمان · الإمارات العربية المتحدة', 'Ajman · United Arab Emirates', 'class="label"')}
${b('h1', 'للوقت قدر.<em>وللساعات حكاية.</em>', 'Time has its measure.<em>Every timepiece, its story.</em>', 'class="display" id="heroTitle"')}
${b('p', 'مجموعة ساعات صاحب السمو الشيخ عمّار بن حميد النعيمي، ولي عهد عجمان — في مجلسٍ يُحتفى فيه بالصنعة، ويُحفظ فيه الوقت.', 'The horological collection of His Highness Sheikh Ammar bin Humaid Al Nuaimi, Crown Prince of Ajman — a majlis where craft is honoured and time is kept.', 'class="standfirst"')}
<a class="button" href="/collection/">${b('span', 'اكتشف المجموعة', 'Discover the collection')}</a>
<span class="scroll-cue" aria-hidden="true"></span>
</div>
</section>

<section class="timeband" aria-label="الوقت في عجمان" data-label-ar="الوقت في عجمان" data-label-en="Time in Ajman">
<div>${b('span', 'الوقت في عجمان', 'Time in Ajman', 'class="label"')}<time id="bandTime" dir="ltr"></time></div>
<div>${b('span', 'التاريخ الهجري', 'Hijri date', 'class="label"')}<span id="bandHijri"></span></div>
<div>${b('span', 'التاريخ الميلادي', 'Gregorian date', 'class="label"')}<span id="bandDate"></span></div>
</section>

<section class="section center" aria-labelledby="introTitle">
${b('p', 'مجلس الوقت', 'The Majlis of Time', 'class="label"')}
${b('h2', 'ليست عرضاً للاقتناء، بل سجلٌّ لذوقٍ يعرف قدر التفاصيل.', 'Not a display of acquisition — a record of discernment.', 'class="sr-only" id="introTitle"')}
${b('p', 'ليست المجموعة عرضاً للاقتناء، بل سجلٌّ لذوقٍ يعرف قدر التفاصيل: ميناءٌ يستوقف النظر، وحركةٌ تستحق الإصغاء، وقطعةٌ رافقت سموّه في لحظاتٍ من حياته.', 'Not a display of acquisition, but a record of discernment: a dial that holds the eye, a movement worth listening to, a timepiece that accompanied His Highness through moments of his life.', 'class="lede reveal"')}
<a class="link" href="/his-highness/">${b('span', 'سيرة سموّه', 'His Highness')}${arrow}</a>
</section>

<section class="section today" id="today" aria-labelledby="todayTitle">
<div class="split">
<figure class="royal-frame" id="todayFigure"></figure>
<div class="words">
${b('p', 'قطعة اليوم', 'The piece of the day', 'class="label"')}
<p class="today-date" id="todayDate"></p>
<span class="maison" id="todayMaison"></span>
<h2 class="title" id="todayTitle"></h2>
<span class="ref" id="todayRef" dir="ltr"></span>
<p class="story" id="todayStory"></p>
<button type="button" class="button" id="todayOpen">${b('span', 'اكتشف القطعة', 'Discover the timepiece')}</button>
${b('p', 'تتبدّل كل يوم مع شروق الشمس على عجمان.', 'It changes every day with the sunrise over Ajman.', 'class="fine"')}
</div>
</div>
</section>

<section class="section white" id="featured" aria-labelledby="featuredTitle">
<div class="inner center">
${b('p', 'مختارات المجلس', 'Selected by the Majlis', 'class="label"')}
${b('h2', 'ثلاث قطع. ثلاث لغات للوقت.', 'Three Timepieces. Three Expressions of Time.', 'class="title" id="featuredTitle"')}
${b('p', 'شخصية الميناء، وذكاء الحركة، وحضور التصميم — ثلاث قراءات في المهارة الحرفية وإرث صناعة الساعات.', 'Dial character, mechanical ingenuity and presence of design — three readings of craftsmanship and horological heritage.', 'class="body-2" style="margin-inline:auto"')}
</div>
<div class="featured-grid" id="featuredGrid" aria-busy="true"></div>
</section>

<section class="section night dial-room" id="dialRoom" aria-labelledby="dialTitle">
<div class="inner center">
${b('p', 'المجموعة على ميناءٍ واحد', 'The collection on a single dial', 'class="label"')}
${b('h2', 'سبعة عقود، تدور حول سموّه.', 'Seven decades, turning around His Highness.', 'class="title" id="dialTitle"')}
${b('p', 'كل مؤشرٍ على هذا الميناء قطعةٌ من المجموعة، في موضع عام طرازها. مرّر أو تنقّل بالأسهم، واختر ما يستوقفك.', 'Every index on this dial is a timepiece from the collection, set at the year of its model. Hover or use the arrow keys, and choose what holds your eye.', 'class="body-2" style="margin-inline:auto"')}
</div>
<div class="dial-stage" dir="ltr">
<svg class="dial-face" viewBox="0 0 400 400" aria-hidden="true"><circle cx="200" cy="200" r="196" /><circle cx="200" cy="200" r="150" class="inner-ring"/><g id="dialDecades"></g><line id="dialHand" x1="200" y1="200" x2="200" y2="30"/><circle cx="200" cy="200" r="3.5" class="pin"/></svg>
<div class="dial-marks" id="dialMarks" role="listbox" aria-orientation="horizontal" aria-label="المجموعة على الميناء" data-label-ar="المجموعة على الميناء" data-label-en="The collection on the dial"></div>
<div class="dial-centre" id="dialCentre"></div>
</div>
<div class="dial-caption" id="dialCaption" aria-live="polite"></div>
</section>

<section class="screening" id="film" aria-labelledby="filmTitle">
<div class="screen" id="screen">
<div class="frames" id="frames"></div>
<div class="screen-bar"><button id="screenPause" aria-pressed="false">${b('span', 'إيقاف مؤقت', 'Pause')}</button><div class="screen-progress" aria-hidden="true"><i id="screenProgress"></i></div><button id="screenStop">${b('span', 'إنهاء', 'End')}</button></div>
</div>
<div class="screen-caption">
${b('p', 'العرض', 'The Screening', 'class="label"')}
${b('h2', 'حين تستحق اللحظة أن تطول.', 'When a Moment Deserves to Last.', 'class="title" id="filmTitle"')}
<p id="screenLine" aria-live="polite" data-ar="لقطاتٌ من حضور سموّه، وقطعٌ رافقته." data-en="Moments with His Highness, and the timepieces that accompanied him.">لقطاتٌ من حضور سموّه، وقطعٌ رافقته.</p>
<button class="screen-trigger" id="screenPlay"><span class="ring" aria-hidden="true"></span>${b('span', 'شاهد العرض', 'Watch the screening')}</button>
</div>
</section>

<section class="section" id="collection" aria-labelledby="collectionTitle">
<div class="inner center">
${b('p', 'من المجموعة', 'From the collection', 'class="label"')}
${b('h2', 'للنفائس تفاصيلها.', 'Distinction is in the details.', 'class="title" id="collectionTitle"')}
</div>
<div class="grid" id="grid" aria-busy="true"><p class="status" data-ar="جارٍ فتح المجموعة…" data-en="Opening the collection…">جارٍ فتح المجموعة…</p></div>
<button class="button retry" id="retry" hidden>${b('span', 'حاول مرة أخرى', 'Try again')}</button>
<p class="center" style="margin-top:3.5rem"><a class="button" href="/collection/">${b('span', 'المجموعة كاملة', 'The full collection')}</a></p>
</section>

<section class="section night" aria-labelledby="storyTitle">
<div class="split">
<figure class="reveal"><img src="/images/sheikh-examining-watches.webp" alt="صاحب السمو يتأمّل كتاب ساعات" data-alt-ar="صاحب السمو يتأمّل كتاب ساعات" data-alt-en="His Highness studying a book of timepieces" width="1179" height="1607" loading="lazy"></figure>
<div class="words">
${b('p', 'صاحب السمو', 'His Highness', 'class="label"')}
${b('h2', 'أصالةٌ في الجذور. رؤيةٌ للأفق.', 'Rooted in heritage. Open to the horizon.', 'class="title" id="storyTitle"')}
${b('p', 'ولي عهد عجمان ورئيس المجلس التنفيذي. تسجّل سيرته الرسمية اهتمامه بالفروسية والصقارة، وبصناعة الساعات والمهارة الحرفية؛ إرثٌ حيّ يلتقي بعينٍ معاصرة.', 'Crown Prince of Ajman and Chairman of the Executive Council. His official biography records a devotion to horsemanship and falconry, and to watchmaking and craft — a living heritage met by a contemporary eye.', 'class="body-2"')}
<a class="link" href="/his-highness/">${b('span', 'تعرّف على سيرة سموّه', 'Discover his life')}${arrow}</a>
</div>
</div>
</section>

<section class="section stone center" aria-labelledby="maisonsTitle">
${b('p', 'الدور', 'The Maisons', 'class="label"')}
${b('h2', 'ثماني دور، وسبعة عقود من صناعة الساعات.', 'Eight maisons. Seven decades of watchmaking.', 'class="title" id="maisonsTitle"')}
<ul class="maisons-strip" id="maisons"></ul>
<p style="margin-top:2.5rem"><a class="link" href="/watchmaking/">${b('span', 'اكتشف فن صناعة الساعات', 'Discover the art of watchmaking')}${arrow}</a></p>
</section>`
});

// ————— Collection —————
const collection = shell({
  page: 'collection', route: '/collection/',
  titleAr: 'المجموعة | مجلس الوقت', titleEn: 'The Collection | The Majlis of Time',
  descAr: 'أربعٌ وأربعون قطعة من ثماني دور، تُعرض كلٌّ منها إلى جانب صاحب السمو الشيخ عمّار بن حميد النعيمي.',
  main: `<section class="page-hero">
${b('p', 'المجموعة', 'The Collection', 'class="label"')}
${b('h1', 'للنفائس تفاصيلها.', 'Distinction is in the details.', 'class="display" id="collectionTitle"')}
<span class="rule" aria-hidden="true"></span>
${b('p', 'أربعٌ وأربعون قطعة من ثماني دور، تُعرض كلٌّ منها إلى جانب صاحب السمو.', 'Forty-four timepieces from eight maisons, each presented with His Highness.', 'class="lede"')}
</section>
<section class="section" id="collection" aria-labelledby="collectionTitle" style="padding-top:0">
<div class="tools">
<div class="filters" id="filters" role="group" aria-label="تصفية حسب الدار" data-label-ar="تصفية حسب الدار" data-label-en="Filter by maison"></div>
<div class="search">${b('label', 'بحث', 'Search', 'for="search"')}<input id="search" type="search" autocomplete="off" placeholder="اسم القطعة أو مرجعها" data-placeholder-ar="اسم القطعة أو مرجعها" data-placeholder-en="Timepiece or reference"></div>
</div>
<p class="count" id="resultCount" role="status" aria-live="polite"></p>
<div class="grid" id="grid" aria-busy="true"><p class="status" data-ar="جارٍ فتح المجموعة…" data-en="Opening the collection…">جارٍ فتح المجموعة…</p></div>
<button class="button retry" id="retry" hidden>${b('span', 'حاول مرة أخرى', 'Try again')}</button>
</section>`
});

// ————— Exhibition —————
const exhibition = shell({
  page: 'exhibition', route: '/exhibition/',
  titleAr: 'قاعة العرض | مجلس الوقت', titleEn: 'The Exhibition | The Majlis of Time',
  descAr: 'قاعة العرض — ثلاث محطات مختارة من مجموعة صاحب السمو الشيخ عمّار بن حميد النعيمي.',
  main: `<section class="hall on-night" id="exhibition" aria-labelledby="tourTitle">
<div class="hall-head">
${b('p', 'قاعة العرض', 'The Exhibition', 'class="label"')}
${b('h1', 'قطعة. ولحظة تأمّل.', 'One piece. A moment to look.', 'class="title" id="tourTitle"')}
${b('p', 'ثلاث محطات، من شخصية الميناء إلى جرأة الحركة. تنقّل على مهل، وافتح تفاصيل القطعة متى شئت.', 'Three encounters, from the character of a dial to the daring of a movement. Move at your own pace, and open each timepiece whenever you wish.', 'class="body-2"')}
</div>
<div class="vitrine">
<figure><img id="tourImage" src="/assets/royal/rolex-daytona-6263-quraysh-hawk.webp" alt="" width="800" height="800"></figure>
<div class="placard">
<p class="chapter" id="tourChapter"></p>
<span class="maison" id="tourBrand"></span>
<h2 id="tourName"></h2>
<span class="ref" id="tourRef" dir="ltr"></span>
<p class="text" id="tourText"></p>
<button class="button" id="tourDetail">${b('span', 'تأمّل التفاصيل', 'Look closer')}</button>
</div>
</div>
<div class="hall-controls">
<button id="tourPrev">${b('span', 'المحطة السابقة', 'Previous')}</button>
<div class="hall-dots" id="tourDots"></div>
<span class="hall-count" id="tourCount" dir="ltr" role="status"></span>
<button id="tourNext">${b('span', 'المحطة التالية', 'Next')}</button>
<button id="tourPlay" aria-pressed="false">${b('span', 'جولة تلقائية', 'Guided tour')}</button>
</div>
<p class="center" style="margin-top:2.5rem"><a class="link" href="/collection/" style="color:var(--moon)">${b('span', 'المجموعة كاملة', 'The full collection')}${arrow}</a></p>
</section>`
});

// ————— His Highness —————
const timeline = [
  [1969, 'النشأة في عجمان', 'Born in Ajman', '31 مارس — مولد سموّه في إمارة عجمان.', '31 March — His Highness was born in the Emirate of Ajman.', null],
  [1993, 'ولاية العهد', 'Crown Prince', '9 أكتوبر — تولّي منصب ولي عهد إمارة عجمان.', '9 October — appointed Crown Prince of Ajman.', null],
  [2003, 'رئاسة المجلس التنفيذي', 'Chairing the Executive Council', 'بدء قيادة المجلس التنفيذي للإمارة.', 'Began leading the emirate’s Executive Council.', ['https://www.ammarbinhumaid.ae/en/biography/', 'السيرة الرسمية', 'Official biography']],
  [2024, 'رؤية عجمان 2030', 'Ajman Vision 2030', '7 مارس — إطلاق رؤية عجمان 2030، بعد مشاركة أكثر من 3,000 شخص في رسم أولوياتها المجتمعية والتنموية.', '7 March — launched Ajman Vision 2030, shaped by contributions from more than 3,000 people.', ['https://www.wam.ae/en/article/13sy4en-crown-prince-ajman-launches-ajman-vision-2030', 'وكالة أنباء الإمارات', 'Emirates News Agency']],
  [2026, 'برنامج عجمان للذكاء الاصطناعي', 'Ajman Artificial Intelligence Programme', '13 مايو — إطلاق البرنامج لتطوير الخدمات والقرار الحكومي، مع استهداف مئة مبادرة للذكاء الاصطناعي.', '13 May — launched to advance public services and government decisions, targeting one hundred AI initiatives.', ['https://www.wam.ae/en/article/c06xcpu-ammar-bin-humaid-chairs-executive-council-meeting', 'وكالة أنباء الإمارات', 'Emirates News Agency']],
  [2026, 'أجندة بلدية عجمان للمشاريع الثلاثين', 'Ajman Municipality AM30x30 Agenda', '7 يوليو — إطلاق ثلاثين مشروعاً ضمن خمس حزم، بقيمة إجمالية 1.8 مليار درهم، لتطوير البنية التحتية وجودة الحياة.', '7 July — thirty projects in five packages, worth AED 1.8 billion in total, for infrastructure and quality of life.', ['https://www.wam.ae/en/article/c13o6u0-ammar-bin-humaid-launches-ajman-municipality', 'وكالة أنباء الإمارات', 'Emirates News Agency']]
];
const highness = shell({
  page: 'biography', route: '/his-highness/',
  titleAr: 'صاحب السمو | مجلس الوقت', titleEn: 'His Highness | The Majlis of Time',
  descAr: 'سيرة صاحب السمو الشيخ عمّار بن حميد النعيمي، ولي عهد عجمان ورئيس المجلس التنفيذي.',
  main: `<section class="portrait-hero" id="biography" aria-labelledby="bioTitle">
<figure><img src="/images/sheikh/sheikh-portrait-2.jpg" alt="صاحب السمو الشيخ عمّار بن حميد النعيمي" data-alt-ar="صاحب السمو الشيخ عمّار بن حميد النعيمي" data-alt-en="His Highness Sheikh Ammar bin Humaid Al Nuaimi" width="891" height="768" fetchpriority="high"></figure>
<div class="words">
${b('p', 'صاحب السمو', 'His Highness', 'class="label"')}
${b('h1', 'سمو الشيخ عمّار<br>بن حميد النعيمي', 'His Highness Sheikh Ammar<br>bin Humaid Al Nuaimi', 'class="display" id="bioTitle"')}
${b('p', 'ولي عهد عجمان · رئيس المجلس التنفيذي', 'Crown Prince of Ajman · Chairman of the Executive Council', 'class="role"')}
${b('p', 'وُلد في عجمان في 31 مارس 1969. تلقّى تعليمه في مدارس الإمارة، والتحق بالدفعة الأولى من كلية الشرطة، ثم واصل التدريب المتخصص في المملكة المتحدة.', 'Born in Ajman on 31 March 1969. Educated in the emirate, he joined the first cohort of the Police College and later undertook specialist training in the United Kingdom.', 'class="body-2"')}
<a class="link" href="https://www.ammarbinhumaid.ae/en/biography/" target="_blank" rel="noopener">${b('span', 'السيرة الرسمية', 'Official biography')}<span aria-hidden="true">↗</span></a>
</div>
</section>
<section class="section" aria-labelledby="royalChaptersTitle">
<div class="inner center">
${b('p', 'السيرة والإرث', 'Life and heritage', 'class="label"')}
${b('h2', 'من المكان، إلى ما يبقى.', 'A place. A life. A lasting interest.', 'class="title" id="royalChaptersTitle"')}
</div>
<div class="records">
<article><span class="index" aria-hidden="true">01</span>${b('h3', 'التعلّم والخدمة', 'Learning and service')}${b('p', 'من مدارس عجمان إلى الدفعة الأولى من كلية الشرطة، ثم التدريب المتخصص في المملكة المتحدة؛ محطاتٌ تسبق مسيرة سموّه في الخدمة العامة.', 'Schools in Ajman, the inaugural Police College cohort, then specialist training in the United Kingdom: an education preceding a life of public service.')}</article>
<article><span class="index" aria-hidden="true">02</span>${b('h3', 'إرثٌ حيّ', 'A living heritage')}${b('p', 'تُوثّق السيرة الرسمية اهتمام سموّه بالفروسية والصقارة؛ حضورٌ للتراث الإماراتي في الممارسة، إلى جانب اهتمامه بالرياضة المعاصرة.', 'The official biography records his devotion to horsemanship and falconry: Emirati heritage in practice, alongside contemporary sport.')}</article>
<article><span class="index" aria-hidden="true">03</span>${b('h3', 'عينٌ على الحِرفة', 'An eye for craft')}${b('p', 'وتسجّل السيرة ذاتها اهتمامه بصناعة الساعات والمهارة الحرفية. من هنا تعبر الزيارة إلى الميناء والحركة، والتفاصيل التي تمنح كل قطعة هويتها.', 'The same biography records an interest in horology and craftsmanship. From here the visit continues through dials, movements and the details that give each timepiece its identity.')}</article>
</div>
</section>
<section class="section white" aria-labelledby="milestonesTitle">
<div class="inner center">
${b('p', 'محطات في المسيرة', 'Milestones', 'class="label"')}
${b('h2', 'من الجذور، إلى المستقبل.', 'Rooted in heritage. Looking ahead.', 'class="title" id="milestonesTitle"')}
</div>
<ol class="timeline bio-timeline">
${timeline.map(([year, tAr, tEn, pAr, pEn, src]) => `<li><time datetime="${year}" data-year="${year}">${arabicDigits(year)}</time><div>${b('h3', tAr, tEn)}${b('p', pAr, pEn)}${src ? `<a href="${src[0]}" target="_blank" rel="noopener">${b('span', src[1], src[2])} <span aria-hidden="true">↗</span></a>` : ''}</div></li>`).join('\n')}
</ol>
<p class="center" style="margin-top:3.5rem"><a class="button" href="/collection/">${b('span', 'اكتشف المجموعة', 'Discover the collection')}</a></p>
</section>`
});

// ————— Watchmaking —————
const anatomy = [
  ['العلبة', 'Case', 'الهيكل الذي يحمي الحركة ويحدد حضور الساعة على المعصم؛ قد يُصنع من الفولاذ أو الذهب أو التيتانيوم أو السيراميك أو الياقوت الصناعي.', 'The structure that protects the movement and defines the watch on the wrist; crafted in steel, gold, titanium, ceramic or sapphire.'],
  ['الإطار', 'Bezel', 'الحلقة المحيطة بالزجاج؛ قد تكون ثابتة أو دوّارة، أو تحمل مقياساً مثل التاكيمتر.', 'The ring surrounding the crystal; fixed or rotating, or carrying a scale such as a tachymeter.'],
  ['الزجاج', 'Crystal', 'السطح الشفاف الذي يحمي الميناء؛ والياقوت الصناعي هو الاختيار الشائع في صناعة الساعات الراقية.', 'The transparent surface protecting the dial; sapphire crystal is the standard of Haute Horlogerie.'],
  ['الميناء', 'Dial', 'الوجه البصري للقطعة: المؤشرات والأرقام والعدّادات والفتحات التي تنظّم قراءة الوقت والتعقيدات.', 'The visual face of the timepiece: markers, numerals, counters and apertures that organise time and complications.'],
  ['العقارب', 'Hands', 'تنقل قراءة الساعات والدقائق والثواني، وقد تحمل وظائف إضافية مثل توقيت الكرونوغراف أو المنطقة الزمنية الثانية.', 'They indicate hours, minutes and seconds, and may carry further functions such as chronograph timing or a second time zone.'],
  ['التاج والأزرار', 'Crown & pushers', 'التاج لضبط الوقت والتعبئة؛ والأزرار تتحكم بوظائف مثل بدء الكرونوغراف وإيقافه وإعادته إلى الصفر.', 'The crown sets and winds the watch; pushers start, stop and reset functions such as the chronograph.'],
  ['العيار', 'Calibre', 'الهوية الميكانيكية للحركة: هندستها وبنيتها وترددها وطريقة تعبئتها وتعقيداتها.', 'The mechanical identity of the movement: its architecture, frequency, winding system and complications.'],
  ['نظام الإفلات', 'Escapement', 'ينظّم انتقال الطاقة إلى عجلة الاتزان على دفعات دقيقة، وهو من أساسيات ضبط الوقت الميكانيكي.', 'It meters energy to the balance in controlled impulses — the foundation of mechanical timekeeping.'],
  ['عجلة الاتزان والنابض الشعري', 'Balance & hairspring', 'منظومة تنظيم الحركة؛ تتذبذب بإيقاع منتظم يحدد معدّل سير الساعة ودقتها.', 'The regulating oscillator, whose steady oscillation governs the rate of the timepiece.'],
  ['برميل النابض', 'Mainspring barrel', 'يخزّن الطاقة في النابض الرئيسي ويطلقها تدريجياً لتشغيل الحركة.', 'It stores energy in the mainspring and releases it progressively to power the movement.'],
  ['الدوّار', 'Rotor', 'كتلة متحركة في الحركة ذاتية التعبئة تدور مع حركة المعصم لتعبئة النابض الرئيسي.', 'A weighted mass in a self-winding movement that turns with the wrist to wind the mainspring.'],
  ['الجسور والجواهر', 'Bridges & jewels', 'تثبّت مكونات الحركة وتدعم محاورها؛ وتقلل الجواهر الاصطناعية الاحتكاك في النقاط الدقيقة.', 'Bridges support the movement’s architecture, while synthetic jewels reduce friction at critical pivots.']
];
const complications = [
  ['chronograph', 'CH', 'الكرونوغراف', 'Chronograph', 'آلية مستقلة لقياس فترات زمنية قصيرة؛ تبدأ وتتوقف وتُصفَّر عبر الأزرار، وغالباً تظهر ثوانيها في عقرب مركزي مع عدّادات فرعية للدقائق أو الساعات.', 'An independent mechanism for timing elapsed intervals. It starts, stops and resets by pushers, typically with a central seconds hand and sub-counters for minutes or hours.'],
  ['tourbillon', 'TB', 'التوربيون', 'Tourbillon', 'قفصٌ دوّار يحمل عجلة الاتزان ونظام الإفلات، ابتُكر تاريخياً لتقليل أثر أخطاء الوضعية عبر تدوير المنظومة المنظِّمة باستمرار.', 'A rotating cage carrying the balance and escapement, historically conceived to average positional errors by continually turning the regulating organ.'],
  ['dual-time', 'DT', 'التوقيت المزدوج وGMT', 'Dual Time & GMT', 'يعرض التوقيت المزدوج منطقة زمنية ثانية، غالباً بعقرب أو ميناء فرعي مستقل؛ أما GMT فيعتمد عادةً عقرباً ومقياساً من أربع وعشرين ساعة.', 'Dual Time displays a second time zone, often by an independent hand or subdial; GMT typically uses a 24-hour hand and scale.', ['على المعصم', 'On the wrist', 'أثناء السفر، اقرأ التوقيت المحلي والتوقيت في عجمان معاً، دون إعادة ضبط الساعة.', 'While travelling, read local time and the time in Ajman together, without resetting the watch.']],
  ['perpetual-calendar', 'PC', 'التقويم الدائم', 'Perpetual Calendar', 'يتابع اختلاف أطوال الشهور والسنوات الكبيسة ميكانيكياً، ليحافظ على التاريخ الصحيح ما دامت الساعة تعمل.', 'Mechanically accounts for the differing lengths of months and for leap years, keeping the correct date while the watch runs.'],
  ['minute-repeater', 'MR', 'مُكرِّر الدقائق', 'Minute Repeater', 'تعقيدٌ صوتي يقرع الساعات وأرباعها والدقائق عند الطلب، عبر مطارق صغيرة تضرب أجراساً داخل العلبة.', 'An acoustic complication that chimes the hours, quarter-hours and minutes on demand through miniature hammers and gongs.'],
  ['rattrapante', 'RT', 'كرونوغراف الثواني المنقسمة / راترابانت', 'Split-seconds Chronograph / Rattrapante', 'عقربا ثوانٍ متراكبان يتيحان قياس زمنين متزامنين أو زمنٍ وسيط، بينما يواصل أحدهما القياس.', 'Two superimposed chronograph hands allow simultaneous or intermediate timing while one continues to run.'],
  ['world-time', 'WT', 'التوقيت العالمي', 'World Time', 'يجمع عادةً حلقة من أربع وعشرين ساعة بأسماء المدن، لقراءة مناطق العالم الزمنية في نظرة واحدة.', 'Typically combines a 24-hour ring with city names to read the world’s time zones at a glance.'],
  ['flyback', 'FB', 'كرونوغراف فلاي باك', 'Flyback Chronograph', 'ضغطة واحدة أثناء عمل الكرونوغراف تعيد العقرب إلى الصفر وتبدأ قياساً جديداً فوراً.', 'A single press resets the running chronograph to zero and immediately starts a new interval.'],
  ['moon-phase', 'MP', 'مؤشر أطوار القمر', 'Moon-phase Indication', 'عرضٌ فلكي يتتبّع الدورة القمرية بصرياً، غالباً عبر قرصٍ يدور خلف فتحة في الميناء.', 'An astronomical indication that follows the lunar cycle, often by a disc turning beneath an aperture.']
];
const records = [
  ['المرجع', 'Reference', 'الرمز الذي يحدد النسخة أو التكوين المحدد للساعة داخل مجموعة الدار.', 'The code identifying a specific version or configuration within a maison’s collection.'],
  ['مادة العلبة', 'Case material', 'المعدن أو المادة التي صُنعت منها العلبة، وتؤثر في الوزن والملمس والحضور.', 'The metal or material of the case, shaping weight, touch and presence.'],
  ['أبعاد العلبة', 'Case dimensions', 'قياس العلبة بالمليمتر، وهو من أهم عناصر التناسب على المعصم.', 'The case width in millimetres — a key measure of proportion on the wrist.'],
  ['العيار / الحركة', 'Calibre / movement', 'اسم الحركة الميكانيكية أو رقمها، وهي التي تقود الساعة وتعقيداتها.', 'The designation of the mechanical movement driving the watch and its complications.'],
  ['احتياطي الطاقة', 'Power reserve', 'المدة التقريبية التي تعمل فيها الحركة بعد التعبئة الكاملة.', 'How long a fully wound movement runs before it needs more energy.'],
  ['التعقيدات', 'Complications', 'الوظائف الميكانيكية الإضافية التي تتجاوز عرض الوقت الأساسي.', 'Mechanical functions beyond the basic indication of time.']
];
const ticks = Array.from({ length: 60 }, (_, i) => {
  const a = i * 6 * Math.PI / 180, r1 = i % 5 ? 166 : 156, r2 = 172;
  const p = (r) => `${(200 + r * Math.sin(a)).toFixed(1)} ${(200 - r * Math.cos(a)).toFixed(1)}`;
  return `<line x1="${p(r1).split(' ')[0]}" y1="${p(r1).split(' ')[1]}" x2="${p(r2).split(' ')[0]}" y2="${p(r2).split(' ')[1]}" stroke-width="${i % 5 ? .6 : 1.6}"/>`;
}).join('');
const watchmaking = shell({
  page: 'watchmaking', route: '/watchmaking/',
  titleAr: 'فن صناعة الساعات | مجلس الوقت', titleEn: 'Watchmaking | The Majlis of Time',
  descAr: 'فن صناعة الساعات — دليل ثنائي اللغة إلى تشريح الساعة والتعقيدات وقراءة السجل التقني.',
  sheet: false,
  main: `<section class="craft-hero on-night" aria-labelledby="craftTitle">
<div>
${b('p', 'فن صناعة الساعات', 'The Art of Watchmaking', 'class="label"')}
${b('h1', 'قطعٌ تتجاوز الزمن.', 'Timeless timepieces.', 'class="display" id="craftTitle"')}
<p class="craft-manifesto" data-ar="واحدةٌ من قِلّة." data-en="One of not many">واحدةٌ من قِلّة.</p>
${b('p', 'من الميناء إلى نظام الإفلات، ومن التوربيون إلى مُكرِّر الدقائق: دليلٌ يعيدك إلى كل قطعة بعينٍ أدقّ.', 'From dial to escapement, from tourbillon to minute repeater: a guide that returns you to each timepiece with a keener eye.', 'class="body-2"')}
<a class="link" href="#anatomy">${b('span', 'اكتشف تشريح القطعة', 'Discover the anatomy')}<span aria-hidden="true">↓</span></a>
</div>
<div class="dial" aria-hidden="true"><svg viewBox="0 0 400 400" fill="none" stroke="#d8bd8a">
<circle cx="200" cy="200" r="190" stroke-width=".8" opacity=".55"/><circle cx="200" cy="200" r="178" stroke-width="1.2"/>
<g opacity=".9">${ticks}</g>
<circle cx="200" cy="262" r="34" stroke-width=".7" opacity=".7"/><circle cx="142" cy="200" r="30" stroke-width=".7" opacity=".7"/><circle cx="258" cy="200" r="30" stroke-width=".7" opacity=".7"/>
<line class="hand" id="hourHand" x1="200" y1="210" x2="200" y2="112" stroke-width="3" stroke-linecap="round"/>
<line class="hand" id="minuteHand" x1="200" y1="214" x2="200" y2="62" stroke-width="2" stroke-linecap="round"/>
<line class="hand" id="secondHand" x1="200" y1="226" x2="200" y2="48" stroke="#f3efe7" stroke-width=".8"/>
<circle cx="200" cy="200" r="4" fill="#d8bd8a"/></svg></div>
</section>
<nav class="chapters" aria-label="فصول فن صناعة الساعات" data-label-ar="فصول فن صناعة الساعات" data-label-en="Watchmaking chapters">
<a href="#anatomy"><span aria-hidden="true">01</span>${b('b', 'تشريح الساعة', 'Anatomy')}</a>
<a href="#complications"><span aria-hidden="true">02</span>${b('b', 'التعقيدات', 'Complications')}</a>
<a href="#technical-record"><span aria-hidden="true">03</span>${b('b', 'السجل التقني', 'The technical record')}</a>
</nav>
<section class="section" id="anatomy" aria-labelledby="anatomyTitle">
<div class="inner center">
${b('p', '01 — تشريح القطعة', '01 — Anatomy of a timepiece', 'class="label"')}
${b('h2', 'ما تراه. وما يعمل في الداخل.', 'What you see. What works within.', 'class="title" id="anatomyTitle"')}
${b('p', 'من الميناء والعقارب إلى العيار ونظام الإفلات، لكل جزء وظيفته وحضوره في شخصية الساعة.', 'From dial and hands to calibre and escapement, every component has a function and a place in the character of a timepiece.', 'class="body-2" style="margin-inline:auto"')}
</div>
<div class="anatomy anatomy-grid">
${anatomy.map(([ar, en, pAr, pEn], i) => `<article><span class="num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${b('h3', ar, en)}${b('p', pAr, pEn)}</article>`).join('\n')}
</div>
</section>
<section class="section night" id="complications" aria-labelledby="complicationsTitle">
<div class="inner center">
${b('p', '02 — التعقيدات والآليات', '02 — Complications & mechanisms', 'class="label"')}
${b('h2', 'حين يتجاوز العيار عرض الوقت.', 'Beyond the indication of time.', 'class="title" id="complicationsTitle"')}
${b('p', 'التعقيد في صناعة الساعات وظيفةٌ تتجاوز عرض الساعات والدقائق والثواني. ويضم هذا الفصل أيضاً آلياتٍ تنظيمية، كالتوربيون، تُناقش عادةً في عالم صناعة الساعات الراقية.', 'In watchmaking, a complication is any function beyond hours, minutes and seconds. This chapter also includes regulating mechanisms, such as the tourbillon, that belong to the conversation of Haute Horlogerie.', 'class="body-2" style="margin-inline:auto"')}
</div>
<nav class="complication-index" aria-label="اختر تعقيداً" data-label-ar="اختر تعقيداً" data-label-en="Choose a complication">
${complications.map(([id, , ar, en]) => b('a', ar, en, `href="#complication-${id}"`)).join('')}
</nav>
<div class="complication-list">
${complications.map(([id, code, ar, en, pAr, pEn, aside]) => `<article id="complication-${id}"><div><span class="code" aria-hidden="true">${code}</span>${b('h3', ar, en)}</div>${b('p', pAr, pEn)}${aside ? `<aside>${b('strong', aside[0], aside[1])}${b('p', aside[2], aside[3])}</aside>` : ''}</article>`).join('\n')}
</div>
<aside class="note" id="turbine">
${b('p', 'مصطلح معاصر', 'A contemporary term', 'class="label"')}
${b('h3', 'التوربين ليس توربيوناً.', 'A turbine is not a tourbillon.')}
${b('p', 'في بعض الساعات المعاصرة، يشير «التوربين» إلى عنصرٍ دوّار بصري أو معماري فوق الميناء أو ضمنه؛ قد يكون جزءاً من هوية التصميم، لكنه ليس تعقيداً ميكانيكياً كلاسيكياً. أما التوربيون فقفصٌ دوّار يحمل عجلة الاتزان ونظام الإفلات.', 'In some contemporary watches, a “Turbine” is a rotating visual or architectural element on or within the dial. It may define the design, but it is not a classical complication. A tourbillon is a rotating cage carrying the balance and escapement.')}
</aside>
<aside class="note" id="submariner">
${b('p', 'اسم الطراز ومعناه', 'Understanding model names', 'class="label"')}
${b('h3', 'سابمارينر — ساعة الغوص من رولكس', 'Submariner — the Rolex diving watch')}
${b('p', 'سابمارينر اسم مجموعة ساعات من رولكس صُممت للغوص، وليس اسم تعقيد. يساعد إطارها الدوّار المدرّج على قراءة الزمن المنقضي تحت الماء.', 'Submariner is the name of a Rolex collection designed for diving, not a complication. Its graduated rotating bezel reads elapsed time underwater.')}
<a class="link" href="https://www.rolex.com/watches/submariner" target="_blank" rel="noopener">${b('span', 'عن سابمارينر لدى رولكس', 'Submariner at Rolex')}<span aria-hidden="true">↗</span></a>
</aside>
</section>
<section class="section" id="technical-record" aria-labelledby="recordTitle">
<div class="inner center">
${b('p', '03 — قراءة السجل التقني', '03 — Reading the technical record', 'class="label"')}
${b('h2', 'من المرجع إلى احتياطي الطاقة.', 'From reference to power reserve.', 'class="title" id="recordTitle"')}
</div>
<dl class="record-guide">
${records.map(([ar, en, dAr, dEn]) => `<div>${b('dt', ar, en)}${b('dd', dAr, dEn)}</div>`).join('\n')}
</dl>
</section>
<section class="section night" aria-labelledby="closingTitle">
<div class="split">
<figure><img src="/images/sheikh-examining-watches.webp" alt="صاحب السمو يتأمّل كتاب ساعات" data-alt-ar="صاحب السمو يتأمّل كتاب ساعات" data-alt-en="His Highness studying a book of timepieces" width="1179" height="1607" loading="lazy"></figure>
<div class="words">
${b('p', 'مجلس الوقت', 'The Majlis of Time', 'class="label"')}
${b('h2', 'افهم الصنعة. ثم عُد إلى القطعة.', 'Understand the craft. Then return to the timepiece.', 'class="title" id="closingTitle"')}
${b('p', 'المعرفة لا تُذهب الدهشة؛ بل تجعل التفاصيل الصغيرة أوضح، وأعلى قيمة.', 'Knowledge does not diminish the wonder. It makes the smallest details easier to see — and harder to overlook.', 'class="body-2"')}
<p><a class="link" href="/collection/">${b('span', 'اكتشف المجموعة', 'Discover the collection')}${arrow}</a></p>
<p><a class="link" href="/exhibition/">${b('span', 'ادخل قاعة العرض', 'Enter the exhibition')}${arrow}</a></p>
</div>
</div>
</section>`
});

const pages = { 'index.html': home, 'collection/index.html': collection, 'exhibition/index.html': exhibition, 'his-highness/index.html': highness, 'watchmaking/index.html': watchmaking };
for (const [file, html] of Object.entries(pages)) {
  mkdirSync(path.dirname(path.join(dist, file)), { recursive: true });
  writeFileSync(path.join(dist, file), html);
}
console.log('pages built:', Object.keys(pages).join(', '));
