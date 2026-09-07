const ARABIC_MODEL_NAMES: Record<string, string> = {
  "Perpetual Calendar Chronograph": "التقويم الدائم والكرونوغراف",
  "La Montoya Platinum Challenge": "لا مونتويا بلاتينوم تشالنج",
  "Royal Oak Perpetual Calendar": "رويال أوك بالتقويم الدائم",
  "Royal Oak Chronograph": "رويال أوك كرونوغراف",
  "Royal Oak Flying Tourbillon Extra-Thin": "رويال أوك توربيون طائر فائق النحافة",
  "Tourbillon Souverain": "توربيون سوفيرين",
};

export function localizeConstellationModel(nameEn: string, nameAr: string | null, language: "en" | "ar") {
  if (language === "en") return nameEn;
  return ARABIC_MODEL_NAMES[nameEn] || nameAr || nameEn;
}
