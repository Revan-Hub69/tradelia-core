'use client'

export default function SourcesSection() {
  const sources = [
    'Documentazione ufficiale di broker, wallet, exchange, conti deposito',
    'Principi di risk management e decision hygiene',
    'AI usata per analisi documentale e sintesi, non per decidere',
    'Affiliazioni possibili ma separate dal metodo',
    'Compatibilità con MiFID e comunicazione non persuasiva'
  ]

  return (
    <section className="border-t border-border/50 py-20 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Trasparenza e fonti
            </p>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Verificabile, non persuasivo.
            </h2>
            <p className="text-base text-muted-foreground">
              Ogni affermazione è tracciabile e verificabile.
            </p>
          </div>

          {/* Sources list */}
          <ul className="space-y-4">
            {sources.map((source, idx) => (
              <li key={idx} className="flex items-start gap-4 rounded-lg border border-border/50 bg-muted/20 p-4">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{source}</span>
              </li>
            ))}
          </ul>

          {/* Golden rule */}
          <div className="rounded-lg border border-border/50 bg-background p-6">
            <p className="text-sm italic text-muted-foreground">
              "Regola d'oro: se una frase aumenta l'eccitazione, è sbagliata. Se aumenta la chiarezza, è giusta."
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
