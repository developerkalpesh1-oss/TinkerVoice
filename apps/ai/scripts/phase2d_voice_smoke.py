#!/usr/bin/env python3
from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from handlers.voice_e2e_smoke import SmokeSettings, run_voice_smoke


def main() -> int:
    args = parse_args()
    load_default_env(args.env_file)

    run_id = f"phase2d-{int(time.time())}"
    config = json.loads(args.config_json) if args.config_json else {}
    if not config:
        config = default_smoke_voice_config(args.probe_language)
    settings = SmokeSettings(
        api_base_url=args.api_base_url,
        internal_api_key=required_env("INTERNAL_API_KEY"),
        livekit_api_key=required_env("LIVEKIT_API_KEY"),
        livekit_api_secret=required_env("LIVEKIT_API_SECRET"),
        participant_identity=args.participant_identity or run_id,
        participant_name=args.participant_name,
        probe_text=args.probe_text,
        config=config,
        metadata={"run_id": run_id},
        probe_wav_path=args.probe_wav,
        elevenlabs_api_key=os.getenv("ELEVENLABS_API_KEY") or None,
        elevenlabs_voice_id=os.getenv("ELEVENLABS_DEFAULT_VOICE_ID") or None,
        elevenlabs_model=os.getenv("ELEVENLABS_DEFAULT_MODEL", "eleven_flash_v2_5")
        or "eleven_flash_v2_5",
        elevenlabs_language=args.probe_language,
        wait_timeout_seconds=args.timeout,
        min_agent_audio_frames=args.min_agent_audio_frames,
        cleanup=not args.no_cleanup,
    )

    evidence = asyncio.run(run_voice_smoke(settings))
    print(json.dumps(evidence.to_dict(), indent=2, sort_keys=True))
    return 0 if evidence.success else 1


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the TinkerVoice Phase 2D LiveKit voice smoke.")
    parser.add_argument(
        "--api-base-url",
        default=os.getenv("AI_API_BASE_URL", "http://localhost:5555"),
    )
    parser.add_argument("--env-file", help="Optional KEY=VALUE env file to load before running.")
    parser.add_argument("--participant-identity")
    parser.add_argument("--participant-name", default="Phase 2D Smoke")
    parser.add_argument(
        "--probe-text",
        default="Hello, please reply with one short sentence.",
    )
    parser.add_argument(
        "--probe-language",
        default=os.getenv("ELEVENLABS_DEFAULT_LANGUAGE", "en"),
    )
    parser.add_argument("--probe-wav", help="Optional 16-bit PCM WAV file to publish instead of generated speech.")
    parser.add_argument("--config-json", help="Optional session config JSON.")
    parser.add_argument("--timeout", type=float, default=90.0)
    parser.add_argument("--min-agent-audio-frames", type=int, default=3)
    parser.add_argument("--no-cleanup", action="store_true", help="Leave the dispatch and room in LiveKit.")
    return parser.parse_args()


def load_default_env(env_file: str | None) -> None:
    if env_file:
        load_env_file(env_file)
        return
    default_env = Path(__file__).resolve().parents[1] / ".env.dev"
    if default_env.exists():
        load_env_file(str(default_env))


def load_env_file(path: str) -> None:
    for raw_line in Path(path).read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[len("export ") :]
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if not key:
            continue
        # Allow a later non-empty file value to replace an earlier empty one.
        # Never overwrite a non-empty process environment variable.
        current = os.environ.get(key)
        if current is None or (not current and value):
            os.environ[key] = value


def default_smoke_voice_config(language: str) -> dict:
    """Prefer ElevenLabs when configured so smoke does not depend on Deepgram defaults."""
    voice_id = (os.getenv("ELEVENLABS_DEFAULT_VOICE_ID") or "").strip()
    api_key = (os.getenv("ELEVENLABS_API_KEY") or "").strip()
    if not api_key or not voice_id:
        return {}
    model = (os.getenv("ELEVENLABS_DEFAULT_MODEL") or "eleven_flash_v2_5").strip()
    return {
        "language": language,
        "tts": {
            "provider": "elevenlabs",
            "model": model,
            "voice": voice_id,
        },
    }


def required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise SystemExit(f"{name} is required")
    return value


if __name__ == "__main__":
    sys.exit(main())
