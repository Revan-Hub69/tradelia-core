'use client';

/**
 * SimulatorHeader
 * ───────────────
 * Minimal sticky header for /simulatore.
 * Uses TDLogo variant='mark' — sparkline icon only, no wordmark.
 */

import Link from 'next/link';
import TDLogo from '@/components/icons/TDLogo';

export interface SimulatorHeaderProps {
  currentStep?: number;
  totalSteps?: number;
  onShare?: () => void;
}

export default function SimulatorHeader({
  currentStep,
  totalSteps = 4,
  onShare,
}: SimulatorHeaderProps) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        backgroundColor: 'color-mix(in oklch, var(--color-bg, #171614) 92%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border, #393836)',
      }}
    >
      <div
        style={{
          maxWidth: '100%',
          padding: '0.5rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        {/* ── Mark only ── */}
        <Link href="/" aria-label="Torna alla home di Tradelia" style={{ display: 'flex', alignItems: 'center' }}>
          <TDLogo size={24} variant="mark" color="auto" />
        </Link>

        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Link
            href="/"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text-muted, #797876)',
              textDecoration: 'none',
              fontFamily: "'Geist Mono', monospace",
              letterSpacing: '0.02em',
            }}
          >
            tradelia
          </Link>
          <span
            aria-hidden
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text-faint, #5a5957)',
              fontFamily: "'Geist Mono', monospace",
            }}
          >
            /
          </span>
          <span
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text, #cdccca)',
              fontWeight: 500,
              fontFamily: "'Geist Mono', monospace",
              letterSpacing: '0.02em',
            }}
          >
            simulatore
          </span>
        </nav>

        {/* ── Spacer ── */}
        <div style={{ flex: 1 }} />

        {/* ── Step badge ── */}
        {currentStep != null && (
          <div
            aria-label={`Step ${currentStep} di ${totalSteps}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.625rem',
              borderRadius: '9999px',
              border: '1px solid var(--color-border, #393836)',
              backgroundColor: 'var(--color-surface, #1c1b19)',
            }}
          >
            {Array.from({ length: totalSteps }, (_, i) => (
              <span
                key={i}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '9999px',
                  backgroundColor:
                    i < currentStep
                      ? 'var(--color-primary, #4f98a3)'
                      : 'var(--color-surface-dynamic, #2d2c2a)',
                  transition: 'background-color 300ms ease',
                }}
              />
            ))}
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted, #797876)',
                fontFamily: "'Geist Mono', monospace",
                marginLeft: '0.25rem',
              }}
            >
              {currentStep}/{totalSteps}
            </span>
          </div>
        )}

        {/* ── Share button ── */}
        {onShare && (
          <button
            onClick={onShare}
            aria-label="Condividi simulazione"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--color-border, #393836)',
              backgroundColor: 'transparent',
              color: 'var(--color-text-muted, #797876)',
              fontSize: '0.8125rem',
              fontFamily: "'Geist Mono', monospace",
              cursor: 'pointer',
              transition: 'color 180ms ease, border-color 180ms ease',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            condividi
          </button>
        )}
      </div>
    </header>
  );
}
