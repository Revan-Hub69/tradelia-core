import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorksNew() {
  const steps = [
    {
      number: "1",
      title: "Micro-lezioni da 5 minuti",
      description: "Un concetto alla volta. Nessun salto logico. Si parte da zero."
    },
    {
      number: "2",
      title: "Spiegazioni guidate (AI educativa)",
      description: "Un supporto che descrive e spiega, senza dire cosa fare."
    },
    {
      number: "3",
      title: "Comprensione prima dell'azione",
      description: "Decidi tu se e quando usare ciò che impari. Nessuna pressione. Nessuna call to action finanziaria."
    }
  ];

  return (
    <section id="how" className="py-20 bg-muted/30">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Come funziona</h2>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.number} className="relative">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                    {step.number}
                  </div>
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
