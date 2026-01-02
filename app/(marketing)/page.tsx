import fs from "fs";
import path from "path";
import Link from "next/link";
import { HeroInteractive } from "./hero-interactive";
import { VerifyCategories } from "./verify-categories";

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
  cosaFacciamo: {
    title: string;
    bullets: string[];
    microcopy: string;
  };
  esempio: {
    title: string;
    objectiveLabel: string;
    objectiveValue: string;
    choiceLabel: string;
    choiceValue: string;
    resultLabel: string;
    resultValue: string;
    accordionTitle: string;
    accordionBody: string;
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
        <section className="section-reveal border-b border-border/60 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                {content.hero.title}
              </h1>
              <div className="space-y-2 text-base text-muted-foreground">
                {content.hero.subtitle.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            <HeroInteractive
              question={content.hero.question}
              options={content.hero.options}
              ctaLabel={content.hero.cta}
              microcopy={content.hero.microcopy}
            />
          </div>
        </section>

        <section className="section-reveal border-b border-border/60 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-4">
            <h2 className="text-2xl font-semibold">{content.accoglienza.title}</h2>
            <p className="text-sm text-muted-foreground">{content.accoglienza.body}</p>
          </div>
        </section>

        <section className="section-reveal border-b border-border/60 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-6">
            <h2 className="text-2xl font-semibold">{content.cosaFacciamo.title}</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {content.cosaFacciamo.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">{content.cosaFacciamo.microcopy}</p>
          </div>
        </section>

        <section id="esempi" className="section-reveal border-b border-border/60 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-6">
            <h2 className="text-2xl font-semibold">{content.esempio.title}</h2>
            <div className="surface-card rounded-2xl p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {content.esempio.objectiveLabel}
                  </p>
                  <p className="text-sm text-foreground">{content.esempio.objectiveValue}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {content.esempio.choiceLabel}
                  </p>
                  <p className="text-sm text-foreground">{content.esempio.choiceValue}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {content.esempio.resultLabel}
                  </p>
                  <span className="status-risk inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                    {content.esempio.resultValue}
                  </span>
                </div>
              </div>
              <details className="accordion mt-5">
                <summary>{content.esempio.accordionTitle}</summary>
                <p className="mt-3 text-sm text-muted-foreground">{content.esempio.accordionBody}</p>
              </details>
            </div>
          </div>
        </section>

        <section id="metodo" className="section-reveal border-b border-border/60 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
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
                <li key={step} className="surface-card rounded-2xl p-4 text-sm text-muted-foreground">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="verifichiamo" className="section-reveal border-b border-border/60 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-6">
            <h2 className="text-2xl font-semibold">{content.verifichiamo.title}</h2>
            <VerifyCategories items={content.verifichiamo.items} />
          </div>
        </section>

        <section id="limiti" className="section-reveal border-b border-border/60 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
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
        </section>

        <section id="fonti" className="section-reveal border-b border-border/60 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
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
        </section>

        <section className="section-reveal px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-4 text-center">
            <h2 className="text-2xl font-semibold">{content.ctaFinale.title}</h2>
            <Link href="/verifica" className="btn-primary">
              {content.ctaFinale.cta}
            </Link>
            <p className="text-xs text-muted-foreground">{content.ctaFinale.microcopy}</p>
          </div>
        </section>
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
            Materiale informativo ed educativo. Non e consulenza finanziaria regolamentata.
          </p>
        </div>
      </footer>
    </div>
  );
}
