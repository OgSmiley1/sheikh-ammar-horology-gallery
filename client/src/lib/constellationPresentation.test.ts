import { describe, expect, it } from "vitest";
import { localizeConstellationModel } from "./constellationPresentation";

describe("localizeConstellationModel", () => {
  it("keeps official English model names in the English view", () => {
    expect(localizeConstellationModel("Tourbillon Souverain", "توربيون سوفيرين", "en")).toBe("Tourbillon Souverain");
  });

  it("uses the curated Arabic Constellation label when available", () => {
    expect(localizeConstellationModel("Royal Oak Chronograph", "Royal Oak Chronograph", "ar")).toBe("رويال أوك كرونوغراف");
  });
});
