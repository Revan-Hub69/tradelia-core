import fs from "fs";
import path from "path";
import Link from "next/link";

type ResultState = {
  label: string;
  description: string;
  tone: "coerente" | "frizione" | "non-coerente";
};

type Content = {
  hero: {
    title: string;
    subtitle: string;
    bullets: string[];
    disclaimer: string;
    primaryCta: string;
    secondaryCta: string;
  };
  problema: {
    title: string;
    subtitle: string;
    cards: { title: string; body: string }[];
    noteTitle: string;
    noteBody: string;
  };
  metodo: {
    title: string;
    subtitle: string;
    steps: { label: string; title: string; body: string }[];
  };
  verifica: {
    title: string;
    subtitle: string;
    steps: { number: string; title: string; body: string }[];
    resultsTitle: string;
    results: ResultState[];
    cta: string;
  };
  esempi: {
    title: string;
    subtitle: string;
    scenarios: { title: string; because: string; checks: string[] }[];
  };
  controlli: {
    title: string;
    subtitle: string;
    items: string[];
    footnote: string;
  };
  trasparenza: {
    title: string;
    subtitle: string;
    do: string[];
    dont: string[];
    metodologiaTitle: string;
    metodologia: string[];
    regola: string;
  };
  cta: {
    title: string;
    subtitle: string;
    primary: string;
    secondary: string;
    version: string;
    legal: string;
  };
  footer: {
    metodo: string;
    privacy: string;
    disclaimer: string;
    contatti: string;
  };
};

const staggerClasses = ["stagger-1", "stagger-2", "stagger-3"];
const problemaIcons = [
  (
    <svg
      key="context"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.5" y="4.5" width="11" height="11" rx="2" />
      <rect x="9.5" y="8.5" width="11" height="11" rx="2" />
    </svg>
  ),
  (
    <svg
      key="costs"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 7.5h7l6 6-7 7-6-6v-7Z" />
      <circle cx="8" cy="11" r="1.5" />
    </svg>
  ),
  (
    <svg
      key="constraints"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8.5a4 4 0 0 1 8 0V11" />
    </svg>
  ),
];

const metodoIcons = [
  (
    <svg
      key="intent"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v10" />
      <path d="M7 12h10" />
    </svg>
  ),
  (
    <svg
      key="rules"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M9 9h6" />
      <path d="M9 13h4" />
      <path d="M9 16l2 2 4-4" />
    </svg>
  ),
  (
    <svg
      key="outcome"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 17l5-5 4 4 7-7" />
      <path d="M20 10v6h-6" />
    </svg>
  ),
];

const verificaIcons = [
  (
    <svg
      key="intent-input"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h8" />
      <path d="M8 13h6" />
    </svg>
  ),
  (
    <svg
      key="verify"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="10" cy="10" r="4" />
      <path d="M13 13l6 6" />
      <path d="M8.5 10.5l1.5 1.5 2.5-3" />
    </svg>
  ),
  (
    <svg
      key="report"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M8 9h8" />
      <path d="M8 13h6" />
      <path d="M8 17h4" />
    </svg>
  ),
];

const esempiIcons = [
  (
    <svg
      key="emergency"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 3.5l7 3v5.5c0 4.2-3 7.7-7 8.7-4-1-7-4.5-7-8.7V6.5l7-3Z" />
      <path d="M12 9v4" />
      <circle cx="12" cy="16.5" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  ),
  (
    <svg
      key="crypto"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.5" y="6.5" width="17" height="11" rx="2" />
      <path d="M16.5 10h4v4h-4a2 2 0 0 1 0-4Z" />
      <circle cx="18.5" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  (
    <svg
      key="periodic"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.5" y="5.5" width="17" height="14" rx="2" />
      <path d="M7 3.5v4" />
      <path d="M17 3.5v4" />
      <path d="M7 12h4" />
      <path d="M7 15.5h6" />
    </svg>
  ),
];

function loadContent(): Content {
  const filePath = path.join(process.cwd(), "public", "content.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Content;
}

function ResultBadge({ tone, label, description }: ResultState) {
  const styles: Record<ResultState["tone"], string> = {
    coerente:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100",
    frizione:
      "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100",
    "non-coerente":
      "border-rose-500/30 bg-rose-500/10 text-rose-950 dark:text-rose-100",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em]">{label}</p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">
        {description}
      </p>
    </div>
  );
}

export default function HomePage() {
  const content = loadContent();

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <main id="main-content" role="main" className="space-y-0">
        <section
          className="section-reveal relative overflow-hidden border-b border-border/60 px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
          style={{ animationDelay: "0ms" }}
        >
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 hero-haze" />
            <div className="absolute inset-0 hero-grid opacity-70" />
            <div className="absolute -top-24 right-0 h-72 w-72 rounded-full hero-orb animate-float" />
            <div className="absolute -bottom-28 left-6 h-80 w-80 rounded-full hero-orb-secondary animate-float-slow" />
          </div>

          <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-6 lg:max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Per chi inizia, senza scorciatoie
              </p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                {content.hero.title}
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                {content.hero.subtitle}
              </p>
              <ul className="grid gap-3 sm:grid-cols-3">
                {content.hero.bullets.map((item) => (
                  <li
                    key={item}
                    className="surface-card flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground"
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full bg-primary"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/verifica" className="btn-primary" aria-label="Trova lo strumento adatto">
                  {content.hero.primaryCta}
                </Link>
                <Link href="#metodo" className="btn-secondary" aria-label="Leggi metodologia">
                  {content.hero.secondaryCta}
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">{content.hero.disclaimer}</p>
            </div>
          </div>
        </section>

        <section
          id="problema"
          className="section-reveal border-b border-border/60 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
          style={{ animationDelay: "80ms" }}
        >
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Il problema reale
              </p>
              <h2 className="text-3xl font-semibold sm:text-4xl">
                {content.problema.title}
              </h2>
              <p className="text-base text-muted-foreground">
                {content.problema.subtitle}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.problema.cards.map((card, index) => (
                <div
                  key={card.title}
                  className="card-interactive group rounded-2xl border border-border/70 p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-primary/80 transition-subtle group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary">
                    {problemaIcons[index]}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="surface-card rounded-2xl p-6 sm:p-8">
              <p className="text-sm font-semibold text-foreground">
                {content.problema.noteTitle}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {content.problema.noteBody}
              </p>
            </div>
          </div>
        </section>

        <section
          id="metodo"
          className="section-reveal border-b border-border/60 bg-muted/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
          style={{ animationDelay: "140ms" }}
        >
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Metodo
              </p>
              <h2 className="text-3xl font-semibold sm:text-4xl">{content.metodo.title}</h2>
              <p className="text-base text-muted-foreground">{content.metodo.subtitle}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {content.metodo.steps.map((step, index) => (
                <div
                  key={step.label}
                  className={`surface-card surface-card-hover group rounded-2xl p-6 ${staggerClasses[index % staggerClasses.length]} animate-rise`}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-primary/80 transition-subtle group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary">
                    {metodoIcons[index]}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {step.label}
                    </span>
                    <h3 className="text-base font-semibold">{step.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="verifica"
          className="section-reveal border-b border-border/60 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
          style={{ animationDelay: "200ms" }}
        >
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Cosa fa Tradelia
              </p>
              <h2 className="text-3xl font-semibold sm:text-4xl">{content.verifica.title}</h2>
              <p className="text-base text-muted-foreground">{content.verifica.subtitle}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {content.verifica.steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`surface-card surface-card-hover group rounded-2xl p-6 ${staggerClasses[index % staggerClasses.length]} animate-rise`}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-primary/80 transition-subtle group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary">
                    {verificaIcons[index]}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-primary">{step.number}</span>
                    <h3 className="text-base font-semibold">{step.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{step.body}</p>
                </div>
              ))}
            </div>

            <div className="surface-card rounded-2xl p-6">
              <p className="text-sm font-semibold text-foreground">
                {content.verifica.resultsTitle}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {content.verifica.results.map((state) => (
                  <ResultBadge key={state.label} {...state} />
                ))}
              </div>
            </div>

            <div className="flex justify-start">
              <Link
                href="/verifica"
                className="btn-primary"
                aria-label="Scopri cosa e coerente per te"
              >
                {content.verifica.cta}
              </Link>
            </div>
          </div>
        </section>

        <section
          id="esempi"
          className="section-reveal border-b border-border/60 bg-muted/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
          style={{ animationDelay: "260ms" }}
        >
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Esempi
              </p>
              <h2 className="text-3xl font-semibold sm:text-4xl">{content.esempi.title}</h2>
              <p className="text-base text-muted-foreground">{content.esempi.subtitle}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.esempi.scenarios.map((scenario, index) => (
                <div key={scenario.title} className="surface-card surface-card-hover group rounded-2xl p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-primary/80 transition-subtle group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary">
                    {esempiIcons[index]}
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Scenario
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-foreground">
                    {scenario.title}
                  </h3>
                  <div className="mt-3 space-y-2 rounded-xl border border-border/60 bg-muted/30 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Perche succede
                    </p>
                    <p className="text-sm text-muted-foreground">{scenario.because}</p>
                  </div>
                  <div className="mt-3 space-y-2 rounded-xl border border-border/60 bg-muted/20 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Cosa controlla Tradelia
                    </p>
                    <ul className="space-y-1">
                      {scenario.checks.map((check) => (
                        <li key={check} className="flex items-start gap-2 text-sm text-foreground">
                          <span
                            className="mt-1 inline-block h-2 w-2 rounded-full bg-primary"
                            aria-hidden
                          />
                          <span className="text-muted-foreground">{check}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="controlli"
          className="section-reveal border-b border-border/60 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
          style={{ animationDelay: "320ms" }}
        >
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Controlli che facciamo noi
              </p>
              <h2 className="text-3xl font-semibold sm:text-4xl">{content.controlli.title}</h2>
              <p className="text-base text-muted-foreground">{content.controlli.subtitle}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {content.controlli.items.map((item) => (
                <div key={item} className="surface-card flex items-start gap-3 rounded-2xl p-4">
                  <span
                    className="mt-1 inline-block h-2 w-2 rounded-full bg-primary"
                    aria-hidden
                  />
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{content.controlli.footnote}</p>
          </div>
        </section>

        <section
          id="trasparenza"
          className="section-reveal border-b border-border/60 bg-muted/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
          style={{ animationDelay: "380ms" }}
        >
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Trasparenza e confini
              </p>
              <h2 className="text-3xl font-semibold sm:text-4xl">
                {content.trasparenza.title}
              </h2>
              <p className="text-base text-muted-foreground">{content.trasparenza.subtitle}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="surface-card rounded-2xl p-6">
                <h3 className="text-base font-semibold text-foreground">Cosa facciamo</h3>
                <ul className="mt-4 space-y-3">
                  {content.trasparenza.do.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span
                        className="mt-1 inline-block h-2 w-2 rounded-full bg-primary"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="surface-card rounded-2xl p-6">
                <h3 className="text-base font-semibold text-foreground">Cosa non facciamo</h3>
                <ul className="mt-4 space-y-3">
                  {content.trasparenza.dont.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span
                        className="mt-1 inline-block h-2 w-2 rounded-full bg-muted-foreground"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="surface-card rounded-2xl p-6">
              <h3 className="text-base font-semibold text-foreground">
                {content.trasparenza.metodologiaTitle}
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {content.trasparenza.metodologia.map((item) => (
                  <div key={item} className="flex items-start gap-2 rounded-xl border border-border/60 bg-muted/20 p-3">
                    <span
                      className="mt-1 inline-block h-2 w-2 rounded-full bg-primary"
                      aria-hidden
                    />
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="text-sm font-semibold text-foreground">{content.trasparenza.regola}</p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section-reveal px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
          style={{ animationDelay: "440ms" }}
        >
          <div className="mx-auto max-w-5xl space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold sm:text-4xl">{content.cta.title}</h2>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                {content.cta.subtitle}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/verifica"
                className="btn-primary"
                aria-label="Trova lo strumento adatto"
              >
                {content.cta.primary}
              </Link>
              <Link href="#top" className="btn-secondary" aria-label="Torna su">
                {content.cta.secondary}
              </Link>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>{content.cta.version}</p>
              <p>{content.cta.legal}</p>
            </div>
          </div>
        </section>
      </main>

      <footer
        className="section-reveal border-t border-border/60 bg-background px-4 py-6 sm:px-6 lg:px-8"
        style={{ animationDelay: "500ms" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4">
            <Link href="/metodo" className="link-internal link-underline font-medium">
              {content.footer.metodo}
            </Link>
            <Link href="/privacy" className="link-internal link-underline font-medium">
              {content.footer.privacy}
            </Link>
            <Link href="/disclaimer" className="link-internal link-underline font-medium">
              {content.footer.disclaimer}
            </Link>
            <Link href="/contatti" className="link-internal link-underline font-medium">
              {content.footer.contatti}
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Materiale informativo ed educativo. Non e consulenza finanziaria regolamentata.
          </p>
        </div>
      </footer>
    </div>
  );
}
