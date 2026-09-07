import { describe, expect, it } from "vitest";
import { normaliseProjectImageUrl } from "./WatchMedia";

describe("normaliseProjectImageUrl", () => {
  it("keeps only project-served watch image paths", () => {
    expect(normaliseProjectImageUrl("/watches/royal-oak.webp")).toBe("/watches/royal-oak.webp");
    expect(normaliseProjectImageUrl("/watches-verified/patek-2499.jpg")).toBe("/watches-verified/patek-2499.jpg");
    expect(normaliseProjectImageUrl("/manus-storage/watch-gallery/record.jpg")).toBe("/manus-storage/watch-gallery/record.jpg");
  });

  it("rejects empty, external, and malformed sources", () => {
    expect(normaliseProjectImageUrl(undefined)).toBeNull();
    expect(normaliseProjectImageUrl("   ")).toBeNull();
    expect(normaliseProjectImageUrl("https://example.com/watch.jpg")).toBeNull();
    expect(normaliseProjectImageUrl("data:image/png;base64,abc")).toBeNull();
    expect(normaliseProjectImageUrl("watch.jpg")).toBeNull();
  });
});
