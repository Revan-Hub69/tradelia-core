import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <section id="whatyouget" className="py-20 bg-muted/30">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Cosa trovi (e cosa no)</h2>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="text-primary">✓ Trovi</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {youGet.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckIcon className="shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardHeader>
              <CardTitle className="text-amber-700 dark:text-amber-400">✗ Non trovi</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {youDontGet.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CrossIcon className="shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
