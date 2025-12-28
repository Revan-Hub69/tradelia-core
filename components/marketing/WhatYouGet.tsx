import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WhatYouGet() {
  const youGet = [
    "Spiegazioni chiare e progressive",
    "Contesto per capire indicatori e concetti",
    "Errori comuni spiegati senza giudizio"
  ];

  const youDontGet = [
    "Segnali operativi",
    "Promesse di guadagni",
    '"Comprare/vendere" suggerito da un modello'
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
                    <span className="text-primary mt-1 text-lg">+</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">✗ Non trovi</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {youDontGet.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-destructive mt-1 text-lg">-</span>
                    <span className="text-muted-foreground">{item}</span>
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
