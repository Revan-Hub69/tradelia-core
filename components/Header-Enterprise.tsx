'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageSelector';
import { Container, Button } from '@/components/UI-Enterprise';
import { MenuIcon, CrossIcon, GlobeIcon } from '@/components/Icons-Enterprise';

export const HeaderEnterprise = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { locale, setLocale } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    {
      name: locale === 'it' ? 'Metodologia' : 'Methodology',
      href: '#methodology'
    },
    {
      name: locale === 'it' ? 'Verifica' : 'Verification', 
      href: '/dashboard'
    }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-surface-glass/95 backdrop-blur-lg border-b border-border/20 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <Container size="lg">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center gap-3 group">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 32 32" 
                fill="none"
                className="text-primary transition-all duration-300 group-hover:scale-110"
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
              <span className="text-xl font-bold text-foreground">
                Tradelia
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-body text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Language Selector & Mobile Menu */}
          <div className="flex items-center gap-4">
            
            {/* Language Selector */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocale(locale === 'it' ? 'en' : 'it')}
                className="flex items-center gap-2"
              >
                <GlobeIcon size={16} />
                <span className="text-sm font-medium">
                  {locale === 'it' ? 'EN' : 'IT'}
                </span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <CrossIcon size={20} />
              ) : (
                <MenuIcon size={20} />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/20 bg-surface-glass/95 backdrop-blur-lg">
            <nav className="py-4 space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-body text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
};