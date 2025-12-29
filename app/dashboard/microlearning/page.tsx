import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, ArrowRight } from "lucide-react"
import { BrainIcon } from "@/components/icons/brain-icon"
import { WarningIcon } from "@/components/icons/warning-icon"
import Link from "next/link"

// Lezioni educative minime funzionali
const lessons = [
  {
    id: 'volatilita',
    title: 'Cos\'è la Volatilità',
    duration: '3 min',
    status: 'available',
    concept: 'La volatilità misura quanto oscillano i prezzi in un periodo di tempo.',
    example: 'Bitcoin passa da €40.000 a €35.000 in una settimana = alta volatilità.',
    commonError: 'Pensare che alta volatilità = sempre perdite.',
    safetyRule: 'Alta volatilità significa rischio in entrambe le direzioni.'
  },
  {
    id: 'market-cap',
    title: 'Market Cap vs Prezzo',
    duration: '4 min',
    status: 'available',
    concept: 'Il market cap è prezzo × numero totale di monete in circolazione.',
    example: 'Moneta A: €1 × 1 miliardo = €1 miliardo market cap. Moneta B: €1000 × 1 milione = €1 miliardo market cap. Stesso valore totale.',
    commonError: 'Comprare monete "economiche" pensando che saliranno di più.',
    safetyRule: 'Il prezzo unitario non indica il potenziale di crescita.'
  },
  {
    id: 'fomo-hype',
    title: 'FOMO e Cicli di Hype',
    duration: '5 min',
    status: 'available',
    concept: 'FOMO (Fear of Missing Out) è la paura di perdere un\'opportunità che spinge a decisioni affrettate.',
    example: 'Tutti parlano di una crypto che sale del 300%. Ti senti obbligato a comprare subito.',
    commonError: 'Comprare al picco dell\'hype quando tutti ne parlano.',
    safetyRule: 'Quando tutti parlano di qualcosa, spesso è già tardi.'
  },
  {
    id: 'pump-dump',
    title: 'Schema Pump & Dump',
    duration: '4 min',
    status: 'available',
    concept: 'Pump & Dump: gonfiare artificialmente il prezzo (pump) per poi vendere tutto (dump).',
    example: 'Gruppo Telegram con 10.000 membri: "Compriamo tutti XYZ alle 15:00". Prezzo sale, organizzatori vendono, prezzo crolla.',
    commonError: 'Partecipare pensando di essere abbastanza veloci da guadagnare.',
    safetyRule: 'Se qualcuno ti dice quando comprare e vendere, è una truffa.'
  }
]

export default function MicrolearningPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <SectionLayout className="py-20">
          <div className="mx-auto max-w-4xl">
            
            {/* Header */}
            <header className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-6">
                <div className="w-2 h-2 rounded-full bg-primary" aria-hidden="true"></div>
                Microlearning
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Capire prima di credere
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
                Brevi lezioni per capire concetti fondamentali, senza promesse e senza segnali.
              </p>
            </header>

            {/* Educational Disclaimer */}
            <div className="mb-12">
              <UnifiedCard className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                      <BrainIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      <strong>Struttura:</strong> Concetto → Esempio reale → Errore comune → Regola di sicurezza
                    </p>
                  </div>
                </CardContent>
              </UnifiedCard>
            </div>

            {/* Lessons Grid */}
            <section className="grid gap-6 mb-12">
              {lessons.map((lesson) => (
                <UnifiedCard key={lesson.id} className="hover:border-primary/30 transition-all duration-200 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <BrainIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{lesson.title}</h3>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {lesson.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>

                    <div className="space-y-4 text-sm">
                      <div>
                        <div className="font-medium text-primary mb-1">💡 Il Concetto</div>
                        <p className="text-muted-foreground">{lesson.concept}</p>
                      </div>

                      <div>
                        <div className="font-medium text-green-700 dark:text-green-400 mb-1">📊 Esempio Reale</div>
                        <p className="text-muted-foreground">{lesson.example}</p>
                      </div>

                      <div>
                        <div className="font-medium text-orange-700 dark:text-orange-400 mb-1">❌ Errore Comune</div>
                        <p className="text-muted-foreground">{lesson.commonError}</p>
                      </div>

                      <div>
                        <div className="font-medium text-red-700 dark:text-red-400 mb-1">🛡️ Regola di Sicurezza</div>
                        <p className="text-muted-foreground">{lesson.safetyRule}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Completata
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Rivedi Lezione
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </UnifiedCard>
              ))}
            </section>

            {/* Coming Soon */}
            <section className="text-center mb-12">
              <UnifiedCard variant="hero" className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <div className="p-2 rounded-lg bg-muted/30 w-fit mx-auto mb-4">
                    <WarningIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold mb-4">Altre Lezioni in Arrivo</h2>
                  <p className="text-muted-foreground mb-6">
                    Stiamo preparando lezioni su DeFi, NFT, staking e altri concetti fondamentali.
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/dashboard/start">
                      Torna al Percorso di Orientamento
                    </Link>
                  </Button>
                </CardContent>
              </UnifiedCard>
            </section>

            {/* Educational Disclaimer */}
            <footer className="mt-16 pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                <strong className="font-medium">Obiettivo:</strong> Sviluppare comprensione e senso critico. 
                Ogni lezione dura 3-5 minuti e non richiede decisioni operative.
              </p>
            </footer>
            
          </div>
        </SectionLayout>
      </div>
    </ErrorBoundary>
  )
}