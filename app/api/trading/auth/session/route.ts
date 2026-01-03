import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  ADMIN_SESSION_COOKIE,
  getAllowedAdminEmails,
  verifyAdminSessionToken,
} from "@/lib/trading/admin-auth";
import { getTradingSessionSecret } from "@/lib/trading/runtime-secrets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const sessionSecret = getTradingSessionSecret();
  if (!sessionSecret) {
    return NextResponse.json({ ok: false, error: "Session secret is not configured." }, { status: 500 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? "";
  const session = token ? verifyAdminSessionToken({ token, secret: sessionSecret }) : null;
  if (!session) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const allowed = getAllowedAdminEmails();
  if (!allowed.has(session.email)) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  return NextResponse.json({ ok: true, email: session.email, exp: session.exp }, { status: 200 });
}
