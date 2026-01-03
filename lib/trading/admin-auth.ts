import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "tradelia_admin_session";

type SessionPayloadV1 = {
  v: 1;
  email: string;
  exp: number;
};

export function getAllowedAdminEmails() {
  const raw = process.env.TRADING_ADMIN_EMAILS ?? "amministrazione@tradelia.org";
  const emails = raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0);
  return new Set(emails);
}

export function createAdminSessionToken({
  email,
  secret,
  ttlSeconds,
  nowMs = Date.now(),
}: {
  email: string;
  secret: string;
  ttlSeconds: number;
  nowMs?: number;
}) {
  const nowSeconds = Math.floor(nowMs / 1000);
  const payload: SessionPayloadV1 = {
    v: 1,
    email: email.toLowerCase(),
    exp: nowSeconds + ttlSeconds,
  };
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(Buffer.from(payloadJson, "utf-8"));
  const signature = hmacSha256(secret, payloadB64);
  return `${payloadB64}.${signature}`;
}

export function verifyAdminSessionToken({
  token,
  secret,
  nowMs = Date.now(),
}: {
  token: string;
  secret: string;
  nowMs?: number;
}): { email: string; exp: number } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, signatureB64] = parts;
  if (!payloadB64 || !signatureB64) return null;

  const expected = hmacSha256(secret, payloadB64);
  if (!timingSafeEqualsAscii(expected, signatureB64)) return null;

  const payloadBytes = base64UrlDecode(payloadB64);
  if (!payloadBytes) return null;

  let payload: unknown;
  try {
    payload = JSON.parse(Buffer.from(payloadBytes).toString("utf-8")) as unknown;
  } catch {
    return null;
  }

  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Partial<SessionPayloadV1>;
  if (obj.v !== 1) return null;
  if (typeof obj.email !== "string" || obj.email.length === 0) return null;
  if (typeof obj.exp !== "number" || !Number.isFinite(obj.exp)) return null;

  const nowSeconds = Math.floor(nowMs / 1000);
  if (obj.exp <= nowSeconds) return null;

  return { email: obj.email, exp: obj.exp };
}

export function verifyTotp({
  base32Secret,
  code,
  periodSeconds = 30,
  digits = 6,
  nowMs = Date.now(),
  window = 1,
}: {
  base32Secret: string;
  code: string;
  periodSeconds?: number;
  digits?: number;
  nowMs?: number;
  window?: number;
}) {
  const normalized = code.trim();
  if (!/^[0-9]+$/.test(normalized)) return false;
  if (normalized.length !== digits) return false;

  const secretBytes = base32Decode(base32Secret);
  if (!secretBytes || secretBytes.length === 0) return false;

  const timeSeconds = Math.floor(nowMs / 1000);
  const counter = Math.floor(timeSeconds / periodSeconds);

  for (let offset = -window; offset <= window; offset += 1) {
    const candidate = hotp(secretBytes, counter + offset, digits);
    if (timingSafeEqualsAscii(candidate, normalized)) return true;
  }

  return false;
}

function hotp(secret: Uint8Array, counter: number, digits: number) {
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(counter));

  const digest = createHmac("sha1", Buffer.from(secret)).update(buffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const code =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const modulus = 10 ** digits;
  return String(code % modulus).padStart(digits, "0");
}

function hmacSha256(secret: string, input: string) {
  const digest = createHmac("sha256", secret).update(input).digest();
  return base64UrlEncode(digest);
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

function timingSafeEqualsAscii(a: string, b: string) {
  const left = Buffer.from(a, "utf-8");
  const right = Buffer.from(b, "utf-8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function base32Decode(value: string): Uint8Array | null {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleaned = value
    .trim()
    .replaceAll(" ", "")
    .replaceAll("-", "")
    .toUpperCase()
    .replaceAll("=", "");

  if (cleaned.length === 0) return null;

  let bits = 0;
  let bitCount = 0;
  const out: number[] = [];

  for (const char of cleaned) {
    const index = alphabet.indexOf(char);
    if (index === -1) return null;
    bits = (bits << 5) | index;
    bitCount += 5;
    while (bitCount >= 8) {
      bitCount -= 8;
      out.push((bits >> bitCount) & 0xff);
    }
  }

  return new Uint8Array(out);
}

