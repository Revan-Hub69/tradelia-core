export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Impara</h1>
          <p className="text-muted-foreground">
            Percorsi educativi crypto strutturati e basati su evidenze scientifiche.
          </p>
        </div>

        {/* Main Learning Path */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Percorso Fondamentale</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Il percorso base per comprendere le criptovalute, la blockchain e i rischi reali.
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Modulo 1: Fondamenti
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Cos'è Bitcoin, blockchain, wallet e sicurezza di base.
                </p>
              </div>
              
              <div className="rounded-lg bg-purple-50 dark:bg-purple-950/30 p-4 border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  Modulo 2: Rischi e Sicurezza
                </h3>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Truffe comuni, gestione delle chiavi private, backup.
                </p>
              </div>
              
              <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-4 border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Modulo 3: Mercati
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Come funzionano gli exchange, volatilità, analisi di base.
                </p>
              </div>
              
              <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 p-4 border border-orange-200 dark:border-orange-800">
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  Modulo 4: DeFi e Avanzato
                </h3>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Finanza decentralizzata, smart contracts, yield farming.
                </p>
              </div>
            </div>

            <div className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-950/30 p-3 rounded border border-orange-200 dark:border-orange-800">
              Contenuti in fase di sviluppo - Prime lezioni disponibili presto
            </div>
          </div>
        </div>

        {/* Specialized Paths */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Percorsi Specialistici</h2>
          <p className="text-muted-foreground mb-4">
            Percorsi avanzati disponibili dopo il completamento del percorso fondamentale.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">🟡 Custodia Sicura</h3>
              <p className="text-sm text-muted-foreground">
                Hardware wallet, multi-sig, cold storage. Rischio: Basso
              </p>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">🔵 Rendite Passive</h3>
              <p className="text-sm text-muted-foreground">
                Staking, lending, yield farming. Rischio: Medio
              </p>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">🟢 Investimento</h3>
              <p className="text-sm text-muted-foreground">
                Analisi fondamentale, portfolio allocation. Rischio: Medio-Alto
              </p>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">🔴 Trading</h3>
              <p className="text-sm text-muted-foreground">
                Analisi tecnica, gestione rischio. Rischio: Alto ⚠️
              </p>
            </div>
          </div>
        </div>

        {/* Learning Methodology */}
        <div className="rounded-lg bg-slate-50 dark:bg-slate-950/30 p-4 border border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Metodologia di Apprendimento
          </h3>
          <ul className="text-sm text-slate-800 dark:text-slate-200 space-y-1">
            <li>• Spaced Repetition per migliorare la retention</li>
            <li>• Active Recall con quiz interattivi</li>
            <li>• Microlearning: lezioni di 3-5 minuti</li>
            <li>• Esempi pratici e case study reali</li>
            <li>• Nessuna gamification aggressiva</li>
          </ul>
        </div>
      </div>
    </div>
  );
}