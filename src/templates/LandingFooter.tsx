'use client';

import { useTranslations } from 'next-intl';

import { SectionContainer } from '@/components/ui/SectionContainer';
import { Link } from '@/libs/i18nNavigation';
import { AppConfig } from '@/utils/AppConfig';

import { Logo } from './Logo';

export const LandingFooter = () => {
  const t = useTranslations('LandingFooter') as (key: string) => string;

  return (
    <footer className="border-t border-border/40 bg-slate-950 py-10 text-slate-200 sm:py-12 lg:py-14 2xl:py-16">
      <SectionContainer size="wide">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <Logo href="/" />
            <div className="mt-4 inline-flex rounded-full border border-slate-800 bg-slate-900 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
              TradeScope / Tradelia
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              {t('description')}
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 text-sm md:items-end">
            <a
              href="#faq"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-slate-100"
            >
              {t('faq')}
            </a>
            <Link
              href="/contact"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-slate-100"
            >
              {t('contact')}
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-4 text-xs leading-6 text-slate-500">
          <p>{t('disclaimer')}</p>
          <p className="mt-2">
            (c)
{' '}
{new Date().getFullYear()}
{' '}
{AppConfig.name}
.
{' '}
{t('copyright')}
          </p>
        </div>
      </SectionContainer>
    </footer>
  );
};
