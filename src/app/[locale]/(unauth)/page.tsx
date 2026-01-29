import dynamic from 'next/dynamic';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { Skeleton } from '@/components/ui/skeleton';
import { BenefitsOverview } from '@/templates/BenefitsOverview';
import { FinalCTA } from '@/templates/FinalCTA';
import { Hero } from '@/templates/Hero';
import { HowItWorks } from '@/templates/HowItWorks';
import { Navbar } from '@/templates/Navbar';
import { PremiumFooter } from '@/templates/PremiumFooter';

// Dynamic imports for below-fold components (performance optimization P0)
const SocialProof = dynamic(() => import('@/templates/SocialProof').then(mod => ({ default: mod.SocialProof })), {
  ssr: true,
  loading: () => <div className="reserve-space-md"><Skeleton className="size-full" /></div>,
});

const FAQ = dynamic(() => import('@/templates/FAQ').then(mod => ({ default: mod.FAQ })), {
  ssr: true,
  loading: () => <div className="reserve-space-lg"><Skeleton className="size-full" /></div>,
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
