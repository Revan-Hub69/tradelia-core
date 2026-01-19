import { unstable_setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Onboarding - Tradelia',
    description: 'Inizia il tuo percorso di apprendimento crypto con Tradelia',
  };
}

const OnboardingPage = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;
  unstable_setRequestLocale(params.locale);

  // Redirect to dashboard since onboarding was removed
  redirect(`/${params.locale}/dashboard`);
};

export default OnboardingPage;
