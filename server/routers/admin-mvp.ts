import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import * as dbAdmin from "../db-admin-helpers";
import * as galleryDb from "../db";
import { TRPCError } from "@trpc/server";
import { verifyAdminSessionToken } from "../admin-session";

async function requireVerifiedAdminSession(ctx: { req: { cookies?: Record<string, string | undefined> } }) {
  const session = await verifyAdminSessionToken(ctx.req.cookies?.admin_session);
  if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });

  const admin = await galleryDb.getAdminUserByUsername(session.username);
  if (!admin || admin.id !== session.id || admin.role !== session.role) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return admin;
}

const adminSessionProcedure = publicProcedure.use(async ({ ctx, next }) => {
  await requireVerifiedAdminSession(ctx);
  return next();
});

export const adminMvpRouter = router({
  getDashboardStats: adminSessionProcedure.query(async () => dbAdmin.getDashboardStats()),

  getActivityLog: adminSessionProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ input }) => dbAdmin.getActivityLog(input.limit, input.offset)),

  gallery: router({
    getAll: adminSessionProcedure.query(async () => galleryDb.getAllSheikhPhotos()),

    uploadBatch: adminSessionProcedure
      .input(z.object({
        rightsConfirmed: z.literal(true, "Gallery uploads require an administrator acknowledgement of image rights and watch association."),
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
        const photos = await galleryDb.uploadSheikhPhotos(input.photos);
        await dbAdmin.logActivity({ action: "create", entityType: "gallery_photo", details: `Uploaded ${input.photos.length} gallery photo(s)` });
        return { success: true, photos };
      }),

    update: adminSessionProcedure
      .input(z.object({
        id: z.number().int().positive(),
        captionEn: z.string().trim().max(255).optional(),
        captionAr: z.string().trim().max(255).optional(),
        eventName: z.string().trim().max(255).optional(),
        photoDate: z.string().date().optional(),
        watchId: z.number().int().positive().optional(),
      }))
      .mutation(async ({ input }) => {
        await galleryDb.updateSheikhPhoto(input.id, input);
        await dbAdmin.logActivity({ action: "update", entityType: "gallery_photo", entityId: input.id, details: "Updated gallery photo metadata" });
        return { success: true };
      }),

    delete: adminSessionProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await galleryDb.deleteSheikhPhoto(input.id);
        await dbAdmin.logActivity({ action: "delete", entityType: "gallery_photo", entityId: input.id, details: "Deleted gallery photo record" });
        return { success: true };
      }),

    reorder: adminSessionProcedure
      .input(z.object({ photoIds: z.array(z.number().int().positive()).min(1).max(200).refine((ids) => new Set(ids).size === ids.length) }))
      .mutation(async ({ input }) => {
        await galleryDb.reorderSheikhPhotos(input.photoIds);
        await dbAdmin.logActivity({ action: "update", entityType: "gallery_photo", details: "Reordered gallery photos" });
        return { success: true };
      }),
  }),

  watchImages: router({
    uploadBatch: adminSessionProcedure
      .input(z.object({
        rightsConfirmed: z.literal(true, "Watch-gallery uploads require an administrator acknowledgement of image rights and watch association."),
        watchId: z.number().int().positive(),
        images: z.array(z.object({
          imageBase64: z.string().regex(/^data:image\/(?:jpeg|png|webp);base64,/),
          fileName: z.string().trim().min(1).max(255),
          mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
          imageType: z.enum(["studio", "wrist", "detail", "movement"]),
          captionEn: z.string().trim().max(255).optional(),
          captionAr: z.string().trim().max(255).optional(),
        })).min(1).max(8),
      }))
      .mutation(async ({ input }) => {
        const watch = await dbAdmin.getWatchById(input.watchId);
        if (!watch) throw new TRPCError({ code: "NOT_FOUND", message: "Watch not found" });
        const images = await galleryDb.uploadWatchImages(input.watchId, input.images);
        await dbAdmin.logActivity({ action: "create", entityType: "watch_image", entityId: input.watchId, details: `Uploaded ${input.images.length} image(s) to a watch gallery with administrator acknowledgement` });
        return { success: true, images };
      }),
  }),

  comments: router({
    getPending: adminSessionProcedure
      .input(z.object({ limit: z.number().int().min(1).max(100).default(50) }))
      .query(async ({ input }) => galleryDb.getPendingWatchComments(input.limit)),

    moderate: adminSessionProcedure
      .input(z.object({ id: z.number().int().positive(), status: z.enum(["approved", "rejected"]) }))
      .mutation(async ({ input }) => {
        await galleryDb.moderateWatchComment(input.id, input.status);
        await dbAdmin.logActivity({ action: "update", entityType: "watch_comment", entityId: input.id, details: `Comment ${input.status}` });
        return { success: true };
      }),
  }),

  watches: router({
    getList: adminSessionProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
      .query(async ({ input }) => dbAdmin.getWatchesList(input.limit, input.offset)),

    getById: adminSessionProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const watch = await dbAdmin.getWatchById(input.id);
      if (!watch) throw new TRPCError({ code: "NOT_FOUND", message: "Watch not found" });
      return watch;
    }),

    update: adminSessionProcedure
      .input(z.object({
        id: z.number(),
        nameEn: z.string().optional(),
        nameAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        material: z.string().optional(),
        dialColor: z.string().optional(),
        caseSize: z.string().optional(),
        retailPrice: z.number().optional(),
        marketValue: z.number().optional(),
        rarity: z.string().optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await dbAdmin.updateWatchData(id, data);
        await dbAdmin.logActivity({ action: "update", entityType: "watch", entityId: id, details: JSON.stringify(data) });
        return { success: true };
      }),

    delete: adminSessionProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await dbAdmin.deleteWatchData(input.id);
      await dbAdmin.logActivity({ action: "delete", entityType: "watch", entityId: input.id, details: "Watch deleted" });
      return { success: true };
    }),

    create: adminSessionProcedure
      .input(z.object({
        brandId: z.number(),
        nameEn: z.string(),
        nameAr: z.string(),
        referenceNumber: z.string(),
        slug: z.string(),
        descriptionEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        material: z.string().optional(),
        dialColor: z.string().optional(),
        caseSize: z.string().optional(),
        retailPrice: z.number().optional(),
        marketValue: z.number().optional(),
        rarity: z.string().optional(),
        isFeatured: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        await dbAdmin.createWatchData(input);
        await dbAdmin.logActivity({ action: "create", entityType: "watch", details: JSON.stringify(input) });
        return { success: true };
      }),
  }),

  brands: router({
    getList: adminSessionProcedure.query(async () => dbAdmin.getBrandsList()),
  }),

  subscribers: router({
    getList: adminSessionProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => dbAdmin.getSubscribersList(input.limit, input.offset)),

    unsubscribe: adminSessionProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        await dbAdmin.unsubscribeEmail(input.email);
        await dbAdmin.logActivity({ action: "update", entityType: "subscriber", details: `Unsubscribed: ${input.email}` });
        return { success: true };
      }),
  }),
});
