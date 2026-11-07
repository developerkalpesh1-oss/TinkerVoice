/**
 * Ensures each CSV recipient row has a prompt/system_prompt value.
 * Existing non-empty prompt cells are left unchanged.
 */
function parseCsvMatrix(content: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  const text = content.replace(/^\uFEFF/, "");
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]!;
    const next = text[index + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
      continue;
    }
    if (char === ",") {
      row.push(cell);
      cell = "";
      continue;
    }
    if (char === "\n" || (char === "\r" && next === "\n")) {
      row.push(cell);
      cell = "";
      if (row.some((value) => value.trim().length > 0)) rows.push(row);
      row = [];
      if (char === "\r") index += 1;
      continue;
    }
    if (char === "\r") {
      row.push(cell);
      cell = "";
      if (row.some((value) => value.trim().length > 0)) rows.push(row);
      row = [];
      continue;
    }
    cell += char;
  }
  row.push(cell);
  if (row.some((value) => value.trim().length > 0)) rows.push(row);
  return rows;
}

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

export function applyCampaignPromptToRecipientCsv(
  content: string,
  systemPrompt: string,
): string {
  const prompt = systemPrompt.trim();
  if (!prompt) return content;
  const matrix = parseCsvMatrix(content);
  if (matrix.length === 0) return content;
  const header = matrix[0]!.map((cell) => cell.trim().toLowerCase().replace(/\s+/g, "_"));
  let promptIndex = header.findIndex((cell) => cell === "prompt" || cell === "system_prompt");
  const rows = matrix.map((row) => [...row]);
  if (promptIndex < 0) {
    promptIndex = header.length;
    rows[0] = [...rows[0]!, "prompt"];
  }
  for (let index = 1; index < rows.length; index += 1) {
    const row = rows[index]!;
    while (row.length < promptIndex) row.push("");
    const existing = (row[promptIndex] ?? "").trim();
    if (!existing) row[promptIndex] = prompt;
  }
  return `${rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n")}\n`;
}

export async function withCampaignPromptOnRecipientFile(
  file: File,
  systemPrompt: string,
): Promise<File> {
  if (!file.name.toLowerCase().endsWith(".csv")) return file;
  const next = applyCampaignPromptToRecipientCsv(await file.text(), systemPrompt);
  return new File([next], file.name, { type: file.type || "text/csv" });
}
