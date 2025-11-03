import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar, date } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extended with role-based access control for admin functionality.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Luxury watch brands (Patek Philippe, Richard Mille, etc.)
 */
export const brands = mysqlTable("brands", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  descriptionEn: text("descriptionEn"),
  descriptionAr: text("descriptionAr"),
  logoUrl: varchar("logoUrl", { length: 500 }),
  foundedYear: int("foundedYear"),
  country: varchar("country", { length: 100 }),
  websiteUrl: varchar("websiteUrl", { length: 500 }),
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Brand = typeof brands.$inferSelect;
export type InsertBrand = typeof brands.$inferInsert;

/**
 * Individual watches in Sheikh Ammar's collection
 */
export const watches = mysqlTable("watches", {
  id: int("id").autoincrement().primaryKey(),
  brandId: int("brandId").notNull(),
  referenceNumber: varchar("referenceNumber", { length: 100 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  descriptionEn: text("descriptionEn"),
  descriptionAr: text("descriptionAr"),
  storyEn: text("storyEn"),
  storyAr: text("storyAr"),
  material: varchar("material", { length: 255 }),
  dialColor: varchar("dialColor", { length: 100 }),
  caseSize: varchar("caseSize", { length: 50 }),
  movement: varchar("movement", { length: 255 }),
  complications: text("complications"),
  waterResistance: varchar("waterResistance", { length: 50 }),
  powerReserve: varchar("powerReserve", { length: 50 }),
  limitedEdition: boolean("limitedEdition").default(false).notNull(),
  productionQuantity: int("productionQuantity"),
  yearReleased: int("yearReleased"),
  retailPrice: int("retailPrice"),
  marketValue: int("marketValue"),
  rarity: varchar("rarity", { length: 50 }),
  mainImageUrl: varchar("mainImageUrl", { length: 500 }),
  viewCount: int("viewCount").default(0).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Watch = typeof watches.$inferSelect;
export type InsertWatch = typeof watches.$inferInsert;

/**
 * Multiple images per watch (studio shots, wrist shots, detail shots)
 */
export const watchImages = mysqlTable("watchImages", {
  id: int("id").autoincrement().primaryKey(),
  watchId: int("watchId").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  imageKey: varchar("imageKey", { length: 500 }).notNull(),
  imageType: varchar("imageType", { length: 50 }).notNull(), // studio, wrist, detail, movement
  captionEn: varchar("captionEn", { length: 255 }),
  captionAr: varchar("captionAr", { length: 255 }),
  displayOrder: int("displayOrder").default(0).notNull(),
  width: int("width"),
  height: int("height"),
  fileSize: int("fileSize"),
  mimeType: varchar("mimeType", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WatchImage = typeof watchImages.$inferSelect;
export type InsertWatchImage = typeof watchImages.$inferInsert;

/**
 * Photos of Sheikh Ammar wearing watches
 */
export const sheikhPhotos = mysqlTable("sheikhPhotos", {
  id: int("id").autoincrement().primaryKey(),
  watchId: int("watchId"), // Optional - may not always identify specific watch
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  imageKey: varchar("imageKey", { length: 500 }).notNull(),
  captionEn: varchar("captionEn", { length: 255 }),
  captionAr: varchar("captionAr", { length: 255 }),
  eventName: varchar("eventName", { length: 255 }),
  photoDate: date("photoDate"),
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SheikhPhoto = typeof sheikhPhotos.$inferSelect;
export type InsertSheikhPhoto = typeof sheikhPhotos.$inferInsert;

/**
 * Video backgrounds for homepage and sections
 */
export const videoBackgrounds = mysqlTable("videoBackgrounds", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  videoUrl: varchar("videoUrl", { length: 500 }).notNull(),
  videoKey: varchar("videoKey", { length: 500 }).notNull(),
  thumbnailUrl: varchar("thumbnailUrl", { length: 500 }),
  duration: int("duration"),
  resolution: varchar("resolution", { length: 20 }),
  fileSize: int("fileSize"),
  usageLocation: varchar("usageLocation", { length: 50 }).notNull(), // homepage, collection, about
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VideoBackground = typeof videoBackgrounds.$inferSelect;
export type InsertVideoBackground = typeof videoBackgrounds.$inferInsert;

/**
 * Page view tracking for analytics
 */
export const pageViews = mysqlTable("pageViews", {
  id: int("id").autoincrement().primaryKey(),
  watchId: int("watchId"),
  brandId: int("brandId"),
  pagePath: varchar("pagePath", { length: 500 }).notNull(),
  pageTitle: varchar("pageTitle", { length: 255 }),
  language: varchar("language", { length: 5 }),
  visitorIp: varchar("visitorIp", { length: 45 }),
  userAgent: text("userAgent"),
  referrer: varchar("referrer", { length: 500 }),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  deviceType: varchar("deviceType", { length: 50 }),
  sessionId: varchar("sessionId", { length: 255 }),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});

export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = typeof pageViews.$inferInsert;

/**
 * Admin users for CMS access
 */
export const adminUsers = mysqlTable("adminUsers", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  fullName: varchar("fullName", { length: 255 }),
  email: varchar("email", { length: 320 }),
  role: varchar("role", { length: 50 }).default("admin").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  lastLoginAt: timestamp("lastLoginAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;

/**
 * Admin activity log for audit trail
 */
export const adminActivityLog = mysqlTable("adminActivityLog", {
  id: int("id").autoincrement().primaryKey(),
  adminUserId: int("adminUserId"),
  action: varchar("action", { length: 100 }).notNull(), // create, update, delete
  entityType: varchar("entityType", { length: 50 }).notNull(), // watch, brand, image, video
  entityId: int("entityId"),
  details: text("details"), // JSON string with action details
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminActivityLog = typeof adminActivityLog.$inferSelect;
export type InsertAdminActivityLog = typeof adminActivityLog.$inferInsert;

/**
 * Define relationships for better type inference
 */
export const brandsRelations = relations(brands, ({ many }) => ({
  watches: many(watches),
  pageViews: many(pageViews),
}));

export const watchesRelations = relations(watches, ({ one, many }) => ({
  brand: one(brands, {
    fields: [watches.brandId],
    references: [brands.id],
  }),
  images: many(watchImages),
  sheikhPhotos: many(sheikhPhotos),
  pageViews: many(pageViews),
}));

export const watchImagesRelations = relations(watchImages, ({ one }) => ({
  watch: one(watches, {
    fields: [watchImages.watchId],
    references: [watches.id],
  }),
}));

export const sheikhPhotosRelations = relations(sheikhPhotos, ({ one }) => ({
  watch: one(watches, {
    fields: [sheikhPhotos.watchId],
    references: [watches.id],
  }),
}));

export const pageViewsRelations = relations(pageViews, ({ one }) => ({
  watch: one(watches, {
    fields: [pageViews.watchId],
    references: [watches.id],
  }),
  brand: one(brands, {
    fields: [pageViews.brandId],
    references: [brands.id],
  }),
}));

export const adminActivityLogRelations = relations(adminActivityLog, ({ one }) => ({
  adminUser: one(adminUsers, {
    fields: [adminActivityLog.adminUserId],
    references: [adminUsers.id],
  }),
}));
