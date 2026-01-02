"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";

type Tone = "ok" | "warn" | "stop";
type Step = "objective" | "avoid" | "level" | "loading" | "result";

type ResultItem = {
  id: string;
  label: string;
  tone: Tone;
  why: string;
  commonMistake: string;
  doesNotMean: string;
};

type ResultGroup = {
  title: string;
  tone: Tone;
  items: ResultItem[];
};

type VerificationFormProps = {
  initialObjective?: string;
};

const objectiveOptions = [
  { value: "investire", label: "Iniziare a investire" },
  { value: "trading", label: "Fare trading" },
  { value: "sicurezza", label: "Tenere i soldi al sicuro" },
  { value: "capire", label: "Capire da dove partire" },
];

const avoidOptions = [
  { value: "rischio", label: "Perdere soldi senza capirne il motivo" },
  { value: "costi", label: "Costi nascosti" },
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

const detailsByCategory: Record<
  string,
  { why: string; commonMistake: string; doesNotMean: string }
> = {
  broker: {
    why: "Regole piu chiare e tutele piu visibili rispetto a strumenti non regolamentati.",
    commonMistake: "Confondere trasparenza con assenza di rischio.",
    doesNotMean: "Non significa che sia adatto a qualsiasi obiettivo.",
  },
  exchange: {
    why: "Operativita crypto con custodia variabile e livelli di complessita diversi.",
    commonMistake: "Sottovalutare costi, limiti o procedure operative.",
    doesNotMean: "Non significa che sia l'unica strada per usare crypto.",
  },
  "wallet-self": {
    why: "Controllo totale, ma responsabilita totale su sicurezza e accesso.",
    commonMistake: "Pensare che la self-custody elimini ogni rischio.",
    doesNotMean: "Non significa che sia sbagliata per sempre.",
  },
  "wallet-custodial": {
    why: "Semplicita operativa, ma dipendenza dal fornitore per accesso e tutela.",
    commonMistake: "Scambiare comodita per sicurezza assoluta.",
    doesNotMean: "Non significa che sia priva di vincoli.",
  },
  leva: {
    why: "Amplifica errori e richiede disciplina operativa e gestione del rischio.",
    commonMistake: "Confondere leva con fare piu in fretta.",
    doesNotMean: "Non significa che sia sbagliata in assoluto.",
  },
  conto: {
    why: "Stabilita e vincoli strutturali, non operativita di trading.",
    commonMistake: "Usare strumenti di parcheggio per obiettivi operativi.",
    doesNotMean: "Non significa che sia inutile per altri scopi.",
  },
};

function computeTone(
  categoryId: string,
  objective: string,
  avoid: string,
  level: string
): Tone {
  const isBeginner = level === "mai" || level === "poco";
  const isExperienced = level === "esperienza";

  if (categoryId === "leva") {
    if (objective !== "trading") return "stop";
    if (isBeginner || avoid === "stress") return "stop";
    if (avoid === "rischio") return "stop";
    return "warn";
  }

  if (categoryId === "broker") {
    if (objective === "sicurezza") return "warn";
    return "ok";
  }

  if (categoryId === "conto") {
    if (objective === "trading") return "stop";
    if (objective === "sicurezza" || objective === "capire") return "ok";
    return "warn";
  }

  if (categoryId === "exchange") {
    if (isBeginner) return "warn";
    if (avoid === "regole" || avoid === "costi") return "warn";
    return isExperienced ? "ok" : "warn";
  }

  if (categoryId === "wallet-self") {
    if (isBeginner) return "warn";
    if (avoid === "custodia") return "warn";
    return "warn";
  }

  if (categoryId === "wallet-custodial") {
    if (avoid === "custodia") return "warn";
    if (objective === "sicurezza" && isBeginner) return "ok";
    if (objective === "capire" && isBeginner) return "ok";
    return "warn";
  }

  return "warn";
}

function buildResults(objective: string, avoid: string, level: string): ResultGroup[] {
  const categories = [
    { id: "broker", label: "Broker regolamentato" },
    { id: "conto", label: "Conti / parcheggio liquidita" },
    { id: "exchange", label: "Exchange" },
    { id: "wallet-custodial", label: "Wallet custodial" },
    { id: "wallet-self", label: "Wallet self-custody" },
    { id: "leva", label: "Trading con leva" },
  ];

  const items = categories.map((category) => {
    const tone = computeTone(category.id, objective, avoid, level);
    const details = detailsByCategory[category.id];
    return {
      id: category.id,
      label: category.label,
      tone,
      why: details.why,
      commonMistake: details.commonMistake,
      doesNotMean: details.doesNotMean,
    };
  });

  const groups: ResultGroup[] = [
    { title: "Piu adatto per iniziare", tone: "ok", items: items.filter((item) => item.tone === "ok") },
    { title: "Adatto, ma con frizione", tone: "warn", items: items.filter((item) => item.tone === "warn") },
    { title: "Non adatto adesso", tone: "stop", items: items.filter((item) => item.tone === "stop") },
  ];

  return groups.filter((group) => group.items.length > 0);
}

function ToneBadge({ tone }: { tone: Tone }) {
  const label = tone === "ok" ? "ADATTO" : tone === "warn" ? "FRIZIONE" : "NON ADATTO";
  const className = tone === "ok" ? "status-ok" : tone === "warn" ? "status-attention" : "status-risk";

  return (
    <span className={`${className} inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]`}>
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

export function VerificationForm({ initialObjective }: VerificationFormProps) {
  const [objective, setObjective] = useState("");
  const [avoid, setAvoid] = useState("");
  const [level, setLevel] = useState("");
  const [step, setStep] = useState<Step>("objective");
  const timerRef = useRef<number | null>(null);

  const groups = useMemo(
    () => (step === "result" ? buildResults(objective, avoid, level) : []),
    [step, objective, avoid, level]
  );

  useEffect(() => {
    if (!initialObjective) return;
    const allowed = objectiveOptions.some((option) => option.value === initialObjective);
    if (allowed && !objective) {
      setObjective(initialObjective);
      setStep("avoid");
    }
  }, [initialObjective, objective]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
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
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setStep("result");
    }, 1000);
  }

  function handleReset() {
    setObjective("");
    setAvoid("");
    setLevel("");
    setStep("objective");
  }

  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="surface-card rounded-2xl p-6 sm:p-8">
        <div className="space-y-6">
          <ProgressLine step={step === "objective" ? 1 : step === "avoid" ? 2 : 3} steps={3} />
          <p className="text-xs text-muted-foreground">Nessuna risposta e sbagliata.</p>

          {step === "objective" && (
            <StepSingleSelect
              title="Cosa stai cercando di fare?"
              options={objectiveOptions}
              value={objective}
              onSelect={handleObjective}
              helperText="Non c'e risposta giusta. Non serve sapere termini tecnici. Serve solo a evitare errori comuni."
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
              tooltipBody="Per capire quale complessita e piu rischiosa per te adesso."
            />
          )}

          {step === "level" && (
            <StepSingleSelect
              title="A che punto sei?"
              options={levelOptions}
              value={level}
              onSelect={handleLevel}
              helperText="Serve solo a calibrare la frizione. Non e un giudizio."
            />
          )}

          {step === "loading" && (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Verifica compatibilita in corso</p>
              <p>Stiamo controllando frizioni tipiche per chi e in questa situazione.</p>
              <div className="progress-line">
                <span style={{ width: "70%" }} />
              </div>
            </div>
          )}

          {step === "result" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">
                  Per il tuo profilo: ecco da cosa partire (e cosa evitare).
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ogni voce e cliccabile per capire il perche.
                </p>
              </div>

              <div className="space-y-6">
                {groups.map((group) => (
                  <div key={group.title} className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {group.title}
                    </p>
                    <div className="space-y-3">
                      {group.items.map((item) => (
                        <details key={item.id} className="accordion">
                          <summary className="flex items-center justify-between gap-4">
                            <span className="text-sm font-semibold text-foreground">{item.label}</span>
                            <ToneBadge tone={item.tone} />
                          </summary>
                          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                Perche
                              </p>
                              <p className="mt-1">{item.why}</p>
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
                Questo non e un consiglio operativo. Serve solo a ridurre errori comuni.
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
