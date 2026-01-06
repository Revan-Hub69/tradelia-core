'use client';

import { useTranslations } from '@/hooks/useTranslations';

export default function ResearchSection() {
  const { research } = useTranslations();

  const RESEARCH_ITEMS = [
    {
      key: 'overconfidence' as const,
      iconColor: 'red',
      iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
    },
    {
      key: 'disposition' as const,
      iconColor: 'orange',
      iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    {
      key: 'herding' as const,
      iconColor: 'amber',
      iconPath: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    }
  ] as const;

  interface ResearchItemProps {
    item: {
      key: 'overconfidence' | 'disposition' | 'herding';
      iconColor: string;
      iconPath: string;
    };
    data: {
      title: string;
      description: string;
      source: string;
    };
  }

  function ResearchItem({ item, data }: ResearchItemProps) {
    return (
      <article className="card-tech">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-8 h-8 bg-${item.iconColor}-50 rounded-lg flex items-center justify-center flex-shrink-0`}>
            <svg 
              className={`w-4 h-4 text-${item.iconColor}-500`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
              {data.title}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-3">
              {data.description}
            </p>
            <cite className="text-xs text-muted-foreground not-italic">
              <strong>Fonte:</strong> {data.source}
            </cite>
          </div>
        </div>
      </article>
    );
  }

  return (
    <section 
      className="section-md bg-muted/30 fade-in-section section-separator-full"
      aria-labelledby="research-title"
    >
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <header className="text-center mb-12">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
            {research.eyebrow}
          </p>
          <h2 
            id="research-title"
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground leading-tight tracking-tight mb-6"
          >
            {research.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {research.subtitle}
          </p>
        </header>
        
        <div className="space-y-6" role="list">
          {RESEARCH_ITEMS.map((item) => (
            <div key={item.key} role="listitem">
              <ResearchItem 
                item={item} 
                data={research[item.key]} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}