'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { AlertTriangleIcon, TrendingUpIcon, BrainIcon, BarChartIcon, ShieldIcon } from '@/components/icons/TradeliaIcons';

export default function ResearchSection() {
  const { research } = useTranslations();

  const RESEARCH_ITEMS = [
    {
      key: 'overconfidence' as const,
      iconColor: 'red',
      IconComponent: AlertTriangleIcon,
      percentage: 78
    },
    {
      key: 'fomo' as const,
      iconColor: 'green',
      IconComponent: TrendingUpIcon,
      percentage: 72
    },
    {
      key: 'panicSelling' as const,
      iconColor: 'blue',
      IconComponent: BrainIcon,
      percentage: 68
    },
    {
      key: 'disposition' as const,
      iconColor: 'orange',
      IconComponent: BarChartIcon,
      percentage: 65
    },
    {
      key: 'herding' as const,
      iconColor: 'amber',
      IconComponent: ShieldIcon,
      percentage: 58
    }
  ];

  const getColorClasses = (color: string) => ({
    bg: color === 'red' ? 'bg-red-50' : 
        color === 'orange' ? 'bg-orange-50' : 
        color === 'amber' ? 'bg-amber-50' :
        color === 'green' ? 'bg-green-50' : 'bg-blue-50',
    text: color === 'red' ? 'text-red-600' : 
          color === 'orange' ? 'text-orange-600' : 
          color === 'amber' ? 'text-amber-600' :
          color === 'green' ? 'text-green-600' : 'text-blue-600',
    icon: color === 'red' ? 'text-red-500' : 
          color === 'orange' ? 'text-orange-500' : 
          color === 'amber' ? 'text-amber-500' :
          color === 'green' ? 'text-green-500' : 'text-blue-500',
    bar: color === 'red' ? 'bg-red-500' : 
         color === 'orange' ? 'bg-orange-500' : 
         color === 'amber' ? 'bg-amber-500' :
         color === 'green' ? 'bg-green-500' : 'bg-blue-500',
  });

  return (
    <section 
      id="research"
      className="section-lg bg-background fade-in-section border-b border-border/30"
      aria-labelledby="research-title"
    >
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <header className="text-center mb-12">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
            {research.eyebrow}
          </p>
          <h2 
            id="research-title"
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground leading-tight mb-4"
            style={{ letterSpacing: '-0.01em' }}
          >
            {research.title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {research.subtitle}
          </p>
        </header>
        
        {/* Research Items - Stacked cards */}
        <div className="space-y-6" role="list">
          {RESEARCH_ITEMS.map((item) => {
            const colors = getColorClasses(item.iconColor);
            const data = research[item.key];
            
            return (
              <article 
                key={item.key} 
                className="rounded border border-border/50 bg-background p-5 card-interactive"
                role="listitem"
              >
                <div className="space-y-4">
                  {/* Header with icon and title */}
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                      <item.IconComponent className={`w-4 h-4 ${colors.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-foreground">
                        {data.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {data.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Simple progress bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{research.errorFrequency}</span>
                      <span className={`font-semibold ${colors.text}`}>{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${colors.bar}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Source */}
                  <div className="pt-3 border-t border-border/30">
                    <cite className="text-xs text-muted-foreground not-italic">
                      <strong>{research.sourceLabel}</strong> {data.source}
                    </cite>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
