import type { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { ContactPageView } from '@/features/public-pages/ContactPageView';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: 'Contact' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  unstable_setRequestLocale(params.locale);

  const t = await getTranslations({ locale: params.locale, namespace: 'Contact' });

  return <ContactPageView t={t} />;
}
