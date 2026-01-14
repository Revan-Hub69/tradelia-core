/**
 * ProgressBarPremium Component - Tradelia 2026
 * 
 * Progress bar premium con shimmer effect e glow.
 * Supporta orientamento orizzontale e verticale.
 * 
 * @requirements 2.3, 3.2, 3.4, 6.3, 7.4 - Progress bar con shimmer effect
 */

import { cn } from './utils';

export type ProgressBarSize = 'sm' | 'md' | 'lg';
export type ProgressBarOrientation = 'horizontal' | 'vertical';

export interface ProgressBarPremiumProps {
  /** Valore del progresso (0-100) */
  value: number;
  /** Dimensione della barra */
  size?: ProgressBarSize;
  /** Mostra effetto shimmer animato */
  showShimmer?: boolean;
  /** Mostra effetto glow */
  showGlow?: boolean;
  /** Orientamento della barra */
  orientation?: ProgressBarOrientation;
  /** Classi CSS aggiuntive */
  className?: string;
}

const HORIZONTAL_SIZE_CLASSES: Record<ProgressBarSize, string> = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
};

const VERTICAL_SIZE_CLASSES: Record<ProgressBarSize, string> = {
  sm: 'w-1',
  md: 'w-1',
  lg: 'w-1.5',
};

/**
 * ProgressBarPremium - Progress bar con effetti premium
 * 
 * Usato per mostrare progresso in GroupsView, ModulesListView e card.
 * L'effetto shimmer richiede la classe animate-shimmer-slow definita in CSS.
 */
export function ProgressBarPremium({
  value,
  size = 'md',
  showShimmer = true,
  showGlow = true,
  orientation = 'horizontal',
  className = '',
}: ProgressBarPremiumProps) {
  const isVertical = orientation === 'vertical';
  const sizeClass = isVertical
    ? VERTICAL_SIZE_CLASSES[size]
    : HORIZONTAL_SIZE_CLASSES[size];

  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn(
        'relative bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden',
        sizeClass,
        isVertical ? 'h-full' : 'w-full',
        className
      )}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress: ${clampedValue}%`}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)',
        }}
        aria-hidden="true"
      />

      {/* Progress fill */}
      <div
        className={cn(
          'rounded-full bg-gradient-to-r from-primary-500 to-primary-600',
          'shadow-sm transition-all duration-500 ease-out',
          'relative overflow-hidden',
          isVertical ? 'w-full absolute bottom-0' : 'h-full'
        )}
        style={{
          [isVertical ? 'height' : 'width']: `${clampedValue}%`,
        }}
      >
        {/* Shimmer effect */}
        {showShimmer && clampedValue > 0 && (
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-slow"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Glow effect */}
      {showGlow && clampedValue > 0 && (
        <div
          className={cn(
            'absolute bg-primary-400/50 blur-sm transition-all duration-500 rounded-full',
            isVertical ? 'w-full bottom-0' : 'h-full left-0'
          )}
          style={{
            [isVertical ? 'height' : 'width']: `${clampedValue}%`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

ProgressBarPremium.displayName = 'ProgressBarPremium';
