'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main role="main" className="space-y-0">
        {/* HERO - Minimalista, forte */}
        <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-background via-background to-muted/20 px-6 py-20 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="space-y-6">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Scelta della piattaforma senza sorprese
              </p>
              <h1 className="text-5xl font-bold leading-tight text-foreground sm:text-6xl lg:text-7xl">
                Smetti di perdere soldi per colpa dell'intermediario sbagliato.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
                Ci dici cosa vuoi fare; Tradelia usa un algoritmo avanzato per incrociare le tue necessità con piani tariffari, reclami ufficiali e disservizi segnalati. Niente liste “promo”: solo compatibilità operativa e rischi messi a nudo.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/verify">Fai verificare la tua scelta</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="#problema">Perché evitarlo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* PROBLEMA - Dati concreti */}
        <section id="problema" className="border-b border-border/30 px-6 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-5xl space-y-12">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Il problema reale
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Chi sbaglia intermediario perde denaro anche con strategie corrette.
              </h2>
              <p className="text-base text-muted-foreground">
                Costi overnight che erodono i rendimenti, spread e commissioni nascosti, robo-advisor fasulli o non autorizzati, blocchi nei prelievi e assistenza assente: sono errori ricorrenti di scelta, non di mercato.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Funding overnight che annulla i profitti',
                  desc: 'Su posizioni multi-day i costi di finanziamento possono trasformare una strategia corretta in perdita netta. Molti piani “promo” aumentano il funding dopo poche settimane.'
                },
                {
                  title: 'Blocchi e disservizi reali',
                  desc: 'Crollo FTX (2022) con prelievi congelati; blackout Robinhood del 2-3-9 marzo 2020 con multa FINRA da 70M$: anche brand noti possono fermarti quando conta.'
                },
                {
                  title: 'Robo e comparatori sbilanciati',
                  desc: 'Algoritmi non autorizzati o basati su affiliazioni spingono soluzioni non compatibili col tuo profilo. La “lista migliore” non serve se non tiene conto del tuo uso reale.'
                }
              ].map((item, idx) => (
                <div key={idx} className="space-y-3 rounded-lg border border-border/30 bg-muted/10 p-6">
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 rounded-lg border border-border/30 bg-muted/10 p-8">
              <p className="text-sm font-semibold text-foreground">Non è “scegli e spera”.</p>
              <p className="text-base text-muted-foreground">
                È misurare la compatibilità tra la tua strategia e l’intermediario: costi reali (spread, commissioni, funding), limiti operativi (prelievi, orari, volumi), copertura legale e storico di reclami ufficiali.
              </p>
            </div>
          </div>
        </section>

        {/* METODO - 6 step */}
        <section id="come-funziona" className="border-b border-border/30 bg-muted/5 px-6 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-5xl space-y-12">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Metodo operativo (facciamo noi)
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Un percorso unico: tu dichiari l’intento, noi facciamo la verifica.
              </h2>
              <p className="text-base text-muted-foreground">
                Nessun confronto manuale, nessuna lista sponsorizzata. Solo una verifica motivata su misura, con alternative se troviamo rischi.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
              {[
                { num: '01', title: 'Intento', desc: 'Obiettivo, strumenti che vuoi usare, frequenza, orizzonte, budget, paese e sensibilità a costi/prelievi/assistenza.' },
                { num: '02', title: 'Algoritmo Tradelia', desc: 'Incrocio con 10.000+ piattaforme e piani: tariffe effettive (spread, commissioni, funding), limiti operativi, licenze, reclami ufficiali e disservizi pubblici.' },
                { num: '03', title: 'Risposta motivata', desc: 'Ti diciamo se è compatibile, perché, dove rischi (costi overnight, slippage, blocchi), e quale alternativa è coerente con il tuo uso reale.' }
              ].map((step) => (
                <div key={step.num} className="space-y-3 rounded-lg border border-border/30 bg-background p-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-primary">{step.num}</span>
                    <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CASI D'USO - Professionali e precisi */}
        <section className="border-b border-border/30 px-6 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-5xl space-y-12">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Dove si perde davvero
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Esempi pratici di incompatibilità operative.
              </h2>
              <p className="text-base text-muted-foreground">
                Non servono promesse: bastano i fatti. Ecco dove la scelta sbagliata dell’intermediario distrugge valore, anche quando la strategia è corretta.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  scenario: 'Posizioni overnight su indici/CFD',
                  risk: 'Funding e costi di rollover possono superare il rendimento atteso: dopo pochi giorni la posizione “verde” diventa negativa solo per il costo di tenuta.'
                },
                {
                  scenario: 'Trading frequente con prelievi periodici',
                  risk: 'Limiti o ritardi nei prelievi e fee di uscita mangiano il capitale. Crolli e blocchi (es. FTX 2022) mostrano il rischio di controparti non controllate.'
                },
                {
                  scenario: 'Automazione o API con strategie sistematiche',
                  risk: 'Piattaforme senza SLA o con API limitate generano slippage e ordini rifiutati. Un outage come quello di Robinhood del 2-3-9 marzo 2020 può annullare settimane di lavoro.'
                }
              ].map((item, idx) => (
                <div key={idx} className="space-y-3 rounded-lg border border-border/30 bg-muted/10 p-8">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Scenario</p>
                  <p className="text-base font-semibold text-foreground">{item.scenario}</p>
                  <div className="border-t border-border/30 pt-4">
                    <p className="text-sm text-muted-foreground">{item.risk}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VERIFICHE - Lavoro sporco fatto da noi */}
        <section className="border-b border-border/30 bg-muted/5 px-6 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-5xl space-y-12">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Lavoro sporco
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Verifiche che facciamo noi (non tu).
              </h2>
              <p className="text-base text-muted-foreground">
                Ogni controllo è basato su fonti ufficiali, database proprietario e segnalazioni di disservizio. Il risultato è una decisione motivata, non una lista generica.
              </p>
            </div>

            <div className="rounded-lg border border-border/30 bg-background p-8">
              <div className="space-y-4">
                {[
                  'Obiettivo e orizzonte (intraday, multi-day, accumulo lungo termine)',
                  'Costi reali: spread, commissioni, funding overnight, slippage storico su asset specifici',
                  'Limiti operativi: volume massimo, orari di trading, blocchi KYC, fee e tempi di prelievo',
                  'Regolazione e custodia: licenze, segregazione fondi, protezioni saldo negativo',
                  'Affidabilità: SLA supporto, lingue coperte, storico di outage e reclami ufficiali',
                  'Documentazione verificata: termini di servizio, policy di liquidazione, condizioni promozionali'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded border border-primary/30 bg-primary/5 flex-shrink-0">
                      <span className="text-xs font-bold text-primary">✓</span>
                    </div>
                    <p className="text-base text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border/30 bg-background p-6">
              <p className="text-sm font-semibold text-foreground">
                "Non coerente" non significa "sbagliato".
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Significa che, per le tue condizioni specifiche, quello strumento aumenta il rischio di errore sistemico. Tradelia spiega il perché, quantifica l'impatto economico e suggerisce un'alternativa compatibile.
              </p>
            </div>
          </div>
        </section>

        {/* CONFINI - Cosa facciamo/non facciamo */}
        <section className="border-b border-border/30 px-6 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-5xl space-y-12">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Trasparenza
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Confini espliciti.
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground">Cosa facciamo</h3>
                <ul className="space-y-3">
                  {[
                    'Verifichiamo compatibilità tra obiettivo e strumento',
                    'Quantifichiamo costi operativi reali',
                    'Evidenziamo rischi sistemici',
                    'Forniamo fonti ufficiali verificabili'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground">Cosa non facciamo</h3>
                <ul className="space-y-3">
                  {[
                    'Non suggeriamo asset specifici',
                    'Non forniamo segnali di trading',
                    'Non promettiamo performance',
                    'Non sostituiamo consulenza regolamentata'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FONTI - Verificabilità */}
        <section className="border-b border-border/30 bg-muted/5 px-6 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-5xl space-y-12">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Metodologia
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Verificabile, non persuasivo.
              </h2>
            </div>

            <div className="space-y-4">
              {[
                'Documentazione ufficiale: termini di servizio, policy di liquidazione, regolatori e licenze dichiarate.',
                'Dati operativi: tariffe pubblicate, spread e funding storico, tempi e limiti di prelievo.',
                'Segnalazioni pubbliche: reclami ufficiali, downtime dichiarati, multe e richiami regolatori.',
                'AI per estrarre e normalizzare le evidenze; la decisione resta guidata da regole e fonti verificabili.',
                'Affiliazioni dichiarate e separate dalla valutazione di compatibilità.'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 rounded-lg border border-border/30 bg-background p-4">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINALE */}
        <section className="px-6 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-5xl space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Pronto a scoprire se la tua scelta regge?
              </h2>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                Dichiara il tuo obiettivo operativo. Tradelia fa il lavoro sporco: verifica costi nascosti, reclami ufficiali e disservizi, e ti dice se l'intermediario è compatibile o se serve un'alternativa.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/verify">Fai verificare la piattaforma</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">Torna alla homepage</Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Versione metodo: 2026.01 — niente hype, solo compatibilità e rischi espliciti.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
