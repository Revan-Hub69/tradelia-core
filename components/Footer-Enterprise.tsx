'use client';

import { useLanguage } from '@/components/LanguageSelector';
import { Section, Container, Grid, Separator } from '@/components/UI-Enterprise';
import { TwitterIcon, LinkedInIcon, GitHubIcon } from '@/components/Icons-Enterprise';

export const FooterEnterprise = () => {
  const { locale } = useLanguage();

  const footerLinks = {
    product: {
      title: locale === 'it' ? 'Prodotto' : 'Product',
      links: [
        { name: locale === 'it' ? 'Come funziona' : 'How it works', href: '#how-it-works' },
        { name: locale === 'it' ? 'Metodologia' : 'Methodology', href: '#methodology' },
        { name: locale === 'it' ? 'Esempi' : 'Examples', href: '#examples' },
        { name: locale === 'it' ? 'Limiti' : 'Limitations', href: '#limits' }
      ]
    },
    company: {
      title: locale === 'it' ? 'Azienda' : 'Company',
      links: [
        { name: locale === 'it' ? 'Chi siamo' : 'About us', href: '/about' },
        { name: locale === 'it' ? 'Ricerca' : 'Research', href: '/research' },
        { name: locale === 'it' ? 'Contatti' : 'Contact', href: '/contact' },
        { name: locale === 'it' ? 'Carriere' : 'Careers', href: '/careers' }
      ]
    },
    legal: {
      title: locale === 'it' ? 'Legale' : 'Legal',
      links: [
        { name: locale === 'it' ? 'Privacy Policy' : 'Privacy Policy', href: '/privacy' },
        { name: locale === 'it' ? 'Termini di servizio' : 'Terms of service', href: '/terms' },
        { name: locale === 'it' ? 'Disclaimer' : 'Disclaimer', href: '/disclaimer' },
        { name: locale === 'it' ? 'Cookie Policy' : 'Cookie Policy', href: '/cookies' }
      ]
    }
  };

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/tradelia', icon: TwitterIcon },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/tradelia', icon: LinkedInIcon },
    { name: 'GitHub', href: 'https://github.com/tradelia', icon: GitHubIcon }
  ];

  return (
    <Section variant="lg" className="bg-muted/30 border-t border-border/50">
      <Container size="lg">
        
        {/* Main Footer Content */}
        <div className="mb-12">
          <Grid cols={4} gap="lg">
            
            {/* Brand Column */}
            <div className="col-span-4 lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 32 32" 
                  fill="none"
                  className="text-primary"
                >
                  <circle 
                    cx="16" 
                    cy="16" 
                    r="15" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none"
                  />
                  <path 
                    d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinejoin="round" 
                    fill="none"
                  />
                  <circle 
                    cx="16" 
                    cy="16" 
                    r="2" 
                    fill="currentColor"
                  />
                </svg>
                <span className="text-xl font-bold text-foreground">Tradelia</span>
              </div>
              
              <p className="text-body-sm text-muted-foreground mb-6 leading-relaxed">
                {locale === 'it'
                  ? 'Strumento di verifica coerenza basato su ricerca comportamentale accademica per il settore finanziario.'
                  : 'Consistency verification tool based on academic behavioral research for the financial sector.'
                }
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-elevated hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200"
                      aria-label={social.name}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key} className="col-span-2 lg:col-span-1">
                <h3 className="text-h4 mb-6">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-body-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Grid>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Copyright */}
          <p className="text-body-sm text-muted-foreground">
            © 2026 Tradelia. {locale === 'it' ? 'Tutti i diritti riservati.' : 'All rights reserved.'}
          </p>

          {/* Legal Disclaimer */}
          <div className="text-center md:text-right">
            <p className="text-body-sm text-muted-foreground">
              {locale === 'it'
                ? 'Strumento educativo. Non costituisce consulenza finanziaria.'
                : 'Educational tool. Does not constitute financial advice.'
              }
            </p>
          </div>
        </div>

        {/* Academic Citation */}
        <div className="mt-8 pt-8 border-t border-border/30">
          <div className="text-center">
            <p className="text-body-sm text-muted-foreground mb-2">
              {locale === 'it' ? 'Basato su ricerca accademica peer-reviewed' : 'Based on peer-reviewed academic research'}
            </p>
            <p className="text-xs text-muted-foreground">
              {locale === 'it'
                ? 'Fonti principali: Barber & Odean (2000), Kahneman & Tversky (1979), Thaler & Sunstein (2008)'
                : 'Main sources: Barber & Odean (2000), Kahneman & Tversky (1979), Thaler & Sunstein (2008)'
              }
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
};