import { pipeline } from "node:stream/promises";
import type { Response } from "express";

import { NotFoundError } from "../../common/errors/notFound.js";
import { livekitRoomServiceClient } from "../../config/livekit.js";
import {
  deleteRecordingObject,
  readRecordingStream,
  recordingObjectExists,
} from "../../config/recording-storage.js";
import { deleteObject, generateDownloadUrl } from "../../config/s3.js";
import { reportCallMinutesUsage } from "../billing/metered-usage.service.js";
import {
  hasActiveLegacySubscription,
  isLegacyBilledCall,
} from "../billing/call-metering.service.js";
import * as calllogRepository from "./calllog.repository.js";
import type {
  IngestCallLogArgs,
  ListCallLogsArgs,
  ListTranscriptsArgs,
} from "./calllog.schema.js";
import type { LiveTranscriptStore } from "../../realtime/live-transcript.store.js";
import type { CallStartedEvent } from "../../realtime/live-transcript.contract.js";

type RecordingSigner = typeof generateDownloadUrl;
type CallWithRecording = { audioRecordingPath: string | null };
const LIVEKIT_REGISTRY_STALE_GRACE_MS = 30_000;

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const recordingContentType = (key: string): string => {
  const lower = key.toLowerCase();
  if (lower.endsWith(".mp3")) return "audio/mpeg";
  if (lower.endsWith(".wav")) return "audio/wav";
  if (lower.endsWith(".webm")) return "audio/webm";
  if (lower.endsWith(".mp4") || lower.endsWith(".m4a")) return "audio/mp4";
  // LiveKit room composite audio-only egress writes OGG/Opus by default.
  return "audio/ogg";
};

export const signCallRecordingUrl = async <T extends CallWithRecording & { callId?: string }>(
  call: T,
  _signer: RecordingSigner = generateDownloadUrl,
): Promise<T> => {
  // Keep the storage key opaque. Browser Play/Download must use the authenticated
  // /calls/:callId/recording API instead of direct object-storage URLs.
  if (!call.audioRecordingPath || isHttpUrl(call.audioRecordingPath)) {
    return call;
  }
  if (await recordingObjectExists(call.audioRecordingPath)) {
    return call;
  }
  // Orphan keys (failed egress / wiped local disk) must not advertise Play/Download.
  if (call.callId) {
    void calllogRepository
      .detachMissingRecording(call.callId, call.audioRecordingPath)
      .catch((error) => {
        console.warn("[calllogs] failed to detach missing recording", {
          callId: call.callId,
          error: error instanceof Error ? error.message : String(error),
        });
      });
  }
  return { ...call, audioRecordingPath: null };
};

export const ingestCallLog = async (args: IngestCallLogArgs) => {
  const callLog = await calllogRepository.saveCallLog(args);
  // Stripe meters only still-active legacy subscriptions. Prepaid calls are
  // settled by the wallet reporter and must never be reported a second time.
  if (
    (await isLegacyBilledCall(args.organizationId, args.callId)) ||
    (await hasActiveLegacySubscription(args.organizationId))
  ) {
    await reportCallMinutesUsage({
      organizationId: args.organizationId,
      callId: args.callId,
      durationSeconds: args.durationSeconds,
      timestamp: new Date(args.endTime),
    }).catch((error) => {
      console.warn("[billing] failed to report legacy Stripe call usage", {
        organizationId: args.organizationId,
        callId: args.callId,
        error: error instanceof Error ? error.message : String(error),
      });
    });
  }
  return callLog;
};

export const listCallLogs = async (args: ListCallLogsArgs) => {
  // Repository over-fetches by one row; we trim here and hand back the
  // trailing callId as the next cursor so the caller can walk forward.
  const rows = await calllogRepository.listByOrg(args);
  const hasMore = rows.length > args.limit;
  const items = hasMore ? rows.slice(0, args.limit) : rows;
  const nextCursor = hasMore ? items[items.length - 1]!.callId : null;
  return {
    items: await Promise.all(items.map((item) => signCallRecordingUrl(item))),
    nextCursor,
  };
};

export const getCallLog = async (organizationId: string, callId: string) => {
  const row = await calllogRepository.getCallByIdForOrg(callId, organizationId);
  if (!row) {
    throw new NotFoundError("Call log not found");
  }
  return signCallRecordingUrl(row);
};

export const recordingFileName = (callId: string, key: string): string => {
  const extension = key.includes(".") ? key.slice(key.lastIndexOf(".")) : ".ogg";
  const safeExt = /^\.[a-z0-9]+$/i.test(extension) ? extension : ".ogg";
  return `recording-${callId.replace(/[^a-zA-Z0-9_-]/g, "_")}${safeExt}`;
};

export const getCallRecordingDownloadUrl = async (
  organizationId: string,
  callId: string,
) => {
  const call = await calllogRepository.getCallByIdForOrg(callId, organizationId);
  if (!call?.audioRecordingPath || isHttpUrl(call.audioRecordingPath)) {
    throw new NotFoundError("Recording not available for download");
  }
  if (!(await recordingObjectExists(call.audioRecordingPath))) {
    await calllogRepository.detachMissingRecording(callId, call.audioRecordingPath);
    throw new NotFoundError("Recording not available for download");
  }
  // Prefer same-origin authenticated streaming over exposing object-storage URLs.
  return `/api/v1/calls/${encodeURIComponent(callId)}/recording?disposition=attachment`;
};

export const streamCallRecording = async (
  organizationId: string,
  callId: string,
  response: Response,
  options: {
    disposition?: "inline" | "attachment";
    reader?: typeof readRecordingStream;
  } = {},
) => {
  const call = await calllogRepository.getCallByIdForOrg(callId, organizationId);
  if (!call?.audioRecordingPath || isHttpUrl(call.audioRecordingPath)) {
    throw new NotFoundError("Recording not available");
  }
  const key = call.audioRecordingPath;
  if (!(await recordingObjectExists(key))) {
    await calllogRepository.detachMissingRecording(callId, key);
    throw new NotFoundError("Recording not available");
  }
  const contentType = recordingContentType(key);
  const disposition = options.disposition === "attachment" ? "attachment" : "inline";
  const fileName = recordingFileName(callId, key);
  const cancellation = new AbortController();
  const timeout = setTimeout(() => cancellation.abort(), 60_000);
  timeout.unref?.();
  const cancel = () => cancellation.abort();
  response.once("close", cancel);
  let body: Awaited<ReturnType<typeof readRecordingStream>>["body"] | undefined;
  try {
    if (response.destroyed) return;
    const object = await (options.reader ?? readRecordingStream)(key, cancellation.signal);
    body = object.body;
    response.status(200);
    response.set({
      "Content-Type": contentType,
      "Content-Disposition":
        disposition === "attachment"
          ? `attachment; filename="${fileName}"`
          : "inline",
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      ...(object.contentLength !== undefined
        ? { "Content-Length": String(object.contentLength) }
        : {}),
    });
    await pipeline(body, response, { signal: cancellation.signal });
  } catch (error) {
    if (response.destroyed || response.headersSent) {
      response.destroy();
      return;
    }
    if (error instanceof Error && ["NoSuchKey", "NotFound", "InvalidAccessKeyId", "AccessDenied"].includes(error.name)) {
      await calllogRepository.detachMissingRecording(callId, key).catch(() => undefined);
      throw new NotFoundError("Recording not available");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    response.off("close", cancel);
    cancellation.abort();
    body?.destroy();
  }
};

export const getTranscripts = async (args: ListTranscriptsArgs) => {
  const rows = await calllogRepository.getTranscriptsByCallId(args);
  const hasMore = rows.length > args.limit;
  const items = hasMore ? rows.slice(0, args.limit) : rows;
  const nextCursor = hasMore ? items[items.length - 1]!.callTransId : null;
  return { items, nextCursor };
};

type LiveKitRoomClient = {
  listRooms: () => Promise<unknown[]>;
  deleteRoom: (roomName: string) => Promise<unknown>;
};

type LiveCallRegistry = Pick<
  LiveTranscriptStore,
  "findActiveCallByRoom" | "listActiveCalls" | "markCallStale"
>;

export type LiveCallRoom = {
  roomName: string;
  callId: string;
  direction: "inbound" | "outbound" | "unknown";
  participantCount: number;
  startedAt: string | null;
  status: "active";
  agentId: string | null;
  agentName: string | null;
  fromNumber: string | null;
  toNumber: string | null;
};

export const listLiveCalls = async (
  organizationId: string,
  roomClient: LiveKitRoomClient = livekitRoomServiceClient as LiveKitRoomClient,
  registry?: LiveCallRegistry,
) => {
  let registered: CallStartedEvent[] | null = null;
  if (registry) {
    try {
      registered = await registry.listActiveCalls(organizationId);
    } catch (error) {
      console.warn(
        "[live-calls] Redis registry unavailable; using LiveKit fallback",
        {
          organizationId,
          error: error instanceof Error ? error.message : String(error),
        },
      );
    }
  }

  let normalizedRooms: LiveCallRoom[];
  try {
    const rooms = await roomClient.listRooms();
    normalizedRooms = rooms
      .map(normalizeLiveRoom)
      .filter((room): room is LiveCallRoom => room !== null);
  } catch (error) {
    if (registered) {
      console.warn(
        "[live-calls] LiveKit unavailable; returning Redis registry",
        {
          organizationId,
          error: error instanceof Error ? error.message : String(error),
        },
      );
      return enrichAgentNames(
        organizationId,
        registered.map((event) => liveCallFromRegistry(event, null)),
      );
    }
    throw error;
  }

  const calls: LiveCallRoom[] = [];
  const claimedRooms = new Set<string>();
  const claimedCallIds = new Set<string>();
  if (registered) {
    const roomsByName = new Map(
      normalizedRooms.map((room) => [room.roomName, room]),
    );
    const roomsByCallId = new Map(
      normalizedRooms.map((room) => [room.callId, room]),
    );
    const stale: CallStartedEvent[] = [];
    for (const event of registered) {
      claimedCallIds.add(event.callId);
      const room =
        roomsByName.get(event.roomName) ?? roomsByCallId.get(event.callId);
      if (room?.participantCount === 0) {
        stale.push(event);
        continue;
      }
      if (!room) {
        const startedAt = Date.parse(event.startedAt);
        const withinVisibilityGrace =
          Number.isFinite(startedAt) &&
          Date.now() - startedAt < LIVEKIT_REGISTRY_STALE_GRACE_MS;
        if (withinVisibilityGrace) {
          calls.push(liveCallFromRegistry(event, null));
        } else {
          stale.push(event);
        }
        continue;
      }
      claimedRooms.add(room.roomName);
      calls.push(liveCallFromRegistry(event, room));
    }
    if (registry && stale.length > 0) {
      await Promise.all(
        stale.map((event) =>
          registry
            .markCallStale(organizationId, event.callId)
            .catch((error) => {
              console.warn(
                "[live-calls] failed to clean stale registry entry",
                {
                  organizationId,
                  callId: event.callId,
                  error: error instanceof Error ? error.message : String(error),
                },
              );
            }),
        ),
      );
    }
  }

  const fallbackRooms = normalizedRooms.filter(
    (room) =>
      room.participantCount > 0 &&
      !claimedRooms.has(room.roomName) && !claimedCallIds.has(room.callId),
  );
  const scopedFallback = await Promise.all(
    fallbackRooms.map(async (room) =>
      (await calllogRepository.liveRoomBelongsToOrg(
        organizationId,
        room.roomName,
      ))
        ? room
        : null,
    ),
  );
  calls.push(
    ...scopedFallback.filter((room): room is LiveCallRoom => room !== null),
  );

  const enriched = await enrichAgentNames(
    organizationId,
    mergeCallsByCallId(calls),
  );
  return enriched.sort((a, b) =>
    (b.startedAt ?? "").localeCompare(a.startedAt ?? ""),
  );
};

export const endLiveCall = async (
  organizationId: string,
  roomName: string,
  roomClient: LiveKitRoomClient = livekitRoomServiceClient as LiveKitRoomClient,
  registry?: LiveCallRegistry,
) => {
  const normalizedRoomName = roomName.trim();
  if (!normalizedRoomName) {
    throw new NotFoundError("Live call room not found");
  }
  let registeredCall: CallStartedEvent | null = null;
  if (registry) {
    try {
      registeredCall = await registry.findActiveCallByRoom(
        organizationId,
        normalizedRoomName,
      );
    } catch (error) {
      console.warn("[live-calls] Redis ownership check unavailable", {
        organizationId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  const belongsToOrg =
    registeredCall !== null ||
    (await calllogRepository.liveRoomBelongsToOrg(
      organizationId,
      normalizedRoomName,
    ));
  if (!belongsToOrg) {
    throw new NotFoundError("Live call room not found");
  }
  try {
    await roomClient.deleteRoom(normalizedRoomName);
  } catch (error) {
    if (!isLiveKitRoomNotFound(error)) throw error;
  }
  const callId = registeredCall?.callId ?? callIdFromRoomName(normalizedRoomName);
  if (registry) {
    await registry.markCallStale(organizationId, callId).catch((error) => {
      console.warn("[live-calls] failed to clear ended call registry entry", {
        organizationId, callId, error: error instanceof Error ? error.message : String(error),
      });
    });
  }
  return {
    status: "ended" as const,
    roomName: normalizedRoomName,
    callId,
  };
};

function normalizeLiveRoom(room: unknown): LiveCallRoom | null {
  if (!room || typeof room !== "object") return null;
  const record = room as Record<string, unknown>;
  const roomName = stringValue(record.name ?? record.roomName);
  if (!roomName || roomName.startsWith("preview-")) return null;
  const participantCount = numberValue(record.numParticipants ?? record.num_participants) ?? 0;
  const startedAt = liveKitTimestamp(record.creationTime ?? record.creation_time ?? record.createdAt);

  return {
    roomName,
    callId: callIdFromRoomName(roomName),
    direction: roomName.startsWith("outbound_") ? "outbound" : "inbound",
    participantCount,
    startedAt,
    status: "active",
    agentId: null,
    agentName: null,
    fromNumber: null,
    toNumber: null,
  };
}

function liveCallFromRegistry(
  event: CallStartedEvent,
  room: LiveCallRoom | null,
): LiveCallRoom {
  return {
    roomName: event.roomName,
    callId: event.callId,
    direction: event.direction,
    participantCount: room?.participantCount ?? 0,
    startedAt: event.startedAt,
    status: "active",
    agentId: event.agentId || null,
    agentName: null,
    fromNumber: event.fromNumber || null,
    toNumber: event.toNumber || null,
  };
}

function mergeCallsByCallId(calls: LiveCallRoom[]) {
  const byCallId = new Map<string, LiveCallRoom>();
  for (const call of calls) {
    const existing = byCallId.get(call.callId);
    if (!existing) {
      byCallId.set(call.callId, call);
      continue;
    }
    byCallId.set(call.callId, {
      ...existing,
      participantCount:
        call.participantCount > existing.participantCount
          ? call.participantCount
          : existing.participantCount,
      direction:
        existing.direction === "unknown" ? call.direction : existing.direction,
      startedAt: existing.startedAt ?? call.startedAt,
      agentId: existing.agentId ?? call.agentId,
      agentName: existing.agentName ?? call.agentName,
      fromNumber: existing.fromNumber ?? call.fromNumber,
      toNumber: existing.toNumber ?? call.toNumber,
    });
  }
  return [...byCallId.values()];
}

async function enrichAgentNames(organizationId: string, calls: LiveCallRoom[]) {
  const agentIds = Array.from(
    new Set(
      calls
        .map((call) => call.agentId)
        .filter((agentId): agentId is string => Boolean(agentId)),
    ),
  );
  const agents = await calllogRepository.listAgentNamesForOrg(
    organizationId,
    agentIds,
  );
  const names = new Map(agents.map((agent) => [agent.agentId, agent.name]));
  return calls.map((call) => ({
    ...call,
    agentName: call.agentId ? (names.get(call.agentId) ?? null) : null,
  }));
}

function isLiveKitRoomNotFound(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const record = error as Record<string, unknown>;
  const code = String(record.code ?? "").toLowerCase();
  const status = record.status ?? record.statusCode;
  const message =
    typeof record.message === "string" ? record.message.toLowerCase() : "";
  return (
    code === "not_found" ||
    code === "5" ||
    status === 404 ||
    message.includes("not found") ||
    message.includes("does not exist")
  );
}

function callIdFromRoomName(roomName: string) {
  if (roomName.startsWith("outbound_")) {
    return roomName.slice("outbound_".length);
  }
  return roomName;
}

function liveKitTimestamp(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "bigint")
    return new Date(Number(value) * 1000).toISOString();
  if (typeof value === "number") {
    return new Date(
      value > 10_000_000_000 ? value : value * 1000,
    ).toISOString();
  }
  if (typeof value === "string") {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return liveKitTimestamp(numeric);
    const time = Date.parse(value);
    return Number.isFinite(time) ? new Date(time).toISOString() : null;
  }
  return null;
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function numberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export const deleteCallLog = async (
  organizationId: string,
  callId: string,
  dependencies: {
    deleteObjectImpl?: typeof deleteObject;
    deleteCallLogImpl?: typeof calllogRepository.deleteCallLog;
    getCallForDeletionImpl?: typeof calllogRepository.getCallForDeletion;
  } = {},
) => {
  const getCallForDeletion =
    dependencies.getCallForDeletionImpl ?? calllogRepository.getCallForDeletion;
  const call = await getCallForDeletion(callId, organizationId);
  if (!call) {
    throw new NotFoundError("Call log not found");
  }

  if (call.audioRecordingPath && !isHttpUrl(call.audioRecordingPath)) {
    const deleteRecording =
      dependencies.deleteObjectImpl ??
      ((key: string) => deleteRecordingObject(key));
    await deleteRecording(call.audioRecordingPath);
  }

  const deleteCallLogImpl =
    dependencies.deleteCallLogImpl ?? calllogRepository.deleteCallLog;
  const ok = await deleteCallLogImpl(
    callId,
    organizationId,
    call.audioRecordingPath,
  );
  if (!ok) {
    throw new NotFoundError("Call log not found");
  }
};
