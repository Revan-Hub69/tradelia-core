import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { Navbar } from '@/templates/Navbar';
import { LandingFooter } from '@/templates/LandingFooter';
import { ProblemSection } from '@/templates/ProblemSection';
import { TradeHero } from '@/templates/TradeHero';
import { HowItWorks } from '@/templates/HowItWorks';
import { ScenarioSection } from '@/templates/ScenarioSection';
import { FAQ } from '@/templates/FAQ';
import { DisclaimerBar } from '@/templates/DisclaimerBar';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: 'Index' });
  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const IndexPage = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;
  unstable_setRequestLocale(params.locale);

  return (
    <>
      <Navbar />
      <main id="main-content">
        <TradeHero />
        <ProblemSection />
        <HowItWorks />
        <ScenarioSection />
        <FAQ />
        <DisclaimerBar />
      </main>
      <LandingFooter />
    </>
  );
};

export default IndexPage;
