import assert from "node:assert/strict";
import { test } from "node:test";
import type { AddressInfo } from "node:net";
import express from "express";
import cors from "cors";
import { PRODUCTION_CONSOLE_ORIGIN, trustedOrigins } from "../../src/config/origins.js";

test("the deployed Console origin is always trusted", () => {
  assert.equal(PRODUCTION_CONSOLE_ORIGIN, "https://tinker-voice.vercel.app");
  assert.ok(trustedOrigins.includes(PRODUCTION_CONSOLE_ORIGIN));
});

// Mirrors the console CORS options in src/index.ts so the preflight contract is
// checked without starting Redis, Prisma or the queue workers.
test("credentialed preflight from the Console origin succeeds before routes run", async () => {
  const app = express();
  app.use(
    cors({
      origin: trustedOrigins,
      methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      credentials: true,
      optionsSuccessStatus: 204,
      maxAge: 600,
    }),
  );
  app.post("/api/v1/auth/sign-in/email", (_req, res) => {
    res.status(401).json({ success: false });
  });

  const server = app.listen(0);
  try {
    const { port } = server.address() as AddressInfo;
    const base = `http://127.0.0.1:${port}/api/v1/auth/sign-in/email`;

    const preflight = await fetch(base, {
      method: "OPTIONS",
      headers: {
        Origin: PRODUCTION_CONSOLE_ORIGIN,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type,x-api-key",
      },
    });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get("access-control-allow-origin"), PRODUCTION_CONSOLE_ORIGIN);
    assert.equal(preflight.headers.get("access-control-allow-credentials"), "true");
    assert.match(preflight.headers.get("access-control-allow-methods") ?? "", /POST/);
    assert.match(preflight.headers.get("access-control-allow-headers") ?? "", /content-type/i);

    const actual = await fetch(base, {
      method: "POST",
      headers: { Origin: PRODUCTION_CONSOLE_ORIGIN, "Content-Type": "application/json" },
      body: "{}",
    });
    assert.equal(actual.status, 401);
    assert.equal(actual.headers.get("access-control-allow-origin"), PRODUCTION_CONSOLE_ORIGIN);

    const foreign = await fetch(base, {
      method: "OPTIONS",
      headers: {
        Origin: "https://evil.example",
        "Access-Control-Request-Method": "POST",
      },
    });
    assert.equal(foreign.headers.get("access-control-allow-origin"), null);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("local Console origins are trusted only when allowed", async () => {
  const { buildTrustedOrigins, LOCAL_CONSOLE_ORIGINS } = await import(
    "../../src/config/origins.js"
  );
  const prod = { NODE_ENV: "production" } as NodeJS.ProcessEnv;
  for (const origin of LOCAL_CONSOLE_ORIGINS) {
    assert.equal(buildTrustedOrigins(prod).includes(origin), false);
    assert.equal(
      buildTrustedOrigins({ ...prod, CONSOLE_ALLOW_LOCALHOST_ORIGINS: "true" }).includes(origin),
      true,
    );
    assert.equal(buildTrustedOrigins({ NODE_ENV: "development" } as NodeJS.ProcessEnv).includes(origin), true);
  }
  assert.ok(buildTrustedOrigins(prod).includes(PRODUCTION_CONSOLE_ORIGIN));
});
