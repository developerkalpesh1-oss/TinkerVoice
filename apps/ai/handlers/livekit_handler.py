from utils.logger import logger, redact_sensitive
from utils.metrics import emit_metric
import asyncio
import os
import time
import uuid
from pathlib import Path
from typing import Any


def recording_path(recording_id):
    return f"Voice-agents/Recordings/{recording_id}.ogg"


def _is_placeholder_credential(value: str | None) -> bool:
    if not value:
        return True
    normalized = value.strip().lower()
    return (
        not normalized
        or normalized.startswith("dev-")
        or "changeme" in normalized
        or "your-" in normalized
        or "example" in normalized
        or normalized == "placeholder"
    )


def recording_storage_mode() -> str:
    """Return ``local`` or ``s3``. Defaults to local when AWS credentials are unset."""
    explicit = (os.getenv("RECORDING_STORAGE") or "").strip().lower()
    if explicit in {"local", "s3"}:
        return explicit
    access_key = os.getenv("AWS_ACCESS_KEY_ID") or os.getenv("ACCESS_KEY")
    secret = os.getenv("AWS_SECRET_ACCESS_KEY") or os.getenv("SECRET_ACCESS_KEY")
    if (
        access_key
        and secret
        and not _is_placeholder_credential(access_key)
        and not _is_placeholder_credential(secret)
    ):
        return "s3"
    return "local"


def local_recording_root() -> Path:
    configured = (os.getenv("RECORDING_LOCAL_DIR") or "").strip()
    if configured:
        return Path(configured).expanduser().resolve()
    # apps/ai/handlers -> repo root
    return (Path(__file__).resolve().parents[3] / ".data" / "recordings").resolve()


def local_recording_abspath(key: str) -> Path:
    root = local_recording_root()
    path = (root / key).resolve()
    if path != root and root not in path.parents:
        raise RuntimeError("Invalid recording path")
    return path


def get_recording_storage_config():
    config = {
        "bucket": os.getenv("S3_BUCKET_NAME") or os.getenv("BUCKET"),
        "region": os.getenv("AWS_REGION") or os.getenv("REGION") or os.getenv("AWS_DEFAULT_REGION") or "us-east-1",
    }
    missing = [key for key in ("bucket", "region") if not config[key]]
    if missing:
        raise RuntimeError(f"Missing recording storage env: {', '.join(missing)}")
    access_key = os.getenv("AWS_ACCESS_KEY_ID") or os.getenv("ACCESS_KEY")
    secret = os.getenv("AWS_SECRET_ACCESS_KEY") or os.getenv("SECRET_ACCESS_KEY")
    # Ignore bootstrap placeholders so LiveKit/ECS role credentials can be used.
    if _is_placeholder_credential(access_key) and _is_placeholder_credential(secret):
        access_key = None
        secret = None
    if access_key or secret:
        if not access_key:
            raise RuntimeError("AWS_ACCESS_KEY_ID is required when AWS_SECRET_ACCESS_KEY is set")
        if not secret:
            raise RuntimeError("AWS_SECRET_ACCESS_KEY is required when AWS_ACCESS_KEY_ID is set")
        if _is_placeholder_credential(access_key) or _is_placeholder_credential(secret):
            raise RuntimeError("Replace placeholder AWS credentials before enabling call recordings")
        config["access_key"] = access_key
        config["secret"] = secret
        session_token = os.getenv("AWS_SESSION_TOKEN")
        if session_token and not _is_placeholder_credential(session_token):
            config["session_token"] = session_token
    return config


class LocalCallRecorder:
    """Capture mixed call audio to the shared local recordings directory."""

    def __init__(self, session: Any):
        self.session = session
        self.recording_id = str(uuid.uuid4())
        self.key = recording_path(self.recording_id)
        self._recorder: Any = None

    async def start(self) -> dict[str, str]:
        from livekit.agents.voice.recorder_io import RecorderIO

        input_audio = getattr(getattr(self.session, "input", None), "audio", None)
        output_audio = getattr(getattr(self.session, "output", None), "audio", None)
        if input_audio is None or output_audio is None:
            raise RuntimeError("Session audio I/O is not ready for local recording")
        recorder = RecorderIO(agent_session=self.session)
        self.session.input.audio = recorder.record_input(input_audio)
        self.session.output.audio = recorder.record_output(output_audio)
        output_path = local_recording_abspath(self.key)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        await recorder.start(output_path=output_path)
        self._recorder = recorder
        emit_metric("recording_start", status="ok", backend="local", room="")
        logger.info("[RECORDING] Local recorder active: {}", self.key)
        return {"recording_id": self.recording_id, "mode": "local", "key": self.key}

    async def finalize(self) -> str | None:
        if self._recorder is not None:
            try:
                await self._recorder.aclose()
            except Exception as error:
                logger.warning(
                    "[RECORDING] Local recorder close failed: {}",
                    redact_sensitive(str(error)),
                )
            self._recorder = None
        path = local_recording_abspath(self.key)
        if path.is_file() and path.stat().st_size > 0:
            logger.info(
                "[RECORDING] Local file ready: {} ({} bytes)",
                self.key,
                path.stat().st_size,
            )
            return self.key
        logger.warning("[RECORDING] Local recording missing or empty: {}", self.key)
        return None


def get_transcripts(agent):
    
    try:
        messages = agent.chat_ctx.messages
        if callable(messages):
            messages = messages()
        transcript = []
        for msg in messages:
            if getattr(msg, "role", None) in ("user", "assistant"):
                content = getattr(msg, "content", "")
                if isinstance(content, list):
                    content = " ".join(str(c) for c in content if isinstance(c, str))
                transcript.append({"role": msg.role, "content": content,"time": msg.created_at})
        logger.info("[TRANSCRIPT] collected {} messages", len(transcript))
    except Exception as e:
        logger.error("[SHUTDOWN] Transcript read failed: {}", redact_sensitive(str(e)))
        transcript = []
    return transcript

async def start_recording(ctx: Any, *, timeout_seconds: float = 10):
    # ── Recording → S3 Storage ─────────────────────────────────────
    from livekit import api  # type: ignore

    egress_id = None
    recording_active = False
    started_at = time.monotonic()
    recording_id = str(uuid.uuid4())
    rec_api = None
    try:
        storage = get_recording_storage_config()
        if not storage.get("access_key") or not storage.get("secret"):
            raise RuntimeError(
                "AWS credentials required for call recording uploads "
                "(set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY)"
            )
        s3_upload_kwargs = {
            "bucket": storage["bucket"],
            "region": storage["region"],
            "access_key": storage["access_key"],
            "secret": storage["secret"],
        }
        if storage.get("session_token"):
            s3_upload_kwargs["session_token"] = storage["session_token"]
        rec_api = api.LiveKitAPI(
            url=os.environ["LIVEKIT_URL"],
            api_key=os.environ["LIVEKIT_API_KEY"],
            api_secret=os.environ["LIVEKIT_API_SECRET"],
        )
        async with asyncio.timeout(timeout_seconds):
            egress_resp = await rec_api.egress.start_room_composite_egress(
                api.RoomCompositeEgressRequest(
                    room_name=ctx.room.name,
                    audio_only=True,
                    file_outputs=[
                        api.EncodedFileOutput(
                            file_type=api.EncodedFileType.OGG,
                            filepath=recording_path(recording_id),
                            s3=api.S3Upload(**s3_upload_kwargs),
                        )
                    ],
                )
            )
            egress_id = egress_resp.egress_id
            # A successful start RPC can return EGRESS_STARTING, before capture.
            # https://docs.livekit.io/reference/other/egress/api/
            while egress_resp.status != api.EGRESS_ACTIVE:
                if egress_resp.status != api.EGRESS_STARTING:
                    raise RuntimeError("Recording ended before becoming active")
                # ponytail: at most 50 polls at the default deadline; use egress
                # webhooks if recording-start volume outgrows this bounded poll.
                await asyncio.sleep(0.2)
                response = await rec_api.egress.list_egress(api.ListEgressRequest(egress_id=egress_id))
                egress_resp = next((item for item in response.items if item.egress_id == egress_id), egress_resp)
            recording_active = True
        startup_ms = round((time.monotonic() - started_at) * 1000)
        emit_metric("recording_start", status="ok", startup_ms=startup_ms, room=getattr(ctx.room, "name", ""))
        logger.info("[RECORDING] Egress active: {} (startup_ms={})", egress_id, startup_ms)
        return {"recording_id": recording_id, "egress_id": egress_id}
    except Exception as e:
        emit_metric("recording_start", status="error", room=getattr(ctx.room, "name", ""))
        logger.warning("[RECORDING] Failed to start recording ({}): {}", type(e).__name__, redact_sensitive(str(e)))
        return None
    finally:
        if rec_api is not None:
            if egress_id and not recording_active:
                try:
                    await asyncio.wait_for(
                        rec_api.egress.stop_egress(api.StopEgressRequest(egress_id=egress_id)),
                        timeout=2,
                    )
                except Exception as stop_error:
                    logger.warning("[RECORDING] Failed to stop pending egress: {}", redact_sensitive(str(stop_error)))
            try:
                await rec_api.aclose()
            except Exception as close_error:
                logger.warning("[RECORDING] Failed to close LiveKit API client: {}", redact_sensitive(str(close_error)))


async def resolve_uploaded_recording_path(
    recording: dict[str, str] | str | None,
    *,
    timeout_seconds: float = 45,
) -> str | None:
    """Confirm a local file or finished S3 egress before attaching the recording path."""
    from livekit import api  # type: ignore

    if recording is None:
        return None
    if isinstance(recording, str):
        # Legacy callers / tests still pass a bare recording id.
        return recording_path(recording)

    if recording.get("mode") == "local":
        key = recording.get("key") or recording_path(str(recording.get("recording_id") or ""))
        if not key:
            return None
        path = local_recording_abspath(key)
        return key if path.is_file() and path.stat().st_size > 0 else None

    recording_id = recording.get("recording_id")
    egress_id = recording.get("egress_id")
    if not recording_id or not egress_id:
        return None

    expected_path = recording_path(recording_id)
    rec_api = api.LiveKitAPI(
        url=os.environ["LIVEKIT_URL"],
        api_key=os.environ["LIVEKIT_API_KEY"],
        api_secret=os.environ["LIVEKIT_API_SECRET"],
    )
    try:
        deadline = time.monotonic() + timeout_seconds
        while True:
            response = await rec_api.egress.list_egress(api.ListEgressRequest(egress_id=egress_id))
            info = next((item for item in response.items if item.egress_id == egress_id), None)
            if info is None:
                logger.warning("[RECORDING] Egress {} disappeared before upload confirmation", egress_id)
                return None
            status = info.status
            if status == api.EGRESS_COMPLETE:
                files = list(getattr(info, "file_results", None) or [])
                if not files:
                    logger.warning("[RECORDING] Egress {} completed without a file", egress_id)
                    return None
                filename = getattr(files[0], "filename", None) or expected_path
                logger.info("[RECORDING] Upload confirmed: {}", filename)
                return filename
            if status in {
                api.EGRESS_FAILED,
                api.EGRESS_ABORTED,
                api.EGRESS_LIMIT_REACHED,
            }:
                logger.warning(
                    "[RECORDING] Egress {} ended without upload status={} error={}",
                    egress_id,
                    status,
                    redact_sensitive(str(getattr(info, "error", "") or "")),
                )
                return None
            if time.monotonic() >= deadline:
                logger.warning("[RECORDING] Timed out waiting for egress {} upload", egress_id)
                return None
            await asyncio.sleep(0.5)
    except Exception as error:
        logger.warning(
            "[RECORDING] Failed confirming egress upload ({}): {}",
            type(error).__name__,
            redact_sensitive(str(error)),
        )
        return None
    finally:
        try:
            await rec_api.aclose()
        except Exception as close_error:
            logger.warning("[RECORDING] Failed to close LiveKit API client: {}", redact_sensitive(str(close_error)))
