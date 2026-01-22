import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { ErrorBoundaryTest } from '@/components/dev/ErrorBoundaryTest';
import { PageTransitionWrapper } from '@/components/transitions/PageTransitionWrapper';
import { UiSurface } from '@/components/ui';

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

// Client Component for user data - isolated boundary
const DashboardStatusCard = () => {
  'use client';
  
  const { useTranslations } = require('next-intl');
  const { useUserData } = require('@/hooks/useUserData');
  
  const t = useTranslations('Dashboard');
  const { userData, isLoading } = useUserData();

  if (isLoading) {
    return (
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
    );
  }

  if (!userData) {
    return (
      <UiSurface variant="card" className="ui-glass-card p-6 text-center">
        <h2 className="text-xl font-bold text-muted-foreground">
          {t('auth_error_title')}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {t('auth_error_description')}
        </p>
      </UiSurface>
    );
  }

  return (
    <UiSurface variant="card" className="ui-glass-card p-6 stagger-item">
      <h2 className="mb-4 text-lg font-semibold">{t('current_status_title')}</h2>
      <div className="space-y-4">
        <div>
          <div className="text-sm text-muted-foreground">{t('path_label')}</div>
          <div className="font-medium">{userData.progress.pathName}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">{t('progress_label')}</div>
          <div className="font-medium">
            {t('lessons_progress', {
              completed: userData.progress.completedLessons,
              total: userData.progress.totalLessons,
            })}
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${userData.progress.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </UiSurface>
  );
};

// Client Component for next steps - isolated boundary
const DashboardNextSteps = () => {
  'use client';
  
  const { useTranslations } = require('next-intl');
  const { useUserData } = require('@/hooks/useUserData');
  
  const t = useTranslations('Dashboard');
  const { userData, isLoading } = useUserData();

  if (isLoading || !userData) {
    return null;
  }

  return (
    <UiSurface variant="card" className="ui-glass-card p-6 stagger-item">
      <h2 className="mb-4 text-lg font-semibold">{t('next_objectives_title')}</h2>
      {userData.progress.completedLessons === 0
        ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {t('not_started_message')}
              </p>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  {t('first_lesson_objective')}
                </div>
              </div>
            </div>
          )
        : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {t('continue_message')}
              </p>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
                <div className="font-medium text-green-900 dark:text-green-100">
                  {t('continue_path_objective')}
                </div>
              </div>
            </div>
          )}
    </UiSurface>
  );
};

export default DashboardIndexPage;
