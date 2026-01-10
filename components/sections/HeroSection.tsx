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
                  <span className="text-primary relative inline-block">
                    <span className="relative">
                      crypto
                      <div className="absolute -bottom-2 left-[60%] w-[40%] h-1 bg-gradient-to-r from-primary/60 to-primary/20 rounded-full" />
                    </span>
                    <span>, ma hai paura di sbagliare?</span>
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl font-semibold">
                  {hero.description}
                </p>

                {hero.subDescription && (
                  <p className="text-base text-foreground font-semibold max-w-xl">
                    {hero.subDescription}
                  </p>
                )}

                {/* Trust metrics */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {hero.features.map((feature, index) => (
                    <div key={`feature-${index}`} className="flex items-center gap-2">
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
                  onClick={() => openModal()}
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
                  <span>{hero.trustBadges?.verified || 'Metodologia verificata'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldIcon className="w-3 h-3 text-primary" />
                  <span>{hero.trustBadges?.specs || '0€ • 60-90s • Nessun documento'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative lg:pl-8">
            <div className="relative">
              {/* Main dashboard card */}
              <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-2xl p-6 transform hover:scale-[1.02] transition-all duration-150">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DashboardIcon className="w-5 h-5 text-primary" />
                      <span className="text-lg font-semibold text-foreground">{hero.dashboard?.title || 'Anteprima Dashboard'}</span>
                    </div>
                    <div className="flex gap-1" aria-hidden="true">
                      <div className="w-2 h-2 bg-error rounded-full" />
                      <div className="w-2 h-2 bg-warning rounded-full" />
                      <div className="w-2 h-2 bg-success rounded-full" />
                    </div>
                  </div>

                  {/* Risk cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="kpi-card kpi-error">
                      <div className="text-2xl font-bold text-error">73%</div>
                      <div className="text-xs text-error">{hero.dashboard?.metrics?.commonErrors || 'Errori comuni'}</div>
                    </div>
                    <div className="kpi-card kpi-warning">
                      <div className="text-2xl font-bold text-warning">3</div>
                      <div className="text-xs text-warning">{hero.dashboard?.metrics?.activeRisks || 'Rischi attivi'}</div>
                    </div>
                    <div className="kpi-card kpi-success">
                      <div className="text-2xl font-bold text-success">12</div>
                      <div className="text-xs text-success">{hero.dashboard?.metrics?.academicSources || 'Fonti accademiche'}</div>
                    </div>
                  </div>

                  {/* Alert example */}
                  <div className="alert-warning">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 icon-bg-warning rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangleIcon className="w-3 h-3 alert-warning-icon" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-warning">{hero.dashboard?.alert?.title || 'Incompatibilità rilevata'}</div>
                        <div className="text-xs text-warning/80 mt-1">{hero.dashboard?.alert?.description || 'Obiettivo "hodling" + strumento "leverage" = rischio elevato'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Research source */}
                  <div className="text-xs text-muted-foreground border-t border-border/30 pt-4">
                    <div className="flex items-center gap-2">
                      <CheckIcon className="w-3 h-3 text-primary" />
                      <span>{hero.dashboard?.source || 'Basato su Barber & Odean (2001) + Kahneman & Tversky (1979), De Bondt & Thaler (1985)'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle decorative elements - static, no animation */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/5 rounded-full blur-xl" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-foreground/3 rounded-full blur-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}