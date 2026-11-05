import os
import sys
import unittest

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ROOT)

from handlers.voice_catalog import load_voice_catalog
from handlers.voice_config_resolution import VoiceConfigValidationError, resolve_voice_config


class VoiceConfigResolutionTests(unittest.TestCase):
    def test_resolve_voice_config_applies_defaults_and_runtime_ids(self):
        config = resolve_voice_config({}, load_voice_catalog())

        self.assertEqual(config["language"], "en")
        self.assertEqual(config["stt"]["provider"], "elevenlabs")
        self.assertEqual(config["stt"]["model"], "scribe_v2_realtime")
        self.assertEqual(config["stt"]["language"], "auto")
        self.assertEqual(config["stt"]["billing_model"], "elevenlabs/scribe_v2_realtime")
        self.assertEqual(config["llm"]["provider"], "openai")
        self.assertEqual(config["llm"]["model"], "gpt-4.1-mini")
        self.assertEqual(config["llm"]["billing_model"], "openai/gpt-4.1-mini")
        self.assertTrue(config["llm"]["streaming"])
        self.assertEqual(config["tts"]["provider"], "elevenlabs")
        self.assertEqual(config["tts"]["model"], "eleven_flash_v2_5")
        self.assertEqual(config["tts"]["voice"], "EXAVITQu4vr4xnSDxMaL")

    def test_resolve_voice_config_accepts_elevenlabs_scribe_selection(self):
        config = resolve_voice_config(
            {
                "language": "en",
                "stt": {"provider": "elevenlabs", "model": "scribe_v2_realtime"},
                "tts": {
                    "provider": "elevenlabs",
                    "model": "eleven_flash_v2_5",
                    "voice": "EXAVITQu4vr4xnSDxMaL",
                },
            },
            load_voice_catalog(),
        )

        self.assertEqual(config["stt"]["provider"], "elevenlabs")
        self.assertEqual(config["stt"]["model"], "scribe_v2_realtime")
        self.assertEqual(config["tts"]["voice"], "EXAVITQu4vr4xnSDxMaL")

    def test_prefixed_preview_models_resolve_without_explicit_providers(self):
        config = resolve_voice_config(
            {
                "language": "en-US",
                "stt": {"model": "elevenlabs/scribe_v2_realtime"},
                "llm": {
                    "model": "bedrock/us.anthropic.claude-haiku-4-5-20251001-v1:0"
                },
                "tts": {
                    "model": "elevenlabs/eleven_flash_v2_5",
                    "voice": "EXAVITQu4vr4xnSDxMaL",
                },
            },
            load_voice_catalog(),
        )

        self.assertEqual(config["stt"]["model"], "scribe_v2_realtime")
        self.assertEqual(config["stt"]["billing_model"], "elevenlabs/scribe_v2_realtime")
        self.assertEqual(config["llm"]["provider"], "openai")
        self.assertEqual(config["llm"]["billing_model"], "openai/gpt-4.1-mini")
        self.assertEqual(config["tts"]["billing_model"], "elevenlabs/eleven_flash_v2_5")

    def test_legacy_deepgram_stt_and_tts_remap_to_elevenlabs(self):
        config = resolve_voice_config(
            {
                "language": "hi",
                "stt": {"model": "deepgram/nova-3-multilingual"},
                "tts": {
                    "model": "deepgram/aura-2",
                    "voice": "aura-2-asteria-en",
                },
            },
            load_voice_catalog(),
        )

        self.assertEqual(config["stt"]["provider"], "elevenlabs")
        self.assertEqual(config["stt"]["model"], "scribe_v2_realtime")
        self.assertEqual(config["tts"]["provider"], "elevenlabs")
        self.assertEqual(config["tts"]["model"], "eleven_flash_v2_5")
        self.assertEqual(config["tts"]["voice"], "EXAVITQu4vr4xnSDxMaL")

    def test_marathi_language_resolves_with_scribe_and_elevenlabs_tts(self):
        config = resolve_voice_config(
            {
                "language": "mr",
                "stt": {"model": "elevenlabs/scribe_v2_realtime"},
                "tts": {
                    "model": "elevenlabs/eleven_flash_v2_5",
                    "voice": "EXAVITQu4vr4xnSDxMaL",
                },
            },
            load_voice_catalog(),
        )

        self.assertEqual(config["language"], "mr")
        self.assertEqual(config["stt"]["model"], "scribe_v2_realtime")
        self.assertEqual(config["tts"]["model"], "eleven_flash_v2_5")

    def test_french_voice_agent_uses_supported_provider_path(self):
        config = resolve_voice_config(
            {
                "language": "fr",
                "stt": {"provider": "elevenlabs", "model": "scribe_v2_realtime"},
                "tts": {
                    "provider": "elevenlabs",
                    "model": "eleven_flash_v2_5",
                    "voice": "EXAVITQu4vr4xnSDxMaL",
                },
            },
            load_voice_catalog(),
        )
        self.assertEqual(config["language"], "fr")
        self.assertEqual(config["tts"]["model"], "eleven_flash_v2_5")

    def test_resolve_voice_config_rejects_invalid_voice(self):
        with self.assertRaisesRegex(VoiceConfigValidationError, "voice is not supported"):
            resolve_voice_config(
                {"tts": {"provider": "elevenlabs", "model": "eleven_flash_v2_5", "voice": "missing"}},
                load_voice_catalog(),
            )

    def test_unprefixed_elevenlabs_model_overrides_default_provider_merge(self):
        config = resolve_voice_config(
            {
                "language": "en",
                "tts": {
                    "model": "eleven_turbo_v2_5",
                    "voice": "UgBBYS2sOqTuMpoF3BR0",
                },
            },
            load_voice_catalog(),
        )

        self.assertEqual(config["tts"]["provider"], "elevenlabs")
        self.assertEqual(config["tts"]["model"], "eleven_turbo_v2_5")
        self.assertEqual(config["tts"]["voice"], "UgBBYS2sOqTuMpoF3BR0")


if __name__ == "__main__":
    unittest.main()
