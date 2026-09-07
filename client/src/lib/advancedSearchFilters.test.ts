import { describe, expect, it } from "vitest";
import { matchesReleaseYear } from "./advancedSearchFilters";

describe("matchesReleaseYear", () => {
  it("keeps watches with an unknown release year in the default search", () => {
    expect(matchesReleaseYear(null, 1900, 2026, 2026)).toBe(true);
  });

  it("excludes an unknown release year when the visitor requests a specific year range", () => {
    expect(matchesReleaseYear(null, 2020, 2024, 2026)).toBe(false);
  });

  it("matches known years within an explicitly selected range", () => {
    expect(matchesReleaseYear(2023, 2020, 2024, 2026)).toBe(true);
    expect(matchesReleaseYear(2018, 2020, 2024, 2026)).toBe(false);
  });
});
