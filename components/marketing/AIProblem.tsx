import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardHeader, CardTitle, CardContent } from "@/components/ui/design-system/unified-card"
import { CrossIcon } from "@/components/icons/cross-icon";
import { CheckIcon } from "@/components/icons/check-icon";

export default function AIProblem() {
  return (
    <SectionLayout background="white">
      <SectionHeader 
        badge="Il Problema"
        title="AI qualunquiste"
        subtitle="Le AI generiche stanno peggiorando la situazione, non migliorandola"
      />
      
      <div className="grid gap-8 lg:grid-cols-2 mb-12">
        {/* Problema */}
        <UnifiedCard variant="standard" className="border-destructive/30 relative">
          {/* Vertical accent bar - red for problems */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive rounded-l-xl" aria-hidden="true"></div>
          
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <CrossIcon className="h-5 w-5" />
              AI Generiche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CrossIcon className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <span className="text-sm">Assorbono contenuti da <strong className="font-semibold">qualsiasi fonte</strong> senza verifiche</span>
              </div>
              <div className="flex items-start gap-3">
                <CrossIcon className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <span className="text-sm">Mescolano post di <strong className="font-semibold">"bingobongo2007"</strong> con analisi serie</span>
              </div>
              <div className="flex items-start gap-3">
                <CrossIcon className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <span className="text-sm">Danno <strong className="font-semibold">consigli operativi</strong> senza contesto</span>
              </div>
              <div className="flex items-start gap-3">
                <CrossIcon className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <span className="text-sm">Non distinguono <strong className="font-semibold">opinioni da fatti</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <CrossIcon className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <span className="text-sm">Ignorano <strong className="font-semibold">MiFID II</strong> e regolamentazioni</span>
              </div>
            </div>
          </CardContent>
        </UnifiedCard>

        {/* Soluzione */}
        <UnifiedCard variant="standard" className="border-success/30 relative">
          {/* Vertical accent bar - green for solutions */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-success rounded-l-xl" aria-hidden="true"></div>
          
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckIcon className="h-5 w-5" />
              Tradelia AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckIcon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <span className="text-sm">Addestrata solo su <strong className="font-semibold">fonti certificate</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <CheckIcon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <span className="text-sm">Specializzata in <strong className="font-semibold">educazione finanziaria</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <CheckIcon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <span className="text-sm"><strong className="font-semibold">Zero consigli operativi</strong> - solo educazione</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckIcon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <span className="text-sm">Trasparente sui <strong className="font-semibold">limiti degli indicatori</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <CheckIcon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <span className="text-sm">Rispetta <strong className="font-semibold">normative europee</strong></span>
              </div>
            </div>
          </CardContent>
        </UnifiedCard>
      </div>

      {/* Alert finale */}
      <UnifiedCard variant="elevated" className="bg-warning/5 border-warning/20 relative">
        {/* Vertical accent bar - warning */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-warning rounded-l-xl" aria-hidden="true"></div>
        
        <CardContent>
          <div className="text-foreground">
            <div className="font-bold text-base mb-2">⚠️ Attenzione: Non tutte le AI sono uguali</div>
            <p className="text-sm leading-relaxed">
              Prima di fidarti di una AI per questioni finanziarie, chiediti: <strong className="font-semibold">su cosa è stata addestrata?</strong> 
              Chi controlla le sue risposte? È specializzata o generica?
            </p>
            <p className="text-sm leading-relaxed mt-3">
              <strong className="font-semibold">Tradelia AI è progettata specificamente per educazione antifuffa.</strong>
            </p>
          </div>
        </CardContent>
      </UnifiedCard>
    </SectionLayout>
  );
}
