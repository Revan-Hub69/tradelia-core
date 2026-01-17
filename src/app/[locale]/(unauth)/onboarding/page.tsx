import { unstable_setRequestLocale } from 'next-intl/server';

import { PremiumOnboardingFlow } from '@/features/onboarding/PremiumOnboardingFlow';

export async function generateMetadata() {
  return {
    title: 'Onboarding - Tradelia',
    description: 'Inizia il tuo percorso di apprendimento crypto con Tradelia',
  };
}

const OnboardingPage = (props: { params: { locale: string } }) => {
  unstable_setRequestLocale(props.params.locale);

  return <PremiumOnboardingFlow />;
};

export default OnboardingPage;
