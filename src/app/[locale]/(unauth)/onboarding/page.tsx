import { unstable_setRequestLocale } from 'next-intl/server';

import { OptimizedOnboardingFlow } from '@/features/onboarding/OptimizedOnboardingFlow';

export async function generateMetadata() {
  return {
    title: 'Onboarding - Tradelia',
    description: 'Inizia il tuo percorso di apprendimento crypto con Tradelia',
  };
}

const OnboardingPage = (props: { params: { locale: string } }) => {
  unstable_setRequestLocale(props.params.locale);

  return <OptimizedOnboardingFlow />;
};

export default OnboardingPage;
