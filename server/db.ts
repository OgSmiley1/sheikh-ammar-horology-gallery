import { eq, desc, and, sql } from "drizzle-orm";
import { randomBytes } from "node:crypto";
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
  contactMessages,
  InsertContactMessage,
  watchComments,
  InsertWatchComment,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
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
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
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

export type WatchImageUploadInput = {
  imageBase64: string;
  fileName: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  imageType: "studio" | "wrist" | "detail" | "movement";
  captionEn?: string;
  captionAr?: string;
};

export async function uploadWatchImages(watchId: number, inputs: WatchImageUploadInput[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { storagePut } = await import("./storage");
  const lastImage = await db.select({ displayOrder: watchImages.displayOrder }).from(watchImages).where(eq(watchImages.watchId, watchId)).orderBy(desc(watchImages.displayOrder)).limit(1);
  const firstDisplayOrder = (lastImage[0]?.displayOrder ?? -1) + 1;
  const uploads = [];

  for (let index = 0; index < inputs.length; index += 1) {
    const input = inputs[index];
    const safeFileName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120) || "watch-image";
    const fileKey = `watch-galleries/${watchId}/${Date.now()}-${randomBytes(8).toString("hex")}-${safeFileName}`;
    const imageBuffer = decodeGalleryImage(input.imageBase64);
    const { url } = await storagePut(fileKey, imageBuffer, input.mimeType);
    const image: InsertWatchImage = {
      watchId,
      imageUrl: url,
      imageKey: fileKey,
      imageType: input.imageType,
      captionEn: input.captionEn,
      captionAr: input.captionAr,
      displayOrder: firstDisplayOrder + index,
      fileSize: imageBuffer.length,
      mimeType: input.mimeType,
    };

    uploads.push(await db.insert(watchImages).values(image));
  }

  return uploads;
}

// ============================================================================
// SHEIKH PHOTOS
// ============================================================================

export async function getSheikhPhotos(watchId?: number) {
  const db = await getDb();
  if (!db) return [];

  const galleryPhotoFields = {
    id: sheikhPhotos.id,
    watchId: sheikhPhotos.watchId,
    imageUrl: sheikhPhotos.imageUrl,
    imageKey: sheikhPhotos.imageKey,
    captionEn: sheikhPhotos.captionEn,
    captionAr: sheikhPhotos.captionAr,
    eventName: sheikhPhotos.eventName,
    photoDate: sheikhPhotos.photoDate,
    displayOrder: sheikhPhotos.displayOrder,
    isActive: sheikhPhotos.isActive,
    createdAt: sheikhPhotos.createdAt,
    watchSlug: watches.slug,
    watchNameEn: watches.nameEn,
    watchNameAr: watches.nameAr,
  };

  if (watchId) {
    return await db
      .select(galleryPhotoFields)
      .from(sheikhPhotos)
      .leftJoin(watches, eq(sheikhPhotos.watchId, watches.id))
      .where(and(eq(sheikhPhotos.watchId, watchId), eq(sheikhPhotos.isActive, true)))
      .orderBy(sheikhPhotos.displayOrder);
  }

  return await db
    .select(galleryPhotoFields)
    .from(sheikhPhotos)
    .leftJoin(watches, eq(sheikhPhotos.watchId, watches.id))
    .where(eq(sheikhPhotos.isActive, true))
    .orderBy(sheikhPhotos.displayOrder);
}

export async function getAllSheikhPhotos() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(sheikhPhotos)
    .orderBy(sheikhPhotos.displayOrder);
}

export async function createSheikhPhoto(photo: InsertSheikhPhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(sheikhPhotos).values(photo);
  return result;
}

export type SheikhPhotoUploadInput = {
  imageBase64: string;
  fileName: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  captionEn?: string;
  captionAr?: string;
  eventName?: string;
  photoDate?: string;
  watchId?: number;
};

function decodeGalleryImage(imageBase64: string) {
  const commaIndex = imageBase64.indexOf(",");
  if (commaIndex < 0) throw new Error("Invalid gallery image data");

  const imageBuffer = Buffer.from(imageBase64.slice(commaIndex + 1), "base64");
  if (!imageBuffer.length || imageBuffer.length > 12 * 1024 * 1024) {
    throw new Error("Gallery images must be smaller than 12 MB");
  }

  return imageBuffer;
}

export async function uploadSheikhPhotos(inputs: SheikhPhotoUploadInput[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { storagePut } = await import("./storage");
  const lastPhoto = await db.select({ displayOrder: sheikhPhotos.displayOrder }).from(sheikhPhotos).orderBy(desc(sheikhPhotos.displayOrder)).limit(1);
  const firstDisplayOrder = (lastPhoto[0]?.displayOrder ?? -1) + 1;
  const uploads = [];

  for (let index = 0; index < inputs.length; index += 1) {
    const input = inputs[index];
    const safeFileName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120) || "gallery-image";
    const fileKey = `sheikh-gallery/${Date.now()}-${randomBytes(8).toString("hex")}-${safeFileName}`;
    const imageBuffer = decodeGalleryImage(input.imageBase64);
    const { url } = await storagePut(fileKey, imageBuffer, input.mimeType);
    const photo: InsertSheikhPhoto = {
      imageUrl: url,
      imageKey: fileKey,
      captionEn: input.captionEn,
      captionAr: input.captionAr,
      eventName: input.eventName,
      photoDate: input.photoDate ? new Date(input.photoDate) : undefined,
      watchId: input.watchId,
      displayOrder: firstDisplayOrder + index,
      isActive: true,
    };

    uploads.push(await db.insert(sheikhPhotos).values(photo));
  }

  return uploads;
}

export async function uploadSheikhPhoto(input: SheikhPhotoUploadInput) {
  const [upload] = await uploadSheikhPhotos([input]);
  return upload;
}

export async function updateSheikhPhoto(id: number, input: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updates: any = {};
  if (input.captionEn !== undefined) updates.captionEn = input.captionEn;
  if (input.captionAr !== undefined) updates.captionAr = input.captionAr;
  if (input.eventName !== undefined) updates.eventName = input.eventName;
  if (input.photoDate !== undefined) updates.photoDate = input.photoDate ? new Date(input.photoDate) : null;
  if (input.watchId !== undefined) updates.watchId = input.watchId;
  if (input.isActive !== undefined) updates.isActive = input.isActive;

  const result = await db
    .update(sheikhPhotos)
    .set(updates)
    .where(eq(sheikhPhotos.id, id));

  return result;
}

export async function deleteSheikhPhoto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(sheikhPhotos).where(eq(sheikhPhotos.id, id));
}

export async function reorderSheikhPhotos(photoIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.transaction(async (tx) => {
    for (let displayOrder = 0; displayOrder < photoIds.length; displayOrder += 1) {
      await tx.update(sheikhPhotos).set({ displayOrder }).where(eq(sheikhPhotos.id, photoIds[displayOrder]));
    }
  });
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
    // Silently fail to avoid blocking page loads
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
// CONTACT MESSAGES
// ============================================================================

export async function createContactMessage(message: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(contactMessages).values(message);
}

// ============================================================================
// MODERATED WATCH COMMENTS
// ============================================================================

export async function getApprovedWatchComments(watchId: number, language: "en" | "ar") {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      id: watchComments.id,
      body: watchComments.body,
      createdAt: watchComments.createdAt,
    })
    .from(watchComments)
    .where(and(
      eq(watchComments.watchId, watchId),
      eq(watchComments.language, language),
      eq(watchComments.status, "approved"),
    ))
    .orderBy(desc(watchComments.createdAt))
    .limit(20);
}

/**
 * Returns a small, language-scoped selection of reflections that an administrator
 * has explicitly approved. Author identifiers and pending or rejected entries are
 * intentionally excluded from this public homepage feed.
 */
export async function getApprovedHomepageComments(language: "en" | "ar", limit: number = 3) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      id: watchComments.id,
      body: watchComments.body,
      createdAt: watchComments.createdAt,
    })
    .from(watchComments)
    .where(and(
      eq(watchComments.language, language),
      eq(watchComments.status, "approved"),
    ))
    .orderBy(desc(watchComments.createdAt))
    .limit(limit);
}

export async function createWatchComment(comment: InsertWatchComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(watchComments).values(comment);
}

export async function getPendingWatchComments(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      id: watchComments.id,
      body: watchComments.body,
      language: watchComments.language,
      createdAt: watchComments.createdAt,
      watchId: watchComments.watchId,
      watchNameEn: watches.nameEn,
      watchNameAr: watches.nameAr,
    })
    .from(watchComments)
    .innerJoin(watches, eq(watchComments.watchId, watches.id))
    .where(eq(watchComments.status, "pending"))
    .orderBy(desc(watchComments.createdAt))
    .limit(limit);
}

export async function moderateWatchComment(id: number, status: "approved" | "rejected") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(watchComments)
    .set({ status, reviewedAt: new Date() })
    .where(eq(watchComments.id, id));
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
    // Silently fail to avoid blocking admin operations
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
    throw error;
  }
}
