import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { getDb } from "./db";
import * as bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { eq, desc, sql } from "drizzle-orm";
import { watches, brands, pageViews } from "../drizzle/schema";
import { adminMvpRouter } from "./routers/admin-mvp";
import { csvImportRouter } from "./routers/csv-import";
import { issueAdminSessionToken, verifyAdminSessionToken } from "./admin-session";

async function requireVerifiedAdminSession(ctx: { req: { cookies?: Record<string, string | undefined> } }) {
  const session = await verifyAdminSessionToken(ctx.req.cookies?.admin_session);
  if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });

  const admin = await db.getAdminUserByUsername(session.username);
  if (!admin || admin.id !== session.id || admin.role !== session.role) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return admin;
}

const verifiedAdminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  await requireVerifiedAdminSession(ctx);
  return next();
});

export const appRouter = router({
  system: systemRouter,
  adminMvp: adminMvpRouter,
  csvImport: csvImportRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============================================================================
  // BRANDS
  // ============================================================================

  brands: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllBrands();
    }),

    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      return await db.getBrandBySlug(input.slug);
    }),
  }),

  // ============================================================================
  // WATCHES
  // ============================================================================

  watches: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllWatches();
    }),

    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const watch = await db.getWatchBySlug(input.slug);
      if (watch) {
        // Increment view count
        await db.incrementWatchViewCount(watch.id);
      }
      return watch;
    }),

    getByBrand: publicProcedure.input(z.object({ brandId: z.number() })).query(async ({ input }) => {
      return await db.getWatchesByBrand(input.brandId);
    }),

    getFeatured: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getFeaturedWatches(input?.limit);
      }),

    getImages: publicProcedure.input(z.object({ watchId: z.number() })).query(async ({ input }) => {
      return await db.getWatchImages(input.watchId);
    }),
  }),

  // ============================================================================
  // SHEIKH PHOTOS
  // ============================================================================

  sheikhPhotos: router({
    getAll: publicProcedure.query(async () => {
      return await db.getSheikhPhotos();
    }),

    getByWatch: publicProcedure
      .input(z.object({ watchId: z.number() }))
      .query(async ({ input }) => {
        return await db.getSheikhPhotos(input.watchId);
      }),
  }),

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  analytics: router({
    trackPageView: publicProcedure
      .input(
        z.object({
          pageType: z.string(),
          pagePath: z.string(),
          watchId: z.number().optional(),
          brandId: z.number().optional(),
          sessionId: z.string(),
          userAgent: z.string().optional(),
          ipAddress: z.string().optional(),
          referrer: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.trackPageView(input);
        return { success: true };
      }),

    getStats: publicProcedure.query(async () => {
      return await db.getPageViewStats();
    }),

    getTopWatches: publicProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        const result = await db
          .select({
            watchId: pageViews.watchId,
            watchName: watches.nameEn,
            referenceNumber: watches.referenceNumber,
            brandName: brands.nameEn,
            viewCount: sql<number>`COUNT(*)`
          })
          .from(pageViews)
          .leftJoin(watches, eq(pageViews.watchId, watches.id))
          .leftJoin(brands, eq(watches.brandId, brands.id))
          .where(sql`${pageViews.watchId} IS NOT NULL`)
          .groupBy(pageViews.watchId, watches.nameEn, watches.referenceNumber, brands.nameEn)
          .orderBy(sql`COUNT(*) DESC`)
          .limit(input.limit);

        return result;
      }),

    getRecentPageViews: verifiedAdminProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        const result = await db
          .select()
          .from(pageViews)
          .orderBy(desc(pageViews.viewedAt))
          .limit(input.limit);

        return result;
      }),
  }),

  // ==========================================================================
  // PUBLIC CORRESPONDENCE
  // ==========================================================================

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().trim().min(2).max(255),
          email: z.string().trim().email().max(320),
          subject: z.string().trim().max(255).optional(),
          message: z.string().trim().min(10).max(4000),
          language: z.enum(["en", "ar"]),
          website: z.string().max(0).optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Honeypot submissions receive an indistinguishable success response.
        if (input.website) return { success: true };

        await db.createContactMessage({
          name: input.name,
          email: input.email,
          subject: input.subject || null,
          message: input.message,
          language: input.language,
        });

        return { success: true };
      }),
  }),

  // ===========================================================================
  // MODERATED VISITOR COMMENTS
  // ===========================================================================

  comments: router({
    getApprovedByWatch: publicProcedure
      .input(z.object({ watchId: z.number().int().positive(), language: z.enum(["en", "ar"]) }))
      .query(async ({ input }) => db.getApprovedWatchComments(input.watchId, input.language)),

    getApprovedForHomepage: publicProcedure
      .input(z.object({
        language: z.enum(["en", "ar"]),
        limit: z.number().int().min(1).max(6).default(3),
      }))
      .query(async ({ input }) => db.getApprovedHomepageComments(input.language, input.limit)),

    submit: protectedProcedure
      .input(z.object({
        watchId: z.number().int().positive(),
        body: z.string().trim().min(2).max(800),
        language: z.enum(["en", "ar"]),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createWatchComment({
          watchId: input.watchId,
          userId: ctx.user.id,
          body: input.body,
          language: input.language,
          status: "pending",
        });
        return { success: true };
      }),
  }),

  // ============================================================================
  // ADMIN
  // ============================================================================

  admin: router({
    // Admin login
    login: publicProcedure
      .input(
        z.object({
          username: z.string(),
          password: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const admin = await db.getAdminUserByUsername(input.username);

        if (!admin) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }

        const isValidPassword = await bcrypt.compare(input.password, admin.passwordHash);

        if (!isValidPassword) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }

        // Update last login
        await db.updateAdminLastLogin(admin.id);

        // Log activity
        await db.logAdminActivity({
          adminUserId: admin.id,
          action: "login",
          entityType: "auth",
          details: "Admin logged in",
        });

        const adminSessionToken = await issueAdminSessionToken({
          id: admin.id,
          username: admin.username,
          role: admin.role,
        });

        // Store a signed, time-limited administrator session in an HTTP-only cookie.
        ctx.res.cookie(
          "admin_session",
          adminSessionToken,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
          }
        );

        return {
          success: true,
          admin: {
            id: admin.id,
            username: admin.username,
            fullName: admin.fullName,
            email: admin.email,
            role: admin.role,
          },
        };
      }),

    // Get current admin session
    me: publicProcedure.query(async ({ ctx }) => {
      try {
        const admin = await requireVerifiedAdminSession(ctx);
        return {
          id: admin.id,
          username: admin.username,
          fullName: admin.fullName,
          email: admin.email,
          role: admin.role,
        };
      } catch {
        return null;
      }
    }),

    // Admin logout
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie("admin_session", { path: "/" });
      return { success: true };
    }),

    // Get analytics for admin dashboard
    getDashboardStats: verifiedAdminProcedure.query(async () => {
      const stats = await db.getPageViewStats();
      const allWatches = await db.getAllWatches();
      const allBrands = await db.getAllBrands();

      return {
        ...stats,
        totalWatches: allWatches.length,
        totalBrands: allBrands.length,
        totalValue: allWatches.reduce((sum, w) => sum + (w.marketValue || 0), 0),
      };
    }),

    // Get recent activity
    getRecentActivity: verifiedAdminProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getRecentAdminActivity(input?.limit);
      }),

    // Create new watch
    createWatch: verifiedAdminProcedure
      .input(
        z.object({
          brandId: z.number(),
          referenceNumber: z.string(),
          nameEn: z.string(),
          nameAr: z.string(),
          slug: z.string(),
          descriptionEn: z.string().optional(),
          descriptionAr: z.string().optional(),
          storyEn: z.string().optional(),
          storyAr: z.string().optional(),
          material: z.string().optional(),
          dialColor: z.string().optional(),
          caseSize: z.string().optional(),
          movement: z.string().optional(),
          complications: z.string().optional(),
          waterResistance: z.string().optional(),
          limitedEdition: z.boolean().optional(),
          productionQuantity: z.number().optional(),
          yearReleased: z.number().optional(),
          retailPrice: z.number().optional(),
          marketValue: z.number().optional(),
          rarity: z.string().optional(),
          isFeatured: z.boolean().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const admin = await requireVerifiedAdminSession(ctx);
        const result = await db.createWatch(input);

        // Log activity
        await db.logAdminActivity({
          adminUserId: admin.id,
          action: "create",
          entityType: "watch",
          details: JSON.stringify({ name: input.nameEn, slug: input.slug }),
        });

        return { success: true, admin };
      }),

    // Delete watch
    deleteWatch: verifiedAdminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const admin = await requireVerifiedAdminSession(ctx);
        await db.deleteWatch(input.id);
        await db.logAdminActivity({
          adminUserId: admin.id,
          action: "delete",
          entityType: "watch",
          entityId: input.id,
          details: "Watch deleted",
        });
        return { success: true };
      }),

    // Update watch
    updateWatch: verifiedAdminProcedure
      .input(
        z.object({
          id: z.number(),
          data: z.object({
            nameEn: z.string().optional(),
            nameAr: z.string().optional(),
            descriptionEn: z.string().optional(),
            descriptionAr: z.string().optional(),
            storyEn: z.string().optional(),
            storyAr: z.string().optional(),
            material: z.string().optional(),
            dialColor: z.string().optional(),
            caseSize: z.string().optional(),
            movement: z.string().optional(),
            complications: z.string().optional(),
            retailPrice: z.number().optional(),
            marketValue: z.number().optional(),
            isFeatured: z.boolean().optional(),
            isActive: z.boolean().optional(),
          }),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const admin = await requireVerifiedAdminSession(ctx);
        const result = await db.updateWatch(input.id, input.data);

        // Log activity
        await db.logAdminActivity({
          adminUserId: admin.id,
          action: "update",
          entityType: "watch",
          entityId: input.id,
          details: JSON.stringify({ changes: input.data }),
        });

        return { success: true, result };
      }),

    getGalleryPhotos: publicProcedure.query(async () => {
      return await db.getAllSheikhPhotos();
    }),

    uploadGalleryPhoto: verifiedAdminProcedure
      .input(z.object({
        imageBase64: z.string().regex(/^data:image\/(?:jpeg|png|webp);base64,/),
        fileName: z.string().trim().min(1).max(255),
        mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
        captionEn: z.string().trim().max(255).optional(),
        captionAr: z.string().trim().max(255).optional(),
        eventName: z.string().trim().max(255).optional(),
        photoDate: z.string().date().optional(),
        watchId: z.number().int().positive().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await db.uploadSheikhPhoto(input);
        return { success: true, photo: result };
      }),

    uploadGalleryPhotos: verifiedAdminProcedure
      .input(z.object({
        photos: z.array(z.object({
          imageBase64: z.string().regex(/^data:image\/(?:jpeg|png|webp);base64,/),
          fileName: z.string().trim().min(1).max(255),
          mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
          captionEn: z.string().trim().max(255).optional(),
          captionAr: z.string().trim().max(255).optional(),
          eventName: z.string().trim().max(255).optional(),
          photoDate: z.string().date().optional(),
          watchId: z.number().int().positive().optional(),
        })).min(1).max(8),
      }))
      .mutation(async ({ input }) => {
        const photos = await db.uploadSheikhPhotos(input.photos);
        return { success: true, photos };
      }),

    updateGalleryPhoto: verifiedAdminProcedure
      .input(
        z.object({
          id: z.number(),
          captionEn: z.string().optional(),
          captionAr: z.string().optional(),
          eventName: z.string().optional(),
          photoDate: z.string().optional(),
          watchId: z.number().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await db.updateSheikhPhoto(input.id, input);
        return { success: true, photo: result };
      }),

    deleteGalleryPhoto: verifiedAdminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteSheikhPhoto(input.id);
        return { success: true };
      }),

    reorderGalleryPhotos: verifiedAdminProcedure
      .input(z.object({ photoIds: z.array(z.number().int().positive()).min(1).max(200).refine((ids) => new Set(ids).size === ids.length) }))
      .mutation(async ({ input }) => {
        await db.reorderSheikhPhotos(input.photoIds);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
