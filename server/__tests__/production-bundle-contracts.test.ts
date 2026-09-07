import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..", "..");

describe("production bundle contracts", () => {
  it("leaves dependency graph chunking to Vite instead of forcing fragile cross-vendor manual chunks", () => {
    const viteConfig = readFileSync(path.join(root, "vite.config.ts"), "utf8");

    expect(viteConfig).not.toContain("manualChunks");
    expect(viteConfig).not.toContain("vendor-react");
  });
});
