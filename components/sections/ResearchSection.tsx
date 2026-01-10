'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { useEffect, useRef, useState } from 'react';
import { AlertTriangleIcon, TrendingUpIcon, BrainIcon, BarChartIcon, ShieldIcon } from '@/components/icons/TradeliaIcons';

// Types
type ResearchKey = 'overconfidence' | 'fomo' | 'panicSelling' | 'disposition' | 'herding';

interface ResearchItemData {
  key: ResearchKey;
  iconColor: string;
  IconComponent: React.FC<{ className?: string; size?: number }>;
  sparkline: number[];
}

// Constants
const RESEARCH_ITEMS: ResearchItemData[] = [
  { key: 'overconfidence', iconColor: 'red', IconComponent: AlertTriangleIcon, sparkline: [65, 68, 72, 75, 77, 79, 78] },
  { key: 'fomo', iconColor: 'green', IconComponent: TrendingUpIcon, sparkline: [60, 63, 67, 70, 72, 74, 72] },
  { key: 'panicSelling', iconColor: 'blue', IconComponent: BrainIcon, sparkline: [55, 58, 62, 65, 67, 69, 68] },
  { key: 'disposition', iconColor: 'orange', IconComponent: BarChartIcon, sparkline: [52, 55, 58, 60, 63, 65, 65] },
  { key: 'herding', iconColor: 'amber', IconComponent: ShieldIcon, sparkline: [42, 46, 50, 53, 56, 58, 58] }
];

// Helper functions - Using semantic tokens
function getIconBgClass(color: string): string {
  const map: Record<string, string> = { 
    red: 'icon-bg-error', 
    orange: 'icon-bg-warning', 
    amber: 'icon-bg-warning', 
    green: 'icon-bg-success', 
    blue: 'icon-bg-primary' 
  };
  return map[color] || 'icon-bg-primary';
}

function getIconTextClass(color: string): string {
  const map: Record<string, string> = { 
    red: 'text-error', 
    orange: 'text-warning', 
    amber: 'text-warning', 
    green: 'text-success', 
    blue: 'text-primary' 
  };
  return map[color] || 'text-primary';
}

function getTextClass(color: string): string {
  const map: Record<string, string> = { 
    red: 'text-error', 
    orange: 'text-warning', 
    amber: 'text-warning', 
    green: 'text-success', 
    blue: 'text-primary' 
  };
  return map[color] || 'text-primary';
}

function getBgClass(color: string): string {
  const map: Record<string, string> = { 
    red: 'bg-error', 
    orange: 'bg-warning', 
    amber: 'bg-warning', 
    green: 'bg-success', 
    blue: 'bg-primary' 
  };
  return map[color] || 'bg-primary';
}

function getStrokeClass(color: string): string {
  const map: Record<string, string> = { 
    red: 'stroke-error', 
    orange: 'stroke-warning', 
    amber: 'stroke-warning', 
    green: 'stroke-success', 
    blue: 'stroke-primary' 
  };
  return map[color] || 'stroke-primary';
}

// Circular gauge component
function CircularGauge({ percentage, color, animate }: { percentage: number; color: string; animate: boolean }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          className="stroke-muted/30"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          className={`${getStrokeClass(color)} transition-all duration-1000 ease-out`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? offset : circumference}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xl font-bold ${getTextClass(color)}`}>
          {percentage}%
        </span>
      </div>
    </div>
  );
}

// Hook for viewport animation
function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  
  return { ref, isInView };
}

// ResearchItem component with circular gauge
function ResearchItem({ item, data, sourceLabel }: { 
  item: ResearchItemData; 
  data: { title: string; description: string; source: string }; 
  sourceLabel: string;
}) {
  const { ref, isInView } = useInView();
  const isReversed = item.key === 'fomo' || item.key === 'disposition';
  const percentage = item.sparkline.at(-1) ?? 0;
  
  return (
    <article 
      ref={ref}
      className={`grid lg:grid-cols-2 gap-6 lg:gap-10 items-center ${isReversed ? 'lg:grid-flow-col-dense' : ''}`}
    >
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

      {/* Circular gauge */}
      <div className={`${isReversed ? 'lg:col-start-1' : ''}`}>
        {/* Research item cards - 2026 Cognitive Design */}
        <div className="card-2026 rounded border border-border/50 p-4">
          <p className="text-xs text-muted-foreground text-center mb-3">Frequenza errore</p>
          <CircularGauge percentage={percentage} color={item.iconColor} animate={isInView} />
        </div>
      </div>
    </article>
  );
}

// Animated bar for comparison chart
function AnimatedBar({ percentage, color, isInView }: { percentage: number; color: string; isInView: boolean }) {
  return (
    <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-700 ease-out ${getBgClass(color)}`}
        style={{ width: isInView ? `${percentage}%` : '0%' }}
      />
    </div>
  );
}

// Main component
export default function ResearchSection() {
  const { research } = useTranslations();
  const comparisonRef = useRef<HTMLDivElement>(null);
  const [comparisonInView, setComparisonInView] = useState(false);
  
  useEffect(() => {
    const element = comparisonRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setComparisonInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="research"
      className="section-lg section-frame section-breathing-lg fade-in-section"
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
        
        {/* Above-fold: 3 errori principali */}
        <div className="space-y-12 mb-16" role="list">
          {RESEARCH_ITEMS.slice(0, 3).map((item) => (
            <div key={item.key} role="listitem">
              <ResearchItem 
                item={item} 
                data={research[item.key]}
                sourceLabel={research.sourceLabel}
              />
            </div>
          ))}
        </div>

        {/* Below-fold: Resto dei bias - Section divider */}
        <div className="section-divider">
          <div className="space-y-12" role="list">
            {RESEARCH_ITEMS.slice(3).map((item) => (
              <div key={item.key} role="listitem">
                <ResearchItem 
                  item={item} 
                  data={research[item.key]}
                  sourceLabel={research.sourceLabel}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Chart with viewport animation - Section divider */}
        <div ref={comparisonRef} className="section-divider mt-20">
          <h3 className="text-xl font-semibold text-foreground mb-8 text-center">
            {research.comparisonTitle}
          </h3>
          <div className="card-2026 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              {/* Chart Legend */}
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
              
              {/* Animated Horizontal Bars */}
              <div className="space-y-4">
                {RESEARCH_ITEMS.map((item, index) => (
                  <div 
                    key={`bar-${item.key}`} 
                    className="space-y-1"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground truncate max-w-[60%]">
                        {research[item.key].title}
                      </span>
                      <span className={`font-semibold ${getTextClass(item.iconColor)}`}>
                        {item.sparkline.at(-1)}%
                      </span>
                    </div>
                    <AnimatedBar 
                      percentage={item.sparkline.at(-1) ?? 0} 
                      color={item.iconColor} 
                      isInView={comparisonInView}
                    />
                  </div>
                ))}
              </div>
              
              {/* Source note - Section divider */}
              <p className="text-xs text-muted-foreground/70 text-center section-divider">
                {research.behavioralStudies}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
