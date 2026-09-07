import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("legacy administrator router security", () => {
  it("uses signed session issuance and a verified gate for sensitive legacy procedures", () => {
    const source = readFileSync(resolve(process.cwd(), "server/routers.ts"), "utf8");
    const mvpSource = readFileSync(resolve(process.cwd(), "server/routers/admin-mvp.ts"), "utf8");

    expect(source).toContain("issueAdminSessionToken");
    expect(source).toContain("verifyAdminSessionToken");
    expect(source).toContain("const verifiedAdminProcedure = publicProcedure.use");
    [
      "getRecentPageViews: verifiedAdminProcedure",
      "getDashboardStats: verifiedAdminProcedure",
      "getRecentActivity: verifiedAdminProcedure",
      "createWatch: verifiedAdminProcedure",
      "deleteWatch: verifiedAdminProcedure",
      "updateWatch: verifiedAdminProcedure",
      "uploadGalleryPhoto: verifiedAdminProcedure",
      "uploadGalleryPhotos: verifiedAdminProcedure",
      "updateGalleryPhoto: verifiedAdminProcedure",
      "deleteGalleryPhoto: verifiedAdminProcedure",
      "reorderGalleryPhotos: verifiedAdminProcedure",
    ].forEach((procedure) => expect(source).toContain(procedure));
    expect(source).not.toContain("JSON.parse(adminCookie)");
    expect(source).toContain("ctx.req.cookies?.admin_session");
    expect(mvpSource).toContain("ctx.req.cookies?.admin_session");
  });
});
