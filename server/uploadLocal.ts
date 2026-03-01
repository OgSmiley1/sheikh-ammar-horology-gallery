/**
 * uploadLocal.ts
 *
 * Lightweight local-only route for saving the 3 personal photographs
 * of Sheikh Ammar directly to client/public/personal/.
 *
 * • No external services   • No API keys   • No cloud storage
 * • Uses Express JSON body parser (already configured at 50 MB)
 * • Base64 image data → decoded → written to disk via Node.js fs
 *
 * Routes:
 *   POST /api/upload-personal   { slot: "father"|"mbz"|"formal", data: "base64..." }
 *   GET  /api/upload-personal   200 OK health check
 */

import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Slot → final filename mapping */
const SLOT_TO_FILENAME: Record<string, string> = {
  father: "sheikh-with-father.jpg",
  mbz: "sheikh-with-mbz.jpg",
  formal: "sheikh-formal.jpg",
};

/* Resolve the public/personal directory relative to project root */
const PUBLIC_PERSONAL = path.resolve(__dirname, "../../client/public/personal");

export function registerUploadLocalRoutes(app: ReturnType<typeof import("express")["default"]>) {
  const router = Router();

  /* ── Health check ─────────────────────────────────────────────────────── */
  router.get("/", (_req: Request, res: Response) => {
    res.json({ ok: true, message: "Local upload route is active" });
  });

  /* ── Upload handler ───────────────────────────────────────────────────── */
  router.post("/", (req: Request, res: Response) => {
    const { slot, data } = req.body as { slot?: string; data?: string };

    /* Validate slot */
    if (!slot || !SLOT_TO_FILENAME[slot]) {
      res.status(400).json({
        ok: false,
        error: `Invalid slot. Must be one of: ${Object.keys(SLOT_TO_FILENAME).join(", ")}`,
      });
      return;
    }

    /* Validate data */
    if (!data || typeof data !== "string") {
      res.status(400).json({ ok: false, error: "Missing base64 image data" });
      return;
    }

    /* Strip data-URI prefix if present (e.g. "data:image/jpeg;base64,") */
    const base64 = data.replace(/^data:image\/[a-z]+;base64,/, "");

    /* Decode */
    let buffer: Buffer;
    try {
      buffer = Buffer.from(base64, "base64");
    } catch {
      res.status(400).json({ ok: false, error: "Could not decode base64 data" });
      return;
    }

    /* Ensure directory exists */
    if (!fs.existsSync(PUBLIC_PERSONAL)) {
      fs.mkdirSync(PUBLIC_PERSONAL, { recursive: true });
    }

    const filename = SLOT_TO_FILENAME[slot];
    const dest = path.join(PUBLIC_PERSONAL, filename);

    /* Write to disk */
    try {
      fs.writeFileSync(dest, buffer);
      console.log(`[upload-personal] Saved: ${filename} (${buffer.length} bytes)`);
      res.json({ ok: true, filename, size: buffer.length, path: `/personal/${filename}` });
    } catch (err) {
      console.error("[upload-personal] Write failed:", err);
      res.status(500).json({ ok: false, error: "Failed to write file to disk" });
    }
  });

  app.use("/api/upload-personal", router);
}
