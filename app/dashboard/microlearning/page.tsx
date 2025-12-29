import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
                Brevi lezioni per capire come funzionano concetti, numeri e meccanismi ricorrenti nel mondo crypto, 
                senza promesse e senza segnali.
              </p>
            </header>

            {/* Coming Soon */}
            <section className="text-center">
              <UnifiedCard variant="hero" className="max-w-2xl mx-auto">
                <CardContent className="p-12">
                  <div className="mb-6">
                    <Badge variant="outline" className="mb-4">In Sviluppo</Badge>
                    <h2 className="text-2xl font-semibold mb-4">Sezione in Costruzione</h2>
                    <p className="text-muted-foreground mb-8">
                      Stiamo preparando le lezioni educative seguendo la struttura:
                      <br />
                      <strong>Il concetto → Esempio reale → Errore comune → Regola di sicurezza</strong>
                    </p>
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
                <strong className="font-medium">Promemoria:</strong> Serve a capire, non a decidere. 
                Ogni lezione dura 3-5 minuti e non richiede decisioni operative.
              </p>
            </footer>
            
          </div>
        </SectionLayout>
      </div>
    </ErrorBoundary>
  )
}