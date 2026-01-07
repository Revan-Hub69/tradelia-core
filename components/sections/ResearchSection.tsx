'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { AlertTriangleIcon, TrendingUpIcon, BrainIcon, BarChartIcon, ShieldIcon } from '@/components/icons/TradeliaIcons';

// Types
type ResearchKey = 'overconfidence' | 'fomo' | 'panicSelling' | 'disposition' | 'herding';

interface ResearchItemData {
  key: ResearchKey;
  iconColor: string;
  IconComponent: React.FC<{ className?: string; size?: number }>;
  sparkline: number[];
}

interface ResearchItemProps {
  item: ResearchItemData;
  data: {
    title: string;
    description: string;
    source: string;
  };
  index: number;
  sourceLabel: string;
  errorFrequency: string;
  behavioralTrend: string;
  behavioralStudies: string;
}

// Constants
const RESEARCH_ITEMS: ResearchItemData[] = [
  {
    key: 'overconfidence',
    iconColor: 'red',
    IconComponent: AlertTriangleIcon,
    sparkline: [65, 68, 72, 75, 77, 79, 78]
  },
  {
    key: 'fomo',
    iconColor: 'green',
    IconComponent: TrendingUpIcon,
    sparkline: [60, 63, 67, 70, 72, 74, 72]
  },
  {
    key: 'panicSelling',
    iconColor: 'blue',
    IconComponent: BrainIcon,
    sparkline: [55, 58, 62, 65, 67, 69, 68]
  },
  {
    key: 'disposition',
    iconColor: 'orange',
    IconComponent: BarChartIcon,
    sparkline: [52, 55, 58, 60, 63, 65, 65]
  },
  {
    key: 'herding',
    iconColor: 'amber',
    IconComponent: ShieldIcon,
    sparkline: [42, 46, 50, 53, 56, 58, 58]
  }
];

// Helper functions
function getIconBgClass(color: string): string {
  const map: Record<string, string> = {
    red: 'bg-red-50',
    orange: 'bg-orange-50',
    amber: 'bg-amber-50',
    green: 'bg-green-50',
    blue: 'bg-blue-50'
  };
  return map[color] || 'bg-blue-50';
}

function getIconTextClass(color: string): string {
  const map: Record<string, string> = {
    red: 'text-red-500',
    orange: 'text-orange-500',
    amber: 'text-amber-500',
    green: 'text-green-500',
    blue: 'text-blue-500'
  };
  return map[color] || 'text-blue-500';
}

function getTextClass(color: string): string {
  const map: Record<string, string> = {
    red: 'text-red-600',
    orange: 'text-orange-600',
    amber: 'text-amber-600',
    green: 'text-green-600',
    blue: 'text-blue-600'
  };
  return map[color] || 'text-blue-600';
}

function getBgClass(color: string): string {
  const map: Record<string, string> = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    amber: 'bg-amber-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500'
  };
  return map[color] || 'bg-blue-500';
}

// ResearchItem component - simplified without sparkline chart
function ResearchItem({ item, data, sourceLabel }: Omit<ResearchItemProps, 'index' | 'errorFrequency' | 'behavioralTrend' | 'behavioralStudies'> & { index: number }) {
  const isReversed = item.key === 'fomo' || item.key === 'disposition';
  
  return (
    <article className={`grid lg:grid-cols-2 gap-6 lg:gap-10 items-center ${isReversed ? 'lg:grid-flow-col-dense' : ''}`}>
      {/* Content */}
      <div className={`space-y-3 ${isReversed ? 'lg:col-start-2' : ''}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconBgClass(item.iconColor)}`}>
            <item.IconComponent className={`w-5 h-5 ${getIconTextClass(item.iconColor)}`} />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-foreground">
            {data.title}
          </h3>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {data.description}
        </p>
        
        <cite className="block text-xs text-muted-foreground not-italic pt-2 border-t border-border/30">
          <strong>{sourceLabel}</strong> {data.source}
        </cite>
      </div>

      {/* Simple percentage indicator */}
      <div className={`${isReversed ? 'lg:col-start-1' : ''}`}>
        <div className="rounded border border-border/50 bg-background p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Frequenza errore</span>
            <span className={`text-2xl font-bold ${getTextClass(item.iconColor)}`}>
              {item.sparkline.at(-1)}%
            </span>
          </div>
          <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${getBgClass(item.iconColor)}`}
              style={{ width: `${item.sparkline.at(-1)}%` }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

// Main component
export default function ResearchSection() {
  const { research } = useTranslations();

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
        <div className="space-y-12 mb-16" role="list">
          {RESEARCH_ITEMS.slice(0, 3).map((item, index) => (
            <div key={item.key} role="listitem">
              <ResearchItem 
                item={item} 
                data={research[item.key]}
                index={index}
                sourceLabel={research.sourceLabel}
              />
            </div>
          ))}
        </div>

        {/* Below-fold: Resto dei bias */}
        <div className="border-t border-border/30 pt-12">
          <div className="space-y-12" role="list">
            {RESEARCH_ITEMS.slice(3).map((item, index) => (
              <div key={item.key} role="listitem">
                <ResearchItem 
                  item={item} 
                  data={research[item.key]}
                  index={index + 3}
                  sourceLabel={research.sourceLabel}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Chart - Horizontal bars (mobile friendly) */}
        <div className="mt-20 border-t border-border/30 pt-16">
          <h3 className="text-xl font-semibold text-foreground mb-8 text-center">
            {research.comparisonTitle}
          </h3>
          <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              {/* Chart Legend - responsive grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
                {RESEARCH_ITEMS.map((item) => (
                  <div key={`legend-${item.key}`} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded flex-shrink-0 ${getBgClass(item.iconColor)}`} />
                    <span className="text-muted-foreground text-xs sm:text-sm truncate">
                      {research[item.key].title}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Horizontal Bar Chart - mobile friendly */}
              <div className="space-y-4">
                {RESEARCH_ITEMS.map((item) => (
                  <div key={`bar-${item.key}`} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground truncate max-w-[60%]">
                        {research[item.key].title}
                      </span>
                      <span className={`font-semibold ${getTextClass(item.iconColor)}`}>
                        {item.sparkline.at(-1)}%
                      </span>
                    </div>
                    <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${getBgClass(item.iconColor)}`}
                        style={{ width: `${item.sparkline.at(-1)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Source note */}
              <p className="text-xs text-muted-foreground/70 text-center pt-2 border-t border-border/30">
                {research.behavioralStudies}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
