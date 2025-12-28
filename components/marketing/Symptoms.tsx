import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { ArrowIcon } from "@/components/icons/arrow-icon";

export default function Symptoms() {
  const symptoms = [
    "Vedi indicatori ma non sai cosa rappresentano davvero",
    "Senti parlare di fear, hype, trend senza contesto",
    "Hai paura di sbagliare perché ti mancano le basi",
    "Non distingui informazione utile da fuffa ben confezionata",
    "Le AI ti danno consigli basati su post casuali di \"bingobongo2007\""
  ];

  return (
    <SectionLayout background="muted">
      <div className="mx-auto max-w-4xl">
        <SectionHeader 
          title="Ti riconosci?"
        />
        
        <div className="space-y-3 mb-6">
          {symptoms.map((symptom, i) => (
            <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {i + 1}
              </div>
              <p className="text-sm leading-relaxed pt-0.5 text-foreground">{symptom}</p>
            </div>
          ))}
        </div>
        
        <UnifiedCard variant="elevated" className="bg-primary/5 border-primary/20">
          <CardContent>
            <div className="text-center text-sm flex items-center justify-center gap-2">
              <ArrowIcon className="h-5 w-5 text-primary shrink-0" />
              <span className="text-foreground"><strong className="font-semibold">È normale.</strong> Il problema non è la tua intelligenza, ma come vengono spiegate le cose online.</span>
            </div>
          </CardContent>
        </UnifiedCard>
      </div>
    </SectionLayout>
  );
}
