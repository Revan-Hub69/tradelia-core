import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardHeader, CardTitle, CardContent } from "@/components/ui/design-system/unified-card"

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
    <SectionLayout background="white">
      <SectionHeader 
        title="Come funziona"
      />
      
      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step) => (
          <UnifiedCard key={step.number} variant="standard">
            <CardHeader>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xl font-bold mb-4">
                {step.number}
              </div>
              <CardTitle className="text-xl">{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">{step.description}</p>
            </CardContent>
          </UnifiedCard>
        ))}
      </div>
    </SectionLayout>
  );
}
