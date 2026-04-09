// ============================================================
// SIMULATOR DATA — re-export pubblico
// ============================================================

// Schema — tipi puri (re-export compatto)
export * from './schema';

// Catalog — dati statici stabili
export * from './underlying-groups';
export * from './instruments';
export * from './catalog/brokers';
export * from './catalog/account-types';

// Market-data — dati numerici (aggiornati periodicamente)
export * from './market-data/instrument-offers';

// Altri dati statici
export * from './horizons';
export * from './styles';
export * from './account-sizes';
export * from './leverage-profiles';
export * from './underlyings';