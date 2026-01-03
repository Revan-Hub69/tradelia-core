import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_SESSION_COOKIE,
  getAllowedAdminEmails,
  verifyAdminSessionToken,
} from "@/lib/trading/admin-auth";
import { getTradingSessionSecret } from "@/lib/trading/runtime-secrets";
import { TradingLoginClient } from "./login-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trading Login",
  description: "Accesso amministrazione (OTP) alla dashboard di trading.",
};

export default async function TradingLoginPage() {
  const sessionSecret = getTradingSessionSecret();
  if (sessionSecret) {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? "";
    const session = token ? verifyAdminSessionToken({ token, secret: sessionSecret }) : null;
    if (session && getAllowedAdminEmails().has(session.email)) {
      redirect("/dashboard/trading");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="mx-auto flex max-w-5xl justify-center px-6 py-20 sm:px-8 sm:py-32">
        <TradingLoginClient />
      </main>
    </div>
  );
}
