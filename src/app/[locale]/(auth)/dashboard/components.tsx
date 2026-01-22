/*
 * DASHBOARD CLIENT COMPONENTS
 * 
 * Isolated client components for dashboard page
 * Separated from server component for better performance
 */

'use client';

import { useTranslations } from 'next-intl';

import { UiSurface } from '@/components/ui';
import { useUserData } from '@/hooks/useUserData';

// Client Component for user data - isolated boundary
export const DashboardStatusCard = () => {
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
export const DashboardNextSteps = () => {
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