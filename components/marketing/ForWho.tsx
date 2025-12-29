import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { CheckIcon } from "@/components/icons/check-icon"
import { CrossIcon } from "@/components/icons/cross-icon"

export default function ForWho() {
  return (
    <SectionLayout background="muted">
      <div className="mx-auto max-w-4xl text-center">
        
        <h2 className="text-3xl font-bold text-foreground mb-8">
          Tradelia è per te se
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <UnifiedCard className="text-left">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckIcon className="w-5 h-5" />
                <h3 className="font-semibold text-foreground">Per te se:</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-foreground">vuoi capire senza farti fregare</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-foreground">sei stanco dell'hype</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-foreground">vuoi basi chiare</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-foreground">non vuoi fare la figura dello stupido</span>
                </div>
              </div>
            </CardContent>
          </UnifiedCard>
          
          <UnifiedCard className="text-left">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CrossIcon className="w-5 h-5" />
                <h3 className="font-semibold text-foreground">Non per te se:</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-error mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-foreground">cerchi segnali rapidi</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-error mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-foreground">vuoi "la coin che farà x100"</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-error mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-foreground">vuoi scorciatoie</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-error mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-foreground">cerchi "strategie magiche"</span>
                </div>
              </div>
            </CardContent>
          </UnifiedCard>
        </div>
        
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
          <p className="text-base text-muted-foreground mb-2">Non importa se:</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>sei già entrato</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>non sei mai entrato</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>stai solo osservando</span>
            </div>
          </div>
          <p className="text-lg text-primary font-semibold mt-4">
            Capire viene prima di tutto.
          </p>
        </div>
        
      </div>
    </SectionLayout>
  );
}
