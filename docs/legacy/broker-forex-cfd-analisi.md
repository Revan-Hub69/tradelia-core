# Broker Forex/CFD — Analisi comparativa

## Per CFD Forex (ECN/STP)

| # | Broker                 | Regolazione      | EUR/USD avg spread | Comm. RT   | Modello    | Note                                              |
| -- | ---------------------- | ---------------- | ------------------ | ---------- | ---------- | ------------------------------------------------- |
| 1  | Tickmill (Pro)         | CySEC ✅         | 0.10 pips          | $4.00      | ECN        | Costo totale più basso con reg. EU                |
| 2  | Pepperstone (Razor)    | FCA/CySEC ✅     | 0.10 pips          | €5.20      | ECN/STP    | Esecuzione 77ms, piattaforme eccellenti           |
| 3  | IC Markets EU (Raw)    | CySEC ✅         | 0.10 pips          | €6.50      | ECN        | Spread raw identico ma comm. EU più alta dal 2026 |
| 4  | Eightcap (Raw)         | CySEC ✅         | 0.06 pips          | $3.50      | ECN        | Spread raw più basso testato, esecuzione 143ms    |
| 5  | FP Markets (Raw)      | CySEC ✅         | 0.33 pips          | $6.00      | ECN/STP    | Solido, buona liquidità                           |
| 6  | GO Markets (Pro)       | CySEC ✅         | ~0.10 pips         | €4.00      | ECN        | Commissione EU più bassa dopo Tickmill            |
| 7  | FxPro (Raw+)           | CySEC/FCA ✅     | 0.0 pips           | $3.50      | NDD ibrido | 99% no requote, cTrader disponibile               |
| 8  | XTB (Pro)              | CySEC/FCA ✅     | ~0.10 pips         | $3.50      | STP        | Regolato anche KNF (Polonia), ottima piattaforma  |
| 9  | AvaTrade (AvaTradeGO)  | BaFin/CySEC ✅  | ~0.9 pips          | zero       | Ibrido     | Spread più alto ma zero comm., reg. BaFin diretta |
| 10 | Dukascopy Europe (ECN) | CySEC/FINMA ✅   | 0.10 pips          | $35/1M USD | ECN        | Conveniente solo sopra $25k volume — soglia alta  |

## Note

- Tutti i broker indicati sono regolamentati in EU (CySEC, FCA, BaFin, FINMA)
- Spread indicati sono "raw" o "avg" — non includono eventuali markup
- Commissioni sono "round turn" per lotto standard (100k unità)
- Dati da verificare periodicamente — commissioni e spread cambiano

## Prossimi step

1. Selezionare 3-5 broker da prioritizzare per il motore
2. Popolare i dati in `market-data/instrument-offers.ts`
3. Testare calcolo costi per EUR/USD con diversi broker