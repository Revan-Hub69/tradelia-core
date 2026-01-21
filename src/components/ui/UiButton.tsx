/**
 * UI BUTTON - Signature Primitive v1
 *
 * Sostituisce: SignatureButton, press-depth, CTA header
 * 
 * REGOLE:
 * - focus-visible
 * - aria compliant
 * - Zero side effects
 * - Server-safe (no 'use client' needed for base)
 */

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '@/utils/Helpers';

const uiButtonVariants = cva(
  // Base styles
  cn(
    'inline-flex items-center justify-center gap-2',
    'rounded-xl font-medium',
    'transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    // Signature press feedback (CSS-only)
    'active:scale-[0.98] active:translate-y-[1px]',
    'active:transition-transform active:duration-75',
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'bg-primary text-primary-foreground',
          'hover:bg-primary/90',
          'shadow-[0_2px_8px_rgba(59,130,246,0.2)]',
          'hover:shadow-[0_4px_16px_rgba(59,130,246,0.3)]',
        ),
        secondary: cn(
          'bg-secondary text-secondary-foreground',
          'hover:bg-secondary/80',
          'border border-border/50',
        ),
        ghost: cn(
          'hover:bg-accent hover:text-accent-foreground',
          'data-[active=true]:bg-accent data-[active=true]:text-accent-foreground',
        ),
        icon: cn(
          'size-9 p-0',
          'hover:bg-accent hover:text-accent-foreground',
          'data-[active=true]:bg-accent data-[active=true]:text-accent-foreground',
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

/**
 * UiButton - Foundation button component
 * 
 * Usage:
 * - Primary: <UiButton variant="primary">Save</UiButton>
 * - Secondary: <UiButton variant="secondary">Cancel</UiButton>
 * - Ghost: <UiButton variant="ghost">Edit</UiButton>
 * - Icon: <UiButton variant="icon"><Icon /></UiButton>
 * - As Link: <UiButton asChild><Link href="...">Go</Link></UiButton>
 */
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
