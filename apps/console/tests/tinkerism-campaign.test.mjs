import assert from "node:assert/strict";
import { deflateRawSync } from "node:zlib";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const campaigns = await import(pathToFileURL(join(root, "src/lib/tinkerism/campaigns.ts")).href);
const extract = await import(pathToFileURL(join(root, "src/lib/tinkerism/knowledge-extract.ts")).href);

test("the selected campaign prompt and knowledge are applied to each recipient", () => {
  const saved = campaigns.upsertCampaign(campaigns.parseStoredCampaigns(null), {
    ...campaigns.blankCampaign(10),
    name: "Spring sites",
    role: "You represent Tinkerism for the spring website campaign.",
    purpose: "Offer a website review.",
    instructions: "Ask which pages they want rebuilt.",
    behaviour: "Keep answers short and follow the caller’s language.",
    sources: [{
      id: "source-1",
      kind: "file",
      name: "services.txt",
      locator: "services.txt",
      text: "Tinkerism builds brochure websites from 12 pages.",
      updatedAt: "2026-11-05T00:00:00.000Z",
    }],
  });
  const selectedId = saved.at(-1).id;
  const prompt = campaigns.tinkerismCampaignPrompt(
    campaigns.campaignForCalls(saved, selectedId),
    "Asha",
    "+919876543210",
  );
  assert.match(prompt, /spring website campaign/);
  assert.match(prompt, /website review/);
  assert.match(prompt, /pages they want rebuilt/);
  assert.match(prompt, /brochure websites from 12 pages/);
  assert.match(prompt, /Do not greet again/);
  assert.match(prompt, /English or Hindi/);
  assert.match(prompt, /Do not invent/);
  assert.match(prompt, /Asha/);
  assert.match(prompt, /\+919876543210/);

  const other = campaigns.tinkerismCampaignPrompt(
    campaigns.campaignForCalls(saved, selectedId),
    "Ravi",
    "+919876543211",
  );
  assert.match(other, /brochure websites from 12 pages/);
  assert.match(other, /Ravi/);
  assert.doesNotMatch(other, /Asha/);
});

test("saved campaigns survive storage and broken data falls back", () => {
  assert.equal(campaigns.parseStoredCampaigns("not-json")[0].id, campaigns.DEFAULT_TINKERISM_CAMPAIGN.id);
  const stored = campaigns.parseStoredCampaigns(JSON.stringify([{
    id: "kept",
    name: "Kept",
    role: "Guide",
    purpose: "Book a visit",
    instructions: "Confirm the city.",
    behaviour: "Be brief.",
    sources: [{
      id: "url-1",
      kind: "url",
      name: "Docs",
      locator: "https://example.com/docs",
      text: "Visits are on weekdays.",
      updatedAt: "2026-11-05T00:00:00.000Z",
    }],
  }]));
  assert.equal(stored.length, 1);
  assert.equal(campaigns.parseStoredCampaignSelection("missing", stored), "kept");
  assert.equal(campaigns.parseStoredCampaignSelection("kept", stored), "kept");
  assert.equal(campaigns.removeCampaign(stored, "kept")[0].id, campaigns.DEFAULT_TINKERISM_CAMPAIGN.id);
});

test("call knowledge is capped and private website addresses are rejected", () => {
  const long = "a".repeat(campaigns.CALL_KNOWLEDGE_CHAR_LIMIT + 50);
  const included = campaigns.knowledgeForCall([{
    id: "s",
    kind: "file",
    name: "notes",
    locator: "notes.txt",
    text: long,
    updatedAt: "2026-11-05T00:00:00.000Z",
  }]);
  assert.equal(included.truncated, true);
  assert.match(included.text, /Do not guess beyond the text above/);
  assert.match(campaigns.knowledgeUrlError("http://127.0.0.1/admin"), /public website/);
  assert.equal(campaigns.knowledgeUrlError("file:///etc/passwd"), "Only http and https websites can be added.");
  assert.equal(extract.isBlockedKnowledgeAddress("127.0.0.1"), true);
  assert.equal(extract.isBlockedKnowledgeAddress("10.1.1.1"), true);
  assert.equal(extract.isBlockedKnowledgeAddress("169.254.169.254"), true);
  assert.equal(extract.isBlockedKnowledgeAddress("8.8.8.8"), false);
});

test("uploaded txt, docx, and pdf text becomes campaign knowledge", async () => {
  const txt = await extract.extractKnowledgeFile("notes.txt", Buffer.from("Weekday visits only."));
  assert.equal(txt, "Weekday visits only.");

  const docx = await extract.extractKnowledgeFile("brief.docx", docxWithText("Tinkerism builds brochure websites."));
  assert.match(docx, /brochure websites/);

  const pdf = await extract.extractKnowledgeFile("brief.pdf", simplePdf("Tinkerism websites"));
  assert.match(pdf, /Tinkerism websites/);

  const html = extract.htmlToText("<html><head><style>p{}</style></head><body><nav>Skip</nav><h1>Pricing</h1><p>Sites start after a review.</p><script>secret()</script></body></html>");
  assert.match(html, /Pricing/);
  assert.match(html, /Sites start after a review/);
  assert.doesNotMatch(html, /secret/);
  assert.doesNotMatch(html, /Skip/);
});

function docxWithText(text) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:r><w:t>${text}</w:t></w:r></w:p></w:document>`;
  return zipStored([{ name: "word/document.xml", data: Buffer.from(xml) }]);
}

function zipStored(files) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const file of files) {
    const name = Buffer.from(file.name);
    const compressed = deflateRawSync(file.data);
    const local = Buffer.alloc(30 + name.length + compressed.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(8, 8);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(file.data.length, 22);
    local.writeUInt16LE(name.length, 26);
    name.copy(local, 30);
    compressed.copy(local, 30 + name.length);
    locals.push(local);
    const central = Buffer.alloc(46 + name.length);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(8, 10);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(file.data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    name.copy(central, 46);
    centrals.push(central);
    offset += local.length;
  }
  const centralDirectory = Buffer.concat(centrals);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralDirectory.length, 12);
  eocd.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, centralDirectory, eocd]);
}

function simplePdf(text) {
  const stream = `BT /F1 24 Tf 72 100 Td (${text}) Tj ET`;
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
  ];
  let body = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) {
    offsets.push(Buffer.byteLength(body));
    body += object;
  }
  const xref = Buffer.byteLength(body);
  let trailer = `xref\n0 6\n0000000000 65535 f \n`;
  for (let index = 1; index <= 5; index += 1) {
    trailer += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  trailer += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(body + trailer);
}
