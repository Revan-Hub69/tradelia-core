// ============================================================
// LEVERAGE PROFILES — immutabile
// Leva desiderata dall'utente — input step 4.
// Condiziona strumenti disponibili e amplificazione costi.
//
// AGGIORNAMENTO: aggiunto leverageMaxRetailEU per ogni profilo.
//   È il cap effettivo di leva che un broker EU regolamentato
//   può offrire per quel profilo — usato dal motore per
//   calcolare la leva effettiva clampata:
//
//     effectiveLeverage = min(
//       profile.leverageMid,
//       ug.esmaLeverageCap,        ← cap per gruppo sottostante
//       instrument.maxLeverageESMA ← cap per tipo strumento
//     )
//
//   Se tutti e tre sono null → leva libera (crypto native).
// ============================================================

import type { UnderlyingGroupId } from './underlying-groups';
import { UNDERLYING_GROUPS }      from './underlying-groups';

export type LeverageProfileId =
  | 'none'    // 1:1 — nessuna leva
  | 'low'     // 2x – 5x
  | 'medium'  // 5x – 20x
  | 'high';   // 20x+

export type LeverageProfile = {
  id: LeverageProfileId;
  label: string;
  labelEn: string;
  leverageMin: number;
  leverageMax: number | null;
  leverageMid: number;
  /**
   * Cap massimo di leva che un broker retail EU può erogare
   * per questo profilo, ignorando i cap per UG/strumento.
   * Usato come terzo termine del min() nel motore.
   * null = nessun cap dal profilo stesso (dipende tutto da UG + strumento).
   */
  leverageMaxRetailEU: number | null;
  icon: string;
  note: string;
};

export const LEVERAGE_PROFILES: Record<LeverageProfileId, LeverageProfile> = {
  none: {
    id: 'none',
    label: 'Nessuna leva',
    labelEn: 'No leverage',
    leverageMin: 1,
    leverageMax: 1,
    leverageMid: 1,
    leverageMaxRetailEU: 1,
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
    leverageMaxRetailEU: 5,
    icon: 'TrendingUp',
    note: 'Leva moderata. Amplifica i movimenti senza rischio di liquidazione immediata. Compatibile con la maggior parte degli strumenti retail.',
  },
  medium: {
    id: 'medium',
    label: 'Media (5x – 20x)',
    labelEn: 'Medium (5x – 20x)',
    leverageMin: 5,
    leverageMax: 20,
    leverageMid: 10,
    leverageMaxRetailEU: 20,
    icon: 'Zap',
    note: 'Leva significativa. Financing e KO risk diventano rilevanti. Disponibile su Forex major/minor e indici principali con broker EU.',
  },
  high: {
    id: 'high',
    label: 'Alta (20x – 30x)',
    labelEn: 'High (20x – 30x)',
    leverageMin: 20,
    leverageMax: 30,
    leverageMid: 25,
    leverageMaxRetailEU: 30, // cap massimo ESMA raggiungibile (Forex major)
    icon: 'Flame',
    note: 'Leva elevata. Disponibile solo su Forex major (max 30:1 ESMA) con broker ECN. Su minor il cap è 20:1, su exotic 10:1. Non disponibile su azioni, crypto CFD o indici minori.',
  },
} as const;

export const LEVERAGE_PROFILE_IDS: LeverageProfileId[] = ['none', 'low', 'medium', 'high'];

// ============================================================
// HELPER: calcola leva effettiva clampata
// ============================================================
/**
 * Restituisce la leva effettiva per la combinazione
 * profilo × gruppo sottostante × cap strumento.
 *
 * Tutti i termini del min() sono opzionali — se null vengono ignorati.
 */
export function getEffectiveLeverage(
  profileId: LeverageProfileId,
  ugId: UnderlyingGroupId,
  instrumentMaxLeverageESMA: number | null = null,
): number {
  const profile = LEVERAGE_PROFILES[profileId];
  const ug      = UNDERLYING_GROUPS[ugId];

  const candidates: number[] = [
    profile.leverageMid,
    ...(ug.esmaLeverageCap           !== null ? [ug.esmaLeverageCap]           : []),
    ...(instrumentMaxLeverageESMA    !== null ? [instrumentMaxLeverageESMA]    : []),
    ...(profile.leverageMaxRetailEU  !== null ? [profile.leverageMaxRetailEU]  : []),
  ];

  return Math.min(...candidates);
}

// ============================================================
// HELPER: profili leva disponibili per un dato gruppo (filtro UI)
// ============================================================
/**
 * Restituisce i LeverageProfileId che hanno senso per un dato UG.
 *
 * Un profilo è "disponibile" se la sua leva minima è ≤ esmaLeverageCap del gruppo,
 * oppure se il gruppo non ha cap (null → crypto native).
 *
 * Esempi:
 *   ug_fx_major  (cap 30) → tutti i profili incluso 'high'
 *   ug_fx_minor  (cap 20) → 'none','low','medium' + 'high' (leverageMin=20 ≤ 20) ✅
 *   ug_fx_exotic (cap 10) → 'none','low','medium' (leverageMin=5 ≤ 10)
 *                           'high' escluso (leverageMin=20 > 10) ❌
 *   ug_eq_*      (cap 5)  → 'none','low' (leverageMin=2 ≤ 5)
 *                           'medium' escluso (leverageMin=5 ≤ 5) ✅ borderline incluso
 *                           'high' escluso ❌
 *   ug_crypto_*  (cap 2)  → solo 'none' e 'low' per CFD
 *                           ma crypto native ignorano il cap → tutti disponibili
 */
export function getAvailableLeverageProfiles(
  ugId: UnderlyingGroupId,
  isCryptoNative = false,
): LeverageProfileId[] {
  // Crypto native (exchange/perp/spot) — nessun cap ESMA
  if (isCryptoNative) return LEVERAGE_PROFILE_IDS;

  const cap = UNDERLYING_GROUPS[ugId].esmaLeverageCap;

  // Nessun cap (non dovrebbe accadere per strumenti regolati)
  if (cap === null) return LEVERAGE_PROFILE_IDS;

  return LEVERAGE_PROFILE_IDS.filter(id => {
    const profile = LEVERAGE_PROFILES[id];
    // Il profilo è disponibile se la sua leva MINIMA è ≤ cap del gruppo.
    // Significa che almeno una parte del range del profilo è raggiungibile.
    return profile.leverageMin <= cap;
  });
}

// Helper legacy — mantenuto per compatibilità backward
export function isLeverageCompatible(
  profileId: LeverageProfileId,
  maxLeverageESMA: number | null,
): boolean {
  if (maxLeverageESMA === null) return true;
  const profile = LEVERAGE_PROFILES[profileId];
  return profile.leverageMin <= maxLeverageESMA;
}
