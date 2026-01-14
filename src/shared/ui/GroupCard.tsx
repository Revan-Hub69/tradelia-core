/**
 * GroupCard Component - Tradelia 2026
 * 
 * Card premium per gruppi di moduli nel learning path.
 * Usa primitives: IconBox, ShineEffect, GlassmorphismOverlay.
 * 
 * @requirements 2.1, 2.2, 2.3, 2.6 - Premium visual design per GroupsView
 */

'use client';

import { type ReactNode } from 'react';
import { cn } from './utils';
import { IconBox, type IconBoxColor } from './IconBox';
import { ShineEffect } from './ShineEffect';

export type GroupCardColor = 'primary' | 'success' | 'warning';

export interface GroupCardProps {
  /** Titolo del gruppo */
  title: string;
  /** Descrizione o sottotitolo */
  description?: string | undefined;
  /** Numero di moduli nel gruppo */
  moduleCount?: number | undefined;
  /** Ore stimate */
  estimatedHours?: number | undefined;
  /** Icona del gruppo */
  icon: ReactNode;
  /** Colore del tema */
  color: GroupCardColor;
  /** Se il gruppo è bloccato */
  isLocked?: boolean | undefined;
  /** Messaggio per stato bloccato */
  lockedMessage?: string | undefined;
  /** Badge aggiuntivo (es. "Completato") */
  badge?: ReactNode | undefined;
  /** Testo CTA (es. "Inizia", "Continua") */
  ctaText?: string | undefined;
  /** Callback click */
  onClick?: (() => void) | undefined;
  /** Classi CSS aggiuntive */
  className?: string | undefined;
}

const COLOR_STYLES: Record<GroupCardColor, {
  bgGradient: string;
  border: string;
  text: string;
  iconBg: IconBoxColor;
  badgeBg: string;
  badgeText: string;
  badgeRing: string;
}> = {
  primary: {
    bgGradient: 'from-primary-500/8 to-primary-500/3',
    border: 'border-primary-500/20',
    text: 'text-primary-600 dark:text-primary-400',
    iconBg: 'primary',
    badgeBg: 'bg-primary-50 dark:bg-primary-900/20',
    badgeText: 'text-primary-700 dark:text-primary-300',
    badgeRing: 'ring-1 ring-inset ring-primary-600/20',
  },
  success: {
    bgGradient: 'from-emerald-500/8 to-emerald-500/3',
    border: 'border-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'success',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeRing: 'ring-1 ring-inset ring-emerald-600/20',
  },
  warning: {
    bgGradient: 'from-amber-500/8 to-amber-500/3',
    border: 'border-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    iconBg: 'warning',
    badgeBg: 'bg-amber-50 dark:bg-amber-900/20',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeRing: 'ring-1 ring-inset ring-amber-600/20',
  },
};

/**
 * GroupCard - Card premium per gruppi di moduli
 * 
 * Features:
 * - IconBox per icona con gradient e glow
 * - ShineEffect per hover
 * - GlassmorphismOverlay per locked state
 * - Hover lift effect
 */
export function GroupCard({
  title,
  description,
  moduleCount,
  estimatedHours,
  icon,
  color,
  isLocked = false,
  lockedMessage,
  badge,
  ctaText = 'Inizia',
  onClick,
  className = '',
}: GroupCardProps) {
  const style = COLOR_STYLES[color];

  // Locked state
  if (isLocked) {
    return (
      <div
        className={cn(
          'relative density-card rounded-xl bg-card border border-border-card overflow-hidden shadow-sm',
          className
        )}
      >
        <div className="flex items-start gap-4">
          {/* Locked icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neutral-400 to-neutral-500 shadow-lg shadow-neutral-500/25 flex items-center justify-center flex-shrink-0">
            <LockIcon className="w-5 h-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-semibold text-enterprise-primary tracking-tight">
                {title}
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-50 dark:bg-neutral-900/20 text-neutral-700 dark:text-neutral-300 text-xs font-medium ring-1 ring-inset ring-neutral-600/20">
                <LockIcon className="w-3 h-3" />
                Bloccato
              </span>
            </div>

            {/* Locked message box */}
            {lockedMessage && (
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary-500/8 to-primary-500/3 border border-primary-500/20">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25 flex items-center justify-center flex-shrink-0">
                    <InfoIcon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-enterprise-secondary leading-relaxed">
                    {lockedMessage}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active state
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative w-full density-card rounded-xl border text-left overflow-hidden',
        'bg-gradient-to-br',
        style.bgGradient,
        style.border,
        'transition-all duration-200 ease-out',
        'hover:translate-y-[-2px] hover:shadow-lg',
        'tap-target-touch focus-enterprise-ring',
        className
      )}
    >
      {/* Shine effect */}
      <ShineEffect />

      <div className="relative z-10 flex items-start gap-4">
        {/* Icon with gradient + glow */}
        <IconBox
          icon={icon}
          color={style.iconBg}
          size="lg"
          animated={true}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-semibold text-enterprise-primary tracking-tight">
              {title}
            </h3>
            {moduleCount !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                  style.badgeBg,
                  style.badgeText,
                  style.badgeRing
                )}
              >
                {moduleCount} moduli
              </span>
            )}
            {badge}
          </div>

          {(description || estimatedHours !== undefined) && (
            <p className="text-sm text-enterprise-secondary leading-relaxed mb-3">
              {description || `~${estimatedHours}h di contenuti`}
            </p>
          )}

          <div className={cn('flex items-center gap-2 text-sm font-medium', style.text)}>
            {ctaText}
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </button>
  );
}

GroupCard.displayName = 'GroupCard';

// Internal icons
function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
