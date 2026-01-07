'use client';

import Logo from './Logo';
import { useLanguage } from './LanguageSelector';
import { useTranslations } from '@/hooks/useTranslations';
import { MailIcon, FileTextIcon, ScaleIcon, EyeIcon, BookOpenIcon } from '@/components/icons/TradeliaIcons';

export function Footer() {
  const { t } = useLanguage();
  const { footer } = useTranslations();

  const footerLinks = [
    {
      icon: EyeIcon,
      href: "/privacy",
      label: t('footer.links.privacy'),
      description: "Informativa sulla privacy"
    },
    {
      icon: ScaleIcon,
      href: "/terms",
      label: t('footer.links.terms'),
      description: "Termini di servizio"
    },
    {
      icon: BookOpenIcon,
      href: "/methodology",
      label: t('footer.links.methodology'),
      description: "Metodologia accademica"
    },
    {
      icon: MailIcon,
      href: "mailto:info@tradelia.com",
      label: t('footer.links.contact'),
      description: "Contatti"
    }
  ];

  return (
    <footer className="section-md border-t border-border/50 bg-muted/30">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="space-y-12">
          
          {/* Header del Footer */}
          <div className="text-center space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              {footer.description}
            </p>
          </div>

          {/* Sezione Links con Icone */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {footerLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href} 
                className="group flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-background/50 transition-all duration-200 hover:shadow-sm border border-transparent hover:border-border/30"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <link.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-center space-y-1">
                  <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {link.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {link.description}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Disclaimer Legale */}
          <div className="space-y-6">
            <div className="p-6 rounded-lg border border-border/50 bg-background/80 backdrop-blur-sm">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4 text-primary" />
                  {footer.disclaimerTitle}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {footer.disclaimer}
                </p>
              </div>
            </div>

            {/* Metodologia */}
            <div className="p-6 rounded-lg border border-border/50 bg-background/80 backdrop-blur-sm">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <BookOpenIcon className="w-4 h-4 text-primary" />
                  {footer.methodologyTitle}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">{footer.methodology.split('.')[0]}:</strong> {footer.methodology.split('. ')[1]}
                </p>
              </div>
            </div>
          </div>

          {/* Copyright e Info Legali */}
          <div className="pt-6 border-t border-border/30">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
              <div className="space-y-1">
                <p className="text-sm text-foreground/80 font-medium">
                  {footer.copyright}
                </p>
                <p className="text-xs text-muted-foreground">
                  {footer.legalInfo}
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>{footer.version}</p>
                <p>{footer.lastUpdate}</p>
                <a href="/changelog-metodologia" className="text-primary hover:text-primary/80 transition-colors underline">
                  {footer.changelogLink}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}