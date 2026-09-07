from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance

OUTPUT = Path('/home/ubuntu/webdev-static-assets/cinematic-sheikh-frames')
OUTPUT.mkdir(parents=True, exist_ok=True)

SOURCES = [
    ('frame-01-dawn.jpg', Path('/home/ubuntu/sheikh-ammar-horology-gallery/client/public/sheikh-photos/sheikh-portrait-1.webp'), (0.50, 0.38)),
    ('frame-02-study.jpg', Path('/home/ubuntu/sheikh-ammar-horology-gallery/client/public/slideshow-optimized/13.webp'), (0.50, 0.50)),
    ('frame-03-continuity.jpg', Path('/home/ubuntu/upload/search_images/YbP9UDbesgzS.webp'), (0.59, 0.53)),
    ('frame-04-ceremony.jpg', Path('/home/ubuntu/upload/search_images/KHaNtc4Brd2x.webp'), (0.48, 0.50)),
]

TARGET = (1920, 1080)

for filename, source, focus in SOURCES:
    image = Image.open(source).convert('RGB')
    source_w, source_h = image.size
    target_ratio = TARGET[0] / TARGET[1]
    source_ratio = source_w / source_h
    if source_ratio > target_ratio:
        crop_h = source_h
        crop_w = int(crop_h * target_ratio)
    else:
        crop_w = source_w
        crop_h = int(crop_w / target_ratio)
    center_x = int(source_w * focus[0])
    center_y = int(source_h * focus[1])
    left = max(0, min(center_x - crop_w // 2, source_w - crop_w))
    top = max(0, min(center_y - crop_h // 2, source_h - crop_h))
    crop = image.crop((left, top, left + crop_w, top + crop_h)).resize(TARGET, Image.Resampling.LANCZOS)
    crop = ImageEnhance.Color(crop).enhance(0.82)
    crop = ImageEnhance.Contrast(crop).enhance(0.96)
    crop.save(OUTPUT / filename, quality=92, optimize=True)
