import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const contactsUrl = pathToFileURL(join(root, "src/lib/tinkerism/contacts.ts")).href;
const readinessUrl = pathToFileURL(join(root, "src/lib/tinkerism/call-readiness.ts")).href;
const contacts = await import(contactsUrl);
const readiness = await import(readinessUrl);

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

test("five predefined numbers are saved and only selected numbers are called", () => {
  assert.equal(contacts.DEFAULT_TINKERISM_CONTACTS.length, 5);
  const selected = contacts.contactsToCall(contacts.DEFAULT_TINKERISM_CONTACTS);
  assert.equal(selected.length, 5);

  const withOneUnchecked = contacts.setContactSelected(
    contacts.DEFAULT_TINKERISM_CONTACTS,
    "tinkerism-line-2",
    false,
  );
  const dialList = contacts.contactsToCall(withOneUnchecked);
  assert.equal(dialList.length, 4);
  assert.equal(dialList.some((contact) => contact.id === "tinkerism-line-2"), false);
});

test("numbers can be added, edited, and removed without calling unselected entries", () => {
  const added = contacts.addContact(contacts.DEFAULT_TINKERISM_CONTACTS, {
    name: "Reception",
    phoneNumber: "+91 98765 43210",
  });
  assert.equal(added.error, null);
  assert.equal(added.contacts.length, 6);
  assert.equal(added.contacts.at(-1).phoneNumber, "+919876543210");

  const duplicate = contacts.addContact(added.contacts, {
    name: "Again",
    phoneNumber: "919876543210",
  });
  assert.equal(duplicate.error, "That number is already saved.");

  const edited = contacts.updateContact(added.contacts, added.contacts.at(-1).id, {
    name: "Front desk",
    phoneNumber: "+919876543211",
  });
  assert.equal(edited.error, null);
  assert.equal(edited.contacts.at(-1).name, "Front desk");

  const removed = contacts.removeContact(edited.contacts, "tinkerism-line-1");
  assert.equal(removed.some((contact) => contact.id === "tinkerism-line-1"), false);
  assert.equal(contacts.contactsToCall(removed).every((contact) => contact.selected), true);
});

test("broken saved data falls back to the five predefined numbers", () => {
  assert.equal(contacts.parseStoredContacts("not-json").length, 5);
  assert.equal(contacts.parseStoredContacts("[]").length, 5);
  const stored = contacts.parseStoredContacts(JSON.stringify([
    { id: "kept", name: "Kept", phoneNumber: "+15555550199", selected: false },
  ]));
  assert.deepEqual(contacts.contactsToCall(stored), []);
});

test("the agent speaks a short Tinkerism greeting and answers without repeating it", () => {
  assert.equal(
    contacts.TINKERISM_FIRST_MESSAGE,
    "Hi, this is Tinkerism. We help businesses with websites and digital work. Is now a good time to talk?",
  );
  assert.ok(contacts.TINKERISM_FIRST_MESSAGE.length < 140);
  const prompt = contacts.tinkerismSystemPrompt("Asha", "+919876543210");
  assert.match(prompt, /Do not greet again/);
  assert.match(prompt, /answer the question they just asked/);
  assert.match(prompt, /English or Hindi/);
  assert.match(prompt, /natural spoken Hindi/);
  assert.match(prompt, /professional Indian English/);
  assert.match(prompt, /websites and digital solutions/);
  assert.match(prompt, /ask one relevant question at a time/);
  assert.match(prompt, /follow up and confirm/);
  assert.match(prompt, /Do not invent/);
  assert.doesNotMatch(prompt, /Hi, this is Tinkerism/);
  assert.match(prompt, /Asha/);
  assert.match(prompt, /\+919876543210/);
});

test("Stop disconnects the LiveKit room and shows Stopped immediately", async () => {
  const log = {
    id: "attempt-1",
    outboundId: "outbound-1",
    contactName: "Asha",
    phoneNumber: "+919876543210",
    detail: "Connected to the agent. Waiting for the recipient to answer.",
    createdAt: "2026-11-05T00:00:00.000Z",
  };
  assert.equal(contacts.tinkerismAttemptStatus(log, "IN_PROGRESS"), "IN_PROGRESS");
  assert.equal(contacts.tinkerismCallCanStop("IN_PROGRESS"), true);
  const stopped = { ...log, detail: contacts.TINKERISM_STOPPED_DETAIL };
  assert.equal(contacts.tinkerismAttemptStatus(stopped, "IN_PROGRESS"), "STOPPED");
  assert.equal(contacts.tinkerismCallCanStop("STOPPED"), false);

  const rooms = [];
  const cancelled = [];
  await contacts.terminateTinkerismCall({
    outboundId: "outbound-1",
    status: "IN_PROGRESS",
    endLive: async (roomName) => {
      rooms.push(roomName);
    },
    cancelScheduled: async (outboundId) => {
      cancelled.push(outboundId);
    },
  });
  assert.deepEqual(rooms, ["outbound_outbound-1"]);
  assert.deepEqual(cancelled, []);

  await assert.rejects(
    contacts.terminateTinkerismCall({
      outboundId: "missing",
      status: "IN_PROGRESS",
      endLive: async () => {
        throw new Error("room missing");
      },
      cancelScheduled: async () => {
        throw new Error("not scheduled");
      },
    }),
    /Could not stop the call/,
  );
});

test("Stop all ends every live call, including one already marked stopped locally", () => {
  const logs = [
    {
      id: "live",
      outboundId: "outbound-live",
      contactName: "Asha",
      phoneNumber: "+919876543210",
      detail: "Connected to the agent. Waiting for the recipient to answer.",
      createdAt: "2026-11-05T00:00:00.000Z",
    },
    {
      id: "stale",
      outboundId: "outbound-stale",
      contactName: "Ravi",
      phoneNumber: "+919876543211",
      detail: "Stopped.",
      createdAt: "2026-11-05T00:00:01.000Z",
    },
    {
      id: "dialing",
      outboundId: null,
      contactName: "Mina",
      phoneNumber: "+919876543212",
      detail: "Dialing.",
      createdAt: "2026-11-05T00:00:02.000Z",
    },
  ];
  assert.deepEqual(
    contacts.tinkerismCallsToStop(logs, {
      "outbound-live": "IN_PROGRESS",
      "outbound-stale": "IN_PROGRESS",
    }, ["outbound-pending"]),
    ["outbound-live", "outbound-stale", "outbound-pending"],
  );
});

test("call logs can be removed individually or together", () => {
  const logs = [
    {
      id: "one",
      outboundId: "outbound-1",
      contactName: "Asha",
      phoneNumber: "+919876543210",
      detail: "Completed.",
      createdAt: "2026-11-05T00:00:00.000Z",
    },
    {
      id: "two",
      outboundId: "outbound-2",
      contactName: "Ravi",
      phoneNumber: "+919876543211",
      detail: "No answer.",
      createdAt: "2026-11-05T00:00:01.000Z",
    },
  ];
  assert.deepEqual(contacts.removeCallLogs(logs, ["one"]).map((log) => log.id), ["two"]);
  assert.deepEqual(contacts.removeCallLogs(logs, ["one", "two"]), []);
});

test("Call Now stays ready only when an active caller ID and a selected number exist", () => {
  assert.equal(readiness.tinkerismCallBlock({
    loading: false,
    configuredAgentCount: 1,
    activeCallerIdCount: 0,
    inactiveNumberCount: 0,
    selectedCount: 5,
  }), "no-number");
  assert.equal(readiness.tinkerismCallBlock({
    loading: false,
    configuredAgentCount: 1,
    activeCallerIdCount: 1,
    inactiveNumberCount: 0,
    selectedCount: 0,
  }), "none-selected");
  assert.equal(readiness.tinkerismCallBlock({
    loading: false,
    configuredAgentCount: 1,
    activeCallerIdCount: 1,
    inactiveNumberCount: 0,
    selectedCount: 2,
  }), "ready");
  const numbers = [
    { agentId: null, billingStatus: "ACTIVE", number: "+15555550100" },
    { agentId: "other", billingStatus: "ACTIVE", number: "+15555550101" },
    { agentId: "agent", billingStatus: "SUSPENDED", number: "+15555550102" },
  ];
  const callerIds = readiness.callerIdsForAgent(numbers, "agent");
  assert.deepEqual(callerIds.map((number) => number.number), ["+15555550100"]);
});

test("Tinkerism Call is a sidebar page with status, logs, and selected-only dialing", () => {
  const sidebar = read("src/components/shell/AppSidebar.tsx");
  const page = read("src/app/(app)/tinkerism/page.tsx");
  const panel = read("src/components/tinkerism/TinkerismCallPanel.tsx");
  const editor = read("src/components/tinkerism/CampaignEditor.tsx");

  assert.match(sidebar, /title: "Tinkerism Call", href: "\/tinkerism"/);
  assert.match(page, /TinkerismCallPanel/);
  assert.match(panel, /contactsToCall/);
  assert.match(panel, /Call Now/);
  assert.match(panel, /Call status and logs/);
  assert.match(panel, /contactsToCall\(contacts\)/);
  assert.match(panel, /cancelOutboundCall|endLive/);
  assert.match(panel, /retryOutboundCall/);
  assert.match(panel, /TINKERISM_FIRST_MESSAGE/);
  assert.match(panel, /tinkerismCampaignPrompt/);
  assert.match(panel, /CampaignEditor/);
  assert.match(editor, /Campaign prompt/);
  assert.match(editor, /Website URL/);
  assert.match(editor, /Preview/);
  assert.match(editor, /Save campaign/);
  assert.match(panel, /tinkerism_call: "1"/);
  assert.match(panel, /Delete all/);
  assert.match(panel, /AlertDialog/);
  assert.match(panel, /tinkerismCallsToStop/);
  assert.doesNotMatch(panel, /contacts\.filter\(\(contact\) => !contact\.selected\)/);
});
