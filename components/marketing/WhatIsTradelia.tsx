import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"

export default function WhatIsTradelia() {
  return (
    <SectionLayout>
      <div className="mx-auto max-w-4xl">
        
        {/* Section 3: What is Tradelia */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Cos'è Tradelia
          </h2>
          
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-lg text-foreground leading-relaxed">
              Tradelia è un progetto educativo sul mondo crypto che:
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0"></div>
                <span className="text-base text-foreground">riduce il rumore</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <span className="text-base text-foreground">spiega i concetti con calma</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-info mt-2 flex-shrink-0"></div>
                <span className="text-base text-foreground">usa esempi reali</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0"></div>
                <span className="text-base text-foreground">mostra come vengono spesso interpretati male</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Clear Disclaimer */}
        <div className="mb-16">
          <UnifiedCard className="bg-muted/30 border-muted/50">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Chiarezza esplicita
              </h3>
              
              <div className="max-w-2xl mx-auto space-y-4">
                <p className="text-lg text-foreground font-medium">
                  Tradelia non:
                </p>
                
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-error"></div>
                    <span className="text-sm text-foreground">dà segnali</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-error"></div>
                    <span className="text-sm text-foreground">promette risultati</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-error"></div>
                    <span className="text-sm text-foreground">dice cosa comprare o vendere</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <p className="text-base text-primary font-semibold">
                    Qui impari a non farti fregare, prima di fare qualsiasi scelta.
                  </p>
                </div>
              </div>
            </CardContent>
          </UnifiedCard>
        </div>
        
        {/* Section 4: Method */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Come funziona
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sempre allo stesso modo:
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            <UnifiedCard className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Esempio reale</h3>
                <p className="text-sm text-muted-foreground">Partiamo da qualcosa che vedi online</p>
              </CardContent>
            </UnifiedCard>
            
            <UnifiedCard className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-success">2</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Spiegazione</h3>
                <p className="text-sm text-muted-foreground">Cosa significa davvero</p>
              </CardContent>
            </UnifiedCard>
            
            <UnifiedCard className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-warning">3</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Errore comune</h3>
                <p className="text-sm text-muted-foreground">Come viene spesso interpretato male</p>
              </CardContent>
            </UnifiedCard>
            
            <UnifiedCard className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-info">4</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Regola di sicurezza</h3>
                <p className="text-sm text-muted-foreground">Cosa verificare prima di fidarti</p>
              </CardContent>
            </UnifiedCard>
          </div>
          
          <div className="mt-8 space-y-2">
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
            <p className="text-sm text-muted-foreground font-medium">
              Nessuna decisione richiesta.
            </p>
          </div>
        </div>
        
      </div>
    </SectionLayout>
  );
}