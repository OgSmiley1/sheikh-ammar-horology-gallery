import { eq, desc, count } from "drizzle-orm";
import { getDb } from "./db";
import {
  watches,
  brands,
  newsletterSubscribers,
  adminActivityLog,
  InsertAdminActivityLog,
} from "../drizzle/schema";

// ============================================================================
// WATCHES
// ============================================================================

export async function getWatchesList(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(watches)
    .orderBy(desc(watches.displayOrder), desc(watches.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getWatchById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(watches).where(eq(watches.id, id)).limit(1);
  return result[0] || null;
}

export async function updateWatchData(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(watches).set({ ...data, updatedAt: new Date() }).where(eq(watches.id, id));
}

export async function deleteWatchData(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(watches).where(eq(watches.id, id));
}

export async function createWatchData(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(watches).values(data);
}

export async function getTotalWatchesCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(watches);
  return (result[0]?.count as number) || 0;
}

// ============================================================================
// BRANDS
// ============================================================================

export async function getBrandsList(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(brands).orderBy(desc(brands.displayOrder)).limit(limit);
}

export async function getTotalBrandsCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(brands);
  return (result[0]?.count as number) || 0;
}

// ============================================================================
// NEWSLETTER SUBSCRIBERS
// ============================================================================

export async function getSubscribersList(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.isActive, true))
    .orderBy(desc(newsletterSubscribers.subscribedAt))
    .limit(limit)
    .offset(offset);
}

export async function getTotalSubscribersCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select({ count: count() })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.isActive, true));
  return (result[0]?.count as number) || 0;
}

export async function unsubscribeEmail(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(newsletterSubscribers)
    .set({ isActive: false, unsubscribedAt: new Date() })
    .where(eq(newsletterSubscribers.email, email));
}

// ============================================================================
// ACTIVITY LOGGING
// ============================================================================

export async function logActivity(data: InsertAdminActivityLog) {
  const db = await getDb();
  if (!db) return;
  await db.insert(adminActivityLog).values(data);
}

export async function getActivityLog(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(adminActivityLog)
    .orderBy(desc(adminActivityLog.createdAt))
    .limit(limit)
    .offset(offset);
}

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export async function getDashboardStats() {
  const totalWatches = await getTotalWatchesCount();
  const totalBrands = await getTotalBrandsCount();
  const totalSubscribers = await getTotalSubscribersCount();

  return {
    totalWatches,
    totalBrands,
    totalSubscribers,
  };
}
