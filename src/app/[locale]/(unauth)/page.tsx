import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { Navbar } from '@/templates/Navbar';
import { PremiumFooter } from '@/templates/PremiumFooter';
import { ToolsHero } from '@/templates/ToolsHero';
import { NetReturnCard, SecondaryTools } from '@/templates/ToolCard';
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
        {/* Hero - Tools access */}
        <ToolsHero />

        {/* Primary Tool - Net Return Model (70% visual weight) */}
        <section id="net-return" className="px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <NetReturnCard />
          </div>
        </section>

        {/* Secondary Tools - Exposure + Flow (20% + 10%) */}
        <section id="exposure" className="border-t border-border/40 px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <SecondaryTools />
          </div>
        </section>

        {/* Framework - Elevates from tool to system */}
        <section id="framework">
          <FrameworkSection />
        </section>

        {/* Methodology - Professional credibility */}
        <section id="methodology">
          <MethodologySection />
        </section>

        {/* FAQ - Always visible scroll */}
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
