import { getTranslations } from 'next-intl/server';
import { SimpleDashboardHeader } from '@/components/dashboard/SimpleDashboardHeader';
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
  // TODO: Get user state from database to determine gamification settings
  // For now, using safe defaults based on 2026 best practices
  const focusMode = false; // TODO: Get from user preferences
  const gamificationIntensity = 'standard'; // TODO: Adapt based on user behavior

  return (
    <div className="min-h-screen bg-background">
      <SimpleDashboardHeader 
        focusMode={focusMode}
        gamificationIntensity={gamificationIntensity}
        showGamification={!focusMode}
        showNotifications={true}
        showSearch={true}
        showQuickActions={true}
      />
      <main className="pt-14 md:pt-16 pb-20 md:pb-4">
        {props.children}
      </main>
      {/* PWA Bottom Navigation - Mobile Only */}
      <PWABottomNavigation className="md:hidden" />
    </div>
  );
}

export const dynamic = 'force-dynamic';
