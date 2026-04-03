'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Link } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';
import { throttle } from '@/utils/throttle';

import { Logo } from './Logo';
import { ThemeSwitcher } from '@/components/dashboard/ThemeSwitcher';

const useFocusTrap = (isOpen: boolean, containerRef: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) { e.preventDefault(); lastElement?.focus(); }
        } else {
          if (document.activeElement === lastElement) { e.preventDefault(); firstElement?.focus(); }
        }
      }
      if (e.key === 'Escape') {
        const closeButton = container.querySelector('[data-close-menu]') as HTMLElement;
        closeButton?.click();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    setTimeout(() => firstElement?.focus(), 100);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, containerRef]);
};

export const Navbar = () => {
  const t = useTranslations('Navbar') as any;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useFocusTrap(isMenuOpen, menuRef);

  useEffect(() => {
    const handleScroll = throttle(() => setIsScrolled(window.scrollY > 20), 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const navLinks = [
    { href: '#net-return', label: t('nav_net_return') },
    { href: '#exposure',   label: t('nav_exposure')   },
    { href: '#flow',       label: t('nav_flow')        },
    { href: '#methodology',label: t('nav_methodology') },
  ];

  return (
    <>
      {/* Credibility bar — institutional, not e-commerce */}
      <div className="fixed inset-x-0 top-0 z-40 border-b border-border/20 bg-background/70 backdrop-blur-sm">
        <div className="mx-auto flex h-8 max-w-6xl items-center justify-center px-4">
          <p className="text-xs text-muted-foreground/60 tracking-wide">
            {t('credibility_bar')}
          </p>
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

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeSwitcher />
            <LocaleSwitcher />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeSwitcher />
            <LocaleSwitcher />
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex size-10 items-center justify-center rounded-xl hover:bg-muted"
              aria-label={isMenuOpen ? t('menu_close') : t('menu_open')}
            >
              <div className="flex size-5 flex-col items-center justify-center gap-1.5">
                <span className={cn('h-0.5 w-5 rounded-full bg-foreground transition-all duration-300', isMenuOpen && 'translate-y-2 rotate-45')} />
                <span className={cn('h-0.5 w-5 rounded-full bg-foreground transition-all duration-300', isMenuOpen && 'scale-0 opacity-0')} />
                <span className={cn('h-0.5 w-5 rounded-full bg-foreground transition-all duration-300', isMenuOpen && '-translate-y-2 -rotate-45')} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={cn('fixed inset-0 z-50 md:hidden', isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
        <div
          className={cn('absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300', isMenuOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setIsMenuOpen(false)}
          role="button" tabIndex={0} aria-label={t('menu_close_mobile')}
          onKeyDown={(e) => { if (e.key === 'Escape') setIsMenuOpen(false); }}
        />
        <div
          ref={menuRef}
          className={cn('absolute bottom-0 right-0 top-0 w-[80%] max-w-xs bg-background shadow-2xl transition-transform duration-300 ease-out', isMenuOpen ? 'translate-x-0' : 'translate-x-full')}
        >
          <div className="flex h-14 items-center justify-between border-b border-border/40 px-5">
            <span className="text-sm font-medium text-muted-foreground">{t('menu_title')}</span>
            <button type="button" data-close-menu onClick={() => setIsMenuOpen(false)} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted" aria-label={t('menu_close')}>
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col p-3">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-4 py-3.5 text-sm font-medium text-foreground/80 transition-all hover:bg-muted"
                style={{ transform: isMenuOpen ? 'translateX(0)' : 'translateX(16px)', opacity: isMenuOpen ? 1 : 0, transition: `all 280ms ease-out ${i * 40 + 80}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="h-[88px]" />
    </>
  );
};
