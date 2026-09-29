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
  ['/', 'الرئيسية', 'Home'],
  ['/collection/', 'المجموعة', 'The Collection'],
  ['/exhibition/', 'المعرض', 'The Exhibition'],
  ['/his-highness/', 'صاحب السمو', 'His Highness'],
  ['/watchmaking/', 'صناعة الساعات', 'Watchmaking']
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
<script defer src="/royal.js"></script>
</head>
<body data-page="${page}">
${b('a', 'انتقل إلى المحتوى', 'Skip to content', 'class="skip" href="#main"')}
<header class="masthead${['home'].includes(page) ? ' over' : ''}" id="masthead">
<button class="menu-toggle" id="menu" aria-expanded="false" aria-controls="siteMenu"><span class="lines" aria-hidden="true"></span>${b('span', 'القائمة', 'Menu')}</button>
<a class="wordmark" href="/" aria-label="الشيخ عمّار بن حميد النعيمي — الصفحة الرئيسية" data-label-ar="الشيخ عمّار بن حميد النعيمي — الصفحة الرئيسية" data-label-en="Sheikh Ammar bin Humaid Al Nuaimi — home"><span class="mark" data-ar="الشيخ عمّار بن حميد النعيمي" data-en="Sheikh Ammar bin Humaid Al Nuaimi">الشيخ عمّار بن حميد النعيمي</span><span class="sub" data-ar="مجموعة الساعات · ولي عهد عجمان" data-en="The Horological Collection · Crown Prince of Ajman">مجموعة الساعات · ولي عهد عجمان</span></a>
<button class="lang-toggle" id="lang" lang="en" aria-label="Switch to English">EN</button>
</header>
<div class="menu" id="siteMenu" data-lenis-prevent>
<nav id="navigation" aria-label="التنقل الرئيسي" data-label-ar="التنقل الرئيسي" data-label-en="Main navigation">${nav}</nav>
<figure class="menu-figure"><img src="/images/sheikh/sheikh-portrait-2.jpg" alt="" width="891" height="768" loading="lazy"></figure>
<div class="menu-foot">${b('span', 'عجمان · الإمارات العربية المتحدة', 'Ajman · United Arab Emirates')}<span id="ajmanTime" dir="ltr"></span></div>
</div>
${page === 'home' ? `<div class="veil" id="veil" hidden><div class="veil-inner"><span class="veil-mark" aria-hidden="true">ع</span><span class="veil-rule" aria-hidden="true"></span><p class="veil-line" data-ar="الشيخ عمّار بن حميد النعيمي" data-en="Sheikh Ammar bin Humaid Al Nuaimi">الشيخ عمّار بن حميد النعيمي</p><p class="veil-guest" id="veilGuest" hidden></p></div></div>` : ''}
<main id="main" tabindex="-1">
${main}
</main>
<footer class="colophon">
<span class="monogram" aria-hidden="true">ع</span>
${b('span', 'الشيخ عمّار بن حميد النعيمي · عجمان', 'Sheikh Ammar bin Humaid Al Nuaimi · Ajman', 'class="sub"')}
<nav aria-label="روابط التذييل" data-label-ar="روابط التذييل" data-label-en="Footer links">${foot}</nav>
${b('p', 'مجموعة خاصة تُعرض للتأمّل، لا للبيع.', 'A private collection, shown for contemplation — never for sale.')}
<p class="edition" id="edition" hidden></p>
</footer>
${sheet ? `<dialog class="sheet" id="detail" aria-labelledby="detailTitle">
<div class="sheet-bar">${b('p', 'من المجموعة', 'From the collection', 'class="label"')}<div class="actions"><button id="detailLang" lang="en" aria-label="Switch to English">EN</button><button id="detailClose" class="close" aria-label="إغلاق" data-label-ar="إغلاق" data-label-en="Close">×</button></div></div>
<div class="sheet-body" id="detailBody" data-lenis-prevent><div id="detailContent"></div></div>
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
  titleAr: 'الشيخ عمّار بن حميد النعيمي | مجموعة الساعات',
  titleEn: 'Sheikh Ammar bin Humaid Al Nuaimi | The Horological Collection',
  descAr: 'مجموعة ساعات صاحب السمو الشيخ عمّار بن حميد النعيمي، ولي عهد عجمان.',
  main: `<section class="hero" aria-labelledby="heroTitle">
<figure class="hero-media"><img src="/images/sheikh/sheikh-portrait-1.webp" alt="صاحب السمو الشيخ عمّار بن حميد النعيمي" data-alt-ar="صاحب السمو الشيخ عمّار بن حميد النعيمي" data-alt-en="His Highness Sheikh Ammar bin Humaid Al Nuaimi" width="840" height="1280" fetchpriority="high"></figure>
<div class="hero-copy">
<svg class="hero-ring" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="98" pathLength="1"/></svg>
<p class="invite" id="invite" hidden></p>
${b('p', 'عجمان · الإمارات العربية المتحدة', 'Ajman · United Arab Emirates', 'class="label"')}
${b('h1', 'للوقت قدر.<em>وللساعات حكاية.</em>', 'Time has its measure.<em>Every timepiece, its story.</em>', 'class="display" id="heroTitle"')}
${b('p', 'مجموعة ساعات صاحب السمو الشيخ عمّار بن حميد النعيمي، ولي عهد عجمان — حيث يُحتفى بالصنعة، ويُحفظ الوقت.', 'The horological collection of His Highness Sheikh Ammar bin Humaid Al Nuaimi, Crown Prince of Ajman — where craft is honoured and time is kept.', 'class="standfirst"')}
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
${b('p', 'روح المجموعة', 'The spirit of the collection', 'class="label"')}
${b('h2', 'ليست عرضاً للاقتناء، بل سجلٌّ لذوقٍ يعرف قدر التفاصيل.', 'Not a display of acquisition — a record of discernment.', 'class="sr-only" id="introTitle"')}
${b('p', 'ليست المجموعة عرضاً للاقتناء، بل سجلٌّ لذوقٍ يعرف قدر التفاصيل: ميناءٌ يستوقف النظر، وحركةٌ تستحق الإصغاء، وقطعةٌ رافقت سموّه في لحظاتٍ من حياته.', 'Not a display of acquisition, but a record of discernment: a dial that holds the eye, a movement worth listening to, a timepiece that accompanied His Highness through moments of his life.', 'class="lede reveal"')}
${b('p', 'يتحدّث عنها هواة الساعات في المزادات والمحافل — مجموعةٌ نادراً ما تجتمع عناصرها كاملةً عند شخصٍ واحد.', 'Collectors speak of it at auctions and in horological circles — a collection whose full range rarely comes together under one name.', 'class="body-2 reveal"')}
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

<section class="crown-room on-night" id="crown" aria-labelledby="crownTitle">
<div class="inner center">
${b('p', 'قطع التاج', 'The Crown Pieces', 'class="label"')}
${b('h2', 'ستُّ قطع. كلٌّ منها واحدةٌ من قِلّة.', 'Six pieces. Each, one of not many.', 'class="title" id="crownTitle"')}
${b('p', 'ستُّ صورٍ للندرة في مجموعة سموّه، كما يسجّلها سجلّ المجموعة: ندرةُ البقاء، والرمز، والآلية، واليد، والفن، والخاتمة.', 'Six kinds of rarity in His Highness’s collection, as its ledger records them: of survival, of an emblem, of a mechanism, of a hand, of art, and of an ending.', 'class="body-2" style="margin-inline:auto"')}
</div>
<ol class="crowns" id="crownPieces" aria-busy="true"></ol>
</section>

<section class="section white" id="featured" aria-labelledby="featuredTitle">
<div class="inner center">
${b('p', 'مختاراتٌ من المجموعة', 'Selected from the collection', 'class="label"')}
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
  titleAr: 'المجموعة | الشيخ عمّار بن حميد النعيمي', titleEn: 'The Collection | Sheikh Ammar bin Humaid Al Nuaimi',
  descAr: 'خمسٌ وأربعون قطعة من ثماني دور، تُعرض كلٌّ منها إلى جانب صاحب السمو الشيخ عمّار بن حميد النعيمي.',
  main: `<section class="reel">
<div class="reel-frames" id="reelFrames"></div>
<p class="reel-caption" id="reelCaption"></p>
</section>
<section class="page-hero">
${b('p', 'المجموعة', 'The Collection', 'class="label"')}
${b('h1', 'للنفائس تفاصيلها.', 'Distinction is in the details.', 'class="display" id="collectionTitle"')}
<span class="rule" aria-hidden="true"></span>
${b('p', 'خمسٌ وأربعون قطعة من ثماني دور، امتدّت عبر سبعة عقود — كلٌّ منها إلى جانب صاحب السمو، وكلٌّ منها حكايةٌ يعرفها هواة الصنعة.', 'Forty-five timepieces from eight maisons, spanning seven decades — each shown with His Highness, each a story the connoisseurs of the craft already know.', 'class="lede"')}
</section>
<section class="films on-night" id="films" aria-labelledby="filmsTitle">
<div class="inner center">
${b('p', 'بعدسة الإعلام', 'Through the media’s lens', 'class="label"')}
${b('h2', 'المجموعة بعدسة الإعلام.', 'The collection, through the media’s lens.', 'class="title" id="filmsTitle"')}
</div>
<div class="film-grid">
<figure class="film" data-film="Air31Kly7Ys"><div class="film-frame"><img src="/images/sheikh/sheikh-portrait-1.webp" alt="" width="840" height="1280" loading="lazy"><button type="button" class="film-play" aria-label="شاهد الفيلم الأول" data-label-ar="شاهد الفيلم الأول" data-label-en="Watch the first film"><span class="ring" aria-hidden="true"></span>${b('span', 'الفيلم الأول', 'Film I', 'class="film-name"')}</button></div></figure>
<figure class="film" data-film="HFt8kspnTwg"><div class="film-frame"><img src="/images/sheikh-examining-watches.webp" alt="" width="1179" height="1607" loading="lazy"><button type="button" class="film-play" aria-label="شاهد الفيلم الثاني" data-label-ar="شاهد الفيلم الثاني" data-label-en="Watch the second film"><span class="ring" aria-hidden="true"></span>${b('span', 'الفيلم الثاني', 'Film II', 'class="film-name"')}</button></div></figure>
</div>
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
  titleAr: 'المعرض | الشيخ عمّار بن حميد النعيمي', titleEn: 'The Exhibition | Sheikh Ammar bin Humaid Al Nuaimi',
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
// Each row keeps its public source as provenance in this file; by the owner's direction
// (29 Sep 2026) no outbound link is rendered on the page.
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
  titleAr: 'صاحب السمو | الشيخ عمّار بن حميد النعيمي', titleEn: 'His Highness | Sheikh Ammar bin Humaid Al Nuaimi',
  descAr: 'سيرة صاحب السمو الشيخ عمّار بن حميد النعيمي، ولي عهد عجمان ورئيس المجلس التنفيذي.',
  main: `<section class="portrait-hero" id="biography" aria-labelledby="bioTitle">
<figure><img src="/images/sheikh/sheikh-portrait-2.jpg" alt="صاحب السمو الشيخ عمّار بن حميد النعيمي" data-alt-ar="صاحب السمو الشيخ عمّار بن حميد النعيمي" data-alt-en="His Highness Sheikh Ammar bin Humaid Al Nuaimi" width="891" height="768" fetchpriority="high"></figure>
<div class="words">
${b('p', 'صاحب السمو', 'His Highness', 'class="label"')}
${b('h1', 'سمو الشيخ عمّار<br>بن حميد النعيمي', 'His Highness Sheikh Ammar<br>bin Humaid Al Nuaimi', 'class="display" id="bioTitle"')}
${b('p', 'ولي عهد عجمان · رئيس المجلس التنفيذي', 'Crown Prince of Ajman · Chairman of the Executive Council', 'class="role"')}
${b('p', 'وُلد في عجمان في 31 مارس 1969. تلقّى تعليمه في مدارس الإمارة، والتحق بالدفعة الأولى من كلية الشرطة، ثم واصل التدريب المتخصص في المملكة المتحدة.', 'Born in Ajman on 31 March 1969. Educated in the emirate, he joined the first cohort of the Police College and later undertook specialist training in the United Kingdom.', 'class="body-2"')}
</div>
</section>
<section class="section stone center" aria-label="الوقت والقيادة" data-label-ar="الوقت والقيادة" data-label-en="Time and leadership">
<div class="inner center">
${b('p', 'الوقت والقيادة', 'Time and leadership', 'class="label"')}
<blockquote class="epigraph">
<p class="verse" lang="ar" dir="rtl">الوقتُ انعكاسٌ للقيادة<br>والانضباط والوعي الراقي.</p>
<p class="verse-rendering" dir="ltr">Time is a reflection of leadership,<br>of discipline, and of a refined awareness.</p>
</blockquote>
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
<article><span class="index" aria-hidden="true">03</span>${b('h3', 'عينٌ على الحِرفة', 'An eye for craft')}${b('p', 'وتسجّل السيرة ذاتها اهتمامه بصناعة الساعات والمهارة الحرفية. من هنا تعبر الزيارة إلى الميناء والحركة، والتفاصيل التي تمنح كل قطعة هويتها. ذائقةٌ يعرفها هواة الصنعة ويقدّرونها، ومجموعةٌ تضع اسمه بين قلّةٍ جمعوا مثلها.', 'The same biography records an interest in horology and craftsmanship. From here the visit continues through dials, movements and the details that give each timepiece its identity. A discernment the craft’s connoisseurs recognise and admire — a collection that places his name among the very few who have assembled one like it.')}</article>
</div>
</section>
<section class="section white" aria-labelledby="milestonesTitle">
<div class="inner center">
${b('p', 'محطات في المسيرة', 'Milestones', 'class="label"')}
${b('h2', 'من الجذور، إلى المستقبل.', 'Rooted in heritage. Looking ahead.', 'class="title" id="milestonesTitle"')}
</div>
<ol class="timeline bio-timeline">
${timeline.map(([year, tAr, tEn, pAr, pEn, src]) => `<li><time datetime="${year}" data-year="${year}">${arabicDigits(year)}</time><div>${b('h3', tAr, tEn)}${b('p', pAr, pEn)}</div></li>`).join('\n')}
</ol>
<p class="center" style="margin-top:3.5rem"><a class="button" href="/collection/">${b('span', 'اكتشف المجموعة', 'Discover the collection')}</a></p>
</section>`
});

// ————— Watchmaking —————
const anatomy = [
  ['العلبة', 'Case', 'الهيكل الذي يحمي الحركة ويحدد حضور الساعة على المعصم؛ قد يُصنع من الفولاذ أو الذهب أو التيتانيوم أو السيراميك أو الياقوت الصناعي.', 'The structure that protects the movement and defines the watch on the wrist; crafted in steel, gold, titanium, ceramic or sapphire.', 'case'],
  ['الإطار', 'Bezel', 'الحلقة المحيطة بالزجاج؛ قد تكون ثابتة أو دوّارة، أو تحمل مقياساً مثل التاكيمتر.', 'The ring surrounding the crystal; fixed or rotating, or carrying a scale such as a tachymeter.', 'bezel'],
  ['الزجاج', 'Crystal', 'السطح الشفاف الذي يحمي الميناء؛ والياقوت الصناعي هو الاختيار الشائع في صناعة الساعات الراقية.', 'The transparent surface protecting the dial; sapphire crystal is the standard of Haute Horlogerie.', 'crystal'],
  ['الميناء', 'Dial', 'الوجه البصري للقطعة: المؤشرات والأرقام والعدّادات والفتحات التي تنظّم قراءة الوقت والتعقيدات.', 'The visual face of the timepiece: markers, numerals, counters and apertures that organise time and complications.', 'dial'],
  ['العقارب', 'Hands', 'تنقل قراءة الساعات والدقائق والثواني، وقد تحمل وظائف إضافية مثل توقيت الكرونوغراف أو المنطقة الزمنية الثانية.', 'They indicate hours, minutes and seconds, and may carry further functions such as chronograph timing or a second time zone.', 'hands'],
  ['التاج والأزرار', 'Crown & pushers', 'التاج لضبط الوقت والتعبئة؛ والأزرار تتحكم بوظائف مثل بدء الكرونوغراف وإيقافه وإعادته إلى الصفر.', 'The crown sets and winds the watch; pushers start, stop and reset functions such as the chronograph.', 'crown'],
  ['العيار', 'Calibre', 'الهوية الميكانيكية للحركة: هندستها وبنيتها وترددها وطريقة تعبئتها وتعقيداتها.', 'The mechanical identity of the movement: its architecture, frequency, winding system and complications.', 'calibre'],
  ['نظام الإفلات', 'Escapement', 'ينظّم انتقال الطاقة إلى عجلة الاتزان على دفعات دقيقة، وهو من أساسيات ضبط الوقت الميكانيكي.', 'It meters energy to the balance in controlled impulses — the foundation of mechanical timekeeping.', 'escapement'],
  ['عجلة الاتزان والنابض الشعري', 'Balance & hairspring', 'منظومة تنظيم الحركة؛ تتذبذب بإيقاع منتظم يحدد معدّل سير الساعة ودقتها.', 'The regulating oscillator, whose steady oscillation governs the rate of the timepiece.', 'balance'],
  ['برميل النابض', 'Mainspring barrel', 'يخزّن الطاقة في النابض الرئيسي ويطلقها تدريجياً لتشغيل الحركة.', 'It stores energy in the mainspring and releases it progressively to power the movement.', 'barrel'],
  ['الدوّار', 'Rotor', 'كتلة متحركة في الحركة ذاتية التعبئة تدور مع حركة المعصم لتعبئة النابض الرئيسي.', 'A weighted mass in a self-winding movement that turns with the wrist to wind the mainspring.', 'rotor'],
  ['الجسور والجواهر', 'Bridges & jewels', 'تثبّت مكونات الحركة وتدعم محاورها؛ وتقلل الجواهر الاصطناعية الاحتكاك في النقاط الدقيقة.', 'Bridges support the movement’s architecture, while synthetic jewels reduce friction at critical pivots.', 'bridges']
];
// Parts visible only from the caseback; clicking one of these flips the stage.
const BACK_PARTS = new Set(['calibre', 'escapement', 'balance', 'barrel', 'rotor', 'bridges']);
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
// ————— the anatomy stage: a still illustration, not any one maison's watch, that
// turns to its caseback for the six parts you can only see there. Pure line art —
// no library, no engine, the same technique as the live dial above it. —————
const polar = (cx, cy, r, deg) => { const a = (deg - 90) * Math.PI / 180; return [(cx + r * Math.cos(a)).toFixed(1), (cy + r * Math.sin(a)).toFixed(1)]; };
const dialTicks = Array.from({ length: 12 }, (_, i) => {
  const [x1, y1] = polar(200, 200, 138, i * 30), [x2, y2] = polar(200, 200, i % 3 === 0 ? 122 : 128, i * 30);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${i % 3 === 0 ? 2 : 1}"/>`;
}).join('');
const bezelTicks = Array.from({ length: 60 }, (_, i) => {
  const [x1, y1] = polar(200, 200, 176, i * 6), [x2, y2] = polar(200, 200, i % 5 ? 182 : 186, i * 6);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${i % 5 ? .5 : 1.3}"/>`;
}).join('');
// N°1–N°12: numbered hotspots pinned to each part's place on the drawing
const HOTSPOTS = { case: [62, 330], bezel: [72, 72], crystal: [138, 124], dial: [200, 300], hands: [176, 168], crown: [356, 200],
  calibre: [200, 336], escapement: [196, 246], balance: [138, 262], barrel: [262, 146], rotor: [286, 214], bridges: [158, 108] };
const hotspots = front => anatomy.map(([ar, en, , , part], i) => ({ part, i })).filter(({ part }) => BACK_PARTS.has(part) !== front)
  .map(({ part, i }) => { const [x, y] = HOTSPOTS[part]; return `<g class="hotspot" data-part="${part}" data-n="${i + 1}" transform="translate(${x} ${y})"><circle class="hot-hit" r="24"/><circle class="hot-dot" r="12"/><text y="4.5" data-num="${i + 1}">${i + 1}</text></g>`; }).join('');
const stageFace = (side) => {
  const front = side === 'front';
  const body = front ? `
<g class="part" data-part="crystal"><circle cx="200" cy="200" r="150" fill="url(#sheen)" stroke="none"/></g>
<g class="part" data-part="bezel"><circle cx="200" cy="200" r="179" stroke-width="1" opacity=".8"/>${bezelTicks}</g>
<g class="part" data-part="dial"><circle cx="200" cy="200" r="150" fill="var(--night)" stroke-width="1"/>${dialTicks}</g>
<g class="part" data-part="hands">
  <line x1="200" y1="200" x2="163" y2="150" stroke-width="4" stroke-linecap="round"/>
  <line x1="200" y1="200" x2="237" y2="118" stroke-width="2.6" stroke-linecap="round"/>
  <circle cx="200" cy="200" r="4" fill="currentColor" stroke="none"/>
</g>
<g class="part" data-part="crown">
  <rect x="345" y="188" width="20" height="24" rx="3"/>
  <rect x="336" y="150" width="14" height="20" rx="2.5"/>
  <rect x="336" y="230" width="14" height="20" rx="2.5"/>
</g>` : `
<g class="part" data-part="calibre"><circle cx="200" cy="200" r="150" fill="var(--night-2)" stroke-width="1"/></g>
<g class="part" data-part="bridges">
  <path d="M96 150 A150 150 0 0 1 232 92" fill="none" stroke-width="10" opacity=".85"/>
  <path d="M120 292 A150 150 0 0 0 300 230" fill="none" stroke-width="10" opacity=".85"/>
  <circle cx="118" cy="146" r="4" fill="#b5493f" stroke="none"/><circle cx="200" cy="96" r="4" fill="#b5493f" stroke="none"/>
  <circle cx="145" cy="284" r="4" fill="#b5493f" stroke="none"/><circle cx="288" cy="236" r="4" fill="#b5493f" stroke="none"/>
</g>
<g class="part" data-part="rotor"><path d="M200 200 L200 62 A138 138 0 0 1 319 268 Z" opacity=".55"/><circle cx="200" cy="200" r="6" fill="currentColor" stroke="none"/></g>
<g class="part" data-part="balance">
  <circle cx="140" cy="260" r="30" stroke-width="1.4"/>
  <line x1="140" y1="230" x2="140" y2="290" stroke-width="1"/><line x1="110" y1="260" x2="170" y2="260" stroke-width="1"/>
  <path d="M140 260 m-16 0 a16 16 0 1 1 32 0" fill="none" stroke-width=".8" opacity=".7"/>
</g>
<g class="part" data-part="escapement"><path d="M182 232 q-10 14 2 26 q16 8 24 -6 q-14 4 -20 -6 q-6 -10 -6 -14z" opacity=".85"/></g>
<g class="part" data-part="barrel">
  <circle cx="262" cy="146" r="28" stroke-width="1.2"/>
  <circle cx="262" cy="146" r="19" stroke-width=".7" opacity=".7"/><circle cx="262" cy="146" r="10" stroke-width=".7" opacity=".7"/>
</g>`;
  return `<svg class="face ${front ? 'front' : 'back'}" viewBox="0 0 400 400" fill="none" stroke="#d8bd8a" aria-hidden="true">${front ? '<defs><radialGradient id="sheen" cx="35%" cy="30%" r="75%"><stop offset="0%" stop-color="#3a362d" stop-opacity=".35"/><stop offset="60%" stop-color="#3a362d" stop-opacity="0"/></radialGradient></defs>' : ''}
<circle class="part" data-part="case" cx="200" cy="200" r="192" stroke-width="6"/>
${body}
<g class="hotspots">${hotspots(front)}</g>
</svg>`;
};
const watchStage = `<div class="stage" id="watchStage"><div class="stage-inner" id="stageInner">${stageFace('front')}${stageFace('back')}</div></div>`;
// ————— the time machine: one watch, drawn once —————
// Ticks at 28,800 vph in Ajman time until a hand touches it; then the crown sets the
// hands through the years the models in the collection were introduced (1954→2025).
// Pure SVG. Required ids: #hourHand #minuteHand #secondHand #yearWindow #crown #eraHand.
const tmPolar = (r, deg, cx = 200, cy = 200) => { const a = (deg - 90) * Math.PI / 180; return [+(cx + r * Math.cos(a)).toFixed(2), +(cy + r * Math.sin(a)).toFixed(2)]; };
const tmLine = (r1, r2, deg, w, extra = '') => { const [x1, y1] = tmPolar(r1, deg), [x2, y2] = tmPolar(r2, deg); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${w}"${extra}/>`; };
const tmSunburst = Array.from({ length: 144 }, (_, i) => tmLine(8, 158, i * 2.5, .5)).join('');
const tmRings = Array.from({ length: 12 }, (_, i) => `<circle cx="200" cy="200" r="${38 + i * 10}" stroke-width=".35"/>`).join('');
const tmTrack = Array.from({ length: 60 }, (_, i) => tmLine(i % 5 ? 170 : 166, 176, i * 6, i % 5 ? .6 : 1.4)).join('');
const tmIndices = Array.from({ length: 12 }, (_, i) => {
  if (i === 0) return [-4.2, 4.2].map(d => { const [x, y] = tmPolar(141, d); return `<rect x="${x - 3}" y="${y - 12}" width="6" height="24" rx="1" transform="rotate(${d} ${x} ${y})"/>`; }).join('');
  if (i === 3) return ''; // the crown side stays clear
  if (i === 6) return ''; // the year aperture sits at six
  if (i === 9) return ''; // the era register sits at nine
  const [x, y] = tmPolar(141, i * 30); return `<rect x="${x - 3}" y="${y - 12}" width="6" height="24" rx="1" transform="rotate(${i * 30} ${x} ${y})"/>`;
}).join('');
const TM_DECADES = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
const tmEraTicks = TM_DECADES.map((_, i) => { const d = -120 + i * (240 / 7); const [x1, y1] = tmPolar(22, d, 124, 200), [x2, y2] = tmPolar(28, d, 124, 200); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${i % 2 ? .6 : 1.1}"/>`; }).join('');
const tmDigits = [0, 1, 2, 3].map(c => `<g class="tm-digit" data-col="${c}" transform="translate(0 0)">${Array.from({ length: 10 }, (_, d) => `<text x="${170 + c * 20}" y="${282 + d * 34}" data-d="${d}">${d}</text>`).join('')}</g>`).join('');
const tmKnurl = Array.from({ length: 14 }, (_, i) => `<line x1="398" x2="428" y1="${176 + i * 4}" y2="${176 + i * 4}"/>`).join('');
const timeMachineSVG = `<svg class="tm-watch" id="timeMachine" viewBox="0 0 440 400" role="slider" tabindex="0" aria-valuemin="1954" aria-valuemax="2025" aria-valuenow="2025" aria-label="آلة الزمن — أدِر التاج لتختار عاماً" data-label-ar="آلة الزمن — أدِر التاج لتختار عاماً" data-label-en="The time machine — turn the crown to choose a year">
<defs>
<linearGradient id="tmMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8a7046"/><stop offset=".45" stop-color="#e6cf9f"/><stop offset=".55" stop-color="#b8975f"/><stop offset="1" stop-color="#5d4a2c"/></linearGradient>
<radialGradient id="tmDialFill" cx="42%" cy="36%" r="70%"><stop offset="0" stop-color="#23201b"/><stop offset=".7" stop-color="#121110"/><stop offset="1" stop-color="#0b0a09"/></radialGradient>
<radialGradient id="tmGlass" cx="30%" cy="22%" r="60%"><stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient>
<clipPath id="tmDialClip"><circle cx="200" cy="200" r="158"/></clipPath>
<clipPath id="tmYearClip"><rect x="160" y="258" width="80" height="32" rx="2"/></clipPath>
<clipPath id="tmCrownClip"><rect x="396" y="176" width="34" height="48" rx="6"/></clipPath>
</defs>
<g class="tm-crown" id="crown">
<rect class="tm-stem" x="386" y="192" width="16" height="16" fill="url(#tmMetal)"/>
<rect x="396" y="176" width="34" height="48" rx="6" fill="url(#tmMetal)"/>
<g clip-path="url(#tmCrownClip)" stroke="#3b2f1c" stroke-width="1.2" opacity=".75"><g class="tm-knurl" id="tmKnurl">${tmKnurl}</g></g>
<rect class="tm-crown-hit" x="374" y="150" width="66" height="100" fill="transparent" stroke="none"/>
</g>
<circle cx="200" cy="200" r="194" fill="url(#tmMetal)"/>
<circle cx="200" cy="200" r="186" fill="#16140f"/>
<g class="tm-track" stroke="#d8bd8a" opacity=".85">${tmTrack}</g>
<circle cx="200" cy="200" r="160" fill="url(#tmDialFill)"/>
<g class="tm-guilloche" clip-path="url(#tmDialClip)" stroke="var(--era-line, #d8bd8a)" opacity=".16">${tmSunburst}${tmRings}</g>
<g class="tm-indices" fill="url(#tmMetal)">${tmIndices}</g>
<text class="tm-mono" x="200" y="104" text-anchor="middle">ع</text>
<g class="tm-era-register" stroke="#d8bd8a" fill="none"><circle cx="124" cy="200" r="30" stroke-width=".8" opacity=".6"/>${tmEraTicks}<g id="eraHand"><line x1="124" y1="200" x2="124" y2="176" stroke-width="1.6" stroke-linecap="round"/><circle cx="124" cy="200" r="3" fill="#d8bd8a" stroke="none"/></g></g>
<rect x="156" y="254" width="88" height="40" rx="3" fill="url(#tmMetal)"/>
<rect x="160" y="258" width="80" height="32" rx="2" fill="#f3efe7"/>
<g class="tm-year" id="yearWindow" clip-path="url(#tmYearClip)">${tmDigits}</g>
<g id="hourHand" class="tm-hand"><polygon points="200,214 193,200 200,108 207,200" fill="url(#tmMetal)"/></g>
<g id="minuteHand" class="tm-hand"><polygon points="200,218 196,200 200,58 204,200" fill="url(#tmMetal)"/></g>
<g id="secondHand" class="tm-hand"><line x1="200" y1="238" x2="200" y2="52" stroke="#f3efe7" stroke-width="1.1"/><circle cx="200" cy="228" r="4.5" fill="#f3efe7"/></g>
<circle cx="200" cy="200" r="6" fill="url(#tmMetal)"/><circle cx="200" cy="200" r="2" fill="#16140f"/>
<circle cx="200" cy="200" r="160" fill="url(#tmGlass)" pointer-events="none"/>
</svg>`;

const watchmaking = shell({
  page: 'watchmaking', route: '/watchmaking/',
  titleAr: 'صناعة الساعات | الشيخ عمّار بن حميد النعيمي', titleEn: 'Watchmaking | Sheikh Ammar bin Humaid Al Nuaimi',
  descAr: 'فن صناعة الساعات — دليل ثنائي اللغة إلى تشريح الساعة والتعقيدات وقراءة السجل التقني.',
  main: `<section class="craft-hero on-night" aria-labelledby="craftTitle">
<canvas class="dust" id="tmDust" aria-hidden="true"></canvas>
<div class="craft-words">
${b('p', 'فن صناعة الساعات', 'The Art of Watchmaking', 'class="label"')}
${b('h1', 'قطعٌ تتجاوز الزمن.', 'Timeless timepieces.', 'class="display" id="craftTitle"')}
<p class="craft-manifesto" data-ar="واحدةٌ من قِلّة." data-en="One of not many">واحدةٌ من قِلّة.</p>
${b('p', 'من الميناء إلى نظام الإفلات، ومن التوربيون إلى مُكرِّر الدقائق: دليلٌ يعيدك إلى كل قطعة بعينٍ أدقّ.', 'From dial to escapement, from tourbillon to minute repeater: a guide that returns you to each timepiece with a keener eye.', 'class="body-2"')}
<a class="link" href="#anatomy">${b('span', 'اكتشف تشريح القطعة', 'Discover the anatomy')}<span aria-hidden="true">↓</span></a>
</div>
<div class="tm" id="tm">
${timeMachineSVG}
<div class="tm-caption">
<p class="tm-era" id="eraCaption" aria-live="polite"></p>
<p class="tm-hint" id="tmHint" data-ar="أدِر التاج — أو الميناء — لتسافر عبر السنين التي طُرحت فيها طُرز مجموعته." data-en="Turn the crown — or the dial — to travel through the years the models in his collection were introduced.">أدِر التاج — أو الميناء — لتسافر عبر السنين التي طُرحت فيها طُرز مجموعته.</p>
<button type="button" class="tm-now" id="tmNow" hidden>${b('span', 'عودة إلى الآن', 'Return to the present')}</button>
</div>
</div>
<nav class="era-rail" id="eraRail" aria-label="العقود" data-label-ar="العقود" data-label-en="The decades"></nav>
<div class="era-cards" id="eraCards" aria-live="polite"></div>
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
${b('p', 'من الميناء والعقارب إلى العيار ونظام الإفلات، لكل جزء وظيفته وحضوره في شخصية الساعة. اختر جزءاً لتراه في موضعه.', 'From dial and hands to calibre and escapement, every component has a function and a place in the character of a timepiece. Choose a part to see it in place.', 'class="body-2" style="margin-inline:auto"')}
</div>
<div class="anatomy-layout">
<div class="stage-col">
${watchStage}
<p class="stage-caption" id="stageCaption" aria-live="polite"></p>
</div>
<div class="anatomy anatomy-grid" id="anatomyGrid">
${anatomy.map(([ar, en, pAr, pEn, part], i) => `<article><button type="button" class="anatomy-card" data-part="${part}" data-n="${i + 1}" aria-pressed="false" aria-describedby="stageCaption">${b('span', arabicDigits(String(i + 1).padStart(2, '0')), 'N° ' + String(i + 1).padStart(2, '0'), 'class="num" aria-hidden="true"')}${b('h3', ar, en)}${b('p', pAr, pEn)}</button></article>`).join('\n')}
</div>
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
${b('p', 'صاحب السمو', 'His Highness', 'class="label"')}
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
