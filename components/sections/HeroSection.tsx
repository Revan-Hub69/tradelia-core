'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { useDashboardModal } from '@/contexts/DashboardModalContext';
import { 
  CheckIcon, 
  ShieldIcon, 
  AlertTriangleIcon,
  DashboardIcon
} from '@/components/icons/TradeliaIcons';

export default function HeroSection() {
  const { hero } = useTranslations();
  const { openModal } = useDashboardModal();

  return (
    <section 
      id="hero"
      className="section-lg bg-background relative"
      aria-labelledby="hero-title"
    >
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        {/* Content - Mobile first, stacked layout */}
        <div className="space-y-10">
          
          {/* Copy Section */}
          <div className="space-y-6 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Strumento educativo
            </p>
            
            <h1 
              id="hero-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              {hero.title}{' '}
              <span className="text-primary">{hero.titleHighlight}</span>
            </h1>
            
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {hero.description}
            </p>

            {/* Trust features - horizontal on mobile */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              {hero.features.map((feature) => (
                <div key={feature} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-4 text-center">
            <button 
              onClick={() => openModal()}
              className="h-10 px-6 text-sm font-medium rounded bg-foreground text-background hover:bg-foreground/90 transition-colors duration-150 focus:ring-2 focus:ring-primary/60 focus:ring-offset-2"
              aria-label={hero.cta}
            >
              {hero.cta}
            </button>

            {/* Micro trust badges */}
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckIcon className="w-3 h-3 text-primary" />
                <span>{hero.trustBadges.verified}</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldIcon className="w-3 h-3 text-primary" />
                <span>{hero.trustBadges.specs}</span>
              </div>
            </div>
          </div>

          {/* Dashboard Preview - Simplified for mobile */}
          <div className="rounded border-2 border-border bg-background p-5 shadow-sm">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DashboardIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{hero.dashboard.title}</span>
                </div>
                <div className="flex gap-1" aria-hidden="true">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                </div>
              </div>

              {/* KPI cards - responsive grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="p-3 rounded border border-red-200 bg-red-50 text-center">
                  <div className="text-lg sm:text-xl font-bold text-red-700">73%</div>
                  <div className="text-[10px] sm:text-xs text-red-700 leading-tight">{hero.dashboard.metrics.commonErrors}</div>
                </div>
                <div className="p-3 rounded border border-amber-200 bg-amber-50 text-center">
                  <div className="text-lg sm:text-xl font-bold text-amber-700">3</div>
                  <div className="text-[10px] sm:text-xs text-amber-700 leading-tight">{hero.dashboard.metrics.activeRisks}</div>
                </div>
                <div className="p-3 rounded border border-green-200 bg-green-50 text-center">
                  <div className="text-lg sm:text-xl font-bold text-green-700">12</div>
                  <div className="text-[10px] sm:text-xs text-green-700 leading-tight">{hero.dashboard.metrics.academicSources}</div>
                </div>
              </div>

              {/* Alert - simplified */}
              <div className="rounded border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangleIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-amber-800">{hero.dashboard.alert.title}</div>
                    <div className="text-[10px] text-amber-700 mt-0.5">{hero.dashboard.alert.description}</div>
                  </div>
                </div>
              </div>

              {/* Source */}
              <div className="text-[10px] text-muted-foreground border-t border-border/50 pt-3 flex items-center gap-1">
                <CheckIcon className="w-3 h-3 text-primary" />
                <span>{hero.dashboard.source}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}