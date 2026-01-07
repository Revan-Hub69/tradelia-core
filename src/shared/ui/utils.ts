/**
 * UI Utility Functions - Tradelia 2026
 * 
 * Funzioni di utilità per la gestione delle classi CSS e styling
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina classi CSS con supporto per Tailwind CSS
 * Utilizza clsx per la logica condizionale e twMerge per evitare conflitti
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Genera classi per transizioni seguendo i principi Tradelia 2026
 * - Durata: 150ms
 * - Easing: cubic-bezier(0.4, 0, 0.2, 1)
 */
export const transitionSubtle = 'transition-all duration-150 ease-out';

/**
 * Classi per micro-interazioni card seguendo Tradelia 2026
 */
export const cardInteractive = cn(
  'hover:bg-muted/30 hover:-translate-y-px hover:shadow-md',
  'cursor-pointer',
  transitionSubtle
);

/**
 * Classi per focus accessibile (WCAG AAA+)
 */
export const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2';

/**
 * Verifica se il dispositivo supporta hover
 */
export function supportsHover(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover)').matches;
}

/**
 * Verifica se l'utente preferisce ridurre le animazioni
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}