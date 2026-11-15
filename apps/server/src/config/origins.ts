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

export const trustedOrigins = Array.from(
  new Set(
    [
      PRODUCTION_CONSOLE_ORIGIN,
      ...splitOrigins(process.env.CONSOLE_URL),
      ...splitOrigins(process.env.WEB_URL),
      ...splitOrigins(process.env.DOCS_URL),
      ...splitOrigins(process.env.CORS_ORIGINS),
      serverBaseUrl,
    ].map(trimTrailingSlashes),
  ),
);
