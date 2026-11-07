import json
import os
import sys
import unittest

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ROOT)

from handlers.voice_worker_metadata import (
    VoiceWorkerMetadataError,
    is_voice_session_metadata,
    parse_voice_session_metadata,
)


class VoiceWorkerMetadataTests(unittest.TestCase):
    def test_parse_voice_session_metadata_returns_context(self):
        metadata = parse_voice_session_metadata(
            json.dumps(
                {
                    "schema_version": "tinkervoice.voice-session.v1",
                    "catalog_version": "2026-06-30",
                    "room": {"name": "voice-room-1"},
                    "participant": {"identity": "caller-1", "name": "Caller One"},
                    "config": {
                        "language": "en",
                        "timezone": "UTC",
                        "stt": {"provider": "deepgram", "model": "nova-3"},
                        "llm": {"provider": "bedrock", "model": "us.amazon.nova-micro-v1:0", "streaming": True},
                        "tts": {
                            "provider": "elevenlabs",
                            "model": "eleven_flash_v2_5",
                            "voice": "EXAVITQu4vr4xnSDxMaL",
                        },
                    },
                    "client_metadata": {"agent_id": "agent_123"},
                }
            )
        )

        self.assertEqual(metadata.room_name, "voice-room-1")
        self.assertEqual(metadata.config["stt"]["provider"], "deepgram")
        self.assertTrue(is_voice_session_metadata(json.dumps({"schema_version": "tinkervoice.voice-session.v1"})))

    def test_parse_voice_session_metadata_exposes_preview_mode(self):
        metadata = parse_voice_session_metadata(
            json.dumps(
                {
                    "schema_version": "tinkervoice.voice-session.v1",
                    "catalog_version": "2026-06-30",
                    "room": {"name": "preview-room-1"},
                    "participant": {"identity": "preview-user-1", "name": "Preview user"},
                    "config": {
                        "language": "en",
                        "timezone": "UTC",
                        "stt": {"provider": "deepgram", "model": "nova-3"},
                        "llm": {"provider": "bedrock", "model": "us.amazon.nova-micro-v1:0"},
                        "tts": {
                            "provider": "elevenlabs",
                            "model": "eleven_flash_v2_5",
                            "voice": "EXAVITQu4vr4xnSDxMaL",
                        },
                    },
                    "client_metadata": {
                        "mode": "preview",
                        "first_message": "Hello from preview.",
                        "system_prompt": "Preview prompt.",
                    },
                }
            )
        )

        self.assertEqual(metadata.mode, "preview")
        self.assertEqual(metadata.client_metadata["first_message"], "Hello from preview.")

    def test_parse_voice_session_metadata_rejects_wrong_schema(self):
        with self.assertRaisesRegex(VoiceWorkerMetadataError, "schema_version"):
            parse_voice_session_metadata(json.dumps({"schema_version": "wrong"}))


if __name__ == "__main__":
    unittest.main()
