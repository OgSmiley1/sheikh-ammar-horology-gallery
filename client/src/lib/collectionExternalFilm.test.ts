import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Collection external watch-film reference", () => {
  it("embeds the supplied film with bilingual attribution and an explicit non-ownership boundary", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Collection.tsx"), "utf8");

    expect(source).toContain("youtube-nocookie.com/embed/Air31Kly7Ys");
    expect(source).toContain("IFL Watches");
    expect(source).toContain("is not the archive’s source of record");
    expect(source).toContain("ليس مصدراً رسمياً لسجلات الأرشيف");
    expect(source).toContain('loading="lazy"');
    expect(source).toContain('referrerPolicy="strict-origin-when-cross-origin"');
  });
});
