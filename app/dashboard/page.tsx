import type { Metadata } from "next";

import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Snapshot di mercato, regime deterministico e output AI (Groq).",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="mx-auto max-w-5xl px-6 py-20 sm:px-8 sm:py-32">
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Dashboard
            </p>
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Regime (gate) + AI decider
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground">
              Il regime è deterministico e decide cosa è ammesso. L&apos;AI riceve solo i setup
              consentiti.
            </p>
          </div>

          <DashboardClient />

          <div className="surface-card p-6 text-sm text-muted-foreground">
            Materiale tecnico per test interno. Nessun consiglio operativo.
          </div>
        </div>
      </main>
    </div>
  );
}

