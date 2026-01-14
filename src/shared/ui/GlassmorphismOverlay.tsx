/**
 * GlassmorphismOverlay Component - Tradelia 2026
 * 
 * Overlay con effetto vetro (glassmorphism) per stati locked.
 * Usa backdrop-blur e background semi-trasparente.
 * 
 * @requirements 3.5 - Locked state con glassmorphism overlay
 */

import { type ReactNode } from 'react';
import { cn } from './utils';

export type GlassmorphismPosition = 'center' | 'bottom';

export interface GlassmorphismOverlayProps {
  /** Contenuto dell'overlay (es. lock icon, messaggio) */
  children: ReactNode;
  /** Posizione del contenuto */
  position?: GlassmorphismPosition;
  /** Classi CSS aggiuntive */
  className?: string;
}

const POSITION_CLASSES: Record<GlassmorphismPosition, string> = {
  center: 'items-center justify-center',
  bottom: 'items-end justify-center pb-4',
};

/**
 * GlassmorphismOverlay - Overlay vetro per stati locked
 * 
 * Posizionare come child di un elemento con position: relative.
 * L'overlay copre l'intero parent con effetto vetro smerigliato.
 */
export function GlassmorphismOverlay({
  children,
  position = 'bottom',
  className = '',
}: GlassmorphismOverlayProps) {
  return (
    <div
      className={cn(
        'absolute inset-0',
        'bg-card/40 backdrop-blur-[1px]',
        'rounded-xl flex',
        POSITION_CLASSES[position],
        'cursor-not-allowed',
        className
      )}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

GlassmorphismOverlay.displayName = 'GlassmorphismOverlay';
