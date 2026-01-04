import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { isTradingEnabled } from "@/lib/trading/trading-enabled";
import { DashboardLayout } from "@/components/dashboard/layout";
import { ModernDashboard } from "./modern-dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trading Dashboard",
  description: "Professional trading dashboard with regime analysis, universe screening, and AI insights.",
};

export default function TradingDashboardPage() {
  const enabled = isTradingEnabled();

  // Redirect automatico in produzione
  if (!enabled) {
    redirect("/");
  }

  return (
    <DashboardLayout>
      <ModernDashboard />
    </DashboardLayout>
  );
}
