import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("maison film homepage integration", () => {
  it("places the source-safe Arabic-narrated film and public-reference credits at the close of the story journey", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

    expect(source).toContain("royal-horology-maison-film-arabic_5df9808d.mp4");
    expect(source).toContain("Arabic-narrated archival study");
    expect(source).toContain("فيلم أرشيفي بتعليق عربي أصلي");
    expect(source).toContain("https://youtu.be/P3mrmovvtn8w");
    expect(source).toContain("https://youtu.be/Air31Kly7Ys");
    expect(source).toContain("preload=\"metadata\"");
  });
});
