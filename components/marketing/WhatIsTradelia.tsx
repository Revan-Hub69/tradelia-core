import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardHeader, CardTitle, CardContent } from "@/components/ui/design-system/unified-card"
import { SuccessDotIcon } from "@/components/icons/success-dot-icon"
import { ErrorDotIcon } from "@/components/icons/error-dot-icon"

export default function WhatIsTradelia() {
  return (
    <SectionLayout>
      <SectionHeader 
        title="Cos'è Tradelia"
        subtitle="Un progetto educativo sul mondo crypto che riduce il rumore"
      />
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* What Tradelia does */}
        <UnifiedCard variant="elevated" className="border-success/30">
          <CardHeader>
            <CardTitle className="text-success">Tradelia fa questo:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <SuccessDotIcon className="shrink-0 mt-1" />
                <span className="text-sm">riduce il rumore</span>
              </li>
              <li className="flex items-start gap-3">
                <SuccessDotIcon className="shrink-0 mt-1" />
                <span className="text-sm">spiega i concetti con calma</span>
              </li>
              <li className="flex items-start gap-3">
                <SuccessDotIcon className="shrink-0 mt-1" />
                <span className="text-sm">usa esempi reali</span>
              </li>
              <li className="flex items-start gap-3">
                <SuccessDotIcon className="shrink-0 mt-1" />
                <span className="text-sm">mostra come vengono spesso interpretati male</span>
              </li>
            </ul>
          </CardContent>
        </UnifiedCard>
        
        {/* What Tradelia doesn't do */}
        <UnifiedCard variant="elevated" className="border-error/30 bg-error/5">
          <CardHeader>
            <CardTitle className="text-error">Tradelia NON fa questo:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ErrorDotIcon className="shrink-0 mt-1" />
                <span className="text-sm">dà segnali</span>
              </li>
              <li className="flex items-start gap-3">
                <ErrorDotIcon className="shrink-0 mt-1" />
                <span className="text-sm">promette risultati</span>
              </li>
              <li className="flex items-start gap-3">
                <ErrorDotIcon className="shrink-0 mt-1" />
                <span className="text-sm">dice cosa comprare o vendere</span>
              </li>
              <li className="flex items-start gap-3">
                <ErrorDotIcon className="shrink-0 mt-1" />
                <span className="text-sm">crea aspettative di guadagno</span>
              </li>
            </ul>
          </CardContent>
        </UnifiedCard>
      </div>
      
      {/* Method explanation */}
      <UnifiedCard variant="hero" className="bg-primary/10 border-primary/20">
        <CardContent className="text-center p-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Come funziona</h3>
          <p className="text-base text-foreground leading-relaxed mb-6">
            Sempre allo stesso modo: esempio reale → spiegazione → errore comune → regola di sicurezza
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>Pochi minuti alla volta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <span>Un concetto alla volta</span>
            </div>
          </div>
          <p className="text-primary font-semibold mt-4">
            Qui impari a non farti fregare, prima di fare qualsiasi scelta.
          </p>
        </CardContent>
      </UnifiedCard>
    </SectionLayout>
  );
}