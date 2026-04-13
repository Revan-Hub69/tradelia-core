// ============================================================
// BROKERS CATALOG — Dati anagrafici broker
//
// Campi obbligatori (nuovi):
//   affiliateUrl  — URL con tracking UTM, null se no affiliazione
//   isAffiliate   — true se riceviamo commissioni
//   esmaRiskPct   — % conti retail in perdita (dichiarato dal broker)
//   esmaLegalName — denominazione legale esatta per disclaimer
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
    notes:            'Broker ECN regolamentato CySEC. Ottimi spread raw su conto Pro.',

    // Affiliate
    affiliateUrl:  null,   // da popolare con link UTM quando disponibile
    isAffiliate:   false,

    // ESMA disclaimer — fonte: sito Tickmill EU aprile 2026
    esmaRiskPct:   74,
    esmaLegalName: 'Tickmill Europe Ltd',
  },

};
