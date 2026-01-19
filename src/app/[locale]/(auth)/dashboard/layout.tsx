import { getTranslations } from 'next-intl/server';
import { SimpleDashboardHeader } from '@/components/dashboard/SimpleDashboardHeader';

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
  return (
    <div className="min-h-screen bg-background">
      <SimpleDashboardHeader />
      <main className="pt-14 md:pt-16">
        {props.children}
      </main>
    </div>
  );
}

export const dynamic = 'force-dynamic';
