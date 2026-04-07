import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { Navbar } from '@/templates/Navbar';
import { LandingFooter } from '@/templates/LandingFooter';
import { ProblemSection } from '@/templates/ProblemSection';
import { TradeHero } from '@/templates/TradeHero';
import { HowItWorks } from '@/templates/HowItWorks';
import { FAQ } from '@/templates/FAQ';
import { Comparison } from '@/templates/Comparison';
import { ScrollToTop } from '@/templates/ScrollToTop';

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
        {/* 1. Hero = Simulator in fold */}
        <TradeHero />
        {/* 2. Problem — after the aha moment, explain why it happens */}
        <ProblemSection />
        {/* 3. How it works — 3 steps, contextual to simulator output */}
        <HowItWorks />
        {/* 4. Comparison — reinforce with structured proof */}
        <Comparison />
        {/* 5. FAQ — handle final objections */}
        <FAQ />
      </main>
      <LandingFooter />
      {/* iOS 26 pill capsule floater */}
      <ScrollToTop />
    </>
  );
};

export default IndexPage;
