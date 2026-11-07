import { AgentDispatchClient, RoomServiceClient, SipClient } from "livekit-server-sdk";

// SipClient expects an https:// host. LIVEKIT_URL is typically wss:// for the
// realtime SDK — normalize it here so callers can use the same env var.
const rawUrl = process.env.LIVEKIT_URL ?? "";
const httpHost = rawUrl.replace(/^wss:\/\//, "https://").replace(/^ws:\/\//, "http://");

export const livekitSipClient = new SipClient(
  httpHost,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

export const livekitAgentDispatchClient = new AgentDispatchClient(
  httpHost,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

export const livekitRoomServiceClient = new RoomServiceClient(
  httpHost,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

export const DEFAULT_LIVEKIT_AGENT_NAME = "tinkervoice-voice-agent";
export const LIVEKIT_AGENT_NAME = process.env.LIVEKIT_AGENT_NAME ?? DEFAULT_LIVEKIT_AGENT_NAME;

// Singleton trunk IDs — provisioned manually in LiveKit and pinned in env.
// One inbound trunk is shared by the whole app; outbound is split per provider
// because each outbound trunk stores provider-specific SIP credentials.
export const LIVEKIT_SIP_INBOUND_TRUNK_ID =
  process.env.LIVEKIT_SIP_INBOUND_TRUNK_ID ?? "";
export const LIVEKIT_SIP_OUTBOUND_TRUNK_TWILIO_ID =
  process.env.LIVEKIT_SIP_OUTBOUND_TRUNK_TWILIO_ID ?? "";
export const LIVEKIT_SIP_OUTBOUND_TRUNK_TELNYX_ID =
  process.env.LIVEKIT_SIP_OUTBOUND_TRUNK_TELNYX_ID ?? "";
