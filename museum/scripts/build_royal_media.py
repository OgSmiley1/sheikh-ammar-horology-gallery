"""Build the royal image set: every timepiece shown with H.H. Sheikh Ammar.

Outputs museum/dist/assets/royal/<slug>.webp (800x800) and writes
`royalImage` / `royalPairing` into museum/dist/watches.json.

Three kinds of source, never mixed up:
  diptych     archive split-screen collage (photo of His Highness | watch on black).
              Re-cut at the seam so the spotter badge that straddles it is dropped.
  photograph  a single photograph that already shows His Highness with the piece.
  portrait    no photograph of him with this piece exists in the archive, so an
              official portrait is set beside the maker's image. The site labels
              these honestly; the portrait never implies he is wearing the piece.

Nothing here retouches his face. Requires Pillow.  Run from the repo root:
  python3 museum/scripts/build_royal_media.py
"""
import json
from pathlib import Path
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
DIST = ROOT / 'museum' / 'dist'
OUT = DIST / 'assets' / 'royal'
SIZE = 800
HALF = SIZE // 2
SEAM_CLEAR = 18  # the badge is a ~36px disc centred on the seam

# Person-panel crop box inside the 400x800 left half, where the default crops badly.
PERSON_CROP = {
    # a child stands in the left of this frame; keep only His Highness
    'patek-philippe-world-time-5230g-011-manama': (150, 0, 400 - SEAM_CLEAR, 800),
    # a second man stands at the left edge
    'richard-mille-rm-67-02-alexis-pinturault': (120, 0, 400 - SEAM_CLEAR, 800),
}

# Maker images whose background removal left edge streaks: frame the watch by hand
# (fractions of width/height).
WATCH_BOX = {
    'patek-philippe-grand-complications-minute-repeater': (0.12, 0.0, 0.735, 0.93),
    'patek-philippe-grand-complications-110th-second-monopusher-chronograph': (0.14, 0.0, 0.81, 0.92),
    'audemars-piguet-royal-oak-perpetual-calendar-rd2-ultra-thin': (0.08, 0.0, 0.855, 1.0),
    'patek-philippe-aquanaut': (0.15, 0.0, 0.79, 0.95),
    'fp-journe-ffc-francis-ford-coppola-calibre-13003': (0.41, 0.08, 0.61, 0.97),
}

PHOTOGRAPHS = {
    'rolex-daytona-diw-motley-carbon': ('museum/dist/assets/watches/rolex-daytona-diw-motley-carbon.webp', 'cover-top'),
    'fp-journe-tourbillon-souverain': ('museum/dist/assets/watches/fp-journe-tourbillon-souverain.webp', 'cover'),
    'patek-philippe-calatrava': ('museum/dist/assets/watches/patek-philippe-calatrava.webp', 'cover'),
    # square from the top drops the publisher mark in the lower corner
    'artisans-de-geneve-andrea-pirlo-rolex-submariner': ('museum/dist/assets/watches/andrea-pirlo-submariner.jpg', (0, 0, 1020, 1020)),
    # one photograph, re-cut as a diptych: His Highness (right of frame) | the dragon dial (left)
    'rolex-6100-chinese-dragon-cloisonne': ('museum/dist/assets/watches/rolex-6100-sheikh-original.jpg', ('split', (480, 0, 1262, 835), (0.62, 0.3), (40, 0, 480, 835))),
    # owner-supplied 24 Sept 2026; publisher mark left intact rather than retouch his face
    'lederer-cic-39-inverto-titanium': ('museum/source-media/lederer-cic-39-sheikh-ammar.jpg', 'cover-top'),
}

# (source, pre-crop box as fractions or None, cover focus). Nine distinct framings so
# no two neighbouring records repeat the same picture of His Highness.
PORTRAITS = [
    ('museum/dist/images/sheikh/sheikh-portrait-1.webp', None, (0.5, 0.35)),
    ('museum/dist/images/sheikh-examining-watches.webp', None, (0.5, 0.5)),
    ('museum/dist/images/sheikh/sheikh-portrait-2.jpg', None, (0.45, 0.5)),
    ('museum/dist/images/sheikh/sheikh-portrait-1.webp', (0.0, 0.05, 0.78, 0.8), (0.55, 0.3)),
    ('museum/dist/images/sheikh/sheikh-portrait-1.webp', (0.1, 0.0, 0.95, 0.6), (0.5, 0.2)),
    ('museum/dist/images/sheikh-examining-watches.webp', (0.22, 0.04, 0.82, 0.72), (0.5, 0.35)),
    ('museum/dist/images/sheikh/sheikh-portrait-2.jpg', (0.2, 0.0, 0.75, 1.0), (0.5, 0.5)),
    ('museum/dist/images/sheikh/sheikh-portrait-1.webp', (0.0, 0.25, 1.0, 1.0), (0.5, 0.2)),
    ('museum/dist/images/sheikh/sheikh-portrait-2.jpg', (0.3, 0.05, 0.62, 0.95), (0.5, 0.4)),
]


def cover(im, w, h, focus=(0.5, 0.5)):
    scale = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    x = round((im.width - w) * focus[0])
    y = round((im.height - h) * focus[1])
    return im.crop((x, y, x + w, y + h))


def contain_on_blur(im, w, h):
    back = cover(im, w, h).filter(ImageFilter.GaussianBlur(28))
    scale = min(w / im.width, h / im.height)
    fg = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    back.paste(fg, ((w - fg.width) // 2, (h - fg.height) // 2))
    return back


def trim_to_watch(im):
    """Crop a maker's image to the watch, ignoring flat background and edge artefacts."""
    rgb = im.convert('RGB')
    bg = rgb.getpixel((2, 2))
    px = rgb.load()
    w, h = rgb.size
    xs, ys = [], []
    for y in range(0, h, 3):
        for x in range(0, w, 3):
            p = px[x, y]
            if sum(abs(p[i] - bg[i]) for i in range(3)) > 60:
                xs.append(x); ys.append(y)
    if not xs:
        return rgb, bg
    xs.sort(); ys.sort()
    # trimmed percentiles so stray lines at the edges do not widen the box
    x0, x1 = xs[len(xs) // 50], xs[-len(xs) // 50 - 1]
    y0, y1 = ys[len(ys) // 200], ys[-len(ys) // 200 - 1]
    pad = 12
    return rgb.crop((max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad))), bg


def watch_panel(slug, src):
    im = Image.open(src).convert('RGB')
    if slug in WATCH_BOX:
        f = WATCH_BOX[slug]
        watch = im.crop((round(f[0] * im.width), round(f[1] * im.height), round(f[2] * im.width), round(f[3] * im.height)))
        bg = watch.getpixel((2, 2))
    else:
        watch, bg = trim_to_watch(im)
    panel = Image.new('RGB', (HALF, SIZE), bg)
    scale = min((HALF - 40) / watch.width, (SIZE - 120) / watch.height)
    watch = watch.resize((round(watch.width * scale), round(watch.height * scale)), Image.LANCZOS)
    panel.paste(watch, ((HALF - watch.width) // 2, (SIZE - watch.height) // 2))
    return panel


def diptych(slug, src):
    im = Image.open(src).convert('RGB')
    person = im.crop(PERSON_CROP.get(slug, (0, 0, HALF - SEAM_CLEAR, SIZE)))
    person = cover(person, HALF, SIZE)
    watch = im.crop((HALF + SEAM_CLEAR, 0, SIZE, SIZE))
    canvas = Image.new('RGB', (SIZE, SIZE), (0, 0, 0))
    canvas.paste(person, (0, 0))
    canvas.paste(watch, (HALF + SEAM_CLEAR, 0))
    return canvas


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    data_path = DIST / 'watches.json'
    data = json.loads(data_path.read_text())
    portrait_i = 0
    for w in data['watches']:
        slug = w['slug']
        display = DIST / w['displayImage'].lstrip('/')
        if slug in PHOTOGRAPHS:
            src, mode = PHOTOGRAPHS[slug]
            im = Image.open(ROOT / src).convert('RGB')
            if isinstance(mode, tuple) and mode[0] == 'split':
                _, person_box, focus, watch_box = mode
                out = Image.new('RGB', (SIZE, SIZE))
                out.paste(cover(im.crop(person_box), HALF, SIZE, focus), (0, 0))
                panel = cover(im.crop(watch_box), HALF, SIZE)
                out.paste(panel, (HALF, 0))
            elif isinstance(mode, tuple):
                out = im.crop(mode).resize((SIZE, SIZE), Image.LANCZOS)
            elif mode == 'contain':
                out = contain_on_blur(im, SIZE, SIZE)
            else:
                out = cover(im, SIZE, SIZE, (0.5, 0.0) if mode == 'cover-top' else (0.5, 0.5))
            pairing = 'photograph'
        elif display.name.endswith('_800x.webp'):
            out = diptych(slug, display)
            pairing = 'photograph'
        else:
            src, box, focus = PORTRAITS[portrait_i % len(PORTRAITS)]
            portrait_i += 1
            source = Image.open(ROOT / src).convert('RGB')
            if box:
                source = source.crop((round(box[0] * source.width), round(box[1] * source.height), round(box[2] * source.width), round(box[3] * source.height)))
            person = cover(source, HALF, SIZE, focus)
            out = Image.new('RGB', (SIZE, SIZE))
            out.paste(person, (0, 0))
            out.paste(watch_panel(slug, display), (HALF, 0))
            pairing = 'portrait'
        out.save(OUT / f'{slug}.webp', 'WEBP', quality=84, method=6)
        w['royalImage'] = f'/assets/royal/{slug}.webp'
        w['royalPairing'] = pairing
    data_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    counts = {}
    for w in data['watches']:
        counts[w['royalPairing']] = counts.get(w['royalPairing'], 0) + 1
    print('royal media built:', counts)


if __name__ == '__main__':
    main()
