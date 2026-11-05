import asyncio
import json
import unittest

import httpx


class VoiceE2ESmokeTests(unittest.TestCase):
    def test_build_session_request_uses_internal_auth_and_payload_metadata(self):
        from handlers.voice_e2e_smoke import SmokeSettings, build_session_request

        settings = SmokeSettings(
            api_base_url="https://ai.example.com",
            internal_api_key="internal-secret",
            livekit_api_key="lk-key",
            livekit_api_secret="lk-secret",
            participant_identity="phase2d-test",
            participant_name="Phase 2D Test",
            probe_text="Say hello.",
            metadata={"run_id": "run-1"},
        )

        request = build_session_request(settings)

        self.assertEqual(request.url, "https://ai.example.com/voice/sessions")
        self.assertEqual(request.headers["x-internal-key"], "internal-secret")
        self.assertNotIn("x-livekit-api-key", request.headers)
        self.assertEqual(request.payload["participant"]["identity"], "phase2d-test")
        self.assertEqual(request.payload["metadata"]["run_id"], "run-1")
        self.assertEqual(request.payload["metadata"]["source"], "phase2d-voice-smoke")

    def test_create_voice_session_posts_to_quickvoice_ai(self):
        from handlers.voice_e2e_smoke import SmokeSettings, create_voice_session

        async def handler(request):
            self.assertEqual(str(request.url), "https://ai.example.com/voice/sessions")
            self.assertEqual(request.headers["x-internal-key"], "internal-secret")
            body = json.loads(request.content)
            self.assertEqual(body["participant"]["identity"], "phase2d-test")
            return httpx.Response(
                200,
                json={
                    "livekit_url": "wss://livekit.example.com",
                    "room": {"name": "voice-room-1"},
                    "participant": {
                        "identity": "phase2d-test",
                        "name": "Phase 2D Test",
                        "token": "secret-token",
                        "ttl_seconds": 900,
                    },
                    "agent": {
                        "name": "quickvoice-voice-agent",
                        "dispatch_id": "AD_123",
                        "dispatch_created": True,
                    },
                    "config": {"language": "en"},
                },
            )

        settings = SmokeSettings(
            api_base_url="https://ai.example.com",
            internal_api_key="internal-secret",
            livekit_api_key="lk-key",
            livekit_api_secret="lk-secret",
            participant_identity="phase2d-test",
            participant_name="Phase 2D Test",
            probe_text="Say hello.",
        )
        client = httpx.AsyncClient(transport=httpx.MockTransport(handler))

        session = asyncio.run(create_voice_session(settings, client=client))

        self.assertEqual(session.livekit_url, "wss://livekit.example.com")
        self.assertEqual(session.room_name, "voice-room-1")
        self.assertEqual(session.dispatch_id, "AD_123")
        self.assertEqual(session.participant_token, "secret-token")

    def test_create_voice_session_surfaces_ai_error_detail(self):
        from handlers.voice_e2e_smoke import SmokeSettings, VoiceSmokeError, create_voice_session

        async def handler(_request):
            return httpx.Response(
                503,
                json={"detail": "LIVEKIT_URL still uses the local placeholder"},
            )

        settings = SmokeSettings(
            api_base_url="https://ai.example.com",
            internal_api_key="internal-secret",
            livekit_api_key="lk-key",
            livekit_api_secret="lk-secret",
            participant_identity="phase2d-test",
            participant_name="Phase 2D Test",
            probe_text="Say hello.",
        )
        client = httpx.AsyncClient(transport=httpx.MockTransport(handler))

        with self.assertRaisesRegex(VoiceSmokeError, "LIVEKIT_URL still uses"):
            asyncio.run(create_voice_session(settings, client=client))

    def test_smoke_evidence_reports_success_without_token(self):
        from handlers.voice_e2e_smoke import SmokeEvidence

        evidence = SmokeEvidence(
            room_name="voice-room-1",
            participant_identity="phase2d-test",
            dispatch_id="AD_123",
            agent_identity="agent-AJ_123",
            audio_frames_received=4,
            audio_duration_ms=240,
            cleaned_up=True,
        )

        data = evidence.to_dict()

        self.assertTrue(evidence.success)
        self.assertEqual(data["audio_frames_received"], 4)
        self.assertTrue(data["success"])
        self.assertNotIn("token", json.dumps(data).lower())

    def test_probe_tts_runs_inside_livekit_http_context(self):
        from handlers.voice_e2e_smoke import SmokeSettings, synthesize_probe_frames

        class FakeContext:
            entered = False
            exited = False

            async def __aenter__(self):
                FakeContext.entered = True

            async def __aexit__(self, exc_type, exc, tb):
                FakeContext.exited = True

        class FakeTTS:
            closed = False

            def __init__(self, **kwargs):
                self.kwargs = kwargs

            async def synthesize(self, text):
                self.text = text
                yield FakeEvent(frame="frame-1")

            async def aclose(self):
                FakeTTS.closed = True

        class FakeEvent:
            def __init__(self, frame):
                self.frame = frame

        settings = SmokeSettings(
            api_base_url="https://ai.example.com",
            internal_api_key="internal-secret",
            livekit_api_key="lk-key",
            livekit_api_secret="lk-secret",
            participant_identity="phase2d-test",
            participant_name="Phase 2D Test",
            probe_text="Say hello.",
            elevenlabs_api_key="eleven-key",
            elevenlabs_voice_id="voice-id",
        )

        from unittest.mock import patch

        with (
            patch("handlers.voice_e2e_smoke.elevenlabs.TTS", FakeTTS),
            patch("handlers.voice_e2e_smoke.http_context.open", return_value=FakeContext()),
        ):
            frames = asyncio.run(synthesize_probe_frames(settings))

        self.assertEqual(frames, ["frame-1"])
        self.assertTrue(FakeContext.entered)
        self.assertTrue(FakeContext.exited)
        self.assertTrue(FakeTTS.closed)


if __name__ == "__main__":
    unittest.main()
