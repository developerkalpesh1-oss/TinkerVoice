import assert from "node:assert/strict";
import { test } from "node:test";

import { checkProductionServiceUrls } from "../../src/modules/system/readiness.service.js";

const hosted = {
  NODE_ENV: "production",
  DATABASE_URL: "postgresql://app:secret@db.example.com:5432/quickvoice",
  REDIS_URL: "rediss://default:secret@cache.example.com:6380",
};

test("production accepts hosted database and Redis URLs", () => {
  assert.deepEqual(checkProductionServiceUrls(hosted), { status: "ok" });
});

test("production names a localhost DATABASE_URL copied from dev config", () => {
  const result = checkProductionServiceUrls({
    ...hosted,
    DATABASE_URL: "postgresql://quickvoice:quickvoice@localhost:5432/quickvoice",
  });
  assert.equal(result.status, "error");
  assert.match(result.message ?? "", /DATABASE_URL points at a local host \(localhost\)/);
  assert.doesNotMatch(result.message ?? "", /quickvoice:quickvoice/);
});

test("production flags a loopback REDIS_URL and missing variables", () => {
  const loopback = checkProductionServiceUrls({ ...hosted, REDIS_URL: "redis://127.0.0.1:6379" });
  assert.equal(loopback.status, "error");
  assert.match(loopback.message ?? "", /REDIS_URL points at a local host \(127\.0\.0\.1\)/);

  const missing = checkProductionServiceUrls({ NODE_ENV: "production" });
  assert.equal(missing.status, "error");
  assert.equal(missing.message, "DATABASE_URL is not set; REDIS_URL is not set");
});

test("non-production environments are not affected by local development URLs", () => {
  const result = checkProductionServiceUrls({
    NODE_ENV: "development",
    DATABASE_URL: "postgresql://quickvoice:quickvoice@localhost:5432/quickvoice",
    REDIS_URL: "redis://localhost:6379",
  });
  assert.equal(result.status, "ok");
});
