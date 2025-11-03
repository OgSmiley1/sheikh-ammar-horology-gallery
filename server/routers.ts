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

export const appRouter = router({
  system: systemRouter,

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

    getRecentPageViews: publicProcedure
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

        // Store admin session in cookie (simplified - in production use proper session management)
        ctx.res.cookie(
          "admin_session",
          JSON.stringify({ id: admin.id, username: admin.username }),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
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
      const adminCookie = ctx.req.cookies["admin_session"];
      if (!adminCookie) {
        return null;
      }

      try {
        const session = JSON.parse(adminCookie);
        const admin = await db.getAdminUserByUsername(session.username);
        if (!admin) {
          return null;
        }

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
      ctx.res.clearCookie("admin_session");
      return { success: true };
    }),

    // Get analytics for admin dashboard
    getDashboardStats: publicProcedure.query(async () => {
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
    getRecentActivity: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getRecentAdminActivity(input?.limit);
      }),

    // Create new watch
    createWatch: publicProcedure
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
        // Check admin auth
        const adminCookie = ctx.req.cookies["admin_session"];
        if (!adminCookie) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const result = await db.createWatch(input);

        // Log activity
        const session = JSON.parse(adminCookie);
        const admin = await db.getAdminUserByUsername(session.username);
        if (admin) {
          await db.logAdminActivity({
            adminUserId: admin.id,
            action: "create",
            entityType: "watch",
            details: JSON.stringify({ name: input.nameEn, slug: input.slug }),
          });
        }

        return { success: true, admin };
      }),

    // Delete watch
    deleteWatch: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteWatch(input.id);
        return { success: true };
      }),

    // Update watch
    updateWatch: publicProcedure
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
        // Check admin auth
        const adminCookie = ctx.req.cookies["admin_session"];
        if (!adminCookie) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const result = await db.updateWatch(input.id, input.data);

        // Log activity
        const session = JSON.parse(adminCookie);
        const admin = await db.getAdminUserByUsername(session.username);
        if (admin) {
          await db.logAdminActivity({
            adminUserId: admin.id,
            action: "update",
            entityType: "watch",
            entityId: input.id,
            details: JSON.stringify({ changes: input.data }),
          });
        }

        return { success: true, result };
      }),
  }),
});

export type AppRouter = typeof appRouter;
