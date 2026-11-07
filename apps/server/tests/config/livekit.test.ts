import assert from "node:assert/strict";
import { test } from "node:test";

import { DEFAULT_LIVEKIT_AGENT_NAME } from "../../src/config/livekit.js";

test("LiveKit agent dispatch default matches the deployed worker name", () => {
  assert.equal(DEFAULT_LIVEKIT_AGENT_NAME, "tinkervoice-voice-agent");
});
