// ============================================================
// POSITION SIZES — immutabile
// Percentuale del conto allocata per singola operazione.
// Valori relativi — si applicano a qualsiasi AccountSize.
// ============================================================

import type { AccountSizeId } from './account-sizes';

export type PositionSizeId =
  | 'micro'   // < 5% del conto
  | 'small'   // 5 – 15% del conto
  | 'medium'  // 15 – 30% del conto
  | 'large';  // > 30% del conto

export type PositionSize = {
  id: PositionSizeId;
  label: string;
  labelEn: string;
  pctMin: number;  // % minima sul conto
  pctMax: number;  // % massima sul conto (100 = nessun limite)
  pctMid: number;  // % centrale usata per calcoli
  icon: string;
  note: string;    // nota operativa
};

export const POSITION_SIZES: Record<PositionSizeId, PositionSize> = {
  micro: {
    id: 'micro',
    label: '< 5% del conto',
    labelEn: '< 5% of account',
    pctMin: 0,
    pctMax: 5,
    pctMid: 2.5,
    icon: 'Minimize2',
    note: 'Gestione del rischio conservativa. Adatta a strategie ad alta frequenza.',
  },
  small: {
    id: 'small',
    label: '5 – 15% del conto',
    labelEn: '5 – 15% of account',
    pctMin: 5,
    pctMax: 15,
    pctMid: 10,
    icon: 'Minus',
    note: 'Dimensionamento standard per trader attivi.',
  },
  medium: {
    id: 'medium',
    label: '15 – 30% del conto',
    labelEn: '15 – 30% of account',
    pctMin: 15,
    pctMax: 30,
    pctMid: 22.5,
    icon: 'Plus',
    note: 'Esposizione elevata. Richiede alta selettività nei setup.',
  },
  large: {
    id: 'large',
    label: '> 30% del conto',
    labelEn: '> 30% of account',
    pctMin: 30,
    pctMax: 100,
    pctMid: 50,
    icon: 'Maximize2',
    note: 'Esposizione molto aggressiva. Pochi trade concentrati.',
  },
} as const;

export const POSITION_SIZE_IDS: PositionSizeId[] = ['micro', 'small', 'medium', 'large'];

// Helper: calcola position size in EUR dato account size mid e position size mid
export function computePositionEUR(
  accountMidEUR: number,
  positionPctMid: number,
): number {
  return (accountMidEUR * positionPctMid) / 100;
}

// Helper: position sizes consigliate per account size
// Evita combinazioni non realistiche (es. large position su conto xs)
export const RECOMMENDED_POSITION_SIZES: Record<AccountSizeId, PositionSizeId[]> = {
  xs: ['micro', 'small'],
  sm: ['micro', 'small', 'medium'],
  md: ['micro', 'small', 'medium', 'large'],
  lg: ['micro', 'small', 'medium', 'large'],
  xl: ['micro', 'small', 'medium', 'large'],
};
