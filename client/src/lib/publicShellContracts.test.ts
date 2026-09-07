import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const readSource = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");

describe("public shell contracts", () => {
  it("keeps the live homepage on the shared bilingual luxury shell", () => {
    const source = readSource("client/src/pages/Home.tsx");

    expect(source).toContain('import { Header } from "@/components/Header"');
    expect(source).toContain('import { Footer } from "@/components/Footer"');
    expect(source).toContain('dir={isRTL ? "rtl" : "ltr"}');
    expect(source).not.toMatch(/\b(?:bg|text|border)-(?:black|neutral|amber)(?:-|\/|\b)/);
  });

  it("frames the homepage as a bilingual editorial watch-story experience rather than a generic catalogue hero", () => {
    const homeSource = readSource("client/src/pages/Home.tsx");
    const storySource = readSource("client/src/components/ArchiveStorySlideshow.tsx");
    const stylesheet = readSource("client/src/index.css");

    expect(homeSource).toContain("ArchiveStorySlideshow");
    expect(homeSource).toContain("archive-prelude");
    expect(homeSource).toContain("collection-constellation");
    expect(homeSource).toContain("The archive begins with a public appearance");
    expect(homeSource).toContain("يبدأ الأرشيف بظهور علني");
    expect(homeSource).toContain("editorial-entry-guide");
    expect(homeSource).toContain("Begin with the watch stories");
    expect(homeSource).toContain("ابدأ بقصص الساعات");
    expect(storySource).toContain("setInterval");
    expect(storySource).toContain("7200");
    expect(storySource).toContain('id="watch-stories"');
    expect(storySource).toContain("Watch-story slideshow");
    expect(storySource).toContain("archive-story__reading");
    expect(storySource).toContain("archive-story__detail-toggle");
    expect(storySource).toContain("prefers-reduced-motion");
    expect(storySource).toContain("does not offer any watch for sale");
    expect(storySource).toContain("ولا يضيف ادعاءات جديدة أو يعرض أي ساعة للبيع");
    expect(storySource).toContain('isRTL ? "lg:order-2" : "lg:order-1"');
    expect(stylesheet).toContain(".archive-story");
    expect(stylesheet).not.toContain(".royal-hero__seal");
    expect(stylesheet).toContain(".archive-prelude");
    expect(stylesheet).toContain(".collection-constellation");
    expect(stylesheet).toContain(".archive-story__copy");
  });

  it("keeps the public header focused on primary destinations while preserving deeper archive routes in a separate exploration group", () => {
    const navigationSource = readSource("client/src/lib/navigation.ts");
    const mobileMenuSource = readSource("client/src/components/MobileMenu.tsx");

    expect(navigationSource).toContain("PRIMARY_NAVIGATION");
    expect(navigationSource).toContain('href: "/collection"');
    expect(navigationSource).toContain('href: "/about"');
    expect(navigationSource).toContain('href: "/virtual-tour"');
    expect(mobileMenuSource).toContain("Explore the archive");
    expect(mobileMenuSource).toContain("استكشف الأرشيف");
  });

  it("keeps the public YouTube reference discoverable near the Collection entry without weakening its source boundary", () => {
    const collectionSource = readSource("client/src/pages/Collection.tsx");

    expect(collectionSource).toContain('id="collection-film"');
    expect(collectionSource).toContain("A supplementary viewing pathway");
    expect(collectionSource).toContain("مسار مشاهدة إضافي");
    expect(collectionSource).toContain("youtube-nocookie.com/embed/Air31Kly7Ys");
    expect(collectionSource).toContain("makes no claim about ownership, availability, or completeness");
  });

  it("offers the user-provided public Instagram pathway without introducing automated social posting", () => {
    const footerSource = readSource("client/src/components/Footer.tsx");

    expect(footerSource).toContain('href="https://www.instagram.com/aj.ammar/"');
    expect(footerSource).toContain("Instagram");
    expect(footerSource).toContain("إنستغرام");
    expect(footerSource).toContain('target="_blank"');
    expect(footerSource).toContain('rel="noopener noreferrer"');
  });

  it("keeps the retired administrator route as a transparent handoff to the active MVP workspace", () => {
    const source = readSource("client/src/components/LegacyAdminHandoff.tsx");
    const legacyDashboardSource = readSource("client/src/pages/AdminDashboard.tsx");
    const legacyLoginSource = readSource("client/src/pages/AdminLogin.tsx");

    expect(source).toContain('href="/admin/login-mvp"');
    expect(source).toContain('useLanguage');
    expect(source).not.toContain("AdminGalleryManager");
    expect(source).not.toContain("localStorage");
    expect(legacyDashboardSource).toContain("LegacyAdminHandoff");
    expect(legacyLoginSource).toContain("LegacyAdminHandoff");
  });

  it("keeps Sheikh Gallery feature copy non-commercial and source-transparent", () => {
    const source = readSource("client/src/pages/SheikhGallery.tsx");

    expect(source).not.toContain("collectionValue");
    expect(source).not.toContain("priceNote");
    expect(source).not.toContain("USD 55,000");
    expect(source).not.toContain("Private collection");
    expect(source).not.toContain("ضمن المجموعة الخاصة");
  });

  it("removes public sale and valuation treatments across core gallery journeys", () => {
    const collectionSource = readSource("client/src/pages/Collection.tsx");
    const searchSource = readSource("client/src/pages/AdvancedSearch.tsx");
    const brandSource = readSource("client/src/pages/BrandCollection.tsx");
    const compareSource = readSource("client/src/pages/Compare.tsx");
    const timelineSource = readSource("client/src/pages/Timeline.tsx");
    const topTenSource = readSource("client/src/pages/Top10Watches.tsx");
    const seoSource = readSource("client/src/components/SEOHead.tsx");

    [collectionSource, searchSource, brandSource, compareSource, timelineSource, topTenSource].forEach((source) => {
      expect(source).not.toContain("Price on Request");
      expect(source).not.toContain("السعر عند الطلب");
    });
    expect(collectionSource).not.toContain("price-high");
    expect(collectionSource).not.toContain("price-low");
    expect(searchSource).not.toContain("minPrice");
    expect(searchSource).not.toContain("maxPrice");
    expect(brandSource).not.toContain("formatPrice");
    expect(compareSource).not.toContain('key: "price"');
    expect(timelineSource).not.toContain("specifications?.price");
    expect(topTenSource).not.toContain("highest-value");
    expect(seoSource).not.toContain('"@type": "Offer"');
  });

  it("provides a language-appropriate native newsletter validation message", () => {
    const source = readSource("client/src/components/NewsletterSignup.tsx");

    expect(source).toContain("يرجى إدخال بريد إلكتروني صالح.");
    expect(source).toContain("Please enter a valid email address.");
    expect(source).toContain("onInvalid");
    expect(source).toContain("onInput");
  });

  it("uses semantic gallery overlays and stable keys when an image URL appears more than once", () => {
    const gallerySource = readSource("client/src/components/ImageGallery.tsx");
    const mediaSource = readSource("client/src/components/WatchMedia.tsx");
    const stylesheet = readSource("client/src/index.css");

    expect(gallerySource).toContain("gallery-overlay-button");
    expect(gallerySource).toContain("gallery-fullscreen-surface");
    expect(gallerySource).toContain("Array.from(new Set(images.map(normaliseProjectImageUrl)");
    expect(mediaSource).toContain("onError={() => setFailedUrl(source)}");
    expect(gallerySource).not.toContain("bg-black/50");
    expect(stylesheet).toContain(".gallery-overlay-surface");
    expect(stylesheet).toContain(".gallery-fullscreen-surface");
    expect(stylesheet).toContain(".watch-media-placeholder");
  });

  it("retries a transient managed-storage presign failure before returning an image error", () => {
    const storageProxy = readSource("server/_core/storageProxy.ts");

    expect(storageProxy).toContain("attempt < 3");
    expect(storageProxy).toContain("250 * (attempt + 1)");
    expect(storageProxy).toContain("Storage service is temporarily unavailable");
  });

  it("keeps administrator entry out of the visitor-facing shell while retaining the protected route", () => {
    const headerSource = readSource("client/src/components/Header.tsx");
    const appSource = readSource("client/src/App.tsx");

    expect(headerSource).not.toContain("LockKeyhole");
    expect(headerSource).not.toContain('href="/admin/login-mvp"');
    expect(appSource).not.toContain("FloatingAdminButton");
    expect(appSource).toContain("AdminLoginMvp");
  });

  it("uses a synchronized intermediate-width-safe navigation breakpoint and accessible atelier language controls", () => {
    const headerSource = readSource("client/src/components/Header.tsx");
    const mobileMenuSource = readSource("client/src/components/MobileMenu.tsx");
    const languageSource = readSource("client/src/components/LanguageSwitcher.tsx");
    const stylesheet = readSource("client/src/index.css");

    expect(headerSource).toContain("pb-3 xl:flex");
    expect(mobileMenuSource).toContain('className="xl:hidden p-2');
    expect(mobileMenuSource).toContain("z-[9998] xl:hidden");
    expect(mobileMenuSource).toContain("z-[9999] xl:hidden");
    expect(languageSource).toContain('aria-pressed={language === "en"}');
    expect(languageSource).toContain('aria-pressed={language === "ar"}');
    expect(languageSource).toContain("maison-language-switcher");
    expect(languageSource).toContain("maison-language-switcher__option");
    expect(languageSource).not.toContain("shadow-2xl");
    expect(stylesheet).toContain("--primary: #76572f");
    expect(stylesheet).toContain("--primary-foreground: #fffdf6");
  });

  it("uses the atelier luxury palette and refined display/body typography across shared public surfaces", () => {
    const stylesheet = readSource("client/src/index.css");
    const headerSource = readSource("client/src/components/Header.tsx");
    const footerSource = readSource("client/src/components/Footer.tsx");
    const collectionSource = readSource("client/src/pages/Collection.tsx");
    const detailSource = readSource("client/src/pages/WatchDetail.tsx");
    const constellationSource = readSource("client/src/pages/ConstellationOfTime.tsx");
    const brandSource = readSource("client/src/pages/BrandCollection.tsx");
    const topTenSource = readSource("client/src/pages/Top10Watches.tsx");
    const discoverySource = readSource("client/src/pages/HorologyDiscovery.tsx");
    const adminGallerySource = readSource("client/src/components/admin/AdminGalleryManager.tsx");
    const seoSource = readSource("client/src/components/SEOHead.tsx");

    expect(stylesheet).toContain("Atelier palette: ivory stock, mineral ink, nocturne olive and burnished bronze.");
    expect(stylesheet).toContain("family=Cormorant+Garamond");
    expect(stylesheet).toContain("family=Manrope");
    expect(stylesheet).toContain("--secondary: #1b2b23");
    expect(stylesheet).toContain("font-family: 'Cormorant Garamond', serif");
    expect(headerSource).toContain("maison-header");
    expect(headerSource).toContain("maison-navigation__link");
    expect(stylesheet).toContain(".maison-header");
    expect(stylesheet).toContain(".maison-monogram");
    expect(stylesheet).toContain(".maison-language-switcher");
    expect(footerSource).toContain("'Cormorant Garamond', serif");
    expect(collectionSource).toContain("page-hero");
    expect(collectionSource).toContain("filter-surface");
    expect(collectionSource).toContain("watch-card");
    expect(detailSource).toContain("spec-card");
    expect(constellationSource).toContain("constellation-hero");
    expect(brandSource).toContain("page-hero");
    expect(brandSource).toContain("watch-card");
    expect(topTenSource).toContain("ARCHIVE SELECTION");
    expect(topTenSource).toContain("bg-secondary");
    expect(discoverySource).toContain("'Cormorant Garamond', serif");
    expect(adminGallerySource).toContain("'Cormorant Garamond', serif");
    expect(seoSource).toContain('updateMeta("theme-color", "#2d4236")');
  });

  it("consolidates retired administrator subroutes behind the active-workspace handoff", () => {
    const appSource = readSource("client/src/App.tsx");

    expect(appSource).toContain('path="/admin/watches" component={LegacyAdminHandoff}');
    expect(appSource).toContain('path="/admin/subscribers" component={LegacyAdminHandoff}');
    expect(appSource).toContain('path="/admin/chatgpt" component={LegacyAdminHandoff}');
    expect(appSource).not.toContain('lazy(() => import("./pages/AdminWatches"))');
    expect(appSource).not.toContain('lazy(() => import("./pages/AdminSubscribers"))');
  });

  it("applies cache policy to fingerprinted production assets and managed image redirects", () => {
    const viteServer = readSource("server/_core/vite.ts");
    const storageProxy = readSource("server/_core/storageProxy.ts");

    expect(viteServer).toContain("max-age=31536000, immutable");
    expect(viteServer).toContain('"Cache-Control", "no-cache"');
    expect(storageProxy).toContain("public, max-age=300, stale-while-revalidate=86400");
  });

  it("keeps active Top 10 and Virtual Tour image overlays on semantic palette utilities", () => {
    const topTenSource = readSource("client/src/pages/Top10Watches.tsx");
    const virtualTourSource = readSource("client/src/pages/VirtualTour.tsx");

    expect(topTenSource).toContain("gallery-overlay-surface");
    expect(topTenSource).toContain("text-primary");
    expect(topTenSource).not.toContain("text-amber-600");
    expect(virtualTourSource).toContain("gallery-overlay-button");
    expect(virtualTourSource).not.toContain("bg-black/50");
  });

  it("keeps the Virtual Tour on the shared bilingual public shell and source-bounded editorial framing", () => {
    const virtualTourSource = readSource("client/src/pages/VirtualTour.tsx");

    expect(virtualTourSource).toContain("<Header />");
    expect(virtualTourSource).toContain("<Footer />");
    expect(virtualTourSource).toContain("dir={isRTL ? 'rtl' : 'ltr'}");
    expect(virtualTourSource).toContain("not an inventory claim");
    expect(virtualTourSource).toContain("/sheikh-examining-watches.webp");
    expect(virtualTourSource).not.toContain("images.unsplash.com");
    expect(virtualTourSource).not.toContain("personal stories behind each acquisition");
    expect(virtualTourSource).not.toContain('<Link href="/collection">');
  });

  it("serves the plural collection URL through the canonical collection page", () => {
    const appSource = readSource("client/src/App.tsx");

    expect(appSource).toContain('<Route path="/collections">');
    expect(appSource).toContain("<Collection />");
    expect(appSource).not.toContain('lazy(() => import("./pages/Collections"))');
  });

  it("provides bilingual administrator login copy and explicit missing-field feedback", () => {
    const loginSource = readSource("client/src/pages/AdminLoginMvp.tsx");

    expect(loginSource).toContain("useLanguage");
    expect(loginSource).toContain("يرجى إدخال اسم المستخدم وكلمة المرور.");
    expect(loginSource).toContain("Enter both a username and password.");
    expect(loginSource).toContain('dir={isRTL ? "rtl" : "ltr"}');
    expect(loginSource).toContain("autoComplete=\"current-password\"");
    expect(loginSource).toContain("trpc.admin.login.useMutation");
    expect(loginSource).toContain("adminLogin.mutateAsync");
  });

  it("keeps the active administrator workspace localized and sourced from semantic status tokens", () => {
    const dashboardSource = readSource("client/src/pages/AdminDashboardMvp.tsx");
    const watchesSource = readSource("client/src/components/admin/AdminWatchesMvp.tsx");
    const csvSource = readSource("client/src/pages/AdminCSVImport.tsx");

    expect(dashboardSource).toContain("useLanguage");
    expect(dashboardSource).toContain("لوحة الإدارة");
    expect(dashboardSource).toContain('dir={isRTL ? "rtl" : "ltr"}');
    expect(watchesSource).toContain("watch.descriptionAr");
    expect(watchesSource).toContain("copy.reference");
    expect(csvSource).toContain("status-success-surface");
    expect(csvSource).not.toContain("bg-green-50");
    expect(csvSource).not.toContain("text-red-700");
    expect(dashboardSource).toContain("trpc.admin.logout.useMutation");
    expect(dashboardSource).toContain("adminLogout.mutateAsync");
  });

  it("keeps active hero media on the verified retained asset directories", () => {
    const heroSlidesSource = readSource("client/src/data/heroSlides.ts");

    expect(heroSlidesSource).toContain("/slideshow-sheikh-only/");
    expect(heroSlidesSource).toContain("/slideshow-optimized/");
    expect(heroSlidesSource).not.toContain("/slideshow-clean/");
    expect(heroSlidesSource).not.toContain("/slideshow-new/");
    expect(heroSlidesSource).not.toContain("/slideshow/");
  });

  it("provides a bilingual contact route with validated persisted correspondence", () => {
    const appSource = readSource("client/src/App.tsx");
    const contactSource = readSource("client/src/pages/Contact.tsx");
    const routerSource = readSource("server/routers.ts");

    expect(appSource).toContain('path="/contact"');
    expect(contactSource).toContain("Begin a considered conversation.");
    expect(contactSource).toContain("ابدأ محادثة مدروسة.");
    expect(contactSource).toContain("website");
    expect(contactSource).toContain("trpc.contact.submit.useMutation");
    expect(routerSource).toContain("contact: router");
    expect(routerSource).toContain("message: z.string().trim().min(10).max(4000)");
    expect(routerSource).toContain("db.createContactMessage");
  });

  it("renders verified watch narrative as an expandable bilingual archive-context panel", () => {
    const detailSource = readSource("client/src/pages/WatchDetail.tsx");

    expect(detailSource).toContain("<details");
    expect(detailSource).toContain("Archive context");
    expect(detailSource).toContain("سياق السجل");
    expect(detailSource).toContain("hasArabicScript(watch.storyAr)");
    expect(detailSource).toContain("hasArabicScript(watch.descriptionAr)");
  });

  it("does not expose untranslated descriptive watch facts in Arabic detail views", () => {
    const detailSource = readSource("client/src/pages/WatchDetail.tsx");

    expect(detailSource).toContain("canDisplayInArabic(value)");
    expect(detailSource).toContain("localizedComplications");
    expect(detailSource).toContain("localizedRarity");
  });

  it("offers a localized retry path when a live watch-detail record is temporarily unavailable", () => {
    const detailSource = readSource("client/src/pages/WatchDetail.tsx");

    expect(detailSource).toContain("isError: watchError");
    expect(detailSource).toContain("refetch: refetchWatch");
    expect(detailSource).toContain("This watch record is temporarily unavailable");
    expect(detailSource).toContain("سجل الساعة غير متاح مؤقتاً");
    expect(detailSource).toContain("void refetchWatch()");
  });

  it("does not expose raw English movement and case fallbacks in the Arabic Top 10 showcase", () => {
    const topTenSource = readSource("client/src/pages/Top10Watches.tsx");

    expect(topTenSource).toContain("canDisplayInArabic");
    expect(topTenSource).toContain("const movement = !isRTL");
    expect(topTenSource).toContain("const caseMaterial = !isRTL");
    expect(topTenSource).toContain('{movement && <div className="spec-card');
    expect(topTenSource).toContain('{caseMaterial && <div className="spec-card');
  });

  it("uses native deferred decoding hints for noncritical brand collection watch images", () => {
    const brandSource = readSource("client/src/pages/BrandCollection.tsx");
    const mediaSource = readSource("client/src/components/WatchMedia.tsx");

    expect(brandSource).toContain("<WatchMedia");
    expect(brandSource).toContain("imageUrl={watch.mainImageUrl}");
    expect(mediaSource).toContain('loading={loading}');
    expect(mediaSource).toContain('decoding="async"');
  });

  it("prioritises asynchronous decoding for the active homepage watch-story image", () => {
    const storySource = readSource("client/src/components/ArchiveStorySlideshow.tsx");

    const mediaSource = readSource("client/src/components/WatchMedia.tsx");

    expect(storySource).toContain("activeSlide.watch.mainImageUrl");
    expect(storySource).toContain("priority=\"high\"");
    expect(mediaSource).toContain('decoding="async"');
    expect(mediaSource).toContain('fetchPriority={priority === "high" ? "high" : fetchPriority}');
  });

  it("offers a localized retry path when a live brand collection is temporarily unavailable", () => {
    const brandSource = readSource("client/src/pages/BrandCollection.tsx");

    expect(brandSource).toContain("isError: brandError");
    expect(brandSource).toContain("isError: watchesError");
    expect(brandSource).toContain("This maison record is temporarily unavailable");
    expect(brandSource).toContain("سجل الدار غير متاح مؤقتاً");
    expect(brandSource).toContain("void refetchBrand()");
  });

  it("keeps public brand cards and watch details from presenting unsupported ownership wording as editorial fact", () => {
    const guardSource = readSource("client/src/lib/localizationGuard.ts");
    const brandSource = readSource("client/src/pages/BrandCollection.tsx");
    const detailSource = readSource("client/src/pages/WatchDetail.tsx");

    expect(guardSource).toContain("isSourceBoundedEditorialDescription");
    expect(brandSource).toContain("rawWatchDescription");
    expect(brandSource).toContain("hasArabicScript(watch.descriptionAr)");
    expect(brandSource).toContain("isSourceBoundedEditorialDescription(rawWatchDescription)");
    expect(detailSource).toContain("localizedDescriptionCandidate");
    expect(detailSource).toContain("isSourceBoundedEditorialDescription(localizedDescriptionCandidate)");
  });

  it("provides a private local wishlist control in the collection without nesting interactive controls inside detail links", () => {
    const collectionSource = readSource("client/src/pages/Collection.tsx");
    const wishlistSource = readSource("client/src/lib/wishlist.ts");

    expect(collectionSource).toContain("handleWishlistToggle");
    expect(collectionSource).toContain("aria-pressed={savedOnly}");
    expect(collectionSource).toContain("السجلات المحفوظة");
    expect(wishlistSource).toContain('WISHLIST_STORAGE_KEY = "royal-horology-wishlist"');
    expect(wishlistSource).toContain("typeof window === \"undefined\"");
  });

  it("provides a bilingual retry state when the live collection archive is temporarily unavailable", () => {
    const collectionSource = readSource("client/src/pages/Collection.tsx");

    expect(collectionSource).toContain("dataUnavailable");
    expect(collectionSource).toContain("refetchWatches");
    expect(collectionSource).toContain("أرشيف المجموعة المباشر غير متاح مؤقتاً");
  });

  it("provides a native bilingual sharing action with a clipboard fallback on sourced watch records", () => {
    const detailSource = readSource("client/src/pages/WatchDetail.tsx");

    expect(detailSource).toContain("navigator.share");
    expect(detailSource).toContain("navigator.clipboard?.writeText");
    expect(detailSource).toContain("مشاركة السجل");
    expect(detailSource).toContain('role="status"');
  });

  it("exposes the shared luxury theme preference with bilingual accessible controls", () => {
    const appSource = readSource("client/src/App.tsx");
    const headerSource = readSource("client/src/components/Header.tsx");
    const toggleSource = readSource("client/src/components/ThemeToggle.tsx");
    const cssSource = readSource("client/src/index.css");

    expect(appSource).toContain('<ThemeProvider defaultTheme="dark" switchable>');
    expect(headerSource).toContain("<ThemeToggle />");
    expect(toggleSource).toContain("التبديل إلى المظهر الداكن");
    expect(cssSource).toContain(".dark {");
    expect(cssSource).toContain("--background: #0a0b0d");
    expect(cssSource).toContain(".dark .collection-page-hero");
  });

  it("registers a production-only offline shell without caching live APIs or managed media", () => {
    const mainSource = readSource("client/src/main.tsx");
    const serviceWorkerSource = readSource("client/public/service-worker.js");

    expect(mainSource).toContain('navigator.serviceWorker.register("/service-worker.js")');
    expect(mainSource).toContain("import.meta.env.PROD");
    expect(serviceWorkerSource).toContain('url.pathname.startsWith("/api/")');
    expect(serviceWorkerSource).toContain('url.pathname.startsWith("/manus-storage/")');
    expect(serviceWorkerSource).toContain("request.mode === \"navigate\"");
    expect(serviceWorkerSource).toContain('CACHE_NAME = "royal-horology-shell-v8"');
  });

  it("routes an accessible bilingual discovery quiz through the shared public shell", () => {
    const appSource = readSource("client/src/App.tsx");
    const navigationSource = readSource("client/src/lib/navigation.ts");
    const discoverySource = readSource("client/src/pages/HorologyDiscovery.tsx");

    expect(appSource).toContain('path="/discovery"');
    expect(navigationSource).toContain("Horology Discovery");
    expect(navigationSource).toContain("اكتشاف الساعات");
    expect(discoverySource).toContain("دون تسجيل أو جمع لبياناتك");
    expect(discoverySource).toContain('aria-pressed={selectedState}');
  });

  it("uses a distinct source-bound archive watch-story sequence with an accessible bilingual motion control", () => {
    const homeSource = readSource("client/src/pages/Home.tsx");
    const storySource = readSource("client/src/components/ArchiveStorySlideshow.tsx");
    const cssSource = readSource("client/src/index.css");

    expect(homeSource).toContain("ArchiveStorySlideshow");
    expect(storySource).toContain("h-moser-endeavour-tourbillon-vantablack-1804-0212");
    expect(storySource).toContain("audemars-piguet-royal-oak-perpetual-calendar-blue-ceramic-26579cs");
    expect(storySource).toContain("audemars-piguet-royal-oak-perpetual-calendar-white-ceramic-26579cb");
    expect(storySource).toContain("إيقاف الحركة");
    expect(storySource).toContain("Pause motion");
    expect(storySource).toContain("royal-horology-cinematic-background_8dac247a.mp4");
    expect(storySource).toContain("Official Gallery imagery and project assets");
    expect(storySource).toContain("Official Gallery source");
    expect(storySource).toContain("prefersReducedMotion");
    expect(storySource).toContain("backgroundVideoRef");
    expect(cssSource).toContain(".archive-story__backdrop");
    expect(cssSource).toContain(".archive-story__backdrop video");
    expect(cssSource).toContain(".archive-story__source-link");
    expect(cssSource).toContain("prefers-reduced-motion: reduce");
  });

  it("frames Vacheron Constantin as an original bilingual maison dossier with official-source boundaries", () => {
    const brandSource = readSource("client/src/pages/BrandCollection.tsx");
    const dossierSource = readSource("client/src/data/vacheronDossier.ts");

    expect(brandSource).toContain("vacheronDossier");
    expect(brandSource).toContain("isVacheron");
    expect(brandSource).toContain("officialSourceUrl");
    expect(dossierSource).toContain("Vacheron Constantin");
    expect(dossierSource).toContain("1755");
    expect(dossierSource).toContain("Métiers d’Art");
    expect(dossierSource).toContain("https://www.vacheron-constantin.com/us/en/watches/all-collections.html");
    expect(dossierSource).toContain("https://www.vacheron-constantin.com/us/en/maison/manufacture.html");
    expect(dossierSource).not.toContain("Sheikh Ammar owns");
    expect(dossierSource).not.toContain("available for purchase");
  });

  it("adds a bilingual collection compass that steers visitors through live archive metadata without ownership inference", () => {
    const collectionSource = readSource("client/src/pages/Collection.tsx");

    expect(collectionSource).toContain("collection-compass");
    expect(collectionSource).toContain("applyCollectionPathway");
    expect(collectionSource).toContain("aria-controls=\"collection-filters\"");
    expect(collectionSource).toContain("waysOfReading");
    expect(collectionSource).not.toContain("owned by Sheikh Ammar");
  });

  it("keeps the Collection as an archive atlas with calm card imagery and textual classifications", () => {
    const collectionSource = readSource("client/src/pages/Collection.tsx");
    const stylesheet = readSource("client/src/index.css");

    expect(collectionSource).toContain("The Archive Atlas");
    expect(collectionSource).toContain("أطلس الأرشيف");
    expect(collectionSource).toContain("Archive classification");
    expect(collectionSource).toContain("collection-card__classification");
    expect(collectionSource).toContain('aria-hidden="true"');
    expect(collectionSource).toContain("سجلاً أرشيفياً");
    expect(collectionSource).not.toContain("rounded-full text-[0.6rem]");
    expect(stylesheet).toContain(".collection-page-hero");
    expect(stylesheet).toContain(".collection-filter-surface");
    expect(stylesheet).toContain(".watch-card .img-hover-zoom");
  });

  it("offers an advanced bilingual Archive Lens and numbered record treatment without turning research metadata into ownership claims", () => {
    const collectionSource = readSource("client/src/pages/Collection.tsx");
    const stylesheet = readSource("client/src/index.css");

    expect(collectionSource).toContain("Archive Lens");
    expect(collectionSource).toContain("عدسة الأرشيف");
    expect(collectionSource).toContain("archive-lens");
    expect(collectionSource).toContain("collection-record__index");
    expect(collectionSource).toContain("Published archive records are research-led");
    expect(collectionSource).toContain("السجلات المنشورة يقودها البحث");
    expect(collectionSource).not.toContain("confirmed ownership");
    expect(stylesheet).toContain(".archive-lens");
    expect(stylesheet).toContain(".collection-record__index");
  });

  it("keeps unqualified third-party composite images out of the public Collection by rendering a bilingual record plate instead", () => {
    const collectionSource = readSource("client/src/pages/Collection.tsx");
    const stylesheet = readSource("client/src/index.css");

    expect(collectionSource).toContain("hasQualifiedImage");
    expect(collectionSource).toContain("Record visual pending source clearance");
    expect(collectionSource).toContain("الصورة بانتظار توثيق المصدر");
    expect(stylesheet).toContain(".collection-record__plate");
  });

  it("restores the reference dark-vault visual direction without reviving valuation claims or exposed administrator credentials", () => {
    const homeSource = readSource("client/src/pages/Home.tsx");
    const loginSource = readSource("client/src/pages/AdminLoginMvp.tsx");
    const dashboardSource = readSource("client/src/pages/AdminDashboardMvp.tsx");
    const stylesheet = readSource("client/src/index.css");

    expect(homeSource).toContain("reference-vault-home");
    expect(homeSource).toContain("reference-vault-hero");
    expect(homeSource).not.toContain("Total Value");
    expect(homeSource).not.toContain("$5M");
    expect(stylesheet).toContain(".reference-vault-home");
    expect(stylesheet).toContain(".reference-vault-home .archive-story");
    expect(loginSource).not.toContain("Demo credentials");
    expect(loginSource).not.toContain("MOATH123");
    expect(loginSource).not.toContain("localStorage.setItem");
    expect(dashboardSource).not.toContain("localStorage");
  });
});
