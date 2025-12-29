import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"

export default function WhyExists() {
  return (
    <SectionLayout background="muted">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeader 
          title="Se ti senti confuso, è normale"
          subtitle="Nel mondo crypto l'hype rende difficile distinguere informazione da fuffa, anche quando le spiegazioni sembrano «chiare»"
        />
        
        {/* Single focused message */}
        <UnifiedCard variant="elevated" className="bg-primary/5 border-primary/20 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" aria-hidden="true"></div>
          
          <CardContent className="p-8">
            <p className="text-base text-primary font-semibold">
              Tradelia parte da qui: ridurre il rumore, non aggiungerne altro.
            </p>
          </CardContent>
        </UnifiedCard>
      </div>
    </SectionLayout>
  );
}
