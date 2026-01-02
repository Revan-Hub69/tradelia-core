'use client'

export default function WhySection() {
  return (
    <section className="border-t border-border/50 bg-muted/20 py-20 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="space-y-12">
          {/* Why we exist */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Perché esistiamo
              </p>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Lo squilibrio informativo è il vero problema.
              </h2>
            </div>
            
            <p className="text-base text-muted-foreground sm:text-lg">
              Nel mondo fintech, la maggior parte degli errori non nasce dalla mancanza di informazioni, ma da informazioni guidate da incentivi commerciali, non da criteri di coerenza operativa.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Prodotti fintech seri', desc: 'Broker, exchange, wallet regolamentati' },
                { label: 'Documenti ufficiali', desc: 'Risk management e compliance' },
                { label: 'Strumenti B2B', desc: 'Complessità reale, non semplificata' },
                { label: 'Zero growth hacking', desc: 'Nessun funnel manipolativo' }
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border/50 bg-background p-4">
                  <h3 className="text-sm font-semibold text-foreground">{item.label}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The problem */}
          <div className="space-y-6 border-t border-border/50 pt-12">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Il vero errore
              </p>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Non è la previsione sbagliata.
              </h2>
            </div>
            
            <p className="text-base text-muted-foreground sm:text-lg">
              Spesso è lo strumento scelto che non è compatibile con il tuo obiettivo, il tuo rischio, i tuoi vincoli e il tuo contesto.
            </p>

            <div className="space-y-3">
              {[
                'Non accusiamo l\'utente di ignoranza.',
                'Non accusiamo il mercato di essere ingiusto.',
                'Rendiamo la causa verificabile.'
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
