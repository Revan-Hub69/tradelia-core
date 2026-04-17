import { Comparison } from './sections/ComparisonLegacy';
import { FAQ } from './sections/FaqLegacy';
import { HowItWorks } from './sections/HowItWorksLegacy';
import { ProblemSection } from './sections/ProblemSectionLegacy';
import { TradeHero } from './sections/TradeHeroLegacy';

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
