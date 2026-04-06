import { cva } from 'class-variance-authority';

/**
 * Badge Variants - Tradelia Design System 2026
 *
 * Semantic badges (success/warning/info):
 * - Background: token color a bassa opacità (10-12%) — sottile, non invadente
 * - Border: token color a bassa opacità (20%) — definisce il contorno senza urlare
 * - Testo: muted-foreground invece di accent saturo — leggibile, non distrae
 *
 * Regola: i badge sono indicatori di stato, NON elementi decorativi.
 * Non devono competere visivamente con i dati.
 */
export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline:
          'border-border text-foreground',
        // Tradelia semantic variants — testo su muted-foreground, bg lieve
        success:
          'border-[hsl(var(--accent)/0.20)] bg-[hsl(var(--accent)/0.10)] text-muted-foreground',
        warning:
          'border-[hsl(var(--warning)/0.20)] bg-[hsl(var(--warning)/0.10)] text-muted-foreground',
        info:
          'border-[hsl(var(--info)/0.20)] bg-[hsl(var(--info)/0.10)] text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
