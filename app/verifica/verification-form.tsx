"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

type FormState = {
  difficulty: string;
  objective: string;
  instrument: string;
  detail: string;
};

type ResultStatus = "adatto" | "frizione" | "non-adatto";

type Issue = {
  message: string;
  bucket: "Costi impliciti" | "Complessita operativa" | "Vincoli regolatori";
  severity: "hard" | "soft";
};

type Result = {
  status: ResultStatus;
  title: string;
  summary: string;
  friction: string[];
  note: string;
  normalizzazione?: string;
};

const difficultyOptions = [
  { value: "costi", label: "Costi poco chiari" },
  { value: "rischio", label: "Rischio piu alto del previsto" },
  { value: "regole", label: "Regole complesse" },
  { value: "custodia", label: "Custodia / sicurezza" },
  { value: "leva", label: "Leva o meccanismi che non capivo" },
  { value: "non-so", label: "Non sono sicuro di cosa sto usando" },
];

const objectiveOptions = [
  { value: "investire", label: "Investire nel tempo" },
  { value: "trading", label: "Fare trading" },
  { value: "custodire", label: "Custodire capitale" },
  { value: "trasferire", label: "Trasferire valore" },
];

const instrumentOptions = [
  { value: "broker", label: "Broker" },
  { value: "exchange", label: "Exchange" },
  { value: "wallet", label: "Wallet" },
  { value: "conto-deposito", label: "Conto deposito" },
];

const detailOptions: Record<string, { value: string; label: string }[]> = {
  broker: [
    { value: "regolamentato", label: "Regolamentato" },
    { value: "non-regolamentato", label: "Non regolamentato" },
  ],
  exchange: [
    { value: "custodial", label: "Custodial" },
    { value: "non-custodial", label: "Non custodial" },
  ],
  wallet: [
    { value: "self-custody", label: "Self-custody" },
    { value: "custodial", label: "Custodial" },
  ],
  "conto-deposito": [
    { value: "vincolato", label: "Vincolato" },
    { value: "libero", label: "Libero" },
  ],
};

const statusLabels: Record<ResultStatus, { title: string; summary: string }> = {
  adatto: {
    title: "Adatto al tuo obiettivo attuale",
    summary:
      "Per le informazioni fornite, lo strumento non presenta incompatibilita strutturali evidenti.",
  },
  frizione: {
    title: "Adatto, ma con frizioni da considerare",
    summary:
      "Lo strumento puo funzionare, ma alcune caratteristiche aumentano la probabilita di errori comuni.",
  },
  "non-adatto": {
    title: "Non adatto al tuo obiettivo attuale",
    summary:
      "Questo non significa che lo strumento sia sbagliato. Significa che, per come funziona, aumenta il rischio di errori frequenti in situazioni come la tua.",
  },
};

function evaluate(form: FormState): Result {
  const issues: Issue[] = [];

  if (form.objective === "trading" && form.instrument === "conto-deposito") {
    issues.push({
      message: "Lo strumento non consente operativita intraday o leva.",
      bucket: "Vincoli regolatori",
      severity: "hard",
    });
  }

  if (form.objective === "trading" && form.instrument === "wallet") {
    issues.push({
      message: "Un wallet non e progettato per esecuzione rapida o gestione ordini.",
      bucket: "Complessita operativa",
      severity: "hard",
    });
  }

  if (form.objective === "trasferire" && form.instrument === "broker") {
    issues.push({
      message: "Un broker non e strutturato per trasferimenti frequenti di valore.",
      bucket: "Vincoli regolatori",
      severity: "hard",
    });
  }

  if (form.objective === "custodire" && form.instrument === "exchange") {
    issues.push({
      message: "La custodia su exchange introduce dipendenze operative e rischi di piattaforma.",
      bucket: "Complessita operativa",
      severity: "soft",
    });
  }

  if (form.objective === "investire" && form.instrument === "exchange") {
    issues.push({
      message: "Costi e volatilita possono generare attrito operativo nel tempo.",
      bucket: "Costi impliciti",
      severity: "soft",
    });
  }

  if (form.instrument === "broker" && form.detail === "non-regolamentato") {
    issues.push({
      message: "Assenza di tutela regolamentare e maggiore esposizione a vincoli.",
      bucket: "Vincoli regolatori",
      severity: "hard",
    });
  }

  if (form.instrument === "wallet" && form.detail === "self-custody") {
    if (["custodia", "non-so"].includes(form.difficulty)) {
      issues.push({
        message: "La self-custody richiede procedure di sicurezza avanzate.",
        bucket: "Complessita operativa",
        severity: "soft",
      });
    }
  }

  if (form.instrument === "exchange" && form.detail === "non-custodial") {
    issues.push({
      message: "La non custodia richiede gestione autonoma e controlli aggiuntivi.",
      bucket: "Complessita operativa",
      severity: "soft",
    });
  }

  if (form.instrument === "conto-deposito" && form.detail === "vincolato") {
    if (form.objective === "trasferire") {
      issues.push({
        message: "Vincoli di uscita rallentano la disponibilita del capitale.",
        bucket: "Vincoli regolatori",
        severity: "hard",
      });
    }
  }

  const hasHard = issues.some((issue) => issue.severity === "hard");
  const status: ResultStatus = hasHard
    ? "non-adatto"
    : issues.length > 0
    ? "frizione"
    : "adatto";

  const friction = Array.from(new Set(issues.map((issue) => issue.bucket)));

  return {
    status,
    title: statusLabels[status].title,
    summary: statusLabels[status].summary,
    friction,
    note: "Questo non garantisce risultati ne riduce il rischio di mercato.",
    normalizzazione:
      status === "non-adatto"
        ? "Molte persone fanno lo stesso errore. Non e una mancanza di competenza."
        : undefined,
  };
}

export function VerificationForm() {
  const [form, setForm] = useState<FormState>({
    difficulty: "",
    objective: "",
    instrument: "",
    detail: "",
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
    setForm((prev) => {
      if (field === "instrument") {
        return { ...prev, instrument: value, detail: "" };
      }
      return { ...prev, [field]: value };
    });
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
    }, 900);
  }

  function handleReset() {
    setForm({
      difficulty: "",
      objective: "",
      instrument: "",
      detail: "",
    });
    setSubmitted(false);
    setStatus("idle");
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  const resultStyles: Record<ResultStatus, string> = {
    adatto: "status-ok",
    frizione: "status-attention",
    "non-adatto": "status-risk",
  };

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="surface-card rounded-2xl p-6 sm:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-foreground">
            Cosa ti ha creato piu difficolta finora?
            <span className="block text-xs font-normal text-muted-foreground">
              Questa risposta serve solo a interpretare meglio il risultato.
            </span>
            <select
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
              value={form.difficulty}
              onChange={(event) => handleChange("difficulty", event.target.value)}
            >
              <option value="">Seleziona</option>
              {difficultyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-foreground">
            Cosa stai cercando di fare adesso?
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
            Che tipo di strumento stai usando?
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
            Dettaglio minimo
            <select
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
              value={form.detail}
              onChange={(event) => handleChange("detail", event.target.value)}
              disabled={!form.instrument}
            >
              <option value="">Seleziona</option>
              {(detailOptions[form.instrument] ?? []).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="btn-primary" disabled={!isComplete}>
            Vedi esito
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
              Compila i campi per ottenere una verifica informativa. Nessun dato viene salvato.
            </p>
          </div>
        )}

        {status === "loading" && (
          <div className="surface-card rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Stiamo verificando incompatibilita strutturali
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Applichiamo regole esplicite ai dati dichiarati.
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
          <div className={`rounded-2xl p-6 ${resultStyles[result.status]}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Esito
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">{result.title}</h2>
            <p className="mt-3 text-sm text-foreground/80">{result.summary}</p>

            {result.status === "frizione" && result.friction.length > 0 && (
              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Variabili di frizione
                </p>
                <ul className="space-y-2">
                  {result.friction.map((item) => (
                    <li key={item} className="text-sm text-foreground/80">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.normalizzazione && (
              <div className="mt-5 rounded-xl border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                {result.normalizzazione}
              </div>
            )}

            <p className="mt-4 text-xs text-muted-foreground">{result.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
