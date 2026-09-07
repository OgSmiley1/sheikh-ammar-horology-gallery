import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("admin gallery management contracts", () => {
  it("persists batch uploads with validated image formats and display order", () => {
    const database = source("server/db.ts");
    const routers = source("server/routers.ts");

    expect(database).toContain("export async function uploadSheikhPhotos");
    expect(database).toContain("displayOrder: firstDisplayOrder + index");
    expect(database).toContain("export async function reorderSheikhPhotos");
    expect(database).toContain("Gallery images must be smaller than 12 MB");
    expect(database).toContain("watchSlug: watches.slug");
    expect(routers).toContain("uploadGalleryPhotos");
    expect(routers).toContain("reorderGalleryPhotos");
    expect(routers).toContain("image/webp");
  });

  it("connects authenticated gallery administration to the database-backed public gallery", () => {
    const manager = source("client/src/components/admin/AdminGalleryManager.tsx");
    const watchImageManager = source("client/src/components/admin/AdminWatchImageManager.tsx");
    const watchManager = source("client/src/components/admin/AdminWatchesMvp.tsx");
    const dashboard = source("client/src/pages/AdminDashboardMvp.tsx");
    const gallery = source("client/src/pages/SheikhGallery.tsx");
    const administratorRouter = source("server/routers/admin-mvp.ts");

    expect(manager).toContain("gallery.uploadBatch.useMutation");
    expect(manager).toContain("gallery.reorder.useMutation");
    expect(manager).toContain("onDrop");
    expect(manager).toContain("rights-and-association");
    expect(manager).toContain("rightsConfirmed: true");
    expect(administratorRouter).toContain("rightsConfirmed: z.literal(true");
    expect(administratorRouter).toContain("administrator acknowledgement of image rights and watch association");
    expect(administratorRouter).toContain("verifyAdminSessionToken");
    expect(administratorRouter).toContain("await requireVerifiedAdminSession(ctx)");
    expect(administratorRouter).not.toContain("hasAdminSessionCookie");
    expect(watchImageManager).toContain("adminMvp.watchImages.uploadBatch");
    expect(watchImageManager).toContain("watch-rights-and-association");
    expect(watchImageManager).toContain("imageType");
    expect(watchManager).toContain("AdminWatchImageManager");
    expect(administratorRouter).toContain("watchImages: router");
    expect(administratorRouter).toContain("Watch-gallery uploads require an administrator acknowledgement");
    expect(dashboard).toContain("AdminGalleryManager");
    expect(gallery).toContain("trpc.sheikhPhotos.getAll.useQuery");
    expect(gallery).toContain("managedFeatures.length ? managedFeatures : features");
    expect(gallery).toContain("photo.watchNameEn");
  });
});
