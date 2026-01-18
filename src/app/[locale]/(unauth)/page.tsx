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

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Index',
  });

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
        <Hero />
        <BenefitsOverview />
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
