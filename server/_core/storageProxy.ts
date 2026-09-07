import type { Express } from "express";
import { ENV } from "./env";

/** Serves managed project assets from their non-enumerable storage keys. */
export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string | undefined>)["0"];

    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy is not configured");
      return;
    }

    const forgeUrl = new URL(
      "v1/storage/presign/get",
      `${ENV.forgeApiUrl.replace(/\/+$/, "")}/`,
    );
    forgeUrl.searchParams.set("path", key);

    let presignedUrl: string | undefined;
    for (let attempt = 0; attempt < 3 && !presignedUrl; attempt += 1) {
      try {
        const forgeResponse = await fetch(forgeUrl, {
          headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
        });

        if (forgeResponse.ok) {
          const { url } = (await forgeResponse.json()) as { url?: string };
          presignedUrl = url;
        }
      } catch {
        // A freshly started local service can briefly lack upstream DNS resolution.
      }

      if (!presignedUrl && attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
      }
    }

    if (!presignedUrl) {
      res.status(503).send("Storage service is temporarily unavailable");
      return;
    }

    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
    res.redirect(307, presignedUrl);
  });
}
