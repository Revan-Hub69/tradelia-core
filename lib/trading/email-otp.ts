import "server-only";

import { createHmac, randomInt, timingSafeEqual } from "crypto";

import nodemailer from "nodemailer";

export const ADMIN_EMAIL_OTP_COOKIE = "tradelia_admin_email_otp";

type EmailOtpPayloadV1 = {
  v: 1;
  email: string;
  hash: string;
  exp: number;
};

const lastSentAtByEmail = new Map<string, number>();
let cachedTransport: nodemailer.Transporter | null = null;

export function getEmailOtpTtlSeconds() {
  const raw = process.env.TRADING_EMAIL_OTP_TTL_SECONDS;
  const parsed = raw ? Number(raw) : 600; // 10 minutes
  if (!Number.isFinite(parsed) || parsed <= 30 || parsed > 3600) return 600;
  return Math.floor(parsed);
}

export function getEmailOtpMinIntervalSeconds() {
  const raw = process.env.TRADING_EMAIL_OTP_MIN_INTERVAL_SECONDS;
  const parsed = raw ? Number(raw) : 30;
  if (!Number.isFinite(parsed) || parsed < 5 || parsed > 600) return 30;
  return Math.floor(parsed);
}

export async function requestEmailOtp({
  email,
  sessionSecret,
  nowMs = Date.now(),
}: {
  email: string;
  sessionSecret: string;
  nowMs?: number;
}): Promise<{ ttlSeconds: number; token: string; devCode?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) throw new Error("Email is required.");

  const ttlSeconds = getEmailOtpTtlSeconds();
  const minIntervalMs = getEmailOtpMinIntervalSeconds() * 1000;

  const lastSentAtMs = lastSentAtByEmail.get(normalizedEmail) ?? 0;
  if (lastSentAtMs > 0 && nowMs - lastSentAtMs < minIntervalMs) {
    throw new Error("Please wait before requesting a new code.");
  }
  lastSentAtByEmail.set(normalizedEmail, nowMs);

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const expSeconds = Math.floor((nowMs + ttlSeconds * 1000) / 1000);

  const payload: EmailOtpPayloadV1 = {
    v: 1,
    email: normalizedEmail,
    hash: hmacSha256Base64Url(sessionSecret, `${normalizedEmail}:${code}`),
    exp: expSeconds,
  };
  const token = signToken(sessionSecret, payload);

  const deliveryConfigured = Boolean(
    (process.env.TRADING_SMTP_URL?.trim() ?? "") ||
      (process.env.BREVO_API_KEY?.trim() ?? "") ||
      (process.env.RESEND_API_KEY?.trim() ?? ""),
  );

  await sendOtpEmail({ to: normalizedEmail, code, ttlSeconds });

  const devCode = process.env.NODE_ENV !== "production" && !deliveryConfigured ? code : undefined;
  return devCode ? { ttlSeconds, token, devCode } : { ttlSeconds, token };
}

export function verifyEmailOtp({
  email,
  code,
  token,
  sessionSecret,
  nowMs = Date.now(),
}: {
  email: string;
  code: string;
  token: string;
  sessionSecret: string;
  nowMs?: number;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCode = code.trim().replaceAll(" ", "");
  if (!/^[0-9]{6}$/.test(normalizedCode)) return false;
  if (!token) return false;

  const payload = verifyToken<EmailOtpPayloadV1>(sessionSecret, token);
  if (!payload || payload.v !== 1) return false;
  if (payload.email !== normalizedEmail) return false;

  const nowSeconds = Math.floor(nowMs / 1000);
  if (payload.exp <= nowSeconds) return false;

  const expectedHash = hmacSha256Base64Url(sessionSecret, `${normalizedEmail}:${normalizedCode}`);
  return timingSafeEqualsAscii(payload.hash, expectedHash);
}

function signToken(secret: string, payload: EmailOtpPayloadV1) {
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(Buffer.from(payloadJson, "utf-8"));
  const signature = hmacSha256Base64Url(secret, payloadB64);
  return `${payloadB64}.${signature}`;
}

function verifyToken<T>(secret: string, token: string): T | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, signatureB64] = parts;
  if (!payloadB64 || !signatureB64) return null;

  const expected = hmacSha256Base64Url(secret, payloadB64);
  if (!timingSafeEqualsAscii(expected, signatureB64)) return null;

  const bytes = base64UrlDecode(payloadB64);
  if (!bytes) return null;

  try {
    return JSON.parse(Buffer.from(bytes).toString("utf-8")) as T;
  } catch {
    return null;
  }
}

async function sendOtpEmail({ to, code, ttlSeconds }: { to: string; code: string; ttlSeconds: number }) {
  const smtpUrl = process.env.TRADING_SMTP_URL?.trim() ?? "";
  const resendApiKey = process.env.RESEND_API_KEY?.trim() ?? "";
  const brevoApiKey = process.env.BREVO_API_KEY?.trim() ?? "";

  const emailFrom =
    process.env.TRADING_EMAIL_FROM?.trim() ||
    process.env.TRADING_ADMIN_EMAILS?.split(",")?.[0]?.trim() ||
    "amministrazione@tradelia.org";

  const subjectPrefix = (process.env.TRADING_EMAIL_SUBJECT_PREFIX ?? "[Tradelia]").trim();
  const subject = `${subjectPrefix} OTP accesso trading`;

  const text = [
    "Codice OTP per accesso Trading:",
    "",
    code,
    "",
    `Scade tra ${Math.ceil(ttlSeconds / 60)} minuti.`,
    "",
    "Se non sei stato tu, ignora questa email.",
  ].join("\n");

  if (smtpUrl) {
    const transporter = getTransporter(smtpUrl);
    await transporter.sendMail({ from: emailFrom, to, subject, text });
    return;
  }

  if (brevoApiKey) {
    const { name, email } = parseFrom(emailFrom);
    await sendWithBrevo({ apiKey: brevoApiKey, to, fromName: name, fromEmail: email, subject, text });
    return;
  }

  if (resendApiKey) {
    await sendWithResend({ apiKey: resendApiKey, to, from: emailFrom, subject, text });
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    process.stdout.write(`[tradelia] DEV email OTP for ${to}: ${code} (ttl ${ttlSeconds}s)\n`);
    return;
  }

  throw new Error(
    "Email OTP is not configured (set BREVO_API_KEY or RESEND_API_KEY, or TRADING_SMTP_URL).",
  );
}

function getTransporter(smtpUrl: string) {
  if (cachedTransport) return cachedTransport;
  cachedTransport = nodemailer.createTransport(smtpUrl);
  return cachedTransport;
}

function parseFrom(value: string) {
  const trimmed = value.trim();
  const match = /^(.*)<([^>]+)>$/.exec(trimmed);
  if (!match) return { name: "Tradelia", email: trimmed };
  const name = match[1]?.trim().replaceAll(/^"|"$/g, "") || "Tradelia";
  const email = match[2]?.trim() || "amministrazione@tradelia.org";
  return { name, email };
}

async function sendWithResend({
  apiKey,
  to,
  from,
  subject,
  text,
}: {
  apiKey: string;
  to: string;
  from: string;
  subject: string;
  text: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend error (${res.status}): ${body || res.statusText}`);
  }
}

async function sendWithBrevo({
  apiKey,
  to,
  fromName,
  fromEmail,
  subject,
  text,
}: {
  apiKey: string;
  to: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  text: string;
}) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: fromName, email: fromEmail },
      to: [{ email: to }],
      subject,
      textContent: text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Brevo error (${res.status}): ${body || res.statusText}`);
  }
}

function base64UrlEncode(buffer: Buffer) {
  return buffer
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(value: string): Uint8Array | null {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  try {
    return Buffer.from(normalized + padding, "base64");
  } catch {
    return null;
  }
}

function hmacSha256Base64Url(secret: string, input: string) {
  const digest = createHmac("sha256", secret).update(input).digest("base64");
  return digest.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function timingSafeEqualsAscii(a: string, b: string) {
  const left = Buffer.from(a, "utf-8");
  const right = Buffer.from(b, "utf-8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

