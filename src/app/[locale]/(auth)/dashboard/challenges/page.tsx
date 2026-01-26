'use client';

import { useTranslations } from 'next-intl';

export default function ChallengesPage() {
  const t = useTranslations('Challenges');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>

        {/* Free Challenges Section */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('free_challenges_title')}</h2>
          <p className="mb-4 text-muted-foreground">
            {t('free_challenges_description')}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
              <h3 className="mb-2 font-semibold text-green-900 dark:text-green-100">
                {t('tradingview_leap_title')}
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                {t('tradingview_leap_description')}
              </p>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
              <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                {t('deriv_title')}
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {t('deriv_description')}
              </p>
            </div>
          </div>
        </div>

        {/* Prop Firm Challenges Section */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('prop_challenges_title')}</h2>
          <p className="mb-4 text-muted-foreground">
            {t('prop_challenges_description')}
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">{t('ftmo_title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ftmo_description')}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">{t('fundednext_title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('fundednext_description')}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">{t('the5ers_title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('the5ers_description')}
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
