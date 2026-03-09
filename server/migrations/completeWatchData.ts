/**
 * completeWatchData — idempotent startup migration.
 * Adds missing fields (powerReserve, waterResistance, limitedEdition, yearReleased)
 * to watches that were previously seeded without them.
 *
 * Guard: checks if Rolex 6265 Paul Newman already has powerReserve set — skips if so.
 */
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";

export async function completeWatchData() {
  const db = await getDb();
  if (!db) {
    console.warn("[Migration] completeWatchData: DB not available, skipping.");
    return;
  }

  // Guard — skip if 6265 Paul Newman already has powerReserve
  const guard = await db
    .select({ id: schema.watches.id, powerReserve: schema.watches.powerReserve })
    .from(schema.watches)
    .where(eq(schema.watches.referenceNumber, "6265 Paul Newman"))
    .limit(1);

  if (guard.length && guard[0].powerReserve) {
    console.log("[Migration] completeWatchData: already applied, skipping.");
    return;
  }

  console.log("[Migration] completeWatchData: starting…");

  const updates: Array<{ ref: string; data: Partial<schema.InsertWatch> }> = [
    // F.P. Journe Chronomètre à Résonance — add yearReleased
    {
      ref: "Chronomètre à Résonance",
      data: { yearReleased: 2000 },
    },
    // F.P. Journe Tourbillon Souverain Bleu — add yearReleased
    {
      ref: "Tourbillon Souverain Bleu",
      data: { yearReleased: 2004 },
    },
    // Rolex Daytona 6265 Paul Newman
    {
      ref: "6265 Paul Newman",
      data: { powerReserve: "48 hours", waterResistance: "50m", limitedEdition: false },
    },
    // Rolex Daytona 6263 Quraysh
    {
      ref: "6263 Quraysh",
      data: { powerReserve: "48 hours", waterResistance: "50m", limitedEdition: false },
    },
    // Rolex Daytona 6264
    {
      ref: "6264",
      data: { powerReserve: "45 hours", waterResistance: "50m", limitedEdition: false },
    },
    // Rolex Daytona 6239 Paul Newman
    {
      ref: "6239 Paul Newman",
      data: { powerReserve: "45 hours", waterResistance: "30m", limitedEdition: false },
    },
    // Rolex Daytona AET Remould Custom
    {
      ref: "16610LV 'Kermit' AET",
      data: { powerReserve: "72 hours", waterResistance: "100m", yearReleased: 2022 },
    },
    // Rolex Daytona 6241 John Player Special
    {
      ref: "6241 John Player Special",
      data: { powerReserve: "48 hours", waterResistance: "50m", limitedEdition: false },
    },
    // Rolex Daytona 16519 White Gold
    {
      ref: "16519 White Gold",
      data: { powerReserve: "50 hours", waterResistance: "100m", limitedEdition: false },
    },
    // Rolex GMT-Master 1675 Pepsi
    {
      ref: "1675 'Pepsi' GMT-Master",
      data: { powerReserve: "48 hours", limitedEdition: false },
    },
    // Artisans de Geneve La Montoya
    {
      ref: "La Montoya Custom",
      data: { powerReserve: "48 hours", waterResistance: "30m" },
    },
  ];

  for (const { ref, data } of updates) {
    try {
      const rows = await db
        .select({ id: schema.watches.id })
        .from(schema.watches)
        .where(eq(schema.watches.referenceNumber, ref))
        .limit(1);

      if (rows.length) {
        await db
          .update(schema.watches)
          .set(data)
          .where(eq(schema.watches.id, rows[0].id));
        console.log(`[Migration] completeWatchData: updated "${ref}"`);
      } else {
        console.warn(`[Migration] completeWatchData: watch not found — ref="${ref}"`);
      }
    } catch (err) {
      console.error(`[Migration] completeWatchData: failed for ref="${ref}"`, err);
    }
  }

  console.log("[Migration] completeWatchData: done.");
}
