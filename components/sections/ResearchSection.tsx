'use client';

import { useTranslations } from '@/hooks/useTranslations';

export default function ResearchSection() {
  const { research } = useTranslations();

  const RESEARCH_ITEMS = [
    {
      key: 'overconfidence' as const,
      iconColor: 'red',
      iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z",
      sparkline: [65, 78, 82, 73, 89, 76, 73] as number[] // Fix readonly issue
    },
    {
      key: 'disposition' as const,
      iconColor: 'orange',
      iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      sparkline: [45, 52, 48, 61, 55, 58, 62] as number[]
    },
    {
      key: 'herding' as const,
      iconColor: 'amber',
      iconPath: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      sparkline: [30, 45, 52, 48, 55, 61, 58] as number[]
    }
  ];

  interface ResearchItemProps {
    item: {
      key: 'overconfidence' | 'disposition' | 'herding';
      iconColor: string;
      iconPath: string;
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
            <div className={`w-10 h-10 bg-${item.iconColor}-50 rounded-xl flex items-center justify-center flex-shrink-0`}>
              <svg 
                className={`w-5 h-5 text-${item.iconColor}-500`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
              </svg>
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
          <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Frequenza errore</span>
                <span className={`text-2xl font-bold text-${item.iconColor}-600`}>
                  {item.sparkline[item.sparkline.length - 1]}%
                </span>
              </div>
              
              {/* Simple sparkline */}
              <div className="flex items-end gap-1 h-12">
                {item.sparkline.map((value, i) => (
                  <div
                    key={i}
                    className={`flex-1 bg-${item.iconColor}-200 rounded-t`}
                    style={{ height: `${(value / Math.max(...item.sparkline)) * 100}%` }}
                  />
                ))}
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                Trend negli ultimi studi comportamentali
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
      className="section-lg bg-muted/30 fade-in-section"
      aria-labelledby="research-title"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <header className="text-center mb-16">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
            {research.eyebrow}
          </p>
          <h2 
            id="research-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground leading-tight tracking-tight mb-6"
          >
            {research.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {research.subtitle}
          </p>
        </header>
        
        <div className="space-y-16" role="list">
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