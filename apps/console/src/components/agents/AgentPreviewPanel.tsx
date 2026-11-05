"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Room,
  RoomEvent,
  Track,
  type LocalAudioTrack,
  type RemoteTrack,
} from "livekit-client";
import {
  Loader2,
  Mic,
  MicOff,
  MessageCircle,
  PhoneCall,
  PhoneOff,
  Radio,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { Badge } from "@/src/components/ui/badge";
import { DynamicVariableInputs } from "@/src/components/agents/DynamicVariableInputs";
import {
  useAgentConfig,
  useCreateAgentPreviewSession,
} from "@/src/hooks/queries/agents";
import type { AgentPreviewSession } from "@/src/lib/api/types";
import {
  dynamicVariablePayload,
  normalizeAgentVariables,
  uniqueDynamicVariableNames,
} from "@/src/lib/agents/dynamic-variables";
import {
  acquirePreviewMicrophone,
  formatMicrophoneError,
  observePreviewMicrophoneLevel,
} from "@/src/lib/agents/preview-microphone";
import { ignoreExpectedLiveKitDisconnectLogs } from "@/src/lib/agents/livekit-preview-logs";
import { cn } from "@/src/lib/utils";

type PreviewState =
  | "idle"
  | "requesting"
  | "connecting"
  | "live"
  | "ended"
  | "error";

type TimelineEvent = {
  id: string;
  label: string;
  detail: string;
};

type ConversationMessage = {
  id: string;
  role: "agent" | "user" | "system";
  text: string;
  pending?: boolean;
};

type AgentPreviewPanelProps = {
  agentId: string;
  agentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TRANSCRIPTION_TOPIC = "lk.transcription";

function visibleTranscriptionText(raw: string): string {
  const parts: string[] = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const parsed = JSON.parse(trimmed) as { text?: unknown };
      if (typeof parsed.text === "string" && parsed.text.trim()) {
        parts.push(parsed.text);
        continue;
      }
    } catch {
      // A chunk can split a JSON line. Keep the raw text if it is not JSON.
    }
    if (!trimmed.startsWith("{")) parts.push(trimmed);
  }
  return parts.join("");
}

function transcriptionRole(
  identity: string,
  trackId: string | undefined,
  localIdentity: string,
  localTrackSid: string | null,
): ConversationMessage["role"] {
  if (localTrackSid && trackId === localTrackSid) return "user";
  if (identity && localIdentity && identity === localIdentity) return "user";
  if (identity.startsWith("agent-")) return "agent";
  return "user";
}

const statusCopy: Record<PreviewState, string> = {
  idle: "Ready",
  requesting: "Requesting microphone",
  connecting: "Connecting",
  live: "Live preview",
  ended: "Preview ended",
  error: "Needs attention",
};

export function AgentPreviewPanel({
  agentId,
  agentName,
  open,
  onOpenChange,
}: AgentPreviewPanelProps) {
  const createPreview = useCreateAgentPreviewSession(agentId);
  const { data: config } = useAgentConfig(agentId);
  const roomRef = useRef<Room | null>(null);
  const localTrackRef = useRef<LocalAudioTrack | null>(null);
  const localPublicationSidRef = useRef<string | null>(null);
  const previewAttemptRef = useRef(0);
  const remoteAudioRef = useRef<HTMLDivElement | null>(null);
  const [preview, setPreview] = useState<AgentPreviewSession | null>(null);
  const [state, setState] = useState<PreviewState>("idle");
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [conversationMessages, setConversationMessages] = useState<
    ConversationMessage[]
  >([]);
  const [micLevel, setMicLevel] = useState(0);
  const [previewVariableValues, setPreviewVariableValues] = useState<
    Record<string, string>
  >({});

  const agentVariables = useMemo(
    () => normalizeAgentVariables(config?.variables),
    [config?.variables],
  );
  const previewVariableNames = useMemo(
    () => uniqueDynamicVariableNames(agentVariables),
    [agentVariables],
  );

  const addEvent = useCallback((label: string, detail: string) => {
    setEvents((current) =>
      [
        { id: `${Date.now()}-${current.length}`, label, detail },
        ...current,
      ].slice(0, 8),
    );
  }, []);

  const upsertConversationMessage = useCallback(
    (id: string, role: ConversationMessage["role"], text: string, final: boolean) => {
      const trimmedText = text.trim();
      if (!trimmedText) return;
      setConversationMessages((current) => {
        const nextMessage: ConversationMessage = {
          id,
          role,
          text: trimmedText,
          pending: !final,
        };
        const index = current.findIndex((message) => message.id === id);
        if (index === -1) return [...current, nextMessage].slice(-24);
        const next = current.slice();
        next[index] = nextMessage;
        return next;
      });
    },
    [],
  );

  const handleLiveKitTranscript = useCallback(
    (segments: unknown, participant?: { identity?: string }) => {
      const segmentList = Array.isArray(segments) ? segments : [segments];
      segmentList.forEach((segment) => {
        if (!segment || typeof segment !== "object") return;
        const value = segment as {
          id?: unknown;
          text?: unknown;
          final?: unknown;
          isFinal?: unknown;
        };
        const text = typeof value.text === "string" ? value.text : "";
        if (!text.trim()) return;
        const role = participant?.identity?.startsWith("agent-")
          ? "agent"
          : "user";
        const id =
          typeof value.id === "string" && value.id
            ? value.id
            : `${role}-${text}`;
        upsertConversationMessage(
          id,
          role,
          text,
          Boolean(value.final ?? value.isFinal),
        );
      });
    },
    [upsertConversationMessage],
  );

  const handleLiveKitData = useCallback(
    (payload: Uint8Array, participant?: { identity?: string }) => {
      try {
        const decoded = new TextDecoder().decode(payload);
        const parsed = JSON.parse(decoded) as {
          type?: string;
          role?: string;
          speaker?: string;
          text?: string;
          message?: string;
        };
        const text = parsed.text ?? parsed.message ?? "";
        if (!text.trim()) return;
        const speaker = parsed.role ?? parsed.speaker;
        const role =
          speaker === "agent" || participant?.identity?.startsWith("agent-")
            ? "agent"
            : "user";
        if (parsed.type === "transcript" || parsed.type === "message") {
          upsertConversationMessage(`${role}-${text}`, role, text, true);
        }
      } catch {
        // Non-transcript data packets are expected in LiveKit rooms.
      }
    },
    [upsertConversationMessage],
  );

  const attachRemoteAudio = useCallback((track: RemoteTrack) => {
    if (track.kind !== Track.Kind.Audio || !remoteAudioRef.current) return;
    const element = track.attach();
    element.autoplay = true;
    element.dataset.previewAudio = "true";
    remoteAudioRef.current.appendChild(element);
  }, []);

  const cleanupAudioElements = useCallback(() => {
    remoteAudioRef.current
      ?.querySelectorAll("[data-preview-audio='true']")
      .forEach((element) => element.remove());
  }, []);

  const disconnectPreview = useCallback(() => {
    previewAttemptRef.current += 1;
    const room = roomRef.current;
    const track = localTrackRef.current;
    roomRef.current = null;
    localTrackRef.current = null;
    localPublicationSidRef.current = null;
    // Close the room first so LiveKit detaches data-channel handlers before
    // the peer connection aborts them.
    room?.disconnect();
    track?.stop();
    cleanupAudioElements();
  }, [cleanupAudioElements]);

  const endPreview = useCallback(async () => {
    disconnectPreview();
    setMuted(false);
    setPreview(null);
    setState((current) => (current === "idle" ? "idle" : "ended"));
  }, [disconnectPreview]);

  useEffect(() => {
    ignoreExpectedLiveKitDisconnectLogs();
    return () => {
      disconnectPreview();
    };
  }, [disconnectPreview]);

  useEffect(() => {
    if (!open) disconnectPreview();
  }, [disconnectPreview, open]);

  async function startPreview() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("This browser does not expose microphone access.");
      setState("error");
      return;
    }

    const attemptId = previewAttemptRef.current + 1;
    previewAttemptRef.current = attemptId;
    const wasCancelled = () => previewAttemptRef.current !== attemptId;

    setError(null);
    setEvents([]);
    setConversationMessages([
      {
        id: `${Date.now()}-call-started`,
        role: "system",
        text: "Call started",
      },
    ]);
    setState("requesting");
    addEvent("Microphone", "Waiting for browser permission.");

    let localTrack: LocalAudioTrack | null = null;
    try {
      // Acquire the mic before creating a billed LiveKit session so permission
      // / device failures fail fast with a clear message.
      const microphone = await acquirePreviewMicrophone((detail) => {
        addEvent("Microphone", detail);
      });
      if (wasCancelled()) {
        microphone.track.stop();
        return;
      }
      localTrack = microphone.track;
      localTrackRef.current = localTrack;
      addEvent(
        "Microphone",
        microphone.fallbackUsed
          ? `Using fallback capture (${microphone.deviceLabel}).`
          : `Microphone ready (${microphone.deviceLabel}).`,
      );

      const session = await createPreview.mutateAsync({
        dynamicVariables: dynamicVariablePayload(
          agentVariables,
          previewVariableValues,
        ),
      });
      if (wasCancelled()) {
        localTrack.stop();
        localTrackRef.current = null;
        return;
      }
      setPreview(session);
      setState("connecting");
      addEvent("Session", "Temporary LiveKit room created.");

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });
      roomRef.current = room;

      room
        .on(RoomEvent.TrackSubscribed, (track) => {
          attachRemoteAudio(track);
          if (track.kind === Track.Kind.Audio) {
            addEvent("Agent audio", "Agent audio connected.");
          }
        })
        .on(RoomEvent.TrackUnsubscribed, (track) => {
          track.detach().forEach((element) => element.remove());
        })
        .on(RoomEvent.Disconnected, () => {
          if (roomRef.current !== room) return;
          previewAttemptRef.current += 1;
          localTrackRef.current?.stop();
          localTrackRef.current = null;
          roomRef.current = null;
          cleanupAudioElements();
          setState((current) => (current === "live" ? "ended" : current));
        })
        .on(RoomEvent.Reconnecting, () => {
          setState("connecting");
          addEvent("Network", "Reconnecting to preview room.");
        })
        .on(RoomEvent.Reconnected, () => {
          setState("live");
          addEvent("Network", "Preview room reconnected.");
        });

      const transcriptionEvent = (
        RoomEvent as unknown as { TranscriptionReceived?: RoomEvent }
      ).TranscriptionReceived;
      if (transcriptionEvent) {
        room.on(transcriptionEvent, handleLiveKitTranscript);
      }
      room.on(RoomEvent.DataReceived, handleLiveKitData);
      room.registerTextStreamHandler(TRANSCRIPTION_TOPIC, (reader, participant) => {
        const attributes = reader.info.attributes ?? {};
        const segmentId = String(
          attributes["lk.segment_id"] || reader.info.id || Date.now(),
        );
        void (async () => {
          let raw = "";
          for await (const chunk of reader) {
            raw += chunk;
            const text = visibleTranscriptionText(raw);
            if (!text) continue;
            upsertConversationMessage(
              segmentId,
              transcriptionRole(
                participant.identity,
                attributes["lk.transcribed_track_id"],
                room.localParticipant.identity,
                localPublicationSidRef.current,
              ),
              text,
              false,
            );
          }
          const text = visibleTranscriptionText(raw);
          if (!text) return;
          const finalAttributes = reader.info.attributes ?? attributes;
          upsertConversationMessage(
            segmentId,
            transcriptionRole(
              participant.identity,
              finalAttributes["lk.transcribed_track_id"],
              room.localParticipant.identity,
              localPublicationSidRef.current,
            ),
            text,
            finalAttributes["lk.transcription_final"] !== "false",
          );
        })();
      });

      await room.connect(session.livekitUrl, session.participant.token);
      if (wasCancelled()) {
        localTrack.stop();
        localTrackRef.current = null;
        room.disconnect();
        return;
      }
      const publication = await room.localParticipant.publishTrack(localTrack, {
        source: Track.Source.Microphone,
      });
      localPublicationSidRef.current = publication.trackSid;
      if (wasCancelled()) {
        localTrack.stop();
        localTrackRef.current = null;
        room.disconnect();
        return;
      }
      setState("live");
      addEvent("Live", "Speak naturally. The agent can hear your microphone.");
    } catch (err) {
      if (wasCancelled()) return;
      localTrack?.stop();
      localTrackRef.current = null;
      await endPreview();
      setState("error");
      setError(formatMicrophoneError(err));
    }
  }

  async function toggleMute() {
    const track = localTrackRef.current;
    if (!track) return;
    if (muted) {
      await track.unmute();
      setMuted(false);
      addEvent("Microphone", "Microphone unmuted.");
    } else {
      await track.mute();
      setMuted(true);
      addEvent("Microphone", "Microphone muted.");
    }
  }

  const isBusy =
    state === "requesting" || state === "connecting" || createPreview.isPending;
  const isLive = state === "live";

  useEffect(() => {
    const track = localTrackRef.current;
    if (!isLive || !track) {
      setMicLevel(0);
      return;
    }
    return observePreviewMicrophoneLevel(track, setMicLevel);
  }, [isLive]);
  const isInConversation = Boolean(preview) || isLive;
  const expiresAt = preview?.expiresAt
    ? new Date(preview.expiresAt).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          void endPreview();
        }
        onOpenChange(nextOpen);
      }}
    >
      <SheetContent className="w-full gap-0 overflow-hidden p-0 sm:max-w-[480px]">
        <SheetHeader className="border-b bg-background px-5 py-4">
          <div className="flex items-start justify-between gap-4 pr-10">
            <div className="min-w-0">
              <SheetTitle className="flex items-center gap-2 text-base">
                <span className="flex size-8 shrink-0 items-center justify-center border bg-muted text-muted-foreground">
                  <Radio className="size-4" />
                </span>
                <span className="truncate">Agent preview</span>
              </SheetTitle>
              <SheetDescription className="mt-1 truncate">
                {agentName}
              </SheetDescription>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 border-border bg-muted/50 text-xs",
                isLive &&
                  "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                state === "error" &&
                  "border-destructive/30 bg-destructive/10 text-destructive",
              )}
            >
              {statusCopy[state]}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col bg-background">
          {!isInConversation ? (
            <div className="border-b bg-muted/20 px-5 py-5 dark:bg-muted/10">
              <div className="relative overflow-hidden border bg-card p-5 shadow-sm">
                <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,hsl(var(--primary)),#10b981,#f59e0b)]" />
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Realtime voice
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {isLive
                        ? "Conversation active"
                        : "Test before callers do"}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex size-14 shrink-0 items-center justify-center border bg-background text-muted-foreground shadow-inner",
                      isLive &&
                        "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                    )}
                  >
                    {isBusy ? (
                      <Loader2 className="size-6 animate-spin" />
                    ) : isLive ? (
                      <PhoneCall className="size-6" />
                    ) : (
                      <Sparkles className="size-6" />
                    )}
                  </div>
                </div>

                <div
                  className="mt-6 flex h-16 items-end gap-1.5"
                  aria-hidden="true"
                >
                  {[35, 58, 42, 74, 50, 90, 46, 68, 38, 80, 52, 64].map(
                    (height, index) => (
                      <span
                        key={index}
                        className={cn(
                          "w-full bg-muted-foreground/20 transition-colors",
                          isLive &&
                            "animate-pulse bg-emerald-500/50 dark:bg-emerald-300/50",
                        )}
                        style={{
                          height: `${height}%`,
                          animationDelay: `${index * 80}ms`,
                        }}
                      />
                    ),
                  )}
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  {expiresAt
                    ? `Temporary preview access expires around ${expiresAt}.`
                    : "Starts a temporary 3-hour LiveKit preview room."}
                </p>
              </div>

              <div className="mt-4">
                <DynamicVariableInputs
                  variableNames={previewVariableNames}
                  values={previewVariableValues}
                  placeholders={agentVariables.placeholders}
                  title="Preview variables"
                  description="Values entered here are used for this preview session and override saved fallback values."
                  disabled={isBusy}
                  idPrefix="preview-variable"
                  onValuesChange={setPreviewVariableValues}
                />
              </div>
            </div>
          ) : (
            <div className="border-b bg-muted/20 px-5 py-4 dark:bg-muted/10">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Conversation
                  </p>
                  <p className="mt-1 truncate text-base font-semibold text-foreground">
                    {isLive ? "Call started" : "Preparing preview"}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center border bg-background text-muted-foreground",
                    isLive &&
                      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                  )}
                >
                  {isBusy ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <MessageCircle className="size-5" />
                  )}
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {expiresAt
                  ? `Preview access expires around ${expiresAt}.`
                  : "Temporary LiveKit room is starting."}
              </p>
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            {error ? (
              <div className="border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            {!isInConversation ? (
              <div className="space-y-3">
                {events.length === 0 ? (
                  <div className="border bg-muted/20 p-4 text-sm text-muted-foreground">
                    Start a preview to open your microphone and talk with this
                    agent in real time.
                  </div>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="border bg-card p-3 text-sm shadow-sm"
                    >
                      <p className="font-medium text-foreground">
                        {event.label}
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        {event.detail}
                      </p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex min-h-full flex-col justify-end gap-3">
                {conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "max-w-[85%] px-3 py-2 text-sm leading-relaxed shadow-sm",
                      message.role === "user" &&
                        "ml-auto rounded-2xl rounded-br-md bg-primary text-primary-foreground",
                      message.role === "agent" &&
                        "mr-auto rounded-2xl rounded-bl-md border bg-card text-foreground",
                      message.role === "system" &&
                        "mx-auto rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground",
                      message.pending && "opacity-80",
                    )}
                  >
                    {message.text}
                  </div>
                ))}
                {conversationMessages.length === 1 ? (
                  <div className="mx-auto max-w-xs text-center text-xs text-muted-foreground">
                    Speak naturally. Your words and the agent reply appear here as they are recognized.
                  </div>
                ) : null}
              </div>
            )}
            <div ref={remoteAudioRef} className="hidden" />
          </div>
        </div>

        <SheetFooter className="border-t bg-background p-4">
          {isLive ? (
            <div className="flex w-full flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-xs text-muted-foreground">
                  Mic level
                </span>
                <div className="h-1.5 flex-1 bg-muted">
                  <div
                    className={cn(
                      "h-full",
                      micLevel > 0.02 ? "bg-emerald-500" : "bg-amber-500",
                    )}
                    style={{ width: `${Math.min(100, Math.round(micLevel * 400))}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={toggleMute}>
                {muted ? <Mic /> : <MicOff />}
                {muted ? "Unmute" : "Mute"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  void endPreview();
                }}
              >
                <PhoneOff /> End
              </Button>
            </div>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={() => {
                void startPreview();
              }}
              disabled={isBusy}
            >
              {isBusy ? (
                <>
                  <Loader2 className="animate-spin" /> Starting
                </>
              ) : state === "ended" || state === "error" ? (
                <>
                  <RotateCcw /> Start new preview
                </>
              ) : (
                <>
                  <Mic /> Start preview
                </>
              )}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
