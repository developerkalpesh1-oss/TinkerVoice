from typing import Any


class VoiceConfigValidationError(ValueError):
    pass


# Existing agents may still store Deepgram STT/TTS ids. Remap them onto the
# ElevenLabs calling-agent defaults so saved configs keep working.
_LEGACY_STT = {
    ("deepgram", "nova-3"): ("elevenlabs", "scribe_v2_realtime"),
    ("deepgram", "nova-3-general"): ("elevenlabs", "scribe_v2_realtime"),
    ("deepgram", "nova-3-multilingual"): ("elevenlabs", "scribe_v2_realtime"),
    ("deepgram", "nova-2"): ("elevenlabs", "scribe_v2_realtime"),
}
# Bedrock needs AWS credentials this local stack does not have. Saved agents
# keep working by resolving onto LiveKit Inference's OpenAI model.
_LEGACY_LLM = {
    ("bedrock", "us.anthropic.claude-haiku-4-5-20251001-v1:0"): ("openai", "gpt-4.1-mini"),
    ("bedrock", "us.anthropic.claude-sonnet-4-5-20250929-v1:0"): ("openai", "gpt-4.1-mini"),
    ("bedrock", "us.amazon.nova-micro-v1:0"): ("openai", "gpt-4.1-mini"),
    ("bedrock", "us.amazon.nova-lite-v1:0"): ("openai", "gpt-4.1-mini"),
}
_LEGACY_TTS_MODELS = {
    ("deepgram", "aura-2"): ("elevenlabs", "eleven_flash_v2_5"),
}
_LEGACY_TTS_VOICES = {
    "aura-2-asteria-en": "EXAVITQu4vr4xnSDxMaL",
    "aura-2-athena-en": "EXAVITQu4vr4xnSDxMaL",
    "aura-2-apollo-en": "UgBBYS2sOqTuMpoF3BR0",
    "aura-2-thalia-en": "EXAVITQu4vr4xnSDxMaL",
    "aura-2-hera-en": "EXAVITQu4vr4xnSDxMaL",
    "aura-2-zeus-en": "UgBBYS2sOqTuMpoF3BR0",
    "asteria": "EXAVITQu4vr4xnSDxMaL",
    "athena": "EXAVITQu4vr4xnSDxMaL",
    "apollo": "UgBBYS2sOqTuMpoF3BR0",
    "thalia": "EXAVITQu4vr4xnSDxMaL",
}


def resolve_voice_config(client_config: dict[str, Any], catalog: dict[str, Any]) -> dict[str, Any]:
    defaults = catalog["defaults"]
    language = _pick(client_config, "language", "agent_language") or defaults["language"]
    language = _catalog_language_id(language)
    timezone = client_config.get("timezone") or defaults["timezone"]

    if not _contains_id(catalog["languages"], language):
        raise VoiceConfigValidationError(f"language is not supported: {language}")
    if timezone not in catalog["timezones"]:
        raise VoiceConfigValidationError(f"timezone is not supported: {timezone}")

    stt_input = _normalize_legacy_stt(_section(client_config, "stt", defaults["stt"]))
    llm_input = _normalize_legacy_llm(_section(client_config, "llm", defaults["llm"]))

    stt_model = _find_option(
        catalog["stt_models"],
        "stt.model",
        stt_input["provider"],
        stt_input["model"],
        language,
    )
    llm_model = _find_option(
        catalog["llm_models"],
        "llm.model",
        llm_input["provider"],
        llm_input["model"],
    )
    tts_config = resolve_tts_config(client_config, catalog)

    return {
        "language": language,
        "timezone": timezone,
        "stt": {
            "provider": stt_model["provider"],
            "model": stt_model["runtime_model"],
            "language": stt_model.get("runtime_language", language),
            "billing_model": stt_model.get(
                "billing_model",
                f"{stt_model['provider']}/{stt_model['id']}",
            ),
        },
        "llm": {
            "provider": llm_model["provider"],
            "model": llm_model["runtime_model"],
            "streaming": bool(llm_model.get("streaming", False)),
            "billing_model": llm_model.get(
                "billing_model",
                f"{llm_model['provider']}/{llm_model['id']}",
            ),
        },
        "tts": tts_config["tts"],
    }


def resolve_tts_config(client_config: dict[str, Any], catalog: dict[str, Any]) -> dict[str, Any]:
    language = _catalog_language_id(
        _pick(client_config, "language", "agent_language") or catalog["defaults"]["language"]
    )
    if not _contains_id(catalog["languages"], language):
        raise VoiceConfigValidationError(f"language is not supported: {language}")
    tts_input = _normalize_legacy_tts(_section(client_config, "tts", catalog["defaults"]["tts"]))
    tts_model = _find_option(
        catalog["tts_models"],
        "tts.model",
        tts_input["provider"],
        tts_input["model"],
        language,
    )
    # Use the resolved catalog model (not the possibly-stale default provider
    # left behind when only model/voice were overridden).
    voice = _find_voice(
        catalog["voices"],
        provider=tts_model["provider"],
        voice_id=tts_input["voice"],
        tts_model_id=tts_model["id"],
        language=language,
    )

    return {
        "language": language,
        "tts": {
            "provider": tts_model["provider"],
            "model": tts_model["runtime_model"],
            "voice": voice["runtime_voice"],
            "billing_model": tts_model.get(
                "billing_model",
                f"{tts_model['provider']}/{tts_model['id']}",
            ),
        },
    }


def _section(client_config: dict[str, Any], name: str, defaults: dict[str, str]) -> dict[str, str]:
    raw = client_config.get(name)
    merged = dict(defaults)
    if isinstance(raw, dict):
        merged.update({key: value for key, value in raw.items() if value is not None})
    else:
        legacy_model = client_config.get(f"{name}Model")
        if legacy_model:
            merged["model"] = legacy_model
    model = str(merged.get("model") or "").strip()
    if "/" in model:
        prefixed_provider, model = model.split("/", 1)
        configured_provider = (
            str(raw.get("provider") or "").strip()
            if isinstance(raw, dict)
            else ""
        )
        if configured_provider and configured_provider.lower() != prefixed_provider.lower():
            raise VoiceConfigValidationError(
                f"{name}.provider conflicts with model prefix {prefixed_provider}"
            )
        merged["provider"] = prefixed_provider.lower()
        merged["model"] = model
    return merged


def _normalize_legacy_llm(llm_config: dict[str, str]) -> dict[str, str]:
    provider = str(llm_config.get("provider") or "").strip().lower()
    model = str(llm_config.get("model") or "").strip()
    if provider != "bedrock":
        return llm_config
    next_provider, next_model = _LEGACY_LLM.get((provider, model), ("openai", "gpt-4.1-mini"))
    return {**llm_config, "provider": next_provider, "model": next_model}


def _normalize_legacy_stt(stt_config: dict[str, str]) -> dict[str, str]:
    provider = str(stt_config.get("provider") or "").strip().lower()
    model = str(stt_config.get("model") or "").strip()
    remapped = _LEGACY_STT.get((provider, model))
    if not remapped:
        return stt_config
    next_provider, next_model = remapped
    return {**stt_config, "provider": next_provider, "model": next_model}


def _normalize_legacy_tts(tts_config: dict[str, str]) -> dict[str, str]:
    provider = str(tts_config.get("provider") or "").strip().lower()
    model = str(tts_config.get("model") or "").strip()
    voice = str(tts_config.get("voice") or "").strip()
    updated = dict(tts_config)
    remapped = _LEGACY_TTS_MODELS.get((provider, model))
    if remapped:
        next_provider, next_model = remapped
        updated["provider"] = next_provider
        updated["model"] = next_model
    if voice in _LEGACY_TTS_VOICES:
        updated["voice"] = _LEGACY_TTS_VOICES[voice]
    elif not voice and remapped:
        updated["voice"] = "EXAVITQu4vr4xnSDxMaL"
    return updated


def _pick(source: dict[str, Any], *keys: str):
    for key in keys:
        value = source.get(key)
        if value:
            return value
    return None


def _catalog_language_id(language: str) -> str:
    value = language.strip()
    return {
        "en-US": "en",
        "hi-IN": "hi",
        "mr-IN": "mr",
    }.get(value, value)


def _contains_id(options: list[dict[str, Any]], option_id: str) -> bool:
    return any(option.get("id") == option_id for option in options)


def _find_option(
    options: list[dict[str, Any]],
    field_name: str,
    provider: str,
    option_id: str,
    language: str | None = None,
) -> dict[str, Any]:
    id_matches: list[dict[str, Any]] = []
    for option in options:
        if option["id"] != option_id:
            continue
        id_matches.append(option)
        if option["provider"] != provider:
            continue
        languages = option.get("languages")
        if language and languages and language not in languages:
            raise VoiceConfigValidationError(f"{field_name} does not support language {language}")
        return option

    # Unprefixed model ids can keep a default provider from catalog merge.
    # If the model id is unique in the catalog, resolve it instead of failing.
    if len(id_matches) == 1:
        option = id_matches[0]
        languages = option.get("languages")
        if language and languages and language not in languages:
            raise VoiceConfigValidationError(f"{field_name} does not support language {language}")
        return option

    raise VoiceConfigValidationError(f"{field_name} is not supported: {provider}/{option_id}")


def _find_voice(
    voices: list[dict[str, Any]],
    *,
    provider: str,
    voice_id: str,
    tts_model_id: str,
    language: str,
) -> dict[str, Any]:
    requested = _LEGACY_TTS_VOICES.get(voice_id, voice_id)
    for voice in voices:
        if voice["provider"] != provider or not _voice_id_matches(voice, requested):
            continue
        if tts_model_id not in voice.get("tts_models", []):
            raise VoiceConfigValidationError(f"voice {voice_id} is not compatible with {tts_model_id}")
        if language not in voice.get("languages", []):
            raise VoiceConfigValidationError(f"voice {voice_id} does not support language {language}")
        return voice
    raise VoiceConfigValidationError(f"voice is not supported: {provider}/{voice_id}")


def _voice_id_matches(voice: dict[str, Any], requested_voice_id: str) -> bool:
    candidates = {str(voice.get("id", "")), str(voice.get("runtime_voice", ""))}
    return requested_voice_id in candidates
