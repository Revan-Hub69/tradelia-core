'use client';

import Logo from './Logo';
import { useLanguage } from './LanguageSelector';
import { useTranslations } from '@/hooks/useTranslations';
import { 
  PrivacyIcon, 
  TermsIcon, 
  MethodologyIcon, 
  ContactIcon 
} from '@/components/icons/TradeliaIcons';

export function Footer() {
  const { t } = useLanguage();
  const { footer } = useTranslations();

  const footerLinks = [
    { id: 'privacy', href: '/privacy', label: t('footer.links.privacy'), icon: PrivacyIcon },
    { id: 'terms', href: '/terms', label: t('footer.links.terms'), icon: TermsIcon },
    { id: 'methodology', href: '/methodology', label: t('footer.links.methodology'), icon: MethodologyIcon },
    { id: 'contact', href: 'mailto:info@tradelia.com', label: t('footer.links.contact'), icon: ContactIcon }
  ];

  return (
    <footer className="section-sm border-t border-border/50 bg-muted/30">
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <div className="space-y-8">
          
          {/* Logo e descrizione */}
          <div className="text-center space-y-3">
            <Logo />
            <p className="text-xs text-muted-foreground">
              {footer.description}
            </p>
          </div>

          {/* Links con icone e stile link-tech */}
          <nav className="flex flex-wrap justify-center gap-6 text-xs" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <a 
                key={link.id}
                href={link.href} 
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground link-tech transition-all duration-150"
              >
                <link.icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Disclaimer compatto */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground leading-relaxed max-w-lg mx-auto">
              {footer.disclaimer}
            </p>
          </div>

          {/* Copyright */}
          <div className="pt-4 border-t border-border/70 text-center">
            <p className="text-xs text-muted-foreground">
              {footer.copyright} · {footer.version}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
