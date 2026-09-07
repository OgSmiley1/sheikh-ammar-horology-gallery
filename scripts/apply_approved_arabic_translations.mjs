import fs from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

const root = "/home/ubuntu/sheikh-ammar-horology-gallery";
const reviewPath = path.join(root, "docs", "arabic_description_translation_review.json");

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

const review = JSON.parse(await fs.readFile(reviewPath, "utf8"));
if (!Array.isArray(review.approvedTranslations) || review.approvedTranslations.length === 0) {
  throw new Error("No approved translations available for application.");
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);
try {
  await connection.beginTransaction();
  for (const item of review.approvedTranslations) {
    const [result] = await connection.execute(
      "UPDATE watches SET descriptionAr = ? WHERE id = ? AND isActive = TRUE",
      [item.descriptionAr, item.id],
    );
    if (result.affectedRows !== 1) throw new Error(`Expected one active row for ${item.id}, updated ${result.affectedRows}.`);
  }
  await connection.commit();
  process.stdout.write(`Updated ${review.approvedTranslations.length} approved Arabic descriptions.\n`);
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
