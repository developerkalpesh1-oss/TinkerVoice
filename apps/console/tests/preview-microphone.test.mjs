import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

test("preview microphone helper probes permission and falls back across devices/constraints", () => {
  const helper = read("src/lib/agents/preview-microphone.ts");

  assert.match(helper, /export async function acquirePreviewMicrophone/);
  assert.match(helper, /export function formatMicrophoneError/);
  assert.match(helper, /getUserMedia\(\{ audio: true \}\)/);
  assert.match(helper, /enumerateDevices/);
  assert.match(helper, /deviceId !== "default"/);
  assert.match(helper, /deviceId !== "communications"/);
  assert.match(helper, /createLocalAudioTrack\(attempt\.options\)/);
  assert.match(helper, /Requested device not found/i);
  assert.match(helper, /echoCancellation: false/);
  assert.match(helper, /noiseSuppression: false/);
  assert.match(helper, /sampleRate: 48000/);
  assert.match(helper, /monitor\|loopback\|virtual/);
  assert.doesNotMatch(helper, /measureTrackPeak/);
});

test("preview panel acquires microphone before creating the LiveKit session", () => {
  const panel = read("src/components/agents/AgentPreviewPanel.tsx");

  assert.match(panel, /acquirePreviewMicrophone/);
  assert.match(panel, /formatMicrophoneError/);
  assert.doesNotMatch(panel, /createLocalAudioTrack\(/);
  assert.match(
    panel,
    /const microphone = await acquirePreviewMicrophone[\s\S]*createPreview\.mutateAsync/s,
  );
  assert.match(
    panel,
    /if \(wasCancelled\(\)\) \{\s*microphone\.track\.stop\(\)/s,
  );
  assert.match(panel, /publishTrack\(localTrack, \{[\s\S]*Track\.Source\.Microphone/);
  assert.match(panel, /observePreviewMicrophoneLevel/);
});
