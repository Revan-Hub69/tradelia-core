// ============================================================
// HORIZONS — immutabile
// 3 orizzonti temporali operativi
// ============================================================

export type HorizonId = 'scalping' | 'intraday' | 'multiday';

export type Horizon = {
  id: HorizonId;
  label: string;
  labelEn: string;
  description: string;
  holdingMinutes: { min: number; max: number }; // durata tipica posizione
  holdingDays: number;                           // giorni medi per calcolo costi (es. financing)
  icon: string;
};

export const HORIZONS: Record<HorizonId, Horizon> = {
  scalping: {
    id: 'scalping',
    label: 'Scalping',
    labelEn: 'Scalping',
    description: 'Posizioni da secondi a pochi minuti. Entrata e uscita nello stesso tick.',
    holdingMinutes: { min: 0, max: 15 },
    holdingDays: 0, // nessun overnight → financing = 0
    icon: 'Zap',
  },
  intraday: {
    id: 'intraday',
    label: 'Intraday',
    labelEn: 'Intraday',
    description: 'Posizioni aperte e chiuse nella stessa sessione di mercato.',
    holdingMinutes: { min: 15, max: 480 },
    holdingDays: 0, // chiusura a fine sessione → financing quasi zero
    icon: 'Sun',
  },
  multiday: {
    id: 'multiday',
    label: 'Multiday',
    labelEn: 'Swing / Multiday',
    description: 'Posizioni tenute per più giorni. Overnight financing rilevante.',
    holdingMinutes: { min: 480, max: 14400 },
    holdingDays: 3, // media 3 giorni per calcolo costi
    icon: 'CalendarDays',
  },
} as const;

export const HORIZON_IDS: HorizonId[] = ['scalping', 'intraday', 'multiday'];
