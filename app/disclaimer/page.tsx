export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="mx-auto max-w-4xl px-6 py-20 sm:px-8 sm:py-32">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Disclaimer
            </p>
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Informazioni e limiti
            </h1>
            <p className="text-base text-muted-foreground">
              Tradelia fornisce contenuti educativi e di verifica di compatibilita.
              Non fornisce consulenza finanziaria regolamentata.
            </p>
          </div>

          <div className="surface-card rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground">Cosa non facciamo</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Non suggeriamo asset specifici o timing di mercato.</li>
              <li>Non garantiamo performance o risultati futuri.</li>
              <li>Non sostituiamo consulenza professionale regolamentata.</li>
            </ul>
          </div>

          <div className="surface-card rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground">Responsabilita</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Le decisioni restano responsabilita dell'utente. Ogni scelta deve essere
              valutata in base alla propria situazione personale e ai rischi connessi.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
