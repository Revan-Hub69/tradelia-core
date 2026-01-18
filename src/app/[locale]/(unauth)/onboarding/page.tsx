import { unstable_setRequestLocale } from 'next-intl/server';

import { OptimizedOnboardingFlow } from '@/features/onboarding/OptimizedOnboardingFlow';

export async function generateMetadata() {
  return {
    title: 'Onboarding - Tradelia',
    description: 'Inizia il tuo percorso di apprendimento crypto con Tradelia',
  };
}

const OnboardingPage = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;
  unstable_setRequestLocale(params.locale);

  return <OptimizedOnboardingFlow />;
};

export default OnboardingPage;
