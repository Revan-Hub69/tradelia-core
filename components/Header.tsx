'use client';

import { useState, useEffect } from 'react';
import Logo from './Logo';
import LanguageSelector, { useLanguage } from './LanguageSelector';
import { useDashboardModal } from '@/contexts/DashboardModalContext';
import { MenuIcon, CloseIcon } from '@/components/icons/TradeliaIcons';

export function Header() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { openModal } = useDashboardModal();

  // Scrollspy functionality
  useEffect(() => {
    const sections = ['hero', 'research', 'trust'];
    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { href: '#research', label: t('nav.methodology'), id: 'research' },
    { href: '#trust', label: t('nav.verify'), id: 'trust' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/98 backdrop-blur-md border-b border-border/60 shadow-sm">
      <div className="w-full px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6">
                {navItems.map((item) => (
                  <a 
                    key={item.id}
                    href={item.href} 
                    className={`text-sm font-medium transition-all duration-150 link-tech ${
                      activeSection === item.id 
                        ? 'text-primary' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <LanguageSelector />
                <button 
                  onClick={() => openModal()}
                  className="btn-tech"
                >
                  Accedi alla dashboard
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <CloseIcon className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-6 border-t border-border/30 bg-background/95">
              <div className="flex flex-col space-y-6">
                {navItems.map((item) => (
                  <a 
                    key={item.id}
                    href={item.href} 
                    className={`text-base font-medium transition-all duration-150 link-tech py-3 px-2 ${
                      activeSection === item.id 
                        ? 'text-primary' 
                        : 'text-foreground hover:text-primary'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                
                {/* Mobile Language Selector - Enhanced */}
                <div className="py-3 px-2">
                  <div className="mobile-language-selector">
                    <LanguageSelector />
                  </div>
                </div>
                
                <button 
                  className="btn-tech w-full mt-6 h-12 text-base"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openModal();
                  }}
                >
                  Accedi alla dashboard
                </button>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}