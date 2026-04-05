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
Si dividono in base alla necessità di stoccaggio fisico o cartaceo.
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

Questa matrice è perfetta. Se il motore riceve in pasto un asset classificato come `equity_eu_ftt`, saprà istantaneamente che se l'utente ha scelto "Cash/Spot", dovrà sottrarre lo 0.10% di tasse al rendimento netto prima ancora di guardare il listino del broker. Se riceve `commodity_energy` e la strategia è "Multiday > 30 giorni", attiverà il modulo di calcolo del drag da rollover. 

È una struttura che trasforma TradeScope da un semplice comparatore di listini a un simulatore di attrito istituzionale.