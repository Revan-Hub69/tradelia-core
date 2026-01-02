'use client'

export default function ChecklistSection() {
  const items = [
    'Obiettivo dichiarato e orizzonte temporale',
    'Livello di rischio tollerabile e leva ammessa',
    'Regolazione, custodia, limiti operativi',
    'Costi reali: spread, funding, commissioni',
    'Documentazione ufficiale verificata'
  ]

  return (
    <section className="border-t border-border/50 py-20 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Strumento di verifica
            </p>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Checklist di coerenza.
            </h2>
            <p className="text-base text-muted-foreground">
              Non promette performance. Verifica compatibilità fra obiettivo, vincoli e caratteristiche ufficiali.
            </p>
          </div>

          {/* Checklist */}
          <div className="rounded-lg border border-border/50 bg-muted/20 p-8">
            <ul className="space-y-4">
              {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded border border-primary/30 bg-primary/5">
                    <span className="text-xs font-semibold text-primary">✓</span>
                  </div>
                  <span className="text-base text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Note */}
          <div className="rounded-lg border border-border/50 bg-background p-6">
            <p className="text-sm font-semibold text-foreground">
              "Non coerente" non significa "sbagliato".
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Significa che, per le tue condizioni, quello strumento aumenta il rischio di errore sistemico. Tradelia spiega il perché e indica quali variabili stanno generando frizione.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
