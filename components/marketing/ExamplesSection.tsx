'use client'

export default function ExamplesSection() {
  const examples = [
    {
      need: 'Leva intraday',
      incompatible: 'Conto deposito',
      reason: 'Non offre leva, non permette operazioni intraday'
    },
    {
      need: 'Evitare KYC',
      incompatible: 'Broker regolamentato',
      reason: 'La regolazione richiede identificazione completa'
    },
    {
      need: 'Custodia critica',
      incompatible: 'Exchange non-custodial',
      reason: 'Tu gestisci le chiavi, non l\'exchange'
    },
    {
      need: 'Minimizzare costi',
      incompatible: 'Ignorare spread reale',
      reason: 'Lo spread pesa più della fee nominale'
    }
  ]

  return (
    <section className="border-t border-border/50 bg-muted/20 py-20 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Regole esplicite
            </p>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Incompatibilità verificabili.
            </h2>
            <p className="text-base text-muted-foreground">
              Esempi concreti di quando uno strumento non è adatto al tuo obiettivo.
            </p>
          </div>

          {/* Examples */}
          <div className="space-y-4">
            {examples.map((example, idx) => (
              <div key={idx} className="rounded-lg border border-border/50 bg-background p-6">
                <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Se vuoi
                    </p>
                    <p className="mt-2 text-base font-semibold text-foreground">{example.need}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Non è compatibile
                    </p>
                    <p className="mt-2 text-base font-semibold text-foreground">{example.incompatible}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Perché
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{example.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
