import { describe, expect, it } from "vitest";
import { rankRarity } from "./collectionSort";

describe("rankRarity", () => {
  it("prioritizes ultra-rare timepieces above rarer standard editions", () => {
    expect(rankRarity("Ultra Rare - Custom Creation")).toBeGreaterThan(rankRarity("Rare"));
    expect(rankRarity("Rare")).toBeGreaterThan(rankRarity("Limited Edition"));
  });

  it("handles missing rarity safely", () => {
    expect(rankRarity(null)).toBe(0);
  });
});
