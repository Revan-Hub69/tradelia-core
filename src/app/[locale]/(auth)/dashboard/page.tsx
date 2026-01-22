/*
 * DASHBOARD PAGE - PHASE 3B OPTIMIZED
 * 
 * Tier 1 Implementation:
 * - Server Component with parallel data fetching
 * - Preload pattern for critical data
 * - Granular Suspense boundaries
 * - Virtual scrolling for large datasets
 * - Error boundaries for resilience
 */

import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { ErrorBoundaryTest } from '@/components/dev/ErrorBoundaryTest';
import { PageTransitionWrapper } from '@/components/transitions/PageTransitionWrapper';
import { UiSurface } from '@/components/ui/UiSurface';
import { VirtualActivityFeed } from '@/components/dashboard/VirtualActivityFeed';
import { EmailVerificationBanner } from '@/components/dashboard/EmailVerificationBanner';

// ✅ TIER 1: Optimized data fetching
import { getCriticalDashboardData, preloadDashboardData } from '@/libs/dashboard-data';

// Client Components for user data
import { 
  DashboardStatusCard, 
  DashboardNextSteps,
  DashboardStatsCard,
  DashboardActivityFeed,
  DashboardNotifications,
} from './components';

// ✅ TIER 1 PATTERN: Server Component with preloading
const DashboardIndexPage = async () => {
  const t = await getTranslations('Dashboard');
  
  // Mock user ID - replace with real auth
  const userId = 'user-123';
  
  // ✅ TIER 1: Preload critical data
  preloadDashboardData(userId);
  
  // ✅ TIER 1: Get critical data for initial render
  const { userData, error } = await getCriticalDashboardData(userId);

  // Handle authentication error
  if (error || !userData) {
    return (
      <PageTransitionWrapper>
        <div className="mx-auto max-w-screen-xl">
          <UiSurface variant="card" className="ui-glass-card p-8 text-center">
            <h1 className="text-2xl font-bold text-destructive">
              {t('auth_error_title')}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {error || t('auth_error_description')}
            </p>
          </UiSurface>
        </div>
      </PageTransitionWrapper>
    );
  }

  return (
    <PageTransitionWrapper>
      {/* Error Boundary Test (dev only) */}
      <ErrorBoundaryTest />

      <div className="mx-auto max-w-screen-xl space-y-6">
        {/* Email Verification Banner - Soft confirmation UX */}
        <EmailVerificationBanner />
        
        {/* ✅ TIER 1: Personalized welcome with server-side data */}
        <div className="stagger-item">
          <h1 className="text-2xl font-bold">
            {t('welcome_title', { name: userData.name })}
          </h1>
          <p className="text-muted-foreground">
            {t('welcome_description')}
          </p>
        </div>

        {/* ✅ TIER 1: Grid layout for better performance */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Current Status - Critical data already loaded */}
            <DashboardStatusCard userData={userData} />

            {/* Next Steps - Critical data already loaded */}
            <DashboardNextSteps userData={userData} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Stats - Suspense boundary for secondary data */}
            <Suspense fallback={
              <UiSurface variant="card" className="ui-glass-card p-6 stagger-item">
                <div className="space-y-4">
                  <div className="h-6 w-32 animate-pulse rounded bg-muted" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                      <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                      <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                </div>
              </UiSurface>
            }>
              <DashboardStatsCard userId={userId} />
            </Suspense>

            {/* Notifications - Suspense boundary for secondary data */}
            <Suspense fallback={
              <UiSurface variant="card" className="ui-glass-card p-6 stagger-item">
                <div className="space-y-4">
                  <div className="h-6 w-40 animate-pulse rounded bg-muted" />
                  <div className="space-y-3">
                    <div className="h-12 w-full animate-pulse rounded bg-muted" />
                    <div className="h-12 w-full animate-pulse rounded bg-muted" />
                  </div>
                </div>
              </UiSurface>
            }>
              <DashboardNotifications userId={userId} />
            </Suspense>
          </div>
        </div>

        {/* ✅ PHASE 3B: Virtual Activity Feed - Handles unlimited data */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Traditional Activity Feed (for comparison) */}
          <Suspense fallback={
            <UiSurface variant="card" className="ui-glass-card p-6 stagger-item">
              <div className="space-y-4">
                <div className="h-6 w-48 animate-pulse rounded bg-muted" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex space-x-3">
                      <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </UiSurface>
          }>
            <DashboardActivityFeed userId={userId} />
          </Suspense>

          {/* ✅ PHASE 3B: Virtual Activity Feed - Unlimited performance */}
          <VirtualActivityFeed userId={userId} maxHeight={400} />
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default DashboardIndexPage;
