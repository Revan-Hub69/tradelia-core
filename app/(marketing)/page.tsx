import fs from "fs";
import path from "path";
import Link from "next/link";
import { HeroInteractive } from "./hero-interactive";
import { RevealSection } from "./reveal-section";
import { ScenarioSlider } from "./scenario-slider";
import { DocumentIcon, RulerIcon, SupportIcon } from "@/components/icons/feature-icons";

type Content = {
  hero: {
    title: string;
    subtitle: string[];
    question: string;
    options: { id: string; label: string; subtext: string }[];
    cta: string;
    microcopy: string;
  };
  problema: {
    title: string;
    problem: string;
    solutionTitle: string;
    solutions: string[];
  };
  accoglienza: {
    body: string;
  };
  cosaFacciamo: {
    title: string;
    bullets: string[];
    microcopy: string;
  };
  scenari: {
    title: string;
    items: { id: string; situation: string; hiddenError: string; clarifies: string; doesNotMean: string }[];
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

function loadContent(): Content {
  const filePath = path.join(process.cwd(), "public", "content.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Content;
}

export default function HomePage() {
  const content = loadContent();

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <main id="main-content" role="main" className="space-y-0">
        <RevealSection className="hero-haze border-b border-border/60 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <div className="space-y-7">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Tradelia</p>
                  <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{content.hero.title}</h1>
                  <div className="space-y-2 text-base text-muted-foreground">
                    {content.hero.subtitle.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="surface-card p-4">
                    <div className="flex items-center gap-3">
                      <DocumentIcon className="h-5 w-5 text-primary" />
                      <p className="text-sm font-semibold text-foreground">Tariffe e condizioni</p>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Costi per piano e vincoli dichiarati.</p>
                  </div>
                  <div className="surface-card p-4">
                    <div className="flex items-center gap-3">
                      <RulerIcon className="h-5 w-5 text-primary" />
                      <p className="text-sm font-semibold text-foreground">Costi impliciti</p>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Spread/slippage quando misurabili, con limiti.</p>
                  </div>
                  <div className="surface-card p-4">
                    <div className="flex items-center gap-3">
                      <SupportIcon className="h-5 w-5 text-primary" />
                      <p className="text-sm font-semibold text-foreground">Assistenza e reclami</p>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Segnali pubblici quando disponibili.</p>
                  </div>
                  <div className="surface-card p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Perimetro</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">Nessun asset. Nessun timing.</p>
                    <p className="mt-2 text-xs text-muted-foreground">Riduciamo errori strutturali prima della scelta.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="/metodo" className="btn-secondary">
                    Metodo pubblico
                  </Link>
                  <Link href="#start" className="link-internal link-underline text-sm font-semibold">
                    Inizia dalla home
                  </Link>
                </div>
              </div>

              <div id="start" className="surface-card-strong p-5 sm:p-6">
                <HeroInteractive
                  question={content.hero.question}
                  options={content.hero.options}
                  ctaLabel={content.hero.cta}
                  microcopy={content.hero.microcopy}
                />
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="border-b border-border/60 bg-background px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Perché</p>
                <h2 className="text-2xl font-semibold">{content.problema.title}</h2>
                <p className="text-sm text-muted-foreground">{content.problema.problem}</p>
              </div>
              <div className="surface-card p-6">
                <p className="text-sm font-semibold text-foreground">{content.problema.solutionTitle}</p>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {content.problema.solutions.map((solution) => (
                    <li key={solution} className="flex items-start gap-2">
                      <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
                      <span>{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="border-b border-border/60 bg-muted/15 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Output</p>
              <h2 className="text-2xl font-semibold">{content.cosaFacciamo.title}</h2>
              <p className="text-sm text-muted-foreground">{content.accoglienza.body}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {content.cosaFacciamo.bullets.map((item) => (
                <div key={item} className="surface-card p-5">
                  <p className="text-sm font-semibold text-foreground">{item}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">{content.cosaFacciamo.microcopy}</p>
          </div>
        </RevealSection>

        <RevealSection id="esempi" className="border-b border-border/60 bg-background px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Esempi</p>
                <h2 className="text-2xl font-semibold">{content.scenari.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Scenario reali: cosa tende a restare invisibile finché non è troppo tardi.
                </p>
              </div>
              <Link href="/metodo" className="btn-secondary px-4 py-2 text-xs">
                Metodo e criteri
              </Link>
            </div>
            <ScenarioSlider items={content.scenari.items} />
          </div>
        </RevealSection>

        <RevealSection id="fonti" className="border-b border-border/60 bg-muted/15 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
              <div className="surface-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Limiti</p>
                <h2 className="mt-3 text-xl font-semibold">{content.limiti.title}</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {content.limiti.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <details className="accordion mt-5">
                  <summary>{content.limiti.accordionTitle}</summary>
                  <p className="mt-3 text-sm text-muted-foreground">{content.limiti.accordionBody}</p>
                </details>
              </div>

              <div className="surface-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Trasparenza</p>
                <h2 className="mt-3 text-xl font-semibold">{content.fonti.title}</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {content.fonti.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">{content.fonti.affiliazioni}</p>
              </div>
            </div>
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

