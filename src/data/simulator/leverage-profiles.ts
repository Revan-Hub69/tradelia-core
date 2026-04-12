// ============================================================
// LEVERAGE PROFILES — immutabile
// Leva desiderata dall'utente — input step 4.
//
// NOTA: per asset class 'forex' il selettore leva NON viene mostrato
// nel frontend. La leva su FX è implicita (ESMA cap) o implicita
// nel contratto (futures). Usare excludedAssetClasses per il controllo UI.
// ============================================================

import type { UnderlyingGroupId } from './underlying-groups';
import { UNDERLYING_GROUPS }      from './underlying-groups';
import type { AssetClassId }      from './underlying-groups';

export type LeverageProfileId =
  | 'none'    // nessuna leva
  | 'low'     // bassa
  | 'medium'  // media
  | 'high';   // alta

export type LeverageProfile = {
  id: LeverageProfileId;
  label: string;
  labelEn: string;
  leverageMin: number;
  leverageMax: number | null;
  leverageMid: number;
  leverageMaxRetailEU: number | null;
  icon: string;
  note: string;
  /**
   * Asset class per cui questo profilo NON deve essere mostrato nel frontend.
   * Il frontend nasconde l'intero selettore leva quando
   * l'asset class selezionata è in questo array.
   *
   * 'forex' → leva implicita nel cap ESMA (CFD/Spot) o nel margine CME (Futures).
   *           L'utente non sceglie la leva — la sceglie il motore.
   */
  excludedAssetClasses: AssetClassId[];
};

export const LEVERAGE_PROFILES: Record<LeverageProfileId, LeverageProfile> = {
  none: {
    id: 'none',
    label: 'Nessuna',
    labelEn: 'None',
    leverageMin: 1,
    leverageMax: 1,
    leverageMid: 1,
    leverageMaxRetailEU: 1,
    icon: 'ShieldCheck',
    note: 'Esposizione 1:1 sul sottostante. Nessun rischio liquidazione.',
    excludedAssetClasses: ['forex'],
  },
  low: {
    id: 'low',
    label: 'Bassa',
    labelEn: 'Low',
    leverageMin: 2,
    leverageMax: 5,
    leverageMid: 3,
    leverageMaxRetailEU: 5,
    icon: 'TrendingUp',
    note: 'Leva contenuta. Amplifica i movimenti senza rischio di liquidazione immediata.',
    excludedAssetClasses: ['forex'],
  },
  medium: {
    id: 'medium',
    label: 'Media',
    labelEn: 'Medium',
    leverageMin: 5,
    leverageMax: 20,
    leverageMid: 10,
    leverageMaxRetailEU: 20,
    icon: 'Zap',
    note: 'Leva significativa. I costi di finanziamento diventano rilevanti nel tempo.',
    excludedAssetClasses: ['forex'],
  },
  high: {
    id: 'high',
    label: 'Alta',
    labelEn: 'High',
    leverageMin: 20,
    leverageMax: 30,
    leverageMid: 25,
    leverageMaxRetailEU: 30,
    icon: 'Flame',
    note: 'Leva elevata. Disponibile solo su alcuni mercati regolamentati EU. Rischio liquidazione dominante.',
    excludedAssetClasses: ['forex'],
  },
} as const;

export const LEVERAGE_PROFILE_IDS: LeverageProfileId[] = ['none', 'low', 'medium', 'high'];

// ============================================================
// HELPER: il selettore leva va mostrato per questa asset class?
// Usato dal frontend per nascondere l'intero step leva.
// ============================================================
export function isLeverageSelectorVisible(assetClass: AssetClassId): boolean {
  // Se tutti i profili escludono questa asset class → nascondi il selettore
  return LEVERAGE_PROFILE_IDS.some(
    id => !LEVERAGE_PROFILES[id].excludedAssetClasses.includes(assetClass),
  );
}

// ============================================================
// HELPER: leva effettiva clampata
// ============================================================
export function getEffectiveLeverage(
  profileId: LeverageProfileId,
  ugId: UnderlyingGroupId,
  instrumentMaxLeverageESMA: number | null = null,
): number {
  const profile = LEVERAGE_PROFILES[profileId];
  const ug      = UNDERLYING_GROUPS[ugId];

  const candidates: number[] = [
    profile.leverageMid,
    ...(ug.esmaLeverageCap          !== null ? [ug.esmaLeverageCap]          : []),
    ...(instrumentMaxLeverageESMA   !== null ? [instrumentMaxLeverageESMA]   : []),
    ...(profile.leverageMaxRetailEU !== null ? [profile.leverageMaxRetailEU] : []),
  ];

  return Math.min(...candidates);
}

// ============================================================
// HELPER: profili disponibili per un dato gruppo (filtro UI)
// ============================================================
export function getAvailableLeverageProfiles(
  ugId: UnderlyingGroupId,
  isCryptoNative = false,
): LeverageProfileId[] {
  if (isCryptoNative) return LEVERAGE_PROFILE_IDS;

  const cap = UNDERLYING_GROUPS[ugId].esmaLeverageCap;
  if (cap === null) return LEVERAGE_PROFILE_IDS;

  return LEVERAGE_PROFILE_IDS.filter(id =>
    LEVERAGE_PROFILES[id].leverageMin <= cap,
  );
}

export function isLeverageCompatible(
  profileId: LeverageProfileId,
  maxLeverageESMA: number | null,
): boolean {
  if (maxLeverageESMA === null) return true;
  return LEVERAGE_PROFILES[profileId].leverageMin <= maxLeverageESMA;
}
