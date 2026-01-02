export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[60rem] px-6 pb-24 pt-12 sm:px-8 sm:pt-16">
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Premessa
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-primary sm:text-4xl">
            Tradelia non convince. Tradelia chiarisce.
          </h1>
          <p className="text-base text-secondary sm:text-lg">
            Perché esistiamo. Tradelia nasce per ridurre lo squilibrio informativo
            creato da contenuti comparativi guidati da incentivi commerciali, non
            da criteri di coerenza operativa.
          </p>
          <p className="text-base text-secondary sm:text-lg">
            Verifica la compatibilità tra ciò che l'utente dichiara di voler fare
            e le caratteristiche reali di broker, wallet, exchange e conti
            deposito, sempre su fonti ufficiali.
          </p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Prodotti fintech seri.</p>
            <p>Documenti di risk management.</p>
            <p>Strumenti B2B ad alta complessità.</p>
            <p>Non funnel da growth hacker.</p>
          </div>
        </section>

        <section className="mt-16 space-y-6 border-t border-border/60 pt-12 sm:mt-20 sm:pt-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Disambiguazione immediata
          </p>
          <h2 className="text-xl font-semibold text-primary sm:text-2xl">
            Non ti diciamo cosa comprare.
          </h2>
          <p className="text-base text-secondary">
            Nessun segnale, nessuna promessa, nessuna spinta all'azione rapida.
            Tradelia interrompe l'automatismo interpretativo e costringe il
            cervello a entrare in modalità analitica.
          </p>
          <p className="text-sm text-muted-foreground">
            Sistema 1 interrotto. Sistema 2 attivo.
          </p>
        </section>

        <section className="mt-16 space-y-6 border-t border-border/60 pt-12 sm:mt-20 sm:pt-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Spostamento del problema
          </p>
          <h2 className="text-xl font-semibold text-primary sm:text-2xl">
            Molti errori nascono prima dell'operazione.
          </h2>
          <p className="text-base text-secondary">
            L'errore non è "previsione sbagliata". Spesso è lo strumento scelto
            che non è compatibile con obiettivo, rischio, vincoli e contesto.
            L'informazione può essere corretta, ma operativamente distorta se
            l'incentivo è commerciale.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm text-secondary">
            <li>Non accusiamo l'utente.</li>
            <li>Non accusiamo il mercato.</li>
            <li>Rendiamo la causa verificabile.</li>
          </ul>
        </section>

        <section className="mt-16 space-y-6 border-t border-border/60 pt-12 sm:mt-20 sm:pt-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Principio non ovvio
          </p>
          <h2 className="text-xl font-semibold text-primary sm:text-2xl">
            Lo strumento non è neutro.
          </h2>
          <p className="text-base text-secondary">
            Tradelia tratta portali finanziari come sistemi con caratteristiche
            reali: costi, regolazione, leva, liquidità, custodia, limiti
            operativi. La compatibilità non è un'opinione: è una verifica.
          </p>
        </section>

        <section
          id="metodo-operativo"
          className="mt-16 space-y-8 border-t border-border/60 pt-12 sm:mt-20 sm:pt-16"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Metodo cognitivo
          </p>
          <h2 className="text-xl font-semibold text-primary sm:text-2xl">
            Sei passaggi, un solo obiettivo: chiarezza.
          </h2>
          <ol className="space-y-5">
            {[
              {
                title: "Disambiguazione",
                text: "Blocca l'automatismo interpretativo e riduce le aspettative errate."
              },
              {
                title: "Frizione cognitiva",
                text: "Introduce dubbio produttivo senza colpevolizzare."
              },
              {
                title: "Ristrutturazione mentale",
                text:
                  "Sposta il focus: non \"ho sbagliato previsione\", ma \"ho scelto uno strumento incompatibile\"."
              },
              {
                title: "Strumento di verifica",
                text: "Checklist tecnica, non gratificazione immediata."
              },
              {
                title: "Controllo dell'interpretazione",
                text: "Spiega come leggere il risultato per evitare sovrainterpretazioni."
              },
              {
                title: "Chiusura dei confini",
                text: "Definisce chiaramente cosa Tradelia fa e cosa non fa."
              }
            ].map((item, index) => (
              <li key={item.title} className="grid gap-2 sm:grid-cols-[auto,1fr] sm:gap-6">
                <span className="text-xs font-medium text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-primary">{item.title}</h3>
                  <p className="text-sm text-secondary">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16 space-y-6 border-t border-border/60 pt-12 sm:mt-20 sm:pt-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Regole esplicite
          </p>
          <h2 className="text-xl font-semibold text-primary sm:text-2xl">
            Esempi di incompatibilità verificabili.
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-secondary">
            <li>Se ti serve leva intraday, un conto deposito non è compatibile.</li>
            <li>Se vuoi evitare KYC, un broker regolamentato non è coerente.</li>
            <li>
              Se la custodia è critica, un exchange non-custodial è un vincolo,
              non un dettaglio.
            </li>
            <li>
              Se i costi sono il limite principale, lo spread reale pesa più della
              fee nominale.
            </li>
          </ul>
        </section>

        <section className="mt-16 space-y-6 border-t border-border/60 pt-12 sm:mt-20 sm:pt-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Strumento di verifica
          </p>
          <h2 className="text-xl font-semibold text-primary sm:text-2xl">
            Checklist, non dashboard.
          </h2>
          <p className="text-base text-secondary">
            Lo strumento non promette performance. Verifica compatibilità fra
            obiettivo, vincoli e caratteristiche ufficiali del portale scelto.
          </p>
          <div className="border border-border/70 bg-muted/30 p-6 sm:p-8">
            <h3 className="text-sm font-semibold text-primary">
              Checklist di coerenza (non operativa)
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-secondary">
              <li>Obiettivo dichiarato e orizzonte temporale.</li>
              <li>Livello di rischio tollerabile e leva ammessa.</li>
              <li>Regolazione, custodia, limiti operativi.</li>
              <li>Costi reali: spread, funding, commissioni.</li>
              <li>Documentazione ufficiale verificata.</li>
            </ul>
          </div>
        </section>

        <section className="mt-16 space-y-6 border-t border-border/60 pt-12 sm:mt-20 sm:pt-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Controllo dell'interpretazione
          </p>
          <h2 className="text-xl font-semibold text-primary sm:text-2xl">
            Come leggere un risultato "non coerente".
          </h2>
          <p className="text-base text-secondary">
            "Non coerente" non significa "sbagliato". Significa che, per le tue
            condizioni, quello strumento aumenta il rischio di errore sistemico.
            Tradelia spiega il perché e indica quali variabili stanno generando
            frizione.
          </p>
          <p className="text-sm text-muted-foreground">
            Meta-cognizione: evitare euforia, evitare rifiuto difensivo.
          </p>
        </section>

        <section className="mt-16 space-y-6 border-t border-border/60 pt-12 sm:mt-20 sm:pt-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Chiusura dei confini
          </p>
          <h2 className="text-xl font-semibold text-primary sm:text-2xl">
            Ci fermiamo prima della decisione. Intenzionalmente.
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-secondary">
            <li>Non suggeriamo asset.</li>
            <li>Non eseguiamo ordini.</li>
            <li>Non ottimizziamo performance.</li>
            <li>Non sostituiamo consulenza regolamentata.</li>
          </ul>
        </section>

        <section className="mt-16 space-y-6 border-t border-border/60 pt-12 sm:mt-20 sm:pt-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Trasparenza e fonti
          </p>
          <h2 className="text-xl font-semibold text-primary sm:text-2xl">
            Verificabile, non persuasivo.
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-secondary">
            <li>
              Documentazione ufficiale di broker, wallet, exchange, conti deposito.
            </li>
            <li>Principi di risk management e decision hygiene.</li>
            <li>AI usata per analisi documentale e sintesi, non per decidere.</li>
            <li>Affiliazioni possibili ma separate dal metodo.</li>
            <li>Compatibilità con MiFID e comunicazione non persuasiva.</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            <a href="#metodo-operativo" className="underline underline-offset-4">
              Approfondisci il metodo operativo
            </a>
          </p>
        </section>

        <section className="mt-16 border-t border-border/60 pt-12 sm:mt-20 sm:pt-16">
          <div className="border-l border-border/80 pl-4 text-sm text-muted-foreground">
            Regola d'oro: se una frase aumenta l'eccitazione, è sbagliata. Se
            aumenta la chiarezza, è giusta.
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Versione framework: 2026.01 - Tradelia non convince. Tradelia chiarisce.
          </p>
        </section>
      </main>
    </div>
  );
}
