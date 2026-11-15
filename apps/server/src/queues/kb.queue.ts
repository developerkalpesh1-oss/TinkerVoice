import { Queue } from "bullmq";
import { bullmqConnection } from "./bullmq-connection.js";

export type KbJobName = "process";

export interface KbJobDocument {
  kbId: string;
  name: string;
  sourceType: string;
  url?: string | null;
  s3Key?: string | null;
  originalFileName?: string | null;
}

export interface KbJobData {
  kbIds: string[];
  agentId: string;
  organizationId: string;
  documents: KbJobDocument[];
  replaceExisting?: boolean;
  previousAgentId?: string | null;
  enqueuedBeforeClaim?: boolean;
}

let kbQueue: Queue<KbJobData, void, KbJobName> | undefined;

export function getKbQueue(): Queue<KbJobData, void, KbJobName> {
  if (!kbQueue) {
    kbQueue = new Queue<KbJobData, void, KbJobName>("kb-ingest", {
      connection: bullmqConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    });
  }
  return kbQueue;
}

export async function closeKbQueue() {
  try {
    await kbQueue?.close();
  } finally {
    kbQueue = undefined;
  }
}
