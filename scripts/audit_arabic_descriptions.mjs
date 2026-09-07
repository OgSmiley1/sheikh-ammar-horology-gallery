import fs from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

const root = "/home/ubuntu/sheikh-ammar-horology-gallery";
const outputPath = path.join(root, "docs", "arabic_description_translation_draft.json");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for the bilingual archive audit.");
}
if (!process.env.BUILT_IN_FORGE_API_URL || !process.env.BUILT_IN_FORGE_API_KEY) {
  throw new Error("Built-in model endpoint credentials are required for the bilingual archive audit.");
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [records] = await connection.execute(`
  SELECT w.id, b.nameEn AS brandEn, w.referenceNumber, w.nameEn, w.descriptionEn, w.descriptionAr
  FROM watches w
  JOIN brands b ON b.id = w.brandId
  WHERE w.isActive = TRUE
    AND w.descriptionAr REGEXP '[A-Za-z]{6,}'
  ORDER BY b.nameEn, w.id
`);
await connection.end();

const system = `You are a bilingual haute-horlogerie editor. Translate the English archive descriptions into formal, idiomatic Modern Standard Arabic. Preserve official brand names, model names, reference numbers, calibre identifiers, and technical abbreviations when that is clearer. Do not add prices, availability, ownership claims, provenance claims, or facts that are not in the source. Preserve explicit source boundaries. Return only JSON matching the requested schema.`;

async function translateBatch(batch) {
  const payload = {
    model: "gpt-5-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify(batch) },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "arabic_watch_descriptions",
        strict: true,
        schema: {
          type: "object",
          properties: {
            translations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  descriptionAr: { type: "string" },
                },
                required: ["id", "descriptionAr"],
                additionalProperties: false,
              },
            },
          },
          required: ["translations"],
          additionalProperties: false,
        },
      },
    },
  };

  const response = await fetch(`${process.env.BUILT_IN_FORGE_API_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Translation request failed: ${response.status} ${await response.text()}`);
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content).translations;
}

const batches = [];
for (let index = 0; index < records.length; index += 6) batches.push(records.slice(index, index + 6));

const results = [];
for (let index = 0; index < batches.length; index += 3) {
  const group = batches.slice(index, index + 3);
  const translations = await Promise.all(group.map(translateBatch));
  results.push(...translations.flat());
}

const sourceIds = new Set(records.map((record) => Number(record.id)));
const resultIds = new Set(results.map((item) => item.id));
if (sourceIds.size !== resultIds.size || [...sourceIds].some((id) => !resultIds.has(id))) {
  throw new Error("Translation draft did not return a one-to-one record mapping.");
}
if (results.some((item) => !item.descriptionAr.trim() || item.descriptionAr.length > 2000)) {
  throw new Error("Translation draft contains an empty or unreasonable description.");
}

await fs.writeFile(outputPath, JSON.stringify({ generatedAt: new Date().toISOString(), sourceCount: records.length, translations: results }, null, 2));
process.stdout.write(`Prepared ${results.length} Arabic description drafts at ${outputPath}\n`);
