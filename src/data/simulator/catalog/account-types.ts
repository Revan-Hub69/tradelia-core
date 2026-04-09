// ============================================================
// ACCOUNT TYPES CATALOG — Dati account type (raramene modificati)
// ============================================================

import type { AccountType, AccountTypeId, BrokerId } from '../schema/broker.types';

export const ACCOUNT_TYPES: AccountType[] = [

  {
    id:                         'tickmill_classic',
    brokerId:                   'tickmill',
    label:                      'Classic',
    labelEn:                    'Classic',
    accountCurrencies:          ['EUR', 'USD', 'GBP'],
    minDepositEUR:              100,
    compatibleAccountSizes:     ['small', 'medium', 'large'],
    compatibleLeverageProfiles: ['retail', 'pro'],
    notes:                      'Spread incluso (non raw). Nessuna commissione esplicita. Adatto a trader infrequenti.',
  },

  {
    id:                         'tickmill_pro',
    brokerId:                   'tickmill',
    label:                      'Pro',
    labelEn:                    'Pro (Raw ECN)',
    accountCurrencies:          ['EUR', 'USD', 'GBP'],
    minDepositEUR:              100,
    compatibleAccountSizes:     ['small', 'medium', 'large'],
    compatibleLeverageProfiles: ['retail', 'pro'],
    notes:                      'Raw spread from LP + commissione. Costo totale più basso su EUR/USD. Consigliato per trader attivi.',
  },

];