'use client'

export default function BoundariesSection() {
  const does = [
    'Verifica compatibilità tra obiettivo e strumento',
    'Evidenzia incoerenze e rischi evitabili',
    'Fornisce spiegazioni basate su fonti ufficiali',
    'Interrompe l\'automatismo interpretativo'
  ]

  const doesNot = [
    'Suggerisce asset specifici',
    'Fornisce segnali di acquisto/vendita',
    'Promette risultati o performance',
    'Sostituisce consulenza regolamentata'
  ]

  return (
    <section className="border-t border-border/50 bg-muted/20 py-20 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Chiusura dei confini
            </p>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Cosa facciamo. Cosa non facciamo.
            </h2>
            <p className="text-base text-muted-foreground">
              Trasparenza totale sui limiti del sistema.
            </p>
          </div>

          {/* Two columns */}
          <div className="grid gap-8 sm:grid-cols-2">
            {/* Does */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground">Cosa facciamo</h3>
              <ul className="space-y-3">
                {does.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Does not */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground">Cosa non facciamo</h3>
              <ul className="space-y-3">
                {doesNot.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
