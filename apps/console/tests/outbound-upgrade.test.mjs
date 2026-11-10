import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

const campaigns = await import(pathToFileURL(join(root, "src/lib/tinkerism/campaigns.ts")).href);
const contacts = await import(pathToFileURL(join(root, "src/lib/tinkerism/contacts.ts")).href);
const csv = await import(pathToFileURL(join(root, "src/lib/outbound/prompt-campaign-csv.ts")).href);
const control = await import(pathToFileURL(join(root, "src/lib/outbound/call-control.ts")).href);
const promptSource = read("src/lib/outbound/prompt-campaigns.ts");
const contactsSource = read("src/lib/outbound/saved-contacts.ts");

test("outbound reuses the same Tinkerism Call campaign and contact storage keys", () => {
  assert.match(promptSource, /TINKERISM_CAMPAIGNS_STORAGE_KEY as OUTBOUND_PROMPT_CAMPAIGNS_STORAGE_KEY/);
  assert.match(promptSource, /TINKERISM_SELECTED_CAMPAIGN_STORAGE_KEY as OUTBOUND_SELECTED_PROMPT_CAMPAIGN_STORAGE_KEY/);
  assert.match(promptSource, /DEFAULT_TINKERISM_CAMPAIGN as DEFAULT_OUTBOUND_PROMPT_CAMPAIGN/);
  assert.match(contactsSource, /TINKERISM_CONTACTS_STORAGE_KEY as OUTBOUND_CONTACTS_STORAGE_KEY/);
  assert.equal(campaigns.DEFAULT_TINKERISM_CAMPAIGN.name, "Tinkerism websites");
});

test("outbound reads the same saved campaigns and contacts as Tinkerism Call", () => {
  const storedCampaigns = campaigns.parseStoredCampaigns(JSON.stringify([
    {
      id: "tinkerism-websites",
      name: "Tinkerism websites",
      role: "Role",
      purpose: "Purpose",
      instructions: "Ask one question.",
      behaviour: "Be brief.",
      sources: [],
      updatedAt: "2026-11-05T00:00:00.000Z",
    },
    {
      id: "property-enquiry",
      name: "Property Enquiry & Lead Qualification",
      role: "Role",
      purpose: "Qualify leads.",
      instructions: "Confirm interest.",
      behaviour: "Be brief.",
      sources: [],
      updatedAt: "2026-11-05T00:00:00.000Z",
    },
  ]));
  assert.deepEqual(
    storedCampaigns.map((campaign) => campaign.name),
    ["Tinkerism websites", "Property Enquiry & Lead Qualification"],
  );

  const storedContacts = contacts.parseStoredContacts(JSON.stringify([
    { id: "1", name: "Pratik", phoneNumber: "+919876543210", selected: true },
    { id: "2", name: "Kaushal", phoneNumber: "+919876543211", selected: true },
    { id: "3", name: "Kalpesh", phoneNumber: "+919876543212", selected: false },
  ]));
  assert.deepEqual(
    storedContacts.map((contact) => contact.name),
    ["Pratik", "Kaushal", "Kalpesh"],
  );
  assert.deepEqual(
    contacts.contactsToCall(storedContacts).map((contact) => contact.name),
    ["Pratik", "Kaushal"],
  );
});

test("selected campaign prompt includes knowledge and bilingual rules like Tinkerism Call", () => {
  const saved = campaigns.upsertCampaign(campaigns.parseStoredCampaigns(null), {
    ...campaigns.blankCampaign(10),
    name: "Renewals",
    role: "You represent Tinkerism renewals.",
    purpose: "Confirm renewal interest.",
    instructions: "Ask about contract end date.",
    behaviour: "Keep answers short.",
    sources: [{
      id: "source-1",
      kind: "file",
      name: "pricing.txt",
      locator: "pricing.txt",
      text: "Renewal plans start at 49 per seat.",
      updatedAt: "2026-11-07T00:00:00.000Z",
    }],
  });
  const selectedId = saved.at(-1).id;
  const prompt = campaigns.tinkerismCampaignPrompt(
    campaigns.campaignForCalls(saved, selectedId),
    "Asha",
    "+919876543210",
  );
  assert.match(prompt, /49 per seat/);
  assert.match(prompt, /English, Hindi, or Marathi/);
  assert.match(prompt, /ChatGPT voice mode/);
  assert.match(prompt, /Hmm/);
  assert.match(prompt, /Opening greeting already spoken for this campaign/);
  assert.match(prompt, /Do not greet again/);
  assert.match(prompt, /Asha/);
});

test("selected campaign owns the opening greeting without Tinkerism fallback", () => {
  const renewals = campaigns.normalizeCampaign({
    ...campaigns.blankCampaign(20),
    name: "Renewals",
    role: "You represent renewals.",
    purpose: "Confirm renewals.",
    instructions: "Ask one question.",
    behaviour: "Be brief.",
    greeting: "Hi, this is the renewals desk. Got a minute?",
  });
  assert.equal(campaigns.campaignOpeningGreeting(renewals), "Hi, this is the renewals desk. Got a minute?");
  assert.doesNotMatch(campaigns.campaignOpeningGreeting(renewals), /Tinkerism/);
  assert.match(campaigns.DEFAULT_TINKERISM_CAMPAIGN.greeting, /Tinkerism/);
});

test("stop helpers cover scheduled and live outbound statuses", () => {
  assert.equal(control.outboundCallCanStop("SCHEDULED"), true);
  assert.equal(control.outboundCallCanStop("IN_PROGRESS"), true);
  assert.equal(control.outboundCallCanStop("PROCESSED"), true);
  assert.equal(control.outboundCallCanStop("COMPLETED"), false);
});

test("terminateOutboundCall ends LiveKit and cancels even when one path fails", async () => {
  const ended = [];
  const cancelled = [];
  await control.terminateOutboundCall({
    outboundId: "out_1",
    status: "IN_PROGRESS",
    endLive: async (roomName) => {
      ended.push(roomName);
      throw new Error("room gone");
    },
    cancelScheduled: async (outboundId) => {
      cancelled.push(outboundId);
    },
  });
  assert.deepEqual(ended, ["outbound_out_1"]);
  assert.deepEqual(cancelled, ["out_1"]);

  await assert.rejects(
    () => control.terminateOutboundCall({
      outboundId: "out_2",
      endLive: async () => {
        throw new Error("no room");
      },
      cancelScheduled: async () => {
        throw new Error("already ended");
      },
    }),
    /Could not stop the call/,
  );
});

test("quick call uses saved-contact dropdown and the Tinkerism dial pipeline", () => {
  const quick = read("src/components/outbound/QuickCallForm.tsx");
  const field = read("src/components/outbound/QuickCallContactField.tsx");
  assert.match(quick, /QuickCallContactField/);
  assert.match(quick, /useOutboundSavedContacts/);
  assert.match(quick, /campaignOpeningGreeting/);
  assert.match(quick, /tinkerismCampaignPrompt/);
  assert.match(quick, /tinkerism_call/);
  assert.match(field, /role="combobox"/);
  assert.match(field, /Search contacts or type a number/);
  assert.match(field, /onSelectContact/);
});

test("batch workspace dials selected contacts like Tinkerism Call", () => {
  const workspace = read("src/components/outbound/BatchCampaignWorkspace.tsx");
  assert.match(workspace, /campaignOpeningGreeting/);
  assert.match(workspace, /tinkerismCampaignPrompt/);
  assert.match(workspace, /tinkerism_call/);
  assert.match(workspace, /SavedContactsPanel/);
  assert.match(workspace, /callSelectedContacts/);
  assert.match(workspace, /stopAllCalls/);
  assert.match(workspace, /PromptCampaignPanel/);
});

test("CSV batch uploads inherit the shared campaign prompt when rows omit it", () => {
  const next = csv.applyCampaignPromptToRecipientCsv(
    "phone_number,name\n+15551234567,Asha\n+15557654321,Ravi\n",
    "Follow renewals.",
  );
  assert.match(next, /prompt/);
  assert.match(next, /Follow renewals\./);
  const kept = csv.applyCampaignPromptToRecipientCsv(
    "phone_number,prompt\n+15551234567,Keep mine\n",
    "Follow renewals.",
  );
  assert.match(kept, /Keep mine/);
  assert.doesNotMatch(kept.split("\n")[1], /Follow renewals/);
});
