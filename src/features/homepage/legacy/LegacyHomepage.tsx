import { Comparison } from '@/templates/Comparison';
import { FAQ } from '@/templates/FAQ';
import { HowItWorks } from '@/templates/HowItWorks';
import { ProblemSection } from '@/templates/ProblemSection';
import { TradeHero } from '@/templates/TradeHero';

export const LegacyHomepage = () => {
  return (
    <>
      <TradeHero />
      <ProblemSection />
      <HowItWorks />
      <Comparison />
      <FAQ />
    </>
  );
};
