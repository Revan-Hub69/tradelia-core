import { unstable_setRequestLocale } from 'next-intl/server';

import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow';

export async function generateMetadata() {
  return {
    title: 'Onboarding - Tradelia',
    description: 'Inizia il tuo percorso di apprendimento crypto con Tradelia',
  };
}

const OnboardingPage = (props: { params: { locale: string } }) => {
  unstable_setRequestLocale(props.params.locale);

  return <OnboardingFlow />;
};

export default OnboardingPage;