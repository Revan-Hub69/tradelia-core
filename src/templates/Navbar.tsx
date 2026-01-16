'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { cn } from '@/utils/Helpers';

import { Logo } from './Logo';

export const Navbar = () => {
  const t = useTranslations('Navbar');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll per glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Blocca scroll quando menu è aperto
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: '#percorsi', label: t('product') },
    { href: '#features', label: t('docs') },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <>
      {/* Header sticky con glassmorphism */}
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'border-b border-border/50 bg-background/80 backdrop-blur-lg'
            : 'bg-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden items-center gap-4 lg:flex">
            <LocaleSwitcher />
            <Link
              href="/sign-in"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
          <div className="flex items-center gap-3 lg:hidden">
            <LocaleSwitcher />
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-50 flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-muted"
              aria-label={isMenuOpen ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={isMenuOpen}
            >
              <div className="flex size-5 flex-col items-center justify-center gap-1">
                <span
                  className={cn(
                    'h-0.5 w-5 rounded-full bg-foreground transition-all duration-300',
                    isMenuOpen && 'translate-y-1.5 rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'h-0.5 w-5 rounded-full bg-foreground transition-all duration-300',
                    isMenuOpen && 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'h-0.5 w-5 rounded-full bg-foreground transition-all duration-300',
                    isMenuOpen && '-translate-y-1.5 -rotate-45',
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background transition-all duration-300 lg:hidden',
          isMenuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        )}
      >
        <div className="flex h-full flex-col items-center justify-center gap-8 px-6">
          {/* Nav Links */}
          <nav className="flex flex-col items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-medium text-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/sign-in"
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('sign_in')}
            </Link>
            <Link
              href="/sign-up"
              onClick={() => setIsMenuOpen(false)}
              className={buttonVariants({ size: 'lg' })}
            >
              {t('sign_up')}
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer per contenuto sotto header fixed */}
      <div className="h-16" />
    </>
  );
};
