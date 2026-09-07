import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { brands, watches } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * CSV Import Router
 * Handles bulk watch imports from CSV data
 */
export const csvImportRouter = router({
  /**
   * Import watches from parsed CSV data
   * Validates each watch, creates brands if needed, and inserts watches
   */
  importWatches: protectedProcedure
    .input(
      z.object({
        watches: z.array(
          z.object({
            brand: z.string().min(1),
            model: z.string().min(1),
            referenceNumber: z.string().min(1),
            yearAcquired: z.number().min(1900),
            retailPrice: z.number().min(0),
            marketValue: z.number().min(0),
            condition: z.enum(["Mint", "Excellent", "Good", "Fair"]),
            descriptionEn: z.string().optional(),
            descriptionAr: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Only admins can import watches
      if (ctx.user?.role !== "admin") {
        throw new Error("Only admins can import watches");
      }

      const db = await getDb();
      if (!db) {
        throw new Error("Database connection failed");
      }

      const results = {
        imported: 0,
        failed: 0,
        errors: [] as Array<{ index: number; error: string }>,
      };

      // Process each watch
      for (let i = 0; i < input.watches.length; i++) {
        const watchData = input.watches[i];

        try {
          // Find or create brand
          let brandRecord = await db
            .select()
            .from(brands)
            .where(eq(brands.nameEn, watchData.brand))
            .limit(1);

          let brandId: number;

          if (brandRecord.length === 0) {
            // Create new brand
            const newBrand = await db.insert(brands).values({
              nameEn: watchData.brand,
              nameAr: watchData.brand, // TODO: Add Arabic translation
              descriptionEn: `${watchData.brand} watches collection`,
              descriptionAr: `مجموعة ساعات ${watchData.brand}`,
              slug: watchData.brand.toLowerCase().replace(/\s+/g, "-"),
            });

            // Get the inserted brand ID
            const insertedBrand = await db
              .select()
              .from(brands)
              .where(eq(brands.nameEn, watchData.brand))
              .limit(1);

            brandId = insertedBrand[0]?.id || 0;
          } else {
            brandId = brandRecord[0].id;
          }

          // Create watch slug
          const slug = `${watchData.brand.toLowerCase()}-${watchData.model.toLowerCase()}`
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");

          // Insert watch
          await db.insert(watches).values({
            brandId,
            nameEn: watchData.model,
            nameAr: watchData.model, // TODO: Add Arabic translation
            referenceNumber: watchData.referenceNumber,
            slug,
            yearReleased: watchData.yearAcquired,
            retailPrice: Math.round(watchData.retailPrice),
            marketValue: Math.round(watchData.marketValue),
            rarity: watchData.condition,
            descriptionEn: watchData.descriptionEn || "",
            descriptionAr: watchData.descriptionAr || "",
            isFeatured: false,
            isActive: true,
          });

          results.imported++;
        } catch (error) {
          results.failed++;
          results.errors.push({
            index: i,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      return results;
    }),

  /**
   * Get import history
   */
  getImportHistory: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("Only admins can view import history");
    }

    // TODO: Implement import history tracking
    return [];
  }),
});
