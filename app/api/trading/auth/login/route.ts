import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAllowedAdminEmails,
  verifyTotp,
} from "@/lib/trading/admin-auth";
import { ADMIN_EMAIL_OTP_COOKIE, verifyEmailOtp } from "@/lib/trading/email-otp";
import { getTradingSessionSecret } from "@/lib/trading/runtime-secrets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LoginBody = {
  email?: unknown;
  otp?: unknown;
};

export async function POST(request: Request) {
  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const otp = typeof body.otp === "string" ? body.otp.trim() : "";

  const allowedEmails = getAllowedAdminEmails();
  if (!allowedEmails.has(email)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const sessionSecret = getTradingSessionSecret();
  if (!sessionSecret) {
    return NextResponse.json({ error: "Session secret is not configured." }, { status: 500 });
  }

  const cookieStore = await cookies();
  const otpToken = cookieStore.get(ADMIN_EMAIL_OTP_COOKIE)?.value ?? "";

  const totpSecret = process.env.TRADING_ADMIN_OTP_SECRET;
  const okTotp = totpSecret ? verifyTotp({ base32Secret: totpSecret, code: otp, digits: 6, window: 1 }) : false;
  const okEmailOtp = verifyEmailOtp({ email, code: otp, token: otpToken, sessionSecret });
  const ok = okTotp || okEmailOtp;
  if (!ok) {
    return NextResponse.json({ error: "Invalid OTP." }, { status: 401 });
  }

  const ttlSeconds = 60 * 60 * 12; // 12h
  const token = createAdminSessionToken({ email, secret: sessionSecret, ttlSeconds });

  const response = NextResponse.json({ ok: true, ttlSeconds }, { status: 200 });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ttlSeconds,
  });

  response.cookies.set(ADMIN_EMAIL_OTP_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
