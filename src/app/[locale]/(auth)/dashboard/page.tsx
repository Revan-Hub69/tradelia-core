import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { ErrorBoundaryTest } from '@/components/dev/ErrorBoundaryTest';
import { PageTransitionWrapper } from '@/components/transitions/PageTransitionWrapper';
import { UiSurface } from '@/components/ui';

// Client Components for user data
import { DashboardNextSteps, DashboardStatusCard } from './components';

// Server Component - Optimized for performance
const DashboardIndexPage = async () => {
  const t = await getTranslations('Dashboard');

  return (
    <PageTransitionWrapper>
      {/* Error Boundary Test (dev only) */}
      <ErrorBoundaryTest />

      <div className="mx-auto max-w-screen-xl space-y-6">
        {/* Welcome */}
        <div className="stagger-item">
          <h1 className="text-2xl font-bold">
            {t('welcome_title', { name: 'User' })}
          </h1>
          <p className="text-muted-foreground">
            {t('welcome_description')}
          </p>
        </div>

        {/* Current Status - Suspense boundary for user data */}
        <Suspense fallback={
          <UiSurface variant="card" className="ui-glass-card p-6 stagger-item">
            <div className="space-y-4">
              <div className="h-6 w-48 animate-pulse rounded bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-2 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          </UiSurface>
        }>
          <DashboardStatusCard />
        </Suspense>

        {/* Next Steps - Suspense boundary for progress data */}
        <Suspense fallback={
          <UiSurface variant="card" className="ui-glass-card p-6 stagger-item">
            <div className="space-y-4">
              <div className="h-6 w-48 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-16 w-full animate-pulse rounded bg-muted" />
            </div>
          </UiSurface>
        }>
          <DashboardNextSteps />
        </Suspense>
      </div>
    </PageTransitionWrapper>
  );
};

export default DashboardIndexPage;
