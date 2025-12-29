import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function StartPage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionLayout className="py-20">
        <div className="mx-auto max-w-4xl">
          
          {/* Institutional Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-6">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              Sistema Educativo Tradelia
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Prima di tutto,
              <span className="block text-primary">capiamo una cosa</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Nel mondo crypto non serve sapere tutto subito.
              <br />
              Serve capire come non sbagliare.
            </p>
          </div>
          
          {/* Cognitive Preparation - Institutional Style */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <UnifiedCard className="text-center border-primary/20 bg-primary/5">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                </div>
                <h3 className="font-semibold text-foreground mb-3">Non serve decidere ora</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Questo percorso non ti chiede scelte operative. Solo comprensione.
                </p>
              </CardContent>
            </UnifiedCard>
            
            <UnifiedCard className="text-center border-success/20 bg-success/5">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                </div>
                <h3 className="font-semibold text-foreground mb-3">Un passo alla volta</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ogni lezione dura 3-5 minuti. Un concetto, un errore comune, una regola.
                </p>
              </CardContent>
            </UnifiedCard>
            
            <UnifiedCard className="text-center border-warning/20 bg-warning/5">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                </div>
                <h3 className="font-semibold text-foreground mb-3">Nessuna pressione</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Puoi fermarti quando vuoi. Non c'è urgenza, non ci sono scadenze.
                </p>
              </CardContent>
            </UnifiedCard>
          </div>
          
          {/* Single State Transition - Institutional */}
          <div className="text-center">
            <UnifiedCard variant="hero" className="bg-gradient-to-br from-primary/5 to-background border-primary/20 max-w-2xl mx-auto">
              <CardContent className="p-12">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Iniziamo dal punto più comune
                </h2>
                <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                  Come l'hype usa numeri e concetti fuori contesto per creare false certezze.
                </p>
                
                <Button asChild size="lg" className="px-10 py-6 text-base font-semibold">
                  <Link href="/learn/fear-greed-basics">
                    Inizia la prima lezione
                  </Link>
                </Button>
                
                <p className="text-xs text-muted-foreground mt-6">
                  Tempo stimato: 4 minuti • Nessuna registrazione richiesta
                </p>
              </CardContent>
            </UnifiedCard>
          </div>
          
          {/* Institutional Compliance */}
          <div className="mt-16 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              <strong className="font-medium">Sistema educativo:</strong> Tradelia non fornisce consulenza finanziaria 
              né raccomandazioni operative. L'obiettivo è sviluppare comprensione e senso critico.
            </p>
          </div>
          
        </div>
      </SectionLayout>
    </div>
  );
}