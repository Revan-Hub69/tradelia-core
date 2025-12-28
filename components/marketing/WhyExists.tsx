import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"

export default function WhyExists() {
  return (
    <SectionLayout background="muted">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeader 
          title="Perché esiste Tradelia"
        />
        
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          Nel mondo crypto circolano numeri, grafici e opinioni continue. <strong>Spesso semplificate. Spesso fuori contesto. Spesso fuorvianti.</strong>
        </p>
        
        {/* Highlight box per il problema AI */}
        <UnifiedCard variant="elevated" className="bg-warning/10 border-warning/30 mb-8">
          <CardContent>
            <p className="text-lg text-warning-foreground leading-relaxed">
              <strong>Ora il problema si è amplificato:</strong> le AI generiche assorbono questi contenuti non verificati 
              e li ripropongono come consigli operativi, mescolando post di <strong>"bingobongo2007"</strong> con analisi serie, 
              senza distinguere fonti certificate da opinioni casuali.
            </p>
          </CardContent>
        </UnifiedCard>
        
        <p className="text-lg text-muted-foreground leading-relaxed">
          Tradelia nasce per <strong>ridurre la confusione</strong>, non per creare aspettative. 
          Qui impari le basi, con calma, prima di fidarti di chiunque o qualunque algoritmo.
        </p>
      </div>
    </SectionLayout>
  );
}
