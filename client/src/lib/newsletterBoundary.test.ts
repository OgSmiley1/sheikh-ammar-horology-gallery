import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("newsletter editorial boundary", () => {
  it("invites visitors to archive updates without commercial-offer language", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/components/NewsletterSignup.tsx"), "utf8");

    expect(source).toContain("new records and archive readings");
    expect(source).toContain("السجلات الجديدة وقراءات الأرشيف");
    expect(source).not.toContain("exclusive offers");
    expect(source).not.toContain("العروض الحصرية");
  });
});
