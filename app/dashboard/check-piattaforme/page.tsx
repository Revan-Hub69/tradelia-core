import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CheckPiattaformePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <SectionLayout className="py-20">
          <div className="mx-auto max-w-4xl">
            
            {/* Header */}
            <header className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-6">
                <div className="w-2 h-2 rounded-full bg-primary" aria-hidden="true"></div>
                Check di Coerenza Piattaforme
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Cose da verificare prima di
                <span className="block text-primary">usare una piattaforma</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
                Non è una classifica. Non è una raccomandazione. È una checklist educativa.
              </p>
            </header>

            {/* Important Disclaimer */}
            <div className="mb-12">
              <UnifiedCard className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    ⚖️ Non è una classifica. Non è una raccomandazione. È una checklist educativa.
                  </p>
                </CardContent>
              </UnifiedCard>
            </div>

            {/* Phase 2 Notice */}
            <section className="text-center mb-12">
              <UnifiedCard variant="hero" className="max-w-2xl mx-auto">
                <CardContent className="p-12">
                  <div className="mb-6">
                    <Badge variant="outline" className="mb-4">Fase 2</Badge>
                    <h2 className="text-2xl font-semibold mb-4">Disponibile Prossimamente</h2>
                    <p className="text-muted-foreground mb-8">
                      Questa sezione sarà disponibile dopo aver completato le sezioni fondamentali:
                      <br />
                      <strong>Start → Microlearning → Misuratori → Libreria Truffe</strong>
                    </p>
                    
                    <div className="text-left bg-muted/30 rounded-lg p-6 mb-8">
                      <h3 className="font-semibold mb-4">La checklist includerà:</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• <strong>Domande da porsi</strong> prima di registrarsi</li>
                        <li>• <strong>Cosa controllare</strong> nei termini di servizio</li>
                        <li>• <strong>Errori comuni</strong> nella valutazione</li>
                        <li>• <strong>Perché è rilevante</strong> ogni punto di controllo</li>
                      </ul>
                    </div>
                  </div>
                  
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
                <strong className="font-medium">Metodologia:</strong> La checklist sarà basata su criteri 
                oggettivi e trasparenti, senza raccomandazioni specifiche o conflitti di interesse.
              </p>
            </footer>
            
          </div>
        </SectionLayout>
      </div>
    </ErrorBoundary>
  )
}