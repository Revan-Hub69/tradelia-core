import fs from "fs";
import path from "path";
import { VerificationForm } from "./verification-form";

type PlatformPlan = {
  id: string;
  name: string;
  technicalLevel: "low" | "medium" | "high";
  custodyModel: "custodial" | "self";
  supportsTrading: boolean;
  supportsLeverage: boolean;
  feeTransparency: "high" | "medium" | "low";
  costs: {
    commissions: string;
    spread: string;
    funding: string;
  };
  support: {
    channels: string[];
    knownIssues: string[];
  };
  sources: { label: string; url: string }[];
};

type Platform = {
  id: string;
  name: string;
  type: "broker" | "exchange" | "wallet" | "account" | "derivatives";
  regions: string[];
  plans: PlatformPlan[];
};

type PlatformCatalog = {
  version: string;
  asOf: string;
  note: string;
  platforms: Platform[];
};

function loadPlatformCatalog(): PlatformCatalog {
  const filePath = path.join(process.cwd(), "public", "platforms.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as PlatformCatalog;
}

type VerifyPageProps = {
  searchParams?: {
    objective?: string;
  };
};

export default function VerifyPage({ searchParams }: VerifyPageProps) {
  const catalog = loadPlatformCatalog();
  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="mx-auto max-w-5xl px-6 py-20 sm:px-8 sm:py-32">
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Verifica guidata
            </p>
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Verifica di compatibilità
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground">
              L'utente non è mai valutato. Lo strumento sì. Questa verifica riduce
              errori strutturali prima di qualsiasi decisione.
            </p>
          </div>

          <VerificationForm
            initialObjective={searchParams?.objective}
            catalog={catalog}
          />

          <div className="surface-card p-6 text-sm text-muted-foreground">
            Materiale educativo e informativo. Nessun consiglio operativo. Non è consulenza finanziaria regolamentata.
          </div>
        </div>
      </main>
    </div>
  );
}
