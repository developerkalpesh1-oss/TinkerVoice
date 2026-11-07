import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import nodemailer from "nodemailer";

import { sendEmail } from "../src/lib/mailer.js";

const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;
const originalCreateTransport = nodemailer.createTransport;

afterEach(() => {
  process.env = { ...originalEnv };
  globalThis.fetch = originalFetch;
  nodemailer.createTransport = originalCreateTransport;
});

function setSmtpEmailEnv() {
  process.env.SMTP_HOST = "smtp.zeptomail.in";
  process.env.SMTP_PORT = "587";
  process.env.SMTP_USERNAME = "emailapikey";
  process.env.SMTP_PASSWORD = "test-token";
  process.env.FROM_EMAIL = "no-reply@mail.tinkervoice.co";
  delete process.env.ZEPTOMAIL_TOKEN;
  delete process.env.ZEPTOMAIL_URL;
}

function setApiEmailEnv() {
  process.env.ZEPTOMAIL_URL = "smtp.zeptomail.in";
  process.env.ZEPTOMAIL_TOKEN = "test-token";
  process.env.FROM_EMAIL = "no-reply@mail.tinkervoice.co";
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_PORT;
  delete process.env.SMTP_USERNAME;
  delete process.env.SMTP_PASSWORD;
}

test("sendEmail uses SMTP when only SMTP credentials are configured", async () => {
  setSmtpEmailEnv();

  const transports: unknown[] = [];
  const messages: unknown[] = [];
  nodemailer.createTransport = ((options: unknown) => {
    transports.push(options);
    return {
      sendMail: async (message: unknown) => {
        messages.push(message);
        return { messageId: "smtp-test" };
      },
    };
  }) as typeof nodemailer.createTransport;
  globalThis.fetch = (async () => {
    throw new Error("fetch should not be called for SMTP credentials");
  }) as typeof fetch;

  await sendEmail(
    "verifyEmail",
    "ada@example.com",
    "https://console.tinkervoice.co/verify",
    "Ada",
  );

  assert.deepEqual(transports[0], {
    host: "smtp.zeptomail.in",
    port: 587,
    secure: false,
    auth: {
      user: "emailapikey",
      pass: "test-token",
    },
  });
  const message = messages[0] as {
    from: { address: string; name: string };
    to: Array<{ address: string; name: string }>;
    subject: string;
    text: string;
    html: string;
  };
  assert.deepEqual(message.from, {
    address: "no-reply@mail.tinkervoice.co",
    name: "Console|Quickvoice",
  });
  assert.deepEqual(message.to, [{ address: "ada@example.com", name: "Ada" }]);
  assert.equal(message.subject, "Verify your TinkerVoice email");
  assert.equal(
    message.text,
    [
      "Hi Ada,",
      "",
      "Confirm your email address to finish setting up your TinkerVoice account.",
      "",
      "Verify email: https://console.tinkervoice.co/verify",
    ].join("\n"),
  );
  assert.match(message.html, /Verify your email/);
});

test("sendEmail derives the ZeptoMail API endpoint from the SMTP host", async () => {
  setApiEmailEnv();

  const calls: Array<{ url: string; init?: RequestInit }> = [];
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init });
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;

  await sendEmail(
    "verifyEmail",
    "ada@example.com",
    "https://console.tinkervoice.co/verify",
    "Ada",
  );

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.zeptomail.in/v1.1/email");
  assert.equal(calls[0].init?.method, "POST");
  const headers = calls[0].init?.headers as Record<string, string>;
  assert.equal(headers.Authorization, "zoho-enczapikey test-token");
});

test("sendEmail rejects with a controlled error when SMTP transport fails", async () => {
  setSmtpEmailEnv();
  nodemailer.createTransport = (() =>
    ({
      sendMail: async () => {
        throw new Error("SMTP down");
      },
    }) as ReturnType<typeof nodemailer.createTransport>) as typeof nodemailer.createTransport;

  await assert.rejects(
    sendEmail(
      "resetPassword",
      "ada@example.com",
      "https://console.tinkervoice.co/reset",
      "Ada",
    ),
    /Failed to send resetPassword email via SMTP: SMTP down/,
  );
});
