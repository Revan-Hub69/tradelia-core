import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Target } from "lucide-react"
import { BrainIcon } from "@/components/icons/brain-icon"
import { WarningIcon } from "@/components/icons/warning-icon"
import Link from "next/link"

export default function MetodoPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <SectionLayout className="py-20">
          <div className="mx-auto max-w-4xl">
            
            {/* Header */}
            <header className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-6">
                <div className="w-2 h-2 rounded-full bg-primary" aria-hidden="true"></div>
                Metodo & Fonti
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Come funziona Tradelia
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
                Trasparenza completa su metodologia, fonti e limitazioni del sistema educativo.
              </p>
            </header>

            {/* Core Principles */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold mb-8 text-center">Principi Fondamentali</h2>
              
              <div className="grid gap-6">
                <UnifiedCard className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                        <BrainIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                          Tradelia è educativo
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          L'obiettivo è sviluppare comprensione e senso critico, non fornire segnali operativi 
                          o consigli di investimento.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </UnifiedCard>

                <UnifiedCard className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <WarningIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Non fornisce consulenza
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Nessun contenuto costituisce consulenza finanziaria personalizzata. 
                          Ogni decisione rimane di esclusiva responsabilità dell'utente.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </UnifiedCard>

                <UnifiedCard className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                        <Target className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                          Non suggerisce operazioni
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Non troverai mai indicazioni su cosa comprare, vendere o quando farlo. 
                          Solo strumenti per capire il contesto.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </UnifiedCard>
              </div>
            </section>

            {/* Methodology */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold mb-8 text-center">Metodologia</h2>
              
              <UnifiedCard>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Struttura delle Lezioni</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Ogni contenuto educativo segue sempre lo stesso schema:
                      </p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="font-medium text-sm mb-1">1. Il Concetto</div>
                          <div className="text-xs text-muted-foreground">Spiegazione chiara e diretta</div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="font-medium text-sm mb-1">2. Esempio Reale</div>
                          <div className="text-xs text-muted-foreground">Caso concreto e verificabile</div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="font-medium text-sm mb-1">3. Errore Comune</div>
                          <div className="text-xs text-muted-foreground">Cosa si sbaglia di solito</div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="font-medium text-sm mb-1">4. Regola di Sicurezza</div>
                          <div className="text-xs text-muted-foreground">Come evitare l'errore</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Approccio Anti-Hype</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Nessuna promessa di guadagno o performance</li>
                        <li>• Nessuna pressione temporale o urgenza artificiale</li>
                        <li>• Focus su comprensione, non su azione immediata</li>
                        <li>• Evidenziazione di rischi e limitazioni</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </UnifiedCard>
            </section>

            {/* Sources */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold mb-8 text-center">Le Fonti Utilizzate</h2>
              
              <div className="grid gap-4">
                <UnifiedCard>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">CoinGecko API</h3>
                        <p className="text-sm text-muted-foreground">
                          Dati di mercato e Fear & Greed Index
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Live</Badge>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </UnifiedCard>

                <UnifiedCard>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">Alternative.me</h3>
                        <p className="text-sm text-muted-foreground">
                          Fear & Greed Index originale
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Live</Badge>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </UnifiedCard>

                <UnifiedCard>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">Ricerca Accademica</h3>
                        <p className="text-sm text-muted-foreground">
                          Paper e studi su behavioral finance e crypto
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Statico</Badge>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </UnifiedCard>

                <UnifiedCard>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">Analisi Proprietaria</h3>
                        <p className="text-sm text-muted-foreground">
                          Elaborazione e interpretazione dei dati grezzi
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Interno</Badge>
                      </div>
                    </div>
                  </CardContent>
                </UnifiedCard>
              </div>
            </section>

            {/* Limitations */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold mb-8 text-center">Limitazioni e Scope</h2>
              
              <UnifiedCard className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
                <CardContent className="p-8">
                  <div className="space-y-4 text-sm">
                    <div>
                      <h3 className="font-semibold mb-2 text-yellow-900 dark:text-yellow-100">
                        Cosa NON facciamo
                      </h3>
                      <ul className="space-y-1 text-yellow-700 dark:text-yellow-300">
                        <li>• Previsioni di prezzo o timing di mercato</li>
                        <li>• Raccomandazioni su specifiche criptovalute</li>
                        <li>• Analisi tecnica o segnali di trading</li>
                        <li>• Consulenza personalizzata o portfolio management</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-yellow-900 dark:text-yellow-100">
                        Limitazioni dei Dati
                      </h3>
                      <ul className="space-y-1 text-yellow-700 dark:text-yellow-300">
                        <li>• I dati di mercato possono avere ritardi o imprecisioni</li>
                        <li>• Gli indicatori mostrano il passato, non predicono il futuro</li>
                        <li>• L'interpretazione rimane soggettiva e contestuale</li>
                        <li>• Nessun sistema può eliminare completamente i rischi</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </UnifiedCard>
            </section>

            {/* Back to Dashboard */}
            <section className="text-center">
              <Button asChild variant="outline">
                <Link href="/dashboard/start">
                  Torna al Percorso di Orientamento
                </Link>
              </Button>
            </section>

            {/* Legal Disclaimer */}
            <footer className="mt-16 pt-8 border-t border-border text-center">
              <p className="text-xs text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                <strong className="font-medium">Disclaimer legale:</strong> Tradelia è un sistema educativo. 
                Nessun contenuto costituisce consulenza finanziaria, raccomandazione di investimento o 
                sollecitazione all'acquisto/vendita di strumenti finanziari. Gli investimenti in criptovalute 
                comportano rischi significativi inclusa la perdita totale del capitale. 
                Consultare sempre un consulente finanziario qualificato prima di prendere decisioni di investimento.
              </p>
            </footer>
            
          </div>
        </SectionLayout>
      </div>
    </ErrorBoundary>
  )
}