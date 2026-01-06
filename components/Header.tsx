'use client';

import { useState } from 'react';
import Logo from './Logo';
import LanguageSelector, { useLanguage } from './LanguageSelector';

export function Header() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/98 backdrop-blur-md border-b border-border/60 shadow-sm">
      <div className="w-full px-6 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
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
            <button 
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border/30">
              <div className="flex flex-col space-y-4">
                <a 
                  href="#metodologia" 
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition-all duration-150 link-tech py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.methodology')}
                </a>
                <a 
                  href="#verifica" 
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition-all duration-150 link-tech py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.verify')}
                </a>
                <div className="py-2">
                  <LanguageSelector />
                </div>
                <button 
                  className="btn-tech w-full mt-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('hero.cta')}
                </button>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}