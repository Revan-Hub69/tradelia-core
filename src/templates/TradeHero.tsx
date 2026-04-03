'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/ui/SectionContainer';

type ChartLabels = {
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
};

const CostBarChart = ({ labels }: { labels: ChartLabels }) => (
  <svg
    viewBox="0 0 600 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-auto w-full max-w-2xl"
    aria-hidden="true"
  >
    <line x1="60" y1="170" x2="580" y2="170" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />
    <line x1="60" y1="130" x2="580" y2="130" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="60" y1="90" x2="580" y2="90" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="60" y1="50" x2="580" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="60" y1="30" x2="60" y2="170" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />

    <text x="52" y="173" textAnchor="end" style={{ fontSize: '8px', fill: 'currentColor', opacity: 0.5 }}>0</text>
    <text x="52" y="133" textAnchor="end" style={{ fontSize: '8px', fill: 'currentColor', opacity: 0.5 }}>25</text>
    <text x="52" y="93" textAnchor="end" style={{ fontSize: '8px', fill: 'currentColor', opacity: 0.5 }}>50</text>
    <text x="52" y="53" textAnchor="end" style={{ fontSize: '8px', fill: 'currentColor', opacity: 0.5 }}>75</text>

    <rect x="84" y="51" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.08" />
    <rect x="84" y="65" width="44" height="105" rx="3" fill="#60A5FA" fillOpacity="0.78" />
    <rect x="84" y="51" width="44" height="14" rx="2" fill="#F97316" fillOpacity="0.9" />
    <text x="106" y="188" textAnchor="middle" style={{ fontSize: '10px', fontWeight: 700, fill: 'currentColor', opacity: 0.9 }}>{labels.etf}</text>
    <text x="106" y="199" textAnchor="middle" style={{ fontSize: '7px', fill: 'currentColor', opacity: 0.48 }}>{labels.etfSub}</text>

    <rect x="184" y="51" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.08" />
    <rect x="184" y="105" width="44" height="65" rx="3" fill="#38BDF8" fillOpacity="0.72" />
    <rect x="184" y="51" width="44" height="54" rx="2" fill="#F97316" fillOpacity="0.92" />
    <text x="206" y="188" textAnchor="middle" style={{ fontSize: '10px', fontWeight: 700, fill: 'currentColor', opacity: 0.9 }}>{labels.cfd}</text>
    <text x="206" y="199" textAnchor="middle" style={{ fontSize: '7px', fill: 'currentColor', opacity: 0.48 }}>{labels.cfdSub}</text>

    <rect x="284" y="51" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.08" />
    <rect x="284" y="72" width="44" height="98" rx="3" fill="#818CF8" fillOpacity="0.74" />
    <rect x="284" y="51" width="44" height="21" rx="2" fill="#F59E0B" fillOpacity="0.9" />
    <text x="306" y="188" textAnchor="middle" style={{ fontSize: '10px', fontWeight: 700, fill: 'currentColor', opacity: 0.9 }}>{labels.futures}</text>
    <text x="306" y="199" textAnchor="middle" style={{ fontSize: '7px', fill: 'currentColor', opacity: 0.48 }}>{labels.futuresSub}</text>

    <rect x="384" y="51" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.08" />
    <rect x="384" y="89" width="44" height="81" rx="3" fill="#A78BFA" fillOpacity="0.7" />
    <rect x="384" y="51" width="44" height="38" rx="2" fill="#FB923C" fillOpacity="0.88" />
    <text x="406" y="188" textAnchor="middle" style={{ fontSize: '10px', fontWeight: 700, fill: 'currentColor', opacity: 0.9 }}>{labels.options}</text>
    <text x="406" y="199" textAnchor="middle" style={{ fontSize: '7px', fill: 'currentColor', opacity: 0.48 }}>{labels.optionsSub}</text>

    <rect x="484" y="51" width="44" height="119" rx="3" fill="currentColor" fillOpacity="0.08" />
    <rect x="484" y="128" width="44" height="42" rx="3" fill="#94A3B8" fillOpacity="0.72" />
    <rect x="484" y="51" width="44" height="77" rx="2" fill="#EF4444" fillOpacity="0.95" />
    <text x="506" y="188" textAnchor="middle" style={{ fontSize: '10px', fontWeight: 700, fill: 'currentColor', opacity: 0.9 }}>{labels.turbo}</text>
    <text x="506" y="199" textAnchor="middle" style={{ fontSize: '7px', fill: 'currentColor', opacity: 0.48 }}>{labels.turboSub}</text>

    <rect x="500" y="14" width="9" height="9" rx="1" fill="#60A5FA" fillOpacity="0.8" />
    <text x="513" y="22" style={{ fontSize: '8px', fill: 'currentColor', opacity: 0.58 }}>{labels.net}</text>
    <rect x="500" y="28" width="9" height="9" rx="1" fill="#F97316" fillOpacity="0.9" />
    <text x="513" y="36" style={{ fontSize: '8px', fill: 'currentColor', opacity: 0.58 }}>{labels.drag}</text>

    <text x="320" y="15" textAnchor="middle" style={{ fontSize: '8px', fill: 'currentColor', opacity: 0.3, letterSpacing: '0.06em' }}>
      {labels.sameUnderlying}
    </text>
  </svg>
);

type TradeHeroProps = {
  broker?: string;
};

export const TradeHero = ({ broker }: TradeHeroProps) => {
  const t = useTranslations('TradeHero') as (key: string) => string;
  const tChart = useTranslations('Chart') as (key: string) => string;
  const tScenario = useTranslations('Scenario') as (key: string) => string;

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

  const tapeItems = [
    { label: t('tape_db_label'), value: t('tape_db_value') },
    { label: t('tape_swap_label'), value: t('tape_swap_value') },
    { label: t('tape_fee_label'), value: t('tape_fee_value') },
  ];

  const profileRows = [
    {
      label: tScenario('horizon_intraday'),
      note: t('monitor_intraday_note'),
      dominant: t('chip_spread'),
      intensity: 78,
      barClass: 'bg-sky-400',
    },
    {
      label: tScenario('horizon_multiday'),
      note: t('monitor_multiday_note'),
      dominant: t('chip_swap'),
      intensity: 64,
      barClass: 'bg-amber-400',
    },
    {
      label: tScenario('horizon_position'),
      note: t('monitor_position_note'),
      dominant: t('chip_commissions'),
      intensity: 42,
      barClass: 'bg-indigo-400',
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border/40 pb-16 pt-20 sm:pb-20 sm:pt-24 md:pb-24 md:pt-28 xl:pb-28 xl:pt-32 2xl:pb-32 2xl:pt-36">
      <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_48%),radial-gradient(circle_at_top_left,rgba(249,115,22,0.10),transparent_38%)]" />

      <SectionContainer size="wide" className="relative">
        <div className="grid items-start gap-10 xl:grid-cols-[0.9fr_1.1fr] xl:gap-16 2xl:gap-20">
          <div className="pt-2">
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground/60">
              {t('eyebrow')}
              {broker && (
                <span className="ml-2 text-muted-foreground/80">
                  |
{' '}
{broker}
                </span>
              )}
            </p>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-[4.35rem] 2xl:text-[4.85rem]">
              {t('title')}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {t('subtitle')}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {['chip_spread', 'chip_swap', 'chip_commissions'].map(key => (
                <span
                  key={key}
                  className="rounded-full border border-border/60 bg-background px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/75"
                >
                  {t(key)}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="h-12 rounded-full px-8 font-mono text-[11px] uppercase tracking-[0.16em]">
                <a href="#simulator">{t('cta')}</a>
              </Button>
              <span className="text-xs text-muted-foreground/[0.62]">{t('cta_note')}</span>
            </div>

            <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground/[0.72]">
              {t('trust')}
            </p>
          </div>

          <div className="rounded-[32px] border border-slate-800 bg-slate-950 p-5 text-slate-100 shadow-[0_30px_80px_-42px_rgba(15,23,42,0.75)] sm:p-6 xl:p-7 2xl:p-8">
            <div className="grid gap-2 sm:grid-cols-3">
              {tapeItems.map(item => (
                <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-sm text-slate-200">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[24px] border border-slate-800 bg-slate-900/[0.72] p-4 text-slate-100 sm:p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('visual_eyebrow')}</p>
              <div className="mt-4 overflow-x-auto">
                <CostBarChart labels={chartLabels} />
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-slate-800 bg-slate-900/[0.58] p-4 sm:p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('monitor_title')}</p>
              <div className="mt-4 space-y-4">
                {profileRows.map(row => (
                  <div key={row.label} className="grid gap-3 sm:grid-cols-[110px_1fr] sm:items-start">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">{row.label}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{row.dominant}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{row.dominant}</span>
                        <span className="font-mono">
{row.intensity}
%
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-slate-800">
                        <div className={`h-1.5 rounded-full ${row.barClass}`} style={{ width: `${row.intensity}%` }} />
                      </div>
                      <p className="mt-2 text-xs leading-6 text-slate-400">{row.note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-6 text-slate-500">{t('visual_note')}</p>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};
