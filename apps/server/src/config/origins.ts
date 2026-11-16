const trimTrailingSlashes = (url: string) => url.replace(/\/+$/, "");

const splitOrigins = (value?: string) =>
  value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

export const serverBaseUrl = trimTrailingSlashes(
  process.env.SERVER_URL ?? process.env.BETTER_AUTH_URL ?? "http://localhost:5000",
);

export const isSecureServerUrl = serverBaseUrl.startsWith("https://");

// The deployed Console is always allowed, even when CONSOLE_URL is missing or
// stale in the hosting env. Better Auth uses this list for origin checks, and
// the console CORS middleware uses it for credentialed API requests.
export const PRODUCTION_CONSOLE_ORIGIN = "https://tinker-voice.vercel.app";

// Local Console dev servers (next dev defaults to port 3000).
export const LOCAL_CONSOLE_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// Local Console origins are trusted outside production, or when
// CONSOLE_ALLOW_LOCALHOST_ORIGINS=true is set (e.g. a local Console pointed at
// a deployed server). Leave the flag unset in real production: a local page
// with credentials would otherwise be able to call the API as a signed-in user.
export function buildTrustedOrigins(env: NodeJS.ProcessEnv = process.env): string[] {
  const allowLocalConsole =
    env.CONSOLE_ALLOW_LOCALHOST_ORIGINS === "true" || env.NODE_ENV !== "production";

  return Array.from(
    new Set(
      [
        PRODUCTION_CONSOLE_ORIGIN,
        ...(allowLocalConsole ? LOCAL_CONSOLE_ORIGINS : []),
        ...splitOrigins(env.CONSOLE_URL),
        ...splitOrigins(env.WEB_URL),
        ...splitOrigins(env.DOCS_URL),
        ...splitOrigins(env.CORS_ORIGINS),
        serverBaseUrl,
      ].map(trimTrailingSlashes),
    ),
  );
}

export const trustedOrigins = buildTrustedOrigins();
