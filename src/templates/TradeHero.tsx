'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

const CostBarChart = () => (
  <svg
    viewBox="0 0 520 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-auto w-full max-w-2xl"
    aria-hidden="true"
  >
    {/* Background grid */}
    <line x1="60" y1="160" x2="500" y2="160" stroke="currentColor" strokeOpacity="0.07" strokeWidth="1" />
    <line x1="60" y1="120" x2="500" y2="120" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="60" y1="80" x2="500" y2="80" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="60" y1="40" x2="500" y2="40" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="60" y1="20" x2="60" y2="160" stroke="currentColor" strokeOpacity="0.07" strokeWidth="1" />

    {/* Y labels */}
    <text x="52" y="163" textAnchor="end" style={{fontSize:'8px',fill:'currentColor',opacity:0.25}}>0</text>
    <text x="52" y="123" textAnchor="end" style={{fontSize:'8px',fill:'currentColor',opacity:0.25}}>25</text>
    <text x="52" y="83" textAnchor="end" style={{fontSize:'8px',fill:'currentColor',opacity:0.25}}>50</text>
    <text x="52" y="43" textAnchor="end" style={{fontSize:'8px',fill:'currentColor',opacity:0.25}}>75</text>

    {/* ── ETF ── cost drag 12%, net 88% */}
    <rect x="84"  y="41" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.08" />
    <rect x="84"  y="55" width="44" height="105" rx="3" fill="currentColor" fillOpacity="0.65" className="text-primary" />
    <rect x="84"  y="41" width="44" height="14"  rx="2" fill="#ef4444" fillOpacity="0.5" />
    <text x="106" y="178" textAnchor="middle" style={{fontSize:'10px',fontWeight:700,fill:'currentColor',opacity:0.6}}>ETF</text>
    <text x="106" y="189" textAnchor="middle" style={{fontSize:'7px',fill:'currentColor',opacity:0.3}}>TER 0.20%</text>

    {/* ── CFD ── cost drag 45%, net 55% */}
    <rect x="174" y="41" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.08" />
    <rect x="174" y="95" width="44" height="65"  rx="3" fill="currentColor" fillOpacity="0.5" className="text-primary" />
    <rect x="174" y="41" width="44" height="54"  rx="2" fill="#ef4444" fillOpacity="0.5" />
    <text x="196" y="178" textAnchor="middle" style={{fontSize:'10px',fontWeight:700,fill:'currentColor',opacity:0.6}}>CFD</text>
    <text x="196" y="189" textAnchor="middle" style={{fontSize:'7px',fill:'currentColor',opacity:0.3}}>spread+swap</text>

    {/* ── Futures ── cost drag 18%, net 82% */}
    <rect x="264" y="41" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.08" />
    <rect x="264" y="62" width="44" height="98"  rx="3" fill="currentColor" fillOpacity="0.60" className="text-primary" />
    <rect x="264" y="41" width="44" height="21"  rx="2" fill="#ef4444" fillOpacity="0.5" />
    <text x="286" y="178" textAnchor="middle" style={{fontSize:'10px',fontWeight:700,fill:'currentColor',opacity:0.6}}>Futures</text>
    <text x="286" y="189" textAnchor="middle" style={{fontSize:'7px',fill:'currentColor',opacity:0.3}}>rollover</text>

    {/* ── Options ── cost drag 35%, net 65% */}
    <rect x="354" y="41" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.08" />
    <rect x="354" y="79" width="44" height="81"  rx="3" fill="currentColor" fillOpacity="0.45" className="text-primary" />
    <rect x="354" y="41" width="44" height="38"  rx="2" fill="#ef4444" fillOpacity="0.5" />
    <text x="376" y="178" textAnchor="middle" style={{fontSize:'10px',fontWeight:700,fill:'currentColor',opacity:0.6}}>Options</text>
    <text x="376" y="189" textAnchor="middle" style={{fontSize:'7px',fill:'currentColor',opacity:0.3}}>theta+comm.</text>

    {/* Legend */}
    <rect x="448" y="72" width="9" height="9" rx="1" fill="currentColor" fillOpacity="0.6" className="text-primary" />
    <text x="461" y="80" style={{fontSize:'8px',fill:'currentColor',opacity:0.4}}>Rendimento netto</text>
    <rect x="448" y="88" width="9" height="9" rx="1" fill="#ef4444" fillOpacity="0.5" />
    <text x="461" y="96" style={{fontSize:'8px',fill:'currentColor',opacity:0.4}}>Cost drag</text>

    {/* Same underlying label */}
    <text x="290" y="14" textAnchor="middle" style={{fontSize:'8px',fill:'currentColor',opacity:0.2,letterSpacing:'0.05em'}}>STESSO SOTTOSTANTE — EFFICIENZA DIVERSA</text>
  </svg>
);

export const TradeHero = () => {
  const t = useTranslations('TradeHero') as (key: string) => string;

  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Eyebrow */}
        <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
          {t('eyebrow')}
        </p>

        {/* H1 */}
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {t('title')}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t('subtitle')}
        </p>

        {/* SVG */}
        <div className="mt-10 overflow-x-auto">
          <CostBarChart />
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button asChild size="lg" className="h-12 px-8 text-base font-semibold">
            <Link href="/tool">{t('cta')}</Link>
          </Button>
          <span className="text-xs text-muted-foreground/50">{t('cta_note')}</span>
        </div>

        {/* Trust bar */}
        <p className="mt-6 text-xs text-muted-foreground/40">
          {t('trust')}
        </p>
      </div>
    </section>
  );
};
