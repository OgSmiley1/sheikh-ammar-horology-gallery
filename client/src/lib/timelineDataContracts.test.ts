import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("live source-bounded timeline contracts", () => {
  it("uses the current database archive and avoids unsupported acquisition language", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Timeline.tsx"), "utf8");

    expect(source).toContain("trpc.watches.getAll.useQuery()");
    expect(source).toContain("trpc.brands.getAll.useQuery()");
    expect(source).toContain("isSinglePublishedYear(watch.yearReleased)");
    expect(source).toContain("Record chronology");
    expect(source).toContain("تسلسل السجلات الزمني");
    expect(source).not.toContain("completeCollection");
    expect(source).not.toContain("Timeline of Acquisitions");
    expect(source).not.toContain("Years of Collecting");
    expect(source).not.toContain("Collection Growth");
  });

  it("keeps localized recovery and interactive year-selection states", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Timeline.tsx"), "utf8");

    expect(source).toContain("refetchWatches");
    expect(source).toContain("aria-pressed={selectedYear === event.year}");
    expect(source).toContain("localizeTimelineRarity(watch.rarity, language)");
  });
});
