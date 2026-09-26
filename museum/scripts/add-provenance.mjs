// Gives every ledger record an explicit image class and a typed provenance trail,
// built only from evidence the repository already holds. Nothing is invented: an
// auction named in a record's text without a link is recorded as `cited-no-url`;
// anything resting on the owner's word is `owner-confirmed` once he has said so; a recorded link that nobody
// has re-checked is `url-cited`. Idempotent.
//   node scripts/add-provenance.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../dist/watches.json', import.meta.url);
const data = JSON.parse(readFileSync(file, 'utf8'));

// Official portraits used beside the maker's image for pieces with no wrist photograph.
const PORTRAIT_SOURCES = 'images/sheikh/sheikh-portrait-1.webp, images/sheikh/sheikh-portrait-2.jpg, images/sheikh-examining-watches.webp';
// 26 Sep 2026: the owner confirmed every photograph was gathered by him from public social media.
const ARCHIVE_PERMISSION = 'gathered by the owner from public social media; owner-confirmed 26 Sep 2026';
// Open identity questions found in audit; they travel with the record until resolved.
const REVIEW = {
  'rolex-daytona-paul-newman-6264-green-strap': 'Watch image resembles rolex-daytona-6241-john-player-special (same black-and-gold dial, different strap). Identity to be confirmed by owner or expert (audit 26 Sep 2026).',
  'rolex-daytona-6241-john-player-special': 'Watch image resembles rolex-daytona-paul-newman-6264-green-strap (same black-and-gold dial, different strap). Identity to be confirmed by owner or expert (audit 26 Sep 2026).'
};
const AUCTION_HOUSES = [['Christie', "Christie's"], ['Sotheby', "Sotheby's"], ['Phillips', 'Phillips']];

for (const w of data.watches) {
  const portrait = w.royalPairing === 'portrait';
  w.imageClass = portrait ? 'portrait_pair' : 'wrist';
  w.wornClaim = !portrait;
  const trail = [];

  // 1. Where the royal image comes from.
  if (portrait) {
    trail.push({ type: 'owner_archive', subject: 'portrait', source: PORTRAIT_SOURCES, url: null, date: null, permission: ARCHIVE_PERMISSION, status: 'owner-confirmed' });
    trail.push({ type: 'manufacturer', subject: 'watch image', source: w.mediaNoteEn || 'maker model image', url: null, date: null, permission: 'maker publicity image; editorial use', status: 'cited-no-url' });
  } else if (w.slug === 'lederer-cic-39-inverto-titanium') {
    trail.push({ type: 'owner_archive', subject: 'photograph', source: 'source-media/lederer-cic-39-sheikh-ammar.jpg (supplied in session, 24 Sep 2026; publisher mark present)', url: null, date: '2026-09-24', permission: ARCHIVE_PERMISSION, status: 'owner-confirmed' });
  } else {
    const origin = w.mediaNoteEn || 'watch-spotter collage from the owner archive';
    trail.push({ type: 'owner_archive', subject: 'photograph', source: `archive ${String(w.displayImage || '').split('/').pop()} (${origin})`, url: null, date: null, permission: ARCHIVE_PERMISSION, status: 'owner-confirmed' });
  }

  // 2. Identity and history: only sources the record already cites.
  for (const url of [].concat(w.sourceUrls || [])) {
    const type = /christies|sothebys|phillips/.test(url) ? 'auction' : 'sighting_report';
    trail.push({ type, subject: 'identity', source: new URL(url).hostname.replace(/^www\./, ''), url, date: null, permission: 'public editorial reference', status: 'url-cited' }); // link recorded; not fetched (egress blocked where this ran)
  }
  const text = [w.descriptionEn, w.storyEn].filter(Boolean).join(' ');
  for (const [needle, name] of AUCTION_HOUSES) {
    if (text.includes(needle) && !trail.some(p => p.source.toLowerCase().includes(needle.toLowerCase())))
      trail.push({ type: 'auction', subject: 'identity', source: `${name} catalogue (cited in record text)`, url: null, date: null, permission: 'public editorial reference', status: 'cited-no-url' });
  }
  w.provenance = trail;
  if (REVIEW[w.slug]) w.identityReview = REVIEW[w.slug]; else delete w.identityReview;
}

writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
const all = data.watches.flatMap(w => w.provenance);
const by = k => all.reduce((m, p) => (m[p[k]] = (m[p[k]] || 0) + 1, m), {});
console.log('provenance written for', data.watches.length, 'records', by('status'), by('type'));
