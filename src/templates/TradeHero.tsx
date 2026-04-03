'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

/**
 * CostBarChart — 5 instruments: ETF, CFD, Futures, Options, Turbo/KO
 * All labels i18n via props. No hardcoded Italian strings.
 */
interface ChartLabels {
  net: string;
  drag: string;
  sameUnderlying: string;
  etf: string;
  etfSub: string;
  cfd: string;
  cfdSub: string;
  futures: string;
  futuresSub: string;
  options: string;
  optionsSub: string;
  turbo: string;
  turboSub: string;
}

const CostBarChart = ({ labels }: { labels: ChartLabels }) => (
  <svg
    viewBox="0 0 600 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-auto w-full max-w-2xl"
    aria-hidden="true"
  >
    {/* Grid */}
    <line x1="60" y1="170" x2="580" y2="170" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
    <line x1="60" y1="130" x2="580" y2="130" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="60" y1="90"  x2="580" y2="90"  stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="60" y1="50"  x2="580" y2="50"  stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="60" y1="30"  x2="60"  y2="170" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />

    {/* Y labels */}
    <text x="52" y="173" textAnchor="end" style={{fontSize:'8px',fill:'currentColor',opacity:0.30}}>0</text>
    <text x="52" y="133" textAnchor="end" style={{fontSize:'8px',fill:'currentColor',opacity:0.30}}>25</text>
    <text x="52" y="93"  textAnchor="end" style={{fontSize:'8px',fill:'currentColor',opacity:0.30}}>50</text>
    <text x="52" y="53"  textAnchor="end" style={{fontSize:'8px',fill:'currentColor',opacity:0.30}}>75</text>

    {/* ETF — drag 12%, net 88% */}
    <rect x="84"  y="51" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.06" />
    <rect x="84"  y="65" width="44" height="105" rx="3" fill="currentColor" fillOpacity="0.60" className="text-primary" />
    <rect x="84"  y="51" width="44" height="14"  rx="2" fill="#ef4444" fillOpacity="0.45" />
    <text x="106" y="188" textAnchor="middle" style={{fontSize:'10px',fontWeight:700,fill:'currentColor',opacity:0.65}}>{labels.etf}</text>
    <text x="106" y="199" textAnchor="middle" style={{fontSize:'7px',fill:'currentColor',opacity:0.38}}>{labels.etfSub}</text>

    {/* CFD — drag 45%, net 55% */}
    <rect x="184" y="51" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.06" />
    <rect x="184" y="105" width="44" height="65"  rx="3" fill="currentColor" fillOpacity="0.45" className="text-primary" />
    <rect x="184" y="51" width="44" height="54"  rx="2" fill="#ef4444" fillOpacity="0.45" />
    <text x="206" y="188" textAnchor="middle" style={{fontSize:'10px',fontWeight:700,fill:'currentColor',opacity:0.65}}>{labels.cfd}</text>
    <text x="206" y="199" textAnchor="middle" style={{fontSize:'7px',fill:'currentColor',opacity:0.38}}>{labels.cfdSub}</text>

    {/* Futures — drag 18%, net 82% */}
    <rect x="284" y="51" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.06" />
    <rect x="284" y="72" width="44" height="98"  rx="3" fill="currentColor" fillOpacity="0.55" className="text-primary" />
    <rect x="284" y="51" width="44" height="21"  rx="2" fill="#ef4444" fillOpacity="0.45" />
    <text x="306" y="188" textAnchor="middle" style={{fontSize:'10px',fontWeight:700,fill:'currentColor',opacity:0.65}}>{labels.futures}</text>
    <text x="306" y="199" textAnchor="middle" style={{fontSize:'7px',fill:'currentColor',opacity:0.38}}>{labels.futuresSub}</text>

    {/* Options — drag 35%, net 65% */}
    <rect x="384" y="51" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.06" />
    <rect x="384" y="89" width="44" height="81"  rx="3" fill="currentColor" fillOpacity="0.40" className="text-primary" />
    <rect x="384" y="51" width="44" height="38"  rx="2" fill="#ef4444" fillOpacity="0.45" />
    <text x="406" y="188" textAnchor="middle" style={{fontSize:'10px',fontWeight:700,fill:'currentColor',opacity:0.65}}>{labels.options}</text>
    <text x="406" y="199" textAnchor="middle" style={{fontSize:'7px',fill:'currentColor',opacity:0.38}}>{labels.optionsSub}</text>

    {/* Turbo/KO — drag 65%, net 35% */}
    <rect x="484" y="51" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.06" />
    <rect x="484" y="128" width="44" height="42"  rx="3" fill="currentColor" fillOpacity="0.28" className="text-primary" />
    <rect x="484" y="51"  width="44" height="77"  rx="2" fill="#ef4444" fillOpacity="0.52" />
    <text x="506" y="188" textAnchor="middle" style={{fontSize:'10px',fontWeight:700,fill:'currentColor',opacity:0.65}}>{labels.turbo}</text>
    <text x="506" y="199" textAnchor="middle" style={{fontSize:'7px',fill:'currentColor',opacity:0.38}}>{labels.turboSub}</text>

    {/* Legend */}
    <rect x="500" y="14" width="9" height="9" rx="1" fill="currentColor" fillOpacity="0.55" className="text-primary" />
    <text x="513" y="22" style={{fontSize:'8px',fill:'currentColor',opacity:0.45}}>{labels.net}</text>
    <rect x="500" y="28" width="9" height="9" rx="1" fill="#ef4444" fillOpacity="0.45" />
    <text x="513" y="36" style={{fontSize:'8px',fill:'currentColor',opacity:0.45}}>{labels.drag}</text>

    {/* Same underlying label */}
    <text x="320" y="15" textAnchor="middle" style={{fontSize:'8px',fill:'currentColor',opacity:0.22,letterSpacing:'0.06em'}}>
      {labels.sameUnderlying}
    </text>
  </svg>
);

interface TradeHeroProps {
  broker?: string;
}

export const TradeHero = ({ broker }: TradeHeroProps) => {
  const t = useTranslations('TradeHero') as (key: string) => string;
  const tChart = useTranslations('Chart') as (key: string) => string;

  const chartLabels: ChartLabels = {
    net: tChart('net'),
    drag: tChart('drag'),
    sameUnderlying: tChart('same_underlying'),
    etf: tChart('etf'),
    etfSub: tChart('etf_sub'),
    cfd: tChart('cfd'),
    cfdSub: tChart('cfd_sub'),
    futures: tChart('futures'),
    futuresSub: tChart('futures_sub'),
    options: tChart('options'),
    optionsSub: tChart('options_sub'),
    turbo: tChart('turbo'),
    turboSub: tChart('turbo_sub'),
  };

  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-24 md:py-28 xl:py-32 2xl:max-w-5xl 2xl:mx-auto">
      <div className="mx-auto max-w-4xl">

        {/* Eyebrow */}
        <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
          {t('eyebrow')}
          {broker && (
            <span className="ml-2 font-semibold text-muted-foreground/80">
              · {broker}
            </span>
          )}
        </p>

        {/* H1 */}
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl">
          {t('title')}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {broker
            ? t('subtitle_broker').replace('{broker}', broker)
            : t('subtitle')}
        </p>

        {/* Chart */}
        <div className="mt-10 overflow-x-auto">
          <CostBarChart labels={chartLabels} />
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button asChild size="lg" className="h-12 px-8 text-base font-semibold">
            <Link href="/tool">{t('cta')}</Link>
          </Button>
          <span className="text-xs text-muted-foreground/60">{t('cta_note')}</span>
        </div>

        {/* Trust bar — contrast fixed: /40 → /60 */}
        <p className="mt-6 text-xs text-muted-foreground/60">
          {t('trust')}
        </p>
      </div>
    </section>
  );
};
