import { getTranslations } from 'next-intl/server';

import { DashboardShell } from '@/components/dashboard/DashboardShell';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function DashboardLayout(props: { children: React.ReactNode }) {
  // Server-side layout - maintains SSR, streaming, and metadata
  // Client interactions delegated to DashboardShell -> DashboardClient
  
  return <DashboardShell>{props.children}</DashboardShell>;
}
