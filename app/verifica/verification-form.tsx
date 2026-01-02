"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

type FormState = {
  objective: string;
  instrument: string;
  horizon: string;
  experience: string;
  priority: string;
  frequency: string;
};

type ResultStatus = "coerente" | "frizione" | "non-coerente";

type Result = {
  status: ResultStatus;
  title: string;
  summary: string;
  issues: string[];
  suggestions: string[];
  checks: string[];
};

const objectiveOptions = [
  { value: "risparmio", label: "Risparmio a breve" },
  { value: "investimento", label: "Investimento medio/lungo" },
  { value: "crypto", label: "Acquisto o gestione crypto" },
  { value: "trading", label: "Trading attivo" },
  { value: "pagamenti", label: "Pagamenti e liquidita" },
];

const instrumentOptions = [
  { value: "conto-deposito", label: "Conto deposito" },
  { value: "broker-azioni", label: "Broker azioni/ETF" },
  { value: "exchange", label: "Exchange crypto" },
  { value: "cfd-leva", label: "Piattaforma CFD/leva" },
  { value: "wallet-noncustodial", label: "Wallet non-custodial" },
  { value: "conto-pagamenti", label: "Conto pagamenti / carta" },
];

const horizonOptions = [
  { value: "giorni", label: "Giorni" },
  { value: "mesi", label: "Mesi" },
  { value: "anni", label: "Anni" },
];

const experienceOptions = [
  { value: "prima-volta", label: "Prima volta" },
  { value: "qualche-esperienza", label: "Qualche esperienza" },
  { value: "esperto", label: "Esperto" },
];

const priorityOptions = [
  { value: "semplicita", label: "Semplicita" },
  { value: "costi", label: "Costi bassi" },
  { value: "controllo", label: "Controllo" },
];

const frequencyOptions = [
  { value: "occasionale", label: "Occasionale" },
  { value: "regolare", label: "Regolare" },
  { value: "alta", label: "Alta" },
];

const suggestionsByObjective: Record<string, string[]> = {
  risparmio: [
    "Conto deposito o conto remunerato con vincoli chiari",
    "Strumenti con prelievi e tempi di uscita espliciti",
  ],
  investimento: [
    "Broker regolamentato con costi trasparenti",
    "Strumenti a basso costo e regole semplici",
  ],
  crypto: [
    "Exchange regolamentato con custodia e supporto chiari",
    "Wallet custodial se vuoi ridurre la complessita iniziale",
  ],
  trading: [
    "Broker con costi e spread trasparenti",
    "Piattaforme con controllo del rischio configurabile",
  ],
  pagamenti: [
    "Conto pagamenti o carta con IBAN e limiti chiari",
    "Strumenti con tempi di accredito espliciti",
  ],
};

const defaultChecks = [
  "Costi reali (commissioni, spread, canoni)",
  "Tempi e limiti di prelievo",
  "Custodia e tutela regolamentare",
];

const statusLabels: Record<ResultStatus, { title: string; summary: string }> = {
  coerente: {
    title: "Coerente",
    summary: "La scelta e compatibile con il tuo obiettivo e i vincoli dichiarati.",
  },
  frizione: {
    title: "Coerente con frizione",
    summary:
      "La scelta puo funzionare, ma richiede attenzione su alcuni punti critici.",
  },
  "non-coerente": {
    title: "Non coerente",
    summary:
      "La scelta aumenta il rischio di costi o vincoli non compatibili con il tuo obiettivo.",
  },
};

function evaluate(form: FormState): Result {
  const issues: string[] = [];

  if (form.objective === "risparmio" && !["conto-deposito", "conto-pagamenti"].includes(form.instrument)) {
    issues.push("Per il risparmio breve servono strumenti con vincoli di uscita chiari.");
  }

  if (form.objective === "investimento" && form.instrument === "cfd-leva") {
    issues.push("La leva puo aumentare il rischio oltre l'obiettivo di investimento.");
  }

  if (form.objective === "trading" && ["conto-deposito", "conto-pagamenti"].includes(form.instrument)) {
    issues.push("Per trading attivo servono strumenti con esecuzione e costi adeguati.");
  }

  if (form.objective === "crypto" && form.instrument === "conto-deposito") {
    issues.push("Un conto deposito non e progettato per gestione crypto.");
  }

  if (form.objective === "pagamenti" && ["broker-azioni", "cfd-leva"].includes(form.instrument)) {
    issues.push("Per pagamenti quotidiani servono strumenti con liquidita immediata.");
  }

  if (form.experience === "prima-volta" && form.instrument === "wallet-noncustodial") {
    issues.push("La non-custodia richiede procedure di sicurezza avanzate.");
  }

  if (form.horizon === "giorni" && form.instrument === "broker-azioni") {
    issues.push("Per orizzonti molto brevi, costi e tempi di regolamento pesano di piu.");
  }

  if (form.frequency === "alta" && form.instrument === "broker-azioni") {
    issues.push("Frequenza alta richiede costi molto trasparenti e competitivi.");
  }

  if (form.priority === "semplicita" && form.instrument === "cfd-leva") {
    issues.push("Le piattaforme con leva aumentano la complessita operativa.");
  }

  const status: ResultStatus =
    issues.length === 0 ? "coerente" : issues.length <= 2 ? "frizione" : "non-coerente";

  return {
    status,
    title: statusLabels[status].title,
    summary: statusLabels[status].summary,
    issues,
    suggestions: suggestionsByObjective[form.objective] ?? [],
    checks: defaultChecks,
  };
}

export function VerificationForm() {
  const [form, setForm] = useState<FormState>({
    objective: "",
    instrument: "",
    horizon: "",
    experience: "",
    priority: "",
    frequency: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready">("idle");
  const timerRef = useRef<number | null>(null);

  const isComplete = useMemo(() => Object.values(form).every(Boolean), [form]);
  const result = useMemo(
    () => (status === "ready" && isComplete ? evaluate(form) : null),
    [status, isComplete, form]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setSubmitted(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!isComplete) {
      return;
    }
    setStatus("loading");
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setStatus("ready");
    }, 450);
  }

  function handleReset() {
    setForm({
      objective: "",
      instrument: "",
      horizon: "",
      experience: "",
      priority: "",
      frequency: "",
    });
    setSubmitted(false);
    setStatus("idle");
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  const resultStyles: Record<ResultStatus, string> = {
    coerente: "border-emerald-500/30 bg-emerald-500/10",
    frizione: "border-amber-500/30 bg-amber-500/10",
    "non-coerente": "border-rose-500/30 bg-rose-500/10",
  };

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="surface-card rounded-2xl p-6 sm:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-foreground">
            Obiettivo principale
            <select
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
              value={form.objective}
              onChange={(event) => handleChange("objective", event.target.value)}
            >
              <option value="">Seleziona</option>
              {objectiveOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-foreground">
            Strumento che stai valutando
            <select
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
              value={form.instrument}
              onChange={(event) => handleChange("instrument", event.target.value)}
            >
              <option value="">Seleziona</option>
              {instrumentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-foreground">
            Orizzonte temporale
            <select
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
              value={form.horizon}
              onChange={(event) => handleChange("horizon", event.target.value)}
            >
              <option value="">Seleziona</option>
              {horizonOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-foreground">
            Esperienza
            <select
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
              value={form.experience}
              onChange={(event) => handleChange("experience", event.target.value)}
            >
              <option value="">Seleziona</option>
              {experienceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-foreground">
            Priorita principale
            <select
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
              value={form.priority}
              onChange={(event) => handleChange("priority", event.target.value)}
            >
              <option value="">Seleziona</option>
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-foreground">
            Frequenza operativa
            <select
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
              value={form.frequency}
              onChange={(event) => handleChange("frequency", event.target.value)}
            >
              <option value="">Seleziona</option>
              {frequencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="btn-primary" disabled={!isComplete}>
            Vedi risultato
          </button>
          <button type="button" className="btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      <div aria-live="polite" className="space-y-6">
        {status === "idle" && !submitted && (
          <div className="surface-card rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Esito non disponibile
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Compila i campi per ottenere una verifica di compatibilita
              informativa. Nessun dato viene salvato.
            </p>
          </div>
        )}

        {status === "loading" && (
          <div className="surface-card rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Analisi in corso
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Stiamo applicando le regole di compatibilita ai dati dichiarati.
            </p>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-primary/40" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Esito informativo. Non e consulenza regolamentata.
            </p>
          </div>
        )}

        {result && (
          <div className={`rounded-2xl border p-6 ${resultStyles[result.status]}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Esito
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">{result.title}</h2>
            <p className="mt-3 text-sm text-foreground/80">{result.summary}</p>

            {result.issues.length > 0 && (
              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Frizioni rilevate
                </p>
                <ul className="space-y-2">
                  {result.issues.map((issue) => (
                    <li key={issue} className="text-sm text-foreground/80">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.suggestions.length > 0 && (
              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Tipi spesso coerenti
                </p>
                <ul className="space-y-2">
                  {result.suggestions.map((item) => (
                    <li key={item} className="text-sm text-foreground/80">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="surface-card rounded-2xl p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Cosa controlliamo sempre
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {defaultChecks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
