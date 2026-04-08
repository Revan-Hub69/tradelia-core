# Schema Database Simulatore

## Panoramica

Il simulatore è un sistema di matching che consente di identificare il broker/strumento ottimale dato un profilo di trading. La struttura dati è composta da layer indipendenti:

```
SimulatorState (input utente)
    ↓
filterBrokers() → InstrumentOffer[] compatibili
    ↓
scoreBroker() → RankedResult[] ordinati per costo totale
```

---

## 1. Layer Immutabili (Configurazione)

### 1.1 Underlying Groups (`underlying-groups.ts`)

14 gruppi suddivisi per asset class.

| ID | Label | Asset Class | Esempi | Valuta Base | Volatilità % |
|----|-------|-------------|--------|-------------|--------------|
| `ug_fx_major` | Forex Major | forex | EUR/USD, GBP/USD, USD/JPY | USD | 0.5% |
| `ug_fx_minor` | Forex Minor | forex | EUR/GBP, EUR/JPY | USD | 0.7% |
| `ug_fx_exotic` | Forex Esotici | forex | USD/TRY, USD/ZAR | USD | 1.5% |
| `ug_idx_us` | Indici USA | indices | S&P 500, Nasdaq 100 | USD | 1.0% |
| `ug_idx_eu` | Indici Europa | indices | DAX 40, Euro Stoxx 50 | EUR | 1.1% |
| `ug_idx_asia` | Indici Asia | indices | Nikkei 225, Hang Seng | JPY | 1.2% |
| `ug_eq_us_largecap` | Azioni USA Large Cap | equities | AAPL, MSFT, NVDA | USD | 1.8% |
| `ug_eq_eu_largecap` | Azioni EU Large Cap | equities | ASML, SAP, LVMH | EUR | 1.5% |
| `ug_eq_it` | Azioni Italia | equities | ENI, Enel, UniCredit | EUR | 1.6% |
| `ug_cmd_metals_precious` | Metalli Preziosi | commodities | Gold, Silver | USD | 1.0% |
| `ug_cmd_metals_industrial` | Metalli Industriali | commodities | Copper, Aluminium | USD | 1.4% |
| `ug_cmd_energy` | Energia | commodities | WTI Crude, Brent | USD | 2.5% |
| `ug_crypto_major` | Crypto Major | crypto | BTC, ETH | USD | 3.5% |
| `ug_crypto_altcoin` | Crypto Altcoin | crypto | SOL, XRP, BNB | USD | 6.0% |

---

### 1.2 Instruments (`instruments.ts`)

Tipologie di strumenti finanziari con struttura costi.

**Categoriestrumento:**

| Categoria | Descrizione |
|-----------|-------------|
| `derivative_linear` | CFD, Futures |
| `derivative_structured` | Turbo KO, Mini Future, Leva Fissa |
| `exchange_product` | ETF, ETC, ETP |
| `crypto_native` | Spot, Perpetual, Futures datati |
| `spot_otc` | Forex Spot OTC interbancario |

**Execution Model:**

| Modello | Descrizione |
|---------|-------------|
| `clob` | Central Limit Order Book |
| `ecn_stp` | ECN/STP — forex no-dealing desk |
| `mm_internal` | Market Maker interno |
| `issuer_priced` | Prezzo emittente (certificati SeDeX) |
| `crypto_ob` | Orderbook exchange crypto |
| `ecn_ndd` | ECN puro NDD — spot FX interbancario |

**Cost Structure:**

| Campo | Tipi |
|-------|------|
| `spreadType` | `fixed_bps`, `tick`, `ob_variable`, `issuer_fixed`, `borsa_variable`, `raw_ecn` |
| `commissionType` | `none`, `per_lot`, `per_contract`, `maker_taker`, `per_trade_pct`, `per_lot_ecn` |
| `overnightType` | `none`, `sofr_plus_markup`, `euribor_plus_markup`, `integrated_in_price`, `tom_next_rollover` |
| `rebasingType` | `none`, `daily_lev_squared` |
| `fundingType` | `none`, `every_8h_variable` |
| `rollType` | `none`, `quarterly`, `at_expiry`, `daily_tomnext` |

---

### 1.3 Horizons (`horizons.ts`)

3 orizzonti temporali operativi.

| ID | Label | Holding Minutes | Holding Days | Icona |
|----|-------|-----------------|--------------|-------|
| `scalping` | Scalping | 0 – 15 min | 0 | Zap |
| `intraday` | Intraday | 15 – 480 min | 0 | Sun |
| `multiday` | Multiday | 480 – 14400 min | 3 | CalendarDays |

---

### 1.4 Account Sizes (`account-sizes.ts`)

5 range discreti di dimensione conto.

| ID | Label | Range EUR | Valore Medio | Icona |
|----|-------|-----------|--------------|-------|
| `xs` | 100 – 300€ | 100 – 300 | 200€ | Sprout |
| `sm` | 300 – 1.000€ | 300 – 1.000 | 650€ | Wallet |
| `md` | 1.000 – 3.000€ | 1.000 – 3.000 | 2.000€ | BadgeEuro |
| `lg` | 3.000 – 10.000€ | 3.000 – 10.000 | 6.500€ | TrendingUp |
| `xl` | > 10.000€ | 10.000+ | 25.000€ | Landmark |

---

### 1.5 Leverage Profiles (`leverage-profiles.ts`)

4 profili di leva.

| ID | Label | Range Leva | Valore Medio | Icona |
|----|-------|------------|-------------|-------|
| `none` | Nessuna leva | 1x | 1x | ShieldCheck |
| `low` | Bassa | 2x – 5x | 3x | TrendingUp |
| `medium` | Media | 5x – 15x | 10x | Zap |
| `high` | Alta | 15x+ | 25x | Flame |

---

### 1.6 Position Sizes (`position-sizes.ts`)

4 dimensioni di posizione (% del conto).

| ID | Label | Range % | Valore Medio | Icona |
|----|-------|---------|--------------|-------|
| `micro` | < 5% | 0 – 5% | 2.5% | Minimize2 |
| `small` | 5 – 15% | 5 – 15% | 10% | Minus |
| `medium` | 15 – 30% | 15 – 30% | 22.5% | Plus |
| `large` | > 30% | 30 – 100% | 50% | Maximize2 |

---

### 1.7 Trading Styles (`styles.ts`)

3 stili operativi.

| ID | Label | Trades/Giorno | Icona |
|----|-------|---------------|-------|
| `selective` | Selettivo | 2 | Target |
| `active` | Attivo | 7 | Activity |
| `high_freq` | Alta Frequenza | 20 | Cpu |

---

## 2. Layer Broker (`brokers.ts`)

### Broker IDs

**Forex / CFD ECN:**
- `ic_markets`, `pepperstone`, `tickmill`, `admirals`, `xm`

**Spot FX OTC / ECN NDD:**
- `interactive_brokers`, `dukascopy`, `saxo_bank`, `swissquote`

**Futures + Multi-Asset:**
- `exante`, `mexem`, `fineco`, `directa`, `lynx`

**Certificati SEDEX:**
- `ig_markets`, `iwbank`, `webank`

**Azioni / ETF:**
- `degiro`, `scalable_capital`, `flatex`, `trade_republic`

**Crypto Exchange:**
- `mexc`, `kraken`, `bybit`, `bitget`, `okx`, `deribit`

### Regulation Zones

| Zone | Descrizione |
|------|-------------|
| `EU` | CySEC, BaFin, CONSOB, AMF |
| `UK` | FCA |
| `AU` | ASIC |
| `CH` | FINMA |
| `CY` | CySEC (Cipro) |
| `offshore` | Seychelles, Vanuatu |
| `US` | CFTC/NFA |
| `global` | Exchange globale |

### Platform Types

`mt4`, `mt5`, `ctrader`, `proprietary`, `tws`, `web`, `api`

---

## 3. Stato Popolamento

| Asset Class | Stato |
|-------------|-------|
| **Forex** | ✅ Completo |
| Indici | ⏳ TODO |
| Commodities | ⏳ TODO |
| Futures CME/EUREX | ⏳ TODO |
| Azioni | ⏳ TODO |
| ETF/CERT | ⏳ TODO |
| Crypto | ⏳ TODO |

---

## Flusso di Matching

```
Input utente:
├── ugId: UnderlyingGroupId
├── horizonId: HorizonId  
├── styleId: StyleId
├── accountSize: AccountSizeId
├── positionSize: PositionSizeId
└── leverageProfile: LeverageProfileId

Processo:
1. filterBrokers() → InstrumentOffer[] filtrati per UG + strumenti compatibili
2. scoreBroker() → calcola costo totale per ogni offerta:
   - spread
   - commission
   - overnight/financing
   - rebasing/decay
   - funding rate
   - roll cost
3. RankedResult[] ordinato per costo crescente
```