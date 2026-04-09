// ============================================================
// SCHEMA — Re-export pulito dei tipi
// Questo file fa solo re-export dai file tipi specifici.
// Non contiene definizioni proprie.
// ============================================================

// Re-export da broker.types
export type { BrokerId, Broker, RegulationZone, PlatformType, AccountTypeId, AccountType } from './broker.types';

// Re-export da offer.types
export type { InstrumentOffer, UnderlyingOfferOverride, RankedResult, ExecutionType } from './offer.types';

// Re-export da underlyings (il file canonical per UnderlyingId)
export type { UnderlyingId, Underlying, TradingSession, CarryDirection } from '../underlyings';

// Re-export da underlying-groups
export type { UnderlyingGroupId } from '../underlying-groups';

// Re-export da instruments
export type { InstrumentTypeId } from '../instruments';

// Re-export da horizons
export type { HorizonId } from '../horizons';

// Re-export da account-sizes
export type { AccountSizeId } from '../account-sizes';

// Re-export da leverage-profiles
export type { LeverageProfileId } from '../leverage-profiles';