# UX Specification - Official Tradelia 2026

**Date**: 2026-01-26  
**Status**: ✅ OFFICIAL DECISION  
**Authority**: Product Owner Approved

---

## 🎯 DECISIONE UX UFFICIALE

### Default: Program Card (Grouped)

**Regola Base**:
- **1 card = 1 program**
- **Selector interno** per scegliere offer (size/fee/currency/refund)
- **Drawer** contiene tutti i dettagli (regole/payout/mercati/sources)
- **Tab "Pricing"** nel drawer mostra tabella comparativa di tutte le sizes

---

## 🚫 ECCEZIONI (Quando NON Raggruppare)

### Program Separato Quando:

1. **Rules Differiscono** (anche 1 sola regola critica):
   - Profit target diverso
   - Drawdown diverso
   - Daily loss diverso
   - Trailing vs static drawdown
   - Payout rules diverse
   - Markets/platforms diversi

2. **Edizioni Temporali** (tournaments):
   - Raggruppa per "program"
   - Offer = edition (Q1, Feb, etc.)

3. **Regional Pricing**:
   - Same program ma fee/currency differenti per regione
   - Ancora 1 program, offers differenziate (EUR vs USD)
   - Badge "Region pricing"

### Esempio: FundedNext
```
❌ WRONG: 1 program "FundedNext" con 36 offers
✅ RIGHT: 6 programs separati:
  - FundedNext Stellar Lite (6 offers: $5K-$200K)
  - FundedNext Stellar 2-Step (6 offers: $5K-$200K)
  - FundedNext Express Consistency (6 offers: $5K-$200K)
  - FundedNext Express Non-Consistency (6 offers: $5K-$200K)
  - FundedNext Evaluation (6 offers: $5K-$200K)
  - FundedNext Instant (4 offers: $5K-$40K)

Perché? Regole diverse (profit target, drawdown, consistency).
```

---

## 📊 UI SPEC: Card Component

### Card Header

```tsx
┌─────────────────────────────────────────────────┐
│ [FTMO Logo]  FTMO Challenge    [Badges]         │
│              2-Step Evaluation                   │
│              ⚡ Verified • T-0 • 5 sources       │
└─────────────────────────────────────────────────┘
```

**Elementi**:
1. **Logo Firm** (organizer) - SVG custom
2. **Nome Program** (es. "FTMO Challenge")
3. **Subtype** (es. "2-Step Evaluation")
4. **Badges**:
   - 💰 Refundable
   - ⚡ Instant
   - 🎁 Free Trial
   - ⏰ No Time Limit
   - 🔐 KYC Required
5. **Data Quality Indicator**:
   - Freshness: T-0 (today), T-1 (yesterday), T-7, T-30, T-90+
   - "Verified sources" count
   - Icon: ⚡ (fresh) / ⚠️ (review needed) / ❌ (outdated)

### Selector Offer (Dropdown)

```tsx
┌─────────────────────────────────────────────────┐
│ Select Account Size ▼                           │
│ ┌─────────────────────────────────────────────┐ │
│ │ $10,000 @ €155 • Refundable ✓              │ │
│ │ $25,000 @ €250 • Refundable ✓              │ │
│ │ $50,000 @ €345 • Refundable ✓ [Best Value] │ │
│ │ $100,000 @ €540 • Refundable ✓             │ │
│ │ $200,000 @ €1,080 • Refundable ✓           │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Mostra Sempre**:
- Size (10K, 25K, 50K, etc.)
- Fee + currency
- Refundable (✓ / —)
- (Optional) Badge: "Best Value" / "Most Popular"

**Default Selection** (deterministica):
1. Se esiste `default_offer_id` (user preference / last used) → quello
2. Altrimenti: fee più basso (entry point)
3. Se `is_featured` su un offer → quello (solo se non confligge con #2)

### KPI Grid (Stabili a Livello Program)

```tsx
┌─────────────────────────────────────────────────┐
│ ┌─────────┬─────────┬─────────┬─────────┐      │
│ │ Target  │ Drawdown│ Split   │ Days    │      │
│ │ 10% → 5%│ 10%     │ 90%     │ 4+      │      │
│ └─────────┴─────────┴─────────┴─────────┘      │
│                                                  │
│ ┌─────────┬─────────┬─────────┬─────────┐      │
│ │ Daily   │ Time    │ Phases  │ Payout  │      │
│ │ 5%      │ ∞       │ 2       │ 14d     │      │
│ └─────────┴─────────┴─────────┴─────────┘      │
└─────────────────────────────────────────────────┘
```

**KPIs Mostrati**:
- **Target**: Phase 1 / Phase 2 (se 2-step)
- **Max Drawdown**: %
- **Max Daily Loss**: %
- **Profit Split Max**: %
- **Time Limit**: Unlimited o giorni
- **Min Trading Days**: numero
- **Phases**: 1-step, 2-step, 3-step
- **First Payout**: giorni

**IMPORTANTE**: 
- KPIs NON devono cambiare quando cambi size (se regole identiche)
- Se un KPI cambia tra offers → evidenzia "Varies by size" e sposta nel drawer

### Platforms

```tsx
┌─────────────────────────────────────────────────┐
│ [MT4] [MT5] [cTrader] [DXtrade]                 │
└─────────────────────────────────────────────────┘
```

**Icone SVG** per ogni piattaforma.

### CTA Buttons

```tsx
┌─────────────────────────────────────────────────┐
│ [View Details]  [Compare]                        │
└─────────────────────────────────────────────────┘
```

- **Primary**: "View Details" (apre drawer)
- **Secondary**: "Compare" (aggiunge offer selezionato a compare tray)

---

## 📊 UI SPEC: Drawer Component

### Drawer Structure

```tsx
┌─────────────────────────────────────────────────┐
│ FTMO Challenge                              [×] │
│ [FTMO Logo]                                     │
├─────────────────────────────────────────────────┤
│ [Overview] [Pricing] [Rules] [Payout] [Markets] [Trust & Audit] │
├─────────────────────────────────────────────────┤
│                                                  │
│ (Tab Content)                                    │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Tab: Overview
- Program description
- Pros & Cons
- Best for / Not recommended for
- Organizer info (founded, headquarters, reputation)

### Tab: Pricing (Tabella Comparativa) ⭐

```tsx
┌─────────────────────────────────────────────────┐
│ Size     │ Fee    │ Refund │ Scaling │ Action  │
├──────────┼────────┼────────┼─────────┼─────────┤
│ $10,000  │ €155   │ ✓      │ $200K   │ Select  │
│ $25,000  │ €250   │ ✓      │ $200K   │ Select  │
│ $50,000  │ €345   │ ✓      │ $200K   │ Select  │ ← Selected
│ $100,000 │ €540   │ ✓      │ $200K   │ Select  │
│ $200,000 │ €1,080 │ ✓      │ $200K   │ Select  │
└─────────────────────────────────────────────────┘
```

**Colonne Minime**:
- Size
- Fee
- Refundable
- Scaling Max
- (Optional) Leverage
- Action: Select

**UX Features**:
- Righe ordinabili: fee asc / size asc (toggle)
- Selected row evidenziata
- "Copy row" per clipboard (utile per confronto)

### Tab: Rules
- Phase-by-phase breakdown
- Profit targets
- Loss limits (daily, max)
- Trading days (min, max)
- Consistency rules
- Permissions (weekend, news, EA, hedging, scalping)

### Tab: Payout
- Profit split (initial, scaled, max)
- Payout frequency
- First payout delay
- Withdrawal methods
- Minimum withdrawal
- Processing time

### Tab: Markets & Platforms
- Markets available (Forex, Futures, Indices, etc.)
- Instruments count
- Leverage per market
- Platforms available
- Platform fees (if any)
- Commission structure

### Tab: Trust & Audit
- Sources list (with freshness)
- Field sources (which fields verified from which sources)
- Last updated dates
- Confidence scores
- "Report outdated data" button

---

## 📱 MOBILE PATTERN (Importantissimo)

### Problem
Dropdown classico su mobile è "pesante" e poco touch-friendly.

### Solution

#### Card (Mobile)
```tsx
┌─────────────────────────────────────────────────┐
│ [FTMO Logo]  FTMO Challenge                     │
│                                                  │
│ From €155 • 5 sizes available                   │
│                                                  │
│ [Tap to select size ▼]                          │
└─────────────────────────────────────────────────┘
```

**Tap su selector** → apre **Bottom Sheet** con lista sizes:

```tsx
┌─────────────────────────────────────────────────┐
│ Select Account Size                         [×] │
├─────────────────────────────────────────────────┤
│ ○ $10,000 @ €155 • Refundable                  │
│ ○ $25,000 @ €250 • Refundable                  │
│ ● $50,000 @ €345 • Refundable [Best Value]     │ ← Selected
│ ○ $100,000 @ €540 • Refundable                 │
│ ○ $200,000 @ €1,080 • Refundable               │
├─────────────────────────────────────────────────┤
│ [Confirm Selection]                              │
└─────────────────────────────────────────────────┘
```

**Radio list** invece di dropdown.

#### Drawer (Mobile)
Tabella comparativa diventa **Stacked List**:

```tsx
┌─────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────┐ │
│ │ $10,000                                     │ │
│ │ Entry Fee: €155 • Refundable ✓             │ │
│ │ Scaling: $200K                              │ │
│ │ [Select]                                    │ │
│ └─────────────────────────────────────────────┘ │
│                                                  │
│ ┌─────────────────────────────────────────────┐ │
│ │ $25,000                                     │ │
│ │ Entry Fee: €250 • Refundable ✓             │ │
│ │ Scaling: $200K                              │ │
│ │ [Select]                                    │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

Ogni size = mini-card con CTA "Select".

---

## 🗄️ DATA/QUERY STRATEGY (No N+1)

### Obiettivo
- **1 query** per lista cards
- **1 query** per drawer (lazy)

### List View Query

```sql
-- Fetch programs + offers "light" (solo campi per card)
SELECT 
  p.id as program_id,
  p.name,
  p.category,
  p.subtype,
  p.status,
  p.organizer_id,
  p.has_free_trial,
  o.id as offer_id,
  o.account_size,
  o.entry_fee,
  o.fee_currency,
  o.refundable,
  o.scaling_max,
  o.time_limit_days,
  o.display_order,
  o.is_featured,
  -- KPIs aggregati (da view)
  kpi.profit_target_phase1,
  kpi.profit_target_phase2,
  kpi.max_drawdown_pct,
  kpi.max_daily_loss_pct,
  kpi.profit_split_max,
  kpi.min_trading_days,
  kpi.phase_count,
  kpi.first_payout_delay_days
FROM programs p
JOIN offers o ON o.program_id = p.id
LEFT JOIN program_card_kpis kpi ON kpi.program_id = p.id
WHERE p.status = 'active'
ORDER BY p.organizer_id, o.display_order;
```

### Drawer Query (Lazy on Open)

```sql
-- Fetch completo per program_id
SELECT 
  -- Offers full
  o.*,
  -- Rulesets full (all phases)
  r.*,
  -- Payout terms
  pt.*,
  -- Market access
  ma.*,
  -- Sources (lazy, solo se tab Audit aperta)
  s.*,
  fs.*
FROM offers o
LEFT JOIN rulesets r ON r.offer_id = o.id
LEFT JOIN payout_terms pt ON pt.offer_id = o.id
LEFT JOIN market_access ma ON ma.offer_id = o.id
LEFT JOIN field_sources fs ON fs.record_id = o.id
LEFT JOIN sources s ON s.id = fs.source_id
WHERE o.program_id = $1
ORDER BY o.display_order, r.phase_number;
```

---

## 📊 VIEW: program_card_kpis (Performance)

### Purpose
Pre-aggregare KPIs per card senza calcolare in frontend.

### Schema

```sql
CREATE OR REPLACE VIEW program_card_kpis AS
SELECT 
  p.id as program_id,
  
  -- Offer aggregates
  COUNT(DISTINCT o.id) as offers_count,
  MIN(o.entry_fee) as min_fee,
  MAX(o.entry_fee) as max_fee,
  jsonb_agg(DISTINCT o.account_size ORDER BY o.account_size) as sizes_list,
  bool_or(o.refundable) as refund_any,
  
  -- Time limit (common or varies)
  CASE 
    WHEN COUNT(DISTINCT o.time_limit_days) = 1 THEN MIN(o.time_limit_days)
    ELSE NULL -- varies
  END as time_limit_common,
  
  -- Rules aggregates (from first offer's rulesets)
  MAX(CASE WHEN r.phase_number = 1 THEN r.profit_target_pct END) as profit_target_phase1,
  MAX(CASE WHEN r.phase_number = 2 THEN r.profit_target_pct END) as profit_target_phase2,
  MAX(r.max_drawdown_pct) as max_drawdown_pct,
  MAX(r.max_daily_loss_pct) as max_daily_loss_pct,
  MAX(r.min_trading_days) as min_trading_days,
  COUNT(DISTINCT r.phase_number) as phase_count,
  
  -- Payout aggregates
  MAX(pt.profit_split_max_pct) as profit_split_max,
  MAX(pt.first_payout_delay_days) as first_payout_delay_days,
  
  -- KPI signature (per capire se rules sono uguali)
  md5(
    CONCAT(
      COALESCE(MAX(r.profit_target_pct)::text, ''),
      COALESCE(MAX(r.max_drawdown_pct)::text, ''),
      COALESCE(MAX(r.max_daily_loss_pct)::text, ''),
      COALESCE(MAX(r.max_drawdown_type), ''),
      COALESCE(MAX(pt.payout_frequency)::text, '')
    )
  ) as kpi_signature_hash,
  
  -- Freshness (from sources)
  MIN(FLOOR(EXTRACT(EPOCH FROM (NOW() - s.accessed_at)) / 86400)::INT) as freshness_days,
  COUNT(DISTINCT s.id) as sources_count

FROM programs p
LEFT JOIN offers o ON o.program_id = p.id
LEFT JOIN rulesets r ON r.offer_id = o.id AND r.phase_number = 1 -- Only phase 1 for card
LEFT JOIN payout_terms pt ON pt.offer_id = o.id
LEFT JOIN field_sources fs ON fs.table_name = 'offers' AND fs.record_id = o.id
LEFT JOIN sources s ON s.id = fs.source_id
GROUP BY p.id;

COMMENT ON VIEW program_card_kpis IS 'Pre-aggregated KPIs for program cards (performance optimization)';
```

### Usage

```typescript
// Fast card rendering
const { data: programs } = await supabase
  .from('programs')
  .select(`
    *,
    offers(*),
    kpis:program_card_kpis(*)
  `)
  .eq('status', 'active');

// Card component
<ChallengeCard 
  program={program}
  offers={program.offers}
  kpis={program.kpis}
/>
```

---

## 🔍 REGOLA "Program Split" (Fingerprint)

### Purpose
Decidere automaticamente se creare program separato o raggruppare.

### Fingerprint Formula

```typescript
function calculateRulesetFingerprint(ruleset: Ruleset, payout: PayoutTerms, market: MarketAccess): string {
  const signature = {
    profit_target: ruleset.profit_target_pct,
    max_drawdown: ruleset.max_drawdown_pct,
    max_daily_loss: ruleset.max_daily_loss_pct,
    drawdown_type: ruleset.max_drawdown_type,
    min_trading_days: ruleset.min_trading_days,
    payout_frequency: payout.payout_frequency,
    eligible_after_phase: payout.eligible_after_phase,
    platforms: market.platforms?.sort().join(','),
    markets: market.markets_available?.sort().join(','),
  };
  
  return md5(JSON.stringify(signature));
}
```

### Decision Logic

```typescript
// Se fingerprint differisce → program separato
const ftmoChallenge = calculateRulesetFingerprint(ftmo10k);
const ftmo25k = calculateRulesetFingerprint(ftmo25k);

if (ftmoChallenge === ftmo25k) {
  // Same program, different offers
  program_id = 'ftmo-challenge';
} else {
  // Different programs
  program_id_1 = 'ftmo-challenge-standard';
  program_id_2 = 'ftmo-challenge-aggressive';
}
```

---

## 🔄 COMPARE TRAY (Feature Killer)

### Purpose
Confrontare fino a 3-5 offers side-by-side.

### UI

```tsx
┌─────────────────────────────────────────────────┐
│ Compare (3)                                 [×] │
├─────────────────────────────────────────────────┤
│ | Metric        | FTMO 10K | FN Stellar | E8   │
│ |---------------|----------|------------|------|│
│ | Fee           | €155     | $19        | $36  │
│ | Size          | $10K     | $5K        | $5K  │
│ | Refundable    | ✓        | ✓          | ✓    │
│ | Target        | 10%      | 6%         | 8%   │
│ | Drawdown      | 10%      | 6%         | 8%   │
│ | Daily Loss    | 5%       | 3%         | 5%   │
│ | Split         | 90%      | 80%        | 80%  │
│ | Time Limit    | ∞        | ∞          | ∞    │
│ | Platforms     | 4        | 4          | 5    │
│ |---------------|----------|------------|------|│
│ | [Remove]      | [Remove] | [Remove]   |      │
└─────────────────────────────────────────────────┘
```

### Features
- Max 3-5 offers
- Side-by-side comparison
- Highlight differences (color coding)
- "Best value" indicator per metric
- Export to PDF/Image

---

## ✅ IMPLEMENTATION CHECKLIST

### Database
- [ ] Create `program_card_kpis` view
- [ ] Add `kpi_signature_hash` calculation
- [ ] Add `default_offer_id` to user preferences

### Components
- [ ] ProgramCard with offer selector
- [ ] OfferSelector (dropdown desktop, bottom sheet mobile)
- [ ] ChallengeDrawer with 6 tabs
- [ ] PricingTable (sortable, copyable)
- [ ] CompareTray (max 5 offers)
- [ ] DataQualityIndicator (freshness badge)

### Queries
- [ ] List view query (programs + offers + kpis)
- [ ] Drawer query (full data, lazy)
- [ ] Compare query (multiple offers)

### Mobile
- [ ] Bottom sheet for offer selection
- [ ] Stacked list for pricing table
- [ ] Touch-friendly CTAs

---

**Status**: ✅ OFFICIAL SPEC  
**Ready for**: Implementation  
**Estimated Time**: 6-8 hours for UI components

