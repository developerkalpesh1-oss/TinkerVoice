import type { ConnectionOptions } from "bullmq";

/**
 * BullMQ connection options that avoid passing an ioredis `Redis` instance.
 * pnpm can install multiple ioredis copies (server pin vs bullmq transitive),
 * which makes `Redis` structurally incompatible with BullMQ's ConnectionOptions.
 */
export function bullmqConnection(): ConnectionOptions {
  const redisUrl = process.env.REDIS_URL?.trim() || "redis://localhost:6379";
  try {
    const parsed = new URL(redisUrl);
    const port = parsed.port ? Number(parsed.port) : 6379;
    return {
      host: parsed.hostname || "localhost",
      port: Number.isFinite(port) ? port : 6379,
      username: parsed.username ? decodeURIComponent(parsed.username) : undefined,
      password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
      tls: parsed.protocol === "rediss:" ? {} : undefined,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    };
  } catch {
    return {
      host: "localhost",
      port: 6379,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    };
  }
}
