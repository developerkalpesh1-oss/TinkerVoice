import { createReadStream } from "node:fs";
import { access, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

import { deleteObject, readObjectStream } from "./s3.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_LOCAL_ROOT = path.resolve(HERE, "../../../../.data/recordings");

function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

function isPlaceholderCredential(value: string | undefined): boolean {
  if (!value) return true;
  const normalized = value.trim().toLowerCase();
  return (
    normalized.length === 0 ||
    normalized.startsWith("dev-") ||
    normalized.includes("changeme") ||
    normalized.includes("your-") ||
    normalized.includes("example") ||
    normalized === "placeholder"
  );
}

function hasUsableAwsCredentials(): boolean {
  const access =
    readEnv("AWS_ACCESS_KEY_ID", "ACCESS_KEY_ID", "ACCESS_KEY");
  const secret =
    readEnv("AWS_SECRET_ACCESS_KEY", "SECRET_ACCESS_KEY");
  return !isPlaceholderCredential(access) && !isPlaceholderCredential(secret);
}

export const recordingStorageMode = (): "local" | "s3" => {
  const explicit = (readEnv("RECORDING_STORAGE") || "").toLowerCase();
  if (explicit === "local" || explicit === "s3") return explicit;
  return hasUsableAwsCredentials() ? "s3" : "local";
};

export const localRecordingRoot = (): string => {
  const configured = readEnv("RECORDING_LOCAL_DIR");
  if (configured) return path.resolve(configured);
  return DEFAULT_LOCAL_ROOT;
};

export const localRecordingPath = (key: string): string => {
  const root = localRecordingRoot();
  const resolved = path.resolve(root, key);
  if (!resolved.startsWith(root + path.sep) && resolved !== root) {
    throw new Error("Invalid recording path");
  }
  return resolved;
};

export const recordingObjectExists = async (key: string): Promise<boolean> => {
  if (recordingStorageMode() !== "local") {
    // Object existence is confirmed on stream; list/get stay cheap for S3.
    return Boolean(key);
  }
  try {
    await access(localRecordingPath(key));
    return true;
  } catch {
    return false;
  }
};

export const readRecordingStream = async (
  key: string,
  signal: AbortSignal,
): Promise<{ body: Readable; contentLength?: number }> => {
  if (recordingStorageMode() === "local") {
    const filePath = localRecordingPath(key);
    try {
      await access(filePath);
    } catch {
      const error = new Error("Recording not found");
      error.name = "NoSuchKey";
      throw error;
    }
    const info = await stat(filePath);
    const body = createReadStream(filePath);
    signal.addEventListener("abort", () => body.destroy(), { once: true });
    return { body, contentLength: info.size };
  }
  return readObjectStream(key, signal);
};

export const deleteRecordingObject = async (key: string): Promise<void> => {
  if (recordingStorageMode() === "local") {
    try {
      await unlink(localRecordingPath(key));
    } catch (error) {
      if ((error as NodeJS.ErrnoException)?.code !== "ENOENT") throw error;
    }
    return;
  }
  await deleteObject(key);
};
