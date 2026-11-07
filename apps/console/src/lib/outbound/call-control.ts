const ACTIVE_STATUSES = new Set(["SCHEDULED", "PROCESSED", "IN_PROGRESS", "DIALING"]);

export function outboundCallCanStop(status: string | null | undefined): boolean {
  return status != null && ACTIVE_STATUSES.has(status);
}

export function outboundCallsToStop(
  calls: Array<{ outboundId: string; status: string }>,
  extraOutboundIds: readonly string[] = [],
): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();
  const add = (outboundId: string | null | undefined) => {
    if (!outboundId || seen.has(outboundId)) return;
    seen.add(outboundId);
    ids.push(outboundId);
  };
  for (const call of calls) {
    if (outboundCallCanStop(call.status)) add(call.outboundId);
  }
  for (const outboundId of extraOutboundIds) add(outboundId);
  return ids;
}

function roomNamesForOutbound(outboundId: string, extraRoomNames: readonly string[] = []): string[] {
  const rooms = [`outbound_${outboundId}`, ...extraRoomNames];
  const seen = new Set<string>();
  return rooms.filter((roomName) => {
    if (!roomName || seen.has(roomName)) return false;
    seen.add(roomName);
    return true;
  });
}

async function settledOk(promise: Promise<unknown>): Promise<boolean> {
  try {
    await promise;
    return true;
  } catch {
    return false;
  }
}

/**
 * Immediately ends LiveKit (and therefore Twilio/Telnyx SIP legs in that room),
 * then cancels/marks the outbound row stopped so UI status updates.
 */
export async function terminateOutboundCall(input: {
  outboundId: string;
  status?: string | null;
  endLive: (roomName: string) => Promise<unknown>;
  cancelScheduled: (outboundId: string) => Promise<unknown>;
  /** Optional live room names already known for this outbound call. */
  liveRoomNames?: readonly string[];
}): Promise<void> {
  const rooms = roomNamesForOutbound(input.outboundId, input.liveRoomNames);
  const results = await Promise.all([
    ...rooms.map((roomName) => settledOk(input.endLive(roomName))),
    settledOk(input.cancelScheduled(input.outboundId)),
  ]);
  if (!results.some(Boolean)) {
    throw new Error("Could not stop the call");
  }
}
