import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardHeader, CardTitle, CardContent } from "@/components/ui/design-system/unified-card"
import { CheckIcon } from "@/components/icons/check-icon";
import { CrossIcon } from "@/components/icons/cross-icon";

export default function WhatYouGet() {
  const youGet = [
    "Spiegazioni chiare e progressive",
    "Contesto per capire indicatori e concetti",
    "Errori comuni spiegati senza giudizio"
  ];

  const youDontGet = [
    "Segnali operativi",
    "Promesse di guadagni",
    '"Compra / vendi" suggeriti da modelli o AI'
  ];

  return (
    <SectionLayout background="muted">
      <SectionHeader 
        title="Cosa trovi (e cosa no)"
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <UnifiedCard variant="standard" className="border-success/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckIcon className="h-5 w-5" />
              Trovi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {youGet.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckIcon className="shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </UnifiedCard>
        
        <UnifiedCard variant="standard" className="border-warning/20 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CrossIcon className="h-5 w-5" />
              Non trovi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {youDontGet.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CrossIcon className="shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </UnifiedCard>
      </div>
    </SectionLayout>
  );
}
