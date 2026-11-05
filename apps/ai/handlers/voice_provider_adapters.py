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


# Commit as soon as a short pause is real speech-end, without clipping a normal breath.
# Other calls keep {}.
TINKERISM_SERVER_VAD = {
    "vad_silence_threshold_secs": 0.25,
    "vad_threshold": 0.4,
    "min_speech_duration_ms": 80,
    "min_silence_duration_ms": 180,
}
TINKERISM_STT_AUDIO_CHUNK_MS = 20
# Ziina: professional Indian English female voice. Flash also speaks Hindi when the language is switched.
TINKERISM_VOICE_ID = "FaqthkZu1EWxXxUFbAfb"
TINKERISM_TTS_CHUNK_SCHEDULE = [50, 90, 120, 180]
TINKERISM_MAX_COMPLETION_TOKENS = 100


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
        # Leave language_code unset so Scribe can follow Hindi or English on the same call.
        kwargs["keyterms"] = ["Tinkerism", "website", "websites"]
        kwargs["secondary_languages"] = ["en", "hi"]
        kwargs["audio_chunk_duration_ms"] = TINKERISM_STT_AUDIO_CHUNK_MS
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


def build_tts_adapter(config: dict[str, Any], language: str, *, tinkerism_call: bool = False):
    provider = config["provider"]
    model = config["model"]
    voice = TINKERISM_VOICE_ID if tinkerism_call else config["voice"]
    if provider == "elevenlabs":
        kwargs: dict[str, Any] = {
            "model": model,
            "voice_id": voice,
            # The greeting is English. Hindi is applied when the caller speaks Hindi.
            "language": "en" if tinkerism_call else _elevenlabs_language(language),
            "api_key": _required_env("ELEVENLABS_API_KEY"),
        }
        if tinkerism_call:
            # Start speaking after the first short token chunk instead of waiting for a full buffer.
            kwargs["chunk_length_schedule"] = list(TINKERISM_TTS_CHUNK_SCHEDULE)
            kwargs["streaming_latency"] = 4
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


def _elevenlabs_language(language: str) -> str:
    return {
        "en": "en",
        "en-IN": "en",
        "hi": "hi",
        "mr": "mr",
    }.get(language, language)


def _sarvam_language(language: str) -> str:
    return {
        "en": "en-IN",
        "en-IN": "en-IN",
        "hi": "hi-IN",
        "mr": "mr-IN",
    }.get(language, language)
