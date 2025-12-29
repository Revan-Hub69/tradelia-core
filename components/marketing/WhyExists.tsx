import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"

export default function WhyExists() {
  return (
    <SectionLayout background="muted">
      <div className="mx-auto max-w-4xl">
        
        {/* Section 1: Normalization */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Se ti senti confuso, è normale
          </h2>
          
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-lg text-foreground leading-relaxed">
              Nel mondo crypto oggi convivono:
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 text-base text-foreground">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <span>informazioni vere</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0"></div>
                <span>semplificazioni eccessive</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-error mt-2 flex-shrink-0"></div>
                <span>marketing aggressivo</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></div>
                <span>hype continuo</span>
              </div>
            </div>
            
            <p className="text-lg text-foreground font-medium">
              Il risultato non è chiarezza. È confusione.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-primary font-semibold">
              <div className="w-4 h-px bg-primary"></div>
              <span>Tradelia parte da qui</span>
              <div className="w-4 h-px bg-primary"></div>
            </div>
          </div>
        </div>
        
        {/* Section 2: External Problem */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Il problema non sei tu. È l'hype.
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <p className="text-lg text-foreground leading-relaxed">
              L'hype crypto:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <UnifiedCard className="text-left">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-error mt-2 flex-shrink-0"></div>
                      <span className="text-sm">spinge a decidere in fretta</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0"></div>
                      <span className="text-sm">fa sembrare tutto urgente</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-error mt-2 flex-shrink-0"></div>
                      <span className="text-sm">usa numeri e parole "sicure"</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></div>
                      <span className="text-sm">rende difficile distinguere informazione da fuffa</span>
                    </div>
                  </div>
                </CardContent>
              </UnifiedCard>
              
              <UnifiedCard className="text-left">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">Oggi questo vale anche per:</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-sm">thread virali</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-sm">gruppi Telegram</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-sm">video "spiegazioni"</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0"></div>
                      <span className="text-sm">spiegazioni automatiche troppo semplici</span>
                    </div>
                  </div>
                </CardContent>
              </UnifiedCard>
            </div>
            
            <div className="bg-warning/10 border-l-4 border-warning rounded-r p-6">
              <p className="text-foreground font-medium">
                Quando manca contesto, anche una spiegazione "chiara" può ingannare.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </SectionLayout>
  );
}
