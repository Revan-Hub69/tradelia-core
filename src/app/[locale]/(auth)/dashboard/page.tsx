'use client';

import { CertificationShowcase } from '@/components/learning/ProfessionalCertification';
import { CompetencyProgressBar } from '@/components/learning/CompetencyProgressBar';
import { TradeliaCoinDisplay } from '@/components/learning/TradeliaCoinDisplay';
import { PremiumButton } from '@/components/ui/premium-button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { useUserData } from '@/hooks/useUserData';
import { PROFESSIONAL_CERTIFICATIONS, type ProfessionalCertification } from '@/libs/learningAnalytics';
import { useTranslations } from 'next-intl';

const DashboardIndexPage = () => {
  const { userData, isLoading } = useUserData();
  const t = useTranslations('Dashboard');
  const tLearning = useTranslations('Learning');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 w-64 animate-pulse rounded-xl bg-muted" />
          <div className="h-4 w-96 animate-pulse rounded-xl bg-muted" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={`skeleton-${i}`} className="h-32 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
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

  // Mock certifications for demonstration (in real app, fetch from API)
  const userCertifications: ProfessionalCertification[] = [
    PROFESSIONAL_CERTIFICATIONS.blockchain_foundations,
    ...(userData.progress.completedLessons > 5 && userData.progress.badges > 1 
      ? [PROFESSIONAL_CERTIFICATIONS.crypto_analysis] 
      : []
    ),
    ...(userData.progress.completedLessons > 15 
      ? [PROFESSIONAL_CERTIFICATIONS.risk_management] 
      : []
    ),
  ].filter((cert): cert is ProfessionalCertification => cert !== undefined);

  // Convert XP to competency score (temporary mapping)
  const competencyScore = Math.floor(userData.progress.totalXP * 0.8);
  const tradeliaCoins = Math.floor(userData.progress.totalXP * 0.3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Welcome Section with Professional Analytics */}
        <div className="space-y-6">
          <TitleBar
            title={t('welcome_title', { name: userData.name })}
            description={t('welcome_description')}
          />

          {/* Professional Progress Card */}
          <div className="rounded-xl border bg-gradient-to-br from-card to-card/80 p-6 shadow-lg backdrop-blur-sm">
            <div className="space-y-6">
              {/* Competency Progress */}
              <CompetencyProgressBar
                competencyScore={competencyScore}
                showDetails
                size="lg"
                animated
              />
              
              {/* Tradelia Coins Display */}
              <div className="flex justify-center">
                <TradeliaCoinDisplay
                  totalCoins={tradeliaCoins}
                  showDetails
                  size="md"
                  animated
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Lessons Completed */}
          <div className="rounded-xl border bg-gradient-to-br from-card to-card/90 p-6 text-center shadow-sm backdrop-blur-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {userData.progress.completedLessons}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {t('lessons_completed')}
            </div>
          </div>

          {/* Competency Score */}
          <div className="rounded-xl border bg-gradient-to-br from-card to-card/90 p-6 text-center shadow-sm backdrop-blur-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {competencyScore.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {tLearning('competency_points')}
            </div>
          </div>

          {/* Learning Consistency */}
          <div className="rounded-xl border bg-gradient-to-br from-card to-card/90 p-6 text-center shadow-sm backdrop-blur-sm">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {userData.progress.currentStreak}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {t('consistency_days')}
            </div>
          </div>

          {/* Certifications */}
          <div className="rounded-xl border bg-gradient-to-br from-card to-card/90 p-6 text-center shadow-sm backdrop-blur-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {userCertifications.length}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {tLearning('certifications')}
            </div>
          </div>
        </div>

        {/* Professional Learning Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Learning Consistency */}
          <div className="rounded-xl border bg-gradient-to-br from-card to-card/90 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-6 text-xl font-semibold text-foreground">
              {t('learning_consistency_title')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('consecutive_days')}</span>
                <span className="text-2xl font-bold text-orange-600">
                  {userData.progress.currentStreak}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (userData.progress.currentStreak / 30) * 100)}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {userData.progress.currentStreak > 0 
                  ? t('consistency_message_active')
                  : t('consistency_message_start')
                }
              </p>
            </div>
          </div>

          {/* Professional Certifications */}
          <div className="rounded-xl border bg-gradient-to-br from-card to-card/90 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-6 text-xl font-semibold text-foreground">
              {t('professional_certifications_title')}
            </h2>
            {userCertifications.length > 0 
              ? (
                  <div className="space-y-4">
                    <CertificationShowcase 
                      certifications={userCertifications} 
                      maxDisplay={6} 
                      size="lg" 
                      showNew={false} 
                    />
                    <div className="text-sm text-muted-foreground">
                      {t('certifications_earned', { count: userCertifications.length })}
                    </div>
                  </div>
                )
              : (
                  <div className="text-center text-muted-foreground">
                    <div className="mb-4 text-4xl">🎓</div>
                    <p className="text-sm">
                      {t('certifications_empty_message')}
                    </p>
                  </div>
                )
            }
          </div>
        </div>

        {/* Learning Path Progress */}
        <div className="rounded-xl border bg-gradient-to-br from-card to-card/90 p-6 shadow-sm backdrop-blur-sm">
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            {t('learning_path_title')}
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t('fundamental_crypto_path')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('lessons_progress', { 
                    completed: userData.progress.completedLessons,
                    total: userData.progress.totalLessons 
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {userData.progress.progressPercentage}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('completed')}
                </div>
              </div>
            </div>

            {/* Professional Progress Bar */}
            <div className="h-4 w-full rounded-full bg-muted shadow-inner">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 shadow-sm transition-all duration-500 ease-out"
                style={{ width: `${userData.progress.progressPercentage}%` }}
              />
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <PremiumButton
                variant="primary"
                size="lg"
                className="w-full"
                glow
                icon={userData.progress.completedLessons === 0 ? '🚀' : '📚'}
                iconPosition="left"
              >
                {userData.progress.completedLessons === 0
                  ? t('start_fundamental_path')
                  : t('continue_professional_formation')}
              </PremiumButton>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="rounded-xl border bg-gradient-to-br from-card to-card/90 p-6 shadow-sm backdrop-blur-sm">
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            {t('next_objectives_title')}
          </h2>
          <div className="space-y-4">
            {userData.progress.completedLessons === 0
              ? (
                  <div className="flex items-center gap-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-200 dark:border-blue-800">
                    <div className="size-3 rounded-full bg-blue-600 flex-shrink-0" />
                    <span className="text-blue-900 dark:text-blue-100 font-medium">
                      {t('first_lesson_objective')}
                    </span>
                  </div>
                )
              : (
                  <div className="flex items-center gap-4 rounded-lg bg-green-50 dark:bg-green-950/30 p-4 border border-green-200 dark:border-green-800">
                    <div className="size-3 rounded-full bg-green-600 flex-shrink-0" />
                    <span className="text-green-900 dark:text-green-100 font-medium">
                      {t('continue_path_objective')}
                    </span>
                  </div>
                )
            }

            <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4 border border-border">
              <div className="size-3 rounded-full bg-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">
                {t('unlock_specialist_paths')}
              </span>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 p-4 border border-purple-200 dark:border-purple-800">
              <div className="size-3 rounded-full bg-purple-600 flex-shrink-0" />
              <span className="text-purple-900 dark:text-purple-100">
                {t('earn_tradelia_coins_objective')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardIndexPage;