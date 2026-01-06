'use client';

import Logo from './Logo';
import { useLanguage } from './LanguageSelector';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="section-sm border-t border-border/50 bg-muted/30">
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <div className="space-y-8">
          
          {/* Chi Siamo - Versione Essenziale */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo />
              <div className="h-px flex-1 bg-border/50"></div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-foreground/90">
                <strong className="text-foreground">{t('footer.methodology').split('.')[0]}:</strong> {t('footer.methodology').split('. ')[1]}
              </p>
            </div>
          </div>

          {/* Disclaimer Essenziale */}
          <div className="p-4 rounded border border-border/50 bg-background">
            <p className="text-sm text-foreground/80 leading-relaxed">
              <strong className="text-foreground">Disclaimer:</strong> {t('footer.disclaimer')}
            </p>
          </div>

          {/* Links Essenziali */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-border/30">
            <div className="flex gap-6 text-sm text-foreground/70">
              <a href="/privacy" className="hover:text-foreground transition-subtle link-tech">
                {t('footer.links.privacy')}
              </a>
              <a href="/terms" className="hover:text-foreground transition-subtle link-tech">
                {t('footer.links.terms')}
              </a>
              <a href="/methodology" className="hover:text-foreground transition-subtle link-tech">
                {t('footer.links.methodology')}
              </a>
              <a href="mailto:info@tradelia.com" className="hover:text-foreground transition-subtle link-tech">
                {t('footer.links.contact')}
              </a>
            </div>
            <p className="text-sm text-foreground/60">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}