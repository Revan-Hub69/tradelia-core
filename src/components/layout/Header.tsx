'use client';

import Link from 'next/link';
import { useTheme } from '@/app/hooks/theme';
import { useLocale } from '@/app/hooks/locale';
import TDLogo from '@/components/icons/TDLogo';

export default function Header() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { locale, locales } = useLocale();

  return (
    <header
      className="fixed top-0 left-0 w-full z-50"
      style={{
        backgroundColor: 'var(--color-bg, #f7f6f2)',
        borderBottom: '1px solid var(--color-border, #d4d1ca)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0.625rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* ── Brand ── */}
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          aria-label="Tradelia — home"
        >
          <TDLogo size={32} variant="full" color="auto" />
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex" style={{ alignItems: 'center', gap: '1.5rem' }}>
          {([...locales] as string[]).map((l) => (
            <Link
              key={l}
              href={`/${l}`}
              style={{
                fontSize: '0.875rem',
                color: locale === l
                  ? 'var(--color-primary, #01696f)'
                  : 'var(--color-text-muted, #7a7974)',
                fontWeight: locale === l ? 600 : 400,
                textDecoration: 'none',
                transition: 'color 180ms ease',
              }}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </nav>

        {/* ── Right controls ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Theme toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              padding: '0.5rem',
              borderRadius: '9999px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted, #7a7974)',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 180ms ease',
            }}
          >
            {darkMode ? (
              // Sun
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              // Moon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            aria-label="Open menu"
            style={{
              padding: '0.5rem',
              borderRadius: '0.375rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted, #7a7974)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
