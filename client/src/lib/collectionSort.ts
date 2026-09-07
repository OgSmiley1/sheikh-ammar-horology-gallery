export function rankRarity(rarity: string | null | undefined) {
  const normalized = rarity?.toLowerCase() ?? "";
  if (normalized.includes("ultra rare")) return 3;
  if (normalized.includes("rare")) return 2;
  if (normalized.includes("limited")) return 1;
  return 0;
}
