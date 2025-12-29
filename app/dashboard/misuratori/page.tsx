import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FearGreedWidget } from "@/components/indicators/fear-greed-widget"
import Link from "next/link"

export default function MisuratoriPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <SectionLayout className="py-20">
          <div className="mx-auto max-w-4xl">
            
            {/* Header */}
            <header className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-6">
                <div className="w-2 h-2 rounded-full bg-primary" aria-hidden="true"></div>
                Misuratori di Contesto
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Numeri per orientarsi,
                <span className="block text-primary">non per decidere</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
                Questi strumenti aiutano a capire in che tipo di contesto ti trovi 
                (non cosa fare, né quando farlo).
              </p>
            </header>

            {/* Safety Disclaimer */}
            <div className="mb-12">
              <UnifiedCard className="border-warning/20 bg-warning/5">
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-medium text-warning-foreground">
                    ⚠️ Nessun misuratore indica cosa comprare o vendere. Mostrano solo il contesto generale.
                  </p>
                </CardContent>
              </UnifiedCard>
            </div>

            {/* Fear & Greed Index - Live */}
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-semibold">Fear & Greed Index</h2>
                <Badge variant="outline" className="text-xs">Live</Badge>
              </div>
              
              <FearGreedWidget />
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p><strong>Cosa misura:</strong> Il sentiment generale del mercato crypto</p>
                <p><strong>Cosa NON dice:</strong> Quando comprare o vendere</p>
                <p><strong>Errore comune di lettura:</strong> Usarlo come segnale di trading</p>
              </div>
            </section>

            {/* Other Indicators - Coming Soon */}
            <section className="grid gap-6 mb-12">
              <UnifiedCard className="opacity-60">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Bitcoin Dominance</h3>
                    <Badge variant="outline">Prossimamente</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Percentuale di capitalizzazione di Bitcoin rispetto al mercato totale crypto
                  </p>
                </CardContent>
              </UnifiedCard>

              <UnifiedCard className="opacity-60">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Volatilità Storica</h3>
                    <Badge variant="outline">Prossimamente</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Misura delle oscillazioni di prezzo in periodi specifici
                  </p>
                </CardContent>
              </UnifiedCard>

              <UnifiedCard className="opacity-60">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Hash Rate Trend</h3>
                    <Badge variant="outline">Prossimamente</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Potenza computazionale dedicata alla sicurezza della rete Bitcoin
                  </p>
                </CardContent>
              </UnifiedCard>
            </section>

            {/* Back to Start */}
            <section className="text-center">
              <Button asChild variant="outline">
                <Link href="/dashboard/start">
                  Torna al Percorso di Orientamento
                </Link>
              </Button>
            </section>

            {/* Educational Disclaimer */}
            <footer className="mt-16 pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                <strong className="font-medium">Importante:</strong> I misuratori mostrano il contesto, 
                non forniscono segnali operativi. Servono per orientarsi, non per decidere.
              </p>
            </footer>
            
          </div>
        </SectionLayout>
      </div>
    </ErrorBoundary>
  )
}