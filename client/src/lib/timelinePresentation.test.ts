import { describe, expect, it } from "vitest";
import { isSinglePublishedYear, localizeRarityLabel, localizeTimelineRarity } from "./timelinePresentation";

describe("localizeTimelineRarity", () => {
  it("preserves the original rarity in English", () => {
    expect(localizeTimelineRarity("Rare - Special Edition", "en")).toBe("Rare - Special Edition");
  });

  it("uses the exact Arabic label for a known rarity", () => {
    expect(localizeTimelineRarity("Ultra Rare - Custom Creation", "ar")).toBe("نادرة للغاية — إبداع خاص");
  });

  it("uses a neutral Arabic archive classification rather than mixing an unknown English rarity label into Arabic", () => {
    expect(localizeTimelineRarity("Archive-only description", "ar")).toBe("تصنيف أرشيفي");
  });

  it("translates the Top 10 limited-edition rarity treatment", () => {
    expect(localizeRarityLabel("Ultra Rare - Limited Edition", "ar")).toBe("نادرة للغاية — إصدار محدود");
  });

  it("covers the extended collection rarity descriptors", () => {
    expect(localizeRarityLabel("Ultra Rare - UAE Royal Commission", "ar")).toBe("نادرة للغاية — تكليف ملكي إماراتي");
    expect(localizeRarityLabel("Limited Annual Production", "ar")).toBe("إنتاج سنوي محدود");
    expect(localizeRarityLabel("One of a Kind", "ar")).toBe("قطعة فريدة");
    expect(localizeRarityLabel("Limited edition (50)", "ar")).toBe("إصدار محدود (50 قطعة)");
    expect(localizeRarityLabel("Source-reviewed appearance lead", "ar")).toBe("ظهور علني موثق بالمصادر");
    expect(localizeRarityLabel("Special-request jade dial (auction reference)", "ar")).toBe("مينا يشم بطلب خاص (مرجع مزاد)");
  });

  it("accepts only credible single release years for chronological aggregation", () => {
    expect(isSinglePublishedYear(1960)).toBe(true);
    expect(isSinglePublishedYear(2024)).toBe(true);
    expect(isSinglePublishedYear(19701980)).toBe(false);
    expect(isSinglePublishedYear(null)).toBe(false);
  });
});
