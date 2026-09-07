import fs from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

const root = "/home/ubuntu/sheikh-ammar-horology-gallery";
const draftPath = path.join(root, "docs", "arabic_description_translation_draft.json");
const outputPath = path.join(root, "docs", "arabic_description_translation_review.json");
const excludedIds = new Set([60017, 60024, 60008]);

if (!process.env.DATABASE_URL || !process.env.BUILT_IN_FORGE_API_URL || !process.env.BUILT_IN_FORGE_API_KEY) {
  throw new Error("Database and built-in model endpoint credentials are required for the translation review.");
}

const draft = JSON.parse(await fs.readFile(draftPath, "utf8"));
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [records] = await connection.execute(`
  SELECT id, descriptionEn FROM watches WHERE id IN (${draft.translations.map(() => "?").join(",")})
`, draft.translations.map((item) => item.id));
await connection.end();
const englishById = new Map(records.map((record) => [Number(record.id), record.descriptionEn]));

const candidates = draft.translations
  .filter((item) => !excludedIds.has(item.id))
  .map((item) => ({ id: item.id, descriptionEn: englishById.get(item.id), descriptionAr: item.descriptionAr }));

async function reviewBatch(batch) {
  const response = await fetch(`${process.env.BUILT_IN_FORGE_API_URL}/v1/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: "You are an exacting bilingual editor. For each pair, approve only if the Arabic is idiomatic Modern Standard Arabic, materially faithful to the English source, preserves explicit source boundaries, and adds no ownership, appearance, price, availability, or other unsupported factual claim. Official proper names may remain in Latin script. Return JSON only." },
        { role: "user", content: JSON.stringify(batch) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "arabic_translation_review",
          strict: true,
          schema: {
            type: "object",
            properties: {
              reviews: {
                type: "array",
                items: {
                  type: "object",
                  properties: { id: { type: "integer" }, approved: { type: "boolean" }, reason: { type: "string" } },
                  required: ["id", "approved", "reason"],
                  additionalProperties: false,
                },
              },
            },
            required: ["reviews"],
            additionalProperties: false,
          },
        },
      },
    }),
  });
  if (!response.ok) throw new Error(`Translation review failed: ${response.status} ${await response.text()}`);
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content).reviews;
}

const batches = [];
for (let index = 0; index < candidates.length; index += 6) batches.push(candidates.slice(index, index + 6));
const reviewGroups = [];
for (let index = 0; index < batches.length; index += 3) reviewGroups.push(await Promise.all(batches.slice(index, index + 3).map(reviewBatch)));
const reviews = reviewGroups.flat(2);

const approvedIds = new Set(reviews.filter((review) => review.approved).map((review) => review.id));
const approvedTranslations = draft.translations.filter((item) => approvedIds.has(item.id));
await fs.writeFile(outputPath, JSON.stringify({ generatedAt: new Date().toISOString(), excludedIds: [...excludedIds], sourceCount: draft.sourceCount, reviews, approvedTranslations }, null, 2));
process.stdout.write(`Reviewed ${reviews.length} translations; approved ${approvedTranslations.length}. Draft review: ${outputPath}\n`);
