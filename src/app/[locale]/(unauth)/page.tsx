import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { BenefitsOverview } from '@/templates/BenefitsOverview';
import { FAQ } from '@/templates/FAQ';
import { FinalCTA } from '@/templates/FinalCTA';
import { Hero } from '@/templates/Hero';
import { HowItWorks } from '@/templates/HowItWorks';
import { InteractiveDemo } from '@/templates/InteractiveDemo';
import { LearningPath } from '@/templates/LearningPath';
import { Navbar } from '@/templates/Navbar';
import { PremiumFooter } from '@/templates/PremiumFooter';
import { SocialProof } from '@/templates/SocialProof';
import { TradUsage } from '@/templates/TradUsage';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const IndexPage = (props: { params: { locale: string } }) => {
  unstable_setRequestLocale(props.params.locale);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BenefitsOverview />
        <TradUsage />
        <InteractiveDemo />
        <LearningPath />
        <SocialProof />
        <HowItWorks />
        <FAQ />
        <FinalCTA />
      </main>
      <PremiumFooter />
    </>
  );
};

export default IndexPage;
