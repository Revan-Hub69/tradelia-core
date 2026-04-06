/**
 * UI STATUS CHIP - Signature Primitive v2
 *
 * SOTA 2026:
 * - Zero colori Tailwind hardcoded (green-700, amber-700, orange-700 rimossi)
 * - Testo sempre muted-foreground — chip è indicatore, non decorazione
 * - Colore semantico solo nel dot (piccolo, non invadente)
 * - bg/border a bassa opacità su token semantici
 * - hover: solo shadow lift, zero scale
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils/Helpers';

export type UiStatusChipVariant = 'info' | 'success' | 'warning' | 'streak' | 'progress';

export type UiStatusChipProps = HTMLAttributes<HTMLDivElement> & {
  variant?: UiStatusChipVariant;
  label: string;
  icon?: ReactNode;
  value?: string | number;
  dot?: boolean;
};

// Variant config — tutto via CSS variables o opacità neutrali
const variantConfig: Record<
  UiStatusChipVariant,
  { chip: string; dot: string }
> = {
  info: {
    chip: 'border-border/60 bg-foreground/5',
    dot:  'bg-foreground/40',
  },
  success: {
    // bg/border: token accent (verde nel sistema) a bassissima opacità
    chip: 'border-[hsl(var(--accent)/0.25)] bg-[hsl(var(--accent)/0.08)]',
    dot:  'bg-[hsl(var(--accent))]',
  },
  warning: {
    chip: 'border-[hsl(var(--warning)/0.25)] bg-[hsl(var(--warning)/0.08)]',
    dot:  'bg-[hsl(var(--warning))]',
  },
  streak: {
    // Streak usa warning tone (amber) — stessa famiglia
    chip: 'border-[hsl(var(--warning)/0.25)] bg-[hsl(var(--warning)/0.08)]',
    dot:  'bg-[hsl(var(--warning))] animate-pulse',
  },
  progress: {
    chip: 'border-[hsl(var(--primary)/0.25)] bg-[hsl(var(--primary)/0.08)]',
    dot:  'bg-[hsl(var(--primary))]',
  },
};

export const UiStatusChip = forwardRef<HTMLDivElement, UiStatusChipProps>(
  ({ className, variant = 'info', label, icon, value, dot = false, ...props }, ref) => {
    const config = variantConfig[variant];

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5',
          'rounded-full',
          'text-sm font-medium text-muted-foreground',
          'border',
          'transition-shadow duration-150',
          // hover: solo shadow, zero scale
          'hover:shadow-sm',
          config.chip,
          className,
        )}
        {...props}
      >
        {/* Dot semantico — il colore è qui, non nel testo */}
        {dot && (
          <span
            className={cn('size-2 rounded-full flex-shrink-0', config.dot)}
            aria-hidden="true"
          />
        )}

        {/* Icon custom */}
        {icon && !dot && (
          <span className="shrink-0 text-foreground/50" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Value */}
        {value !== undefined && (
          <span className="font-semibold text-foreground">
            {value}
          </span>
        )}

        {/* Label */}
        <span className={cn(value !== undefined && 'text-xs')}>
          {label}
        </span>
      </div>
    );
  },
);

UiStatusChip.displayName = 'UiStatusChip';
