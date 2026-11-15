import { Queue } from "bullmq";
import { bullmqConnection } from "./bullmq-connection.js";

export type AgentDeletionJobName = "delete";

export interface AgentDeletionJobData {
  agentId: string;
  organizationId: string;
}

let agentDeletionQueue:
  | Queue<AgentDeletionJobData, void, AgentDeletionJobName>
  | undefined;

export function getAgentDeletionQueue(): Queue<
  AgentDeletionJobData,
  void,
  AgentDeletionJobName
> {
  if (!agentDeletionQueue) {
    agentDeletionQueue = new Queue<
      AgentDeletionJobData,
      void,
      AgentDeletionJobName
    >("agent-deletion", {
      connection: bullmqConnection(),
      defaultJobOptions: {
        attempts: 10,
        backoff: { type: "exponential", delay: 5_000 },
        removeOnComplete: true,
        // Recovery re-enqueues permanently failed operations by deterministic id.
        removeOnFail: true,
      },
    });
  }
  return agentDeletionQueue;
}

export function agentDeletionJobId(agentId: string) {
  return `agent-delete-${agentId}`;
}

export async function enqueueAgentDeletion(data: AgentDeletionJobData) {
  await getAgentDeletionQueue().add("delete", data, {
    jobId: agentDeletionJobId(data.agentId),
  });
}

export async function closeAgentDeletionQueue() {
  try {
    await agentDeletionQueue?.close();
  } finally {
    agentDeletionQueue = undefined;
  }
}
