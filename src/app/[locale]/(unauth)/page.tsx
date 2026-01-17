import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { Footer } from '@/templates/Footer';
import { Hero } from '@/templates/Hero';
import { HowItWorks } from '@/templates/HowItWorks';
import { InteractiveDemo } from '@/templates/InteractiveDemo';
import { Navbar } from '@/templates/Navbar';
import { PremiumFooter } from '@/templates/PremiumFooter';
import { FinalCTA } from '@/templates/FinalCTA';

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
        <InteractiveDemo />
        <HowItWorks />
        <FinalCTA />
      </main>
      <PremiumFooter />
    </>
  );
};

export default IndexPage;
