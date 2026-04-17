'use client';

import { useLocale, useTranslations } from 'next-intl';

import { SectionContainer } from '@/components/ui/SectionContainer';
import { getLandingSectionHref, landingSections } from '@/config/landing';
import { Link, usePathname } from '@/lib/i18nNavigation';
import { AppConfig } from '@/utils/AppConfig';

import { Logo } from './Logo';

export const LandingFooter = () => {
  const t        = useTranslations('LandingFooter') as (key: string) => string;
  const locale   = useLocale();
  const pathname = usePathname();

  const navLinks = landingSections.map(section => ({
    href:  getLandingSectionHref(locale, pathname, section.id),
    label: t(section.footerLabelKey),
  }));

  return (
    <footer className="border-t border-border/40 bg-slate-950 py-10 text-slate-200 sm:py-12 lg:py-14 2xl:py-16">
      <SectionContainer size="wide">

        {/* ── Top grid ── */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.9fr] lg:gap-12">

          {/* Col 1 — Platform identity */}
          <div className="md:col-span-2 lg:col-span-1">
            <Logo href="/" />
            <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">
              {t('platform_description')}
            </p>
            <div className="mt-6 space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                {t('tools_label')}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-300">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  {t('tool_cost_simulator')}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600">
                  <span className="size-1.5 rounded-full bg-slate-700" />
                  {t('tool_etf_screener')}
                  <span className="ml-0.5 text-[9px] tracking-normal text-slate-700">{t('tool_coming_soon')}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Col 2 — Navigation */}
          <div className="md:col-span-1">
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

          {/* Col 3 — Contact */}
          <div className="rounded-[24px] border border-slate-800 bg-slate-900/70 p-5 sm:p-6 md:col-span-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
              {t('contact_title')}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              {t('contact_note')}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
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

        {/* ── Bottom bar ── */}
        <div className="mt-10 border-t border-slate-800 pt-5">
          {/* Disclaimer text */}
          <p className="text-xs leading-6 text-slate-400">
            {t('disclaimer')}
            {' '}
            <Link
              href="/disclaimer"
              className="text-slate-300 underline underline-offset-2 transition-colors hover:text-slate-100"
            >
              {t('disclaimer_link_label')}
            </Link>
            {'.'}
          </p>

          {/* Legal links row + copyright */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} {AppConfig.name}. {t('copyright')}
            </p>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <Link
              href="/disclaimer"
              className="text-xs text-slate-600 underline underline-offset-2 transition-colors hover:text-slate-400"
            >
              Disclaimer
            </Link>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <Link
              href="/privacy-policy"
              className="text-xs text-slate-600 underline underline-offset-2 transition-colors hover:text-slate-400"
            >
              {t('privacy_link_label')}
            </Link>
          </div>
        </div>

      </SectionContainer>
    </footer>
  );
};
