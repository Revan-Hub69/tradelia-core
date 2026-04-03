'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { Link } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';
import { throttle } from '@/utils/throttle';

import { Logo } from './Logo';
import { ThemeSwitcher } from '@/components/dashboard/ThemeSwitcher';

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
  }, [isOpen, containerRef]); // ✅ Correct: both dependencies included
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
  const t = useTranslations('Navbar') as any;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Use focus trap for mobile menu
  useFocusTrap(isMenuOpen, menuRef);

  useEffect(() => {
    // Performance P1: Throttle scroll event to 100ms (from 60+ events/second)
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 20);
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // ✅ Correct: ComponentDidMount pattern, no external dependencies

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]); // ✅ Correct: isMenuOpen is the only dependency

  const navLinks = [
    {
      href: '#net-return',
      label: 'Net Return Model',
      description: 'Simula rendimenti netti reali',
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      href: '#exposure',
      label: 'Analisi Esposizione',
      description: 'Confronta leva e rischio',
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
      ),
    },
    {
      href: '#flow',
      label: 'Flow Radar',
      description: 'Rileva anomalie di mercato',
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.759 6.759 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
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
              <span>{t('trust_data_protected')}</span>
            </div>
            <div className="hidden items-center gap-1.5 sm:flex">
              <svg className="size-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>{t('trust_ssl_secure')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="size-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{t('trust_no_spam')}</span>
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
          <Logo size="md" href="/" />

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
            <ThemeSwitcher />
            <LocaleSwitcher />
            <Link href="/auth" className={buttonVariants({ size: 'sm' })}>
              {t('enter')}
            </Link>
          </div>

          {/* Mobile Controls - hidden from md */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeSwitcher />
            <LocaleSwitcher />
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                'relative z-[60] flex size-10 items-center justify-center rounded-xl transition-all duration-200',
                'hover:bg-primary/10',
                isMenuOpen && 'bg-primary/10',
              )}
              aria-label={isMenuOpen ? t('menu_close') : t('menu_open')}
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
          aria-label={t('menu_close_mobile')}
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
            <span className="text-sm font-medium text-muted-foreground">{t('menu_title')}</span>
            <button
              type="button"
              data-close-menu
              onClick={() => setIsMenuOpen(false)}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={t('menu_close')}
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

          {/* Auth Button */}
          <div
            className="flex flex-col gap-3 p-6"
            style={{
              transform: isMenuOpen ? 'translateX(0)' : 'translateX(20px)',
              opacity: isMenuOpen ? 1 : 0,
              transition: 'all 300ms ease-out 250ms',
            }}
          >
            <Link
              href="/auth"
              onClick={() => setIsMenuOpen(false)}
              className="flex h-12 items-center justify-center rounded-xl bg-primary font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
            >
              {t('enter')}
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};
