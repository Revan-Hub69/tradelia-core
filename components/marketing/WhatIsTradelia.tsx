import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardHeader, CardTitle, CardContent } from "@/components/ui/design-system/unified-card"
import { SuccessDotIcon } from "@/components/icons/success-dot-icon"
import { ErrorDotIcon } from "@/components/icons/error-dot-icon"

export default function WhatIsTradelia() {
  return (
    <SectionLayout>
      <SectionHeader 
        title="Cos'è Tradelia"
        subtitle="Un sistema educativo che riduce il rumore crypto"
      />
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Card A: What we do */}
        <UnifiedCard variant="elevated" className="border-success/30 bg-success/5">
          <CardHeader>
            <CardTitle className="text-success">Tradelia fa questo:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <SuccessDotIcon className="shrink-0 mt-1" />
                <span className="text-sm">Spiega concetti con esempi reali</span>
              </li>
              <li className="flex items-start gap-3">
                <SuccessDotIcon className="shrink-0 mt-1" />
                <span className="text-sm">Mostra errori comuni senza giudizio</span>
              </li>
              <li className="flex items-start gap-3">
                <SuccessDotIcon className="shrink-0 mt-1" />
                <span className="text-sm">Ti dà regole pratiche di sicurezza</span>
              </li>
            </ul>
          </CardContent>
        </UnifiedCard>
        
        {/* Card B: What we don't do */}
        <UnifiedCard variant="elevated" className="border-muted-foreground/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-foreground">Tradelia NON fa questo:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ErrorDotIcon className="shrink-0 mt-1" />
                <span className="text-sm">Segnali di trading</span>
              </li>
              <li className="flex items-start gap-3">
                <ErrorDotIcon className="shrink-0 mt-1" />
                <span className="text-sm">Promesse di guadagno</span>
              </li>
              <li className="flex items-start gap-3">
                <ErrorDotIcon className="shrink-0 mt-1" />
                <span className="text-sm">Consigli "compra/vendi"</span>
              </li>
            </ul>
          </CardContent>
        </UnifiedCard>
      </div>
      
      {/* Method - Simple */}
      <div className="text-center mt-12">
        <UnifiedCard variant="hero" className="bg-primary/10 border-primary/20 max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Come funziona</h3>
            <p className="text-base text-foreground leading-relaxed">
              Sempre con lo stesso schema: <strong>esempio reale</strong> → <strong>spiegazione</strong> → <strong>errore comune</strong> → <strong>regola di sicurezza</strong>
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Pochi minuti alla volta • Un concetto alla volta • Nessuna decisione richiesta
            </p>
          </CardContent>
        </UnifiedCard>
      </div>
    </SectionLayout>
  );
}