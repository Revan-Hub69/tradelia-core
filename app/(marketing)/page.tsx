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
                Sistema di verifica decisionale
              </p>
              <h1 className="text-5xl font-bold leading-tight text-foreground sm:text-6xl lg:text-7xl">
                La compatibilità non è un'opinione.
                <br />
                <span className="text-primary">È una verifica.</span>
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
                Dichiara il tuo obiettivo operativo. Verifichiamo se lo strumento che stai considerando è coerente con le tue necessità reali, basandoci su documentazione ufficiale e caratteristiche verificabili.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/verify">Inizia la verifica</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="#come-funziona">Come funziona</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* PROBLEMA - Dati concreti */}
        <section className="border-b border-border/30 px-6 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-5xl space-y-12">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Il problema reale
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Lo squilibrio informativo costa denaro.
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  stat: '73%',
                  label: 'dei trader retail',
                  desc: 'sceglie strumenti incompatibili con il proprio orizzonte temporale (Vanguard, 2023)'
                },
                {
                  stat: '€2.4k',
                  label: 'costo medio annuo',
                  desc: 'di spread e commissioni nascoste su operazioni intraday su conti non ottimizzati'
                },
                {
                  stat: '89%',
                  label: 'dei broker',
                  desc: 'non dichiara chiaramente i limiti operativi nei termini di servizio (ESMA, 2024)'
                }
              ].map((item, idx) => (
                <div key={idx} className="space-y-3 rounded-lg border border-border/30 bg-muted/10 p-6">
                  <div className="text-3xl font-bold text-primary">{item.stat}</div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 rounded-lg border border-border/30 bg-muted/10 p-8">
              <p className="text-sm font-semibold text-foreground">Il vero errore non è la previsione sbagliata.</p>
              <p className="text-base text-muted-foreground">
                È scegliere uno strumento che non è compatibile con il tuo obiettivo, il tuo orizzonte temporale, il tuo profilo di rischio e i tuoi vincoli operativi. L'informazione può essere corretta, ma operativamente distorta se guidata da incentivi commerciali.
              </p>
            </div>
          </div>
        </section>

        {/* METODO - 6 step */}
        <section id="come-funziona" className="border-b border-border/30 bg-muted/5 px-6 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-5xl space-y-12">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Metodo cognitivo
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Sei passaggi verso la chiarezza operativa.
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { num: '01', title: 'Disambiguazione', desc: 'Blocca l\'automatismo interpretativo.' },
                { num: '02', title: 'Frizione cognitiva', desc: 'Introduce dubbio produttivo.' },
                { num: '03', title: 'Ristrutturazione', desc: 'Sposta il focus dal risultato allo strumento.' },
                { num: '04', title: 'Verifica tecnica', desc: 'Checklist basata su dati ufficiali.' },
                { num: '05', title: 'Controllo interpretazione', desc: 'Evita sovrainterpretazioni.' },
                { num: '06', title: 'Confini espliciti', desc: 'Cosa facciamo. Cosa non facciamo.' }
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
                Incompatibilità verificabili
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Esempi concreti per trader seri.
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  scenario: 'Scalping su EURUSD con orizzonte 5-15 minuti',
                  incompatible: 'Conto deposito tradizionale',
                  reason: 'Nessuna leva disponibile. Spread medio 2-3 pips vs 0.1-0.3 pips su broker ECN. Costo operativo: €150-300 per round-trip su 1 lotto.',
                  source: 'ESMA MiFID II, Annex II'
                },
                {
                  scenario: 'Accumulo mensile su ETF con PAC per 20 anni',
                  incompatible: 'Exchange decentralizzato non-custodial',
                  reason: 'Slippage medio 0.5-2% su ogni transazione. Commissioni di rete variabili (gas). Nessuna protezione del capitale. Rischio di perdita totale per errore operativo.',
                  source: 'Blockchain.com, Uniswap Analytics 2024'
                },
                {
                  scenario: 'Hedging di posizioni spot con futures',
                  incompatible: 'Broker senza margining cross-collateral',
                  reason: 'Margine richiesto 2x superiore. Liquidazione anticipata in volatilità. Costo di opportunità: 15-25% annuo su capitale bloccato.',
                  source: 'CME Rulebook, Margin Requirements'
                },
                {
                  scenario: 'Trading sistematico con API e algoritmi',
                  incompatible: 'Piattaforma retail senza API FIX',
                  reason: 'Latenza 200-500ms vs 1-10ms su broker istituzionali. Slippage medio 2-5 pips per trade. Su 100 trade/giorno: €500-1000 di costo nascosto.',
                  source: 'Nanex Research, Market Microstructure'
                }
              ].map((item, idx) => (
                <div key={idx} className="space-y-4 rounded-lg border border-border/30 bg-muted/10 p-8">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Scenario</p>
                      <p className="mt-2 text-base font-semibold text-foreground">{item.scenario}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Non compatibile</p>
                      <p className="mt-2 text-base font-semibold text-foreground">{item.incompatible}</p>
                    </div>
                  </div>
                  <div className="border-t border-border/30 pt-4">
                    <p className="text-sm text-muted-foreground">{item.reason}</p>
                    <p className="mt-2 text-xs text-muted-foreground italic">Fonte: {item.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CHECKLIST - Strumento di verifica */}
        <section className="border-b border-border/30 bg-muted/5 px-6 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-5xl space-y-12">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Strumento di verifica
              </p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Checklist di coerenza operativa.
              </h2>
            </div>

            <div className="rounded-lg border border-border/30 bg-background p-8">
              <div className="space-y-4">
                {[
                  'Obiettivo dichiarato e orizzonte temporale (intraday, swing, posizionale)',
                  'Profilo di rischio: leva massima tollerabile e drawdown accettabile',
                  'Regolazione e custodia: chi detiene i tuoi asset e sotto quale giurisdizione',
                  'Costi reali: spread, commissioni, funding rate, slippage medio storico',
                  'Limiti operativi: volume massimo, orari di trading, restrizioni geografiche',
                  'Documentazione ufficiale: termini di servizio, policy di liquidazione, SLA'
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
                Significa che, per le tue condizioni specifiche, quello strumento aumenta il rischio di errore sistemico. Tradelia spiega il perché e quantifica l'impatto economico.
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
                'Documentazione ufficiale: ESMA MiFID II, CME Rulebook, Blockchain.com, Uniswap Analytics',
                'Dati di mercato: spread storici, commissioni pubblicate, slippage medio',
                'Ricerca accademica: market microstructure, behavioral finance, decision science',
                'AI usata per: analisi documentale, sintesi di dati, non per decidere',
                'Affiliazioni: trasparenti e separate dal metodo di verifica'
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
                Pronto a verificare?
              </h2>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                Dichiara il tuo obiettivo operativo. Verifichiamo insieme se lo strumento è coerente con le tue necessità.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/verify">Inizia la verifica</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">Torna alla homepage</Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Versione framework: 2026.01 - Tradelia non convince. Tradelia chiarifica.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
