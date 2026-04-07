/**
 * uploadAdmin.ts
 *
 * Admin image upload endpoint.
 * Accepts base64-encoded image data and saves it to client/public/uploads/
 * Returns the public URL for use in the admin portal.
 *
 * POST /api/upload-admin  { data: "base64...", filename?: "custom-name.jpg" }
 */

import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.resolve(__dirname, "../../client/public/uploads");

function generateFilename(originalName?: string): string {
  const ext = originalName
    ? path.extname(originalName).toLowerCase() || ".jpg"
    : ".jpg";
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `${ts}-${rand}${ext}`;
}

export function registerAdminUploadRoutes(
  app: ReturnType<typeof import("express")["default"]>
) {
  const router = Router();

  router.get("/", (_req: Request, res: Response) => {
    res.json({ ok: true, message: "Admin upload route active" });
  });

  router.post("/", (req: Request, res: Response) => {
    const { data, filename } = req.body as {
      data?: string;
      filename?: string;
    };

    if (!data || typeof data !== "string") {
      res.status(400).json({ ok: false, error: "Missing base64 image data" });
      return;
    }

    // Strip data-URI prefix if present
    const base64 = data.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");

    let buffer: Buffer;
    try {
      buffer = Buffer.from(base64, "base64");
    } catch {
      res.status(400).json({ ok: false, error: "Could not decode base64 data" });
      return;
    }

    // Validate file size (max 20 MB)
    if (buffer.length > 20 * 1024 * 1024) {
      res.status(400).json({ ok: false, error: "Image too large (max 20 MB)" });
      return;
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const fname = generateFilename(filename);
    const dest = path.join(UPLOADS_DIR, fname);

    try {
      fs.writeFileSync(dest, buffer);
      const publicUrl = `/uploads/${fname}`;
      console.log(`[upload-admin] Saved: ${fname} (${buffer.length} bytes)`);
      res.json({ ok: true, url: publicUrl, filename: fname, size: buffer.length });
    } catch (err) {
      console.error("[upload-admin] Write failed:", err);
      res.status(500).json({ ok: false, error: "Failed to write file" });
    }
  });

  app.use("/api/upload-admin", router);
}
