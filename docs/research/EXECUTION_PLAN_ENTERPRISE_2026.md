# Execution Plan - Enterprise Implementation 2026

**Date**: 2026-01-26  
**Status**: 🚀 READY TO EXECUTE  
**Integrates**: Research + ChatGPT Audit + Enterprise Schema

---

## 🎯 EXECUTION SUMMARY

### What We Have
- ✅ Complete research (100+ challenges documented)
- ✅ Enterprise schema with all 7 fixes
- ✅ Data quality rules defined
- ✅ ID strategy (deterministic)
- ✅ Validation schemas (Zod)
- ✅ Views for FREE/PAID separation

### What We'll Build
1. **Database Schema** (2 hours) - Enterprise-ready with audit trail
2. **Data Ingestion** (4-6 hours) - 25+ challenges with sources
3. **TypeScript Layer** (2 hours) - Types + validation + helpers
4. **UI Components** (4-6 hours) - FREE/PAID separation + filters
5. **SVG Icons** (2-3 hours) - Custom icons (no emoji)
6. **Testing** (2 hours) - All features working

**Total Time**: 16-21 hours

---

## 📋 STEP 1: Database Schema (2 hours)

### 1.1 Execute Migration (30 min)

**File**: `tradelia/migrations/0006_complete_challenge_schema_enterprise.sql`

**Actions**:
```bash
# Option A: Supabase Dashboard
# 1. Go to Supabase Dashboard → SQL Editor
# 2. Paste migration SQL
# 3. Run

# Option B: Supabase CLI
supabase db push

# Option C: psql
psql -h [host] -U postgres -d postgres -f migrations/0006_complete_challenge_schema_enterprise.sql
```

**Verification**:
```sql
-- Check tables created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('organizers', 'programs', 'offers', 'rulesets', 'payout_terms', 'market_access', 'trust_metrics', 'sources', 'field_sources', 'snapshots');

-- Check views created
SELECT table_name FROM information_schema.views 
WHERE table_schema = 'public'
AND table_name IN ('sources_with_freshness', 'dashboard_offers', 'dashboard_free_offers', 'dashboard_paid_offers', 'organizers_trust_latest');

-- Check sample data
SELECT * FROM organizers WHERE id = 'ftmo';
SELECT * FROM programs WHERE id = 'ftmo-challenge';
SELECT * FROM offers WHERE id = 'ftmo-challenge-10k';
```

### 1.2 Update TypeScript Types (1 hour)

**File**: `tradelia/src/types/challenge.ts`

```typescript
// Copy types from IMPLEMENTATION_ROADMAP_FINAL_2026.md
// Add Zod schemas from DATA_QUALITY_RULES_2026.md

export interface Organizer { ... }
export interface Program { ... }
export interface Offer { ... }
export interface Ruleset { ... }
export interface PayoutTerms { ... }
export interface MarketAccess { ... }
export interface TrustMetrics { ... }
export interface Source { ... }
export interface FieldSource { ... }

// Zod schemas
export const OrganizerSchema = z.object({ ... });
export const ProgramSchema = z.object({ ... });
export const OfferSchema = z.object({ ... });
// ... etc
```

### 1.3 Update Drizzle Schema (30 min)

**File**: `tradelia/src/models/Schema.ts`

```typescript
import { pgTable, text, numeric, boolean, integer, jsonb, timestamp, bigserial, date, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const organizerTypeEnum = pgEnum('organizer_type_enum', ['prop_firm', 'broker', 'platform', 'exchange']);
export const legalStatusEnum = pgEnum('legal_status_enum', ['active', 'paused', 'legal_issues', 'ceased']);
// ... etc

// Tables
export const organizers = pgTable('organizers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  organizerType: organizerTypeEnum('organizer_type').notNull(),
  // ... etc
});

export const programs = pgTable('programs', { ... });
export const offers = pgTable('offers', { ... });
// ... etc
```

**Deliverables**:
- ✅ Migration executed in Supabase
- ✅ TypeScript types updated
- ✅ Drizzle schema updated
- ✅ Sample data verified

**Time**: 2 hours

---

## 📋 STEP 2: Data Ingestion (4-6 hours)

### 2.1 Create Ingestion Script (1 hour)

**File**: `tradelia/scripts/ingest-challenges-enterprise.ts`

```typescript
import { supabase } from '@/libs/supabase/client';
import { OrganizerSchema, ProgramSchema, OfferSchema } from '@/types/challenge';

// Helper functions
function generateOrganizerId(name: string): string { ... }
function generateProgramId(organizerId: string, programName: string): string { ... }
function generateOfferId(programId: string, accountSize?: number): string { ... }

// Ingestion functions
async function ingestOrganizer(data: any) {
  const validated = OrganizerSchema.parse(data);
  const { error } = await supabase.from('organizers').upsert(validated, { onConflict: 'id' });
  if (error) throw error;
}

async function ingestProgram(data: any) { ... }
async function ingestOffer(data: any) { ... }
async function ingestRuleset(data: any) { ... }
async function ingestPayoutTerms(data: any) { ... }
async function ingestMarketAccess(data: any) { ... }
async function ingestSource(data: any) { ... }
async function ingestFieldSource(data: any) { ... }

// Main ingestion
async function main() {
  console.log('🚀 Starting data ingestion...');
  
  // FTMO
  await ingestFTMO();
  
  // FundedNext
  await ingestFundedNext();
  
  // The5ers
  await ingestThe5ers();
  
  // E8 Markets
  await ingestE8Markets();
  
  // The Funded Trader
  await ingestTheFundedTrader();
  
  // Free Competitions
  await ingestTradingViewTheLeap();
  await ingestTradingViewPaperTrading();
  await ingestDerivTournaments();
  
  console.log('✅ Data ingestion complete!');
}

main();
```

### 2.2 Ingest Tier 1 Prop Firms (3 hours)

#### FTMO (30 min)
```typescript
async function ingestFTMO() {
  // 1. Organizer
  await ingestOrganizer({
    id: 'ftmo',
    name: 'FTMO',
    organizer_type: 'prop_firm',
    website_url: 'https://ftmo.com',
    founded_year: 2015,
    headquarters: 'Prague, Czech Republic',
    legal_status: 'active',
    reputation_score: 96,
    trustpilot_score: 4.6,
    trustpilot_reviews: 15000,
  });
  
  // 2. Program
  await ingestProgram({
    id: 'ftmo-challenge',
    organizer_id: 'ftmo',
    name: 'FTMO Challenge',
    category: 'paid_evaluation',
    type: 'prop_challenge',
    subtype: '2_step',
    official_url: 'https://ftmo.com/en/challenge/',
    status: 'active',
    has_free_trial: true,
    pros: ['Excellent reputation', 'Refundable fee', 'Scaling to $2M'],
    cons: ['Strict consistency rule', 'Low pass rate', 'High fees'],
  });
  
  // 3. Offers (5)
  const accountSizes = [10000, 25000, 50000, 100000, 200000];
  const entryFees = [155, 250, 345, 540, 1080];
  
  for (let i = 0; i < accountSizes.length; i++) {
    const offerId = `ftmo-challenge-${accountSizes[i] / 1000}k`;
    
    await ingestOffer({
      id: offerId,
      program_id: 'ftmo-challenge',
      offer_name: `FTMO Challenge $${accountSizes[i].toLocaleString()}`,
      account_size: accountSizes[i],
      account_currency: 'USD',
      entry_fee: entryFees[i],
      fee_currency: 'EUR',
      refundable: true,
      refund_conditions: 'Refunded on first profit split',
      scaling_max: 200000,
      time_limit_days: null,
      recurring: false,
      frequency: 'always_open',
      display_order: i + 1,
    });
    
    // Rulesets (2 phases)
    await ingestRuleset({
      id: `${offerId}-p1`,
      offer_id: offerId,
      phase_number: 1,
      phase_name: 'Challenge',
      ruleset_mode: 'target_based',
      profit_target_pct: 10,
      max_daily_loss_pct: 5,
      max_daily_loss_type: 'equity_based',
      max_drawdown_pct: 10,
      max_drawdown_type: 'equity_based',
      min_trading_days: 4,
      consistency_required: true,
      best_day_max_pct: 30,
      weekend_holding: true,
      news_trading: true,
      ea_allowed: true,
    });
    
    await ingestRuleset({
      id: `${offerId}-p2`,
      offer_id: offerId,
      phase_number: 2,
      phase_name: 'Verification',
      ruleset_mode: 'target_based',
      profit_target_pct: 5,
      max_daily_loss_pct: 5,
      max_daily_loss_type: 'equity_based',
      max_drawdown_pct: 10,
      max_drawdown_type: 'equity_based',
      min_trading_days: 4,
      consistency_required: true,
      best_day_max_pct: 30,
      weekend_holding: true,
      news_trading: true,
      ea_allowed: true,
    });
    
    // Payout Terms
    await ingestPayoutTerms({
      id: `${offerId}-payout`,
      offer_id: offerId,
      profit_split_initial_pct: 80,
      profit_split_scaled_pct: 90,
      profit_split_max_pct: 90,
      payout_frequency: 'bi_weekly',
      first_payout_delay_days: 14,
      min_withdrawal: 50,
      withdrawal_methods: ['bank', 'crypto'],
      payout_processing_time_hours: 72,
      eligible_after_phase: 2,
    });
    
    // Market Access
    await ingestMarketAccess({
      id: `${offerId}-market`,
      offer_id: offerId,
      markets_available: ['forex', 'indices', 'commodities', 'crypto'],
      instruments_count: 100,
      leverage_forex: '1:100',
      leverage_indices: '1:100',
      leverage_commodities: '1:100',
      leverage_crypto: '1:2',
      platforms: ['MT4', 'MT5', 'cTrader', 'DXtrade'],
      commission_forex: 0,
    });
  }
  
  // Sources
  const sourceId = await ingestSource({
    source_type: 'official',
    title: 'FTMO Challenge Pricing Page',
    url: 'https://ftmo.com/en/challenge/',
    accessed_at: '2026-01-26',
  });
  
  // Field Sources (examples)
  await ingestFieldSource({
    table_name: 'offers',
    record_id: 'ftmo-challenge-10k',
    field_name: 'entry_fee',
    source_id: sourceId,
    quote: 'Account Size $10,000 | Entry Fee €155',
    confidence: 1.0,
  });
}
```

#### FundedNext (30 min - Stellar Lite only)
#### The5ers (30 min - Bootcamp only)
#### E8 Markets (30 min - E8 Account only)
#### The Funded Trader (30 min - Knight only)

**Total Tier 1**: ~20 offers

### 2.3 Ingest Free Competitions (1-2 hours)

#### TradingView The Leap (30 min)
```typescript
async function ingestTradingViewTheLeap() {
  // Organizer
  await ingestOrganizer({
    id: 'tradingview',
    name: 'TradingView',
    organizer_type: 'platform',
    website_url: 'https://www.tradingview.com',
    founded_year: 2011,
    headquarters: 'New York, USA',
    legal_status: 'active',
  });
  
  // Program
  await ingestProgram({
    id: 'tradingview-the-leap',
    organizer_id: 'tradingview',
    name: 'The Leap',
    category: 'free_competition',
    type: 'paper_trading',
    subtype: 'one_time',
    official_url: 'https://www.tradingview.com/the-leap/',
    status: 'active',
    has_free_trial: false,
  });
  
  // Offer
  await ingestOffer({
    id: 'tradingview-the-leap-q1-2026',
    program_id: 'tradingview-the-leap',
    offer_name: 'The Leap Q1 2026',
    entry_fee: 0,
    prize_pool: 1000000,
    recurring: true,
    frequency: 'quarterly',
    start_date: '2026-01-01',
    end_date: '2026-03-31',
    max_participants: null,
  });
  
  // Ruleset (ranking-based)
  await ingestRuleset({
    id: 'tradingview-the-leap-q1-2026-p1',
    offer_id: 'tradingview-the-leap-q1-2026',
    phase_number: 1,
    ruleset_mode: 'ranking_based',
    profit_target_pct: null, // Ranking-based
    weekend_holding: true,
    news_trading: true,
    ea_allowed: false,
  });
}
```

#### Other Free Competitions (30 min each)
- TradingView Paper Trading
- Deriv Tournaments
- Gate.io Demo Challenge
- Binance Futures Demo

**Total Free**: 5 competitions

**Deliverables**:
- ✅ Ingestion script created
- ✅ 20 Tier 1 offers ingested
- ✅ 5 Free competitions ingested
- ✅ Sources tracked for critical fields
- ✅ Data verified in Supabase

**Time**: 4-6 hours

---

## 📋 STEP 3: TypeScript Layer (2 hours)

### 3.1 Create Helper Functions (1 hour)

**File**: `tradelia/src/lib/challenges/helpers.ts`

```typescript
import type { Challenge, Offer, Program, Organizer } from '@/types/challenge';

// ID Generators
export function generateOrganizerId(name: string): string { ... }
export function generateProgramId(organizerId: string, programName: string): string { ... }
export function generateOfferId(programId: string, accountSize?: number, edition?: string): string { ... }

// Validation
export function validateGeoRestrictions(offer: Offer, userCountry: string): boolean { ... }
export function validateFreeVsPaid(program: Program, offer: Offer): boolean { ... }

// Formatting
export function formatCurrency(amount: number, currency: string): string { ... }
export function formatAccountSize(size: number): string { ... }

// Badges
export function getBadges(offer: Offer): string[] { ... }
export function getTags(offer: Offer, program: Program): string[] { ... }
```

### 3.2 Create Query Functions (1 hour)

**File**: `tradelia/src/lib/challenges/queries.ts`

```typescript
import { supabase } from '@/libs/supabase/client';

// Get all FREE challenges
export async function getFreeChallenges() {
  const { data, error } = await supabase
    .from('dashboard_free_offers')
    .select('*')
    .eq('program_status', 'active')
    .order('is_featured', { ascending: false })
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data;
}

// Get all PAID challenges
export async function getPaidChallenges() {
  const { data, error } = await supabase
    .from('dashboard_paid_offers')
    .select('*')
    .eq('program_status', 'active')
    .order('is_featured', { ascending: false })
    .order('entry_fee', { ascending: true });
  
  if (error) throw error;
  return data;
}

// Get complete challenge (with rulesets, payout, market)
export async function getCompleteChallenge(offerId: string): Promise<Challenge> {
  const [offer, rulesets, payout, market] = await Promise.all([
    supabase.from('dashboard_offers').select('*').eq('offer_id', offerId).single(),
    supabase.from('rulesets').select('*').eq('offer_id', offerId).order('phase_number'),
    supabase.from('payout_terms').select('*').eq('offer_id', offerId).single(),
    supabase.from('market_access').select('*').eq('offer_id', offerId).single(),
  ]);
  
  return {
    offer: offer.data,
    rulesets: rulesets.data,
    payout_terms: payout.data,
    market_access: market.data,
  };
}

// Filter challenges
export async function filterChallenges(filters: ChallengeFilters) {
  let query = supabase.from('dashboard_paid_offers').select('*');
  
  if (filters.firmIds?.length) {
    query = query.in('organizer_id', filters.firmIds);
  }
  
  if (filters.minFee !== undefined) {
    query = query.gte('entry_fee', filters.minFee);
  }
  
  if (filters.maxFee !== undefined) {
    query = query.lte('entry_fee', filters.maxFee);
  }
  
  // ... more filters
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
```

**Deliverables**:
- ✅ Helper functions created
- ✅ Query functions created
- ✅ Validation functions created
- ✅ All functions tested

**Time**: 2 hours

---

## 📋 STEP 4: UI Components (4-6 hours)

### 4.1 Dashboard Page (1 hour)

**File**: `tradelia/src/app/[locale]/(auth)/dashboard/challenges/page.tsx`

```typescript
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FreeChallengesSection } from '@/components/dashboard/challenges/FreeChallengesSection';
import { PaidChallengesSection } from '@/components/dashboard/challenges/PaidChallengesSection';

export default function ChallengesPage() {
  return (
    <div className="challenges-dashboard">
      <Tabs defaultValue="paid" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="free" className="text-green-600">
            🆓 Free Competitions
          </TabsTrigger>
          <TabsTrigger value="paid" className="text-blue-600">
            💰 Paid Evaluations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="free">
          <FreeChallengesSection />
        </TabsContent>
        
        <TabsContent value="paid">
          <PaidChallengesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### 4.2 Challenge Card (2 hours)

**File**: `tradelia/src/components/dashboard/challenges/ChallengeCard.tsx`

(Copy from IMPLEMENTATION_ROADMAP_FINAL_2026.md)

### 4.3 Filters & Sorting (1-2 hours)

**File**: `tradelia/src/components/dashboard/challenges/ChallengeFilters.tsx`

(Copy from IMPLEMENTATION_ROADMAP_FINAL_2026.md)

### 4.4 Mobile Responsive (1 hour)

**File**: `tradelia/src/styles/challenges-responsive.css`

```css
@media (max-width: 768px) {
  .challenges-grid {
    grid-template-columns: 1fr;
  }
  
  .challenge-card {
    width: 100%;
  }
  
  /* No horizontal scroll */
  .challenges-dashboard {
    overflow-x: hidden;
  }
}
```

**Deliverables**:
- ✅ Dashboard with FREE/PAID tabs
- ✅ Challenge cards redesigned
- ✅ Filters implemented
- ✅ Sorting implemented
- ✅ Mobile responsive

**Time**: 4-6 hours

---

## 📋 STEP 5: SVG Icons (2-3 hours)

### 5.1 Firm Logos (1 hour)
### 5.2 Challenge Badges (30 min)
### 5.3 Feature Icons (1 hour)
### 5.4 Platform Icons (30 min)

(Details in IMPLEMENTATION_ROADMAP_FINAL_2026.md)

**Deliverables**:
- ✅ 25+ custom SVG icons
- ✅ NO EMOJI anywhere

**Time**: 2-3 hours

---

## 📋 STEP 6: Testing (2 hours)

### 6.1 Database Tests (30 min)
### 6.2 UI Tests (1 hour)
### 6.3 Mobile Tests (30 min)

**Deliverables**:
- ✅ All tests passing
- ✅ No bugs found

**Time**: 2 hours

---

## ✅ COMPLETION CHECKLIST

### Database
- [ ] Migration executed
- [ ] All tables created
- [ ] All views created
- [ ] Sample data verified
- [ ] Constraints working

### Data
- [ ] 20 Tier 1 offers ingested
- [ ] 5 Free competitions ingested
- [ ] Sources tracked
- [ ] Field sources added
- [ ] Data quality verified

### TypeScript
- [ ] Types updated
- [ ] Schemas updated
- [ ] Helpers created
- [ ] Queries created
- [ ] Validation working

### UI
- [ ] FREE/PAID separation
- [ ] Cards redesigned
- [ ] Filters working
- [ ] Sorting working
- [ ] Mobile responsive
- [ ] NO EMOJI

### Icons
- [ ] Firm logos (5)
- [ ] Challenge badges (4)
- [ ] Feature icons (10+)
- [ ] Platform icons (5)

### Testing
- [ ] Database tests
- [ ] UI tests
- [ ] Mobile tests
- [ ] All features working

---

## 🚀 READY TO START?

**Vuoi che inizi con STEP 1 (Database Schema)?**

Posso:
1. ✅ Eseguire la migration in Supabase
2. ✅ Verificare che tutto funzioni
3. ✅ Aggiornare i TypeScript types
4. ✅ Preparare per STEP 2 (Data Ingestion)

**Confermi?** 🚀

