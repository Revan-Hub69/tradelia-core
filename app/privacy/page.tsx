export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="mx-auto max-w-4xl px-6 py-20 sm:px-8 sm:py-32">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Privacy
            </p>
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Informativa privacy
            </h1>
            <p className="text-base text-muted-foreground">
              In questa fase raccogliamo solo le informazioni necessarie a fornire la
              verifica di compatibilita. La presente pagina verra aggiornata con i
              dettagli completi in base all'evoluzione del servizio.
            </p>
          </div>

          <div className="surface-card rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground">Cosa raccogliamo</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Dati forniti volontariamente nel percorso di verifica.</li>
              <li>Dati tecnici minimi per sicurezza e funzionamento del servizio.</li>
              <li>Nessun dato viene venduto o ceduto a terze parti.</li>
            </ul>
          </div>

          <div className="surface-card rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground">Contatti privacy</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Per richieste o esercizio dei diritti puoi scrivere a{" "}
              <a className="text-foreground" href="mailto:support@tradelia.org">
                support@tradelia.org
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
