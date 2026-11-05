import {
  createLocalAudioTrack,
  type AudioCaptureOptions,
  type LocalAudioTrack,
} from "livekit-client";

export type PreviewMicrophone = {
  track: LocalAudioTrack;
  deviceLabel: string;
  fallbackUsed: boolean;
};

type ProgressCallback = (detail: string) => void;

/**
 * Acquire a LiveKit local audio track with permission probing, device
 * enumeration, and progressive constraint fallbacks. Stale/missing deviceIds
 * and overly strict audio processing constraints are the usual causes of
 * Chrome's "Requested device not found" (NotFoundError).
 */
export async function acquirePreviewMicrophone(
  onProgress?: ProgressCallback,
): Promise<PreviewMicrophone> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    throw new Error("This browser does not expose microphone access.");
  }

  onProgress?.("Checking microphone permission.");
  const openedDeviceId = await probeMicrophonePermission();

  onProgress?.("Looking for available microphones.");
  const inputs = await listAudioInputDevices();
  if (inputs.length === 0) {
    throw new Error(
      "No microphone was found. Connect a mic, check OS privacy settings, and try again.",
    );
  }

  const preferred = pickPreferredInput(inputs, openedDeviceId);
  const attempts = buildCaptureAttempts(inputs, preferred);

  let lastError: unknown;
  for (let index = 0; index < attempts.length; index += 1) {
    const attempt = attempts[index]!;
    onProgress?.(
      index === 0
        ? `Opening ${attempt.deviceLabel}.`
        : `Retrying with ${attempt.label}.`,
    );
    try {
      const track = await createLocalAudioTrack(attempt.options);
      return {
        track,
        deviceLabel: attempt.deviceLabel,
        fallbackUsed: index > 0,
      };
    } catch (error) {
      lastError = error;
      if (!isRetryableMicrophoneError(error)) {
        throw error;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Could not open a microphone.");
}

export function formatMicrophoneError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Could not start the live preview.";
  }

  const name = "name" in error ? String((error as { name?: string }).name) : "";
  const message = error.message || "";
  const combined = `${name} ${message}`.toLowerCase();

  if (
    name === "NotAllowedError" ||
    name === "PermissionDeniedError" ||
    combined.includes("permission")
  ) {
    return "Microphone permission was blocked. Allow mic access for this site and try again.";
  }

  if (
    name === "NotFoundError" ||
    name === "DevicesNotFoundError" ||
    combined.includes("requested device not found") ||
    combined.includes("device not found")
  ) {
    return "No usable microphone was found. Plug in a mic, pick it as the system default, then retry.";
  }

  if (
    name === "NotReadableError" ||
    name === "TrackStartError" ||
    combined.includes("could not start audio source")
  ) {
    return "The microphone is in use by another app. Close other calls or recording tools and retry.";
  }

  if (name === "OverconstrainedError" || combined.includes("overconstrained")) {
    return "This microphone rejected the audio settings. Retry with a different mic if available.";
  }

  if (name === "SecurityError") {
    return "Microphone access requires a secure context (HTTPS or localhost).";
  }

  return message || "Could not start the live preview.";
}

async function probeMicrophonePermission(): Promise<string | undefined> {
  let stream: MediaStream | undefined;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return stream.getAudioTracks()[0]?.getSettings?.().deviceId;
  } catch (error) {
    throw Object.assign(
      new Error(formatMicrophoneError(error)),
      error instanceof Error ? { name: error.name, cause: error } : {},
    );
  } finally {
    stream?.getTracks().forEach((track) => track.stop());
  }
}

async function listAudioInputDevices(): Promise<MediaDeviceInfo[]> {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const inputs = devices.filter(
    (device) =>
      device.kind === "audioinput" &&
      typeof device.deviceId === "string" &&
      device.deviceId.length > 0,
  );
  // Prefer concrete hardware IDs. Chrome's "default" / "communications"
  // aliases often cause NotFoundError when the underlying device disappeared.
  const concrete = inputs.filter(
    (device) =>
      device.deviceId !== "default" && device.deviceId !== "communications",
  );
  return concrete.length > 0 ? concrete : inputs;
}

function pickPreferredInput(
  inputs: MediaDeviceInfo[],
  openedDeviceId?: string,
): MediaDeviceInfo {
  const usable = inputs.filter((device) => !isUnusableInputLabel(device.label));
  const pool = usable.length > 0 ? usable : inputs;
  if (openedDeviceId) {
    const opened = pool.find((device) => device.deviceId === openedDeviceId);
    if (opened) return opened;
  }
  return (
    pool.find((device) => /built-?in|internal|usb|headset|mic/i.test(device.label)) ??
    pool[0]!
  );
}

function isUnusableInputLabel(label: string): boolean {
  return /monitor|loopback|virtual|blackhole|null sink|dummy/i.test(label);
}

type CaptureAttempt = {
  label: string;
  deviceLabel: string;
  options: AudioCaptureOptions;
};

function buildCaptureAttempts(
  inputs: MediaDeviceInfo[],
  preferred: MediaDeviceInfo,
): CaptureAttempt[] {
  // Browser echo cancellation on PipeWire often outputs digital silence, so the
  // agent subscribes to a microphone track and still hears nothing. Capture the
  // raw input at 48 kHz. Only switch devices when opening the track throws.
  const spokenDefaults: AudioCaptureOptions = {
    echoCancellation: false,
    noiseSuppression: false,
    autoGainControl: true,
    channelCount: 1,
    sampleRate: 48000,
  };
  const attempts: CaptureAttempt[] = [
    {
      label: "opened microphone",
      deviceLabel: preferred.label || "Microphone",
      options: { ...spokenDefaults, deviceId: preferred.deviceId },
    },
    {
      label: "browser default mic",
      deviceLabel: "Default microphone",
      options: spokenDefaults,
    },
    {
      label: "unconstrained default mic",
      deviceLabel: "Default microphone",
      options: {},
    },
  ];
  for (const input of inputs) {
    if (input.deviceId === preferred.deviceId) continue;
    if (isUnusableInputLabel(input.label)) continue;
    attempts.push({
      label: `fallback device ${input.label || input.deviceId.slice(0, 8)}`,
      deviceLabel: input.label || "Microphone",
      options: { deviceId: input.deviceId, channelCount: 1, sampleRate: 48000 },
    });
  }
  return attempts;
}

export function observePreviewMicrophoneLevel(
  track: LocalAudioTrack,
  onLevel: (level: number) => void,
): () => void {
  const mediaTrack = track.mediaStreamTrack;
  const AudioContextCtor =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!mediaTrack || !AudioContextCtor) return () => {};
  const context = new AudioContextCtor();
  void context.resume();
  const analyser = context.createAnalyser();
  analyser.fftSize = 512;
  const source = context.createMediaStreamSource(new MediaStream([mediaTrack]));
  source.connect(analyser);
  const samples = new Uint8Array(analyser.fftSize);
  let timer = 0;
  const tick = () => {
    analyser.getByteTimeDomainData(samples);
    let peak = 0;
    for (let index = 0; index < samples.length; index += 1) {
      peak = Math.max(peak, Math.abs(samples[index]! - 128));
    }
    onLevel(peak / 128);
    timer = window.setTimeout(tick, 120);
  };
  timer = window.setTimeout(tick, 120);
  return () => {
    window.clearTimeout(timer);
    source.disconnect();
    void context.close();
  };
}

function isRetryableMicrophoneError(error: unknown): boolean {
  if (!(error instanceof Error)) return true;
  const name = "name" in error ? String((error as { name?: string }).name) : "";
  const message = error.message.toLowerCase();
  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return false;
  }
  if (name === "SecurityError") return false;
  return (
    name === "NotFoundError" ||
    name === "DevicesNotFoundError" ||
    name === "OverconstrainedError" ||
    name === "NotReadableError" ||
    message.includes("requested device not found") ||
    message.includes("device not found") ||
    message.includes("overconstrained")
  );
}
