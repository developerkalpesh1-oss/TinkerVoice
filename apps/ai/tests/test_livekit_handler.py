import asyncio
import os
import sys
import unittest
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ROOT)

from handlers.livekit_handler import (
    LocalCallRecorder,
    get_recording_storage_config,
    local_recording_abspath,
    recording_path,
    recording_storage_mode,
    resolve_uploaded_recording_path,
    start_recording,
)


class LiveKitHandlerTests(unittest.TestCase):
    def test_recording_path_uses_shared_s3_recording_prefix(self):
        self.assertEqual(
            recording_path("recording-123"),
            "Voice-agents/Recordings/recording-123.ogg",
        )

    def test_recording_storage_mode_defaults_to_local_without_real_credentials(self):
        with patch.dict(os.environ, {}, clear=True):
            self.assertEqual(recording_storage_mode(), "local")
        with patch.dict(
            os.environ,
            {
                "AWS_ACCESS_KEY_ID": "dev-s3-access-key",
                "AWS_SECRET_ACCESS_KEY": "dev-s3-secret-access-key",
            },
            clear=True,
        ):
            self.assertEqual(recording_storage_mode(), "local")
        with patch.dict(os.environ, {"RECORDING_STORAGE": "s3"}, clear=True):
            self.assertEqual(recording_storage_mode(), "s3")
        with patch.dict(
            os.environ,
            {
                "AWS_ACCESS_KEY_ID": "AKIAIOSFODNN7EXAMPLEKEY",
                "AWS_SECRET_ACCESS_KEY": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
            },
            clear=True,
        ):
            # Still treated as placeholders because values contain "example".
            self.assertEqual(recording_storage_mode(), "local")
        with patch.dict(
            os.environ,
            {
                "AWS_ACCESS_KEY_ID": "AKIAIOSFODNN7LIVEKEY01",
                "AWS_SECRET_ACCESS_KEY": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYLIVESECRET",
            },
            clear=True,
        ):
            self.assertEqual(recording_storage_mode(), "s3")

    def test_recording_storage_config_includes_static_credentials_when_provided(self):
        with patch.dict(
            os.environ,
            {
                "AWS_ACCESS_KEY_ID": "aws-access",
                "AWS_SECRET_ACCESS_KEY": "aws-secret",
                "AWS_SESSION_TOKEN": "aws-session-token",
                "AWS_REGION": "us-west-2",
                "S3_BUCKET_NAME": "tinkervoice-recordings",
                "ACCESS_KEY": "legacy-access",
                "SECRET_ACCESS_KEY": "legacy-secret",
                "REGION": "legacy-region",
            },
            clear=True,
        ):
            config = get_recording_storage_config()

        self.assertEqual(config["region"], "us-west-2")
        self.assertEqual(config["bucket"], "tinkervoice-recordings")
        self.assertEqual(config["access_key"], "aws-access")
        self.assertEqual(config["secret"], "aws-secret")
        self.assertEqual(config["session_token"], "aws-session-token")

    def test_recording_storage_config_allows_ecs_role_without_static_credentials(self):
        with patch.dict(
            os.environ,
            {
                "AWS_REGION": "us-west-2",
                "S3_BUCKET_NAME": "tinkervoice-recordings",
            },
            clear=True,
        ):
            config = get_recording_storage_config()

        self.assertEqual(config["region"], "us-west-2")
        self.assertEqual(config["bucket"], "tinkervoice-recordings")
        self.assertNotIn("access_key", config)
        self.assertNotIn("secret", config)
        self.assertNotIn("session_token", config)

    def test_recording_storage_config_ignores_placeholder_credentials(self):
        with patch.dict(
            os.environ,
            {
                "AWS_REGION": "us-west-2",
                "S3_BUCKET_NAME": "tinkervoice-recordings",
                "AWS_ACCESS_KEY_ID": "dev-s3-access-key",
                "AWS_SECRET_ACCESS_KEY": "dev-s3-secret-access-key",
                "ACCESS_KEY": "dev-access",
                "SECRET_ACCESS_KEY": "dev-secret",
            },
            clear=True,
        ):
            config = get_recording_storage_config()

        self.assertNotIn("access_key", config)
        self.assertNotIn("secret", config)

    def test_recording_storage_config_rejects_partial_static_credentials(self):
        with patch.dict(
            os.environ,
            {
                "AWS_REGION": "us-west-2",
                "S3_BUCKET_NAME": "tinkervoice-recordings",
                "AWS_ACCESS_KEY_ID": "aws-access",
            },
            clear=True,
        ):
            with self.assertRaisesRegex(RuntimeError, "AWS_SECRET_ACCESS_KEY"):
                get_recording_storage_config()

    def test_start_recording_passes_static_credentials_to_livekit_s3_upload(self):
        from livekit import api

        class FakeEgress:
            def __init__(self):
                self.request = None

            async def start_room_composite_egress(self, request):
                self.request = request
                return SimpleNamespace(egress_id="egress-123", status=api.EGRESS_ACTIVE)

        class FakeLiveKitAPI:
            instance = None

            def __init__(self, *args, **kwargs):
                self.egress = FakeEgress()
                FakeLiveKitAPI.instance = self

            async def aclose(self):
                pass

        with patch.dict(
            os.environ,
            {
                "LIVEKIT_URL": "wss://livekit.example.com",
                "LIVEKIT_API_KEY": "livekit-key",
                "LIVEKIT_API_SECRET": "livekit-secret",
                "AWS_REGION": "us-west-2",
                "S3_BUCKET_NAME": "tinkervoice-recordings",
                "AWS_ACCESS_KEY_ID": "aws-access",
                "AWS_SECRET_ACCESS_KEY": "aws-secret",
                "AWS_SESSION_TOKEN": "aws-session-token",
            },
            clear=True,
        ):
            with patch("livekit.api.LiveKitAPI", FakeLiveKitAPI):
                recording = asyncio.run(
                    start_recording(SimpleNamespace(room=SimpleNamespace(name="room-123")))
                )

        self.assertEqual(recording["egress_id"], "egress-123")
        self.assertTrue(recording["recording_id"])
        s3_upload = FakeLiveKitAPI.instance.egress.request.file_outputs[0].s3
        self.assertEqual(s3_upload.bucket, "tinkervoice-recordings")
        self.assertEqual(s3_upload.region, "us-west-2")
        self.assertEqual(s3_upload.access_key, "aws-access")
        self.assertEqual(s3_upload.secret, "aws-secret")
        self.assertEqual(s3_upload.session_token, "aws-session-token")

    def test_recording_storage_config_requires_an_explicit_bucket(self):
        with patch.dict(
            os.environ,
            {
                "AWS_ACCESS_KEY_ID": "aws-access",
                "AWS_SECRET_ACCESS_KEY": "aws-secret",
                "AWS_REGION": "us-west-2",
            },
            clear=True,
        ):
            with self.assertRaisesRegex(
                RuntimeError,
                "Missing recording storage env: bucket",
            ):
                get_recording_storage_config()


class RecordingStartupTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        from livekit import api
        self.api = api
        self.ctx = SimpleNamespace(room=SimpleNamespace(name="room-123"))
        self.egress = SimpleNamespace(
            start_room_composite_egress=AsyncMock(return_value=api.EgressInfo(
                egress_id="egress-123", status=api.EGRESS_STARTING,
            )),
            list_egress=AsyncMock(return_value=api.ListEgressResponse(items=[api.EgressInfo(
                egress_id="egress-123", status=api.EGRESS_ACTIVE,
            )])),
            stop_egress=AsyncMock(),
        )
        self.client = SimpleNamespace(egress=self.egress, aclose=AsyncMock())
        env = patch.dict(os.environ, {
            "LIVEKIT_URL": "wss://livekit.example.com", "LIVEKIT_API_KEY": "key",
            "LIVEKIT_API_SECRET": "secret", "S3_BUCKET_NAME": "recordings",
            "AWS_ACCESS_KEY_ID": "aws-access", "AWS_SECRET_ACCESS_KEY": "aws-secret",
            "AWS_REGION": "us-west-2",
        }, clear=True)
        env.start()
        self.addCleanup(env.stop)
        client = patch("livekit.api.LiveKitAPI", return_value=self.client)
        client.start()
        self.addCleanup(client.stop)

    async def test_waits_for_active_instead_of_treating_acceptance_as_ready(self):
        entered, release = asyncio.Event(), asyncio.Event()
        async def poll(_request):
            if self.egress.list_egress.await_count == 1:
                return self.api.ListEgressResponse()
            if self.egress.list_egress.await_count == 2:
                return self.api.ListEgressResponse(items=[self.api.EgressInfo(
                    egress_id="egress-123", status=self.api.EGRESS_STARTING,
                )])
            entered.set()
            await release.wait()
            return self.api.ListEgressResponse(items=[self.api.EgressInfo(
                egress_id="egress-123", status=self.api.EGRESS_ACTIVE,
            )])
        self.egress.list_egress.side_effect = poll
        startup = asyncio.create_task(start_recording(self.ctx))
        try:
            await asyncio.wait_for(entered.wait(), timeout=2)
            self.assertFalse(startup.done())
        finally:
            release.set()
            recording = await startup
        self.assertEqual(recording["egress_id"], "egress-123")
        self.assertTrue(recording["recording_id"])
        self.assertEqual(self.egress.list_egress.await_count, 3)
        self.egress.list_egress.assert_awaited_with(
            self.api.ListEgressRequest(egress_id="egress-123"),
        )
        self.egress.stop_egress.assert_not_called()
        self.client.aclose.assert_awaited_once()

    async def test_hung_start_request_has_a_deadline_and_closes_client(self):
        async def hang(_request):
            await asyncio.Future()
        self.egress.start_room_composite_egress.side_effect = hang
        self.assertIsNone(await start_recording(self.ctx, timeout_seconds=0.01))
        self.egress.stop_egress.assert_not_called()
        self.client.aclose.assert_awaited_once()

    async def test_startup_timeout_stops_pending_egress_and_closes_client(self):
        recording = await start_recording(self.ctx, timeout_seconds=0.01)
        self.assertIsNone(recording)
        self.egress.stop_egress.assert_awaited_once_with(
            self.api.StopEgressRequest(egress_id="egress-123"),
        )
        self.client.aclose.assert_awaited_once()

    async def test_resolve_local_recording_requires_nonempty_file(self):
        import tempfile

        with tempfile.TemporaryDirectory() as tmp:
            with patch.dict(os.environ, {"RECORDING_LOCAL_DIR": tmp}, clear=False):
                key = recording_path("local-ready")
                path = local_recording_abspath(key)
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(b"OggS")
                resolved = await resolve_uploaded_recording_path(
                    {"mode": "local", "recording_id": "local-ready", "key": key}
                )
                self.assertEqual(resolved, key)
                missing = await resolve_uploaded_recording_path(
                    {
                        "mode": "local",
                        "recording_id": "missing",
                        "key": recording_path("missing"),
                    }
                )
                self.assertIsNone(missing)

    async def test_local_call_recorder_writes_shared_key_and_finalizes(self):
        import tempfile
        from pathlib import Path

        class FakeRecorder:
            def __init__(self):
                self.started = None
                self.closed = False

            def record_input(self, source):
                return ("recorded-in", source)

            def record_output(self, source):
                return ("recorded-out", source)

            async def start(self, *, output_path):
                self.started = output_path
                Path(output_path).parent.mkdir(parents=True, exist_ok=True)
                Path(output_path).write_bytes(b"OggS-local")

            async def aclose(self):
                self.closed = True

        session = SimpleNamespace(
            input=SimpleNamespace(audio="in"),
            output=SimpleNamespace(audio="out"),
        )
        fake = FakeRecorder()
        with tempfile.TemporaryDirectory() as tmp:
            with patch.dict(os.environ, {"RECORDING_LOCAL_DIR": tmp}, clear=False):
                with patch(
                    "livekit.agents.voice.recorder_io.RecorderIO",
                    return_value=fake,
                ):
                    recorder = LocalCallRecorder(session)
                    started = await recorder.start()
                    self.assertEqual(started["mode"], "local")
                    self.assertEqual(session.input.audio[0], "recorded-in")
                    self.assertEqual(session.output.audio[0], "recorded-out")
                    key = await recorder.finalize()
                    self.assertEqual(key, started["key"])
                    self.assertTrue(fake.closed)
                    self.assertTrue(local_recording_abspath(key).is_file())

    async def test_resolve_uploaded_recording_path_requires_completed_file(self):
        self.egress.list_egress = AsyncMock(
            side_effect=[
                self.api.ListEgressResponse(
                    items=[
                        self.api.EgressInfo(
                            egress_id="egress-123",
                            status=self.api.EGRESS_ENDING,
                        )
                    ]
                ),
                self.api.ListEgressResponse(
                    items=[
                        self.api.EgressInfo(
                            egress_id="egress-123",
                            status=self.api.EGRESS_COMPLETE,
                            file_results=[
                                self.api.FileInfo(filename="Voice-agents/Recordings/done.ogg")
                            ],
                        )
                    ]
                ),
            ]
        )
        path = await resolve_uploaded_recording_path(
            {"recording_id": "done", "egress_id": "egress-123"},
            timeout_seconds=2,
        )
        self.assertEqual(path, "Voice-agents/Recordings/done.ogg")

    async def test_resolve_uploaded_recording_path_drops_failed_uploads(self):
        self.egress.list_egress = AsyncMock(
            return_value=self.api.ListEgressResponse(
                items=[
                    self.api.EgressInfo(
                        egress_id="egress-123",
                        status=self.api.EGRESS_FAILED,
                        error="S3 upload failed",
                    )
                ]
            )
        )
        path = await resolve_uploaded_recording_path(
            {"recording_id": "missing", "egress_id": "egress-123"},
            timeout_seconds=1,
        )
        self.assertIsNone(path)

    async def test_failed_egress_is_not_reported_as_a_recording(self):
        self.egress.start_room_composite_egress.return_value.status = self.api.EGRESS_FAILED
        self.assertIsNone(await start_recording(self.ctx))
        self.egress.stop_egress.assert_awaited_once()
        self.client.aclose.assert_awaited_once()

    async def test_cancellation_stops_pending_egress_and_closes_client(self):
        entered = asyncio.Event()
        async def poll(_request):
            entered.set()
            await asyncio.Future()
        self.egress.list_egress.side_effect = poll
        startup = asyncio.create_task(start_recording(self.ctx))
        await asyncio.wait_for(entered.wait(), timeout=1)
        startup.cancel()
        with self.assertRaises(asyncio.CancelledError):
            await startup
        self.egress.stop_egress.assert_awaited_once()
        self.client.aclose.assert_awaited_once()


if __name__ == "__main__":
    unittest.main()
