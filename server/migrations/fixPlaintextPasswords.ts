/**
 * Security migration — runs at server startup.
 * Detects any admin user whose passwordHash is NOT a bcrypt hash
 * (i.e. stored as plaintext) and re-hashes it properly.
 *
 * A bcrypt hash always starts with "$2a$" or "$2b$".
 * Anything else in that column is plaintext and must be fixed.
 *
 * Safe to run multiple times — skips rows that already have a valid hash.
 */
import bcrypt from "bcryptjs";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const BCRYPT_PREFIX_RE = /^\$2[ab]\$\d+\$/;

export async function fixPlaintextPasswords() {
  const db = await getDb();
  if (!db) {
    console.warn("[Security] fixPlaintextPasswords: DB not available, skipping.");
    return;
  }

  const users = await db.select().from(schema.adminUsers);
  let fixed = 0;

  for (const user of users) {
    if (!BCRYPT_PREFIX_RE.test(user.passwordHash)) {
      // passwordHash is plaintext — hash it now
      const hashed = await bcrypt.hash(user.passwordHash, 12);
      await db
        .update(schema.adminUsers)
        .set({ passwordHash: hashed })
        .where(eq(schema.adminUsers.id, user.id));
      console.log(`[Security] Hashed plaintext password for admin user: ${user.username}`);
      fixed++;
    }
  }

  if (fixed === 0) {
    console.log("[Security] fixPlaintextPasswords: all admin passwords are properly hashed.");
  } else {
    console.log(`[Security] fixPlaintextPasswords: fixed ${fixed} admin user(s).`);
  }
}
