'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { AlertTriangleIcon, TrendingUpIcon, BrainIcon, BarChartIcon, ShieldIcon, DiamondIcon } from '@/components/icons/TradeliaIcons';

export default function ResearchSection() {
  const { research } = useTranslations();

  const RESEARCH_ITEMS = [
    {
      key: 'overconfidence' as const,
      iconColor: 'red',
      IconComponent: AlertTriangleIcon,
      sparkline: [65, 68, 72, 75, 77, 79, 78] as number[]
    },
    {
      key: 'fomo' as const,
      iconColor: 'green',
      IconComponent: TrendingUpIcon,
      sparkline: [60, 63, 67, 70, 72, 74, 72] as number[]
    },
    {
      key: 'panicSelling' as const,
      iconColor: 'blue',
      IconComponent: BrainIcon,
      sparkline: [55, 58, 62, 65, 67, 69, 68] as number[]
    },
    {
      key: 'disposition' as const,
      iconColor: 'orange',
      IconComponent: BarChartIcon,
      sparkline: [52, 55, 58, 60, 63, 65, 65] as number[]
    },
    {
      key: 'herding' as const,
      iconColor: 'amber',
      IconComponent: ShieldIcon,
      sparkline: [42, 46, 50, 53, 56, 58, 58] as number[]
    }
  ];

  interface ResearchItemProps {
    item: {
      key: 'overconfidence' | 'fomo' | 'panicSelling' | 'disposition' | 'herding';
      iconColor: string;
      IconComponent: React.FC<{ className?: string; size?: number }>;
      sparkline: number[];
    };
    data: {
      title: string;
      description: string;
      source: string;
    };
    index: number;
  }

  function ResearchItem({ item, data, index }: ResearchItemProps) {
    const isReversed = index % 2 === 1;
    
    return (
      <article className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${isReversed ? 'lg:grid-flow-col-dense' : ''}`}>
        {/* Content */}
        <div className={`space-y-4 ${isReversed ? 'lg:col-start-2' : ''}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              item.iconColor === 'red' ? 'bg-red-50' : 
              item.iconColor === 'orange' ? 'bg-orange-50' : 
              item.iconColor === 'amber' ? 'bg-amber-50' :
              item.iconColor === 'green' ? 'bg-green-50' :
              'bg-blue-50'
            }`}>
              <item.IconComponent 
                className={`w-5 h-5 ${
                  item.iconColor === 'red' ? 'text-red-500' : 
                  item.iconColor === 'orange' ? 'text-orange-500' : 
                  item.iconColor === 'amber' ? 'text-amber-500' :
                  item.iconColor === 'green' ? 'text-green-500' :
                  'text-blue-500'
                }`}
              />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">
              {data.title}
            </h3>
          </div>
          
          <p className="text-base text-muted-foreground leading-relaxed">
            {data.description}
          </p>
          
          <div className="pt-2 border-t border-border/30">
            <cite className="text-xs text-muted-foreground not-italic">
              <strong>{research.sourceLabel}</strong> {data.source}
            </cite>
          </div>
        </div>

        {/* Visual/Sparkline */}
        <div className={`${isReversed ? 'lg:col-start-1' : ''}`}>
          <div className="group bg-background/90 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-lg hover:border-border transition-all duration-150 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{research.errorFrequency}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-3xl font-bold ${
                    item.iconColor === 'red' ? 'text-red-600' : 
                    item.iconColor === 'orange' ? 'text-orange-600' : 
                    item.iconColor === 'amber' ? 'text-amber-600' :
                    item.iconColor === 'green' ? 'text-green-600' :
                    'text-blue-600'
                  }`}>
                    {item.sparkline.at(-1)}%
                  </span>
                  <div className={`w-2 h-2 rounded-full ${
                    item.iconColor === 'red' ? 'bg-red-500' : 
                    item.iconColor === 'orange' ? 'bg-orange-500' : 
                    item.iconColor === 'amber' ? 'bg-amber-500' :
                    item.iconColor === 'green' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`} />
                </div>
              </div>
              
              {/* Enhanced sparkline with gradient */}
              <div className="relative">
                <div className="flex items-end gap-1 h-16 bg-gradient-to-t from-muted/20 to-transparent rounded p-2">
                  {item.sparkline.map((value, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t transition-all duration-150 hover:opacity-80 sparkline-bar ${
                        item.iconColor === 'red' ? 'bg-gradient-to-t from-red-500 to-red-300' : 
                        item.iconColor === 'orange' ? 'bg-gradient-to-t from-orange-500 to-orange-300' : 
                        item.iconColor === 'amber' ? 'bg-gradient-to-t from-amber-500 to-amber-300' :
                        item.iconColor === 'green' ? 'bg-gradient-to-t from-green-500 to-green-300' :
                        'bg-gradient-to-t from-blue-500 to-blue-300'
                      }`}
                      style={{ 
                        height: `${(value / Math.max(...item.sparkline)) * 100}%`,
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent pointer-events-none" />
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{research.behavioralTrend}</span>
                <span className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                  <span>{research.behavioralStudies}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <section 
      id="research"
      className="section-lg bg-background fade-in-section border-b border-border/30"
      aria-labelledby="research-title"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <header className="text-center mb-16">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
            {research.eyebrow}
          </p>
          <h2 
            id="research-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground leading-tight tracking-tight mb-6 text-center"
          >
            {research.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {research.subtitle}
          </p>
        </header>
        
        {/* Above-fold: 3 errori principali */}
        <div className="space-y-16 fade-in-stagger mb-20" role="list">
          {RESEARCH_ITEMS.slice(0, 3).map((item, index) => (
            <div key={item.key} role="listitem">
              <ResearchItem 
                item={item} 
                data={research[item.key]}
                index={index}
              />
            </div>
          ))}
        </div>

        {/* Below-fold: Resto dei bias */}
        <div className="border-t border-border/30 pt-16">
          <div className="space-y-16" role="list">
            {RESEARCH_ITEMS.slice(3).map((item, index) => (
              <div key={item.key} role="listitem">
                <ResearchItem 
                  item={item} 
                  data={research[item.key]}
                  index={index + 3}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Chart - Tutti gli errori a confronto */}
        <div className="mt-20 border-t border-border/30 pt-16">
          <h3 className="text-xl font-semibold text-foreground mb-8 text-center">
            {research.comparisonTitle}
          </h3>
          <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-xl p-8">
            <div className="space-y-6">
              {/* Chart Legend */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-muted-foreground">Leveraggio</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500" />
                  <span className="text-muted-foreground">FOMO</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-muted-foreground">Panic Selling</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-orange-500" />
                  <span className="text-muted-foreground">Ordini</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-500" />
                  <span className="text-muted-foreground">Scam</span>
                </div>
              </div>
              
              {/* Grouped Bar Chart */}
              <div className="relative h-56 flex items-end justify-center gap-3 px-4">
                {RESEARCH_ITEMS.map((item) => (
                  <div key={item.key} className="flex flex-col items-center gap-2">
                    <div className="flex gap-1 items-end h-44">
                      {/* Previous months */}
                      {item.sparkline.slice(0, -1).map((value, j) => (
                        <div
                          key={j}
                          className={`w-3 rounded-t transition-all duration-150 ${
                            item.iconColor === 'red' ? 'bg-red-300' : 
                            item.iconColor === 'orange' ? 'bg-orange-300' : 
                            item.iconColor === 'amber' ? 'bg-amber-300' :
                            item.iconColor === 'green' ? 'bg-green-300' :
                            'bg-blue-300'
                          }`}
                          style={{ height: `${(value / 100) * 176}px` }}
                        />
                      ))}
                      {/* Current month - taller and highlighted */}
                      <div
                        className={`w-5 rounded-t transition-all duration-300 ${
                          item.iconColor === 'red' ? 'bg-red-500 shadow-lg shadow-red-500/20' : 
                          item.iconColor === 'orange' ? 'bg-orange-500 shadow-lg shadow-orange-500/20' : 
                          item.iconColor === 'amber' ? 'bg-amber-500 shadow-lg shadow-amber-500/20' :
                          item.iconColor === 'green' ? 'bg-green-500 shadow-lg shadow-green-500/20' :
                          'bg-blue-500 shadow-lg shadow-blue-500/20'
                        }`}
                        style={{ height: `${(item.sparkline.at(-1) ?? 0) / 100 * 176}px` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {item.sparkline.at(-1)}%
                    </span>
                    <span className="text-xs text-muted-foreground/70 max-w-20 text-center leading-tight">
                      {research[item.key].title}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* X-axis labels */}
              <div className="flex justify-center gap-3 text-xs text-muted-foreground/50 px-4">
                <span>G</span>
                <span>F</span>
                <span>M</span>
                <span>A</span>
                <span>M</span>
                <span>G</span>
                <span className="font-semibold text-foreground">L</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}