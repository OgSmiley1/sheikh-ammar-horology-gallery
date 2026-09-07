import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const pageSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/pages/ConstellationOfTime.tsx"), "utf8");
const styleSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("3D constellation editorial contracts", () => {
  it("keeps the historic Arabic archive vocabulary and source boundary", () => {
    expect(pageSource).toContain("رحلة تحريرية بين الساعات التي ظهرت علنًا، تُقدَّم بدقة المصادر وهدوء المتحف الخاص.");
    expect(pageSource).toContain("لا تُستخدم صور خارجية أو تُضاف ساعات جديدة إلا بعد مراجعة المصدر.");
    expect(pageSource).toContain("localizeConstellationModel");
  });

  it("provides accessible 3D orbit controls and an active record focus", () => {
    expect(pageSource).toContain("constellation-stage");
    expect(pageSource).toContain("aria-label={isArabic ? \"معرض ثلاثي الأبعاد للساعات الموثقة\"");
    expect(pageSource).toContain("العنصر السابق");
    expect(pageSource).toContain("العنصر التالي");
    expect(pageSource).toContain("constellation-focus");
    expect(styleSource).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("uses the shared project-only media component for orbit and focus imagery", () => {
    expect(pageSource).toContain("<WatchMedia");
    expect(pageSource).toContain("imageUrl={watch.mainImageUrl}");
    expect(pageSource).toContain("imageUrl={activeWatch.mainImageUrl}");
    expect(styleSource).toContain(".constellation-orbit-card");
    expect(styleSource).toContain("perspective: 1100px");
  });
});
