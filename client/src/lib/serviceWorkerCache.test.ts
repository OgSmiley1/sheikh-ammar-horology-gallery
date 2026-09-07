import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("service worker publication cache contracts", () => {
  it("versions the cache and prioritizes current network assets before offline fallback", () => {
    const source = readFileSync(resolve(process.cwd(), "client/public/service-worker.js"), "utf8");

    expect(source).toContain('CACHE_NAME = "royal-horology-shell-v8"');
    expect(source).toContain("self.skipWaiting()");
    expect(source).toContain("self.clients.claim()");
    expect(source).toContain("fetch(request)");
    expect(source).toContain(".catch(() => caches.match(request))");
    expect(source).not.toContain("return cached || network");
  });
});
