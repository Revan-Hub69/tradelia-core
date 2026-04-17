import { LandingFooter } from '@/templates/LandingFooter';
import { Navbar } from '@/templates/Navbar';
import { ScrollToTop } from '@/templates/ScrollToTop';

import { ComparisonModule } from './sections/ComparisonModule';
import { FaqModule } from './sections/FaqModule';
import { HeroModule } from './sections/HeroModule';
import { HowItWorksModule } from './sections/HowItWorksModule';
import { ProblemModule } from './sections/ProblemModule';
import { SimulatorModule } from './sections/SimulatorModule';

export const ModularHomepage = () => {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroModule />
        <ProblemModule />
        <HowItWorksModule />
        <ComparisonModule />
        <SimulatorModule />
        <FaqModule />
      </main>
      <LandingFooter />
      <ScrollToTop />
    </>
  );
};
