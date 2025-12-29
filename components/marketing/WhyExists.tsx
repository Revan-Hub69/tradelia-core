import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"

export default function WhyExists() {
  return (
    <SectionLayout background="muted">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeader 
          title="Se ti senti confuso, è normale"
        />
        
        <p className="text-base text-foreground leading-relaxed mb-6">
          Nel mondo crypto oggi convivono informazioni vere, semplificazioni eccessive, marketing aggressivo e hype continuo.
        </p>
        
        <p className="text-lg text-foreground font-medium mb-8">
          Il risultato non è chiarezza. È confusione.
        </p>
        
        {/* Highlight box per il problema hype */}
        <UnifiedCard variant="elevated" className="bg-warning/5 border-warning/20 mb-6 relative">
          {/* Vertical accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-warning rounded-l-xl" aria-hidden="true"></div>
          
          <CardContent>
            <h3 className="text-lg font-semibold text-foreground mb-4">Il problema non sei tu. È l'hype.</h3>
            <p className="text-base text-foreground leading-relaxed mb-4">
              L'hype crypto spinge a decidere in fretta, fa sembrare tutto urgente, usa numeri e parole "sicure" 
              e rende difficile distinguere informazione da fuffa.
            </p>
            <p className="text-sm text-muted-foreground">
              Oggi questo vale anche per thread virali, gruppi, video e spiegazioni automatiche troppo semplici.
            </p>
          </CardContent>
        </UnifiedCard>
        
        <div className="bg-primary/10 border-l-4 border-primary rounded-r p-6">
          <p className="text-foreground font-medium">
            Quando manca contesto, anche una spiegazione "chiara" può ingannare.
          </p>
        </div>
      </div>
    </SectionLayout>
  );
}
