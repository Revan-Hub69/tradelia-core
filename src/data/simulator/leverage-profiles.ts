// ============================================================
// LEVERAGE PROFILES — immutabile
// Leva desiderata dall'utente — input step 4.
// Condiziona strumenti disponibili e amplificazione costi.
// ============================================================

export type LeverageProfileId =
  | 'none'    // 1:1 — nessuna leva
  | 'low'     // 2x – 5x
  | 'medium'  // 5x – 15x
  | 'high';   // 15x+

export type LeverageProfile = {
  id: LeverageProfileId;
  label: string;
  labelEn: string;
  leverageMin: number;       // moltiplicatore minimo (1 = no leva)
  leverageMax: number | null; // null = illimitato (high)
  leverageMid: number;       // valore centrale per calcoli
  icon: string;
  note: string;
  // Strumenti compatibili con questo profilo di leva:
  // - 'none' → spot, ETF fisici, ETP
  // - 'low'  → ETF leva 2x, leva fissa 2x/3x, CFD, futures con margin basso
  // - 'medium' → CFD, turbo KO, mini future, futures, crypto perp moderata
  // - 'high' → turbo KO vicino al barrier, crypto perp alta leva
};

export const LEVERAGE_PROFILES: Record<LeverageProfileId, LeverageProfile> = {
  none: {
    id: 'none',
    label: 'Nessuna leva',
    labelEn: 'No leverage',
    leverageMin: 1,
    leverageMax: 1,
    leverageMid: 1,
    icon: 'ShieldCheck',
    note: 'Esposizione 1:1 sul sottostante. Nessun rischio liquidazione. Adatto a chi vuole esposizione pura senza amplificazione.',
  },
  low: {
    id: 'low',
    label: 'Bassa (2x – 5x)',
    labelEn: 'Low (2x – 5x)',
    leverageMin: 2,
    leverageMax: 5,
    leverageMid: 3,
    icon: 'TrendingUp',
    note: 'Leva moderata. Amplifica i movimenti senza rischio di liquidazione immediata. Compatibile con la maggior parte degli strumenti retail.',
  },
  medium: {
    id: 'medium',
    label: 'Media (5x – 15x)',
    labelEn: 'Medium (5x – 15x)',
    leverageMin: 5,
    leverageMax: 15,
    leverageMid: 10,
    icon: 'Zap',
    note: 'Leva significativa. Financing e KO risk diventano rilevanti. Richiede gestione attiva del rischio e stop precisi.',
  },
  high: {
    id: 'high',
    label: 'Alta (15x+)',
    labelEn: 'High (15x+)',
    leverageMin: 15,
    leverageMax: null,
    leverageMid: 25,
    icon: 'Flame',
    note: 'Leva elevata. Disponibile principalmente su crypto perp e turbo KO molto vicini al barrier. Rischio liquidazione/KO dominante nel costo totale.',
  },
} as const;

export const LEVERAGE_PROFILE_IDS: LeverageProfileId[] = ['none', 'low', 'medium', 'high'];

// Helper: verifica se un leverage profile è compatibile
// con il maxLeverageESMA di uno strumento
export function isLeverageCompatible(
  profileId: LeverageProfileId,
  maxLeverageESMA: number | null,
): boolean {
  const profile = LEVERAGE_PROFILES[profileId];
  // Se lo strumento non ha cap ESMA → sempre compatibile
  if (maxLeverageESMA === null) return true;
  // Se il profilo richiede leva minima superiore al cap → incompatibile
  return profile.leverageMin <= maxLeverageESMA;
}
