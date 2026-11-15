import { Telnyx } from "telnyx";

// Singleton Telnyx client. TELNYX_CONNECTION_ID is the SIP Connection that
// routes PSTN traffic to LiveKit; consumers should validate it is set before
// using any flow that attaches numbers to a connection.
export const telnyxClient = new Telnyx({
  apiKey: process.env.TELNYX_API_KEY!,
});

export const TELNYX_CONNECTION_ID = process.env.TELNYX_CONNECTION_ID ?? "";
