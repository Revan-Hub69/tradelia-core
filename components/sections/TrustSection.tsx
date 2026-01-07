'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { GraduationCapIcon, LockIcon, BookOpenIcon, DiamondIcon, ShieldIcon, CheckIcon, MethodologyIcon } from '@/components/icons/TradeliaIcons';

export default function TrustSection() {
  const { trust } = useTranslations();

  const TRUST_BADGES = [
    {
      text: trust.badges.educationalOnly,
      type: 'primary' as const,
      IconComponent: GraduationCapIcon,
      description: trust.badgeDescriptions.educationalOnly
    },
    {
      text: trust.badges.noCustody,
      type: 'primary' as const,
      IconComponent: LockIcon,
      description: trust.badgeDescriptions.noCustody
    },
    {
      text: trust.badges.academicResearch,
      type: 'secondary' as const,
      IconComponent: BookOpenIcon,
      description: trust.badgeDescriptions.academicResearch
    },
    {
      text: trust.badges.commissionTransparency,
      type: 'secondary' as const,
      IconComponent: DiamondIcon,
      description: trust.badgeDescriptions.commissionTransparency
    },
    {
      text: trust.badges.openMethodology,
      type: 'secondary' as const,
      IconComponent: ShieldIcon,
      description: trust.badgeDescriptions.openMethodology
    }
  ];

  const TRUST_METRICS = [
    { label: trust.metrics.cost, description: trust.metrics.costDescription },
    { label: trust.metrics.custody, description: trust.metrics.custodyDescription },
    { label: trust.metrics.educational, description: trust.metrics.educationalDescription },
    { label: trust.metrics.studies, description: trust.metrics.studiesDescription }
  ];

  return (
    <section 
      id="trust"
      className="section-lg bg-background fade-in-section border-b border-border/30"
      aria-labelledby="trust-title"
    >
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <header className="text-center mb-12">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
            Trasparenza
          </p>
          <h2 
            id="trust-title"
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground leading-tight mb-4"
            style={{ letterSpacing: '-0.01em' }}
          >
            {trust.title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {trust.subtitle}
          </p>
        </header>

        {/* Trust Metrics - 2x2 grid on mobile */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          {TRUST_METRICS.map((metric) => (
            <div key={metric.label} className="text-center p-4 rounded border border-border/50 bg-background">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                {metric.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {metric.description}
              </div>
            </div>
          ))}
        </div>

        {/* Academic Methodology - Simplified */}
        <div className="mb-12 p-5 rounded border border-border/50 bg-muted/30">
          <h3 className="text-base font-medium text-foreground mb-4 text-center">
            {trust.academicMethodology}
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <BookOpenIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">{trust.academicSections.sources}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{trust.academicSections.sourcesDescription}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MethodologyIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">{trust.academicSections.method}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{trust.academicSections.methodDescription}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DiamondIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">{trust.academicSections.conflicts}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{trust.academicSections.conflictsDescription}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Badge Lists - Stacked for mobile */}
        <div className="space-y-8">
          {/* Primary badges */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-center">
              {trust.primaryGuarantees}
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {TRUST_BADGES.filter(badge => badge.type === 'primary').map((badge) => (
                <div 
                  key={badge.text} 
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-primary text-white flex items-center gap-1.5"
                >
                  <badge.IconComponent className="w-3 h-3" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary badges */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-center">
              {trust.methodologyTransparency}
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {TRUST_BADGES.filter(badge => badge.type === 'secondary').map((badge) => (
                <div 
                  key={badge.text} 
                  className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground border border-border/50 flex items-center gap-1.5"
                >
                  <badge.IconComponent className="w-3 h-3" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Academic Sources */}
        <div className="mt-12 pt-8 border-t border-border/30">
          <h3 className="text-sm font-medium text-foreground mb-4 text-center">
            {trust.verifiableMethodology}
          </h3>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            {['Barber & Odean (2001)', 'Shefrin & Statman (1985)', 'Bikhchandani et al. (1992)', 'Kahneman & Tversky (1979)'].map((source) => (
              <span key={source} className="flex items-center gap-1">
                <CheckIcon className="w-3 h-3 text-primary" />
                {source}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
