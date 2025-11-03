import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  brands,
  watches,
  watchImages,
  sheikhPhotos,
  pageViews,
  adminUsers,
  adminActivityLog,
  videoBackgrounds,
  InsertBrand,
  InsertWatch,
  InsertWatchImage,
  InsertSheikhPhoto,
  InsertPageView,
  InsertAdminUser,
  InsertAdminActivityLog,
  InsertVideoBackground,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// BRAND MANAGEMENT
// ============================================================================

export async function getAllBrands() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(brands)
    .where(eq(brands.isActive, true))
    .orderBy(brands.displayOrder);
}

export async function getBrandBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(brands)
    .where(and(eq(brands.slug, slug), eq(brands.isActive, true)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function createBrand(brand: InsertBrand) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(brands).values(brand);
  return result;
}

// ============================================================================
// WATCH MANAGEMENT
// ============================================================================

export async function getAllWatches() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(watches)
    .where(eq(watches.isActive, true))
    .orderBy(desc(watches.isFeatured), watches.displayOrder);
}

export async function getWatchesByBrand(brandId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(watches)
    .where(and(eq(watches.brandId, brandId), eq(watches.isActive, true)))
    .orderBy(watches.displayOrder);
}

export async function getWatchBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(watches)
    .where(and(eq(watches.slug, slug), eq(watches.isActive, true)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getFeaturedWatches(limit: number = 6) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(watches)
    .where(and(eq(watches.isFeatured, true), eq(watches.isActive, true)))
    .orderBy(watches.displayOrder)
    .limit(limit);
}

export async function createWatch(watch: InsertWatch) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(watches).values(watch);
  return result;
}

export async function updateWatch(id: number, watch: Partial<InsertWatch>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.update(watches).set(watch).where(eq(watches.id, id));
  return result;
}

export async function incrementWatchViewCount(watchId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(watches)
    .set({ viewCount: sql`${watches.viewCount} + 1` })
    .where(eq(watches.id, watchId));
}

// ============================================================================
// WATCH IMAGES
// ============================================================================

export async function getWatchImages(watchId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(watchImages)
    .where(eq(watchImages.watchId, watchId))
    .orderBy(watchImages.displayOrder);
}

export async function createWatchImage(image: InsertWatchImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(watchImages).values(image);
  return result;
}

// ============================================================================
// SHEIKH PHOTOS
// ============================================================================

export async function getSheikhPhotos(watchId?: number) {
  const db = await getDb();
  if (!db) return [];

  if (watchId) {
    return await db
      .select()
      .from(sheikhPhotos)
      .where(and(eq(sheikhPhotos.watchId, watchId), eq(sheikhPhotos.isActive, true)))
      .orderBy(sheikhPhotos.displayOrder);
  }

  return await db
    .select()
    .from(sheikhPhotos)
    .where(eq(sheikhPhotos.isActive, true))
    .orderBy(sheikhPhotos.displayOrder);
}

export async function createSheikhPhoto(photo: InsertSheikhPhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(sheikhPhotos).values(photo);
  return result;
}

// ============================================================================
// VIDEO BACKGROUNDS
// ============================================================================

export async function getActiveVideoBackgrounds(location?: string) {
  const db = await getDb();
  if (!db) return [];

  if (location) {
    return await db
      .select()
      .from(videoBackgrounds)
      .where(and(eq(videoBackgrounds.usageLocation, location), eq(videoBackgrounds.isActive, true)));
  }

  return await db.select().from(videoBackgrounds).where(eq(videoBackgrounds.isActive, true));
}

export async function createVideoBackground(video: InsertVideoBackground) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(videoBackgrounds).values(video);
  return result;
}

// ============================================================================
// PAGE VIEWS & ANALYTICS
// ============================================================================

export async function trackPageView(view: InsertPageView) {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(pageViews).values(view);
  } catch (error) {
    console.error("[Database] Failed to track page view:", error);
  }
}

export async function getPageViewStats() {
  const db = await getDb();
  if (!db) return { totalViews: 0, uniqueVisitors: 0, topWatches: [], topBrands: [] };

  const totalViews = await db.select({ count: sql<number>`count(*)` }).from(pageViews);

  const uniqueVisitors = await db
    .select({ count: sql<number>`count(distinct ${pageViews.sessionId})` })
    .from(pageViews);

  const topWatches = await db
    .select({
      watchId: pageViews.watchId,
      views: sql<number>`count(*)`,
    })
    .from(pageViews)
    .where(sql`${pageViews.watchId} is not null`)
    .groupBy(pageViews.watchId)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  const topBrands = await db
    .select({
      brandId: pageViews.brandId,
      views: sql<number>`count(*)`,
    })
    .from(pageViews)
    .where(sql`${pageViews.brandId} is not null`)
    .groupBy(pageViews.brandId)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  return {
    totalViews: totalViews[0]?.count || 0,
    uniqueVisitors: uniqueVisitors[0]?.count || 0,
    topWatches,
    topBrands,
  };
}

// ============================================================================
// ADMIN USERS
// ============================================================================

export async function getAdminUserByUsername(username: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(adminUsers)
    .where(and(eq(adminUsers.username, username), eq(adminUsers.isActive, true)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function createAdminUser(admin: InsertAdminUser) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(adminUsers).values(admin);
  return result;
}

export async function updateAdminLastLogin(adminId: number) {
  const db = await getDb();
  if (!db) return;

  await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, adminId));
}

// ============================================================================
// ADMIN ACTIVITY LOG
// ============================================================================

export async function logAdminActivity(activity: InsertAdminActivityLog) {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(adminActivityLog).values(activity);
  } catch (error) {
    console.error("[Database] Failed to log admin activity:", error);
  }
}

export async function getRecentAdminActivity(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(adminActivityLog)
    .orderBy(desc(adminActivityLog.createdAt))
    .limit(limit);
}

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

export async function deleteWatch(watchId: number) {
  const dbInstance = await getDb();
  if (!dbInstance) {
    throw new Error("Database not available");
  }

  try {
    // Delete associated media first
    await dbInstance.delete(watchImages).where(eq(watchImages.watchId, watchId));
    
    // Delete page views
    await dbInstance.delete(pageViews).where(eq(pageViews.watchId, watchId));
    
    // Delete the watch
    await dbInstance.delete(watches).where(eq(watches.id, watchId));
  } catch (error) {
    console.error("[Database] Failed to delete watch:", error);
    throw error;
  }
}
