/**
 * ModuleCard Component - Tradelia 2026
 * 
 * Card premium per moduli nel learning path.
 * Usa primitives: ProgressBarPremium, IconBox, ShineEffect, GlassmorphismOverlay.
 * 
 * @requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6 - Premium visual design per ModulesListView
 */

'use client';

import { type ReactNode } from 'react';
import { cn } from './utils';
import { ShineEffect } from './ShineEffect';
import { GlassmorphismOverlay } from './GlassmorphismOverlay';
import { ProgressBarPremium } from './ProgressBarPremium';

export interface ModuleCardProps {
  /** Titolo del modulo */
  title: string;
  /** Numero del modulo (1-based) */
  moduleNumber: number;
  /** Tempo stimato in minuti */
  estimatedMinutes?: number;
  /** Se il modulo è completato */
  isCompleted?: boolean;
  /** Se il modulo è bloccato */
  isLocked?: boolean;
  /** Percentuale di progresso (0-100) per la barra verticale */
  progressPercent?: number;
  /** Badge aggiuntivo */
  badge?: ReactNode;
  /** Callback click */
  onClick?: () => void;
  /** Classi CSS aggiuntive */
  className?: string;
}

/**
 * ModuleCard - Card premium per moduli
 * 
 * Features:
 * - ProgressBarPremium verticale sul lato sinistro
 * - Number badge premium con gradient
 * - ShineEffect per hover
 * - GlassmorphismOverlay per locked state
 * - Completion checkmark animato
 */
export function ModuleCard({
  title,
  moduleNumber,
  estimatedMinutes,
  isCompleted = false,
  isLocked = false,
  progressPercent = 0,
  badge,
  onClick,
  className = '',
}: ModuleCardProps) {
  // Locked state
  if (isLocked) {
    return (
      <div className={cn('relative', className)}>
        {/* Vertical progress bar on left */}
        <div className="absolute left-0 top-0 bottom-0 w-1">
          <ProgressBarPremium
            value={progressPercent}
            orientation="vertical"
            size="sm"
            showShimmer={false}
            showGlow={false}
          />
        </div>

        <div className="pl-4 density-card rounded-xl bg-card border border-border-card overflow-hidden relative shadow-sm">
          <div className="flex items-center gap-4">
            {/* Number badge */}
            <NumberBadge number={moduleNumber} />

            {/* Module info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-enterprise-primary truncate tracking-tight mb-1">
                {title}
              </h3>
              {estimatedMinutes !== undefined && (
                <div className="flex items-center gap-2 text-sm text-enterprise-secondary">
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>~{estimatedMinutes} min</span>
                </div>
              )}
            </div>
          </div>

          {/* Glassmorphism overlay */}
          <GlassmorphismOverlay position="bottom">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/90 rounded-full border border-border-card shadow-sm">
              <LockIcon className="w-3.5 h-3.5 text-enterprise-secondary" />
              <span className="text-xs font-medium text-enterprise-secondary">
                Bloccato
              </span>
            </div>
          </GlassmorphismOverlay>
        </div>
      </div>
    );
  }

  // Active state
  return (
    <div className={cn('relative', className)}>
      {/* Vertical progress bar on left with glow */}
      <div className="absolute left-0 top-0 bottom-0 w-1">
        <ProgressBarPremium
          value={progressPercent}
          orientation="vertical"
          size="sm"
          showShimmer={false}
          showGlow={true}
        />
      </div>

      <button
        onClick={onClick}
        className={cn(
          'group relative w-full pl-4 density-card rounded-xl border text-left overflow-hidden',
          'bg-card border-border-card',
          'transition-all duration-200 ease-out',
          'hover:border-primary-500/30 hover:shadow-lg hover:translate-y-[-2px]',
          'tap-target-touch focus-enterprise-ring'
        )}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

        {/* Shine effect */}
        <ShineEffect />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Number badge */}
            <NumberBadge number={moduleNumber} />

            {/* Module info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-enterprise-primary truncate tracking-tight">
                  {title}
                </h3>
                {isCompleted && <CompletionCheckmark />}
                {badge}
              </div>
              {estimatedMinutes !== undefined && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>~{estimatedMinutes} min</span>
                </div>
              )}
            </div>
          </div>

          {/* Arrow */}
          <ArrowRightIcon className="w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </button>
    </div>
  );
}

ModuleCard.displayName = 'ModuleCard';

// Internal components
function NumberBadge({ number }: { number: number }) {
  return (
    <div className="flex-shrink-0">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/10 to-primary-500/5 border border-primary-500/20 flex items-center justify-center shadow-sm">
        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
          {number}
        </span>
      </div>
    </div>
  );
}

function CompletionCheckmark() {
  return (
    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm animate-zoom-in">
      <CheckIcon className="w-3 h-3 text-white" />
    </div>
  );
}

// Internal icons
function ClockIcon({ className }: { className?: string }) {
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
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

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
