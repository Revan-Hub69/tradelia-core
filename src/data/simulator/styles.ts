// ============================================================
// TRADING STYLES / FREQUENCIES — immutabile
// 3 stili operativi con frequenza trades per sessione
// ============================================================

export type StyleId = 'selective' | 'active' | 'high_freq';

export type TradingStyle = {
  id: StyleId;
  label: string;
  labelEn: string;
  description: string;
  tradesPerDay: number;   // numero medio trade/sessione
  icon: string;
};

export const TRADING_STYLES: Record<StyleId, TradingStyle> = {
  selective: {
    id: 'selective',
    label: 'Selettivo',
    labelEn: 'Selective',
    description: 'Pochi trade al giorno, alta selezione dei setup. Max 3–4 operazioni.',
    tradesPerDay: 2,
    icon: 'Target',
  },
  active: {
    id: 'active',
    label: 'Attivo',
    labelEn: 'Active',
    description: 'Trading continuativo durante la sessione. 5–10 operazioni al giorno.',
    tradesPerDay: 7,
    icon: 'Activity',
  },
  high_freq: {
    id: 'high_freq',
    label: 'Alta Frequenza',
    labelEn: 'High Frequency',
    description: 'Operatività intensa, molti trade brevi. 15+ operazioni al giorno.',
    tradesPerDay: 20,
    icon: 'Cpu',
  },
} as const;

export const STYLE_IDS: StyleId[] = ['selective', 'active', 'high_freq'];
