# Strumenti Forex - Costi di Esecuzione e Mantenimento

## Panoramica Strumenti Forex

| ID | Strumento | Categoria | Modello Esecuzione | Leva Max ESMA |
|----|-----------|-----------|---------------------|---------------|
| `spot_fx` | Forex Spot OTC | spot_otc | ecn_ndd | 30x |
| `cfd_dd` | CFD Dealing Desk | derivative_linear | mm_internal | 30x |
| `cfd_ecn` | CFD ECN/STP | derivative_linear | ecn_stp | 30x |

---

## Struttura Costi per Strumento

### 1. SPOT FX (ecn_ndd)

Mercato interbancario OTC puro. Spread near-zero su major con broker ECN NDD.

#### Costi di Esecuzione

| Voce | Tipo | Note |
|------|------|------|
| **Spread** | `raw_ecn` | 0.1 pip EUR/USD (1 bps) |
| **Commissione** | `per_lot_ecn` | $6-8 per lotto RT |
| **Overnight** | `tom_next_rollover` | Dipende dal differenziale tassi |
| **FX Conversion** | `native` | Nessuna conversione aggiuntiva |
| **Margin Interest** | `on_margin_loan` | Interest sul loan implicito |

#### Broker Consigliati per Spot FX

| Broker | Commissione | Spread EUR/USD | Costo All-in |
|--------|-------------|---------------|--------------|
| **Interactive Brokers** | 0.08-0.20 bps, min $2 | 0.1 pip | ~1.5-2 bps |
| **Dukascopy** | $7/lot RT (scende a $1 con vol) | 0.1 pip | ~2-3 bps |
| **Saxo Bank** | Markup tom/next 0.50-0.75% | Variabile | ~2-4 bps |

---

### 2. CFD ECN/STP (ecn_stp)

Spread near-zero su major FX. Commission per lotto esplicita. Esecuzione STP diretta su LP.

#### Costi di Esecuzione

| Voce | Tipo | Note |
|------|------|------|
| **Spread** | `fixed_bps` | 0.1 pip EUR/USD (1 bps) |
| **Commissione** | `per_lot` | $6-7 per lotto RT |
| **Overnight** | `sofr_plus_markup` | SOFR + markup broker ~2.5% |
| **FX Conversion** | `on_pnl` | Solo sul P&L realizzato |

#### Offerte Forex - CFD ECN

| Broker + Account | Commissione | Spread | Overnight Long | Overnight Short | Costo All-in |
|------------------|-------------|--------|----------------|----------------|-------------|
| **IC Markets Raw** | €6.50/lot RT | 0.1 pip (1 bps) | 6.8% | -1.5% | ~7.5 bps |
| **Pepperstone Razor MT** | $7/lot RT | 0.1 pip (1 bps) | 6.8% | -1.5% | ~7.5 bps |
| **Pepperstone Razor CT** | $6/lot RT | 0.1 pip (1 bps) | 6.8% | -1.5% | ~7 bps |
| **Tickmill Raw** | $6/lot RT | 0.1 pip (1 bps) | 6.5% | -1.2% | ~6.5 bps |
| **Admirals Zero** | $6/lot RT | 0.0 pip | 8.42% | - | ~6-8 bps |

#### Note

- **Costo All-in**: somma spread + commission. Overnight escluso (dipende da durata posizione).
- **Admirals Zero**: spread 0.0 pip MA swap overnight molto elevato (-8.42 pip EUR/USD long). Conviene solo per intraday.

---

### 3. CFD DEALING DESK (mm_internal)

Spread allargato incluso nel prezzo. Nessuna commission esplicita.

#### Costi di Esecuzione

| Voce | Tipo | Note |
|------|------|------|
| **Spread** | `fixed_bps` | 0.9-1.5 pip EUR/USD (9-15 bps) |
| **Commissione** | `none` | Incluso nel markup |
| **Overnight** | `sofr_plus_markup` | SOFR + markup broker |
| **FX Conversion** | `on_pnl` | Solo sul P&L |

#### Offerte Forex - CFD DD

| Broker + Account | Spread | Overnight Long | Overnight Short | Costo All-in |
|------------------|--------|----------------|----------------|-------------|
| **IC Markets Standard** | 0.9 pip (9 bps) | 6.8% | -1.5% | ~9 bps |
| **XM Ultra Low** | 0.6 pip (6 bps) | - | - | ~6 bps |
| **XM Zero** | 0.0 pip + commission | - | - | ~6-8 bps |

#### Note

- Non consigliato per scalping attivo (costi più alti di ECN)
- Buono per account piccoli o swing trading

---

## Dettaglio Costi Overnight (per 1 notte)

### Scenario: Posizione LONG 1 lotto EUR/USD (€100k nozionale)

| Broker | Tasso Base | Markup | Tasso Totale | Costo Notte (€) |
|--------|------------|--------|--------------|----------------|
| IC Markets | SOFR 4.3% | +2.5% | 6.8% | ~€18.60/notte |
| Tickmill | SOFR 4.3% | +2.2% | 6.5% | ~€17.80/notte |
| Pepperstone | SOFR 4.3% | +2.5% | 6.8% | ~€18.60/notte |
| Admirals | SOFR 4.3% | +4.1% | 8.4% | ~€23/notte |

### Scenario: Posizione SHORT 1 lotto EUR/USD

| Broker | Tasso Totale | Ricavo Notte (€) |
|--------|--------------|------------------|
| IC Markets | -1.5% | ~€4.10/notte |
| Tickmill | -1.2% | ~€3.30/notte |
| Pepperstone | -1.5% | ~€4.10/notte |

---

## Riepilogo per Profilo Trader

### Scalping (< 15 min)

| Broker | Costo per Trade | Note |
|--------|-----------------|------|
| **Tickmill Raw** | ~€5.55 + spread | Miglior costo all-in |
| **Pepperstone CT** | ~€5.55 + spread | Esecuzione cTrader |
| **IC Markets Raw** | ~€6.50 + spread | Referenza settore |

### Intraday (15 min - 8h)

| Broker | Costo per Trade | Note |
|--------|-----------------|------|
| **Tickmill Raw** | ~€5.55 + spread | Bassa commission |
| **Pepperstone MT** | ~€6.50 + spread | Piattaforma MT |
| **XM Ultra Low** | ~€6 spread | No commission |

### Swing/Multiday (> 8h)

| Broker | Costo per Notte | Note |
|--------|-----------------|------|
| **Tickmill** | ~€17.80 | Swap migliore |
| **IC Markets** | ~€18.60 | Buon equilibrio |
| **Admirals** | ~€23 | Evitare long overnight |

---

## Calcolo Costo Totale (Formula)

```
Costo Totale = 
  (Spread × Nozionale / 10,000) 
  + Commissione Round Trip
  + (Overnight Rate × Nozionale × Giorni / 365)
  + FX Conversion Fee
  + Slippage
```

### Esempio: Scalping EUR/USD 1 lotto (€100k)

| Voce | Calcolo | Costo |
|------|---------|-------|
| Spread | 1 bps × €100k / 10,000 | €10 |
| Commission RT | €5.55 × 2 | €11.10 |
| Overnight (0 notti) | 0 | €0 |
| FX Conversion | 30 bps × €100k / 10,000 | €30* |
| **Totale** | | **€51.10** |

*FX conversion applicato solo se conto in EUR e cambio EUR/USD

---

## Raccomandazioni Finali

| Scenario | Broker Consigliato | Account | Costo All-in |
|----------|-------------------|---------|--------------|
| Scalping professionale | **Tickmill** | Raw | ~6.5 bps |
| Trading multi-piattaforma | **Pepperstone** | Razor cTrader | ~7 bps |
| Account piccoli retail | **XM** | Ultra Low | ~6 bps |
| Multi-asset (futures + spot) | **Interactive Brokers** | Tiered | ~1.5-2 bps |
| Banking (Swiss) | **Dukascopy** | JForex | ~2-3 bps |