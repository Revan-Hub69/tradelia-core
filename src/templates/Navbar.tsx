'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { getLandingSectionHref, landingSections } from '@/config/tradescope';
import { usePathname } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';
import { throttle } from '@/utils/throttle';

import { Logo } from './Logo';

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
        } else if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
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
  const t = useTranslations('Navbar') as (key: string) => string;
  const locale = useLocale();
  const pathname = usePathname();
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
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navLinks = landingSections.map(section => ({
    href: getLandingSectionHref(locale, pathname, section.id),
    label: t(section.navbarLabelKey),
  }));
  const simulatorHref = getLandingSectionHref(locale, pathname, 'simulator');

  const stripItems = [
    { label: t('strip_spread'), value: t('strip_spread_value') },
    { label: t('strip_swap'), value: t('strip_swap_value') },
    { label: t('strip_fees'), value: t('strip_fees_value') },
  ];

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 border-b border-slate-800/80 bg-slate-950 text-slate-200">
        <SectionContainer size="wide" className="hidden h-8 items-center justify-between gap-3 sm:flex">
          {stripItems.map(item => (
            <div key={item.label} className="flex min-w-0 items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{item.label}</span>
              <span className="truncate text-[11px] text-slate-300">{item.value}</span>
            </div>
          ))}
        </SectionContainer>
        <div className="flex h-8 items-center justify-center px-4 text-center text-[11px] tracking-[0.16em] text-slate-300 sm:hidden">
          {t('credibility_bar')}
        </div>
      </div>

      <header
        className={cn(
          'fixed left-0 right-0 top-8 z-50 transition-all duration-300',
          isScrolled
            ? 'border-b border-border/60 bg-background/92 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl'
            : 'bg-background/78 backdrop-blur-lg',
        )}
      >
        <SectionContainer size="wide" className="flex h-14 items-center justify-between sm:h-16">
          <div className="flex items-center gap-3">
            <Logo size="md" href="/" />
            <span className="hidden rounded-full border border-border/60 bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground lg:inline-flex">
              {t('product_badge')}
            </span>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <LocaleSwitcher />
            <Button asChild size="sm" className="h-10 rounded-full px-5 font-mono text-[11px] uppercase tracking-[0.16em]">
              <a href={simulatorHref}>{t('cta')}</a>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
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
        </SectionContainer>
      </header>

      <div className={cn('fixed inset-0 z-50 overflow-x-clip md:hidden', isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
        <div
          className={cn('absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300', isMenuOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setIsMenuOpen(false)}
          role="button"
          tabIndex={0}
          aria-label={t('menu_close_mobile')}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
 setIsMenuOpen(false);
}
          }}
        />

        <div
          ref={menuRef}
          className={cn('absolute bottom-0 right-0 top-0 w-[82%] max-w-xs border-l border-border/60 bg-background shadow-2xl transition-transform duration-300 ease-out', isMenuOpen ? 'translate-x-0' : 'translate-x-full')}
        >
          <div className="flex h-14 items-center justify-between border-b border-border/40 px-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t('menu_title')}</span>
            <button
              type="button"
              data-close-menu
              onClick={() => setIsMenuOpen(false)}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              aria-label={t('menu_close')}
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col p-3">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-2xl px-4 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/80 transition-all hover:bg-muted"
                style={{ transform: isMenuOpen ? 'translateX(0)' : 'translateX(16px)', opacity: isMenuOpen ? 1 : 0, transition: `all 280ms ease-out ${i * 40 + 80}ms` }}
              >
                {link.label}
              </a>
            ))}

            <Button asChild className="mt-3 h-11 rounded-full font-mono text-[11px] uppercase tracking-[0.16em]">
              <a href={simulatorHref} onClick={() => setIsMenuOpen(false)}>
                {t('cta')}
              </a>
            </Button>
          </nav>
        </div>
      </div>

      <div className="h-[88px] lg:h-[92px]" />
    </>
  );
};
