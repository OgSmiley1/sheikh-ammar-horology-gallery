import { describe, expect, it } from "vitest";
import { canDisplayInArabic, hasArabicScript, isSourceBoundedEditorialDescription } from "./localizationGuard";

describe("hasArabicScript", () => {
  it("accepts Arabic editorial copy", () => {
    expect(hasArabicScript("ساعة نادرة بإصدار محدود")).toBe(true);
  });

  it("rejects empty and untranslated Latin fallback copy", () => {
    expect(hasArabicScript(null)).toBe(false);
    expect(hasArabicScript("")).toBe(false);
    expect(hasArabicScript("An untranslated record description")).toBe(false);
  });
});

describe("canDisplayInArabic", () => {
  it("keeps Arabic facts and language-neutral measurements", () => {
    expect(canDisplayInArabic("ذهب أبيض")).toBe(true);
    expect(canDisplayInArabic("40mm")).toBe(true);
  });

  it("suppresses untranslated descriptive specification fallbacks", () => {
    expect(canDisplayInArabic("White Gold")).toBe(false);
    expect(canDisplayInArabic("Caliber 240 Q, Ultra-Thin Perpetual Calendar")).toBe(false);
  });
});

describe("isSourceBoundedEditorialDescription", () => {
  it("rejects unsupported ownership and continuing-wear claims from public descriptions", () => {
    expect(isSourceBoundedEditorialDescription("Not only he has rare watches in his collection")).toBe(false);
    expect(isSourceBoundedEditorialDescription("A published source describes the model's ceramic bezel.")).toBe(true);
    expect(isSourceBoundedEditorialDescription("يرتدي الساعة في الصورة")).toBe(false);
  });

  it("keeps an explicit Arabic non-ownership or non-wearer boundary visible", () => {
    expect(isSourceBoundedEditorialDescription("يوثق هذا السجل مصدر الطراز في المزاد فقط، ولا يثبت شخصًا بعينه يرتديها أو ظهورًا عامًا أو ملكية خاصة.")).toBe(true);
  });

  it("allows a clearly attributed Arabic reported-appearance statement while retaining its ownership boundary", () => {
    expect(isSourceBoundedEditorialDescription("تذكر تدوينة عامة من حساب موثق، مع وسم المصدر، أن الشخص شوهد مرتدياً هذا المرجع. يورد السجل ظهوراً معلناً فقط ولا يثبت ملكية خاصة، ولا يعيد نشر وسائط التدوينة.")).toBe(true);
  });
});
