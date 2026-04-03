'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

/**
 * HeroIllustration — Instrument efficiency comparison visualisation
 * Shows 4 instruments side by side with cost/return bars
 */
const HeroIllustration = () => (
  <svg
    viewBox="0 0 480 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-auto w-full max-w-xl"
    aria-hidden="true"
  >
    {/* Grid lines */}
    <line x1="48" y1="20" x2="48" y2="140" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
    <line x1="48" y1="140" x2="460" y2="140" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
    <line x1="48" y1="100" x2="460" y2="100" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="48" y1="60" x2="460" y2="60" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="4 4" />

    {/* Y axis labels */}
    <text x="40" y="143" textAnchor="end" style={{fontSize:'8px', opacity:0.3, fill:'currentColor'}}>0</text>
    <text x="40" y="103" textAnchor="end" style={{fontSize:'8px', opacity:0.3, fill:'currentColor'}}>50</text>
    <text x="40" y="63" textAnchor="end" style={{fontSize:'8px', opacity:0.3, fill:'currentColor'}}>100</text>

    {/* ── ETF ── */}
    {/* Gross return bar */}
    <rect x="72" y="42" width="36" height="98" rx="3" className="fill-primary" fillOpacity="0.15" />
    {/* Net return bar */}
    <rect x="72" y="52" width="36" height="88" rx="3" className="fill-primary" fillOpacity="0.75" />
    {/* Cost gap indicator */}
    <rect x="72" y="42" width="36" height="10" rx="2" fill="#ef4444" fillOpacity="0.35" />
    <text x="90" y="158" textAnchor="middle" style={{fontSize:'9px', fontWeight:600, opacity:0.55, fill:'currentColor'}}>ETF</text>
    <text x="90" y="168" textAnchor="middle" style={{fontSize:'7px', opacity:0.3, fill:'currentColor'}}>0.20%/y</text>

    {/* ── CFD ── */}
    <rect x="156" y="42" width="36" height="98" rx="3" className="fill-primary" fillOpacity="0.15" />
    <rect x="156" y="82" width="36" height="58" rx="3" className="fill-primary" fillOpacity="0.55" />
    <rect x="156" y="42" width="36" height="40" rx="2" fill="#ef4444" fillOpacity="0.35" />
    <text x="174" y="158" textAnchor="middle" style={{fontSize:'9px', fontWeight:600, opacity:0.55, fill:'currentColor'}}>CFD</text>
    <text x="174" y="168" textAnchor="middle" style={{fontSize:'7px', opacity:0.3, fill:'currentColor'}}>spread+swap</text>

    {/* ── Futures ── */}
    <rect x="240" y="42" width="36" height="98" rx="3" className="fill-primary" fillOpacity="0.15" />
    <rect x="240" y="56" width="36" height="84" rx="3" className="fill-primary" fillOpacity="0.65" />
    <rect x="240" y="42" width="36" height="14" rx="2" fill="#ef4444" fillOpacity="0.35" />
    <text x="258" y="158" textAnchor="middle" style={{fontSize:'9px', fontWeight:600, opacity:0.55, fill:'currentColor'}}>Futures</text>
    <text x="258" y="168" textAnchor="middle" style={{fontSize:'7px', opacity:0.3, fill:'currentColor'}}>rollover</text>

    {/* ── Options ── */}
    <rect x="324" y="42" width="36" height="98" rx="3" className="fill-primary" fillOpacity="0.15" />
    <rect x="324" y="70" width="36" height="70" rx="3" className="fill-primary" fillOpacity="0.50" />
    <rect x="324" y="42" width="36" height="28" rx="2" fill="#ef4444" fillOpacity="0.35" />
    <text x="342" y="158" textAnchor="middle" style={{fontSize:'9px', fontWeight:600, opacity:0.55, fill:'currentColor'}}>Options</text>
    <text x="342" y="168" textAnchor="middle" style={{fontSize:'7px', opacity:0.3, fill:'currentColor'}}>theta+commission</text>

    {/* ── Legend ── */}
    <rect x="396" y="60" width="8" height="8" rx="1" className="fill-primary" fillOpacity="0.7" />
    <text x="408" y="68" style={{fontSize:'8px', opacity:0.45, fill:'currentColor'}}>Net return</text>
    <rect x="396" y="76" width="8" height="8" rx="1" fill="#ef4444" fillOpacity="0.4" />
    <text x="408" y="84" style={{fontSize:'8px', opacity:0.45, fill:'currentColor'}}>Cost drag</text>
  </svg>
);

export const ToolsHero = () => {
  const t = useTranslations('Tools') as (key: string) => string;

  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        {/* Eyebrow */}
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {t('eyebrow')}
        </p>

        {/* Title — left aligned */}
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {t('hero_title')}
        </h1>

        <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          {t('hero_subtitle')}
        </p>

        {/* Pipeline illustration */}
        <div className="mt-10 overflow-x-auto pb-2">
          <HeroIllustration />
        </div>

        {/* Single CTA */}
        <div className="mt-8">
          <Button asChild size="lg" className="h-12 px-8 text-base">
            <Link href="#tool">{t('cta_primary')}</Link>
          </Button>
        </div>

        {/* Credibility line */}
        <p className="mt-5 text-xs text-muted-foreground/60">
          {t('trust')}
        </p>
      </div>
    </section>
  );
};
