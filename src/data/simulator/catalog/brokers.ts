// ============================================================
// BROKERS CATALOG — Dati anagrafici broker (raramene modificati)
// ============================================================

import type { Broker, BrokerId, RegulationZone, PlatformType } from '../schema/broker.types';

export const BROKERS: Partial<Record<BrokerId, Broker>> = {

  tickmill: {
    id:               'tickmill',
    name:             'Tickmill',
    logoSlug:         'tickmill',
    website:          'https://www.tickmill.com/eu/it',
    regulationZones:  ['CY', 'UK'],
    accessibleFromIT: true,
    minDepositEUR:    100,
    platformTypes:    ['mt4', 'mt5', 'proprietary'],
    notes:             'Broker ECN regolamentato CySEC. Ottimi spread raw su conto Pro. Nessun deposito minimo.',
  },

};