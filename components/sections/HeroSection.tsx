'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { useDashboardModal } from '@/contexts/DashboardModalContext';
import { 
  ArrowRightIcon, 
  PlayIcon, 
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
      className="section-lg bg-gradient-to-br from-background via-background to-muted/20 pattern-geo-premium relative overflow-hidden"
    >
      {/* Premium overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Copy & CTA */}
          <div className="space-y-8 lg:pr-8">
            {/* Text overlay background */}
            <div className="relative">
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-2xl -m-4 p-4" />
              <div className="relative space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
                  {hero.title}{' '}
                  <span className="text-primary relative">
                    {hero.titleHighlight}
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary/60 to-primary/20 rounded-full" />
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl font-semibold">
                  Dashboard guidata per esplorare le crypto senza fare gli{' '}
                  <span className="text-foreground relative">
                    errori più costosi
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/60 rounded-full" />
                  </span>
                  .
                </p>

                {/* Trust metrics */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {hero.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={openModal}
                  className="btn-tech-premium group"
                >
                  <span>{hero.cta}</span>
                  <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
                
                <button className="btn-secondary-premium">
                  <PlayIcon className="w-4 h-4 mr-2" />
                  {hero.ctaSecondary}
                </button>
              </div>

              {/* Micro trust */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative lg:pl-8">
            <div className="relative">
              {/* Main dashboard card */}
              <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-2xl p-6 transform hover:scale-[1.02] transition-all duration-500">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DashboardIcon className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">{hero.dashboard.title}</h3>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    </div>
                  </div>

                  {/* Risk cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="kpi-card bg-red-50 border-red-200">
                      <div className="text-2xl font-bold text-red-600">73%</div>
                      <div className="text-xs text-red-600/80">{hero.dashboard.metrics.commonErrors}</div>
                    </div>
                    <div className="kpi-card bg-amber-50 border-amber-200">
                      <div className="text-2xl font-bold text-amber-600">3</div>
                      <div className="text-xs text-amber-600/80">{hero.dashboard.metrics.activeRisks}</div>
                    </div>
                    <div className="kpi-card bg-green-50 border-green-200">
                      <div className="text-2xl font-bold text-green-600">12</div>
                      <div className="text-xs text-green-600/80">{hero.dashboard.metrics.academicSources}</div>
                    </div>
                  </div>

                  {/* Alert example */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangleIcon className="w-3 h-3 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-amber-800">{hero.dashboard.alert.title}</div>
                        <div className="text-xs text-amber-700 mt-1">{hero.dashboard.alert.description}</div>
                      </div>
                    </div>
                  </div>

                  {/* Research source */}
                  <div className="text-xs text-muted-foreground border-t border-border/30 pt-4">
                    <div className="flex items-center gap-2">
                      <CheckIcon className="w-3 h-3 text-primary" />
                      <span>{hero.dashboard.source}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse-tech" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-foreground/5 rounded-full blur-lg animate-pulse-tech" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}