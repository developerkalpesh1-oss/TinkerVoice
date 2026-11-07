import assert from "node:assert/strict";
import { test } from "node:test";

import { BadRequestError } from "../../src/common/errors/badRequest.js";
import { assertSafeRemoteUrl } from "../../src/lib/url-safety.js";

test("assertSafeRemoteUrl rejects hosts that resolve to private addresses", async () => {
  await assert.rejects(
    assertSafeRemoteUrl("https://metadata.tinkervoice.test/hook", {
      lookup: async () => [{ address: "169.254.169.254", family: 4 }],
    }),
    BadRequestError
  );
});

test("assertSafeRemoteUrl accepts public HTTPS destinations", async () => {
  await assert.doesNotReject(
    assertSafeRemoteUrl("https://api.example.com/hook", {
      lookup: async () => [{ address: "93.184.216.34", family: 4 }],
    })
  );
});
