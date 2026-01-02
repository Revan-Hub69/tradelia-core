"use client";

import { useMemo, useState } from "react";

type Objective = "tradizionali" | "passivi" | "trading" | "cripto";
type Experience = "beginner" | "experienced";
type Priority = "costi" | "semplicita" | "sicurezza";

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

type Candidate = {
  id: string;
  platformName: string;
  platformType: Platform["type"];
  planName: string;
  regions: string[];
  score: number;
  tone: "ok" | "warn" | "stop";
  reasons: string[];
  sources: { label: string; url: string }[];
};

const objectives: { id: Objective; label: string; micro: string }[] = [
  { id: "tradizionali", label: "Investimenti tradizionali", micro: "strumenti standard, tutele piu chiare" },
  { id: "passivi", label: "Investimenti passivi", micro: "poco tempo, regole chiare" },
  { id: "trading", label: "Trading", micro: "piu frequente, piu rischi" },
  { id: "cripto", label: "Cripto", micro: "prima comprare, poi capire bene" },
];

function platformTypeLabel(type: Platform["type"]) {
  if (type === "broker") return "Broker";
  if (type === "exchange") return "Exchange";
  if (type === "wallet") return "Wallet";
  if (type === "account") return "Conto";
  return "Derivati";
}

function toneBadge(tone: Candidate["tone"]) {
  if (tone === "ok") return { label: "PIU ADATTO", className: "status-ok" };
  if (tone === "warn") return { label: "CON FRIZIONE", className: "status-attention" };
  return { label: "NON ADATTO", className: "status-risk" };
}

function scoreCandidate({
  objective,
  experience,
  priority,
  platform,
  plan,
}: {
  objective: Objective;
  experience: Experience;
  priority: Priority;
  platform: Platform;
  plan: PlatformPlan;
}): Omit<Candidate, "id" | "platformName" | "platformType" | "planName" | "regions" | "sources"> {
  const reasons: string[] = [];
  let tone: Candidate["tone"] = "ok";
  let score = 100;

  const isBeginner = experience === "beginner";

  const penalize = (amount: number, reason: string, nextTone?: Candidate["tone"]) => {
    score -= amount;
    reasons.push(reason);
    if (nextTone && (tone === "ok" || (tone === "warn" && nextTone === "stop"))) {
      tone = nextTone;
    }
  };

  if (platform.type === "derivatives") {
    penalize(120, "Derivati: gestione attiva e rischio operativo piu alto.", "stop");
  }

  if (objective === "trading" && !plan.supportsTrading) {
    penalize(120, "Non supporta l'operativita necessaria per trading.", "stop");
  }

  if ((objective === "passivi" || objective === "tradizionali") && plan.supportsLeverage) {
    penalize(120, "La leva non e coerente con un obiettivo passivo/tradizionale.", "stop");
  }

  if (objective === "tradizionali") {
    if (platform.type === "wallet") penalize(120, "Un wallet non e uno strumento di investimento tradizionale.", "stop");
    if (platform.type === "exchange") penalize(35, "Ambiente cripto: complessita non necessaria.", "warn");
    if (platform.type === "account") penalize(25, "Conto/parcheggio: non e un piano di investimento.", "warn");
  }

  if (objective === "cripto") {
    if (platform.type === "account") penalize(120, "Non consente acquisto cripto.", "stop");
    if (platform.type === "wallet") penalize(30, "Per acquistare serve anche un intermediario/on-ramp.", "warn");
  }

  if (objective === "passivi") {
    if (platform.type === "exchange" || platform.type === "wallet") penalize(25, "Può introdurre complessita non necessaria.", "warn");
    if (plan.supportsTrading) penalize(15, "Orientato all'operativita: potrebbe essere overkill.", "warn");
  }

  if (isBeginner && plan.technicalLevel === "high") penalize(25, "Livello tecnico alto: frizione per chi inizia.", "warn");
  if (isBeginner && plan.supportsLeverage) penalize(120, "Leva: non coerente per chi inizia.", "stop");

  if (priority === "costi") {
    if (plan.feeTransparency === "low") penalize(25, "Trasparenza costi bassa: serve verifica puntuale.", "warn");
    if (plan.feeTransparency === "medium") penalize(12, "Trasparenza costi non massima.", "warn");
  }

  if (priority === "semplicita") {
    if (plan.technicalLevel === "high") penalize(18, "Complessita alta: aumenta errori procedurali.", "warn");
    if (platform.type === "exchange") penalize(10, "Procedura operativa piu complessa del necessario.", "warn");
  }

  if (priority === "sicurezza") {
    if (plan.custodyModel === "self" && isBeginner) penalize(18, "Self-custody: responsabilita tecnica e procedure.", "warn");
    if (plan.support.knownIssues.length > 0) penalize(8, "Problemi noti di supporto: da verificare.", "warn");
  }

  score = Math.max(-999, score);
  return { score, tone, reasons };
}

function pickTop(candidates: Candidate[]) {
  const toneRank: Record<Candidate["tone"], number> = { ok: 0, warn: 1, stop: 2 };
  const sorted = [...candidates].sort((a, b) => {
    const t = toneRank[a.tone] - toneRank[b.tone];
    if (t !== 0) return t;
    const s = b.score - a.score;
    if (s !== 0) return s;
    return a.platformName.localeCompare(b.platformName);
  });

  const primary = sorted.find((c) => c.tone !== "stop") ?? null;
  const alternates = sorted.filter((c) => c.tone !== "stop" && c.id !== primary?.id).slice(0, 2);
  return { primary, alternates };
}

export function FinderPreview({ catalog }: { catalog: PlatformCatalog }) {
  const [objective, setObjective] = useState<Objective | "">("");
  const [experience, setExperience] = useState<Experience>("beginner");
  const [priority, setPriority] = useState<Priority>("semplicita");

  const candidates = useMemo(() => {
    if (!objective) return [];
    const list: Candidate[] = [];
    for (const platform of catalog.platforms) {
      for (const plan of platform.plans) {
        const scored = scoreCandidate({
          objective,
          experience,
          priority,
          platform,
          plan,
        });
        list.push({
          id: `${platform.id}:${plan.id}`,
          platformName: platform.name,
          platformType: platform.type,
          planName: plan.name,
          regions: platform.regions,
          score: scored.score,
          tone: scored.tone,
          reasons: scored.reasons,
          sources: plan.sources,
        });
      }
    }
    return list;
  }, [catalog.platforms, experience, objective, priority]);

  const picked = useMemo(() => pickTop(candidates), [candidates]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="surface-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Trova il piano giusto</p>
        <h2 className="mt-3 text-xl font-semibold text-foreground">Dimmi cosa vuoi fare. Io filtro le opzioni.</h2>

        <div className="mt-6 space-y-5">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Obiettivo</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {objectives.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="choice-card"
                  data-selected={objective === o.id}
                  aria-pressed={objective === o.id}
                  onClick={() => setObjective(o.id)}
                >
                  <p className="text-sm font-semibold text-foreground">{o.label}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{o.micro}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Esperienza</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="btn-secondary w-full"
                  aria-pressed={experience === "beginner"}
                  onClick={() => setExperience("beginner")}
                >
                  Inizio
                </button>
                <button
                  type="button"
                  className="btn-secondary w-full"
                  aria-pressed={experience === "experienced"}
                  onClick={() => setExperience("experienced")}
                >
                  Ho gia esperienza
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Priorita</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {([
                  { id: "semplicita", label: "Semplicita" },
                  { id: "costi", label: "Costi" },
                  { id: "sicurezza", label: "Sicurezza" },
                ] as const).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="btn-secondary w-full px-3 py-2 text-xs"
                    aria-pressed={priority === p.id}
                    onClick={() => setPriority(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Demo con catalogo di esempio. In produzione, ogni campo deve avere fonte, data e copertura.
          </p>
        </div>
      </div>

      <div className="surface-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Risultato</p>

        {!objective && (
          <div className="mt-4 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Seleziona un obiettivo per vedere una proposta.</h3>
            <p className="text-sm text-muted-foreground">
              Output: 1 scelta piu adatta + 2 alternative, con motivi e fonti.
            </p>
          </div>
        )}

        {objective && !picked.primary && (
          <div className="mt-4 space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Nessun match affidabile.</h3>
            <p className="text-sm text-muted-foreground">Con i vincoli selezionati non emerge un piano non-contraddittorio.</p>
          </div>
        )}

        {picked.primary && (
          <div className="mt-4 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {picked.primary.platformName} · {picked.primary.planName}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{platformTypeLabel(picked.primary.platformType)}</p>
              </div>
              <span
                className={`${toneBadge(picked.primary.tone).className} inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]`}
              >
                {toneBadge(picked.primary.tone).label}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Perche</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {picked.primary.reasons.slice(0, 3).map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {picked.primary.sources.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Fonti</p>
                <ul className="space-y-1 text-sm">
                  {picked.primary.sources.slice(0, 2).map((s) => (
                    <li key={s.url}>
                      <a className="link-underline" href={s.url} target="_blank" rel="noreferrer">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {picked.alternates.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Alternative</p>
                <div className="space-y-2">
                  {picked.alternates.map((alt) => (
                    <div key={alt.id} className="flex items-center justify-between gap-4 rounded-lg border border-border/70 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {alt.platformName} · {alt.planName}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{platformTypeLabel(alt.platformType)}</p>
                      </div>
                      <span
                        className={`${toneBadge(alt.tone).className} inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]`}
                      >
                        {toneBadge(alt.tone).label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

