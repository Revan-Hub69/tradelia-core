export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Strumenti</h1>
          <p className="text-muted-foreground">
            Strumenti reali per l'analisi e la gestione crypto.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Portfolio Tracker */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-2 text-lg font-semibold">Portfolio Tracker</h2>
            <p className="mb-4 text-muted-foreground">
              Monitora il tuo portafoglio crypto in tempo reale.
            </p>
            <div className="rounded border border-orange-200 bg-orange-50 p-3 text-sm text-orange-600 dark:border-orange-800 dark:bg-orange-950/30">
              In sviluppo - Disponibile presto
            </div>
          </div>

          {/* DCA Calculator */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-2 text-lg font-semibold">Calcolatore DCA</h2>
            <p className="mb-4 text-muted-foreground">
              Calcola la strategia Dollar Cost Averaging ottimale.
            </p>
            <div className="rounded border border-orange-200 bg-orange-50 p-3 text-sm text-orange-600 dark:border-orange-800 dark:bg-orange-950/30">
              In sviluppo - Disponibile presto
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-2 text-lg font-semibold">Valutazione Rischio</h2>
            <p className="mb-4 text-muted-foreground">
              Analizza il profilo di rischio del tuo portafoglio.
            </p>
            <div className="rounded border border-orange-200 bg-orange-50 p-3 text-sm text-orange-600 dark:border-orange-800 dark:bg-orange-950/30">
              In sviluppo - Disponibile presto
            </div>
          </div>

          {/* Exchange Comparison */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-2 text-lg font-semibold">Confronto Exchange</h2>
            <p className="mb-4 text-muted-foreground">
              Confronta commissioni e servizi degli exchange.
            </p>
            <div className="rounded border border-orange-200 bg-orange-50 p-3 text-sm text-orange-600 dark:border-orange-800 dark:bg-orange-950/30">
              In sviluppo - Disponibile presto
            </div>
          </div>
        </div>

        {/* Affiliate Disclaimer */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
          <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
            Trasparenza sui Partner
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Alcuni strumenti potrebbero includere link affiliati a servizi che riteniamo utili.
            Saremo sempre trasparenti su queste partnership e raccomanderemo solo servizi che usiamo personalmente.
          </p>
        </div>
      </div>
    </div>
  );
}
