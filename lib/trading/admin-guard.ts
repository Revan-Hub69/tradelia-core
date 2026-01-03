import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  getAllowedAdminEmails,
  verifyAdminSessionToken,
} from "@/lib/trading/admin-auth";
import { getTradingSessionSecret } from "@/lib/trading/runtime-secrets";

export type AdminSession = {
  email: string;
  exp: number;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const sessionSecret = getTradingSessionSecret();
  if (!sessionSecret) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? "";
  if (!token) return null;

  const session = verifyAdminSessionToken({ token, secret: sessionSecret });
  if (!session) return null;

  const allowedEmails = getAllowedAdminEmails();
  if (!allowedEmails.has(session.email)) return null;

  return session;
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/dashboard/trading/login");
  return session;
}

export async function requireAdminApiSession(): Promise<{ session: AdminSession } | { response: NextResponse }> {
  const sessionSecret = getTradingSessionSecret();
  if (!sessionSecret) {
    return { response: NextResponse.json({ error: "Session secret is not configured." }, { status: 500 }) };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? "";
  const session = token ? verifyAdminSessionToken({ token, secret: sessionSecret }) : null;
  if (!session) {
    return { response: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  }

  const allowedEmails = getAllowedAdminEmails();
  if (!allowedEmails.has(session.email)) {
    return { response: NextResponse.json({ error: "Forbidden." }, { status: 403 }) };
  }

  return { session };
}
