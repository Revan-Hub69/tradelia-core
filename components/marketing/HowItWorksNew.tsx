import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardHeader, CardTitle, CardContent } from "@/components/ui/design-system/unified-card"

export default function HowItWorksNew() {
  const steps = [
    {
      number: "01",
      title: "Micro-lezioni da 5 minuti",
      description: "Un concetto alla volta. Nessun salto logico. Si parte da zero."
    },
    {
      number: "02",
      title: "Spiegazioni guidate (AI educativa)",
      description: "Un supporto che descrive e spiega, senza dire cosa fare."
    },
    {
      number: "03",
      title: "Comprensione prima dell'azione",
      description: "Decidi tu se e quando usare ciò che impari. Nessuna pressione. Nessuna call to action finanziaria."
    }
  ];

  return (
    <SectionLayout background="white">
      <SectionHeader 
        title="Come funziona"
      />
      
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <UnifiedCard key={step.number} variant="standard" className="relative">
            {/* Vertical accent bar - Academic style */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" aria-hidden="true"></div>
            
            <CardHeader>
              {/* Large section number - Bloomberg/FT style */}
              <div className="text-5xl font-bold text-primary/20 mb-2" aria-hidden="true">
                {step.number}
              </div>
              <CardTitle className="text-lg">{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{step.description}</p>
            </CardContent>
          </UnifiedCard>
        ))}
      </div>
    </SectionLayout>
  );
}
