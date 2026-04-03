'use client';

import { useTranslations } from 'next-intl';

import { FadeIn, SlideReveal } from '@/components/ui/scroll-animations';

/** Mock data for instruments */
const instruments = [
  { key: 'etf', cost: 21, efficiency: 92 },
  { key: 'cfd', cost: 57, efficiency: 45 },
  { key: 'futures', cost: 25, efficiency: 85 },
  { key: 'options', cost: 49, efficiency: 58 },
  { key: 'certificates', cost: 52, efficiency: 52 },
];

/** Mock data for top brokers */
const topBrokers = [
  { name: 'Broker A', cost: 25, efficiency: 'Alta', color: '#22C55E' },
  { name: 'Broker B', cost: 31, efficiency: 'Alta', color: '#22C55E' },
  { name: 'Broker C', cost: 57, efficiency: 'Media-alta', color: '#EAB308' },
];

export const AnalysisSection = () => {
  const t = useTranslations('Analysis') as (key: string) => string;

  // Generate radar chart points
  const generateRadarPoints = () => {
    const centerX = 140;
    const centerY = 100;
    const radius = 70;
    const instrumentsCount = instruments.length;
    
    return instruments.map((inst, i) => {
      const angle = (2 * Math.PI * i) / instrumentsCount - Math.PI / 2;
      const efficiencyNorm = inst.efficiency / 100;
      const x = centerX + radius * Math.cos(angle) * efficiencyNorm;
      const y = centerY + radius * Math.sin(angle) * efficiencyNorm;
      return { x, y, label: inst.key };
    });
  };

  const radarPoints = generateRadarPoints();

  return (
    <section className="border-t border-border/40 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Section header with step indicator */}
        <div className="mb-8 flex items-center gap-3">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
            2
          </span>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground/50">
            {t('section_eyebrow')}
          </p>
        </div>

        <h2 className="mb-3 text-xl font-semibold tracking-tight sm:text-2xl">
          {t('section_title')}
        </h2>
        <p className="mb-10 max-w-xl text-sm text-muted-foreground">
          {t('section_intro')}
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Radar/Heatmap chart */}
          <SlideReveal>
            <div className="flex flex-col gap-3 rounded-lg border border-border/50 bg-card p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
                {t('chart_title')}
              </p>
              
              <svg
                viewBox="0 0 280 200"
                className="h-auto w-full"
                aria-hidden="true"
              >
                {/* Background circles */}
                {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
                  <circle
                    key={i}
                    cx="140"
                    cy="100"
                    r={70 * ratio}
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.08"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Axis lines */}
                {instruments.map((_, i) => {
                  const angle = (2 * Math.PI * i) / instruments.length - Math.PI / 2;
                  const x = 140 + 70 * Math.cos(angle);
                  const y = 100 + 70 * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1="140"
                      y1="100"
                      x2={x}
                      y2={y}
                      stroke="currentColor"
                      strokeOpacity="0.1"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Data polygon */}
                <polygon
                  points={radarPoints.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="currentColor"
                  fillOpacity="0.15"
                  stroke="var(--primary)"
                  strokeWidth="2"
                />

                {/* Data points */}
                {radarPoints.map((point, i) => (
                  <circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r="6"
                    fill="var(--primary)"
                    stroke="white"
                    strokeWidth="2"
                  />
                ))}

                {/* Labels */}
                {instruments.map((inst, i) => {
                  const angle = (2 * Math.PI * i) / instruments.length - Math.PI / 2;
                  const x = 140 + 85 * Math.cos(angle);
                  const y = 100 + 85 * Math.sin(angle);
                  return (
                    <text
                      key={inst.key}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: '11px', fill: 'currentColor', opacity: 0.6 }}
                    >
                      {t(`instrument_${inst.key}`)}
                    </text>
                  );
                })}

                {/* Center label */}
                <text
                  x="140"
                  y="100"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: '10px', fill: 'currentColor', opacity: 0.4 }}
                >
                  {t('chart_center')}
                </text>
              </svg>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  {t('legend_high')}
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-yellow-500" />
                  {t('legend_medium')}
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  {t('legend_low')}
                </div>
              </div>
            </div>
          </SlideReveal>

          {/* Right: Broker cards */}
          <FadeIn delay={200}>
            <div className="flex flex-col gap-3 rounded-lg border border-border/50 bg-card p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
                {t('brokers_title')}
              </p>

              <div className="flex flex-col gap-3">
                {topBrokers.map((broker, i) => (
                  <div
                    key={broker.name}
                    className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium">{broker.name}</p>
                        <p className="text-xs text-muted-foreground">
                          €{broker.cost} {t('broker_cost')}
                        </p>
                      </div>
                    </div>
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: `${broker.color}15`,
                        color: broker.color,
                      }}
                    >
                      {broker.efficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};