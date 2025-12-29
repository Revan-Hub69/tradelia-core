import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardHeader, CardTitle, CardContent } from "@/components/ui/design-system/unified-card"
import { CheckIcon } from "@/components/icons/check-icon"
import { CrossIcon } from "@/components/icons/cross-icon"

export default function ForWho() {
  return (
    <SectionLayout background="muted">
      <SectionHeader 
        title="Tradelia è per te se"
        subtitle="Questo progetto è pensato per persone che vogliono capire, non per chi cerca scorciatoie"
      />
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Target audience */}
        <UnifiedCard variant="elevated" className="border-success/30">
          <CardHeader>
            <CardTitle className="text-success flex items-center gap-2">
              <CheckIcon className="w-5 h-5" />
              È per te se
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckIcon className="shrink-0 mt-0.5" />
                <span className="text-sm">vuoi capire senza farti fregare</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="shrink-0 mt-0.5" />
                <span className="text-sm">sei stanco dell'hype</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="shrink-0 mt-0.5" />
                <span className="text-sm">vuoi basi chiare</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="shrink-0 mt-0.5" />
                <span className="text-sm">non vuoi fare la figura dello stupido</span>
              </li>
            </ul>
          </CardContent>
        </UnifiedCard>
        
        {/* Not for */}
        <UnifiedCard variant="elevated" className="border-error/30 bg-error/5">
          <CardHeader>
            <CardTitle className="text-error flex items-center gap-2">
              <CrossIcon className="w-5 h-5" />
              Non è per te se
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CrossIcon className="shrink-0 mt-0.5" />
                <span className="text-sm">cerchi segnali rapidi</span>
              </li>
              <li className="flex items-start gap-3">
                <CrossIcon className="shrink-0 mt-0.5" />
                <span className="text-sm">vuoi "la coin che farà x100"</span>
              </li>
              <li className="flex items-start gap-3">
                <CrossIcon className="shrink-0 mt-0.5" />
                <span className="text-sm">vuoi scorciatoie</span>
              </li>
              <li className="flex items-start gap-3">
                <CrossIcon className="shrink-0 mt-0.5" />
                <span className="text-sm">cerchi "strategie magiche"</span>
              </li>
            </ul>
          </CardContent>
        </UnifiedCard>
      </div>
      
      {/* Bottom note */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          <span className="text-sm font-medium">
            Capire viene prima di tutto
          </span>
        </div>
      </div>
    </SectionLayout>
  );
}
