// ============================================================
// LEVERAGE PROFILES — immutabile
// Leva desiderata dall'utente — input step 4.
// ============================================================

import type { UnderlyingGroupId } from './underlying-groups';
import { UNDERLYING_GROUPS }      from './underlying-groups';

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
  },
} as const;

export const LEVERAGE_PROFILE_IDS: LeverageProfileId[] = ['none', 'low', 'medium', 'high'];

// ============================================================
// HELPER: leva effettiva clampata
// effectiveLeverage = min(profile.leverageMid, ug.esmaLeverageCap, instrumentCap)
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
// Un profilo è disponibile se la sua leverageMin è ≤ esmaLeverageCap del gruppo.
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

// Helper legacy — backward compat
export function isLeverageCompatible(
  profileId: LeverageProfileId,
  maxLeverageESMA: number | null,
): boolean {
  if (maxLeverageESMA === null) return true;
  return LEVERAGE_PROFILES[profileId].leverageMin <= maxLeverageESMA;
}
