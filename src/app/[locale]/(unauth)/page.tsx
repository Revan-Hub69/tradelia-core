import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { Navbar } from '@/templates/Navbar';
import { PremiumFooter } from '@/templates/PremiumFooter';
import { ToolsHero } from '@/templates/ToolsHero';
import { ToolCard } from '@/templates/ToolCard';
import { FrameworkSection, MethodologySection } from '@/templates/FrameworkSection';
import { FAQ } from '@/templates/FAQ';

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
        {/* Hero */}
        <ToolsHero />

        {/* Single tool */}
        <section id="tool" className="border-t border-border/40 px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-2xl">
            <ToolCard
              variant="primary"
              namespace="Tool"
              features={['feature1', 'feature2', 'feature3', 'feature4']}
              ctaKey="cta"
              href="/tool"
            />
          </div>
        </section>

        {/* How it works */}
        <section id="framework">
          <FrameworkSection />
        </section>

        {/* Methodology */}
        <section id="methodology">
          <MethodologySection />
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-border/40 px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <FAQ />
          </div>
        </section>
      </main>
      <PremiumFooter />
    </>
  );
};

export default IndexPage;
