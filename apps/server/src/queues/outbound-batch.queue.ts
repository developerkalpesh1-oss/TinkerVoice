import { Queue } from "bullmq";
import { bullmqConnection } from "./bullmq-connection.js";

export type OutboundBatchJobName =
  | "recover-campaigns"
  | "import"
  | "dispatch-campaign"
  | "dispatch-call";

export interface OutboundBatchJobData {
  campaignId?: string;
  outboundId?: string;
}

let outboundBatchQueue:
  | Queue<OutboundBatchJobData, void, OutboundBatchJobName>
  | undefined;

export function getOutboundBatchQueue(): Queue<
  OutboundBatchJobData,
  void,
  OutboundBatchJobName
> {
  if (!outboundBatchQueue) {
    outboundBatchQueue = new Queue<
      OutboundBatchJobData,
      void,
      OutboundBatchJobName
    >("outbound-batch", {
      connection: bullmqConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    });
  }
  return outboundBatchQueue;
}

export async function closeOutboundBatchQueue() {
  try {
    await outboundBatchQueue?.close();
  } finally {
    outboundBatchQueue = undefined;
  }
}
