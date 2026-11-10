import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

test("local recording storage reads and deletes files under the shared root", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "tinkervoice-recordings-"));
  t.after(async () => {
    await rm(root, { recursive: true, force: true });
  });

  const previousStorage = process.env.RECORDING_STORAGE;
  const previousDir = process.env.RECORDING_LOCAL_DIR;
  process.env.RECORDING_STORAGE = "local";
  process.env.RECORDING_LOCAL_DIR = root;
  t.after(() => {
    if (previousStorage === undefined) delete process.env.RECORDING_STORAGE;
    else process.env.RECORDING_STORAGE = previousStorage;
    if (previousDir === undefined) delete process.env.RECORDING_LOCAL_DIR;
    else process.env.RECORDING_LOCAL_DIR = previousDir;
  });

  const { deleteRecordingObject, localRecordingPath, readRecordingStream, recordingStorageMode } =
    await import("../../src/config/recording-storage.js");

  assert.equal(recordingStorageMode(), "local");
  const key = "Voice-agents/Recordings/smoke.ogg";
  const filePath = localRecordingPath(key);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, Buffer.from("OggS-smoke"));

  const controller = new AbortController();
  const { body, contentLength } = await readRecordingStream(key, controller.signal);
  const chunks: Buffer[] = [];
  for await (const chunk of body) chunks.push(Buffer.from(chunk));
  assert.equal(Buffer.concat(chunks).toString(), "OggS-smoke");
  assert.equal(contentLength, 10);

  await deleteRecordingObject(key);
  await assert.rejects(() => readFile(filePath));
});
