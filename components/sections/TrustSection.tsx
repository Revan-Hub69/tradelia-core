'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { GraduationCapIcon, ShieldIcon, LockIcon, BookOpenIcon, DiamondIcon, CheckIcon, MethodologyIcon } from '@/components/icons/TradeliaIcons';

export default function TrustSection() {
  const { trust } = useTranslations();

  // Badge hierarchy with priorities
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
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <header className="text-center mb-16">
          <h2 
            id="trust-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground leading-tight tracking-tight mb-6 text-center"
          >
            {trust.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            {trust.subtitle}
          </p>
          
          {/* Micro-label con mini-frase */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-sm text-primary font-medium">
            <CheckIcon className="w-4 h-4" />
            <span>{trust.frameworkDescription}</span>
          </div>
        </header>

        {/* Consolidamento Accademico - 3 Bullet Points */}
        <div className="mb-16 p-6 rounded-lg border border-border/50 bg-background/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">{trust.academicMethodology}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <BookOpenIcon className="w-6 h-6 text-primary mx-auto mb-2" />
              <h4 className="font-medium text-foreground mb-1">{trust.academicSections.sources}</h4>
              <p className="text-sm text-muted-foreground">{trust.academicSections.sourcesDescription}</p>
            </div>
            <div className="text-center">
              <MethodologyIcon className="w-6 h-6 text-primary mx-auto mb-2" />
              <h4 className="font-medium text-foreground mb-1">{trust.academicSections.method}</h4>
              <p className="text-sm text-muted-foreground">{trust.academicSections.methodDescription}</p>
            </div>
            <div className="text-center">
              <DiamondIcon className="w-6 h-6 text-primary mx-auto mb-2" />
              <h4 className="font-medium text-foreground mb-1">{trust.academicSections.conflicts}</h4>
              <p className="text-sm text-muted-foreground">{trust.academicSections.conflictsDescription}</p>
            </div>
          </div>
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 fade-in-stagger">
          {TRUST_METRICS.map((metric, index) => (
            <div key={index} className="text-center group">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2 group-hover:scale-105 transition-transform duration-150">
                {metric.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {metric.description}
              </div>
            </div>
          ))}
        </div>
        
        {/* Badge Hierarchy */}
        <div className="space-y-8">
          {/* Primary badges */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground text-center uppercase tracking-wide">
              {trust.primaryGuarantees}
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {TRUST_BADGES.filter(badge => badge.type === 'primary').map((badge, index) => (
                <div key={index} className="group relative">
                  <div className="badge-primary flex items-center gap-2">
                    <badge.IconComponent className="w-4 h-4" />
                    <span>{badge.text}</span>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {badge.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary badges */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground text-center uppercase tracking-wide">
              {trust.methodologyTransparency}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {TRUST_BADGES.filter(badge => badge.type === 'secondary').map((badge, index) => (
                <div key={index} className="group relative">
                  <div className="badge-secondary flex items-center gap-2">
                    <badge.IconComponent className="w-4 h-4" />
                    <span>{badge.text}</span>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {badge.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Proof section */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {trust.verifiableMethodology}
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              {trust.frameworkDescription}
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckIcon className="w-3 h-3 text-primary" />
                Barber & Odean (2001)
              </span>
              <span className="flex items-center gap-1">
                <CheckIcon className="w-3 h-3 text-primary" />
                Shefrin & Statman (1985)
              </span>
              <span className="flex items-center gap-1">
                <CheckIcon className="w-3 h-3 text-primary" />
                Bikhchandani et al. (1992)
              </span>
              <span className="flex items-center gap-1">
                <CheckIcon className="w-3 h-3 text-primary" />
                Kahneman & Tversky (1979)
              </span>
              <span className="flex items-center gap-1">
                <CheckIcon className="w-3 h-3 text-primary" />
                Thaler (1985)
              </span>
              <span className="flex items-center gap-1">
                <CheckIcon className="w-3 h-3 text-primary" />
                De Bondt & Thaler (1985)
              </span>
              <span className="flex items-center gap-1">
                <CheckIcon className="w-3 h-3 text-primary" />
                Odean (1998)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}