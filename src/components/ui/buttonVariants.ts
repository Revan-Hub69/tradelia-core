import { cva } from 'class-variance-authority';

/**
 * Button Variants - Tradelia Design System 2026
 *
 * Regole:
 * - default/primary: bg-primary solido, hover opacity 90%
 * - outline: hover border-border/80 + bg-foreground/5, testo resta foreground (MAI text-primary)
 * - ghost: hover bg-foreground/8, testo resta foreground (MAI text-primary)
 * - secondary: bg-secondary, hover opacity 80%
 * - destructive: bg-destructive
 * - link: underline on hover
 *
 * Transizioni: 200ms ease-out
 * Active: scale(0.98) per feedback tattile
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-border bg-transparent text-foreground hover:border-border/80 hover:bg-foreground/5',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'text-foreground hover:bg-foreground/8',
        link:
          'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm:      'h-9  rounded-lg px-3',
        lg:      'h-11 rounded-lg px-8',
        icon:    'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
