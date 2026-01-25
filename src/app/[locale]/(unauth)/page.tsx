import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';

import { BenefitsOverview } from '@/templates/BenefitsOverview';
import { FinalCTA } from '@/templates/FinalCTA';
import { Hero } from '@/templates/Hero';
import { HowItWorks } from '@/templates/HowItWorks';
import { LearningPath } from '@/templates/LearningPath';
import { Navbar } from '@/templates/Navbar';
import { PremiumFooter } from '@/templates/PremiumFooter';

// Dynamic imports for below-fold components (performance optimization)
const InteractiveDemo = dynamic(() => import('@/templates/InteractiveDemo').then(mod => ({ default: mod.InteractiveDemo })), {
  ssr: true, // Keep SSR for SEO
  loading: () => <div className="min-h-[600px]" />, // Prevent layout shift
});

const SocialProof = dynamic(() => import('@/templates/SocialProof').then(mod => ({ default: mod.SocialProof })), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});

const FAQ = dynamic(() => import('@/templates/FAQ').then(mod => ({ default: mod.FAQ })), {
  ssr: true,
  loading: () => <div className="min-h-[500px]" />,
});

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
