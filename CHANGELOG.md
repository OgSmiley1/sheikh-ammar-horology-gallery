# Changelog

All notable changes to Sheikh Ammar's Royal Horology Collection will be documented in this file.

## [Unreleased]

### Hero Slideshow Refinement – Phases 1-5 Complete (2025-11-05)

**Commit:** `393ddaf2` → (current working state)

#### ✅ Phase 1-4: Accessibility, Performance, and Desktop Layout (Checkpoint: 393ddaf2)

**Accessibility Improvements:**
- Added descriptive alt text to all images (Sheikh and watch images)
- Implemented ARIA labels on all navigation controls (prev/next buttons, slide indicators)
- Added keyboard navigation support (←/→ arrows to navigate, Space to pause/resume)
- Implemented visible focus rings (2px gold ring with offset) for keyboard users
- Added `aria-current` for active slide indicator

**User Interactions:**
- Pause on hover functionality (autoplay pauses when mouse hovers over slideshow)
- Touch swipe gestures for mobile (swipe left/right with 50px minimum distance threshold)
- Keyboard controls for navigation and pause/resume
- Pause on manual navigation (prevents jarring transitions)

**Performance Optimizations:**
- Changed image loading from `loading="eager"` to `loading="lazy"`
- Added `decoding="async"` to all images for non-blocking decode
- Implemented next slide image preloading for smoother transitions
- Added `prefers-reduced-motion` check to disable autoplay for users who prefer reduced motion

**Desktop Layout:**
- Content band overlays at bottom-center on desktop (≥1024px)
- Glass morphism effect: `backdrop-blur-xl` + semi-transparent background (`bg-[#0a0a0a]/80`)
- Gold border (`border-[#d4af37]/20`) and shadow (`shadow-2xl`) for depth
- Proper z-index layering (content band z-10, navigation z-20)

#### ✅ Phase 5: Mobile Layout Fix (Current Working State)

**Two-Variant Content Band Implementation:**
- Created separate mobile and desktop content bands to eliminate overlay bleed on mobile devices
- **Mobile (<1024px):** Content band positioned below images with `lg:hidden`, no overlay, clean stacking layout
- **Desktop (≥1024px):** Glass/blur overlay with `hidden lg:block lg:absolute`, centered at bottom with proper positioning
- Guard against bleed: Used `lg:absolute` (no unprefixed `absolute` classes)
- Confirmed positioned ancestor only on desktop (`lg:relative` wrapper)
- Verified Tailwind breakpoints (lg=1024px) and viewport meta tag present
- Set proper z-index: desktop band z-10, nav z-20
- Implemented pointer events: `pointer-events-none` on glass shell, `pointer-events-auto` on interactive children
- Updated spec boxes grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6` for responsive layout

**Files Changed:**
- `client/src/components/HeroSlideshowSplitScreen.tsx` - Two-variant content band implementation
- `scripts/capture-screenshots.mjs` - Puppeteer screenshot capture script (created)
- `scripts/run-lighthouse.mjs` - Lighthouse audit script (created)

**Screenshots:**
- Desktop (1440×900): ✅ Captured and verified (`docs/screenshots/desktop-1440x900-verified.png`)
- Mobile viewports: Puppeteer scripts created, require debugging for proper page capture

#### 🚧 In Progress / Remaining Work

**Phase 6: Screenshots, Lighthouse, and Regression**
- Mobile screenshots (iPhone 14 Pro, Pixel 7, iPad portrait) - Puppeteer script needs debugging
- Lighthouse audits (mobile + desktop) - Script created, needs execution and verification
- Regression testing (keyboard nav, focus rings, pause on hover, swipe, reduced-motion, overlay alignment)

**Phase 7: Polish & Creative Pass**
- Micro-animations (fade/blur-in on glass band, hover lift on spec boxes)
- Typography refinement (tighten line-heights, clamp headings, ensure readable contrast)
- Fine details (gold border consistency, shadow tuning)
- Optional flourishes (vignette behind glass band, subtle parallax)

**Deliverables:**
- Complete screenshot capture for all required viewports
- Run and document Lighthouse audit results
- Update implementation notes in README
- Organize all screenshots and reports in `docs/` directory

---

## [0.1.0] - 2025-11-05

### Added
- Initial project setup with split-screen hero slideshow
- Bilingual support (Arabic RTL + English LTR)
- 5-slide carousel with Sheikh Ammar's portrait and luxury watch images
- Navigation controls (arrows, slide indicators, auto-rotation)
- Responsive design with mobile and desktop layouts
- Watch collection showcase section
- Featured brands section
