export type TinkerismKnowledgeSource = {
  id: string;
  kind: "file" | "url";
  name: string;
  locator: string;
  text: string;
  updatedAt: string;
};

export type TinkerismCampaign = {
  id: string;
  name: string;
  role: string;
  purpose: string;
  instructions: string;
  behaviour: string;
  /** Spoken opening line for this campaign only. Never reuse another campaign's greeting. */
  greeting: string;
  sources: TinkerismKnowledgeSource[];
  updatedAt: string;
};

export const TINKERISM_CAMPAIGNS_STORAGE_KEY = "tinkerism-call:campaigns:v1";
export const TINKERISM_SELECTED_CAMPAIGN_STORAGE_KEY = "tinkerism-call:campaign-selected:v1";

export const SOURCE_TEXT_CHAR_LIMIT = 20_000;
export const CALL_KNOWLEDGE_CHAR_LIMIT = 12_000;
export const MAX_KNOWLEDGE_SOURCES = 8;
export const MAX_KNOWLEDGE_FILE_BYTES = 8 * 1024 * 1024;

const FIELD_LIMITS = {
  name: 80,
  role: 2_000,
  purpose: 2_000,
  instructions: 4_000,
  behaviour: 4_000,
  greeting: 280,
} as const;

export const DEFAULT_TINKERISM_CAMPAIGN: TinkerismCampaign = {
  id: "tinkerism-websites",
  name: "Tinkerism websites",
  role: "You are on a live phone call for Tinkerism. Speak in short, natural sentences.",
  purpose:
    "Tinkerism builds websites and digital solutions for businesses. Find out whether the person wants to discuss how Tinkerism can help.",
  instructions:
    "If they want more information, ask one relevant question at a time and offer to follow up and confirm the details. Do not invent prices, timelines, features, customers, case studies, or commitments.",
  behaviour:
    "Speak like a natural phone conversation similar to ChatGPT voice mode. Listen until they finish; do not interrupt. Answer in one or two short spoken sentences. Occasionally use a brief acknowledgment such as Hmm, I understand, Right, or Absolutely, but do not overuse them. Detect English, Hindi, or Marathi immediately and reply in that language. Match their speaking style, vocabulary, simplicity, and tone. If they hesitate or struggle with English, politely offer Hindi or Marathi. If they are busy, not interested, finished, or ask you to stop, agree with a brief polite goodbye and end the call.",
  // Keep in sync with TINKERISM_FIRST_MESSAGE in contacts.ts.
  greeting:
    "Hi, this is Tinkerism. We help businesses with websites and digital work. Is now a good time to talk?",
  sources: [],
  updatedAt: "2026-11-05T00:00:00.000Z",
};

/**
 * Opening line for the selected campaign. Never falls back to the Tinkerism
 * greeting when another campaign is selected.
 */
export function campaignOpeningGreeting(campaign: TinkerismCampaign): string {
  const greeting = campaign.greeting.trim();
  if (greeting) return greeting;
  if (campaign.id === DEFAULT_TINKERISM_CAMPAIGN.id) {
    return DEFAULT_TINKERISM_CAMPAIGN.greeting;
  }
  const brand = campaign.name.trim() || "our team";
  return `Hi, this is ${brand}. Is now a good time to talk?`;
}

export function cleanExtractedText(value: string): string {
  return value
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[^\S\n]{2,}/g, " ")
    .trim()
    .slice(0, SOURCE_TEXT_CHAR_LIMIT);
}

export function knowledgeUrlError(value: string): string | null {
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

export function knowledgeFileError(fileName: string, size: number): string | null {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (!["pdf", "docx", "txt"].includes(extension)) {
    return "Upload a PDF, DOCX, or TXT file.";
  }
  if (size <= 0) return "That file is empty.";
  if (size > MAX_KNOWLEDGE_FILE_BYTES) return "Upload a file smaller than 8 MB.";
  return null;
}

export function createCampaignId(now = Date.now()): string {
  return `tinkerism-campaign-${now}`;
}

export function blankCampaign(now = Date.now()): TinkerismCampaign {
  return {
    ...DEFAULT_TINKERISM_CAMPAIGN,
    id: createCampaignId(now),
    name: "",
    greeting: "",
    sources: [],
    updatedAt: new Date(now).toISOString(),
  };
}

function clampField(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function isSource(value: unknown): value is TinkerismKnowledgeSource {
  if (!value || typeof value !== "object") return false;
  const source = value as Partial<TinkerismKnowledgeSource>;
  return (
    typeof source.id === "string" &&
    source.id.length > 0 &&
    (source.kind === "file" || source.kind === "url") &&
    typeof source.name === "string" &&
    typeof source.locator === "string" &&
    typeof source.text === "string" &&
    typeof source.updatedAt === "string"
  );
}

export function normalizeCampaign(campaign: TinkerismCampaign, updatedAt = new Date().toISOString()): TinkerismCampaign {
  return {
    id: campaign.id.trim().slice(0, 80) || createCampaignId(),
    name: clampField(campaign.name, FIELD_LIMITS.name),
    role: clampField(campaign.role, FIELD_LIMITS.role),
    purpose: clampField(campaign.purpose, FIELD_LIMITS.purpose),
    instructions: clampField(campaign.instructions, FIELD_LIMITS.instructions),
    behaviour: clampField(campaign.behaviour, FIELD_LIMITS.behaviour),
    greeting: clampField(campaign.greeting, FIELD_LIMITS.greeting),
    sources: campaign.sources.slice(0, MAX_KNOWLEDGE_SOURCES).flatMap((source) => {
      if (!isSource(source)) return [];
      const text = cleanExtractedText(source.text);
      if (!text) return [];
      return [{
        id: source.id.slice(0, 80),
        kind: source.kind,
        name: source.name.trim().slice(0, 160) || source.locator,
        locator: source.locator.trim().slice(0, 500),
        text,
        updatedAt: source.updatedAt,
      }];
    }),
    updatedAt,
  };
}

export function campaignError(campaign: TinkerismCampaign): string | null {
  if (!campaign.name.trim()) return "Name this campaign.";
  if (!campaign.role.trim()) return "Describe the agent's role.";
  if (!campaign.purpose.trim()) return "Describe the calling purpose.";
  if (!campaign.instructions.trim()) return "Add the instructions the agent should follow.";
  if (!campaign.behaviour.trim()) return "Describe how the conversation should behave.";
  if (!campaign.greeting.trim()) return "Add the opening greeting this campaign should speak.";
  if (campaign.sources.length > MAX_KNOWLEDGE_SOURCES) {
    return `A campaign can use up to ${MAX_KNOWLEDGE_SOURCES} knowledge sources.`;
  }
  return null;
}

export function parseStoredCampaigns(raw: string | null): TinkerismCampaign[] {
  if (!raw) return [{ ...DEFAULT_TINKERISM_CAMPAIGN, sources: [] }];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [{ ...DEFAULT_TINKERISM_CAMPAIGN, sources: [] }];
    const campaigns = parsed.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const campaign = entry as Partial<TinkerismCampaign>;
      if (typeof campaign.id !== "string" || !campaign.id) return [];
      const migratedGreeting =
        typeof campaign.greeting === "string" && campaign.greeting.trim()
          ? campaign.greeting
          : campaign.id === DEFAULT_TINKERISM_CAMPAIGN.id
            ? DEFAULT_TINKERISM_CAMPAIGN.greeting
            : `Hi, this is ${typeof campaign.name === "string" && campaign.name.trim() ? campaign.name.trim() : "our team"}. Is now a good time to talk?`;
      const normalized = normalizeCampaign({
        id: campaign.id,
        name: campaign.name ?? "",
        role: campaign.role ?? "",
        purpose: campaign.purpose ?? "",
        instructions: campaign.instructions ?? "",
        behaviour: campaign.behaviour ?? "",
        greeting: migratedGreeting,
        sources: Array.isArray(campaign.sources) ? campaign.sources.filter(isSource) : [],
        updatedAt: typeof campaign.updatedAt === "string" ? campaign.updatedAt : DEFAULT_TINKERISM_CAMPAIGN.updatedAt,
      }, typeof campaign.updatedAt === "string" ? campaign.updatedAt : DEFAULT_TINKERISM_CAMPAIGN.updatedAt);
      return campaignError(normalized) ? [] : [normalized];
    });
    return campaigns.length > 0 ? campaigns : [{ ...DEFAULT_TINKERISM_CAMPAIGN, sources: [] }];
  } catch {
    return [{ ...DEFAULT_TINKERISM_CAMPAIGN, sources: [] }];
  }
}

export function parseStoredCampaignSelection(raw: string | null, campaigns: readonly TinkerismCampaign[]): string {
  if (raw && campaigns.some((campaign) => campaign.id === raw)) return raw;
  return campaigns[0]?.id ?? DEFAULT_TINKERISM_CAMPAIGN.id;
}

export function campaignForCalls(campaigns: readonly TinkerismCampaign[], selectedId: string): TinkerismCampaign {
  return campaigns.find((campaign) => campaign.id === selectedId)
    ?? campaigns[0]
    ?? { ...DEFAULT_TINKERISM_CAMPAIGN, sources: [] };
}

export function upsertCampaign(campaigns: readonly TinkerismCampaign[], campaign: TinkerismCampaign): TinkerismCampaign[] {
  const normalized = normalizeCampaign(campaign);
  const exists = campaigns.some((item) => item.id === normalized.id);
  if (!exists) return [...campaigns, normalized];
  return campaigns.map((item) => (item.id === normalized.id ? normalized : item));
}

export function removeCampaign(campaigns: readonly TinkerismCampaign[], id: string): TinkerismCampaign[] {
  const remaining = campaigns.filter((campaign) => campaign.id !== id);
  return remaining.length > 0 ? remaining : [{ ...DEFAULT_TINKERISM_CAMPAIGN, sources: [] }];
}

export function knowledgeForCall(sources: readonly TinkerismKnowledgeSource[]): { text: string; truncated: boolean } {
  const blocks = sources.flatMap((source) => {
    const text = source.text.trim();
    if (!text) return [];
    return [`${source.name} (${source.locator})\n${text}`];
  });
  const joined = blocks.join("\n\n");
  if (joined.length <= CALL_KNOWLEDGE_CHAR_LIMIT) return { text: joined, truncated: false };
  return {
    text: `${joined.slice(0, CALL_KNOWLEDGE_CHAR_LIMIT).trimEnd()}\n\n[The rest of the knowledge was left out of this call. Do not guess beyond the text above.]`,
    truncated: true,
  };
}

export function tinkerismCampaignPrompt(
  campaign: TinkerismCampaign,
  name: string,
  phoneNumber: string,
): string {
  const knowledge = knowledgeForCall(campaign.sources);
  return [
    campaign.role.trim(),
    `Calling purpose: ${campaign.purpose.trim()}`,
    `Instructions: ${campaign.instructions.trim()}`,
    `Conversation behaviour: ${campaign.behaviour.trim()}`,
    `Opening greeting already spoken for this campaign: ${campaignOpeningGreeting(campaign)}`,
    "Do not greet again, do not introduce yourself again, and do not repeat why you called.",
    "Speak like a natural phone conversation similar to ChatGPT voice mode: warm, present, and concise.",
    "Listen until the person finishes speaking. Do not interrupt or talk over them. Then answer the question they just asked in one or two short spoken sentences.",
    "Occasionally use a brief acknowledgment such as \"Hmm\", \"I understand\", \"Right\", or \"Absolutely\" (or the matching Hindi/Marathi equivalent), but not on every turn.",
    "Detect English, Hindi, or Marathi immediately and answer in the language they just used. Hindi should be natural spoken Hindi. Marathi should be natural spoken Marathi. English should sound like professional Indian English.",
    "Match their speaking style, vocabulary, simplicity, and tone. If they hesitate, mix languages, or struggle with English, politely offer to continue in Hindi or Marathi.",
    "Answer from the campaign instructions and the knowledge sources. If they do not contain the answer, say so and offer to confirm it on a follow-up. Do not invent prices, timelines, features, customers, case studies, or commitments.",
    "If they are busy, not interested, finished, or ask you to stop, agree with a brief polite goodbye and end the call.",
    knowledge.text
      ? `Knowledge sources:\n${knowledge.text}`
      : "Knowledge sources: none were added for this campaign.",
    `The person on this call is ${name}. Their number is ${phoneNumber}.`,
  ].join("\n\n");
}
