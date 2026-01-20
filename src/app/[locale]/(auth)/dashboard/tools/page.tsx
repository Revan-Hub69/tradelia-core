import { useTranslations } from 'next-intl';

export default function ToolsPage() {
  const t = useTranslations('Tools');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Portfolio Tracker */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-2 text-lg font-semibold">{t('portfolio_tracker')}</h2>
            <p className="mb-4 text-muted-foreground">
              {t('portfolio_tracker_description')}
            </p>
            <div className="rounded border border-orange-200 bg-orange-50 p-3 text-sm text-orange-600 dark:border-orange-800 dark:bg-orange-950/30">
              {t('in_development')}
            </div>
          </div>

          {/* DCA Calculator */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-2 text-lg font-semibold">{t('dca_calculator')}</h2>
            <p className="mb-4 text-muted-foreground">
              {t('dca_calculator_description')}
            </p>
            <div className="rounded border border-orange-200 bg-orange-50 p-3 text-sm text-orange-600 dark:border-orange-800 dark:bg-orange-950/30">
              {t('in_development')}
            </div>
          </div>

          {/* Risk Analyzer */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-2 text-lg font-semibold">{t('risk_analyzer')}</h2>
            <p className="mb-4 text-muted-foreground">
              {t('risk_analyzer_description')}
            </p>
            <div className="rounded border border-orange-200 bg-orange-50 p-3 text-sm text-orange-600 dark:border-orange-800 dark:bg-orange-950/30">
              {t('coming_soon')}
            </div>
          </div>

          {/* Yield Calculator */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-2 text-lg font-semibold">{t('yield_calculator')}</h2>
            <p className="mb-4 text-muted-foreground">
              {t('yield_calculator_description')}
            </p>
            <div className="rounded border border-orange-200 bg-orange-50 p-3 text-sm text-orange-600 dark:border-orange-800 dark:bg-orange-950/30">
              {t('coming_soon')}
            </div>
          </div>
        </div>

        {/* Affiliate Disclaimer */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
          <p>{t('affiliate_disclaimer')}</p>
        </div>
      </div>
    </div>
  );
}
