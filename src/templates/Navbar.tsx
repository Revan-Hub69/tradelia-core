'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { getLandingSectionHref, landingSections } from '@/config/landing';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { usePathname } from '@/lib/i18nNavigation';
import { cn } from '@/utils/Helpers';

import { Logo } from './Logo';

const useFocusTrap = (
  isOpen: boolean,
  containerRef: React.RefObject<HTMLDivElement>,
) => {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const container = containerRef.current;
    const focusable = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault();
          (e.shiftKey ? last : first)?.focus();
        }
      }
      if (e.key === 'Escape') {
        (container.querySelector('[data-close-menu]') as HTMLElement)?.click();
      }
    };

    document.addEventListener('keydown', onKey);
    setTimeout(() => first?.focus(), 100);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, containerRef]);
};

export const Navbar = () => {
  const t      = useTranslations('Navbar') as (key: string) => string;
  const locale = useLocale();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ── Scroll state (landing variant) ────────────────────────────────
  // Hide-on-scroll: mobile + tablet (< 1024px). Desktop: always visible.
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);
  const [isAtScrollEdge, setIsAtScrollEdge] = useState(true);

  const { isScrolled, isHeaderVisible } = useScrollDirection({ threshold: 15 });

  // Breakpoint detection: tablet-or-mobile = < 1024px
  useEffect(() => {
    const check = () => setIsTabletOrMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Scroll edge detection for compact-edge blur boost
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop    = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      setIsAtScrollEdge(scrollTop < 10 || scrollTop + clientHeight >= scrollHeight - 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  useFocusTrap(isMenuOpen, menuRef);

  // Hide only on mobile + tablet, never on desktop
  const shouldHide = isTabletOrMobile && !isHeaderVisible;

  const navLinks = landingSections.map(section => ({
    href:  getLandingSectionHref(locale, pathname, section.id),
    label: t(section.navbarLabelKey),
  }));

  return (
    <>
      {/* ── Main header ── */}
      <header
        role="banner"
        className={cn(
          // Core glass system
          'header-2026',
          // Subtle scroll shadow (landing variant — ghost header, NOT header-scrolled)
          isScrolled && 'header-scrolled-subtle',
          // Stronger blur at scroll edges
          isAtScrollEdge && 'header-compact-edge',
          // Hide/show animation: tablet + mobile only
          shouldHide ? 'header-hide-animation' : 'header-show-animation',
          // will-change optimisation
          isTabletOrMobile ? 'header-will-change-transform' : isAtScrollEdge ? 'header-will-change-effects' : '',
        )}
      >
        <SectionContainer size="wide" className="flex h-14 items-center justify-between sm:h-16">

          {/* Logo */}
          <Logo size="md" href="/" />

          {/* Desktop nav */}
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

          {/* Desktop right */}
          <div className="hidden items-center gap-3 md:flex">
            <LocaleSwitcher />
          </div>

          {/* Mobile hamburger */}
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

      {/* Spacer: 56px mobile / 64px desktop */}
      <div className="h-14 sm:h-16" />

      {/* ── Mobile fullscreen menu ── */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-40 flex flex-col bg-background/95 pt-16 backdrop-blur-xl md:hidden"
        >
          <nav className="flex flex-col gap-1 px-4 pt-4">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-4 py-3 font-mono text-sm uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button
            data-close-menu
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="sr-only"
            aria-label={t('menu_close')}
          />
        </div>
      )}
    </>
  );
};
