'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { AlertTriangleIcon, TrendingUpIcon, BrainIcon, ResearchIcon } from '@/components/icons/TradeliaIcons';

export default function ResearchSection() {
  const { research, hero } = useTranslations();

  const RESEARCH_ITEMS = [
    {
      key: 'overconfidence' as const,
      iconColor: 'red',
      IconComponent: AlertTriangleIcon,
      sparkline: [65, 78, 82, 73, 89, 76, 73] as number[] // Fix readonly issue
    },
    {
      key: 'disposition' as const,
      iconColor: 'orange',
      IconComponent: TrendingUpIcon,
      sparkline: [45, 52, 48, 61, 55, 58, 62] as number[]
    },
    {
      key: 'herding' as const,
      iconColor: 'amber',
      IconComponent: BrainIcon,
      sparkline: [30, 45, 52, 48, 55, 61, 58] as number[]
    }
  ];

  interface ResearchItemProps {
    item: {
      key: 'overconfidence' | 'disposition' | 'herding';
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
              'bg-amber-50'
            }`}>
              <item.IconComponent 
                className={`w-5 h-5 ${
                  item.iconColor === 'red' ? 'text-red-500' : 
                  item.iconColor === 'orange' ? 'text-orange-500' : 
                  'text-amber-500'
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
              <strong>Fonte:</strong> {data.source}
            </cite>
          </div>
        </div>

        {/* Visual/Sparkline */}
        <div className={`${isReversed ? 'lg:col-start-1' : ''}`}>
          <div className="group bg-background/90 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-lg hover:border-border transition-all duration-300 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Frequenza errore</span>
                <div className="flex items-center gap-2">
                  <span className={`text-3xl font-bold ${
                    item.iconColor === 'red' ? 'text-red-600' : 
                    item.iconColor === 'orange' ? 'text-orange-600' : 
                    'text-amber-600'
                  }`}>
                    {item.sparkline[item.sparkline.length - 1]}%
                  </span>
                  <div className={`w-2 h-2 rounded-full ${
                    item.iconColor === 'red' ? 'bg-red-500' : 
                    item.iconColor === 'orange' ? 'bg-orange-500' : 
                    'bg-amber-500'
                  } animate-pulse`} />
                </div>
              </div>
              
              {/* Enhanced sparkline with gradient */}
              <div className="relative">
                <div className="flex items-end gap-1 h-16 bg-gradient-to-t from-muted/20 to-transparent rounded p-2">
                  {item.sparkline.map((value, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t transition-all duration-500 hover:opacity-80 sparkline-bar ${
                        item.iconColor === 'red' ? 'bg-gradient-to-t from-red-500 to-red-300' : 
                        item.iconColor === 'orange' ? 'bg-gradient-to-t from-orange-500 to-orange-300' : 
                        'bg-gradient-to-t from-amber-500 to-amber-300'
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
                <span>Tendenza comportamentale</span>
                <span className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                  <span>Studi comportamentali</span>
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
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground leading-tight tracking-tight mb-6 flex items-center gap-3"
          >
            <ResearchIcon className="w-8 h-8 text-primary flex-shrink-0" />
            {research.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {research.subtitle}
          </p>
        </header>
        
        <div className="space-y-16 fade-in-stagger" role="list">
          {RESEARCH_ITEMS.map((item, index) => (
            <div key={item.key} role="listitem">
              <ResearchItem 
                item={item} 
                data={research[item.key]}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}