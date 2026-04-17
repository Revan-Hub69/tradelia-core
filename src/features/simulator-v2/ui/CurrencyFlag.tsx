'use client';

import { cn } from '@/utils/Helpers';

// Mappa colori distintivi per valute ( TradingView-style)
const CURRENCY_COLORS: Record<string, string> = {
  EUR: 'from-blue-600 to-blue-500', // Europa - blu
  USD: 'from-emerald-600 to-emerald-500', // USA - verde
  GBP: 'from-purple-600 to-purple-500', // UK - viola
  JPY: 'from-red-500 to-red-400', // Giappone - rosso
  CHF: 'from-red-600 to-red-500', // Svizzera - rosso scuro
  AUD: 'from-yellow-500 to-amber-400', // Australia - giallo/oro
  CAD: 'from-red-700 to-red-600', // Canada - rosso
  NZD: 'from-slate-600 to-slate-500', // NZ - grigio/nero
  TRY: 'from-red-500 to-rose-400', // Turchia - rosso
  ZAR: 'from-green-600 to-yellow-500', // Sudafrica - verde/giallo
  MXN: 'from-green-700 to-red-600', // Messico - verde/rosso
  SGD: 'from-red-500 to-white', // Singapore - rosso/bianco
  SEK: 'from-yellow-400 to-blue-600', // Svezia - giallo/blu
};

type CurrencyFlagProps = {
  code: string;
  size?: 'sm' | 'md';
  className?: string;
};

/**
 * CurrencyFlag: cerchio colorato con sigla ISO.
 * Fallback universale per Windows desktop dove le emoji bandiere non funzionano.
 * Design: TradingView-style con gradienti distintivi per area geografica.
 */
export function CurrencyFlag({ code, size = 'sm', className }: CurrencyFlagProps) {
  const colors = CURRENCY_COLORS[code] || 'from-slate-500 to-slate-400';
  const sizeClasses = size === 'sm'
    ? 'w-5 h-5 text-[9px]'
    : 'w-6 h-6 text-[10px]';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-bold tracking-tighter text-white shadow-sm',
        'bg-gradient-to-br',
        colors,
        sizeClasses,
        className,
      )}
      title={code}
    >
      {code.slice(0, 2)}
    </span>
  );
}
