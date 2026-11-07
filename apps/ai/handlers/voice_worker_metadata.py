import json
from dataclasses import dataclass
from typing import Any


SCHEMA_VERSION = "tinkervoice.voice-session.v1"


class VoiceWorkerMetadataError(ValueError):
    pass


@dataclass(frozen=True)
class VoiceSessionMetadata:
    schema_version: str
    catalog_version: str | None
    room_name: str
    participant_identity: str
    participant_name: str
    config: dict[str, Any]
    client_metadata: dict[str, Any]

    @property
    def language(self) -> str:
        return self.config["language"]

    @property
    def mode(self) -> str:
        value = self.client_metadata.get("mode")
        return value.strip() if isinstance(value, str) and value.strip() else "session"

    def log_fields(self) -> dict[str, str]:
        return {
            "catalog_version": self.catalog_version or "",
            "room_name": self.room_name,
            "participant_identity": self.participant_identity,
            "mode": self.mode,
            "language": self.language,
            "stt_provider": self.config["stt"]["provider"],
            "llm_model": self.config["llm"]["model"],
            "tts_provider": self.config["tts"]["provider"],
            "tts_voice": self.config["tts"]["voice"],
        }


def parse_voice_session_metadata(raw_metadata: str) -> VoiceSessionMetadata:
    try:
        payload = json.loads(raw_metadata)
    except json.JSONDecodeError as exc:
        raise VoiceWorkerMetadataError("job metadata must be valid JSON") from exc

    if not isinstance(payload, dict):
        raise VoiceWorkerMetadataError("job metadata must be a JSON object")
    if payload.get("schema_version") != SCHEMA_VERSION:
        raise VoiceWorkerMetadataError(f"schema_version must be {SCHEMA_VERSION}")

    room = _required_object(payload, "room")
    participant = _required_object(payload, "participant")
    config = _required_object(payload, "config")
    _required_object(config, "stt")
    _required_object(config, "llm")
    _required_object(config, "tts")

    identity = _required_string(participant, "identity", "participant.identity")
    participant_name = participant.get("name")
    if not isinstance(participant_name, str) or not participant_name.strip():
        participant_name = identity

    client_metadata = payload.get("client_metadata")
    if not isinstance(client_metadata, dict):
        client_metadata = {}

    return VoiceSessionMetadata(
        schema_version=payload["schema_version"],
        catalog_version=payload.get("catalog_version"),
        room_name=_required_string(room, "name", "room.name"),
        participant_identity=identity,
        participant_name=participant_name.strip(),
        config=config,
        client_metadata=client_metadata,
    )


def is_voice_session_metadata(raw_metadata: str | None) -> bool:
    if not raw_metadata:
        return False
    try:
        payload = json.loads(raw_metadata)
    except json.JSONDecodeError:
        return False
    return isinstance(payload, dict) and payload.get("schema_version") == SCHEMA_VERSION


def _required_object(payload: dict[str, Any], field_name: str) -> dict[str, Any]:
    value = payload.get(field_name)
    if not isinstance(value, dict):
        raise VoiceWorkerMetadataError(f"{field_name} must be an object")
    return value


def _required_string(payload: dict[str, Any], field_name: str, label: str) -> str:
    value = payload.get(field_name)
    if not isinstance(value, str) or not value.strip():
        raise VoiceWorkerMetadataError(f"{label} is required")
    return value.strip()
