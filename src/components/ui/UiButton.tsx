/**
 * UI BUTTON - Signature Primitive v2
 *
 * SOTA 2026:
 * - primary shadow: hsl(var(--primary)/0.20) — token-aware, dark mode safe
 * - ghost/icon hover: bg-foreground/8 (neutro) invece di bg-accent (colorato)
 * - active: scale(0.98) + translate-y(1px) per feedback tattile realistico
 */

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/utils/Helpers';

const uiButtonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-2',
    'rounded-xl font-medium',
    'transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98] active:translate-y-[1px]',
    'active:transition-transform active:duration-75',
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'bg-primary text-primary-foreground',
          'hover:bg-primary/90',
          // Shadow token-aware: usa hsl(var(--primary)) invece di rgba hardcoded
          'shadow-[0_2px_8px_hsl(var(--primary)/0.20)]',
          'hover:shadow-[0_4px_16px_hsl(var(--primary)/0.28)]',
        ),
        secondary: cn(
          'bg-secondary text-secondary-foreground',
          'hover:bg-secondary/80',
          'border border-border/50',
        ),
        ghost: cn(
          'text-foreground',
          // Neutro su hover — MAI bg-accent (colorato)
          'hover:bg-foreground/8',
          'data-[active=true]:bg-foreground/8 data-[active=true]:text-foreground',
        ),
        icon: cn(
          'size-9 p-0',
          'text-foreground/70',
          // Neutro su hover — MAI bg-accent
          'hover:bg-foreground/8 hover:text-foreground',
          'data-[active=true]:bg-foreground/8 data-[active=true]:text-foreground',
        ),
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type UiButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof uiButtonVariants> & {
    asChild?: boolean;
  };

export const UiButton = forwardRef<HTMLButtonElement, UiButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(uiButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

UiButton.displayName = 'UiButton';
