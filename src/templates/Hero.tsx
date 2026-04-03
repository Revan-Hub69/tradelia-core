'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { FadeIn, SlideReveal } from '@/components/ui/scroll-animations';

/**
 * CostBarChart — product preview used as hero visual.
 * Instruments: ETF, CFD, Futures, Options, Turbo/KO
 * Fully i18n via props.
 */
interface CostBarChartProps {
  labels: {
    net: string;
    drag: string;
    sameUnderlying: string;
    etf: string;
    cfd: string;
    futures: string;
    options: string;
    turbo: string;
    etfSub: string;
    cfdSub: string;
    futuresSub: string;
    optionsSub: string;
    turboSub: string;
  };
}

const CostBarChart = ({ labels }: CostBarChartProps) => (
  <svg
    viewBox="0 0 600 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-auto w-full"
    aria-hidden="true"
  >
    {/* Grid lines */}
    <line x1="60" y1="170" x2="580" y2="170" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
    <line x1="60" y1="130" x2="580" y2="130" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="60" y1="90"  x2="580" y2="90"  stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="60" y1="50"  x2="580" y2="50"  stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="60" y1="30"  x2="60"  y2="170" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />

    {/* Y labels */}
    <text x="52" y="173" textAnchor="end" style={{fontSize:'8px',fill:'currentColor',opacity:0.3}}>0</text>
    <text x="52" y="133" textAnchor="end" style={{fontSize:'8px',fill:'currentColor',opacity:0.3}}>25</text>
    <text x="52" y="93"  textAnchor="end" style={{fontSize:'8px',fill:'currentColor',opacity:0.3}}>50</text>
    <text x="52" y="53"  textAnchor="end" style={{fontSize:'8px',fill:'currentColor',opacity:0.3}}>75</text>

    {/* ETF — cost drag 12%, net 88% */}
    <rect x="84"  y="51" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.06" />
    <rect x="84"  y="65" width="44" height="105" rx="3" fill="currentColor" fillOpacity="0.60" className="text-primary" />
    <rect x="84"  y="51" width="44" height="14"  rx="2" fill="#ef4444" fillOpacity="0.45" />
    <text x="106" y="188" textAnchor="middle" style={{fontSize:'10px',fontWeight:700,fill:'currentColor',opacity:0.65}}>{labels.etf}</text>
    <text x="106" y="199" textAnchor="middle" style={{fontSize:'7px',fill:'currentColor',opacity:0.35}}>{labels.etfSub}</text>

    {/* CFD — cost drag 45%, net 55% */}
    <rect x="184" y="51" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.06" />
    <rect x="184" y="105" width="44" height="65"  rx="3" fill="currentColor" fillOpacity="0.45" className="text-primary" />
    <rect x="184" y="51" width="44" height="54"  rx="2" fill="#ef4444" fillOpacity="0.45" />
    <text x="206" y="188" textAnchor="middle" style={{fontSize:'10px',fontWeight:700,fill:'currentColor',opacity:0.65}}>{labels.cfd}</text>
    <text x="206" y="199" textAnchor="middle" style={{fontSize:'7px',fill:'currentColor',opacity:0.35}}>{labels.cfdSub}</text>

    {/* Futures — cost drag 18%, net 82% */}
    <rect x="284" y="51" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.06" />
    <rect x="284" y="72" width="44" height="98"  rx="3" fill="currentColor" fillOpacity="0.55" className="text-primary" />
    <rect x="284" y="51" width="44" height="21"  rx="2" fill="#ef4444" fillOpacity="0.45" />
    <text x="306" y="188" textAnchor="middle" style={{fontSize:'10px',fontWeight:700,fill:'currentColor',opacity:0.65}}>{labels.futures}</text>
    <text x="306" y="199" textAnchor="middle" style={{fontSize:'7px',fill:'currentColor',opacity:0.35}}>{labels.futuresSub}</text>

    {/* Options — cost drag 35%, net 65% */}
    <rect x="384" y="51" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.06" />
    <rect x="384" y="89" width="44" height="81"  rx="3" fill="currentColor" fillOpacity="0.40" className="text-primary" />
    <rect x="384" y="51" width="44" height="38"  rx="2" fill="#ef4444" fillOpacity="0.45" />
    <text x="406" y="188" textAnchor="middle" style={{fontSize:'10px',fontWeight:700,fill:'currentColor',opacity:0.65}}>{labels.options}</text>
    <text x="406" y="199" textAnchor="middle" style={{fontSize:'7px',fill:'currentColor',opacity:0.35}}>{labels.optionsSub}</text>

    {/* Turbo/KO — cost drag 65%, net 35% */}
    <rect x="484" y="51" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.06" />
    <rect x="484" y="128" width="44" height="42"  rx="3" fill="currentColor" fillOpacity="0.30" className="text-primary" />
    <rect x="484" y="51"  width="44" height="77"  rx="2" fill="#ef4444" fillOpacity="0.50" />
    <text x="506" y="188" textAnchor="middle" style={{fontSize:'10px',fontWeight:700,fill:'currentColor',opacity:0.65}}>{labels.turbo}</text>
    <text x="506" y="199" textAnchor="middle" style={{fontSize:'7px',fill:'currentColor',opacity:0.35}}>{labels.turboSub}</text>

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

interface HeroProps {
  broker?: string;
}

export const Hero = ({ broker }: HeroProps) => {
  const t = useTranslations('Hero') as (key: string) => string;
  const tChart = useTranslations('Chart') as (key: string) => string;

  const chartLabels = {
    net: tChart('net'),
    drag: tChart('drag'),
    sameUnderlying: tChart('same_underlying'),
    etf: tChart('etf'),
    cfd: tChart('cfd'),
    futures: tChart('futures'),
    options: tChart('options'),
    turbo: tChart('turbo'),
    etfSub: tChart('etf_sub'),
    cfdSub: tChart('cfd_sub'),
    futuresSub: tChart('futures_sub'),
    optionsSub: tChart('options_sub'),
    turboSub: tChart('turbo_sub'),
  };

  return (
    <section className="relative overflow-hidden px-4 py-16 pt-24 sm:px-6 sm:py-20 sm:pt-28 md:py-24 md:pt-32 lg:py-28 lg:pt-36">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16 xl:gap-20">

          {/* ── Text column ── */}
          <div className="order-1">
            <SlideReveal>
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
              <h1 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl">
                {t('hero_title_part1')}{' '}
                <span className="relative inline-block pb-1 text-primary">
                  {t('hero_title_part2')}
                  <span
                    className="absolute -bottom-0.5 left-0 h-[3px] w-full rounded-full bg-primary/40"
                    aria-hidden="true"
                  />
                </span>
              </h1>
            </SlideReveal>

            <FadeIn delay={200}>
              {/* Subtitle */}
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
                {broker
                  ? t('hero_subtitle_broker').replace('{broker}', broker)
                  : t('hero_subtitle')}
              </p>
            </FadeIn>

            <FadeIn delay={400}>
              {/* CTA */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button asChild size="lg" className="h-12 px-6 text-base sm:h-13 sm:px-8">
                  <Link href="/tool">{t('cta_primary')}</Link>
                </Button>
                <Button asChild variant="outline" size="default" className="h-11 px-5 text-sm sm:h-12 sm:px-6">
                  <Link href="#framework">{t('cta_secondary')}</Link>
                </Button>
              </div>

              {/* Trust line */}
              <p className="mt-5 text-xs text-muted-foreground/60">
                {t('trust')}
              </p>
            </FadeIn>
          </div>

          {/* ── Chart column ── */}
          <FadeIn delay={250} direction="right" className="order-2 w-full overflow-x-auto">
            <CostBarChart labels={chartLabels} />
          </FadeIn>

        </div>
      </div>
    </section>
  );
};
