import { z } from "zod";

/**
 * CSV Watch Import Schema
 * Expected columns: Brand, Model, ReferenceNumber, YearAcquired, RetailPrice, MarketValue, Condition, DescriptionEn, DescriptionAr
 */
export const WatchImportSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model name is required"),
  referenceNumber: z.string().min(1, "Reference number is required"),
  yearAcquired: z.coerce.number().min(1900).max(new Date().getFullYear()),
  retailPrice: z.coerce.number().min(0),
  marketValue: z.coerce.number().min(0),
  condition: z.enum(["Mint", "Excellent", "Good", "Fair"]),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
});

export type WatchImportData = z.infer<typeof WatchImportSchema>;

/**
 * Parse CSV file and extract watch data
 */
export function parseCSV(csvText: string): string[][] {
  const lines = csvText.trim().split("\n");
  const rows: string[][] = [];

  for (const line of lines) {
    // Handle quoted fields that may contain commas
    const row: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        row.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    row.push(current.trim());
    rows.push(row);
  }

  return rows;
}

/**
 * Convert CSV rows to watch objects
 */
export function csvRowsToWatches(rows: string[][]): {
  data: WatchImportData[];
  errors: Array<{ row: number; error: string }> | { row: number; error: string }[];
} {
  if (rows.length === 0) {
    return { data: [], errors: [{ row: 0, error: "CSV file is empty" }] };
  }

  // Extract header
  const header = rows[0].map((h) => h.toLowerCase().trim());

  // Map CSV columns to schema fields
  const columnMap: Record<string, number> = {};
  const expectedColumns = [
    "brand",
    "model",
    "referencenumber",
    "yearacquired",
    "retailprice",
    "marketvalue",
    "condition",
    "descriptionen",
    "descriptionar",
  ];

  for (const col of expectedColumns) {
    const index = header.findIndex((h) => h.replace(/\s+/g, "") === col);
    if (index !== -1) {
      columnMap[col] = index;
    }
  }

  // Validate required columns
  const requiredColumns = ["brand", "model", "referencenumber"];
  const missingColumns = requiredColumns.filter((col) => !(col in columnMap));

  if (missingColumns.length > 0) {
    return {
      data: [],
      errors: [
        {
          row: 0,
          error: `Missing required columns: ${missingColumns.join(", ")}`,
        },
      ],
    };
  }

  const data: WatchImportData[] = [];
  const errors: Array<{ row: number; error: string }> = [];

  // Process data rows
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    // Skip empty rows
    if (row.every((cell) => !cell)) {
      continue;
    }

    try {
      const watchData = {
        brand: row[columnMap["brand"]] || "",
        model: row[columnMap["model"]] || "",
        referenceNumber: row[columnMap["referencenumber"]] || "",
        yearAcquired: row[columnMap["yearacquired"]]
          ? parseInt(row[columnMap["yearacquired"]])
          : new Date().getFullYear(),
        retailPrice: row[columnMap["retailprice"]]
          ? parseFloat(row[columnMap["retailprice"]])
          : 0,
        marketValue: row[columnMap["marketvalue"]]
          ? parseFloat(row[columnMap["marketvalue"]])
          : 0,
        condition: (row[columnMap["condition"]] || "Good") as
          | "Mint"
          | "Excellent"
          | "Good"
          | "Fair",
        descriptionEn: row[columnMap["descriptionen"]] || undefined,
        descriptionAr: row[columnMap["descriptionar"]] || undefined,
      };

      // Validate using schema
      const validated = WatchImportSchema.parse(watchData);
      data.push(validated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push({
          row: i + 1,
          error: (error as any).errors.map((e: any) => `${e.path.join(".")}: ${e.message}`).join("; "),
        });
      } else {
        errors.push({
          row: i + 1,
          error: "Invalid row data",
        });
      }
    }
  }

  return { data, errors };
}

/**
 * Generate sample CSV template
 */
export function generateCSVTemplate(): string {
  const headers = [
    "Brand",
    "Model",
    "ReferenceNumber",
    "YearAcquired",
    "RetailPrice",
    "MarketValue",
    "Condition",
    "DescriptionEn",
    "DescriptionAr",
  ];

  const sampleData = [
    [
      "Patek Philippe",
      "Nautilus",
      "5711/1A",
      "2020",
      "35000",
      "120000",
      "Mint",
      "Classic luxury sports watch",
      "ساعة رياضية فاخرة كلاسيكية",
    ],
    [
      "Rolex",
      "Submariner",
      "116610LN",
      "2019",
      "9000",
      "15000",
      "Excellent",
      "Professional diving watch",
      "ساعة غوص احترافية",
    ],
    [
      "Audemars Piguet",
      "Royal Oak",
      "15400ST",
      "2021",
      "40000",
      "95000",
      "Good",
      "Iconic integrated bracelet design",
      "تصميم سوار متكامل أيقوني",
    ],
  ];

  const rows = [headers, ...sampleData];
  return rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
}
