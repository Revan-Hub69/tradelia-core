import fs from "fs";
import path from "path";
import Link from "next/link";
import { HeroInteractive } from "./hero-interactive";
import { VerifyCategories } from "./verify-categories";
import { RevealSection } from "./reveal-section";
import { ScenarioSlider } from "./scenario-slider";
import { FinderPreview } from "./finder-preview";

type Content = {
  hero: {
    title: string;
    subtitle: string[];
    question: string;
    options: { id: string; label: string; subtext: string }[];
    cta: string;
    microcopy: string;
  };
  accoglienza: {
    title: string;
    body: string;
  };
  problema: {
    title: string;
    problem: string;
    solutionTitle: string;
    solutions: string[];
  };
  cosaFacciamo: {
    title: string;
    bullets: string[];
    microcopy: string;
  };
  scenari: {
    title: string;
    ctaSecondary: string;
    items: { id: string; situation: string; hiddenError: string; clarifies: string; doesNotMean: string }[];
  };
  storie: {
    title: string;
    microcopy: string;
    items: { title: string; body: string }[];
  };
  comeFunziona: {
    title: string;
    steps: string[];
    note: string;
  };
  verifichiamo: {
    title: string;
    items: { label: string; tooltip: string }[];
  };
  limiti: {
    title: string;
    items: string[];
    accordionTitle: string;
    accordionBody: string;
  };
  fonti: {
    title: string;
    items: string[];
    affiliazioni: string;
  };
  ctaFinale: {
    title: string;
    cta: string;
    microcopy: string;
  };
  footer: {
    metodo: string;
    privacy: string;
    disclaimer: string;
    contatti: string;
  };
};

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

function loadContent(): Content {
  const filePath = path.join(process.cwd(), "public", "content.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Content;
}

function loadPlatformCatalog(): PlatformCatalog {
  const filePath = path.join(process.cwd(), "public", "platforms.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as PlatformCatalog;
}

export default function HomePage() {
  const content = loadContent();
  const catalog = loadPlatformCatalog();

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <main id="main-content" role="main" className="space-y-0">
        <RevealSection className="hero-haze border-b border-border/60 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                    {content.hero.title}
                  </h1>
                  <div className="space-y-2 text-base text-muted-foreground">
                    {content.hero.subtitle.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="/verifica" className="btn-primary">
                    Trova la piattaforma giusta
                  </Link>
                  <Link href="#metodo" className="btn-secondary">
                    Come funziona
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1">Tariffe ufficiali</span>
                  <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1">Vincoli operativi</span>
                  <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1">Assistenza e reclami</span>
                  <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1">Costi impliciti (quando misurabili)</span>
                </div>
              </div>

              <div className="surface-card-strong p-4 sm:p-5">
                <FinderPreview catalog={catalog} />
                <details className="accordion mt-4">
                  <summary>Preferisci la verifica guidata?</summary>
                  <div className="mt-4 space-y-4">
                    <HeroInteractive
                      question={content.hero.question}
                      options={content.hero.options}
                      ctaLabel={content.hero.cta}
                      microcopy={content.hero.microcopy}
                    />
                  </div>
                </details>
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="border-b border-border/60 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                In 60 secondi ottieni
              </p>
              <h2 className="text-2xl font-semibold">Una verifica leggibile, non un consiglio.</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {content.cosaFacciamo.bullets.map((item) => (
                <div key={item} className="surface-card p-5">
                  <p className="text-sm font-semibold text-foreground">{item}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="surface-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Esempio di output
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Shortlist + frizioni + fonti. Senza “migliore”, senza promessa.
                </p>
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">Piano A · Broker</p>
                    <span className="status-ok inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                      ADATTO
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">Piano B · Exchange</p>
                    <span className="status-attention inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                      FRIZIONE
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">Piano C · Derivati</p>
                    <span className="status-risk inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                      NON ADATTO
                    </span>
                  </div>
                </div>
              </div>

              <div className="surface-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Perimetro
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{content.cosaFacciamo.microcopy}</p>
                <details className="accordion mt-5">
                  <summary>{content.problema.title}</summary>
                  <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                    <p>{content.problema.problem}</p>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {content.problema.solutionTitle}
                      </p>
                      <ul className="mt-3 space-y-2">
                        {content.problema.solutions.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="border-b border-border/60 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-4">
            <h2 className="text-2xl font-semibold">{content.accoglienza.title}</h2>
            <p className="text-sm text-muted-foreground">{content.accoglienza.body}</p>
          </div>
        </RevealSection>

        <RevealSection id="esempi" className="border-b border-border/60 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-8">
            <ScenarioSlider
              title={content.scenari.title}
              ctaSecondary={content.scenari.ctaSecondary}
              ctaSecondaryHref="#verifichiamo"
              items={content.scenari.items}
            />

            <div className="surface-divider h-px w-full" aria-hidden />

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{content.storie.title}</h3>
                <p className="text-sm text-muted-foreground">{content.storie.microcopy}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {content.storie.items.map((story) => (
                  <div key={story.title} className="surface-card p-5">
                    <p className="text-sm font-semibold text-foreground">{story.title}</p>
                    <p className="mt-3 text-sm text-muted-foreground">{story.body}</p>
                    <p className="mt-4 text-xs text-muted-foreground">Esempio informativo. Non è una garanzia.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection id="metodo" className="border-b border-border/60 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{content.comeFunziona.title}</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {content.comeFunziona.note}
              </span>
            </div>
            <div className="progress-line">
              <span style={{ width: "100%" }} />
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {content.comeFunziona.steps.map((step) => (
                <li key={step} className="surface-card p-4 text-sm text-muted-foreground">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </RevealSection>

        <RevealSection id="verifichiamo" className="border-b border-border/60 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-6">
            <h2 className="text-2xl font-semibold">{content.verifichiamo.title}</h2>
            <VerifyCategories items={content.verifichiamo.items} />
          </div>
        </RevealSection>

        <RevealSection id="limiti" className="border-b border-border/60 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-6">
            <h2 className="text-2xl font-semibold">{content.limiti.title}</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {content.limiti.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <details className="accordion">
              <summary>{content.limiti.accordionTitle}</summary>
              <p className="mt-3 text-sm text-muted-foreground">{content.limiti.accordionBody}</p>
            </details>
          </div>
        </RevealSection>

        <RevealSection id="fonti" className="border-b border-border/60 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-6">
            <h2 className="text-2xl font-semibold">{content.fonti.title}</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {content.fonti.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">{content.fonti.affiliazioni}</p>
          </div>
        </RevealSection>

        <RevealSection className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-4 text-center">
            <h2 className="text-2xl font-semibold">{content.ctaFinale.title}</h2>
            <Link href="/verifica" className="btn-primary">
              {content.ctaFinale.cta}
            </Link>
            <p className="text-xs text-muted-foreground">{content.ctaFinale.microcopy}</p>
          </div>
        </RevealSection>
      </main>

      <footer className="section-reveal border-t border-border/60 bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
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
            Materiale informativo ed educativo. Non è consulenza finanziaria regolamentata.
          </p>
        </div>
      </footer>
    </div>
  );
}
