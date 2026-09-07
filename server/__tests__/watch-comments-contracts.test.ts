import { describe, expect, it } from "vitest";
import { watchComments } from "../../drizzle/schema";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "../..");
const readSource = (path: string) => readFileSync(resolve(projectRoot, path), "utf8");

describe("moderated watch comments", () => {
  it("stores language, reviewer state, and a pending-by-default public safety boundary", () => {
    expect(watchComments.status.default).toBe("pending");
    expect(watchComments.watchId.notNull).toBe(true);
    expect(watchComments.userId.notNull).toBe(true);
    expect(watchComments.language.notNull).toBe(true);
  });

  it("keeps public reads approved-only while submissions enter the pending state", () => {
    const dbSource = readSource("server/db.ts");
    const routerSource = readSource("server/routers.ts");

    expect(dbSource).toContain('eq(watchComments.status, "approved")');
    expect(routerSource).toContain('status: "pending"');
    expect(routerSource).toContain("submit: protectedProcedure");
  });

  it("limits homepage reflections to administrator-approved comments in the active language", () => {
    const dbSource = readSource("server/db.ts");
    const routerSource = readSource("server/routers.ts");
    const homeSource = readSource("client/src/pages/Home.tsx");

    expect(dbSource).toContain("getApprovedHomepageComments");
    expect(dbSource).toContain('eq(watchComments.status, "approved")');
    expect(dbSource).toContain('eq(watchComments.language, language)');
    expect(routerSource).toContain("getApprovedForHomepage");
    expect(routerSource).toContain("getApprovedHomepageComments(input.language");
    expect(homeSource).toContain("trpc.comments.getApprovedForHomepage.useQuery");
    expect(homeSource).toContain("Reader reflections");
    expect(homeSource).toContain("انطباعات القرّاء");
    expect(homeSource).toContain("No approved reflections are published in this language yet.");
  });

  it("exposes a protected administrator approval-or-rejection route without seeded public copy", () => {
    const adminRouterSource = readSource("server/routers/admin-mvp.ts");
    const publicComponentSource = readSource("client/src/components/WatchComments.tsx");

    expect(adminRouterSource).toContain('status: z.enum(["approved", "rejected"])');
    expect(adminRouterSource).toContain("verifyAdminSessionToken");
    expect(adminRouterSource).toContain("moderate: adminSessionProcedure");
    expect(adminRouterSource).not.toContain("hasAdminSessionCookie");
    expect(publicComponentSource).toContain("No reviews or testimonials are pre-populated.");
  });
});
