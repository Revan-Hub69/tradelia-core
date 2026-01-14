/**
 * ShineEffect Component - Tradelia 2026
 * 
 * Effetto shine che scorre on hover per card premium.
 * Usa pseudo-element con gradient per creare riflesso luminoso.
 * 
 * @requirements 2.2, 4.3, 7.2 - Shine animation on hover
 */

import { cn } from './utils';

export interface ShineEffectProps {
  /** Classi CSS aggiuntive */
  className?: string;
}

/**
 * ShineEffect - Effetto riflesso luminoso on hover
 * 
 * Posizionare come child di un elemento con:
 * - position: relative
 * - overflow: hidden
 * - classe 'group' per trigger hover
 * 
 * L'effetto scorre da sinistra a destra quando il parent è in hover.
 */
export function ShineEffect({ className = '' }: ShineEffectProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 rounded-xl pointer-events-none overflow-hidden',
        className
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          'absolute inset-0',
          'bg-gradient-to-r from-transparent via-white/10 to-transparent',
          'translate-x-[-100%] group-hover:translate-x-[100%]',
          'transition-transform duration-1000 ease-out'
        )}
      />
    </div>
  );
}

ShineEffect.displayName = 'ShineEffect';
