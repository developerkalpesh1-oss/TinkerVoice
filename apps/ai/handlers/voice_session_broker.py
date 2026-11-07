import json
import os
import uuid
from datetime import timedelta
from typing import Any, Protocol

from livekit import api

from handlers.voice_config_resolution import resolve_voice_config


SCHEMA_VERSION = "tinkervoice.voice-session.v1"
MAX_SESSION_TTL_SECONDS = 10800
_PLACEHOLDER_LIVEKIT_URL_MARKERS = ("your-livekit-host",)
_PLACEHOLDER_LIVEKIT_CREDENTIALS = {
    "dev-livekit-api-key",
    "dev-livekit-api-secret",
}


class VoiceSessionBrokerError(RuntimeError):
    pass


class DispatchClient(Protocol):
    async def create_dispatch(self, room_name: str, agent_name: str, metadata: str) -> str:
        ...


class FakeDispatchClient:
    def __init__(self, dispatch_id: str = "dispatch-test"):
        self.dispatch_id = dispatch_id
        self.calls: list[dict[str, str]] = []

    async def create_dispatch(self, room_name: str, agent_name: str, metadata: str) -> str:
        self.calls.append(
            {
                "room_name": room_name,
                "agent_name": agent_name,
                "metadata": metadata,
            }
        )
        return self.dispatch_id


class LiveKitDispatchClient:
    def __init__(self, livekit_url: str, api_key: str, api_secret: str):
        self.livekit_url = livekit_url
        self.api_key = api_key
        self.api_secret = api_secret

    async def create_dispatch(self, room_name: str, agent_name: str, metadata: str) -> str:
        livekit_api = api.LiveKitAPI(
            url=self.livekit_url,
            api_key=self.api_key,
            api_secret=self.api_secret,
        )
        try:
            dispatch = await livekit_api.agent_dispatch.create_dispatch(
                api.CreateAgentDispatchRequest(
                    agent_name=agent_name,
                    room=room_name,
                    metadata=metadata,
                )
            )
            return dispatch.id
        finally:
            await livekit_api.aclose()


class VoiceSessionBroker:
    def __init__(
        self,
        *,
        catalog_loader,
        dispatch_client: DispatchClient | None = None,
    ):
        self.catalog_loader = catalog_loader
        self.dispatch_client = dispatch_client

    async def create_session(self, payload: dict[str, Any]) -> dict[str, Any]:
        livekit_url = _livekit_url()
        api_key = _livekit_credential("LIVEKIT_API_KEY")
        api_secret = _livekit_credential("LIVEKIT_API_SECRET")
        agent_name = os.getenv("LIVEKIT_AGENT_NAME", "tinkervoice-voice-agent")
        ttl_seconds = _ttl_seconds(payload)

        catalog = self.catalog_loader()
        client_config = payload.get("config") if isinstance(payload.get("config"), dict) else {}
        resolved_config = resolve_voice_config(client_config, catalog)
        room_name = _room_name(payload)
        participant = _participant(payload)
        dispatch_metadata = _json(
            {
                "schema_version": SCHEMA_VERSION,
                "catalog_version": catalog.get("version"),
                "room": {"name": room_name},
                "participant": participant,
                "config": resolved_config,
                "client_metadata": payload.get("metadata") if isinstance(payload.get("metadata"), dict) else {},
            }
        )
        token = _participant_token(
            api_key=api_key,
            api_secret=api_secret,
            room_name=room_name,
            participant=participant,
            ttl_seconds=ttl_seconds,
        )
        try:
            dispatch_id = await self._dispatch_client(
                livekit_url=livekit_url,
                api_key=api_key,
                api_secret=api_secret,
            ).create_dispatch(room_name, agent_name, dispatch_metadata)
        except VoiceSessionBrokerError:
            raise
        except Exception as exc:
            raise VoiceSessionBrokerError(
                f"LiveKit agent dispatch failed: {exc}"
            ) from exc

        return {
            "livekit_url": livekit_url,
            "room": {"name": room_name},
            "participant": {
                "identity": participant["identity"],
                "name": participant["name"],
                "token": token,
                "ttl_seconds": ttl_seconds,
            },
            "agent": {
                "name": agent_name,
                "dispatch_id": dispatch_id,
                "dispatch_created": True,
            },
            "config": resolved_config,
        }

    def _dispatch_client(self, *, livekit_url: str, api_key: str, api_secret: str) -> DispatchClient:
        if self.dispatch_client:
            return self.dispatch_client
        return LiveKitDispatchClient(livekit_url, api_key, api_secret)


def _required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise VoiceSessionBrokerError(f"{name} is not configured")
    return value


def _livekit_url() -> str:
    value = _required_env("LIVEKIT_URL").strip()
    lowered = value.lower()
    if any(marker in lowered for marker in _PLACEHOLDER_LIVEKIT_URL_MARKERS):
        raise VoiceSessionBrokerError(
            "LIVEKIT_URL still uses the local placeholder; set a real LiveKit "
            "Cloud or self-hosted wss:// URL in apps/ai/.env.dev"
        )
    if not lowered.startswith(("wss://", "ws://", "https://", "http://")):
        raise VoiceSessionBrokerError(
            "LIVEKIT_URL must be an absolute ws(s):// or http(s):// URL"
        )
    return value


def _livekit_credential(name: str) -> str:
    value = _required_env(name).strip()
    if value in _PLACEHOLDER_LIVEKIT_CREDENTIALS:
        raise VoiceSessionBrokerError(
            f"{name} still uses the local placeholder; set real LiveKit "
            "API credentials in apps/ai/.env.dev"
        )
    return value


def _int_env(name: str, default: int) -> int:
    value = os.getenv(name)
    if not value:
        return default
    try:
        return int(value)
    except ValueError as exc:
        raise VoiceSessionBrokerError(f"{name} must be an integer") from exc


def _ttl_seconds(payload: dict[str, Any]) -> int:
    value = payload.get("ttl_seconds")
    if value in (None, ""):
        return min(_int_env("SESSION_TOKEN_TTL_SECONDS", 900), MAX_SESSION_TTL_SECONDS)
    try:
        return max(1, min(int(value), MAX_SESSION_TTL_SECONDS))
    except (TypeError, ValueError) as exc:
        raise VoiceSessionBrokerError("ttl_seconds must be an integer") from exc


def _room_name(payload: dict[str, Any]) -> str:
    room = payload.get("room") if isinstance(payload.get("room"), dict) else {}
    name = room.get("name")
    if isinstance(name, str) and name.strip():
        return name.strip()
    prefix = os.getenv("SESSION_ROOM_PREFIX", "voice-")
    return f"{prefix}{uuid.uuid4().hex[:12]}"


def _participant(payload: dict[str, Any]) -> dict[str, str]:
    raw = payload.get("participant") if isinstance(payload.get("participant"), dict) else {}
    identity = raw.get("identity")
    if not isinstance(identity, str) or not identity.strip():
        identity = f"participant-{uuid.uuid4().hex[:12]}"
    else:
        identity = identity.strip()
    name = raw.get("name")
    if not isinstance(name, str) or not name.strip():
        name = identity
    else:
        name = name.strip()
    return {"identity": identity, "name": name}


def _participant_token(
    *,
    api_key: str,
    api_secret: str,
    room_name: str,
    participant: dict[str, str],
    ttl_seconds: int,
) -> str:
    grants = api.VideoGrants(room_join=True, room=room_name, can_publish=True, can_subscribe=True)
    return (
        api.AccessToken(api_key, api_secret)
        .with_identity(participant["identity"])
        .with_name(participant["name"])
        .with_grants(grants)
        .with_ttl(timedelta(seconds=ttl_seconds))
        .to_jwt()
    )


def _json(value: dict[str, Any]) -> str:
    return json.dumps(value, separators=(",", ":"), sort_keys=True)
