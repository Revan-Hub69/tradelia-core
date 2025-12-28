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
        <UnifiedCard variant="standard" className="border-destructive/30">
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
                <span className="text-sm">Assorbono contenuti da <strong>qualsiasi fonte</strong> senza verifiche</span>
              </div>
              <div className="flex items-start gap-3">
                <CrossIcon className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <span className="text-sm">Mescolano post di <strong>"bingobongo2007"</strong> con analisi serie</span>
              </div>
              <div className="flex items-start gap-3">
                <CrossIcon className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <span className="text-sm">Danno <strong>consigli operativi</strong> senza contesto</span>
              </div>
              <div className="flex items-start gap-3">
                <CrossIcon className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <span className="text-sm">Non distinguono <strong>opinioni da fatti</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <CrossIcon className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <span className="text-sm">Ignorano <strong>MiFID II</strong> e regolamentazioni</span>
              </div>
            </div>
          </CardContent>
        </UnifiedCard>

        {/* Soluzione */}
        <UnifiedCard variant="standard" className="border-success/30">
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
                <span className="text-sm">Addestrata solo su <strong>fonti certificate</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <CheckIcon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <span className="text-sm">Specializzata in <strong>educazione finanziaria</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <CheckIcon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <span className="text-sm"><strong>Zero consigli operativi</strong> - solo educazione</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckIcon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <span className="text-sm">Trasparente sui <strong>limiti degli indicatori</strong></span>
              </div>
              <div className="flex items-start gap-3">
                <CheckIcon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <span className="text-sm">Rispetta <strong>normative europee</strong></span>
              </div>
            </div>
          </CardContent>
        </UnifiedCard>
      </div>

      {/* Alert finale */}
      <UnifiedCard variant="elevated" className="bg-warning/10 border-warning/30">
        <CardContent>
          <div className="text-warning-foreground">
            <div className="font-bold text-lg mb-2">⚠️ Attenzione: Non tutte le AI sono uguali</div>
            <p className="text-muted-foreground">
              Prima di fidarti di una AI per questioni finanziarie, chiediti: <strong>su cosa è stata addestrata?</strong> 
              Chi controlla le sue risposte? È specializzata o generica?
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Tradelia AI è progettata specificamente per educazione antifuffa.</strong>
            </p>
          </div>
        </CardContent>
      </UnifiedCard>
    </SectionLayout>
  );
}