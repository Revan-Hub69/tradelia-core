import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"

export default function WhyExists() {
  return (
    <SectionLayout background="muted">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeader 
          title="Perché esiste Tradelia"
        />
        
        {/* Reading time indicator - Academic style */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-6">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
          <span>3 min di lettura</span>
        </div>
        
        <p className="text-base text-foreground leading-relaxed mb-6">
          Nel mondo crypto circolano numeri, grafici e opinioni continue. <strong className="font-semibold">Spesso semplificate. Spesso fuori contesto. Spesso fuorvianti.</strong>
        </p>
        
        {/* Highlight box per il problema AI */}
        <UnifiedCard variant="elevated" className="bg-warning/5 border-warning/20 mb-6 relative">
          {/* Vertical accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-warning rounded-l-xl" aria-hidden="true"></div>
          
          <CardContent>
            <p className="text-base text-foreground leading-relaxed">
              <strong className="font-semibold">Ora il problema si è amplificato:</strong> le AI generiche assorbono questi contenuti non verificati 
              e li ripropongono come consigli operativi, mescolando post di <strong className="font-semibold">"bingobongo2007"</strong> con analisi serie, 
              senza distinguere fonti certificate da opinioni casuali.
            </p>
          </CardContent>
        </UnifiedCard>
        
        <p className="text-base text-foreground leading-relaxed">
          Tradelia nasce per <strong className="font-semibold">ridurre la confusione</strong>, non per creare aspettative. 
          Qui impari le basi, con calma, prima di fidarti di chiunque o qualunque algoritmo.
        </p>
      </div>
    </SectionLayout>
  );
}
