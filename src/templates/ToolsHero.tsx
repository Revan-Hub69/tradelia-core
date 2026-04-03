'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

/**
 * HeroIllustration - Decision pipeline visualisation
 * Three analysis stages connected by directed flow
 */
const HeroIllustration = () => (
  <svg
    viewBox="0 0 480 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-auto w-full max-w-lg"
    aria-hidden="true"
  >
    {/* ── Node 1: Net Return ── */}
    <rect x="0" y="32" width="128" height="96" rx="10" className="fill-card" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
    {/* mini bar chart */}
    <rect x="16" y="90" width="10" height="24" rx="2" className="fill-primary" fillOpacity="0.25" />
    <rect x="30" y="78" width="10" height="36" rx="2" className="fill-primary" fillOpacity="0.45" />
    <rect x="44" y="62" width="10" height="52" rx="2" className="fill-primary" fillOpacity="0.70" />
    <rect x="58" y="50" width="10" height="64" rx="2" className="fill-primary" />
    {/* label */}
    <text x="16" y="52" className="fill-foreground" style={{fontSize:'9px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', opacity:0.5}}>Net Return</text>
    {/* value */}
    <text x="86" y="95" textAnchor="middle" className="fill-primary" style={{fontSize:'18px', fontWeight:700}}>+4.2%</text>
    <text x="86" y="110" textAnchor="middle" style={{fontSize:'8px', opacity:0.4, fill:'currentColor'}}>after fees</text>

    {/* ── Arrow 1→2 ── */}
    <line x1="136" y1="80" x2="172" y2="80" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 3" />
    <polygon points="172,76 180,80 172,84" className="fill-primary" fillOpacity="0.4" />

    {/* ── Node 2: Exposure ── */}
    <rect x="180" y="32" width="120" height="96" rx="10" className="fill-card" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
    {/* radar-style concentric arcs (exposure rings) */}
    <circle cx="240" cy="95" r="28" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" fill="none" />
    <circle cx="240" cy="95" r="18" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" fill="none" />
    <circle cx="240" cy="95" r="8" className="fill-primary" fillOpacity="0.15" stroke="none" />
    {/* axis lines */}
    <line x1="240" y1="67" x2="240" y2="95" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
    <line x1="212" y1="95" x2="240" y2="95" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
    <line x1="220" y1="72" x2="240" y2="95" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
    {/* data polygon */}
    <polygon points="240,73 255,88 248,108 232,108 225,88" className="fill-primary" fillOpacity="0.18" stroke="none" />
    <polygon points="240,73 255,88 248,108 232,108 225,88" fill="none" className="stroke-primary" strokeWidth="1.5" strokeOpacity="0.7" />
    {/* label */}
    <text x="196" y="52" className="fill-foreground" style={{fontSize:'9px', fontWeight:600, letterSpacing:'0.06em', opacity:0.5}}>Exposure</text>
    <text x="240" y="95" textAnchor="middle" className="fill-primary" style={{fontSize:'8px', fontWeight:700, dominantBaseline:'middle'}}>ETF</text>

    {/* ── Arrow 2→3 ── */}
    <line x1="308" y1="80" x2="344" y2="80" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 3" />
    <polygon points="344,76 352,80 344,84" className="fill-primary" fillOpacity="0.4" />

    {/* ── Node 3: Flow Radar ── */}
    <rect x="352" y="32" width="128" height="96" rx="10" className="fill-card" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
    {/* sparkline with anomaly spike */}
    <polyline
      points="368,100 382,98 396,101 410,97 418,103 424,88 430,103 444,100 458,99 468,101"
      fill="none"
      className="stroke-primary"
      strokeWidth="1.5"
      strokeOpacity="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* anomaly highlight */}
    <circle cx="424" cy="88" r="5" className="fill-primary" fillOpacity="0.2" />
    <circle cx="424" cy="88" r="2.5" className="fill-primary" fillOpacity="0.9" />
    {/* label */}
    <text x="368" y="52" className="fill-foreground" style={{fontSize:'9px', fontWeight:600, letterSpacing:'0.06em', opacity:0.5}}>Flow Radar</text>
    <text x="424" y="75" textAnchor="middle" style={{fontSize:'7px', opacity:0.5, fill:'currentColor'}}>anomaly</text>
    <line x1="424" y1="77" x2="424" y2="83" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 1" />

    {/* ── Step numbers ── */}
    <text x="64" y="145" textAnchor="middle" style={{fontSize:'8px', opacity:0.3, fill:'currentColor', letterSpacing:'0.05em'}}>01</text>
    <text x="240" y="145" textAnchor="middle" style={{fontSize:'8px', opacity:0.3, fill:'currentColor', letterSpacing:'0.05em'}}>02</text>
    <text x="416" y="145" textAnchor="middle" style={{fontSize:'8px', opacity:0.3, fill:'currentColor', letterSpacing:'0.05em'}}>03</text>
  </svg>
);

/**
 * ToolsHero - Finance 2026 entry point
 * Shows the decision pipeline immediately, no marketing copy
 */
export const ToolsHero = () => {
  const t = useTranslations('Tools') as (key: string) => string;

  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        {/* Eyebrow */}
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {t('eyebrow')}
        </p>

        {/* Title — left aligned, not centered */}
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

        {/* CTAs — hierarchy: primary → secondary → ghost */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-12 px-7 text-base">
            <Link href="#net-return">{t('cta_primary')}</Link>
          </Button>
          <Button asChild variant="outline" size="default" className="h-11 px-5">
            <Link href="#exposure">{t('cta_secondary')}</Link>
          </Button>
          <Button asChild variant="ghost" size="default" className="h-11 px-5 text-muted-foreground">
            <Link href="#flow">{t('cta_tertiary')}</Link>
          </Button>
        </div>

        {/* Credibility line — istituzionale, non e-commerce */}
        <p className="mt-6 text-xs text-muted-foreground/60">
          {t('trust')}
        </p>
      </div>
    </section>
  );
};
