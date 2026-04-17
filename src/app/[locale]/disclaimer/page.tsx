import type { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { LegalDocumentPage } from '@/features/public-pages/LegalDocumentPage';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'DisclaimerPage' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    robots: { index: true, follow: true },
  };
}

const SECTION_IDS = ['nature', 'mifid', 'accuracy', 'liability', 'conflicts', 'law', 'version'] as const;

export default async function DisclaimerPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  unstable_setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'DisclaimerPage' });

  const sections = SECTION_IDS.map((id, index) => ({
    id,
    number: String(index + 1).padStart(2, '0'),
    title: t(`s${index + 1}_title`),
    body: t(`s${index + 1}_body`),
  }));

  return (
    <LegalDocumentPage
      locale={locale}
      variant="disclaimer"
      eyebrow={t('eyebrow')}
      heading={t('heading')}
      lastUpdated={t('last_updated')}
      callout={t('intro_callout')}
      footerNote={t('footer_note')}
      sections={sections}
    />
  );
}
