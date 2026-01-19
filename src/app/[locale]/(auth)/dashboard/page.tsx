'use client';

import { useTranslations } from 'next-intl';
import { useUserData } from '@/hooks/useUserData';
import { PageTransitionWrapper } from '@/components/transitions/PageTransitionWrapper';

const DashboardIndexPage = () => {
  const t = useTranslations('Dashboard');
  const { userData, isLoading } = useUserData();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="h-4 w-96 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">
            {t('auth_error_title')}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t('auth_error_description')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <PageTransitionWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome */}
          <div className="stagger-item">
            <h1 className="text-2xl font-bold">
              {t('welcome_title', { name: userData.name || userData.email.split('@')[0] })}
            </h1>
            <p className="text-muted-foreground">
              {t('welcome_description')}
            </p>
          </div>

          {/* Current Status */}
          <div className="stagger-item rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">{t('current_status_title')}</h2>
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
                    total: userData.progress.totalLessons 
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
          </div>

          {/* Next Steps */}
          <div className="stagger-item rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">{t('next_objectives_title')}</h2>
            {userData.progress.completedLessons === 0 ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {t('not_started_message')}
                </p>
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-200 dark:border-blue-800">
                  <div className="font-medium text-blue-900 dark:text-blue-100">
                    {t('first_lesson_objective')}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {t('continue_message')}
                </p>
                <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-4 border border-green-200 dark:border-green-800">
                  <div className="font-medium text-green-900 dark:text-green-100">
                    {t('continue_path_objective')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default DashboardIndexPage;