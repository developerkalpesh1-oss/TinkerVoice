import { Worker } from "bullmq";

import {
  recoverActiveCampaignDispatches,
  dispatchBatchCampaign,
  dispatchBatchOutboundCall,
  importBatchCampaignRecipients,
} from "../modules/outbound/outbound-batch.service.js";
import { bullmqConnection } from "../queues/bullmq-connection.js";
import { getOutboundBatchQueue } from "../queues/outbound-batch.queue.js";
import type {
  OutboundBatchJobData,
  OutboundBatchJobName,
} from "../queues/outbound-batch.queue.js";

export async function processOutboundBatchJob(job: {
  name: OutboundBatchJobName;
  data: OutboundBatchJobData;
}) {
  if (job.name === "recover-campaigns") {
    await recoverActiveCampaignDispatches();
    return;
  }

  if (job.name === "import") {
    if (!job.data.campaignId) throw new Error("campaignId is required");
    await importBatchCampaignRecipients({ campaignId: job.data.campaignId });
    return;
  }

  if (job.name === "dispatch-campaign") {
    if (!job.data.campaignId) throw new Error("campaignId is required");
    await dispatchBatchCampaign({ campaignId: job.data.campaignId });
    return;
  }

  if (job.name === "dispatch-call") {
    if (!job.data.outboundId) throw new Error("outboundId is required");
    await dispatchBatchOutboundCall({ outboundId: job.data.outboundId });
    return;
  }

  throw new Error(`Unsupported outbound batch job: ${job.name}`);
}

export const outboundBatchWorker = new Worker<
  OutboundBatchJobData,
  void,
  OutboundBatchJobName
>("outbound-batch", processOutboundBatchJob, {
  connection: bullmqConnection(),
  concurrency: 5,
});

outboundBatchWorker.on("failed", (job, err) => {
  console.error("[outbound-batch-worker] job failed", {
    jobId: job?.id,
    name: job?.name,
    error: err.message,
  });
});

outboundBatchWorker.on("completed", (job) => {
  console.log(`[outbound-batch-worker] job ${job.id} completed`);
});

outboundBatchWorker.on("error", (error) => {
  console.error("[outbound-batch-worker] worker error", error);
});

export async function closeOutboundBatchWorker() {
  await outboundBatchWorker.close();
}

// The scheduler is stored in Redis, so recovery survives API restarts.
export async function startOutboundDispatchRecovery() {
  await getOutboundBatchQueue().upsertJobScheduler(
    "recover-campaigns",
    { every: 60_000 },
    {
      name: "recover-campaigns",
      data: {},
      opts: { removeOnComplete: true, removeOnFail: 20 },
    },
  );
}
