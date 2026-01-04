import type { Metadata } from "next";

import { isTradingEnabled } from "@/lib/trading/trading-enabled";
import { DashboardClient } from "./dashboard-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trading Dashboard",
  description: "Brick 1–2 (regime 4h + universe) con WS locale, AI vincolata e configurazione locale.",
};

export default function TradingDashboardPage() {
  const enabled = isTradingEnabled();

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20">
        <div className="space-y-14">
          <header className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Trading</p>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Trading (local-first)</h1>
              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
                Brick 1–2: regime deterministico (4h) come gate + universe long/short (REST+WS) con output stabile per UX e AI.
              </p>
            </div>
            <div className="surface-divider h-px w-full" />
          </header>

          {enabled ? (
            <DashboardClient />
          ) : (
            <div className="surface-card p-6 text-sm text-muted-foreground">
              Trading dashboard disabilitata in produzione. Avvia in locale (npm run dev) oppure abilita con
              TRADING_ENABLED=true (es. VPS).
            </div>
          )}

          <div className="surface-card p-6 text-sm text-muted-foreground">
            Materiale tecnico per test interno. Nessun consiglio operativo.
          </div>
        </div>
      </main>
    </div>
  );
}
