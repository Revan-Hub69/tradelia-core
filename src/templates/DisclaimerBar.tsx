'use client';

import { useTranslations } from 'next-intl';

import { SectionContainer } from '@/components/ui/SectionContainer';

export const DisclaimerBar = () => {
  const t = useTranslations('Disclaimer') as (key: string) => string;

  return (
    <div className="border-t border-border/30 bg-muted/10 py-6 sm:py-7 2xl:py-8">
      <SectionContainer size="content">
        <p className="text-xs leading-relaxed text-muted-foreground/50">
          <span className="font-semibold text-muted-foreground/70">{t('label')}</span>
{' '}
          {t('text')}
        </p>
      </SectionContainer>
    </div>
  );
};
