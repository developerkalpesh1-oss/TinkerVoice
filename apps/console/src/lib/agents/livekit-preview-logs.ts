import { getLogger } from "livekit-client";

const EXPECTED_DATACHANNEL_CLOSE =
  /DataChannel error on (lossy|reliable)|publisher data channel '[^']+' closed unexpectedly/;

let installed = false;

/**
 * LiveKit logs SCTP "User-Initiated Abort" when a preview room is deleted.
 * Those closes are expected. Next.js turns the console.error into an overlay.
 */
export function ignoreExpectedLiveKitDisconnectLogs(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;
  const logger = getLogger("livekit-engine");
  const originalFactory = logger.methodFactory;
  logger.methodFactory = (methodName, level, name) => {
    const rawMethod = originalFactory(methodName, level, name);
    return (message?: unknown, context?: unknown) => {
      if (
        typeof message === "string" &&
        EXPECTED_DATACHANNEL_CLOSE.test(message)
      ) {
        return;
      }
      if (context === undefined) rawMethod(message);
      else rawMethod(message, context);
    };
  };
  logger.setLevel(logger.getLevel());
}
