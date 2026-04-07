'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { getLandingSectionHref, landingSections } from '@/config/landing';
import { usePathname } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';
import { throttle } from '@/utils/throttle';

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
  const t        = useTranslations('Navbar') as (key: string) => string;
  const locale   = useLocale();
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
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const navLinks = landingSections.map(section => ({
    href:  getLandingSectionHref(locale, pathname, section.id),
    label: t(section.navbarLabelKey),
  }));

  return (
    <>
      {/* ── Main header ── */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'border-b border-border/60 bg-background/92 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl'
            : 'bg-background/78 backdrop-blur-lg',
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
    </>
  );
};
