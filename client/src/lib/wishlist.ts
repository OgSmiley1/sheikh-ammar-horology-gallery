export const WISHLIST_STORAGE_KEY = "royal-horology-wishlist";

type KeyValueStore = Pick<Storage, "getItem" | "setItem">;

function browserStorage(): KeyValueStore | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function loadWishlist(storage: KeyValueStore | null = browserStorage()): number[] {
  if (!storage) return [];

  try {
    const parsed = JSON.parse(storage.getItem(WISHLIST_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is number => Number.isInteger(id) && id > 0) : [];
  } catch {
    return [];
  }
}

export function toggleWishlist(watchId: number, storage: KeyValueStore | null = browserStorage()): number[] {
  const current = loadWishlist(storage);
  const next = current.includes(watchId) ? current.filter((id) => id !== watchId) : [...current, watchId];

  try {
    storage?.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Browsing remains usable when storage is unavailable or blocked.
  }

  return next;
}
