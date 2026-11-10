import logging
import os
from dataclasses import dataclass
from typing import Any

from aiobotocore.session import get_session
from livekit.agents import inference
from livekit.plugins import aws, elevenlabs, sarvam

from handlers.voice_catalog import SCRIBE_AUTO_DETECT_LANGUAGES

logger = logging.getLogger("voice_provider_adapters")


class ProviderAdapterError(RuntimeError):
    pass


@dataclass(frozen=True)
class VoiceProviderAdapters:
    stt: Any
    llm: Any
    tts: Any
    summary: dict[str, str]


def build_voice_provider_adapters(config: dict[str, Any]) -> VoiceProviderAdapters:
    logger.info(
        "building voice provider adapters",
        extra={
            "stt_provider": config["stt"]["provider"],
            "llm_provider": config["llm"]["provider"],
            "tts_provider": config["tts"]["provider"],
            "language": config["language"],
        },
    )

    try:
        stt = _build_stt(
            config["stt"],
            config["stt"].get("language", config["language"]),
            tinkerism_call=bool(config.get("tinkerism_call")),
        )
        logger.info("stt adapter ready: %s/%s", config["stt"]["provider"], config["stt"]["model"])
    except Exception:
        logger.exception("failed to build STT adapter (provider=%s)", config["stt"].get("provider"))
        raise

    try:
        llm = _build_llm(
            config["llm"],
            max_output_tokens=TINKERISM_MAX_COMPLETION_TOKENS if config.get("tinkerism_call") else None,
        )
        logger.info("llm adapter ready: %s/%s", config["llm"]["provider"], config["llm"]["model"])
    except Exception:
        logger.exception("failed to build LLM adapter (provider=%s)", config["llm"].get("provider"))
        raise

    try:
        tts = build_tts_adapter(
            config["tts"],
            config["language"],
            tinkerism_call=bool(config.get("tinkerism_call")),
        )
        logger.info("tts adapter ready: %s/%s", config["tts"]["provider"], config["tts"]["model"])
    except Exception:
        logger.exception("failed to build TTS adapter (provider=%s)", config["tts"].get("provider"))
        raise

    return VoiceProviderAdapters(
        stt=stt,
        llm=llm,
        tts=tts,
        summary={
            "stt_provider": config["stt"]["provider"],
            "stt_model": config["stt"]["model"],
            "llm_provider": config["llm"]["provider"],
            "llm_model": config["llm"]["model"],
            "tts_provider": config["tts"]["provider"],
            "tts_model": config["tts"]["model"],
            "tts_voice": config["tts"]["voice"],
        },
    )


def _build_stt(config: dict[str, Any], language: str, *, tinkerism_call: bool = False):
    provider = config["provider"]
    model = config["model"]
    if provider == "elevenlabs":
        return _build_elevenlabs_stt(model=model, language=language, tinkerism_call=tinkerism_call)
    if provider == "sarvam":
        return sarvam.STT(
            model=model,
            language=_sarvam_language(language),
            api_key=_required_env("SARVAM_API_KEY"),
        )
    if provider == "deepgram":
        raise ProviderAdapterError(
            "Deepgram STT is no longer supported; configure elevenlabs/scribe_v2_realtime"
        )
    raise ProviderAdapterError(f"unsupported STT provider: {provider}")


# Wait for a real pause so the full user thought (incl. Hindi/Marathi) is committed
# before the LLM replies. Other calls keep {}.
TINKERISM_SERVER_VAD = {
    "vad_silence_threshold_secs": 0.45,
    "vad_threshold": 0.4,
    "min_speech_duration_ms": 80,
    "min_silence_duration_ms": 400,
}
TINKERISM_STT_AUDIO_CHUNK_MS = 20
# Ziina: professional Indian English female voice. Flash speaks Hindi with language=hi;
# Marathi works from Devanagari when language_code is omitted (Flash rejects mr).
TINKERISM_VOICE_ID = "FaqthkZu1EWxXxUFbAfb"
# ElevenLabs requires every schedule entry in [50, 500]. Start at the minimum for low TTFB.
TINKERISM_TTS_CHUNK_SCHEDULE = [50, 80, 120, 180]
TINKERISM_MAX_COMPLETION_TOKENS = 140
TINKERISM_LLM_TEMPERATURE = 0.7
TINKERISM_STT_LANGUAGES = ["en", "hi", "mr"]
# Scribe realtime: max 50 keyterms, each at most 20 characters.
TINKERISM_STT_KEYTERMS = [
    "Tinkerism",
    "website",
    "websites",
    "वेबसाइट",
    "साइट",
    "कंपनी",
    "कॉल",
    "नमस्ते",
    "नमस्कार",
    "ठीक है",
    "बिल्कुल",
    "आहे",
    "बरोबर",
    "नक्कीच",
]
TINKERISM_STT_PREVIOUS_TEXT = (
    "Outbound phone call for Tinkerism websites and digital work. "
    "Caller may speak English, Hindi, or Marathi with Indian accents, "
    "including natural code-switching mid-sentence. "
    "Keep recognizing the caller's established language across short fillers."
)


def _build_elevenlabs_stt(*, model: str, language: str, tinkerism_call: bool = False):
    api_key = _required_env("ELEVENLABS_API_KEY")
    runtime_model = model or "scribe_v2_realtime"
    kwargs: dict[str, Any] = {
        "model": runtime_model,
        "api_key": api_key,
        "include_language_detection": True,
        # Server VAD is required for low-latency realtime streaming commits.
        "server_vad": dict(TINKERISM_SERVER_VAD) if tinkerism_call else {},
    }
    if tinkerism_call:
        # Leave language_code unset so Scribe can follow English, Hindi, or Marathi on the same call.
        kwargs["keyterms"] = list(TINKERISM_STT_KEYTERMS)
        kwargs["secondary_languages"] = list(TINKERISM_STT_LANGUAGES)
        kwargs["audio_chunk_duration_ms"] = TINKERISM_STT_AUDIO_CHUNK_MS
        kwargs["previous_text"] = TINKERISM_STT_PREVIOUS_TEXT
        return elevenlabs.STT(**kwargs)

    primary = _elevenlabs_stt_language(language)
    auto_languages = list(SCRIBE_AUTO_DETECT_LANGUAGES)
    if primary in {None, "", "auto", "multi"}:
        # Full automatic language detection with en/hi/mr code-switching support.
        kwargs["secondary_languages"] = auto_languages
    else:
        kwargs["language_code"] = primary
        secondaries = [code for code in auto_languages if code != primary]
        if secondaries:
            kwargs["secondary_languages"] = secondaries

    return elevenlabs.STT(**kwargs)


def _build_llm(config: dict[str, Any], *, max_output_tokens: int | None = None):
    provider = config["provider"]
    if provider == "openai":
        model = str(config["model"]).strip()
        if "/" not in model:
            model = f"openai/{model}"
        extra_kwargs: dict[str, Any] = {}
        if max_output_tokens is not None:
            extra_kwargs["max_completion_tokens"] = max_output_tokens
            extra_kwargs["temperature"] = TINKERISM_LLM_TEMPERATURE
        logger.info("constructing openai LLM via LiveKit Inference (model=%s)", model)
        return inference.LLM(model=model, extra_kwargs=extra_kwargs)

    if provider == "bedrock":
        region = os.getenv("AWS_REGION", "us-east-1")
        access_key = os.getenv("AWS_ACCESS_KEY_ID")
        secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        session_token = os.getenv("AWS_SESSION_TOKEN")

        kwargs: dict[str, Any] = {
            "model": config["model"],
            "region": region,
        }

        if max_output_tokens is not None:
            kwargs["max_output_tokens"] = max_output_tokens

        if access_key or secret_key or session_token:
            if not access_key:
                raise ProviderAdapterError(
                    "AWS_ACCESS_KEY_ID is required when AWS credentials are set"
                )
            if not secret_key:
                raise ProviderAdapterError(
                    "AWS_SECRET_ACCESS_KEY is required when AWS credentials are set"
                )

            if session_token:
                session = get_session()
                session.set_credentials(access_key, secret_key, session_token)
                session.set_config_variable("region", region)
                kwargs["session"] = session
            else:
                kwargs["api_key"] = access_key
                kwargs["api_secret"] = secret_key

        logger.info(
            "constructing bedrock LLM (model=%s, region=%s, using_explicit_creds=%s, has_session_token=%s)",
            kwargs.get("model"),
            region,
            "api_key" in kwargs or "session" in kwargs,
            bool(session_token),
        )
        return aws.LLM(**kwargs)

    raise ProviderAdapterError(f"unsupported LLM provider: {provider}")


# eleven_flash_v2_5 accepts these language_code values on the websocket.
# Marathi audio still works when language_code is omitted; sending "mr" closes
# the socket with 1008 unsupported_language and publishes silence to SIP.
TINKERISM_TTS_LANGUAGE_CODES = {"en": "en", "hi": "hi"}


def build_tts_adapter(config: dict[str, Any], language: str, *, tinkerism_call: bool = False):
    provider = config["provider"]
    model = config["model"]
    voice = TINKERISM_VOICE_ID if tinkerism_call else config["voice"]
    if provider == "elevenlabs":
        kwargs: dict[str, Any] = {
            "model": model,
            "voice_id": voice,
            "api_key": _required_env("ELEVENLABS_API_KEY"),
        }
        # Greeting starts in English. Hindi is applied when the caller speaks Hindi.
        # Marathi must omit language_code (Flash rejects mr).
        resolved_language = "en" if tinkerism_call else _elevenlabs_language(language)
        if resolved_language:
            kwargs["language"] = resolved_language
        if tinkerism_call:
            # Start speaking after the first short token chunk instead of waiting for a full buffer.
            kwargs["chunk_length_schedule"] = list(TINKERISM_TTS_CHUNK_SCHEDULE)
            kwargs["streaming_latency"] = 4
            # Improves Hindi/Marathi pronunciation when the model emits native script.
            kwargs["apply_language_text_normalization"] = True
        return elevenlabs.TTS(**kwargs)
    if provider == "sarvam":
        return sarvam.TTS(
            model=model,
            speaker=voice,
            target_language_code=_sarvam_language(language),
            api_key=_required_env("SARVAM_API_KEY"),
        )
    if provider == "deepgram":
        raise ProviderAdapterError(
            "Deepgram TTS is no longer supported; configure elevenlabs/eleven_flash_v2_5"
        )
    raise ProviderAdapterError(f"unsupported TTS provider: {provider}")


def _required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise ProviderAdapterError(f"{name} is required for the selected voice provider")
    return value


def _elevenlabs_stt_language(language: str) -> str | None:
    value = (language or "").strip().lower()
    if not value or value in {"auto", "multi"}:
        return None
    return {
        "en": "en",
        "en-us": "en",
        "en-in": "en",
        "hi": "hi",
        "hi-in": "hi",
        "mr": "mr",
        "mr-in": "mr",
    }.get(value, value)


def _elevenlabs_language(language: str) -> str | None:
    mapped = {
        "en": "en",
        "en-IN": "en",
        "hi": "hi",
        # Flash/Turbo reject language_code=mr; omit so Devanagari still synthesizes.
        "mr": None,
    }.get(language, language)
    return mapped


def clear_elevenlabs_tts_language(tts: Any) -> None:
    """Omit language_code on the next ElevenLabs websocket (required for Marathi on Flash)."""
    from livekit.agents.types import NOT_GIVEN

    opts = getattr(tts, "_opts", None)
    if opts is None:
        return
    current = getattr(opts, "language", NOT_GIVEN)
    if current is NOT_GIVEN or current is None:
        return
    opts.language = NOT_GIVEN
    revision = getattr(tts, "_opts_revision", None)
    if isinstance(revision, int):
        tts._opts_revision = revision + 1
    # Match TTS.update_options(): drop the live socket so the next synth reconnects.
    connection = getattr(tts, "_TTS__current_connection", None)
    if connection is not None:
        mark = getattr(connection, "mark_non_current", None)
        if callable(mark):
            mark()
        setattr(tts, "_TTS__current_connection", None)


def apply_tinkerism_tts_language(tts: Any, language: str) -> str | None:
    """Set Flash-compatible TTS language. Returns the language_code used, or None if omitted."""
    code = TINKERISM_TTS_LANGUAGE_CODES.get(str(language or "").strip().lower())
    if code:
        tts.update_options(language=code)
        return code
    # Marathi (and any unsupported code): omit language_code rather than crash the socket.
    clear_elevenlabs_tts_language(tts)
    return None


def _sarvam_language(language: str) -> str:
    return {
        "en": "en-IN",
        "en-IN": "en-IN",
        "hi": "hi-IN",
        "mr": "mr-IN",
    }.get(language, language)
