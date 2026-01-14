/**
 * DecorativeDivider Component - Tradelia 2026
 * 
 * Separatore decorativo premium per sezioni.
 * Varianti: dots (tre punti), line (linea gradient), diamond (rombo centrale)
 * 
 * @requirements 2.4, 5.2 - Decorative dividers coerenti con ModuleContent
 */

import { cn } from './utils';

export interface DecorativeDividerProps {
  /** Variante del divider */
  variant?: 'dots' | 'line' | 'diamond';
  /** Spacing verticale */
  spacing?: 'sm' | 'md' | 'lg';
  /** Classi CSS aggiuntive */
  className?: string;
}

const spacingClasses = {
  sm: 'py-4',
  md: 'py-6',
  lg: 'py-8',
} as const;

/**
 * DecorativeDivider - Separatore decorativo premium
 * 
 * Usato per separare sezioni con stile coerente attraverso tutto il learning path.
 */
export function DecorativeDivider({
  variant = 'dots',
  spacing = 'md',
  className = '',
}: DecorativeDividerProps) {
  const spacingClass = spacingClasses[spacing];

  if (variant === 'dots') {
    return (
      <div
        className={cn(
          'flex items-center gap-4',
          spacingClass,
          className
        )}
        role="separator"
        aria-hidden="true"
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-500/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary-500/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary-500/40" />
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      </div>
    );
  }

  if (variant === 'diamond') {
    return (
      <div
        className={cn(
          'flex items-center justify-center gap-3',
          spacingClass,
          className
        )}
        role="separator"
        aria-hidden="true"
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/50" />
        <div className="w-3 h-3 rotate-45 bg-primary-500/60 rounded-sm" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/50" />
      </div>
    );
  }

  // variant === 'line'
  return (
    <div
      className={cn(spacingClass, className)}
      role="separator"
      aria-hidden="true"
    >
      <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
    </div>
  );
}

DecorativeDivider.displayName = 'DecorativeDivider';
