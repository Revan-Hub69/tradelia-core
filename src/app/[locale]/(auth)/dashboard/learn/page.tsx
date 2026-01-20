'use client';

import { useTranslations } from 'next-intl';

export default function LearnPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">{t('LearnPage.title')}</h1>
          <p className="text-muted-foreground">
            {t('LearnPage.description')}
          </p>
        </div>

        {/* Main Learning Path */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('LearnPage.main_path_title')}</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {t('LearnPage.main_path_description')}
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                  {t('LearnPage.module1_title')}
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {t('LearnPage.module1_description')}
                </p>
              </div>

              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950/30">
                <h3 className="mb-2 font-semibold text-purple-900 dark:text-purple-100">
                  {t('LearnPage.module2_title')}
                </h3>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  {t('LearnPage.module2_description')}
                </p>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
                <h3 className="mb-2 font-semibold text-green-900 dark:text-green-100">
                  {t('LearnPage.module3_title')}
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  {t('LearnPage.module3_description')}
                </p>
              </div>

              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950/30">
                <h3 className="mb-2 font-semibold text-orange-900 dark:text-orange-100">
                  {t('LearnPage.module4_title')}
                </h3>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  {t('LearnPage.module4_description')}
                </p>
              </div>
            </div>

            <div className="rounded border border-orange-200 bg-orange-50 p-3 text-sm text-orange-600 dark:border-orange-800 dark:bg-orange-950/30">
              {t('LearnPage.content_in_development')}
            </div>
          </div>
        </div>

        {/* Specialized Paths */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('LearnPage.specialist_paths_title')}</h2>
          <p className="mb-4 text-muted-foreground">
            {t('LearnPage.specialist_paths_description')}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">{t('LearnPage.path_custody_title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('LearnPage.path_custody_description')}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">{t('LearnPage.path_passive_title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('LearnPage.path_passive_description')}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">{t('LearnPage.path_investment_title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('LearnPage.path_investment_description')}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">{t('LearnPage.path_trading_title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('LearnPage.path_trading_description')}
              </p>
            </div>
          </div>
        </div>

        {/* Learning Methodology */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/30">
          <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
            {t('LearnPage.methodology_title')}
          </h3>
          <ul className="space-y-1 text-sm text-slate-800 dark:text-slate-200">
            <li>{t('LearnPage.methodology_spaced_repetition')}</li>
            <li>{t('LearnPage.methodology_active_recall')}</li>
            <li>{t('LearnPage.methodology_microlearning')}</li>
            <li>{t('LearnPage.methodology_practical_examples')}</li>
            <li>{t('LearnPage.methodology_no_gamification')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
