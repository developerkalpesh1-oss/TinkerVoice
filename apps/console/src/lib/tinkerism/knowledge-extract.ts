import { lookup } from "node:dns/promises";
import { BlockList, isIP } from "node:net";
import { inflateRawSync } from "node:zlib";
import { extractText } from "unpdf";

const SOURCE_TEXT_CHAR_LIMIT = 20_000;

function cleanExtractedText(value: string): string {
  return value
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[^\S\n]{2,}/g, " ")
    .trim()
    .slice(0, SOURCE_TEXT_CHAR_LIMIT);
}

function knowledgeUrlError(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Enter a website URL.";
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return "Enter a full website URL, including https://.";
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return "Only http and https websites can be added.";
  }
  if (url.username || url.password) return "Remove the username and password from the URL.";
  if (!url.hostname || isPrivateKnowledgeHost(url.hostname)) return "Enter a public website URL.";
  return null;
}

function isPrivateKnowledgeHost(hostname: string): boolean {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) return true;
  if (host.includes(":") && (host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80:"))) {
    return true;
  }
  const parts = host.split(".");
  if (parts.length !== 4 || parts.some((part) => !/^\d+$/.test(part))) return false;
  const octets = parts.map((part) => Number(part));
  if (octets.some((part) => part > 255)) return false;
  const [first, second] = octets;
  if (first === 0 || first === 10 || first === 127) return true;
  if (first === 169 && second === 254) return true;
  if (first === 172 && second >= 16 && second <= 31) return true;
  if (first === 192 && second === 168) return true;
  if (first === 100 && second >= 64 && second <= 127) return true;
  return first >= 224;
}

const blockedAddresses = new BlockList();
blockedAddresses.addSubnet("0.0.0.0", 8, "ipv4");
blockedAddresses.addSubnet("10.0.0.0", 8, "ipv4");
blockedAddresses.addSubnet("100.64.0.0", 10, "ipv4");
blockedAddresses.addSubnet("127.0.0.0", 8, "ipv4");
blockedAddresses.addSubnet("169.254.0.0", 16, "ipv4");
blockedAddresses.addSubnet("172.16.0.0", 12, "ipv4");
blockedAddresses.addSubnet("192.0.2.0", 24, "ipv4");
blockedAddresses.addSubnet("192.168.0.0", 16, "ipv4");
blockedAddresses.addSubnet("198.51.100.0", 24, "ipv4");
blockedAddresses.addSubnet("203.0.113.0", 24, "ipv4");
blockedAddresses.addSubnet("224.0.0.0", 4, "ipv4");
blockedAddresses.addAddress("::1", "ipv6");
blockedAddresses.addSubnet("fc00::", 7, "ipv6");
blockedAddresses.addSubnet("fe80::", 10, "ipv6");

const MAX_URL_BYTES = 2 * 1024 * 1024;
const MAX_ZIP_ENTRY_BYTES = 20 * 1024 * 1024;

export function isBlockedKnowledgeAddress(address: string): boolean {
  const mapped = address.toLowerCase().startsWith("::ffff:") ? address.slice(7) : address;
  const family = isIP(mapped);
  if (family === 0) return true;
  return blockedAddresses.check(mapped, family === 6 ? "ipv6" : "ipv4");
}

export function htmlToText(html: string): string {
  const withoutBlocks = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<(nav|footer|header|noscript|svg)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h\d|tr|section|article)>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  return cleanExtractedText(decodeHtml(withoutBlocks));
}

export function pageTitle(html: string): string {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1] ? cleanExtractedText(decodeHtml(match[1])).slice(0, 160) : "";
}

export async function extractKnowledgeFile(fileName: string, bytes: Uint8Array): Promise<string> {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (extension === "txt") return requireText(cleanExtractedText(Buffer.from(bytes).toString("utf8")), fileName);
  if (extension === "docx") return requireText(extractDocx(bytes), fileName);
  if (extension === "pdf") return requireText(await extractPdf(bytes), fileName);
  throw new Error("Upload a PDF, DOCX, or TXT file.");
}

export async function extractKnowledgeUrl(rawUrl: string): Promise<{ name: string; text: string }> {
  const error = knowledgeUrlError(rawUrl);
  if (error) throw new Error(error);
  const firstUrl = new URL(rawUrl.trim());
  const downloaded = await downloadPublicResource(firstUrl);
  const type = downloaded.contentType.toLowerCase();
  const path = downloaded.url.pathname.toLowerCase();
  let text = "";
  if (type.includes("pdf") || path.endsWith(".pdf")) text = await extractPdf(downloaded.bytes);
  else if (type.includes("wordprocessingml") || path.endsWith(".docx")) text = extractDocx(downloaded.bytes);
  else if (type.startsWith("text/plain")) text = cleanExtractedText(Buffer.from(downloaded.bytes).toString("utf8"));
  else text = htmlToText(Buffer.from(downloaded.bytes).toString("utf8"));
  const name = pageTitle(Buffer.from(downloaded.bytes).toString("utf8")) || downloaded.url.hostname;
  return { name, text: requireText(text, downloaded.url.hostname) };
}

function requireText(text: string, label: string): string {
  if (!text.trim()) throw new Error(`No readable text was found in ${label}.`);
  return text;
}

async function extractPdf(bytes: Uint8Array): Promise<string> {
  const extracted = await extractText(new Uint8Array(bytes), { mergePages: true });
  return cleanExtractedText(extracted.text);
}

function extractDocx(bytes: Uint8Array): string {
  const document = readZipEntries(bytes).find((entry) => entry.name === "word/document.xml");
  if (!document) throw new Error("This DOCX file has no document text.");
  const xml = document.data.toString("utf8").replace(/<\/w:p>/g, "\n");
  const parts = [...xml.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g)].map((match) => decodeXml(match[1] ?? ""));
  return cleanExtractedText(parts.join(""));
}

function decodeXml(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, "&");
}

function decodeHtml(value: string): string {
  return decodeXml(value)
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)));
}

type ZipEntry = { name: string; data: Buffer };

export function readZipEntries(bytes: Uint8Array): ZipEntry[] {
  const buffer = Buffer.from(bytes);
  const eocd = buffer.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0 || eocd + 22 > buffer.length) throw new Error("This DOCX file could not be read.");
  const count = buffer.readUInt16LE(eocd + 10);
  if (count > 200) throw new Error("This DOCX file has too many parts.");
  let offset = buffer.readUInt32LE(eocd + 16);
  const entries: ZipEntry[] = [];
  for (let index = 0; index < count; index += 1) {
    if (offset + 46 > buffer.length || buffer.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error("This DOCX file could not be read.");
    }
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const uncompressedSize = buffer.readUInt32LE(offset + 24);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.subarray(offset + 46, offset + 46 + nameLength).toString("utf8");
    if (uncompressedSize > MAX_ZIP_ENTRY_BYTES || compressedSize > MAX_ZIP_ENTRY_BYTES) {
      throw new Error("This DOCX file is too large to process.");
    }
    if (localOffset + 30 > buffer.length) throw new Error("This DOCX file could not be read.");
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
    if (compressed.length !== compressedSize) throw new Error("This DOCX file could not be read.");
    const data = method === 0 ? Buffer.from(compressed) : method === 8 ? inflateRawSync(compressed) : null;
    if (!data) throw new Error("This DOCX file uses an unsupported compression method.");
    if (data.length > MAX_ZIP_ENTRY_BYTES) throw new Error("This DOCX file is too large to process.");
    entries.push({ name, data });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

async function downloadPublicResource(start: URL): Promise<{ url: URL; bytes: Uint8Array; contentType: string }> {
  let current = start;
  for (let hop = 0; hop < 4; hop += 1) {
    await assertPublicHost(current.hostname);
    const response = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(12_000),
      headers: { Accept: "text/html,application/pdf,text/plain;q=0.9,*/*;q=0.1", "User-Agent": "TinkerVoice" },
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error("The website redirected without a new address.");
      const next = new URL(location, current);
      const error = knowledgeUrlError(next.href);
      if (error) throw new Error(error);
      current = next;
      continue;
    }
    if (!response.ok) throw new Error(`The website returned HTTP ${response.status}.`);
    const bytes = await readLimited(response, MAX_URL_BYTES);
    return {
      url: current,
      bytes,
      contentType: response.headers.get("content-type") ?? "",
    };
  }
  throw new Error("The website redirected too many times.");
}

async function assertPublicHost(hostname: string): Promise<void> {
  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local")) {
    throw new Error("Enter a public website URL.");
  }
  const addresses = isIP(hostname)
    ? [{ address: hostname }]
    : await lookup(hostname, { all: true, verbatim: true });
  if (addresses.length === 0 || addresses.some((entry) => isBlockedKnowledgeAddress(entry.address))) {
    throw new Error("Enter a public website URL.");
  }
}

async function readLimited(response: Response, maxBytes: number): Promise<Uint8Array> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("The website returned an empty page.");
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error("That page is too large to add as knowledge.");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}
