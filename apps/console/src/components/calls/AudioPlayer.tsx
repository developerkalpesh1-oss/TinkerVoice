"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Music, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { callsApi } from "@/src/lib/api/resources/calls";

function formatTime(seconds: number) {
    const whole = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
    return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

function readableDuration(audio: HTMLAudioElement | null, fallbackSeconds: number | null | undefined) {
    const mediaDuration = audio?.duration;
    if (typeof mediaDuration === "number" && Number.isFinite(mediaDuration) && mediaDuration > 0) {
        return mediaDuration;
    }
    if (typeof fallbackSeconds === "number" && Number.isFinite(fallbackSeconds) && fallbackSeconds > 0) {
        return fallbackSeconds;
    }
    return 0;
}

export function AudioPlayer({
    src,
    callId,
    durationSeconds = null,
}: {
    src: string | null;
    callId: string;
    durationSeconds?: number | null;
}) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const objectUrlRef = useRef<string | null>(null);
    const [playbackSrc, setPlaybackSrc] = useState<string | null>(null);
    const [playingSrc, setPlayingSrc] = useState<string | null>(null);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(() =>
        typeof durationSeconds === "number" && durationSeconds > 0 ? durationSeconds : 0,
    );
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState(false);
    const hasRecording = Boolean(src && callId);
    const playing = Boolean(playbackSrc && playingSrc === playbackSrc);

    useEffect(() => {
        setPosition(0);
        setPlayingSrc(null);
        setLoadError(false);
        setDuration(
            typeof durationSeconds === "number" && durationSeconds > 0 ? durationSeconds : 0,
        );
    }, [src, callId, durationSeconds]);

    useEffect(() => {
        let cancelled = false;
        if (!hasRecording) {
            setPlaybackSrc(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setLoadError(false);
        void (async () => {
            try {
                // Authenticated API stream — never load object-storage URLs in the browser.
                const blob = await callsApi.recordingBlob(callId);
                if (cancelled) return;
                if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
                const objectUrl = URL.createObjectURL(blob);
                objectUrlRef.current = objectUrl;
                setPlaybackSrc(objectUrl);
                setLoadError(false);
            } catch {
                if (cancelled) return;
                setPlaybackSrc(null);
                setLoadError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
        };
    }, [callId, hasRecording, src]);

    function refreshDuration() {
        setDuration(readableDuration(audioRef.current, durationSeconds));
    }

    function seekTo(seconds: number) {
        const audio = audioRef.current;
        if (!audio) return;
        const max = readableDuration(audio, durationSeconds);
        if (!(max > 0)) return;
        audio.currentTime = Math.max(0, Math.min(seconds, max));
        setPosition(audio.currentTime);
    }

    function skipBy(seconds: number) {
        if (audioRef.current) seekTo(audioRef.current.currentTime + seconds);
    }

    async function togglePlayback() {
        const audio = audioRef.current;
        if (!audio || !playbackSrc) return;

        if (playing) {
            audio.pause();
            setPlayingSrc(null);
            return;
        }

        try {
            if (audio.ended) seekTo(0);
            await audio.play();
            setPlayingSrc(playbackSrc);
            setLoadError(false);
            refreshDuration();
        } catch {
            setPlayingSrc(null);
            setLoadError(true);
        }
    }

    async function replay() {
        const audio = audioRef.current;
        if (!audio || !playbackSrc) return;
        seekTo(0);
        try {
            await audio.play();
            setPlayingSrc(playbackSrc);
            setLoadError(false);
            refreshDuration();
        } catch {
            setPlayingSrc(null);
            setLoadError(true);
        }
    }

    async function download() {
        setDownloading(true);
        setDownloadError(false);
        try {
            const blob = await callsApi.recordingBlob(callId, { disposition: "attachment" });
            const objectUrl = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = objectUrl;
            anchor.download = `recording-${callId}.ogg`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(objectUrl);
        } catch {
            setDownloadError(true);
        } finally {
            setDownloading(false);
        }
    }

    if (!hasRecording) {
        return (
            <div className="rounded-2xl border bg-background p-5 text-sm text-muted-foreground shadow-sm">
                <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Music className="size-5" />
                </div>
                <p className="font-medium text-foreground">No recording available</p>
                <p className="mt-1 leading-relaxed">This call does not have an audio file attached.</p>
            </div>
        );
    }

    const canSeek = duration > 0 && Boolean(playbackSrc) && !loadError;
    const canPlay = Boolean(playbackSrc) && !loading && !loadError;

    return (
        <div className="rounded-2xl border bg-background p-5 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <Music className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">Recording</p>
                    <p className="mt-1 text-xs text-muted-foreground">Listen to the captured call audio or download it for review.</p>
                </div>
            </div>
            <div className="mt-5 space-y-2">
                <input
                    type="range"
                    min={0}
                    max={duration || 1}
                    step={0.1}
                    value={Math.min(position, duration || 0)}
                    onChange={(event) => seekTo(Number(event.target.value))}
                    disabled={!canSeek}
                    aria-label="Recording position"
                    aria-valuetext={`${formatTime(position)} of ${formatTime(duration)}`}
                    className="h-6 w-full cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
                />
                <div className="flex justify-between text-xs tabular-nums text-muted-foreground">
                    <span>{formatTime(position)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs text-muted-foreground">
                <div className="flex flex-col items-center gap-1">
                    <Button type="button" variant="outline" size="icon" disabled={!canSeek} onClick={() => skipBy(-10)} aria-label="Back 10 seconds" title="Back 10 seconds">
                        <SkipBack />
                    </Button>
                    <span>Back 10s</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Button type="button" size="icon" onClick={togglePlayback} disabled={!canPlay} aria-label={playing ? "Pause recording" : "Play recording"} title={playing ? "Pause" : "Play"}>
                        {playing ? <Pause /> : <Play />}
                    </Button>
                    <span>{loading ? "Loading…" : playing ? "Pause" : "Play"}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Button type="button" variant="outline" size="icon" disabled={!canSeek} onClick={() => skipBy(10)} aria-label="Forward 10 seconds" title="Forward 10 seconds">
                        <SkipForward />
                    </Button>
                    <span>Forward 10s</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Button type="button" variant="outline" size="icon" disabled={!canPlay} onClick={replay} aria-label="Replay recording" title="Replay from start">
                        <RotateCcw />
                    </Button>
                    <span>Replay</span>
                </div>
            </div>
            <div className="mt-4">
                <Button type="button" variant="outline" className="w-full justify-center" onClick={download} disabled={downloading}>
                    <Download />
                    {downloading ? "Preparing download…" : "Download"}
                </Button>
                {downloadError && <p role="alert" className="mt-2 text-xs text-destructive">Could not download the recording. Please try again.</p>}
                {loadError && <p role="alert" className="mt-2 text-xs text-destructive">Could not play this recording. The audio file may be missing from storage.</p>}
            </div>
            {playbackSrc ? (
                <audio
                    ref={audioRef}
                    src={playbackSrc}
                    preload="auto"
                    onLoadedMetadata={(event) => {
                        setDuration(readableDuration(event.currentTarget, durationSeconds));
                    }}
                    onDurationChange={(event) => {
                        setDuration(readableDuration(event.currentTarget, durationSeconds));
                    }}
                    onCanPlay={(event) => {
                        setDuration(readableDuration(event.currentTarget, durationSeconds));
                    }}
                    onTimeUpdate={(event) => setPosition(event.currentTarget.currentTime)}
                    onSeeked={(event) => setPosition(event.currentTarget.currentTime)}
                    onEnded={() => setPlayingSrc(null)}
                    onPause={() => setPlayingSrc(null)}
                    onPlay={() => setPlayingSrc(playbackSrc)}
                    onError={() => {
                        setPlayingSrc(null);
                        setLoadError(true);
                    }}
                />
            ) : null}
        </div>
    );
}
