import { NextResponse } from "next/server";

import { getAllowedAdminEmails } from "@/lib/trading/admin-auth";
import { ADMIN_EMAIL_OTP_COOKIE, requestEmailOtp } from "@/lib/trading/email-otp";
import { getTradingSessionSecret } from "@/lib/trading/runtime-secrets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RequestOtpBody = {
  email?: unknown;
};

export async function POST(request: Request) {
  let body: RequestOtpBody;
  try {
    body = (await request.json()) as RequestOtpBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const allowedEmails = getAllowedAdminEmails();
  if (!allowedEmails.has(email)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const sessionSecret = getTradingSessionSecret();
  if (!sessionSecret) {
    return NextResponse.json({ error: "Session secret is not configured." }, { status: 500 });
  }

  try {
    const { ttlSeconds, token, devCode } = await requestEmailOtp({ email, sessionSecret });
    const host = request.headers.get("host") ?? "";
    const includeDevCode = process.env.NODE_ENV !== "production" && isLocalhostHost(host) && typeof devCode === "string";

    const response = NextResponse.json(
      includeDevCode ? { ok: true, ttlSeconds, devCode } : { ok: true, ttlSeconds },
      { status: 200 },
    );

    response.cookies.set(ADMIN_EMAIL_OTP_COOKIE, token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ttlSeconds,
    });

    return response;
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : "Failed to send OTP.";
    const isRateLimit = rawMessage.toLowerCase().includes("wait");
    const status = isRateLimit ? 429 : 500;
    const message = process.env.NODE_ENV === "production" && !isRateLimit ? "Failed to send OTP." : rawMessage;
    return NextResponse.json({ error: message }, { status });
  }
}

function isLocalhostHost(host: string) {
  const normalized = host.trim().toLowerCase();
  return normalized.startsWith("localhost:") || normalized === "localhost" || normalized.startsWith("127.0.0.1:");
}
