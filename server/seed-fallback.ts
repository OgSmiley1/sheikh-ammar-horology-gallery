/**
 * In-memory fallback data layer.
 * When DATABASE_URL is not set or the database is unreachable,
 * the app serves watch/brand data from seed-data.json instead of returning empty arrays.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

interface SeedBrand {
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionEn?: string;
  descriptionAr?: string;
  foundedYear?: number;
  country?: string;
  websiteUrl?: string;
  displayOrder: number;
}

interface SeedWatch {
  brand: string;
  referenceNumber: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionEn?: string;
  descriptionAr?: string;
  storyEn?: string;
  storyAr?: string;
  material?: string;
  dialColor?: string;
  caseSize?: string;
  movement?: string;
  complications?: string;
  waterResistance?: string;
  powerReserve?: string;
  limitedEdition?: boolean;
  productionQuantity?: number;
  yearReleased?: number;
  retailPrice?: number;
  marketValue?: number;
  rarity?: string;
  isFeatured?: boolean;
  displayOrder: number;
}

export interface FallbackBrand {
  id: number;
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  logoUrl: string | null;
  foundedYear: number | null;
  country: string | null;
  websiteUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackWatch {
  id: number;
  brandId: number;
  referenceNumber: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  storyEn: string | null;
  storyAr: string | null;
  material: string | null;
  dialColor: string | null;
  caseSize: string | null;
  movement: string | null;
  complications: string | null;
  waterResistance: string | null;
  powerReserve: string | null;
  limitedEdition: boolean;
  productionQuantity: number | null;
  yearReleased: number | null;
  retailPrice: number | null;
  marketValue: number | null;
  rarity: string | null;
  mainImageUrl: string | null;
  viewCount: number;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

let _brands: FallbackBrand[] | null = null;
let _watches: FallbackWatch[] | null = null;

function loadSeedData(): { brands: FallbackBrand[]; watches: FallbackWatch[] } {
  if (_brands && _watches) return { brands: _brands, watches: _watches };

  // Try multiple paths: works both in dev (server/) and production (dist/)
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    resolve(__dirname, "..", "seed-data.json"),      // dev: server/../seed-data.json
    resolve(__dirname, "seed-data.json"),             // if seed-data.json is next to dist/
    resolve(process.cwd(), "seed-data.json"),         // project root
  ];

  let rawText: string | null = null;
  for (const p of candidates) {
    try {
      rawText = readFileSync(p, "utf-8");
      break;
    } catch {
      // try next
    }
  }

  if (!rawText) {
    console.warn("[Fallback] seed-data.json not found at any expected path. Returning empty data.");
    _brands = [];
    _watches = [];
    return { brands: _brands, watches: _watches };
  }

  const raw = JSON.parse(rawText) as {
    brands: SeedBrand[];
    watches: SeedWatch[];
  };

  const now = new Date();

  // Build brands with sequential IDs
  const brandSlugToId: Record<string, number> = {};
  _brands = raw.brands.map((b, i) => {
    const id = i + 1;
    brandSlugToId[b.slug] = id;
    return {
      id,
      nameEn: b.nameEn,
      nameAr: b.nameAr,
      slug: b.slug,
      descriptionEn: b.descriptionEn ?? null,
      descriptionAr: b.descriptionAr ?? null,
      logoUrl: null,
      foundedYear: b.foundedYear ?? null,
      country: b.country ?? null,
      websiteUrl: b.websiteUrl ?? null,
      displayOrder: b.displayOrder,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
  });

  // Map brand name → slug for watch → brand mapping
  const brandNameToSlug: Record<string, string> = {};
  for (const b of raw.brands) {
    brandNameToSlug[b.nameEn] = b.slug;
  }

  // Build watches with sequential IDs and brandId references
  _watches = raw.watches.map((w, i) => {
    const brandSlug = brandNameToSlug[w.brand];
    const brandId = brandSlug ? brandSlugToId[brandSlug] : 1;
    return {
      id: i + 1,
      brandId,
      referenceNumber: w.referenceNumber,
      nameEn: w.nameEn,
      nameAr: w.nameAr,
      slug: w.slug,
      descriptionEn: w.descriptionEn ?? null,
      descriptionAr: w.descriptionAr ?? null,
      storyEn: w.storyEn ?? null,
      storyAr: w.storyAr ?? null,
      material: w.material ?? null,
      dialColor: w.dialColor ?? null,
      caseSize: w.caseSize ?? null,
      movement: w.movement ?? null,
      complications: w.complications ?? null,
      waterResistance: w.waterResistance ?? null,
      powerReserve: w.powerReserve ?? null,
      limitedEdition: w.limitedEdition ?? false,
      productionQuantity: w.productionQuantity ?? null,
      yearReleased: w.yearReleased ?? null,
      retailPrice: w.retailPrice ?? null,
      marketValue: w.marketValue ?? null,
      rarity: w.rarity ?? null,
      mainImageUrl: null,
      viewCount: 0,
      displayOrder: w.displayOrder,
      isActive: true,
      isFeatured: w.isFeatured ?? false,
      createdAt: now,
      updatedAt: now,
    };
  });

  console.log(
    `[Fallback] Loaded ${_brands.length} brands and ${_watches.length} watches from seed-data.json`
  );

  return { brands: _brands, watches: _watches };
}

export function getFallbackBrands(): FallbackBrand[] {
  return loadSeedData().brands;
}

export function getFallbackWatches(): FallbackWatch[] {
  return loadSeedData().watches;
}
