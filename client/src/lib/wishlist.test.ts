import { describe, expect, it } from "vitest";
import { loadWishlist, toggleWishlist, WISHLIST_STORAGE_KEY } from "./wishlist";

function memoryStorage(initialValue: string | null = null) {
  let value = initialValue;
  return {
    getItem: () => value,
    setItem: (_key: string, nextValue: string) => { value = nextValue; },
    read: () => value,
  };
}

describe("visitor wishlist storage", () => {
  it("adds and removes a saved timepiece without storing visitor profile data", () => {
    const storage = memoryStorage();

    expect(toggleWishlist(120001, storage)).toEqual([120001]);
    expect(storage.read()).toBe(JSON.stringify([120001]));
    expect(toggleWishlist(120001, storage)).toEqual([]);
  });

  it("ignores invalid or corrupted local values", () => {
    expect(loadWishlist(memoryStorage("not-json"))).toEqual([]);
    expect(loadWishlist(memoryStorage(JSON.stringify([1, "2", -1, 0])))).toEqual([1]);
    expect(WISHLIST_STORAGE_KEY).toBe("royal-horology-wishlist");
  });
});
