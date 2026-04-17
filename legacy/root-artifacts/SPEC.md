# TradeScope Simulator — Technical Specification

> **Ultimo aggiornamento**: Aprile 2026  
> **Status**: Schema completo, dati parziali (1 broker), motore da costruire

---

## 1. Product Definition

**TradeScope** è un simulatore di costi di trading per trader attivi:

- **Input**: broker, strumento, coppia, size conto, leva, orizzonte, frequenza
- **Output**: costo totale annuo per strumento/broker, ranking, warning
- **Dominio**: Forex (spot, CFD, futures), crypto, ETF, certificati

---

## 2. Core Concept

Il problema: stesso asset (es. EUR/USD) su strumenti diversi (spot vs CFD vs futures) ha costi strutturalmente diversi.

Il simulatore normalizza i costi per permettere confronto apples-to-apples.

---

## 3. Architecture

```
src/data/simulator/
├── schema/           # Tipi TypeScript puri (mai modificati)
│   ├── index.ts      # Re-export
│   ├── broker.types.ts
│   └── offer.types.ts
│
├── catalog/          # Dati statici rari
│   ├── brokers.ts    # Anagrafica broker
│   └── account-types.ts
│
├── market-data/      # Dati numerici aggiornabili
│   └── instrument-offers.ts
│
├── underlyings.ts    # Catalogo sottostanti (EUR/USD, GBP/JPY...)
├── instruments.ts    # Definizione strumenti (spot_fx, cfd_ecn, futures_std...)
├── underlying-groups.ts
├── horizons.ts       # orizzonti temporali
├── account-sizes.ts # range size conto
├── leverage-profiles.ts
└── index.ts         # Re-export pubblico
```

---

## 4. Data Flow

```
INPUT UTENTE
  ├── underlyingGroup (ug_fx_major)
  ├── underlying (eurusd)
  ├── horizon (daily)
  ├── frequency (10 trade/giorno)
  ├── accountSize (md = 2.000€)
  └── notional (10.000€)        // esposizione nozionale fissa
        ↓
FILTRO OFFERTE
  ├── brokerId → accountType → minDepositEUR <= accountSize
  ├── ugIds includes underlyingGroup
  ├── compatibleHorizons includes horizon
  └── maxLeverageOffered >= (1 / marginRequirementPct)  // leva effettiva dello strumento
        ↓
CALCOLO COSTI (per offer valida)
  ├── lots = notional / contractSize  // es. 10.000€ / 100.000€ = 0.1 lotti
  ├── spreadCost = spreadAvgBps × notional × (trades/anno)
  ├── commissionCost = commissionPerLot × lots × trades
  ├── overnightCost = overnightPipsPerDay × pipValue × lots × days
  ├── fundingCost (se applicabile)
  ├── fxConversionCost (se applicabile)
  └── totalCostBps = (costo annuo totale / notional) × 10.000
        ↓
OUTPUT
  ├── ranking per broker × strumento (costo totale annuo in EUR o bps)
  ├── costBreakdown (spread/comm/overnight/funding/fx/other)
  ├── compatibilityFlags {
        leverageOk:      maxLeverageOffered >= userDesiredLeverage,
        accountSizeOk:   accountSize >= notional * marginRequirementPct,
        positionSizeOk:  notional >= minPositionEUR,
        horizonOk:       horizon in compatibleHorizons,
        accessibleIT:    broker accessible from Italy
  }
  └── warnings
```

---

## 5. Schema Keys

### InstrumentOffer (chiave)

| Campo | Livello | Descrizione |
|-------|---------|-------------|
| `brokerId` | offer | Identificativo broker |
| `accountTypeId` | offer | Tipo conto (Classic, Pro, VIP...) |
| `instrumentTypeId` | offer | Strumento (spot_fx, cfd_ecn, futures_std...) |
| `underlyingOverrides` | offer | Override per singola coppia |
| `spreadAvgBps` | offer | Spread medio in bps |
| `commissionPerLotUSD` | offer | Commissione per lotto |
| `overnightLongPipsPerDay` | override | Swap long in pip/notte |
| `overnightShortPipsPerDay` | override | Swap short in pip/notte |
| `marginRequirementPct` | override | Margine richiesto |
| `lastUpdated` | offer | Timestamp ISO |

---

## 6. Current Data

**Broker**: Tickmill (CySEC)
- Classic account → cfd_dd, spread incluso, 0 commission
- Pro account → cfd_ecn, raw spread, $6 RT commission

**Coppie**: 20 Forex (7 major + 7 minor + 6 exotic)
**Copertura**: EUR/USD, GBP/USD, USD/JPY, ... USD/TRY

---

## 7. Terminologia Chiave

| Termine | Definizione |
|---------|-------------|
| **InstrumentOffer** | Offerta specifica per broker × conto × strumento |
| **UnderlyingOverride** | Override per singola coppia (spread/swap/margin) |
| **CostStructure** | Definizione qualitativa costi per strumento |
| **ESMA cap** | Leva massima regolamentata EU (30x major, 20x minor) |
| **Roll** | Costo rollover futures (trimestrale) |
| **Rebasing** | Decay ETF leva (leva² × vol² / 2) |

---

## 8. Source of Truth

- `src/data/simulator/schema/offer.types.ts` — tipo InstrumentOffer
- `src/data/simulator/instruments.ts` — CostStructure per strumento
- `docs/README.md` — product direction

---

## 9. NOT in Scope

- Prop-firm challenge simulation (legacy)
- AI trading signals (legacy)
- Multi-broker aggregation (legacy)
- Real-time pricing feed

---

## 10. Next Steps

1. ✅ Schema completo
2. ✅ Dati Tickmill (20 coppie, 2 conti)
3. ⏳ Aggiungere altro broker (es. Pepperstone, IC Markets)
4. ⏳ Costruire motore calcolo costi
5. ⏳ Integrare in UI