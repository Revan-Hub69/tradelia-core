'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { useDashboardModal } from '@/contexts/DashboardModalContext';

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
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
                {hero.title}{' '}
                <span className="text-primary relative">
                  {hero.titleHighlight}
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary/60 to-primary/20 rounded-full" />
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                {hero.description}
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

            {/* CTA Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={openModal}
                  className="btn-tech-premium group"
                >
                  <span>{hero.cta}</span>
                  <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                
                <button className="btn-secondary-premium">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {hero.ctaSecondary}
                </button>
              </div>

              {/* Micro trust */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{hero.trustBadges.verified}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
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
                    <h3 className="text-lg font-semibold text-foreground">{hero.dashboard.title}</h3>
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
                        <svg className="w-3 h-3 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
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
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
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