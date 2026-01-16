import { useTranslations } from 'next-intl';

import { TitleBar } from '@/features/dashboard/TitleBar';

const DashboardIndexPage = () => {
  const t = useTranslations('DashboardIndex');

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <div className="mt-8 flex flex-col gap-6">
        {/* Placeholder - sarà sostituito con il percorso attivo */}
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-muted-foreground">
            Il tuo percorso di apprendimento apparirà qui.
          </p>
        </div>
      </div>
    </>
  );
};

export default DashboardIndexPage;
