'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { GraduationCapIcon, ShieldIcon, LockIcon, BookOpenIcon, DiamondIcon, CheckIcon, MethodologyIcon } from '@/components/icons/TradeliaIcons';

export default function TrustSection() {
  const { trust } = useTranslations();

  // Badge hierarchy with priorities
  const TRUST_BADGES = [
    {
      text: 'Solo educativo',
      type: 'primary' as const,
      IconComponent: GraduationCapIcon,
      description: 'Nessun consiglio di investimento'
    },
    {
      text: 'Nessuna custodia',
      type: 'primary' as const,
      IconComponent: LockIcon,
      description: 'Non gestiamo i tuoi fondi'
    },
    {
      text: 'Ricerca accademica',
      type: 'secondary' as const,
      IconComponent: BookOpenIcon,
      description: 'Basato su studi peer-reviewed'
    },
    {
      text: 'Trasparenza commissioni',
      type: 'secondary' as const,
      IconComponent: DiamondIcon,
      description: 'Affiliazioni dichiarate'
    },
    {
      text: 'Metodologia aperta',
      type: 'secondary' as const,
      IconComponent: ShieldIcon,
      description: 'Processo verificabile'
    }
  ];

  const TRUST_METRICS = [
    { label: '0€', description: 'Costo utilizzo' },
    { label: '0', description: 'Custodia fondi' },
    { label: '100%', description: 'Educativo' },
    { label: '7', description: 'Studi accademici' }
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {trust.subtitle}
          </p>
        </header>

        {/* Trust Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 fade-in-stagger">
          {TRUST_METRICS.map((metric, index) => (
            <div key={index} className="text-center group">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2 group-hover:scale-105 transition-transform duration-200">
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
              Garanzie principali
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
              Metodologia e trasparenza
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
              Metodologia verificabile
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Framework basato su 7 studi accademici verificati. Fonti pubbliche e metodologia trasparente. 
              Nessun dato stimato o inventato. Completa trasparenza sui conflitti di interesse.
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