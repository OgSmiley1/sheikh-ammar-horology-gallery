import { readFile, writeFile } from "node:fs/promises";

const todoPath = new URL("../todo.md", import.meta.url);
const source = await readFile(todoPath, "utf8");

const pendingStatuses = new Map([
  ["Add high-res watch images and zoomable galleries per watch", "40% — gallery interface exists; awaiting rights-cleared high-resolution original images and record associations"],
  ["Corroborate candidate watch references with primary manufacturer or reputable specialist sources before any archive update", "65% — first candidate set corroborated where authoritative references are available; remaining public leads need source-by-source verification"],
  ["Integrate only corroborated facts and permission-safe media metadata with bilingual source boundaries", "35% — source-safe research ledger and existing boundaries are in place; no newly found third-party media is permission-safe for publication"],
  ["Validate source disclosures, language presentation, and image-usage boundaries before checkpointing any archive update", "70% — ledger documents sources, caption limits, and non-reuse status; final validation follows any approved archive changes"],
  ["Add a transparent percentage and status note to every task-register entry", "95% — automated annotation prepared; final spot-check pending"],
  ["Reconcile all agent-actionable entries and identify exact blockers for any externally dependent work", "85% — current open entries are classified; source-media and remaining corroboration work continue"],
  ["Validate the completion dashboard for consistent percentages, statuses, and next-action notes", "25% — validation will run after annotation"],
]);

const lines = source.split("\n").map((line) => {
  if (!line.startsWith("- [")) return line;
  if (/\b\d{1,3}%\b/.test(line)) return line;

  if (line.startsWith("- [x]")) {
    return `${line} · 100% — completed`;
  }

  for (const [task, status] of pendingStatuses) {
    if (line.includes(task)) return `${line} · ${status}`;
  }

  return `${line} · 0% — pending classification`;
});

await writeFile(todoPath, lines.join("\n"), "utf8");
