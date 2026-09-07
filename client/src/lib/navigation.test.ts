import { describe, expect, it } from "vitest";
import { isMainNavigationActive, MORE_NAVIGATION, SHEIKH_GALLERY_NAVIGATION } from "./navigation";

describe("main navigation active state", () => {
  it("activates only Home at the root route", () => {
    expect(isMainNavigationActive("/", "/")).toBe(true);
    expect(isMainNavigationActive("/collection", "/")).toBe(false);
  });

  it("keeps a section active for nested routes", () => {
    expect(isMainNavigationActive("/collection/rolex", "/collection")).toBe(true);
    expect(isMainNavigationActive("/watch/rolex-daytona-diw-motley-carbon", "/collection")).toBe(true);
  });

  it("does not activate unrelated sections", () => {
    expect(isMainNavigationActive("/about", "/timeline")).toBe(false);
    expect(isMainNavigationActive("/timeline", "/timeline")).toBe(true);
  });

  it("keeps the Sheikh Gallery route available in the shared More navigation", () => {
    expect(MORE_NAVIGATION).toContainEqual(SHEIKH_GALLERY_NAVIGATION);
    expect(isMainNavigationActive("/sheikh-gallery", SHEIKH_GALLERY_NAVIGATION.href)).toBe(true);
  });
});
