'use client';

import { useTranslations } from 'next-intl';

export const DisclaimerBar = () => {
  const t = useTranslations('Disclaimer') as (key: string) => string;

  return (
    <div className="border-t border-border/30 bg-muted/10 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs leading-relaxed text-muted-foreground/50">
          <span className="font-semibold text-muted-foreground/70">{t('label')}</span>{' '}
          {t('text')}
        </p>
      </div>
    </div>
  );
};
