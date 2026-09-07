import { describe, expect, it } from "vitest";
import { localizeDIWDaytonaRarity, localizeDIWDaytonaSpecification } from "./diwDaytona";

describe("DIW Daytona bilingual specifications", () => {
  it("uses the verified 40 mm specification in English", () => {
    expect(localizeDIWDaytonaSpecification("40 mm", "en")).toBe("40 mm");
  });

  it("localizes verified specifications for Arabic", () => {
    expect(localizeDIWDaytonaSpecification("40 mm", "ar")).toBe("40 مم");
    expect(localizeDIWDaytonaSpecification("50 m", "ar")).toBe("50 متراً");
    expect(localizeDIWDaytonaSpecification("Rolex Calibre 4130, automatic chronograph", "ar"))
      .toBe("رولكس كاليبر 4130، كرونوغراف أوتوماتيكي");
  });

  it("preserves non-DIW values rather than inventing a translation", () => {
    expect(localizeDIWDaytonaSpecification("Unlisted specification", "ar")).toBe("Unlisted specification");
    expect(localizeDIWDaytonaSpecification(null, "ar")).toBeNull();
  });

  it("localizes the DIW limited-edition label in Arabic", () => {
    expect(localizeDIWDaytonaRarity("Limited Edition", "ar")).toBe("إصدار محدود");
    expect(localizeDIWDaytonaRarity("Limited Edition", "en")).toBe("Limited Edition");
  });
});
