'use client';

import { useTranslations } from 'next-intl';

export default function MyChallengesPage() {
  const t = useTranslations('MyChallenges');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>

        {/* Active Challenges Section */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('active_challenges_title')}</h2>
          <p className="mb-4 text-muted-foreground">
            {t('active_challenges_description')}
          </p>

          <div className="space-y-4">
            {/* Empty state placeholder */}
            <div className="rounded-lg border border-dashed border-muted-foreground/30 p-8 text-center">
              <p className="text-muted-foreground">
                {t('no_active_challenges')}
              </p>
            </div>
          </div>
        </div>

        {/* Trade Journal Section */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('trade_journal_title')}</h2>
          <p className="mb-4 text-muted-foreground">
            {t('trade_journal_description')}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
              <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                {t('journal_feature_tracking')}
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {t('journal_feature_tracking_description')}
              </p>
            </div>

            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950/30">
              <h3 className="mb-2 font-semibold text-purple-900 dark:text-purple-100">
                {t('journal_feature_analytics')}
              </h3>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                {t('journal_feature_analytics_description')}
              </p>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
              <h3 className="mb-2 font-semibold text-green-900 dark:text-green-100">
                {t('journal_feature_rules')}
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                {t('journal_feature_rules_description')}
              </p>
            </div>

            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950/30">
              <h3 className="mb-2 font-semibold text-orange-900 dark:text-orange-100">
                {t('journal_feature_alerts')}
              </h3>
              <p className="text-sm text-orange-800 dark:text-orange-200">
                {t('journal_feature_alerts_description')}
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="rounded border border-orange-200 bg-orange-50 p-4 text-sm text-orange-600 dark:border-orange-800 dark:bg-orange-950/30">
          {t('in_development')}
        </div>
      </div>
    </div>
  );
}
