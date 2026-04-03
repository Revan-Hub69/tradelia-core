'use client';

import { useLocale, useTranslations } from 'next-intl';

import { SectionContainer } from '@/components/ui/SectionContainer';
import { getLandingSectionHref, heroContextChipKeys, landingSections } from '@/config/tradescope';
import { Link, usePathname } from '@/libs/i18nNavigation';
import { AppConfig } from '@/utils/AppConfig';

import { Logo } from './Logo';

export const LandingFooter = () => {
  const t = useTranslations('LandingFooter') as (key: string) => string;
  const locale = useLocale();
  const pathname = usePathname();
  const navLinks = landingSections.map(section => ({
    href: getLandingSectionHref(locale, pathname, section.id),
    label: t(section.footerLabelKey),
  }));
  const scopeItems = [t('scope_item_1'), t('scope_item_2'), t('scope_item_3')];
  const brandBadge = `${AppConfig.productName} / ${AppConfig.name}`;

  return (
    <footer className="border-t border-border/40 bg-slate-950 py-10 text-slate-200 sm:py-12 lg:py-14 2xl:py-16">
      <SectionContainer size="wide">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.72fr_0.98fr] lg:gap-10">
          <div className="max-w-md">
            <Logo href="/" />
            <div className="mt-4 inline-flex rounded-full border border-slate-800 bg-slate-900 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
              {brandBadge}
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              {t('description')}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {heroContextChipKeys.map(key => (
                <span
                  key={key}
                  className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400"
                >
                  {t(key)}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
              {t('nav_title')}
            </p>
            <div className="mt-4 grid gap-3">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-slate-100"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
              {t('scope_title')}
            </p>
            <div className="mt-4 space-y-3">
              {scopeItems.map(item => (
                <div key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-300">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-800 pt-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                {t('contact_title')}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                {t('contact_note')}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={AppConfig.routes.contact}
                  className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-950 transition-colors hover:bg-white"
                >
                  {t('contact')}
                </Link>
                <a
                  href={`mailto:${AppConfig.supportEmail}`}
                  className="inline-flex items-center rounded-full border border-slate-700 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300 transition-colors hover:border-slate-500 hover:text-slate-100"
                >
                  {t('email_cta')}
                </a>
              </div>
            </div>
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
