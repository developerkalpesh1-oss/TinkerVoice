import assert from "node:assert/strict";
import { test } from "node:test";

import { PassThrough, Readable } from "node:stream";

import {
  getCallRecordingDownloadUrl,
  endLiveCall,
  listLiveCalls,
  recordingContentType,
  signCallRecordingUrl,
  streamCallRecording,
} from "../../src/modules/calllogs/calllog.service.js";

test("recording download returns the authenticated API stream path", async (t) => {
  const previous = process.env.RECORDING_STORAGE;
  process.env.RECORDING_STORAGE = "s3";
  t.after(() => {
    if (previous === undefined) delete process.env.RECORDING_STORAGE;
    else process.env.RECORDING_STORAGE = previous;
  });

  const { default: prisma } = await import("../../src/config/prisma.js");
  const original = prisma.callLog.findFirst;
  prisma.callLog.findFirst = (async ({ where }: any) => {
    assert.deepEqual(where, { callId: "call-1", organizationId: "org-1", deleted: false });
    return { audioRecordingPath: "Voice-agents/Recordings/call-1.ogg" };
  }) as typeof original;
  t.after(() => { prisma.callLog.findFirst = original; });

  const url = await getCallRecordingDownloadUrl("org-1", "call-1");
  assert.equal(url, "/api/v1/calls/call-1/recording?disposition=attachment");
});

test("signCallRecordingUrl keeps present storage keys opaque for API playback", async (t) => {
  const previous = process.env.RECORDING_STORAGE;
  process.env.RECORDING_STORAGE = "s3";
  t.after(() => {
    if (previous === undefined) delete process.env.RECORDING_STORAGE;
    else process.env.RECORDING_STORAGE = previous;
  });

  const call = {
    callId: "SCL_recording123",
    audioRecordingPath: "Voice-agents/Recordings/recording-123.ogg",
  };

  const signed = await signCallRecordingUrl(call, async () => {
    throw new Error("should not sign opaque storage keys");
  });

  assert.equal(
    signed.audioRecordingPath,
    "Voice-agents/Recordings/recording-123.ogg",
  );
  assert.equal(call.audioRecordingPath, "Voice-agents/Recordings/recording-123.ogg");
  assert.equal(recordingContentType("Voice-agents/Recordings/a.mp3"), "audio/mpeg");
  assert.equal(recordingContentType("Voice-agents/Recordings/a.wav"), "audio/wav");
});

test("signCallRecordingUrl hides missing local recordings", async (t) => {
  const previous = process.env.RECORDING_STORAGE;
  const previousDir = process.env.RECORDING_LOCAL_DIR;
  process.env.RECORDING_STORAGE = "local";
  process.env.RECORDING_LOCAL_DIR = "/tmp/tinkervoice-missing-recordings";
  t.after(() => {
    if (previous === undefined) delete process.env.RECORDING_STORAGE;
    else process.env.RECORDING_STORAGE = previous;
    if (previousDir === undefined) delete process.env.RECORDING_LOCAL_DIR;
    else process.env.RECORDING_LOCAL_DIR = previousDir;
  });

  const { default: prisma } = await import("../../src/config/prisma.js");
  const original = prisma.callLog.updateMany;
  let detached: unknown;
  prisma.callLog.updateMany = (async (args: unknown) => {
    detached = args;
    return { count: 1 };
  }) as typeof original;
  t.after(() => {
    prisma.callLog.updateMany = original;
  });

  const signed = await signCallRecordingUrl({
    callId: "call-missing",
    audioRecordingPath: "Voice-agents/Recordings/missing.ogg",
  });
  assert.equal(signed.audioRecordingPath, null);
  assert.deepEqual(detached, {
    where: {
      callId: "call-missing",
      deleted: false,
      audioRecordingPath: "Voice-agents/Recordings/missing.ogg",
    },
    data: { audioRecordingPath: null },
  });
});

test("streamCallRecording serves local storage keys through the authenticated API", async (t) => {
  const { mkdtemp, mkdir, writeFile, rm } = await import("node:fs/promises");
  const os = await import("node:os");
  const path = await import("node:path");
  const root = await mkdtemp(path.join(os.tmpdir(), "tinkervoice-stream-"));
  const previousStorage = process.env.RECORDING_STORAGE;
  const previousDir = process.env.RECORDING_LOCAL_DIR;
  process.env.RECORDING_STORAGE = "local";
  process.env.RECORDING_LOCAL_DIR = root;
  t.after(async () => {
    if (previousStorage === undefined) delete process.env.RECORDING_STORAGE;
    else process.env.RECORDING_STORAGE = previousStorage;
    if (previousDir === undefined) delete process.env.RECORDING_LOCAL_DIR;
    else process.env.RECORDING_LOCAL_DIR = previousDir;
    await rm(root, { recursive: true, force: true });
  });

  const key = "Voice-agents/Recordings/local-1.ogg";
  await mkdir(path.join(root, "Voice-agents/Recordings"), { recursive: true });
  await writeFile(path.join(root, key), Buffer.from("OggS-local"));

  const { default: prisma } = await import("../../src/config/prisma.js");
  const original = prisma.callLog.findFirst;
  prisma.callLog.findFirst = (async () => ({
    audioRecordingPath: key,
  })) as typeof original;
  t.after(() => {
    prisma.callLog.findFirst = original;
  });

  const chunks: Buffer[] = [];
  const response = Object.assign(new PassThrough(), {
    statusCode: 0,
    headers: {} as Record<string, string>,
    destroyed: false,
    headersSent: false,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    set(headers: Record<string, string>) {
      this.headers = { ...this.headers, ...headers };
      return this;
    },
  });
  response.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
  const ended = new Promise<void>((resolve) => response.once("finish", resolve));

  await streamCallRecording("org-1", "call-1", response as any, {
    disposition: "inline",
  });
  await ended;

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers["Content-Type"], "audio/ogg");
  assert.equal(response.headers["Content-Disposition"], "inline");
  assert.equal(response.headers["Cache-Control"], "private, no-store");
  assert.equal(Buffer.concat(chunks).toString(), "OggS-local");
});

test("signCallRecordingUrl leaves missing recordings and existing URLs unchanged", async () => {
  const nullRecording = await signCallRecordingUrl(
    { callId: "SCL_no_recording", audioRecordingPath: null },
    async () => {
      throw new Error("should not sign empty recording path");
    }
  );
  assert.equal(nullRecording.audioRecordingPath, null);

  const existingUrl = await signCallRecordingUrl(
    {
      callId: "SCL_url_recording",
      audioRecordingPath: "https://cdn.tinkervoice.test/recording.ogg",
    },
    async () => {
      throw new Error("should not sign existing URL");
    }
  );
  assert.equal(
    existingUrl.audioRecordingPath,
    "https://cdn.tinkervoice.test/recording.ogg"
  );
});

test("listLiveCalls merges Redis registry and LiveKit room entries by call id", async () => {
  const startedAt = new Date().toISOString();
  const calls = await listLiveCalls(
    "org_123",
    {
      listRooms: async () => [
        {
          name: "call_123",
          numParticipants: 2,
          creationTime: Math.floor(Date.now() / 1000),
        },
      ],
      deleteRoom: async () => undefined,
    },
    {
      listActiveCalls: async () => [
        {
          version: 1,
          type: "call.started",
          organizationId: "org_123",
          callId: "call_123",
          roomName: "legacy_room_name",
          eventId: "0-0",
          occurredAt: startedAt,
          status: "active",
          agentId: "",
          direction: "inbound",
          fromNumber: "+15550000001",
          toNumber: "+15550000002",
          startedAt,
        },
      ],
      findActiveCallByRoom: async () => null,
      markCallStale: async () => undefined,
    }
  );

  assert.equal(calls.length, 1);
  assert.equal(calls[0]?.callId, "call_123");
  assert.equal(calls[0]?.participantCount, 2);
  assert.equal(calls[0]?.fromNumber, "+15550000001");
});

test("repeated foreign-room polls never enumerate LiveKit participants", async (t) => {
  const { default: prisma } = await import("../../src/config/prisma.js");
  const original = prisma.callBillingSession.count;
  prisma.callBillingSession.count = (async ({ where }: any) => {
    assert.deepEqual(where, { organizationId: "org_123", roomName: "foreign_room" });
    return 0;
  }) as any;
  t.after(() => { prisma.callBillingSession.count = original; });
  let lookups = 0;
  const roomClient = {
    listRooms: async () => [{ name: "foreign_room", numParticipants: 2 }],
    listParticipants: async () => { lookups++; return []; },
    deleteRoom: async () => {},
  };
  for (let poll = 0; poll < 2; poll++) assert.deepEqual(await listLiveCalls("org_123", roomClient), []);
  assert.equal(lookups, 0);
});

test("empty outbound rooms are not live even during the startup grace period", async (t) => {
  const { default: prisma } = await import("../../src/config/prisma.js");
  const original = prisma.outboundCall.count;
  prisma.outboundCall.count = (async () => 1) as typeof original;
  t.after(() => { prisma.outboundCall.count = original; });
  const now = Math.floor(Date.now() / 1000);
  const calls = await listLiveCalls("org_123", {
    listRooms: async () => [
      { name: "outbound_rejected", numParticipants: 0, creationTime: now - 900 },
      { name: "outbound_starting", numParticipants: 0, creationTime: now },
      { name: "outbound_connected", numParticipants: 2, creationTime: now - 900 },
      { name: "outbound_unknown_time", numParticipants: 0 },
    ],
    deleteRoom: async () => undefined,
  });
  assert.deepEqual(calls.map((call) => call.callId), ["connected"]);
});

test("empty rooms clear even a fresh active Redis registration", async () => {
  const startedAt = new Date().toISOString();
  const stale: string[] = [];
  const calls = await listLiveCalls("org_123", {
    listRooms: async () => [{ name: "outbound_rejected", numParticipants: 0, creationTime: Date.now() / 1000 }],
    deleteRoom: async () => undefined,
  }, {
    listActiveCalls: async () => [{
      version: 1, type: "call.started", organizationId: "org_123", callId: "rejected",
      roomName: "outbound_rejected", eventId: "0-0", occurredAt: startedAt,
      status: "active", agentId: "", direction: "outbound",
      fromNumber: "+13022079009", toNumber: "+919876543210", startedAt,
    }],
    findActiveCallByRoom: async () => null,
    markCallStale: async (_organizationId, callId) => { stale.push(callId); },
  });
  assert.deepEqual(calls, []);
  assert.deepEqual(stale, ["rejected"]);
});

test("manually ending a call clears its active registry entry after room deletion", async () => {
  const operations: string[] = [];
  const result = await endLiveCall("org_123", "outbound_rejected", {
    listRooms: async () => [],
    deleteRoom: async (name) => { operations.push(`delete:${name}`); },
  }, {
    listActiveCalls: async () => [],
    findActiveCallByRoom: async () => ({
      version: 1, type: "call.started", organizationId: "org_123", callId: "rejected",
      roomName: "outbound_rejected", eventId: "0-0", occurredAt: new Date().toISOString(),
      status: "active", agentId: "", direction: "outbound", fromNumber: "", toNumber: "",
      startedAt: new Date().toISOString(),
    }),
    markCallStale: async (_org, callId) => { operations.push(`stale:${callId}`); },
  });
  assert.equal(result.status, "ended");
  assert.deepEqual(operations, ["delete:outbound_rejected", "stale:rejected"]);
});
