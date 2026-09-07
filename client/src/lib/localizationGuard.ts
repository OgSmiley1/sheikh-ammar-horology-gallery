export function hasArabicScript(value: string | null | undefined): boolean {
  return Boolean(value && /[\u0600-\u06FF]/.test(value));
}

/**
 * Allows universal measurements such as "40mm" in Arabic layouts while
 * preventing untranslated English descriptive facts from appearing as fallback copy.
 */
export function canDisplayInArabic(value: string | null | undefined): boolean {
  if (!value) return false;

  return hasArabicScript(value) || /^\s*\d+(?:[.,]\d+)?\s*(?:mm|cm|m|bar|atm|h|hz|%|ct|cts|g)?\s*$/i.test(value);
}

/**
 * Prevent archive cards from turning a public appearance or unsourced legacy
 * wording into an ownership, acquisition, or continuing-wear assertion.
 */
export function isSourceBoundedEditorialDescription(value: string | null | undefined): boolean {
  if (!value) return false;

  const hasUnsupportedEnglishClaim = /\b(?:he has|his collection|is being worn by|his highness wears|owned by|acquired)\b/i.test(value);
  const hasUnsupportedArabicClaim = /(?:يرتدي|يملك|مجموعته|اقتنى|ملكيته)/.test(value);
  const explicitlyNegatesArabicClaim = /(?:لا\s+يثبت|لا\s+تثبت|دون\s+إثبات)[\s\S]{0,180}(?:يرتدي|يملك|مجموعته|اقتنى|ملكيته)/.test(value);
  const hasAttributedArabicReportedAppearance = /(?:تذكر|يذكر)\s+(?:تدوينة|منشور|تقرير)\s+(?:عامة|علني)[\s\S]{0,260}(?:شوهد|يرتدي|مرتدياً|كان\s+يرتدي)[\s\S]{0,260}(?:لا\s+يثبت|لا\s+تثبت|دون\s+إثبات)[\s\S]{0,180}(?:ملكية|يملك|مجموعته)/.test(value);

  return !hasUnsupportedEnglishClaim && (!hasUnsupportedArabicClaim || explicitlyNegatesArabicClaim || hasAttributedArabicReportedAppearance);
}
