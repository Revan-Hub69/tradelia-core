'use client';

import Logo from './Logo';
import { useLanguage } from './LanguageSelector';
import { useTranslations } from '@/hooks/useTranslations';

export function Footer() {
  const { t } = useLanguage();
  const { footer } = useTranslations();

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

          {/* Links - inline */}
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('footer.links.privacy')}
            </a>
            <span className="text-border">·</span>
            <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('footer.links.terms')}
            </a>
            <span className="text-border">·</span>
            <a href="/methodology" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('footer.links.methodology')}
            </a>
            <span className="text-border">·</span>
            <a href="mailto:info@tradelia.com" className="text-muted-foreground hover:text-foreground transition-colors">
              {t('footer.links.contact')}
            </a>
          </div>

          {/* Disclaimer compatto */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground leading-relaxed max-w-lg mx-auto">
              {footer.disclaimer}
            </p>
          </div>

          {/* Copyright */}
          <div className="pt-4 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground">
              {footer.copyright} · {footer.version}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
