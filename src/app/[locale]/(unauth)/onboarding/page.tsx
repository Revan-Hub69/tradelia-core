import { unstable_setRequestLocale } from 'next-intl/server';

import { FixedOnboardingFlow } from '@/features/onboarding/FixedOnboardingFlow';

export async function generateMetadata() {
  return {
    title: 'Onboarding - Tradelia',
    description: 'Inizia il tuo percorso di apprendimento crypto con Tradelia',
  };
}

const OnboardingPage = (props: { params: { locale: string } }) => {
  unstable_setRequestLocale(props.params.locale);

  return <FixedOnboardingFlow />;
};

export default OnboardingPage;
