'use client'

import fs from 'fs'
import path from 'path'
import Link from 'next/link'

type ResultState = {
  label: string
  description: string
  tone: 'coerente' | 'frizione' | 'non-coerente'
}

type Content = {
  hero: {
    title: string
    subtitle: string
    bullets: string[]
    disclaimer: string
    primaryCta: string
    secondaryCta: string
  }
  problema: {
    title: string
    subtitle: string
    cards: { title: string; body: string }[]
    noteTitle: string
    noteBody: string
  }
  metodo: {
    title: string
    subtitle: string
    steps: { label: string; title: string; body: string }[]
  }
  verifica: {
    title: string
    subtitle: string
    steps: { number: string; title: string; body: string }[]
    resultsTitle: string
    results: ResultState[]
    cta: string
  }
  esempi: {
    title: string
    subtitle: string
    scenarios: { title: string; because: string; checks: string[] }[]
  }
  controlli: {
    title: string
    subtitle: string
    items: string[]
    footnote: string
  }
  trasparenza: {
    title: string
    subtitle: string
    do: string[]
    dont: string[]
    metodologiaTitle: string
    metodologia: string[]
    regola: string
  }
  cta: {
    title: string
    subtitle: string
    primary: string
    secondary: string
    version: string
    legal: string
  }
  footer: {
    privacy: string
    disclaimer: string
    contatti: string
  }
}

function loadContent(): Content {
  const filePath = path.join(process.cwd(), 'public', 'content.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as Content
}

function ResultBadge({ tone, label, description }: ResultState) {
  const styles: Record<ResultState['tone'], string> = {
    coerente: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100',
    frizione: 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100',
    'non-coerente': 'bg-rose-100 text-rose-900 dark:bg-rose-900/30 dark:text-rose-100'
  }

  return (
    <div className={`rounded-lg border border-border/60 p-4 ${styles[tone]}`}>
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-2 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

export default function HomePage() {
  const content = loadContent()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main id="top" role="main" className="space-y-0">
        {/* HERO */}
        <section className="border-b border-border/60 bg-gradient-to-b from-background via-background to-muted/20 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-6 lg:max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Scelta della piattaforma senza sorprese
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{content.hero.title}</h1>
              <p className="text-lg text-muted-foreground sm:text-xl">{content.hero.subtitle}</p>
              <ul className="grid gap-3 sm:grid-cols-3">
                {content.hero.bullets.map((item) => (
                  <li key={item} className="flex items-center gap-2 rounded-md border border-border/70 bg-muted/30 px-3 py-2 text-sm font-medium text-foreground">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/verifica"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  aria-label="Avvia verifica"
                >
                  {content.hero.primaryCta}
                </Link>
                <Link
                  href="#metodo"
                  className="inline-flex items-center justify-center rounded-md border border-border/70 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  aria-label="Leggi metodologia"
                >
                  {content.hero.secondaryCta}
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">{content.hero.disclaimer}</p>
            </div>
          </div>
        </section>

        {/* PROBLEMA */}
        <section id="problema" className="border-b border-border/60 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Il problema reale</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">{content.problema.title}</h2>
              <p className="text-base text-muted-foreground">{content.problema.subtitle}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.problema.cards.map((card) => (
                <div key={card.title} className="card-interactive rounded-lg border border-border/70 bg-muted/30 p-6">
                  <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-border/70 bg-muted/20 p-6 sm:p-8">
              <p className="text-sm font-semibold text-foreground">{content.problema.noteTitle}</p>
              <p className="mt-2 text-sm text-muted-foreground">{content.problema.noteBody}</p>
            </div>
          </div>
        </section>

        {/* METODO */}
        <section id="metodo" className="border-b border-border/60 bg-muted/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Metodo</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">{content.metodo.title}</h2>
              <p className="text-base text-muted-foreground">{content.metodo.subtitle}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {content.metodo.steps.map((step) => (
                <div key={step.label} className="rounded-lg border border-border/70 bg-background p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{step.label}</span>
                    <h3 className="text-base font-semibold">{step.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VERIFICA */}
        <section id="verifica" className="border-b border-border/60 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Cosa fa Tradelia</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">{content.verifica.title}</h2>
              <p className="text-base text-muted-foreground">{content.verifica.subtitle}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {content.verifica.steps.map((step) => (
                <div key={step.number} className="rounded-lg border border-border/70 bg-muted/20 p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-primary">{step.number}</span>
                    <h3 className="text-base font-semibold">{step.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{step.body}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 rounded-lg border border-border/70 bg-background p-6">
              <p className="text-sm font-semibold text-foreground">{content.verifica.resultsTitle}</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {content.verifica.results.map((state) => (
                  <ResultBadge key={state.label} {...state} />
                ))}
              </div>
            </div>

            <div className="flex justify-start">
              <Link
                href="/verifica"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Fai verificare la piattaforma"
              >
                {content.verifica.cta}
              </Link>
            </div>
          </div>
        </section>

        {/* ESEMPI */}
        <section id="esempi" className="border-b border-border/60 bg-muted/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Esempi</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">{content.esempi.title}</h2>
              <p className="text-base text-muted-foreground">{content.esempi.subtitle}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.esempi.scenarios.map((scenario) => (
                <div key={scenario.title} className="rounded-lg border border-border/70 bg-background p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Scenario</p>
                  <h3 className="mt-2 text-base font-semibold text-foreground">{scenario.title}</h3>
                  <div className="mt-3 space-y-2 rounded-md border border-border/60 bg-muted/30 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Perché succede</p>
                    <p className="text-sm text-muted-foreground">{scenario.because}</p>
                  </div>
                  <div className="mt-3 space-y-2 rounded-md border border-border/60 bg-muted/20 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Cosa controlla Tradelia</p>
                    <ul className="space-y-1">
                      {scenario.checks.map((check) => (
                        <li key={check} className="flex items-start gap-2 text-sm text-foreground">
                          <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
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

        {/* CONTROLLI */}
        <section id="controlli" className="border-b border-border/60 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Controlli che facciamo noi</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">{content.controlli.title}</h2>
              <p className="text-base text-muted-foreground">{content.controlli.subtitle}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {content.controlli.items.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/20 p-4">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary" aria-hidden>
                    ✓
                  </div>
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{content.controlli.footnote}</p>
          </div>
        </section>

        {/* TRASPARENZA */}
        <section id="trasparenza" className="border-b border-border/60 bg-muted/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Trasparenza &amp; confini</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">{content.trasparenza.title}</h2>
              <p className="text-base text-muted-foreground">{content.trasparenza.subtitle}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-border/70 bg-background p-6">
                <h3 className="text-base font-semibold text-foreground">Cosa facciamo</h3>
                <ul className="mt-4 space-y-3">
                  {content.trasparenza.do.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border/70 bg-background p-6">
                <h3 className="text-base font-semibold text-foreground">Cosa non facciamo</h3>
                <ul className="mt-4 space-y-3">
                  {content.trasparenza.dont.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-muted-foreground" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-lg border border-border/70 bg-background p-6">
              <h3 className="text-base font-semibold text-foreground">{content.trasparenza.metodologiaTitle}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {content.trasparenza.metodologia.map((item) => (
                  <div key={item} className="flex items-start gap-2 rounded-md border border-border/60 bg-muted/20 p-3">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-md border border-border/60 bg-muted/30 p-4">
                <p className="text-sm font-semibold text-foreground">{content.trasparenza.regola}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINALE */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold sm:text-4xl">{content.cta.title}</h2>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground">{content.cta.subtitle}</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/verifica"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Avvia verifica finale"
              >
                {content.cta.primary}
              </Link>
              <Link
                href="#top"
                className="inline-flex items-center justify-center rounded-md border border-border/70 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Torna su"
              >
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

      <footer className="border-t border-border/60 bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="link-internal font-medium">
              {content.footer.privacy}
            </Link>
            <Link href="/disclaimer" className="link-internal font-medium">
              {content.footer.disclaimer}
            </Link>
            <Link href="/contatti" className="link-internal font-medium">
              {content.footer.contatti}
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">Materiale informativo ed educativo. Non è consulenza finanziaria regolamentata.</p>
        </div>
      </footer>
    </div>
  )
}
