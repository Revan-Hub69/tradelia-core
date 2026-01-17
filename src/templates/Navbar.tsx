'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { cn } from '@/utils/Helpers';

import { Logo } from './Logo';

/**
 * Focus trap hook for mobile menu accessibility
 */
const useFocusTrap = (isOpen: boolean, containerRef: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    if (!isOpen || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        // This will be handled by the parent component
        const closeButton = container.querySelector('[data-close-menu]') as HTMLElement;
        closeButton?.click();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus first element when menu opens
    setTimeout(() => {
      firstElement?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, containerRef]);
};

/**
 * Modern Navbar 2026
 *
 * - Glassmorphism header
 * - Slide-in drawer menu (right side)
 * - Staggered animations
 * - Icons + labels
 * - Smooth transitions
 * - Focus trap for accessibility
 */
export const Navbar = () => {
  const t = useTranslations('Navbar');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Use focus trap for mobile menu
  useFocusTrap(isMenuOpen, menuRef);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
    {
      href: '#percorsi',
      label: t('product'),
      description: 'Esplora i percorsi formativi',
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
        </svg>
      ),
    },
    {
      href: '#features',
      label: t('docs'),
      description: 'Scopri le funzionalità',
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
      ),
    },
    {
      href: '#faq',
      label: 'FAQ',
      description: 'Domande frequenti',
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Trust Signals Bar */}
      <div className="fixed inset-x-0 top-0 z-40 border-b border-border/20 bg-muted/30 backdrop-blur-sm">
        <div className="mx-auto flex h-8 max-w-6xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 text-xs text-muted-foreground sm:gap-6">
            <div className="flex items-center gap-1.5">
              <svg className="size-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Dati protetti</span>
            </div>
            <div className="hidden items-center gap-1.5 sm:flex">
              <svg className="size-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>247/1000 utenti gratis</span>
            </div>
            <div className="hidden items-center gap-1.5 sm:flex">
              <svg className="size-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>SSL sicuro</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="size-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Niente spam</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header
        className={cn(
          'fixed left-0 right-0 top-8 z-50 transition-all duration-300',
          isScrolled
            ? 'border-b border-border/40 bg-background/90 shadow-sm backdrop-blur-xl'
            : 'bg-background/50 backdrop-blur-sm',
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          <Logo size="md" />

          {/* Desktop Navigation - visible from md */}
          <nav className="hidden items-center gap-0.5 md:flex lg:gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-all duration-200 hover:bg-primary/10 hover:text-primary lg:px-4"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right - visible from md */}
          <div className="hidden items-center gap-2 md:flex lg:gap-3">
            <LocaleSwitcher />
            <Link
              href="/sign-in"
              className="px-3 py-2 text-sm font-medium text-foreground/80 transition-all duration-200 hover:text-primary lg:px-4"
            >
              {t('sign_in')}
            </Link>
            <Link href="/onboarding" className={buttonVariants({ size: 'sm' })}>
              {t('sign_up')}
            </Link>
          </div>

          {/* Mobile Controls - hidden from md */}
          <div className="flex items-center gap-2 md:hidden">
            <LocaleSwitcher />
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                'relative z-[60] flex size-10 items-center justify-center rounded-xl transition-all duration-200',
                'hover:bg-primary/10',
                isMenuOpen && 'bg-primary/10',
              )}
              aria-label={isMenuOpen ? 'Chiudi menu' : 'Apri menu'}
            >
              <div className="flex size-5 flex-col items-center justify-center gap-1.5">
                <span className={cn(
                  'h-0.5 w-5 rounded-full bg-foreground transition-all duration-300',
                  isMenuOpen && 'translate-y-2 rotate-45',
                )}
                />
                <span className={cn(
                  'h-0.5 w-5 rounded-full bg-foreground transition-all duration-300',
                  isMenuOpen && 'scale-0 opacity-0',
                )}
                />
                <span className={cn(
                  'h-0.5 w-5 rounded-full bg-foreground transition-all duration-300',
                  isMenuOpen && '-translate-y-2 -rotate-45',
                )}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Slide from Right (hidden from md) */}
      <div
        className={cn(
          'fixed inset-0 z-50 md:hidden',
          isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        {/* Backdrop scuro */}
        <div
          className={cn(
            'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
            isMenuOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setIsMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsMenuOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Chiudi menu mobile"
        />

        {/* Drawer Panel */}
        <div
          ref={menuRef}
          className={cn(
            'absolute bottom-0 right-0 top-0 w-[85%] max-w-xs bg-background shadow-2xl transition-transform duration-300 ease-out sm:max-w-sm',
            isMenuOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          {/* Header del drawer */}
          <div className="flex h-16 items-center justify-between border-b border-border/50 px-6">
            <span className="text-sm font-medium text-muted-foreground">Menu</span>
            <button
              type="button"
              data-close-menu
              onClick={() => setIsMenuOpen(false)}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Chiudi menu"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col p-4">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'group flex items-center gap-4 rounded-xl px-4 py-4 transition-all duration-200',
                  'hover:bg-primary/10',
                  'active:scale-[0.98]',
                )}
                style={{
                  transform: isMenuOpen ? 'translateX(0)' : 'translateX(20px)',
                  opacity: isMenuOpen ? 1 : 0,
                  transition: `all 300ms ease-out ${i * 50 + 100}ms`,
                }}
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  {link.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">{link.label}</span>
                  <span className="text-sm text-muted-foreground">{link.description}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="mx-6 h-px bg-border/50" />

          {/* Auth Buttons */}
          <div
            className="flex flex-col gap-3 p-6"
            style={{
              transform: isMenuOpen ? 'translateX(0)' : 'translateX(20px)',
              opacity: isMenuOpen ? 1 : 0,
              transition: 'all 300ms ease-out 250ms',
            }}
          >
            <Link
              href="/sign-in"
              onClick={() => setIsMenuOpen(false)}
              className="flex h-12 items-center justify-center rounded-xl border border-border font-medium text-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary active:scale-[0.98]"
            >
              {t('sign_in')}
            </Link>
            <Link
              href="/onboarding"
              onClick={() => setIsMenuOpen(false)}
              className="flex h-12 items-center justify-center rounded-xl bg-primary font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
            >
              {t('sign_up')}
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};
