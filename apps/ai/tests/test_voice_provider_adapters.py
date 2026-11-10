import os
import sys
import unittest
from types import SimpleNamespace
from unittest.mock import patch

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ROOT)

from handlers.voice_provider_adapters import ProviderAdapterError, build_tts_adapter, build_voice_provider_adapters


class VoiceProviderAdapterTests(unittest.TestCase):
    def test_sample_tts_uses_selected_model_voice_and_language_without_other_provider_keys(self):
        with patch.dict(os.environ, {"ELEVENLABS_API_KEY": "sample-key"}, clear=True), patch(
            "handlers.voice_provider_adapters.elevenlabs.TTS"
        ) as tts:
            build_tts_adapter(
                {
                    "provider": "elevenlabs",
                    "model": "eleven_flash_v2_5",
                    "voice": "UgBBYS2sOqTuMpoF3BR0",
                },
                "hi",
            )
        tts.assert_called_once_with(
            model="eleven_flash_v2_5",
            voice_id="UgBBYS2sOqTuMpoF3BR0",
            language="hi",
            api_key="sample-key",
        )

    def setUp(self):
        self.config = {
            "language": "en",
            "stt": {"provider": "elevenlabs", "model": "scribe_v2_realtime", "language": "auto"},
            "llm": {"provider": "bedrock", "model": "us.amazon.nova-micro-v1:0", "streaming": True},
            "tts": {
                "provider": "elevenlabs",
                "model": "eleven_flash_v2_5",
                "voice": "EXAVITQu4vr4xnSDxMaL",
            },
        }

    def test_build_voice_provider_adapters_requires_selected_provider_secrets(self):
        with patch.dict(
            os.environ,
            {
                "AWS_ACCESS_KEY_ID": "a",
                "AWS_SECRET_ACCESS_KEY": "s",
            },
            clear=True,
        ):
            with self.assertRaisesRegex(ProviderAdapterError, "ELEVENLABS_API_KEY"):
                build_voice_provider_adapters(self.config)

    def test_build_voice_provider_adapters_returns_summary(self):
        with patch.dict(
            os.environ,
            {
                "ELEVENLABS_API_KEY": "e",
            },
            clear=True,
        ):
            with (
                patch("handlers.voice_provider_adapters.elevenlabs.STT"),
                patch("handlers.voice_provider_adapters.aws.LLM"),
                patch("handlers.voice_provider_adapters.elevenlabs.TTS"),
            ):
                adapters = build_voice_provider_adapters(self.config)

        self.assertEqual(adapters.summary["stt_provider"], "elevenlabs")
        self.assertEqual(adapters.summary["llm_provider"], "bedrock")
        self.assertEqual(adapters.summary["tts_provider"], "elevenlabs")

    def test_openai_llm_uses_livekit_inference_without_aws(self):
        with patch.dict(os.environ, {"ELEVENLABS_API_KEY": "e"}, clear=True):
            with (
                patch("handlers.voice_provider_adapters.elevenlabs.STT"),
                patch("handlers.voice_provider_adapters.inference.LLM") as llm,
                patch("handlers.voice_provider_adapters.elevenlabs.TTS"),
            ):
                config = {
                    **self.config,
                    "llm": {"provider": "openai", "model": "gpt-4.1-mini", "streaming": True},
                }
                adapters = build_voice_provider_adapters(config)
        llm.assert_called_once_with(model="openai/gpt-4.1-mini", extra_kwargs={})
        self.assertEqual(adapters.summary["llm_provider"], "openai")
        self.assertEqual(adapters.summary["llm_model"], "gpt-4.1-mini")

    def test_elevenlabs_stt_uses_scribe_realtime_with_auto_language_detection(self):
        with patch.dict(os.environ, {"ELEVENLABS_API_KEY": "e"}, clear=True):
            with (
                patch("handlers.voice_provider_adapters.elevenlabs.STT") as stt,
                patch("handlers.voice_provider_adapters.aws.LLM"),
                patch("handlers.voice_provider_adapters.elevenlabs.TTS"),
            ):
                build_voice_provider_adapters(self.config)

        stt.assert_called_once_with(
            model="scribe_v2_realtime",
            api_key="e",
            include_language_detection=True,
            server_vad={},
            secondary_languages=["en", "hi", "mr"],
        )

    def test_elevenlabs_stt_hints_primary_language_and_keeps_en_hi_mr_secondaries(self):
        config = {
            **self.config,
            "language": "hi",
            "stt": {
                "provider": "elevenlabs",
                "model": "scribe_v2_realtime",
                "language": "hi",
            },
        }
        with patch.dict(os.environ, {"ELEVENLABS_API_KEY": "e"}, clear=True):
            with (
                patch("handlers.voice_provider_adapters.elevenlabs.STT") as stt,
                patch("handlers.voice_provider_adapters.aws.LLM"),
                patch("handlers.voice_provider_adapters.elevenlabs.TTS"),
            ):
                build_voice_provider_adapters(config)

        stt.assert_called_once_with(
            model="scribe_v2_realtime",
            api_key="e",
            include_language_detection=True,
            server_vad={},
            language_code="hi",
            secondary_languages=["en", "mr"],
        )

    def test_tinkerism_calls_commit_scribe_sooner_and_other_calls_keep_default_vad(self):
        from handlers.voice_provider_adapters import TINKERISM_SERVER_VAD

        config = {**self.config, "tinkerism_call": True}
        with patch.dict(os.environ, {"ELEVENLABS_API_KEY": "e"}, clear=True):
            with (
                patch("handlers.voice_provider_adapters.elevenlabs.STT") as stt,
                patch("handlers.voice_provider_adapters.aws.LLM"),
                patch("handlers.voice_provider_adapters.elevenlabs.TTS"),
            ):
                build_voice_provider_adapters(config)

        from handlers.voice_provider_adapters import (
            TINKERISM_STT_KEYTERMS,
            TINKERISM_STT_PREVIOUS_TEXT,
        )

        kwargs = stt.call_args.kwargs
        self.assertEqual(kwargs["server_vad"], TINKERISM_SERVER_VAD)
        self.assertEqual(kwargs["keyterms"], list(TINKERISM_STT_KEYTERMS))
        self.assertEqual(kwargs["secondary_languages"], ["en", "hi", "mr"])
        self.assertEqual(kwargs["previous_text"], TINKERISM_STT_PREVIOUS_TEXT)
        self.assertNotIn("language_code", kwargs)
        self.assertEqual(kwargs["audio_chunk_duration_ms"], 20)
        self.assertGreaterEqual(TINKERISM_SERVER_VAD["min_silence_duration_ms"], 350)
        self.assertLessEqual(TINKERISM_SERVER_VAD["min_silence_duration_ms"], 500)
        self.assertTrue(all(len(term) <= 20 for term in TINKERISM_STT_KEYTERMS))
        self.assertLessEqual(len(TINKERISM_STT_KEYTERMS), 50)

    def test_tinkerism_calls_stream_an_indian_english_voice_and_keep_other_voices(self):
        from handlers.voice_provider_adapters import TINKERISM_TTS_CHUNK_SCHEDULE, TINKERISM_VOICE_ID

        config = {
            **self.config,
            "tinkerism_call": True,
            "llm": {"provider": "openai", "model": "gpt-4.1-mini", "streaming": True},
        }
        with patch.dict(os.environ, {"ELEVENLABS_API_KEY": "e"}, clear=True):
            with (
                patch("handlers.voice_provider_adapters.elevenlabs.STT"),
                patch("handlers.voice_provider_adapters.inference.LLM") as llm,
                patch("handlers.voice_provider_adapters.elevenlabs.TTS") as tts,
            ):
                build_voice_provider_adapters(config)

        tts.assert_called_once_with(
            model="eleven_flash_v2_5",
            voice_id=TINKERISM_VOICE_ID,
            language="en",
            api_key="e",
            chunk_length_schedule=TINKERISM_TTS_CHUNK_SCHEDULE,
            streaming_latency=4,
            apply_language_text_normalization=True,
        )
        self.assertEqual(TINKERISM_TTS_CHUNK_SCHEDULE[0], 50)
        self.assertTrue(all(50 <= value <= 500 for value in TINKERISM_TTS_CHUNK_SCHEDULE))
        llm.assert_called_once_with(
            model="openai/gpt-4.1-mini",
            extra_kwargs={"max_completion_tokens": 140, "temperature": 0.7},
        )

    def test_flash_tts_omits_unsupported_marathi_language_code(self):
        from handlers.voice_provider_adapters import (
            apply_tinkerism_tts_language,
            build_tts_adapter,
            clear_elevenlabs_tts_language,
        )
        from livekit.agents.types import NOT_GIVEN

        with patch.dict(os.environ, {"ELEVENLABS_API_KEY": "e"}, clear=True):
            with patch("handlers.voice_provider_adapters.elevenlabs.TTS") as tts:
                build_tts_adapter(
                    {"provider": "elevenlabs", "model": "eleven_flash_v2_5", "voice": "v"},
                    "mr",
                )
        self.assertNotIn("language", tts.call_args.kwargs)

        updates = []
        fake = SimpleNamespace(
            update_options=lambda **kwargs: updates.append(kwargs),
            _opts=SimpleNamespace(language="hi"),
            _opts_revision=3,
            _TTS__current_connection=None,
        )
        self.assertEqual(apply_tinkerism_tts_language(fake, "hi"), "hi")
        self.assertEqual(updates, [{"language": "hi"}])
        self.assertIsNone(apply_tinkerism_tts_language(fake, "mr"))
        self.assertEqual(updates, [{"language": "hi"}])
        self.assertIs(fake._opts.language, NOT_GIVEN)
        self.assertEqual(fake._opts_revision, 4)
        fake._opts.language = "en"
        clear_elevenlabs_tts_language(fake)
        self.assertIs(fake._opts.language, NOT_GIVEN)

    def test_build_voice_provider_adapters_rejects_deepgram(self):
        config = {
            **self.config,
            "stt": {"provider": "deepgram", "model": "nova-3"},
        }
        with patch.dict(os.environ, {"ELEVENLABS_API_KEY": "e"}, clear=True):
            with self.assertRaisesRegex(ProviderAdapterError, "Deepgram STT is no longer supported"):
                build_voice_provider_adapters(config)

    def test_build_voice_provider_adapters_rejects_partial_static_aws_credentials(self):
        with patch.dict(
            os.environ,
            {
                "AWS_ACCESS_KEY_ID": "a",
                "ELEVENLABS_API_KEY": "e",
            },
            clear=True,
        ):
            with self.assertRaisesRegex(ProviderAdapterError, "AWS_SECRET_ACCESS_KEY"):
                build_voice_provider_adapters(self.config)

    def test_build_voice_provider_adapters_uses_session_for_temporary_aws_credentials(self):
        with patch.dict(
            os.environ,
            {
                "AWS_ACCESS_KEY_ID": "a",
                "AWS_SECRET_ACCESS_KEY": "s",
                "AWS_SESSION_TOKEN": "t",
                "AWS_REGION": "us-west-2",
                "ELEVENLABS_API_KEY": "e",
            },
            clear=True,
        ):
            with (
                patch("handlers.voice_provider_adapters.get_session") as get_session,
                patch("handlers.voice_provider_adapters.aws.LLM") as llm,
                patch("handlers.voice_provider_adapters.elevenlabs.STT"),
                patch("handlers.voice_provider_adapters.elevenlabs.TTS"),
            ):
                build_voice_provider_adapters(self.config)

        session = get_session.return_value
        session.set_credentials.assert_called_once_with("a", "s", "t")
        session.set_config_variable.assert_called_once_with("region", "us-west-2")
        llm.assert_called_once_with(
            model="us.amazon.nova-micro-v1:0",
            region="us-west-2",
            session=session,
        )


if __name__ == "__main__":
    unittest.main()
