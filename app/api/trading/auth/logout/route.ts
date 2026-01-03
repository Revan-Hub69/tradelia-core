import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/trading/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}

