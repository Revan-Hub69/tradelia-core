'use client';

import { SectionContainer } from '@/components/ui/SectionContainer';
import { InteractiveSimulator } from '@/features/landing/InteractiveSimulator';

export const ScenarioSection = () => {
  return (
    <section
      id="simulator"
      className="scroll-mt-32 border-t border-border/40 bg-gradient-to-b from-background to-muted/20 py-14 sm:py-16 lg:py-20"
    >
      <SectionContainer size="wide">
        <InteractiveSimulator />
      </SectionContainer>
    </section>
  );
};
