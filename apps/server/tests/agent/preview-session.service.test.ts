import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

const originalAiApiUrl = process.env.AI_API_URL;
const originalInternalApiKey = process.env.INTERNAL_API_KEY;
const originalFetch = globalThis.fetch;

afterEach(() => {
  process.env.AI_API_URL = originalAiApiUrl;
  process.env.INTERNAL_API_KEY = originalInternalApiKey;
  globalThis.fetch = originalFetch;
});

test("buildAgentPreviewSessionPayload maps saved config to an ephemeral preview request", async () => {
  const { PREVIEW_SESSION_TTL_SECONDS, buildAgentPreviewSessionPayload } =
    await import("../../src/modules/agent/agent.service.js");

  const payload = buildAgentPreviewSessionPayload({
    agentId: "agent_123",
    organizationId: "org_123",
    agent_language: "en",
    timezone: "America/Chicago",
    sttModel: "nova-3",
    llmModel: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
    ttsModel: "eleven_flash_v2_5",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    firstMessage: "Hello {{first_name}} from saved config.",
    systemPrompt: "You are helping {{company}}.",
    variables: {
      placeholders: {
        first_name: "Saved Aman",
        company: "QuickIntell",
        empty_value: "",
      },
    },
    dynamicVariables: {
      first_name: "Preview Aman",
      ignored_empty: "",
    },
  });

  assert.equal(payload.ttl_seconds, PREVIEW_SESSION_TTL_SECONDS);
  assert.match(payload.room.name, /^preview-/);
  assert.match(payload.participant.identity, /^preview-user-/);
  assert.equal(payload.config.language, "en");
  assert.equal(payload.config.timezone, "America/Chicago");
  assert.deepEqual(payload.config.stt, { model: "nova-3" });
  assert.deepEqual(payload.config.llm, {
    model: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
  });
  assert.deepEqual(payload.config.tts, {
    model: "eleven_flash_v2_5",
    voice: "EXAVITQu4vr4xnSDxMaL",
  });
  assert.equal(payload.metadata.mode, "preview");
  assert.equal(payload.metadata.retention, "ephemeral");
  assert.equal(
    payload.metadata.first_message,
    "Hello Preview Aman from saved config.",
  );
  assert.equal(payload.metadata.system_prompt, "You are helping QuickIntell.");
  assert.deepEqual(payload.metadata.dynamic_variables, {
    first_name: "Preview Aman",
    company: "QuickIntell",
  });
});

test("requestAgentPreviewSession calls AI sessions with internal auth and maps response", async () => {
  process.env.AI_API_URL = "http://ai.local:5555";
  process.env.INTERNAL_API_KEY = "internal-key";
  const calls: Array<{
    url: string;
    body: any;
    headers: HeadersInit | undefined;
  }> = [];
  globalThis.fetch = async (url, init) => {
    calls.push({
      url: String(url),
      headers: init?.headers,
      body: JSON.parse(String(init?.body)),
    });
    return Response.json({
      livekit_url: "wss://livekit.example.com",
      room: { name: "preview-room" },
      participant: {
        identity: "preview-user",
        name: "Preview user",
        token: "token",
        ttl_seconds: 10800,
      },
      agent: {
        name: "quickvoice-voice-agent",
        dispatch_id: "AD_123",
      },
    });
  };

  const { requestAgentPreviewSession } =
    await import("../../src/modules/agent/agent.service.js");

  const session = await requestAgentPreviewSession({
    room: { name: "preview-room" },
    participant: { identity: "preview-user", name: "Preview user" },
    config: {
      language: "en",
      timezone: "UTC",
      stt: { model: "nova-3" },
      llm: { model: "us.amazon.nova-micro-v1:0" },
      tts: { model: "eleven_flash_v2_5", voice: "EXAVITQu4vr4xnSDxMaL" },
    },
    metadata: { mode: "preview", retention: "ephemeral" },
    ttl_seconds: 10800,
  });

  assert.equal(calls[0].url, "http://ai.local:5555/voice/sessions");
  assert.equal(
    (calls[0].headers as Record<string, string>)["x-internal-key"],
    "internal-key",
  );
  assert.equal(calls[0].body.ttl_seconds, 10800);
  assert.equal(session.livekitUrl, "wss://livekit.example.com");
  assert.equal(session.roomName, "preview-room");
  assert.equal(session.participant.ttlSeconds, 10800);
  assert.equal(session.agent.dispatchId, "AD_123");
  assert.match(session.expiresAt, /^\d{4}-\d{2}-\d{2}T/);
});

test("requestAgentPreviewSession surfaces AI detail on failure", async () => {
  process.env.AI_API_URL = "http://ai.local:5555";
  process.env.INTERNAL_API_KEY = "internal-key";
  globalThis.fetch = async () =>
    Response.json(
      { detail: "LIVEKIT_URL still uses the local placeholder" },
      { status: 503 },
    );

  const { requestAgentPreviewSession } =
    await import("../../src/modules/agent/agent.service.js");

  await assert.rejects(
    () =>
      requestAgentPreviewSession({
        room: { name: "preview-room" },
        participant: { identity: "preview-user", name: "Preview user" },
        config: {
          language: "en",
          timezone: "UTC",
          stt: { model: "nova-3" },
          llm: { model: "us.amazon.nova-micro-v1:0" },
          tts: { model: "eleven_flash_v2_5", voice: "EXAVITQu4vr4xnSDxMaL" },
        },
        metadata: { mode: "preview", retention: "ephemeral" },
        ttl_seconds: 10800,
      }),
    (error: any) => {
      assert.match(
        String(error?.message ?? error),
        /LIVEKIT_URL still uses the local placeholder/,
      );
      return true;
    },
  );
});
