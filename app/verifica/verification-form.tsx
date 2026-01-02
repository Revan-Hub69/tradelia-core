"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";

type Tone = "ok" | "warn" | "stop";
type Step = "objective" | "avoid" | "level" | "loading" | "result";

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

type VerificationFormProps = {
  initialObjective?: string;
  catalog: PlatformCatalog;
};

type ResultItem = {
  id: string;
  platformName: string;
  platformType: Platform["type"];
  regions: string[];
  planName: string;
  tone: Tone;
  reasons: string[];
  why: string;
  commonMistake: string;
  doesNotMean: string;
  plan: PlatformPlan;
};

type ResultGroup = {
  title: string;
  tone: Tone;
  items: ResultItem[];
};

const objectiveOptions = [
  { value: "investire", label: "Iniziare a investire" },
  { value: "trading", label: "Fare trading" },
  { value: "sicurezza", label: "Tenere i soldi al sicuro" },
  { value: "capire", label: "Capire da dove partire" },
];

const avoidOptions = [
  { value: "rischio", label: "Perdere soldi senza capirne il motivo" },
  { value: "costi", label: "Costi poco chiari / costi nascosti" },
  { value: "regole", label: "Regole complicate" },
  { value: "custodia", label: "Problemi di custodia / sicurezza" },
  { value: "stress", label: "Stress e decisioni impulsive" },
];

const levelOptions = [
  { value: "mai", label: "Non ho mai iniziato" },
  { value: "poco", label: "Ho iniziato da poco" },
  { value: "errori", label: "Ho gia provato e ho fatto errori" },
  { value: "esperienza", label: "Ho gia esperienza ma voglio ridurre errori" },
];

function ToneBadge({ tone }: { tone: Tone }) {
  const label = tone === "ok" ? "ADATTO" : tone === "warn" ? "FRIZIONE" : "NON ADATTO";
  const className = tone === "ok" ? "status-ok" : tone === "warn" ? "status-attention" : "status-risk";

  return (
    <span
      className={`${className} inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]`}
    >
      {label}
    </span>
  );
}

function StepSingleSelect({
  title,
  options,
  value,
  onSelect,
  helperText,
  tooltip,
  tooltipBody,
}: {
  title: string;
  options: { value: string; label: string }[];
  value: string;
  onSelect: (value: string) => void;
  helperText?: string;
  tooltip?: string;
  tooltipBody?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
        </div>
        {tooltip && (
          <details className="accordion w-full sm:w-auto">
            <summary>{tooltip}</summary>
            <p className="mt-3 text-xs text-muted-foreground">
              {tooltipBody ?? "Lo chiediamo solo per evitare interpretazioni sbagliate del risultato."}
            </p>
          </details>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="choice-card"
            data-selected={value === option.value}
            aria-pressed={value === option.value}
            onClick={() => onSelect(option.value)}
          >
            <p className="text-sm font-semibold text-foreground">{option.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProgressLine({ step, steps }: { step: number; steps: number }) {
  const width = `${Math.round((step / steps) * 100)}%`;
  return (
    <div className="space-y-2">
      <div className="progress-line">
        <span style={{ width }} />
      </div>
      <p className="text-xs text-muted-foreground">solo {steps} step</p>
    </div>
  );
}

function platformTypeLabel(type: Platform["type"]) {
  if (type === "broker") return "Broker";
  if (type === "exchange") return "Exchange";
  if (type === "wallet") return "Wallet";
  if (type === "account") return "Conto";
  return "Derivati";
}

function technicalLabel(level: PlatformPlan["technicalLevel"]) {
  if (level === "low") return "basso";
  if (level === "medium") return "medio";
  return "alto";
}

function custodyLabel(model: PlatformPlan["custodyModel"]) {
  return model === "self" ? "self-custody" : "custodial";
}

function classifyPlan({
  platform,
  plan,
  objective,
  avoid,
  level,
}: {
  platform: Platform;
  plan: PlatformPlan;
  objective: string;
  avoid: string;
  level: string;
}): Pick<ResultItem, "tone" | "reasons" | "why" | "commonMistake" | "doesNotMean"> {
  const isBeginner = level === "mai" || level === "poco";
  const reasons: string[] = [];
  let tone: Tone = "ok";

  if (objective === "trading" && !plan.supportsTrading) {
    reasons.push("Non supporta l'operativita necessaria per fare trading.");
    tone = "stop";
  }

  if (objective !== "trading" && plan.supportsLeverage) {
    reasons.push("Include leva: aumenta complessita e gestione attiva anche se il tuo obiettivo non e trading.");
    if (tone !== "stop") tone = "warn";
  }

  if (plan.supportsLeverage) {
    if (isBeginner) {
      reasons.push("La leva amplifica errori e richiede esperienza operativa.");
      tone = "stop";
    }
    if (avoid === "stress" || avoid === "rischio") {
      reasons.push("La leva e incompatibile con cio che vuoi evitare in questo momento.");
      tone = "stop";
    }
  }

  if (objective === "sicurezza") {
    if (plan.supportsTrading) {
      reasons.push("E uno strumento orientato all'operativita: non nasce per sola custodia.");
      if (tone !== "stop") tone = "warn";
    }
    if (plan.custodyModel === "self" && isBeginner) {
      reasons.push("La self-custody richiede responsabilita tecnica e procedure di sicurezza.");
      if (tone !== "stop") tone = "warn";
    }
  }

  if (avoid === "costi" && (plan.feeTransparency === "low" || plan.feeTransparency === "medium")) {
    reasons.push("Trasparenza costi non massima: richiede verifica puntuale di tariffe e condizioni.");
    if (tone !== "stop") tone = "warn";
  }

  if (avoid === "regole" && plan.technicalLevel !== "low") {
    reasons.push("Richiede un livello tecnico non basso: aumenta rischio di errore procedurale.");
    if (tone !== "stop") tone = "warn";
  }

  if (avoid === "custodia" && plan.custodyModel === "self") {
    reasons.push("La self-custody sposta responsabilita e rischio operativo sull'utente.");
    if (tone !== "stop") tone = "warn";
  }

  if (objective === "capire" && isBeginner && plan.technicalLevel === "high") {
    reasons.push("Livello tecnico alto: puo introdurre frizione prima di aver chiarito l'obiettivo.");
    if (tone !== "stop") tone = "warn";
  }

  if (objective === "investire" && plan.supportsLeverage) {
    reasons.push("Per iniziare a investire, la leva introduce complessita non necessaria.");
    tone = "stop";
  }

  const whyParts: string[] = [];
  whyParts.push(`${platformTypeLabel(platform.type)}: ${platform.name} · Piano: ${plan.name}.`);
  whyParts.push(
    `Livello tecnico ${technicalLabel(plan.technicalLevel)}, custodia ${custodyLabel(plan.custodyModel)}.`
  );
  if (plan.supportsTrading) whyParts.push("Supporta operativita di trading.");
  if (plan.supportsLeverage) whyParts.push("Include leva.");
  if (!plan.supportsTrading) whyParts.push("Non e orientato al trading.");

  let commonMistake = "Sottovalutare i vincoli operativi leggendo solo il nome del prodotto.";
  if (plan.supportsLeverage) {
    commonMistake = "Confondere la leva con una scorciatoia: aumenta stress, errori e gestione attiva.";
  } else if (plan.custodyModel === "self") {
    commonMistake = "Pensare che piu controllo significhi automaticamente piu sicurezza, senza procedure.";
  } else if (avoid === "costi") {
    commonMistake = "Guardare solo la commissione e ignorare costi operativi e condizioni contrattuali.";
  } else if (avoid === "regole") {
    commonMistake = "Entrare su uno strumento complesso senza un processo minimo (checklist).";
  }

  const doesNotMean =
    tone === "stop"
      ? "Non significa che la piattaforma sia 'sbagliata'. Significa che, per il tuo profilo adesso, aumenta il rischio di errori comuni."
      : "Non significa che tu debba fare una scelta. Significa che questo piano introduce o riduce frizioni coerenti con il tuo profilo.";

  return {
    tone,
    reasons,
    why: whyParts.join(" "),
    commonMistake,
    doesNotMean,
  };
}

function buildResults(catalog: PlatformCatalog, objective: string, avoid: string, level: string): ResultGroup[] {
  const allItems: ResultItem[] = catalog.platforms.flatMap((platform) =>
    platform.plans.map((plan) => {
      const id = `${platform.id}:${plan.id}`;
      const details = classifyPlan({ platform, plan, objective, avoid, level });
      return {
        id,
        platformName: platform.name,
        platformType: platform.type,
        regions: platform.regions,
        planName: plan.name,
        plan,
        ...details,
      };
    })
  );

  const toneRank: Record<Tone, number> = { ok: 0, warn: 1, stop: 2 };
  const sorted = [...allItems].sort((a, b) => {
    const byTone = toneRank[a.tone] - toneRank[b.tone];
    if (byTone !== 0) return byTone;
    const byReasons = a.reasons.length - b.reasons.length;
    if (byReasons !== 0) return byReasons;
    return a.platformName.localeCompare(b.platformName);
  });

  const groups: ResultGroup[] = [
    { title: "Piu adatto adesso", tone: "ok", items: sorted.filter((item) => item.tone === "ok") },
    { title: "Adatto, ma con frizione", tone: "warn", items: sorted.filter((item) => item.tone === "warn") },
    { title: "Non adatto adesso", tone: "stop", items: sorted.filter((item) => item.tone === "stop") },
  ];

  return groups.filter((group) => group.items.length > 0);
}

export function VerificationForm({ initialObjective, catalog }: VerificationFormProps) {
  const allowedInitialObjective = useMemo(
    () =>
      initialObjective && objectiveOptions.some((option) => option.value === initialObjective)
        ? initialObjective
        : "",
    [initialObjective]
  );

  const [objective, setObjective] = useState(allowedInitialObjective);
  const [avoid, setAvoid] = useState("");
  const [level, setLevel] = useState("");
  const [step, setStep] = useState<Step>(allowedInitialObjective ? "avoid" : "objective");
  const timerRef = useRef<number | null>(null);

  const groups = useMemo(
    () => (step === "result" ? buildResults(catalog, objective, avoid, level) : []),
    [step, catalog, objective, avoid, level]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function handleObjective(value: string) {
    setObjective(value);
    setStep("avoid");
  }

  function handleAvoid(value: string) {
    setAvoid(value);
    setStep("level");
  }

  function handleLevel(value: string) {
    setLevel(value);
    setStep("loading");
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setStep("result"), 1000);
  }

  function handleReset() {
    setObjective("");
    setAvoid("");
    setLevel("");
    setStep("objective");
  }

  function handlePrint() {
    if (typeof window !== "undefined") window.print();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="surface-card rounded-2xl p-6 sm:p-8">
        <div className="space-y-6">
          <ProgressLine step={step === "objective" ? 1 : step === "avoid" ? 2 : 3} steps={3} />
          <p className="text-xs text-muted-foreground">
            Nessuna risposta e "sbagliata". Serve a ridurre errori comuni di compatibilita.
          </p>

          {step === "objective" && (
            <StepSingleSelect
              title="Cosa stai cercando di fare?"
              options={objectiveOptions}
              value={objective}
              onSelect={handleObjective}
              helperText="Non serve sapere termini tecnici. Serve solo a evitare incompatibilita tipiche."
            />
          )}

          {step === "avoid" && (
            <StepSingleSelect
              title="Cosa vuoi evitare soprattutto?"
              options={avoidOptions}
              value={avoid}
              onSelect={handleAvoid}
              helperText="Seleziona l'opzione che ti descrive di piu."
              tooltip="Perche lo chiediamo?"
              tooltipBody="Per calibrare frizioni e vincoli senza trasformare il risultato in un ranking."
            />
          )}

          {step === "level" && (
            <StepSingleSelect
              title="A che punto sei?"
              options={levelOptions}
              value={level}
              onSelect={handleLevel}
              helperText="Serve solo a calibrare la complessita. Non e un giudizio."
            />
          )}

          {step === "loading" && (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Verifica compatibilita in corso</p>
              <p>Stiamo controllando vincoli e frizioni tipiche per questo profilo.</p>
              <div className="progress-line">
                <span style={{ width: "70%" }} />
              </div>
            </div>
          )}

          {step === "result" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">Shortlist di piani compatibili (con limiti).</h2>
                <p className="text-sm text-muted-foreground">
                  Ogni voce e cliccabile: motivi, frizioni, costi dichiarati e fonti.
                </p>
              </div>

              <div className="space-y-6">
                {groups.map((group) => (
                  <div key={group.title} className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{group.title}</p>
                    <div className="space-y-3">
                      {group.items.map((item) => (
                        <details key={item.id} className="accordion">
                          <summary className="flex items-center justify-between gap-4">
                            <span className="text-sm font-semibold text-foreground">
                              {item.platformName} · {item.planName}
                              <span className="ml-2 text-xs font-normal text-muted-foreground">
                                {platformTypeLabel(item.platformType)}
                              </span>
                            </span>
                            <ToneBadge tone={item.tone} />
                          </summary>

                          <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                            {item.reasons.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                  Frizioni e vincoli rilevati
                                </p>
                                <ul className="mt-2 space-y-1">
                                  {item.reasons.map((reason) => (
                                    <li key={reason} className="flex items-start gap-2">
                                      <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
                                      <span>{reason}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Perche</p>
                              <p className="mt-1">{item.why}</p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="surface-card rounded-2xl p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                  Dati (piano)
                                </p>
                                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                  <li>Commissioni: {item.plan.costs.commissions}</li>
                                  <li>Spread/slippage: {item.plan.costs.spread}</li>
                                  <li>Funding/overnight: {item.plan.costs.funding}</li>
                                  <li>Trasparenza costi: {item.plan.feeTransparency}</li>
                                  <li>Livello tecnico: {technicalLabel(item.plan.technicalLevel)}</li>
                                  <li>Custodia: {custodyLabel(item.plan.custodyModel)}</li>
                                </ul>
                              </div>

                              <div className="surface-card rounded-2xl p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                  Supporto e problemi noti
                                </p>
                                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                  <li>Canali: {item.plan.support.channels.join(", ") || "N/D"}</li>
                                  {item.plan.support.knownIssues.length > 0 ? (
                                    item.plan.support.knownIssues.map((issue) => <li key={issue}>{issue}</li>)
                                  ) : (
                                    <li>Nessuna criticita nota nel catalogo.</li>
                                  )}
                                </ul>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                Errore comune
                              </p>
                              <p className="mt-1">{item.commonMistake}</p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                Non significa
                              </p>
                              <p className="mt-1">{item.doesNotMean}</p>
                            </div>

                            {item.plan.sources.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Fonti</p>
                                <ul className="mt-2 space-y-1">
                                  {item.plan.sources.map((source) => (
                                    <li key={source.url}>
                                      <a
                                        className="link-underline"
                                        href={source.url}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        {source.label}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {item.regions.length > 0 && (
                              <p className="text-xs text-muted-foreground">Regioni dichiarate: {item.regions.join(", ")}</p>
                            )}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button type="button" className="btn-secondary" onClick={handleReset}>
                  Rifai il controllo
                </button>
                <Link href="/metodo#limiti" className="link-underline text-sm font-semibold">
                  Leggi Metodo e limiti
                </Link>
                <button type="button" className="link-underline text-sm font-semibold" onClick={handlePrint}>
                  Salva come promemoria
                </button>
              </div>

              <div className="text-xs text-muted-foreground">
                Questo non e un consiglio operativo. Mostriamo compatibilita e frizioni in base ai dati disponibili nel
                catalogo e alle tue risposte.
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
