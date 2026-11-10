export type TinkerismContact = {
  id: string;
  name: string;
  phoneNumber: string;
  selected: boolean;
};

export type TinkerismCallLog = {
  id: string;
  outboundId: string | null;
  contactName: string;
  phoneNumber: string;
  detail: string;
  createdAt: string;
};

export const TINKERISM_CONTACTS_STORAGE_KEY = "tinkerism-call:contacts:v1";
export const TINKERISM_LOGS_STORAGE_KEY = "tinkerism-call:logs:v1";

/** Default opening for the built-in Tinkerism websites campaign only. */
export const TINKERISM_FIRST_MESSAGE =
  "Hi, this is Tinkerism. We help businesses with websites and digital work. Is now a good time to talk?";

export const TINKERISM_STOPPED_DETAIL = "Stopped.";

export function tinkerismSystemPrompt(name: string, phoneNumber: string): string {
  return [
    "You are on a live phone call for Tinkerism. Speak in short, natural sentences like ChatGPT voice mode.",
    "A short greeting was already spoken. Do not greet again, do not introduce yourself again, and do not repeat why you called.",
    "Listen until the person finishes speaking. Do not interrupt. Then answer the question they just asked in one or two short spoken sentences.",
    "Occasionally use a brief acknowledgment such as Hmm, I understand, Right, or Absolutely, but do not overuse them.",
    "Detect English, Hindi, or Marathi immediately and answer in the language they just used.",
    "Hindi answers should be natural spoken Hindi. Marathi answers should be natural spoken Marathi. English answers should sound like professional Indian English.",
    "Match their speaking style, vocabulary, simplicity, and tone. If they hesitate or struggle with English, politely offer Hindi or Marathi.",
    "Tinkerism builds websites and digital solutions for businesses.",
    "If they want more information, ask one relevant question at a time and offer to follow up and confirm the details.",
    "Do not invent prices, timelines, features, customers, case studies, or commitments. If you do not know something, say so and offer to confirm it on a follow-up.",
    "If they are busy, not interested, finished, or ask you to stop, agree with a brief polite goodbye and end the call.",
    `The person on this call is ${name}. Their number is ${phoneNumber}.`,
  ].join(" ");
}

const ACTIVE_ATTEMPT_STATUSES = new Set(["DIALING", "SCHEDULED", "PROCESSED", "IN_PROGRESS"]);

export function tinkerismAttemptStatus(
  log: Pick<TinkerismCallLog, "detail" | "outboundId">,
  callStatus?: string | null,
): string {
  if (log.detail === "Dialing.") return "DIALING";
  if (log.detail.startsWith("Stopped")) return "STOPPED";
  if (callStatus) return callStatus;
  if (log.outboundId) return "SCHEDULED";
  return "FAILED";
}

export function tinkerismCallCanStop(status: string): boolean {
  return ACTIVE_ATTEMPT_STATUSES.has(status);
}

export function tinkerismCallsToStop(
  logs: TinkerismCallLog[],
  statusByOutboundId: Record<string, string | null | undefined>,
  extraOutboundIds: readonly string[] = [],
): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();
  const add = (outboundId: string | null | undefined) => {
    if (!outboundId || seen.has(outboundId)) return;
    seen.add(outboundId);
    ids.push(outboundId);
  };

  for (const log of logs) {
    if (!log.outboundId) continue;
    const serverStatus = statusByOutboundId[log.outboundId];
    const localStatus = tinkerismAttemptStatus(log, serverStatus);
    if (tinkerismCallCanStop(localStatus) || (serverStatus != null && tinkerismCallCanStop(serverStatus))) {
      add(log.outboundId);
    }
  }
  for (const outboundId of extraOutboundIds) add(outboundId);
  return ids;
}

export function removeCallLogs(logs: TinkerismCallLog[], ids: readonly string[]): TinkerismCallLog[] {
  const remove = new Set(ids);
  return logs.filter((log) => !remove.has(log.id));
}

export async function terminateTinkerismCall(input: {
  outboundId: string;
  status?: string | null;
  endLive: (roomName: string) => Promise<unknown>;
  cancelScheduled: (outboundId: string) => Promise<unknown>;
}): Promise<void> {
  const roomName = `outbound_${input.outboundId}`;
  const roomEnded = input.endLive(roomName).then(
    () => true,
    () => false,
  );
  const scheduledOnly = input.status == null || input.status === "SCHEDULED" || input.status === "DIALING";
  const scheduleCancelled = scheduledOnly
    ? input.cancelScheduled(input.outboundId).then(
        () => true,
        () => false,
      )
    : Promise.resolve(false);
  const [ended, cancelled] = await Promise.all([roomEnded, scheduleCancelled]);
  if (!ended && !cancelled) {
    throw new Error("Could not stop the call");
  }
}

const SAMPLE_NUMBERS = [
  "+15555550100",
  "+15555550101",
  "+15555550102",
  "+15555550103",
  "+15555550104",
] as const;

export const DEFAULT_TINKERISM_CONTACTS: TinkerismContact[] = [
  { id: "tinkerism-line-1", name: "Tinkerism line 1", phoneNumber: SAMPLE_NUMBERS[0], selected: true },
  { id: "tinkerism-line-2", name: "Tinkerism line 2", phoneNumber: SAMPLE_NUMBERS[1], selected: true },
  { id: "tinkerism-line-3", name: "Tinkerism line 3", phoneNumber: SAMPLE_NUMBERS[2], selected: true },
  { id: "tinkerism-line-4", name: "Tinkerism line 4", phoneNumber: SAMPLE_NUMBERS[3], selected: true },
  { id: "tinkerism-line-5", name: "Tinkerism line 5", phoneNumber: SAMPLE_NUMBERS[4], selected: true },
];

const SAMPLE_NUMBER_SET = new Set<string>(SAMPLE_NUMBERS);

export function isSampleTinkerismNumber(phoneNumber: string): boolean {
  return SAMPLE_NUMBER_SET.has(phoneNumber);
}

export function normalizePhoneNumber(value: string): string {
  const compact = value.trim().replace(/[\s().-]/g, "");
  if (!compact) return "";
  if (compact.startsWith("+")) return `+${compact.slice(1).replace(/\D/g, "")}`;
  return compact.replace(/\D/g, "");
}

function samePhoneNumber(left: string, right: string): boolean {
  return left.replace(/\D/g, "") === right.replace(/\D/g, "");
}

export function phoneNumberError(phoneNumber: string): string | null {
  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.length < 10) return "Enter a phone number with at least 10 digits.";
  if (digits.length > 15) return "Enter a phone number with at most 15 digits.";
  return null;
}

export function contactsToCall(contacts: TinkerismContact[]): TinkerismContact[] {
  return contacts.filter((contact) => contact.selected);
}

function isContact(value: unknown): value is TinkerismContact {
  if (!value || typeof value !== "object") return false;
  const contact = value as Partial<TinkerismContact>;
  return (
    typeof contact.id === "string" &&
    contact.id.length > 0 &&
    typeof contact.name === "string" &&
    typeof contact.phoneNumber === "string" &&
    typeof contact.selected === "boolean" &&
    phoneNumberError(contact.phoneNumber) === null
  );
}

export function parseStoredContacts(raw: string | null): TinkerismContact[] {
  if (!raw) return DEFAULT_TINKERISM_CONTACTS.map((contact) => ({ ...contact }));
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return DEFAULT_TINKERISM_CONTACTS.map((contact) => ({ ...contact }));
    const contacts = parsed.filter(isContact).map((contact) => ({
      id: contact.id,
      name: contact.name.trim().slice(0, 80),
      phoneNumber: normalizePhoneNumber(contact.phoneNumber),
      selected: contact.selected,
    }));
    return contacts.length > 0
      ? contacts
      : DEFAULT_TINKERISM_CONTACTS.map((contact) => ({ ...contact }));
  } catch {
    return DEFAULT_TINKERISM_CONTACTS.map((contact) => ({ ...contact }));
  }
}

export function parseStoredLogs(raw: string | null): TinkerismCallLog[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const log = entry as Partial<TinkerismCallLog>;
      if (
        typeof log.id !== "string" ||
        typeof log.contactName !== "string" ||
        typeof log.phoneNumber !== "string" ||
        typeof log.detail !== "string" ||
        typeof log.createdAt !== "string"
      ) {
        return [];
      }
      return [{
        id: log.id,
        outboundId: typeof log.outboundId === "string" ? log.outboundId : null,
        contactName: log.contactName,
        phoneNumber: log.phoneNumber,
        detail: log.detail,
        createdAt: log.createdAt,
      }];
    }).slice(0, 40);
  } catch {
    return [];
  }
}

export function createContactId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `tinkerism-${Date.now()}`;
}

export function addContact(
  contacts: TinkerismContact[],
  input: { name: string; phoneNumber: string },
): { contacts: TinkerismContact[]; error: string | null } {
  const name = input.name.trim();
  const phoneNumber = normalizePhoneNumber(input.phoneNumber);
  if (!name) return { contacts, error: "Enter a name for this number." };
  const phoneError = phoneNumberError(phoneNumber);
  if (phoneError) return { contacts, error: phoneError };
  if (contacts.some((contact) => samePhoneNumber(contact.phoneNumber, phoneNumber))) {
    return { contacts, error: "That number is already saved." };
  }
  return {
    contacts: [
      ...contacts,
      { id: createContactId(), name: name.slice(0, 80), phoneNumber, selected: true },
    ],
    error: null,
  };
}

export function updateContact(
  contacts: TinkerismContact[],
  contactId: string,
  input: { name: string; phoneNumber: string },
): { contacts: TinkerismContact[]; error: string | null } {
  const name = input.name.trim();
  const phoneNumber = normalizePhoneNumber(input.phoneNumber);
  if (!name) return { contacts, error: "Enter a name for this number." };
  const phoneError = phoneNumberError(phoneNumber);
  if (phoneError) return { contacts, error: phoneError };
  if (contacts.some((contact) => contact.id !== contactId && samePhoneNumber(contact.phoneNumber, phoneNumber))) {
    return { contacts, error: "That number is already saved." };
  }
  return {
    contacts: contacts.map((contact) =>
      contact.id === contactId
        ? { ...contact, name: name.slice(0, 80), phoneNumber }
        : contact,
    ),
    error: null,
  };
}

export function removeContact(contacts: TinkerismContact[], contactId: string): TinkerismContact[] {
  return contacts.filter((contact) => contact.id !== contactId);
}

export function setContactSelected(
  contacts: TinkerismContact[],
  contactId: string,
  selected: boolean,
): TinkerismContact[] {
  return contacts.map((contact) =>
    contact.id === contactId ? { ...contact, selected } : contact,
  );
}
