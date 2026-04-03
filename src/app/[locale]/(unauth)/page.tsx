import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { Navbar } from '@/templates/Navbar';
import { PremiumFooter } from '@/templates/PremiumFooter';
import { TradeHero } from '@/templates/TradeHero';
import { HowItWorks } from '@/templates/HowItWorks';
import { ScenarioSection } from '@/templates/ScenarioSection';
import { AnalysisSection } from '@/templates/AnalysisSection';
import { ComparisonSection } from '@/templates/ComparisonSection';
import { CompareInstruments } from '@/templates/CompareInstruments';
import { WhyDifferent } from '@/templates/WhyDifferent';
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
        <HowItWorks />
        <ScenarioSection />
        <AnalysisSection />
        <ComparisonSection />
        <CompareInstruments />
        <WhyDifferent />
        <section id="faq" className="border-t border-border/40 px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <FAQ />
          </div>
        </section>
        <DisclaimerBar />
      </main>
      <PremiumFooter />
    </>
  );
};

export default IndexPage;
