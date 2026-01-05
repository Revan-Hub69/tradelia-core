'use client';

import Logo from './Logo';
import LanguageSelector, { useLanguage } from './LanguageSelector';

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-background/98 backdrop-blur-md border-b border-border/60 shadow-sm">
      <div className="w-full px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-14">
            {/* Logo - Sinistra */}
            <div className="flex-shrink-0">
              <Logo />
            </div>
            
            {/* Navigation - Destra */}
            <nav className="flex items-center gap-6">
              <a href="#metodologia" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-all duration-150 link-tech">
                {t('nav.methodology')}
              </a>
              <a href="#verifica" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-all duration-150 link-tech">
                {t('nav.verify')}
              </a>
              <LanguageSelector />
              <button className="btn-tech ml-2">
                {t('hero.cta')}
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}