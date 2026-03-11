/**
 * Migration: Ensure the primary admin user exists with correct credentials.
 * Upserts admin user  Moatg_123 with a properly-hashed password.
 * Safe to run multiple times (idempotent).
 */
import bcrypt from "bcryptjs";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const ADMIN_USERNAME = "Moatg_123";
const ADMIN_PLAIN_PASSWORD = "Smile@123";

export async function ensureAdminUser() {
  const db = await getDb();
  if (!db) {
    console.warn("[Admin] ensureAdminUser: DB not available, skipping.");
    return;
  }

  // Check if this admin already exists
  const existing = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.username, ADMIN_USERNAME))
    .limit(1);

  const hashedPassword = await bcrypt.hash(ADMIN_PLAIN_PASSWORD, 12);

  if (existing.length === 0) {
    // Create the admin user
    await db.insert(schema.adminUsers).values({
      username: ADMIN_USERNAME,
      passwordHash: hashedPassword,
      fullName: "Gallery Administrator",
      email: "admin@horologygallery.ae",
      role: "admin",
      isActive: true,
    });
    console.log(`[Admin] Created admin user: ${ADMIN_USERNAME}`);
  } else {
    // Always keep the password up to date
    await db
      .update(schema.adminUsers)
      .set({ passwordHash: hashedPassword, isActive: true })
      .where(eq(schema.adminUsers.username, ADMIN_USERNAME));
    console.log(`[Admin] Admin user ${ADMIN_USERNAME} verified and password refreshed.`);
  }
}
