import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function StartPage() {
  return (
    <div className="min-h-screen bg-background">
      <SectionLayout className="py-16">
        <div className="mx-auto max-w-3xl text-center">
          
          <h1 className="text-4xl font-bold text-foreground mb-6">
            Prima di tutto, capiamo una cosa.
          </h1>
          
          <div className="max-w-2xl mx-auto space-y-6 mb-12">
            <p className="text-lg text-foreground leading-relaxed">
              Nel mondo crypto:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0"></div>
                <span className="text-base text-foreground">non serve sapere tutto</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <span className="text-base text-foreground">non serve decidere ora</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0"></div>
                <span className="text-base text-foreground">serve capire come non sbagliare</span>
              </div>
            </div>
            
            <p className="text-lg text-foreground font-medium">
              Questo percorso inizia da un esempio reale e poi ti guida passo dopo passo.
            </p>
          </div>
          
          <UnifiedCard className="bg-primary/10 border-primary/20 mb-8">
            <CardContent className="p-6">
              <p className="text-base text-muted-foreground mb-4">
                Nessuna decisione richiesta.
              </p>
              <Button asChild size="lg" className="px-8 py-6 text-base font-semibold">
                <Link href="/learn/fear-greed-basics">
                  Inizia la prima lezione
                </Link>
              </Button>
            </CardContent>
          </UnifiedCard>
          
          <p className="text-sm text-muted-foreground">
            Tempo stimato: 3-5 minuti • Un concetto alla volta
          </p>
          
        </div>
      </SectionLayout>
    </div>
  );
}