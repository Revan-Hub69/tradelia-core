'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { cn } from '@/utils/Helpers';

import { Logo } from './Logo';

/**
 * Enterprise Navbar 2026
 *
 * Features:
 * - Glassmorphism header on scroll
 * - Fullscreen mobile overlay menu
 * - Uniform blue hover effects (NO green)
 * - Microinteractions with scale & opacity
 * - Staggered animations
 */
export const Navbar = () => {
  const t = useTranslations('Navbar');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: '#percorsi', label: t('product'), description: 'Esplora i percorsi formativi' },
    { href: '#features', label: t('docs'), description: 'Scopri le funzionalità' },
    { href: '#faq', label: 'FAQ', description: 'Domande frequenti' },
  ];

  return (
    <>
      {/* Header sticky con glassmorphism */}
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'border-b border-border/40 bg-background/85 shadow-sm backdrop-blur-xl'
            : 'bg-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden items-center gap-3 lg:flex">
            <LocaleSwitcher />
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-primary"
            >
              {t('sign_in')}
            </Link>
            <Link
              href="/sign-up"
              className={buttonVariants({ size: 'sm' })}
            >
              {t('sign_up')}
            </Link>
          </div>

          {/* Mobile: Language + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <LocaleSwitcher />
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                'relative z-50 flex size-10 items-center justify-center rounded-lg transition-all duration-200',
                'hover:bg-primary/10',
                isMenuOpen && 'bg-primary/10',
              )}
              aria-label={isMenuOpen ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={isMenuOpen}
            >
              <div className="flex size-5 flex-col items-center justify-center gap-1.5">
                <span
                  className={cn(
                    'h-0.5 w-5 rounded-full bg-foreground transition-all duration-300 ease-out',
                    isMenuOpen && 'translate-y-2 rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'h-0.5 w-5 rounded-full bg-foreground transition-all duration-300 ease-out',
                    isMenuOpen && 'scale-0 opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'h-0.5 w-5 rounded-full bg-foreground transition-all duration-300 ease-out',
                    isMenuOpen && '-translate-y-2 -rotate-45',
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Enterprise Level */}
      <div
        className={cn(
          'fixed inset-0 z-40 transition-all duration-300 lg:hidden',
          isMenuOpen
            ? 'pointer-events-auto'
            : 'pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-background/98 backdrop-blur-md transition-opacity duration-300',
            isMenuOpen ? 'opacity-100' : 'opacity-0',
          )}
        />

        {/* Content */}
        <div
          className={cn(
            'relative flex h-full flex-col pt-20 transition-all duration-300',
            isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0',
          )}
        >
          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-4">
            <div className="mx-auto max-w-sm space-y-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'group flex flex-col rounded-xl px-4 py-4 transition-all duration-200',
                    'hover:bg-primary/10',
                    'active:scale-[0.98]',
                  )}
                  style={{
                    animationDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                  }}
                >
                  <span className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                    {link.label}
                  </span>
                  <span className="mt-0.5 text-sm text-muted-foreground">
                    {link.description}
                  </span>
                </Link>
              ))}
            </div>

            {/* Separator */}
            <div className="mx-auto my-6 h-px max-w-sm bg-border/50" />

            {/* Auth Section */}
            <div className="mx-auto max-w-sm space-y-3">
              <Link
                href="/sign-in"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'flex h-12 w-full items-center justify-center rounded-xl border border-border text-base font-medium text-foreground transition-all duration-200',
                  'hover:border-primary/50 hover:bg-primary/5 hover:text-primary',
                  'active:scale-[0.98]',
                )}
              >
                {t('sign_in')}
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-medium text-primary-foreground transition-all duration-200',
                  'hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25',
                  'active:scale-[0.98]',
                )}
              >
                {t('sign_up')}
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};
