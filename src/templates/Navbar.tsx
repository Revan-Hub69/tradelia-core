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

  const stripItems = [
    { icon: '◈', text: t('strip_item_1') },
    { icon: '◈', text: t('strip_item_2') },
    { icon: '◈', text: t('strip_item_3') },
  ];

  return (
    <>
      {/* ── Info strip ── */}
      <div
        className="fixed inset-x-0 top-0 z-40 border-b"
        style={{
          background: 'hsl(var(--background) / 0.97)',
          borderColor: 'hsl(var(--border) / 0.5)',
        }}
      >
        {/* Desktop strip */}
        <SectionContainer size="wide" className="hidden h-8 items-center justify-between sm:flex">
          {/* Left: strip items */}
          <div className="flex items-center gap-6">
            {stripItems.map(item => (
              <div key={item.text} className="flex items-center gap-1.5">
                <span
                  className="text-[9px]"
                  style={{ color: 'hsl(var(--primary))' }}
                  aria-hidden="true"
                >
                  ●
                </span>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.15em]"
                  style={{ color: 'hsl(var(--foreground) / 0.55)' }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Right: ESMA badge */}
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5"
            style={{
              background: 'hsl(var(--primary) / 0.08)',
              border: '1px solid hsl(var(--primary) / 0.2)',
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
              style={{ color: 'hsl(var(--primary))' }}
            >
              <path
                d="M5 1L6.12 3.62L9 4.01L7 5.96L7.49 8.83L5 7.45L2.51 8.83L3 5.96L1 4.01L3.88 3.62L5 1Z"
                fill="currentColor"
              />
            </svg>
            <span
              className="font-mono text-[10px] font-medium uppercase tracking-[0.12em]"
              style={{ color: 'hsl(var(--primary))' }}
            >
              {t('strip_esma_badge')}
            </span>
          </div>
        </SectionContainer>

        {/* Mobile strip — solo badge ESMA */}
        <div
          className="flex h-8 items-center justify-center gap-2 px-4 sm:hidden"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
            style={{ color: 'hsl(var(--primary))' }}
          >
            <path
              d="M5 1L6.12 3.62L9 4.01L7 5.96L7.49 8.83L5 7.45L2.51 8.83L3 5.96L1 4.01L3.88 3.62L5 1Z"
              fill="currentColor"
            />
          </svg>
          <span
            className="font-mono text-[10px] font-medium uppercase tracking-[0.12em]"
            style={{ color: 'hsl(var(--primary))' }}
          >
            {t('strip_esma_badge')}
          </span>
        </div>
      </div>

      {/* ── Main header ── */}
      <header
        className={cn(
          'fixed left-0 right-0 top-8 z-50 transition-all duration-300',
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

      {/* ── Mobile drawer ── */}
      <div className={cn('fixed inset-0 z-50 overflow-x-clip md:hidden', isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
        <div
          className={cn('absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300', isMenuOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setIsMenuOpen(false)}
          role="button"
          tabIndex={0}
          aria-label={t('menu_close_mobile')}
          onKeyDown={e => { if (e.key === 'Escape') setIsMenuOpen(false); }}
        />
        <div
          ref={menuRef}
          className={cn(
            'absolute bottom-0 right-0 top-0 w-[82%] max-w-xs border-l border-border/60 bg-background shadow-2xl transition-transform duration-300 ease-out',
            isMenuOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="flex h-14 items-center justify-between border-b border-border/40 px-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Menu</span>
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
                style={{
                  transform:  isMenuOpen ? 'translateX(0)' : 'translateX(16px)',
                  opacity:    isMenuOpen ? 1 : 0,
                  transition: `all 280ms ease-out ${i * 40 + 80}ms`,
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="h-[88px] lg:h-[92px]" />
    </>
  );
};
