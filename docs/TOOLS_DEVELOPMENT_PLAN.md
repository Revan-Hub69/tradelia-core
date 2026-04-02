# Trading Tools - Development Plan

## Overview

We are building 3 trading tools to serve different investor profiles, from long-term ETF investors to active traders. Each tool addresses a specific pain point and provides clear, actionable value.

---

## 1. Net Return Model

### What it does
ETF simulator that calculates the real net return after all costs:
- Broker fees
- TER (Total Expense Ratio)
- Italian taxes (capital gains, withholding)
- PAC (Dollar-Cost Averaging) vs Lump Sum comparison
- Accumulating vs Distributing ETF comparison

### Target audience
ETF investors / PAC enthusiasts who want to understand the true cost of their investment strategy.

### Status
- **Pillar**: 1 (Core product)
- **Version**: v1
- **Budget**: 0 (MVP approach)
- **Priority**: High

### Key features
- [ ] Input: initial investment, monthly contribution, time horizon
- [ ] Select ETF from predefined list or custom entry
- [ ] Configure broker fees (flat fee or percentage)
- [ ] Select tax regime (optant vs declarativi)
- [ ] Compare PAC vs Lump Sum historical performance
- [ ] Compare Accumulating vs Distributing ETFs
- [ ] Output: net return, total costs breakdown, annualized yield

---

## 2. Exposure Comparator

### What it does
Compares real exposure between different instruments on the same underlying:
- CFDs
- Options
- Futures
- Direct share/ETF ownership

Shows:
- Notional value
- Effective leverage
- P&L for 1% underlying move
- Margin requirements

### Target audience
Active traders deciding which vehicle to use for a trade.

### Status
- **Pillar**: 2 (Secondary product)
- **Version**: v1
- **Budget**: 0 (MVP approach)
- **Priority**: Medium

### Key features
- [ ] Select underlying (forex, indices, commodities, crypto, stocks)
- [ ] Enter position size for each instrument type
- [ ] Auto-calculate notional value and effective exposure
- [ ] Show P&L scenarios (1%, 5%, 10% move)
- [ ] Compare margin requirements
- [ ] Explain the math behind each calculation

---

## 3. Flow Radar

### What it does
Detects anomalies in market flows:
- Unusual options activity (gamma squeeze signals)
- Off-exchange / dark pool activity
- ETF unusual moves (creation/redemption imbalances)
- Sector rotation signals

### Target audience
Swing traders looking for timing edge on entries/exits.

### Status
- **Pillar**: 3 (Advanced product)
- **Version**: Demo/Waitlist
- **Budget**: 0
- **Priority**: Low (Phase 2)

### Key features
- [ ] Real-time flow data aggregation (mock data for v1)
- [ ] Anomaly detection thresholds
- [ ] Alert system for unusual activity
- [ ] Historical pattern matching
- [ ] Confidence score for each signal

### Note
This tool requires external data feeds. V1 will use mock/simulated data to demonstrate the concept.

---

## Homepage Integration

### Design approach
The homepage will feature 3 clear entry points, one for each tool:
- No forced pipeline
- Clear value proposition for each
- Users choose their path based on their needs

### Entry points visual

```
┌─────────────────────────────────────────────────────┐
│                    TRADELIA                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   NET RETURN │  │   EXPOSURE   │  │   FLOW   │ │
│  │    MODEL     │  │  COMPARATOR  │  │  RADAR   │ │
│  │              │  │              │  │          │ │
│  │  ETF PAC     │  │  CFD vs      │  │  Market  │ │
│  │  Simulator   │  │  Options     │  │  Anomaly │ │
│  │              │  │  Futures      │  │  Detector│ │
│  │  [Start]     │  │  [Compare]   │  │ [Waitlist]│ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│                                                     │
│  Long-term    │  Active      │  Swing         │
│  Investors    │  Traders     │  Traders       │
└─────────────────────────────────────────────────────┘
```

---

## Summary

| Tool | Type | Timeframe | User Profile |
|------|------|-----------|--------------|
| Net Return Model | ETF Analysis | Long-term | Investor |
| Exposure Comparator | Derivatives | Short-term | Trader |
| Flow Radar | Market Timing | Swing | Trader |

Each tool is independent, serves a distinct user segment, and can be developed iteratively with zero budget in Phase 1.