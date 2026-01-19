import { getTranslations } from 'next-intl/server';
import { MinimalDashboardHeader } from '@/components/dashboard/MinimalDashboardHeader';
import { PWABottomNavigation } from '@/components/navigation/PWABottomNavigation';

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
      <MinimalDashboardHeader />
      <main className="pt-14 pb-20 md:pb-4">
        {props.children}
      </main>
      {/* PWA Bottom Navigation - Mobile Only */}
      <PWABottomNavigation className="md:hidden" />
    </div>
  );
}

export const dynamic = 'force-dynamic';
