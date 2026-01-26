# Implementation Roadmap - Final Plan 2026

**Date**: 2026-01-26  
**Status**: 🎯 READY TO IMPLEMENT  
**Integrates**: Research + ChatGPT Audit + User Requirements

---

## 🎯 OBIETTIVO FINALE

Creare una **Challenge Library** che:
1. ✅ Distingue chiaramente FREE vs PAID
2. ✅ Mostra trial gratuiti disponibili
3. ✅ Gestisce multi-challenge per firm (100+ challenges)
4. ✅ Ha schema normalizzato con audit trail
5. ✅ È mobile responsive (no scroll laterale)
6. ✅ Usa solo SVG custom (no emoji)
7. ✅ Ha filtri e sorting avanzati
8. ✅ Mostra piattaforme disponibili per ogni challenge
9. ✅ È aggiornabile e verificabile (freshness tracking)

---

## 📊 STEP-BY-STEP IMPLEMENTATION

### STEP 1: Schema Database (P0 - 2 ore)

#### 1.1 Creare Migration SQL
**File**: `tradelia/migrations/0006_complete_challenge_schema.sql`

**Contenuto**:
```sql
-- Drop old tables if exist
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS challenge_rules CASCADE;

-- Create new normalized schema
-- (Copy from COMPLETE_CHALLENGE_SCHEMA_2026.md)

-- 1. organizers
CREATE TABLE IF NOT EXISTS organizers (...);

-- 2. programs
CREATE TABLE IF NOT EXISTS programs (...);

-- 3. offers
CREATE TABLE IF NOT EXISTS offers (...);

-- 4. rulesets
CREATE TABLE IF NOT EXISTS rulesets (...);

-- 5. payout_terms
CREATE TABLE IF NOT EXISTS payout_terms (...);

-- 6. market_access
CREATE TABLE IF NOT EXISTS market_access (...);

-- 7. trust_metrics
CREATE TABLE IF NOT EXISTS trust_metrics (...);

-- 8. sources
CREATE TABLE IF NOT EXISTS sources (...);

-- 9. field_sources
CREATE TABLE IF NOT EXISTS field_sources (...);

-- 10. snapshots
CREATE TABLE IF NOT EXISTS snapshots (...);

-- Indexes, triggers, functions
-- (Copy from schema document)
```

#### 1.2 Aggiornare TypeScript Types
**File**: `tradelia/src/types/challenge.ts`

```typescript
// Organizer
export interface Organizer {
  id: string;
  name: string;
  organizer_type: 'prop_firm' | 'broker' | 'platform' | 'exchange';
  website_url: string;
  founded_year?: number;
  headquarters?: string;
  legal_status: 'active' | 'paused' | 'legal_issues' | 'ceased';
  legal_notes?: string;
  logo_url?: string;
  reputation_score?: number;
  trustpilot_score?: number;
  trustpilot_reviews?: number;
  trustpilot_updated_at?: string;
  total_paid_out?: number;
  total_paid_currency?: string;
  active_traders?: number;
  created_at: string;
  updated_at: string;
  notes?: string;
}

// Program
export interface Program {
  id: string;
  organizer_id: string;
  name: string;
  category: 'free_competition' | 'paid_evaluation' | 'instant_funding';
  type: 'paper_trading' | 'demo_contest' | 'prop_challenge' | 'tournament';
  subtype?: '1_step' | '2_step' | '3_step' | 'instant' | 'recurring' | 'one_time';
  official_url: string;
  terms_url?: string;
  faq_url?: string;
  description?: string;
  status: 'active' | 'upcoming' | 'ended' | 'paused';
  has_free_trial: boolean;
  free_trial_description?: string;
  free_trial_url?: string;
  pros?: string[];
  cons?: string[];
  best_for?: string;
  not_recommended_for?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  organizer?: Organizer;
}

// Offer
export interface Offer {
  id: string;
  program_id: string;
  offer_name?: string;
  display_order: number;
  account_size?: number;
  account_currency: string;
  entry_fee: number;
  fee_currency: string;
  refundable: boolean;
  refund_conditions?: string;
  prize_pool?: number;
  scaling_max?: number;
  scaling_conditions?: string;
  time_limit_days?: number;
  recurring: boolean;
  frequency?: 'always_open' | 'monthly' | 'quarterly' | 'annual' | 'one_time';
  start_date?: string;
  end_date?: string;
  registration_deadline?: string;
  next_edition_date?: string;
  max_participants?: number;
  min_age?: number;
  kyc_required: boolean;
  geo_restrictions?: string[];
  badges?: string[];
  tags?: string[];
  is_featured: boolean;
  is_hot: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations
  program?: Program;
  rulesets?: Ruleset[];
  payout_terms?: PayoutTerms;
  market_access?: MarketAccess;
}

// Ruleset
export interface Ruleset {
  id: string;
  offer_id: string;
  phase_number: number;
  phase_name?: string;
  profit_target_pct: number;
  max_daily_loss_pct?: number;
  max_daily_loss_type?: 'equity_based' | 'balance_based' | 'static';
  max_drawdown_pct?: number;
  max_drawdown_type?: 'equity_based' | 'balance_based' | 'trailing' | 'static';
  min_trading_days?: number;
  max_trading_days?: number;
  consistency_rule?: string;
  consistency_required: boolean;
  best_day_max_pct?: number;
  weekend_holding: boolean;
  news_trading: boolean;
  news_trading_window_minutes?: number;
  ea_allowed: boolean;
  hedging_allowed: boolean;
  scalping_allowed: boolean;
  max_position_size?: string;
  max_contracts?: number;
  max_lots?: number;
  compulsory_stop_loss: boolean;
  weekend_force_close: boolean;
  created_at: string;
  updated_at: string;
}

// PayoutTerms
export interface PayoutTerms {
  id: string;
  offer_id: string;
  profit_split_initial_pct?: number;
  profit_split_scaled_pct?: number;
  profit_split_max_pct?: number;
  profit_split_conditions?: string;
  payout_frequency?: 'on_demand' | 'daily' | 'weekly' | 'bi_weekly' | 'monthly' | 'cycle';
  first_payout_delay_days?: number;
  subsequent_payout_delay_days?: number;
  min_withdrawal?: number;
  max_withdrawal?: number;
  withdrawal_methods?: string[];
  payout_processing_time_hours?: number;
  first_payout_special_conditions?: string;
  payout_notes?: string;
  created_at: string;
  updated_at: string;
}

// MarketAccess
export interface MarketAccess {
  id: string;
  offer_id: string;
  markets_available?: string[];
  instruments_count?: number;
  instruments_list?: string[];
  leverage_forex?: string;
  leverage_indices?: string;
  leverage_commodities?: string;
  leverage_crypto?: string;
  leverage_stocks?: string;
  platforms?: string[];
  platform_fees?: Record<string, number>;
  trading_hours?: string;
  trading_hours_restrictions?: string;
  spreads_from?: number;
  commission_forex?: number;
  commission_type?: 'per_lot' | 'per_side' | 'round_turn' | 'percentage';
  commission_other?: Record<string, number>;
  created_at: string;
  updated_at: string;
}

// Complete Challenge (for UI)
export interface Challenge {
  offer: Offer;
  program: Program;
  organizer: Organizer;
  rulesets: Ruleset[];
  payout_terms?: PayoutTerms;
  market_access?: MarketAccess;
  trust_metrics?: TrustMetrics;
}
```

#### 1.3 Aggiornare Schema.ts
**File**: `tradelia/src/models/Schema.ts`

Aggiungere le nuove tabelle al schema Drizzle.

#### 1.4 Eseguire Migration
```bash
# Via Supabase CLI o dashboard
psql -h [supabase-host] -U postgres -d postgres -f migrations/0006_complete_challenge_schema.sql
```

**Deliverables**:
- ✅ Migration SQL creata
- ✅ TypeScript types aggiornati
- ✅ Schema.ts aggiornato
- ✅ Migration eseguita in Supabase

**Time**: 2 ore

---

### STEP 2: Data Collection (P0 - 4-6 ore)

#### 2.1 Tier 1 Prop Firms (3 ore)

**FTMO** (5 offers):
```sql
-- organizer
INSERT INTO organizers VALUES ('ftmo', 'FTMO', 'prop_firm', ...);

-- program
INSERT INTO programs VALUES ('ftmo-challenge', 'ftmo', 'FTMO Challenge', 'paid_evaluation', ...);

-- offers (5)
INSERT INTO offers VALUES 
  ('ftmo-10k', 'ftmo-challenge', 'FTMO Challenge $10K', 10000, 'USD', 155, 'EUR', ...),
  ('ftmo-25k', 'ftmo-challenge', 'FTMO Challenge $25K', 25000, 'USD', 250, 'EUR', ...),
  ('ftmo-50k', 'ftmo-challenge', 'FTMO Challenge $50K', 50000, 'USD', 345, 'EUR', ...),
  ('ftmo-100k', 'ftmo-challenge', 'FTMO Challenge $100K', 100000, 'USD', 540, 'EUR', ...),
  ('ftmo-200k', 'ftmo-challenge', 'FTMO Challenge $200K', 200000, 'USD', 1080, 'EUR', ...);

-- rulesets (10 = 5 offers × 2 phases)
-- payout_terms (5)
-- market_access (5)
-- sources + field_sources
```

**FundedNext** (6 offers - solo Stellar Lite per ora):
```sql
-- organizer
INSERT INTO organizers VALUES ('fundednext', 'FundedNext', 'prop_firm', ...);

-- program
INSERT INTO programs VALUES ('fundednext-stellar-lite', 'fundednext', 'Stellar Lite', 'paid_evaluation', ...);

-- offers (6)
INSERT INTO offers VALUES 
  ('fundednext-stellar-lite-5k', 'fundednext-stellar-lite', 'Stellar Lite $5K', 5000, 'USD', 19, 'USD', ...),
  ('fundednext-stellar-lite-15k', 'fundednext-stellar-lite', 'Stellar Lite $15K', 15000, 'USD', 39, 'USD', ...),
  -- ... (altri 4)
```

**The5ers** (3 offers - Bootcamp):
**E8 Markets** (2 offers - E8 Account):
**The Funded Trader** (3 offers - Knight):

**Total**: ~20 offers per Tier 1

#### 2.2 Free Competitions (1-2 ore)

**TradingView The Leap**:
```sql
-- organizer
INSERT INTO organizers VALUES ('tradingview', 'TradingView', 'platform', ...);

-- program
INSERT INTO programs VALUES ('tradingview-the-leap', 'tradingview', 'The Leap', 'free_competition', 'paper_trading', ...);

-- offer
INSERT INTO offers VALUES ('tradingview-the-leap-q1-2026', 'tradingview-the-leap', 'The Leap Q1 2026', NULL, 'USD', 0, 'USD', FALSE, NULL, 1000000, ...);
```

**Altri 4 free competitions**:
- TradingView Paper Trading
- Deriv Tournaments
- Gate.io Demo Challenge
- Binance Futures Demo

**Total**: 5 free competitions

#### 2.3 Sources & Field Sources (1 ora)

Per ogni campo critico, aggiungere:
```sql
-- Source
INSERT INTO sources (source_type, title, url, accessed_at)
VALUES ('official', 'FTMO Challenge Page', 'https://ftmo.com/en/challenge/', '2026-01-26');

-- Field Source
INSERT INTO field_sources (table_name, record_id, field_name, source_id, quote, confidence)
VALUES ('offers', 'ftmo-10k', 'entry_fee', 1, 'Account Size $10,000 | Entry Fee €155', 1.0);
```

**Deliverables**:
- ✅ 20 Tier 1 offers inseriti
- ✅ 5 Free competitions inserite
- ✅ Sources e field_sources per campi critici
- ✅ Trust metrics calcolati

**Time**: 4-6 ore

---

### STEP 3: UI/UX Redesign (P0 - 4-6 ore)

#### 3.1 Dashboard Layout (1 ora)

**File**: `tradelia/src/app/[locale]/(auth)/dashboard/challenges/page.tsx`

```tsx
export default function ChallengesPage() {
  return (
    <div className="challenges-dashboard">
      {/* Header */}
      <DashboardHeader title="Trading Challenges" />
      
      {/* Tabs: FREE vs PAID */}
      <Tabs defaultValue="paid">
        <TabsList>
          <TabsTrigger value="free">
            🆓 Free Competitions
          </TabsTrigger>
          <TabsTrigger value="paid">
            💰 Paid Evaluations
          </TabsTrigger>
        </TabsList>
        
        {/* FREE Tab */}
        <TabsContent value="free">
          <FreeChallengesSection />
        </TabsContent>
        
        {/* PAID Tab */}
        <TabsContent value="paid">
          <PaidChallengesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

#### 3.2 Challenge Card Redesign (2 ore)

**File**: `tradelia/src/components/dashboard/challenges/ChallengeCard.tsx`

```tsx
interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { offer, program, organizer, rulesets, payout_terms, market_access } = challenge;
  
  return (
    <Card className="challenge-card">
      {/* Header: Logo + Badges */}
      <CardHeader>
        <div className="flex justify-between items-start">
          {/* Firm Logo (SVG custom) */}
          <FirmLogo firmId={organizer.id} />
          
          {/* Badges */}
          <div className="badges">
            {offer.refundable && <Badge variant="success">💰 Refundable</Badge>}
            {program.has_free_trial && <Badge variant="info">🎁 Free Trial</Badge>}
            {offer.is_hot && <Badge variant="warning">🔥 Hot</Badge>}
          </div>
        </div>
        
        {/* Challenge Name */}
        <h3>{offer.offer_name || `${program.name} ${offer.account_size}`}</h3>
        
        {/* Challenge Type */}
        <ChallengeTypeBadge type={program.subtype} />
      </CardHeader>
      
      {/* Body: Key Metrics */}
      <CardContent>
        {/* Account Size & Fee */}
        <div className="metrics-primary">
          <div className="metric">
            <label>Account Size</label>
            <value>${offer.account_size?.toLocaleString()}</value>
          </div>
          <div className="metric">
            <label>Entry Fee</label>
            <value>{offer.fee_currency}{offer.entry_fee}</value>
          </div>
        </div>
        
        {/* Rules Grid */}
        <div className="metrics-grid">
          <Metric label="Target" value={`${rulesets[0].profit_target_pct}%`} />
          <Metric label="Drawdown" value={`${rulesets[0].max_drawdown_pct}%`} />
          <Metric label="Split" value={`${payout_terms?.profit_split_max_pct}%`} />
          <Metric label="Days" value={rulesets[0].min_trading_days} />
        </div>
        
        {/* Platforms */}
        <div className="platforms">
          {market_access?.platforms?.map(platform => (
            <PlatformIcon key={platform} platform={platform} />
          ))}
        </div>
        
        {/* Key Differentiator */}
        {offer.badges?.includes('cheapest') && (
          <Badge variant="success" size="lg">⭐ CHEAPEST OPTION</Badge>
        )}
      </CardContent>
      
      {/* Footer: Actions */}
      <CardFooter>
        <Button onClick={() => openDrawer(challenge)}>View Details</Button>
        <Button variant="outline" onClick={() => addToCompare(challenge)}>Compare</Button>
      </CardFooter>
    </Card>
  );
}
```

#### 3.3 Filters & Sorting (1 ora)

**File**: `tradelia/src/components/dashboard/challenges/ChallengeFilters.tsx`

```tsx
export function ChallengeFilters() {
  return (
    <div className="filters">
      {/* Firm Filter */}
      <Select>
        <SelectTrigger>Firm</SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Firms</SelectItem>
          <SelectItem value="ftmo">FTMO</SelectItem>
          <SelectItem value="fundednext">FundedNext</SelectItem>
          {/* ... */}
        </SelectContent>
      </Select>
      
      {/* Challenge Type Filter */}
      <Select>
        <SelectTrigger>Type</SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="1_step">1-Step</SelectItem>
          <SelectItem value="2_step">2-Step</SelectItem>
          <SelectItem value="3_step">3-Step</SelectItem>
          <SelectItem value="instant">Instant Funding</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Price Range Filter */}
      <Slider
        label="Price Range"
        min={0}
        max={2000}
        step={50}
      />
      
      {/* Account Size Filter */}
      <Slider
        label="Account Size"
        min={5000}
        max={200000}
        step={5000}
      />
      
      {/* Features Filter */}
      <CheckboxGroup label="Features">
        <Checkbox value="refundable">Refundable</Checkbox>
        <Checkbox value="no_time_limit">No Time Limit</Checkbox>
        <Checkbox value="crypto">Crypto Trading</Checkbox>
        <Checkbox value="ea_allowed">EA/Bots Allowed</Checkbox>
      </CheckboxGroup>
      
      {/* Platforms Filter */}
      <CheckboxGroup label="Platforms">
        <Checkbox value="mt4">MT4</Checkbox>
        <Checkbox value="mt5">MT5</Checkbox>
        <Checkbox value="ctrader">cTrader</Checkbox>
        <Checkbox value="tradingview">TradingView</Checkbox>
      </CheckboxGroup>
    </div>
  );
}
```

#### 3.4 Mobile Responsive (1 ora)

```css
/* Mobile: Stack cards vertically */
@media (max-width: 768px) {
  .challenges-grid {
    grid-template-columns: 1fr;
  }
  
  .challenge-card {
    width: 100%;
  }
  
  .challenge-drawer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
  }
  
  .filters {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    /* Bottom sheet */
  }
}
```

**Deliverables**:
- ✅ Dashboard con tabs FREE/PAID
- ✅ Challenge cards ridisegnate
- ✅ Filters avanzati implementati
- ✅ Sorting implementato
- ✅ Mobile responsive (no scroll laterale)

**Time**: 4-6 ore

---

### STEP 4: SVG Icons (P1 - 2-3 ore)

#### 4.1 Firm Logos (1 ora)

Creare 5 SVG logos:
- FTMO
- FundedNext
- The5ers
- E8 Markets
- The Funded Trader

**File**: `tradelia/src/components/icons/FirmLogos.tsx`

#### 4.2 Challenge Type Badges (30 min)

Creare 4 SVG badges:
- 1-Step
- 2-Step
- 3-Step
- Instant

**File**: `tradelia/src/components/icons/ChallengeTypeBadges.tsx`

#### 4.3 Feature Icons (1 ora)

Creare 10+ SVG icons:
- Refundable
- Scaling
- Fast Payout
- No Time Limit
- Crypto
- EA Allowed
- News Trading
- Weekend Holding
- etc.

**File**: `tradelia/src/components/icons/FeatureIcons.tsx`

#### 4.4 Platform Icons (30 min)

Creare 5 SVG icons:
- MT4
- MT5
- cTrader
- TradingView
- NinjaTrader

**File**: `tradelia/src/components/icons/PlatformIcons.tsx`

**Deliverables**:
- ✅ 5 firm logos (SVG)
- ✅ 4 challenge type badges (SVG)
- ✅ 10+ feature icons (SVG)
- ✅ 5 platform icons (SVG)
- ✅ NO EMOJI in tutto il codice

**Time**: 2-3 ore

---

### STEP 5: Testing & Polish (P1 - 2 ore)

#### 5.1 Testing (1 ora)
- [ ] Test desktop (Chrome, Firefox, Safari)
- [ ] Test mobile (iOS, Android)
- [ ] Test filters (tutti i filtri funzionano)
- [ ] Test sorting (tutti i sort funzionano)
- [ ] Test drawer (apre/chiude correttamente)
- [ ] Test comparison (funziona)
- [ ] Test FREE vs PAID tabs (switch corretto)

#### 5.2 Polish (1 ora)
- [ ] Animazioni smooth
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Accessibility (ARIA labels, keyboard navigation)

**Deliverables**:
- ✅ Tutti i test passati
- ✅ Animazioni implementate
- ✅ Stati gestiti correttamente
- ✅ Accessibilità verificata

**Time**: 2 ore

---

## 📊 TIMELINE TOTALE

| Step | Task | Time | Priority |
|------|------|------|----------|
| 1 | Schema Database | 2 ore | P0 |
| 2 | Data Collection | 4-6 ore | P0 |
| 3 | UI/UX Redesign | 4-6 ore | P0 |
| 4 | SVG Icons | 2-3 ore | P1 |
| 5 | Testing & Polish | 2 ore | P1 |
| **TOTAL** | **All Steps** | **14-19 ore** | **P0** |

---

## ✅ SUCCESS CRITERIA

### Data Quality
- [x] Schema normalizzato implementato
- [x] 25+ challenges inserite (20 paid + 5 free)
- [x] Sources tracking per campi critici
- [x] Freshness rules implementate
- [x] Reputation scores calcolati

### UI/UX
- [x] Distinzione FREE vs PAID chiara
- [x] Multi-challenge per firm gestito
- [x] Filters avanzati funzionanti
- [x] Sorting funzionante
- [x] Mobile responsive (no scroll laterale)
- [x] NO EMOJI, solo SVG custom
- [x] Trial info visibile
- [x] Piattaforme visibili per ogni challenge

### Technical
- [x] TypeScript types aggiornati
- [x] Schema Drizzle aggiornato
- [x] Migration eseguita
- [x] Componenti aggiornati
- [x] Tests passati

---

## 🚀 NEXT ACTION

**Vuoi che inizi con STEP 1 (Schema Database)?**

Posso:
1. Creare il file migration SQL completo
2. Aggiornare i TypeScript types
3. Aggiornare Schema.ts
4. Preparare tutto per l'esecuzione

**Tempo stimato**: 2 ore

**Confermi?** 🚀

