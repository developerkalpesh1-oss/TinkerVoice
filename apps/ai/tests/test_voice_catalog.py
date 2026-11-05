import json
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ROOT)

from handlers.voice_catalog import load_voice_catalog


class VoiceCatalogTests(unittest.TestCase):
    def test_load_voice_catalog_returns_static_provider_options(self):
        catalog = load_voice_catalog()

        self.assertEqual(catalog["version"], "2026-11-04")
        self.assertEqual(catalog["defaults"]["stt"]["provider"], "elevenlabs")
        self.assertEqual(catalog["defaults"]["stt"]["model"], "scribe_v2_realtime")
        self.assertEqual(catalog["defaults"]["tts"]["provider"], "elevenlabs")
        self.assertEqual(catalog["defaults"]["llm"]["provider"], "openai")
        self.assertEqual(catalog["defaults"]["llm"]["model"], "gpt-4.1-mini")
        self.assertTrue(
            any(
                item["provider"] == "openai"
                and item["id"] == "gpt-4.1-mini"
                and item["label"] == "GPT-4.1 mini"
                for item in catalog["llm_models"]
            )
        )
        self.assertFalse(any(item["provider"] == "bedrock" for item in catalog["llm_models"]))
        self.assertTrue(any(item["provider"] == "elevenlabs" for item in catalog["tts_models"]))
        self.assertTrue(
            any(
                item["provider"] == "elevenlabs"
                and item["id"] == "scribe_v2_realtime"
                and item["runtime_language"] == "auto"
                for item in catalog["stt_models"]
            )
        )
        self.assertFalse(any(item["provider"] == "deepgram" for item in catalog["stt_models"]))
        self.assertFalse(any(item["provider"] == "deepgram" for item in catalog["tts_models"]))
        self.assertFalse(any(item["provider"] == "deepgram" for item in catalog["voices"]))
        for category in ("stt_models", "tts_models", "voices"):
            self.assertFalse(any(item["provider"] == "sarvam" for item in catalog[category]))
        self.assertTrue(any(language["id"] == "mr" for language in catalog["languages"]))

    def test_every_listed_language_has_complete_speech_path(self):
        catalog = load_voice_catalog()
        self.assertEqual(len(catalog["languages"]), 34)
        for language in catalog["languages"]:
            code = language["id"]
            with self.subTest(language=code):
                self.assertTrue(any(code in model["languages"] for model in catalog["stt_models"]))
                self.assertTrue(language["sample_text"])
                self.assertLessEqual(len(language["sample_text"]), 300)
                self.assertTrue(any(
                    code in model["languages"]
                    and any(
                        voice["provider"] == model["provider"]
                        and model["id"] in voice["tts_models"]
                        and code in voice["languages"]
                        for voice in catalog["voices"]
                    )
                    for model in catalog["tts_models"]
                ))

    def test_load_voice_catalog_prefers_configured_json_path(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "catalog.json"
            path.write_text(json.dumps({"version": "custom", "defaults": {}, "languages": []}))

            with patch.dict(os.environ, {"VOICE_CATALOG_PATH": str(path)}, clear=False):
                catalog = load_voice_catalog()

        self.assertEqual(catalog["version"], "custom")


if __name__ == "__main__":
    unittest.main()
