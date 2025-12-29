import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { Button } from "@/components/ui/button"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Inizia il Percorso | Tradelia - Educazione Crypto Antifuffa",
  description: "Prima di tutto, capiamo una cosa: nel mondo crypto non serve sapere tutto subito. Serve capire come non sbagliare. Inizia dal primo passo.",
  keywords: ["educazione crypto", "antifuffa", "bitcoin", "criptovalute", "formazione", "sicurezza"],
  openGraph: {
    title: "Inizia il Percorso | Tradelia",
    description: "Prima di tutto, capiamo una cosa: nel mondo crypto non serve sapere tutto subito. Serve capire come non sbagliare.",
    type: "website",
    locale: "it_IT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inizia il Percorso | Tradelia",
    description: "Prima di tutto, capiamo una cosa: nel mondo crypto non serve sapere tutto subito. Serve capire come non sbagliare.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/dashboard/start",
  },
}

export default function StartPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <SectionLayout className="py-20">
          <div className="mx-auto max-w-4xl">
          
          {/* Institutional Header */}
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-6" role="banner">
              <div className="w-2 h-2 rounded-full bg-primary" aria-hidden="true"></div>
              Sistema Educativo Tradelia
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Prima di tutto,
              <span className="block text-primary">capiamo una cosa</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
              Nel mondo crypto non serve sapere tutto subito.
              <br />
              Serve capire come non sbagliare.
            </p>
          </header>
          
          {/* Cognitive Preparation - Institutional Style */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 px-4 sm:px-0" aria-labelledby="preparation-heading">
            <h2 id="preparation-heading" className="sr-only">Preparazione cognitiva</h2>
            
            <UnifiedCard className="text-center border-primary/20 bg-primary/5 hover:border-primary/30 transition-all duration-200 hover:shadow-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-200 group-hover:scale-105" aria-hidden="true">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                </div>
                <h3 className="font-semibold text-foreground mb-3">Non serve decidere ora</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Questo percorso non ti chiede scelte operative. Solo comprensione.
                </p>
              </CardContent>
            </UnifiedCard>
            
            <UnifiedCard className="text-center border-success/20 bg-success/5 hover:border-success/30 transition-all duration-200 hover:shadow-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-200 group-hover:scale-105" aria-hidden="true">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                </div>
                <h3 className="font-semibold text-foreground mb-3">Un passo alla volta</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ogni lezione dura 3-5 minuti. Un concetto, un errore comune, una regola.
                </p>
              </CardContent>
            </UnifiedCard>
            
            <UnifiedCard className="text-center border-warning/20 bg-warning/5 hover:border-warning/30 transition-all duration-200 hover:shadow-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-200 group-hover:scale-105" aria-hidden="true">
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                </div>
                <h3 className="font-semibold text-foreground mb-3">Nessuna pressione</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Puoi fermarti quando vuoi. Non c'è urgenza, non ci sono scadenze.
                </p>
              </CardContent>
            </UnifiedCard>
          </section>
          
          {/* Single State Transition - Institutional */}
          <section className="text-center" aria-labelledby="cta-heading">
            <UnifiedCard variant="hero" className="bg-gradient-to-br from-primary/5 to-background border-primary/20 max-w-2xl mx-auto hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8 sm:p-12">
                <h2 id="cta-heading" className="text-2xl font-semibold text-foreground mb-4">
                  Iniziamo dal punto più comune
                </h2>
                <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                  Come l'hype usa numeri e concetti fuori contesto per creare false certezze.
                </p>
                
                <Button asChild size="lg" className="px-8 sm:px-10 py-4 sm:py-6 text-sm sm:text-base font-semibold w-full sm:w-auto transition-all duration-200 hover:scale-105 focus:scale-105">
                  <Link href="/learn/fear-greed-basics" aria-describedby="lesson-info">
                    Inizia la prima lezione
                  </Link>
                </Button>
                
                <p id="lesson-info" className="text-xs text-muted-foreground mt-6">
                  Tempo stimato: 4 minuti • Nessuna registrazione richiesta
                </p>
              </CardContent>
            </UnifiedCard>
          </section>
          
          {/* Institutional Compliance */}
          <footer className="mt-16 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              <strong className="font-medium">Sistema educativo:</strong> Tradelia non fornisce consulenza finanziaria 
              né raccomandazioni operative. L'obiettivo è sviluppare comprensione e senso critico.
            </p>
          </footer>
          
        </div>
      </SectionLayout>
    </div>
    </ErrorBoundary>
  );
}