export function matchesReleaseYear(
  yearReleased: number | null | undefined,
  yearFrom: number,
  yearTo: number,
  currentYear: number,
) {
  const hasExplicitYearFilter = yearFrom !== 1900 || yearTo !== currentYear;
  if (!hasExplicitYearFilter) return true;

  const year = yearReleased || 0;
  return year >= yearFrom && year <= yearTo;
}
