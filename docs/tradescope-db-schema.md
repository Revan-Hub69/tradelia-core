# TradeScope DB Schema - Bozza

> Versione completa del DB, progettata per essere realistica, credibile per trader, senza score inventati, pronta per calcolare il costo reale di qualsiasi strategia/strumento/broker.

---

## ELENCO COMPLETO E DEFINITIVO DEGLI `underlying_group` PER IL DATABASE DI TRADESCOPE

Questa classificazione è costruita esclusivamente sulla **Firma di Costo (Cost Signature)**. Ogni sottostante è inserito in un gruppo specifico perché condivide con i suoi simili lo stesso comportamento in termini di *Attrito di Esecuzione* (spread, slippage, liquidità di sessione), *Attrito di Mantenimento* (swap, funding, rollover) e *Attrito Strutturale* (tassazione, FX markup).

Ecco lo schema SOTA (State of the Art) per alimentare le matrici del tuo motore:

### 1. FOREX (Driver: Liquidità e Tassi Centrali)
Il mercato valutario si raggruppa in base all'ampiezza dello spread e all'asimmetria del costo notturno (Swap).
* **`fx_core`** (es. EUR/USD, USD/JPY): Coppie iper-liquide. Attrito dominato da commissioni fisse a lotto e spread prossimi allo zero. Swap stabili e prevedibili.
* **`fx_cross`** (es. EUR/GBP, GBP/AUD): Valute G10 senza il Dollaro. Spread variabili (spesso si allargano bruscamente a mezzanotte) e swap moderati.
* **`fx_exotic`** (es. USD/TRY, USD/MXN): Struttura di costo letale. Spread enormi e tassi di finanziamento (swap) fortemente asimmetrici che distruggono l'holding multiday.

### 2. INDICI E VOLATILITÀ (Driver: Sessioni e Tassazione Derivati)
Gli indici si raggruppano per orari di liquidità, rischio valutario (per un conto in EUR) e impatto fiscale locale. Sarà poi il motore a suggerire se tradarli in CFD Cash o Futures.
* **`index_us`** (es. US30, US500, NAS100): Liquidità H24. Spread stretti anche di notte. **Attrito extra:** FX Markup (costo invisibile di conversione USD/EUR applicato dal broker).
* **`index_eu_core`** (es. DAX40): Liquidità concentrata (09:00-17:30 CET). Spread che esplodono fuori orario. Nessuna tassa governativa sui derivati. Nessun rischio cambio.
* **`index_eu_tax`** (es. FTSE MIB, IBEX): Comportamento di liquidità europeo, ma con **Attrito Strutturale letale**: soggetti a Tobin Tax sui derivati (costo fisso per contratto che uccide l'high-frequency trading).
* **`index_asia`** (es. JPN225): Orari di sessione sfavorevoli per l'Europa, alti costi di slippage intraday e FX markup.
* **`index_volatility`** (es. VIX): Struttura del mercato unica. Strutturalmente in *Contango*, dove il costo di Rollover distrugge matematicamente le posizioni long multiday.

### 3. EQUITIES / AZIONI (Driver: Giurisdizione Fiscale e Market Cap)
Il costo azionario è dominato dalla residenza fiscale dell'azienda e dalla facilità di prendere in prestito i titoli per lo short.
* **`equity_us_large`** (es. AAPL, MSFT): Altissima liquidità, spread di 1 cent. Attrito dominato da ticket fee ($/azione) e micro-tasse SEC in vendita.
* **`equity_us_small`** (es. Penny stocks, AMC): Spread larghi, slippage alto. **Attrito extra:** *Hard-to-borrow fees* (costi altissimi applicati dai broker per farti shortare questi titoli).
* **`equity_eu_ftt`** (es. Azioni Italia, Francia, Spagna): Subiscono la **Tobin Tax / FTT** sull'acquisto Spot (es. 0.10% o 0.20% del nozionale). Uccide lo scalping cash.
* **`equity_eu_core`** (es. Azioni Germania, Olanda): Esenti da Tobin Tax. L'attrito torna a essere dominato dalle pure commissioni di borsa/broker.
* **`equity_uk`** (es. Mercato LSE): Subiscono la **Stamp Duty** (0.50%) all'acquisto Spot. Un drag strutturale pesantissimo.
* **`equity_adr`** (es. BABA, NIO): Aziende estere quotate negli USA. Subiscono costi aggiuntivi (ADR pass-through fees) addebitati dai broker.

### 4. COMMODITIES / MATERIE PRIME (Driver: Curva Forward e Scadenza)
Si dividono per necessità di stoccaggio fisico o cartaceo.
* **`commodity_metal`** (es. Oro, Argento): Trattati come valute (XAU/USD). L'attrito è dominato dallo spread e dal classico swap giornaliero.
* **`commodity_energy`** (es. Petrolio, Gas Naturale): Legati a contratti fisici a scadenza mensile. L'attrito invisibile è il **Rollover** (Contango/Backwardation).
* **`commodity_agri`** (es. Grano, Caffè): Orari di sessione frammentati. L'attrito principale è lo **Slippage** causato dai forti gap di apertura quotidiani.

### 5. ETF (Driver: Leva Intrinseca e Domicilio)
* **`etf_us_broad`** (es. SPY, QQQ): Comportamento simile alle *equity_us_large*, ma spesso esenti da alcune commissioni (broker commission-free).
* **`etf_us_leveraged`** (es. TQQQ, SQQQ): ETF a leva 2x o 3x. Offrono margine senza pagare lo swap notturno dei CFD, ma soffrono di un drag matematico (*Volatility Drag*) se tenuti in portafoglio a lungo.
* **`etf_ucits`** (es. ETF Armonizzati EU): Sottostanno alle normative europee, spread tipicamente più larghi rispetto alla controparte americana.

### 6. CRYPTO (Driver: Struttura di Liquidità)
TradeScope poi suggerirà se tradarle in Spot, CFD o ETP, ma il sottostante si comporta così:
* **`crypto_major`** (es. BTC, ETH): Elevata liquidità. Sugli exchange hanno fee *Maker/Taker* basse, sui broker retail hanno spread accettabili ma *Funding Rates* (ogni 8 ore) che impattano il multiday.
* **`crypto_altcoin`** (es. Solana, Dogecoin): Liquidità frammentata. I broker retail applicano spread predatori (spesso > 1%) e costi di funding estremamente volatili.

---

### Esempio di Schema (PostgreSQL)

```sql
CREATE TYPE tradescope_underlying_group AS ENUM (
  -- Forex
  'fx_core', 'fx_cross', 'fx_exotic',
  
  -- Indici e Volatilità
  'index_us', 'index_eu_core', 'index_eu_tax', 'index_asia', 'index_volatility',
  
  -- Azioni
  'equity_us_large', 'equity_us_small', 'equity_eu_ftt', 'equity_eu_core', 'equity_uk', 'equity_adr',
  
  -- Materie Prime
  'commodity_metal', 'commodity_energy', 'commodity_agri',
  
  -- ETF
  'etf_us_broad', 'etf_us_leveraged', 'etf_ucits',
  
  -- Crypto
  'crypto_major', 'crypto_altcoin'
);
```

---

## TABELLA 1 — `instruments` (strumenti reali)

| Campo | Descrizione |
|-------|-------------|
| `instrument_id` | PK |
| `asset_group` | Includi il nuovo campo `underlying_group` qui per la classificazione SOTA. |
| `instrument_type` | spot, cfd, futures, perpetual |
| `base_currency` | EUR, USD, BTC |
| `quote_currency` | USD, EUR, USDT |
| `contract_size` | lotto o unità base (es. 100000 forex, 1 futures) |
| `tick_size` | es. 0.0001 per forex, 1 per indici |
| `tick_value` | valore monetario per tick/punto |
| `avg_daily_volume` | utile per stimare slippage |
| `avg_spread` | pips / punti / % media realistica |
| `avg_slippage` | pips / punti / % stimata |
| `overnight_long_rate` | % giornaliero long |
| `overnight_short_rate` | % giornaliero short |
| `funding_long_rate` | % giornaliero CFD / crypto long |
| `funding_short_rate` | % giornaliero CFD / crypto short |
| `currency_conversion_fee` | % media conversione se base != conto |
| `max_order_size` | massimo volume senza impattare troppo lo slippage |
| `underlying_group` | Enum `tradescope_underlying_group` per classificazione cost signature |

---

## TABELLA 2 — `brokers`

| Campo | Descrizione |
|-------|-------------|
| `broker_id` | PK |
| `broker_name` | |
| `account_currency` | EUR, USD, BTC |
| `account_type` | standard, pro, ECN |
| `spread_markup` | aggiunto allo spread base |
| `commission_per_lot` | forex round-turn |
| `commission_per_contract` | futures / CFD |
| `commission_percent` | crypto (% per trade) |
| `swap_markup` | aggiunta a overnight/funding |
| `conversion_markup` | aggiunta alla conversione valuta |
| `min_lot_size` | |
| `leverage_max` | |
| `execution_quality_factor` | fattore stimato per slippage reale |
| `max_volume_limit` | lotto massimo supportato senza penalità extra |

---

## TABELLA 3 — `instrument_broker_map`

| Campo | Descrizione |
|-------|-------------|
| `id` | PK |
| `instrument_id` | FK |
| `broker_id` | FK |
| `enabled` | se broker offre lo strumento |
| `extra_spread` | override specifico, opzionale |
| `extra_commission` | override specifico, opzionale |
| `extra_slippage` | override specifico, opzionale |
| `funding_override_long` | override se diverso dal default |
| `funding_override_short` | idem |

---

## TABELLA 4 — `strategy_profiles`

| Campo | Descrizione |
|-------|-------------|
| `strategy_id` | PK |
| `name` | scalping, intraday, swing, position |
| `trades_per_day` | |
| `avg_holding_hours` | |
| `avg_holding_days` | |
| `slippage_multiplier` | moltiplicatore reale per volume / velocità trade |
| `overnight_days_factor` | quanto pesa overnight/funding nella strategia |
| `max_position_size` | lotto max per strategia |

---

## FORMULA COSTO REALE (senza fuffa)

### Spread totale
```
spread_total = instrument.avg_spread + broker.spread_markup + instrument_broker_map.extra_spread
```

### Commissione totale
```
forex → broker.commission_per_lot + instrument_broker_map.extra_commission
futures → broker.commission_per_contract
crypto → % trade size
```

### Slippage totale
```
slippage_total = instrument.avg_slippage * strategy.slippage_multiplier + instrument_broker_map.extra_slippage
```

### Costo overnight
```
overnight_cost =
    (instrument.overnight_rate + broker.swap_markup + instrument_broker_map.funding_override) 
    * avg_holding_days * capital
```

### Costo conversione
```
se base_currency != account_currency →
    instrument.currency_conversion_fee + broker.conversion_markup
```

---

## COSTO TOTALE STRATEGIA

```
total_cost_per_trade = spread_total + commission_total + slippage_total

total_strategy_cost =
    total_cost_per_trade * trades_per_day * avg_holding_days
    + overnight_cost
    + conversion_cost
```

---

## NOTE AGGIUNTIVE

1. **Slippage dinamico** → incluso tramite `slippage_multiplier` + `execution_quality_factor`
2. **Funding / swap** per crypto/CFD → incluso
3. **Conversioni valutarie** → incluse
4. **Massimi ordini e leva** → limitano costi e rendono realistico l'output
5. **Tutto è numerico**, niente categorie tipo "basso/medio"

