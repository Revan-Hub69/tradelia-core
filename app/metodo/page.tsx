export default function MetodoPage() {
  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="mx-auto max-w-4xl px-6 py-20 sm:px-8 sm:py-32">
        <div className="space-y-10">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Metodo pubblico
            </p>
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Compatibilita su piattaforme e piani, non ranking
            </h1>
            <p className="text-base text-muted-foreground">
              Questo documento descrive il perimetro, le regole e i limiti del metodo
              Tradelia. L'obiettivo e ridurre errori strutturali di scelta, non
              orientare decisioni di mercato.
            </p>
          </div>

          <div className="surface-card rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground">Perimetro</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>La verifica e basata su obiettivi dichiarati e vincoli operativi.</li>
              <li>Non produce suggerimenti di asset, timing o performance.</li>
              <li>Gli esiti sono descrittivi: adatto, frizione, non adatto.</li>
            </ul>
          </div>

          <div className="surface-card rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground">Input dichiarati</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Obiettivo e contesto operativo (orizzonte, frequenza, esperienza).</li>
              <li>Cosa vuoi evitare (costi, regole, custodia, stress decisionale).</li>
              <li>Vincoli pratici (paese, KYC, prelievi, tempi, assistenza).</li>
            </ul>
          </div>

          <div className="surface-card rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground">Dati considerati</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Costi contrattuali per piano: tariffe, canoni, funding/overnight, vincoli.</li>
              <li>Attriti operativi: spread/slippage stimati dove possibile, con limiti dichiarati.</li>
              <li>Vincoli e operativita: KYC, prelievi, limiti, orari, restrizioni.</li>
              <li>Supporto e problemi noti: reclami pubblici, incidenti, pagine status.</li>
              <li>Livello tecnico richiesto: custodia, leva, gestione rischio, procedure.</li>
            </ul>
          </div>

          <div className="surface-card rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground">Uso dell'AI</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              L'AI serve a estrarre e sintetizzare informazioni dai documenti ufficiali.
              La decisione finale segue regole deterministiche e verificabili.
            </p>
          </div>

          <div className="surface-card rounded-2xl p-6" id="limiti">
            <h2 className="text-base font-semibold text-foreground">Limiti dichiarati</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Non sostituisce consulenza regolamentata.</li>
              <li>Non copre preferenze fiscali o condizioni personali complesse.</li>
              <li>Se i dati sono insufficienti, l'esito puo essere \"non valutabile\".</li>
            </ul>
          </div>

          <div className="surface-card rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground">Versioning & changelog</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>Versione attuale: 2026.02</p>
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="font-semibold text-foreground">2026.02</p>
                <ul className="mt-2 space-y-1">
                  <li>Framework: compatibilita tra profilo e piattaforme/piani.</li>
                  <li>Output con frizioni, motivi e limiti dichiarati.</li>
                  <li>Separazione formale tra metodo e affiliazioni (se presenti).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

