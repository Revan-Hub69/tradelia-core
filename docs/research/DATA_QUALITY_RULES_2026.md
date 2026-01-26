# Data Quality Rules & Validation - Enterprise 2026

**Date**: 2026-01-26  
**Status**: 🎯 IMPLEMENTATION RULES  
**Purpose**: Validation rules for application layer

---

## 🎯 CRITICAL VALIDATION RULES

### Rule 1: FREE vs PAID Coherence

**Context**: `programs.category` determines if challenge is FREE or PAID

#### FREE Competition Rules
```typescript
if (program.category === 'free_competition') {
  // MUST
  offer.entry_fee === 0 || offer.entry_fee === null;
  
  // SHOULD
  offer.prize_pool !== null; // Most free competitions have prizes
  
  // CAN BE NULL
  offer.account_size; // Not always applicable
  
  // VALIDATION
  if (offer.entry_fee > 0) {
    throw new Error('FREE competitions cannot have entry fee');
  }
}
```

#### PAID Evaluation Rules
```typescript
if (program.category === 'paid_evaluation' || program.category === 'instant_funding') {
  // MUST
  offer.entry_fee > 0;
  offer.account_size > 0;
  offer.account_currency !== null;
  
  // VALIDATION
  if (!offer.entry_fee || offer.entry_fee <= 0) {
    throw new Error('PAID evaluations must have entry fee');
  }
  
  if (!offer.account_size || offer.account_size <= 0) {
    throw new Error('PAID evaluations must have account size');
  }
}
```

---

### Rule 2: Ruleset Mode Coherence

**Context**: `rulesets.ruleset_mode` determines if profit target is required

#### Target-Based Rules
```typescript
if (ruleset.ruleset_mode === 'target_based') {
  // MUST
  ruleset.profit_target_pct !== null;
  ruleset.profit_target_pct > 0;
  
  // VALIDATION
  if (!ruleset.profit_target_pct) {
    throw new Error('Target-based rulesets must have profit target');
  }
}
```

#### Ranking-Based Rules
```typescript
if (ruleset.ruleset_mode === 'ranking_based') {
  // CAN BE NULL
  ruleset.profit_target_pct; // Not required for leaderboard competitions
  
  // MUST HAVE
  // Some other ranking criteria (handled in application logic)
}
```

---

### Rule 3: Geo Restrictions Semantic

**Context**: `offers.geo_mode` determines if `geo_list` is allowlist or blocklist

#### Allowlist (Whitelist)
```typescript
if (offer.geo_mode === 'allow') {
  // geo_list = countries WHERE service IS available
  // Example: ["US", "CA", "UK"] = only these countries
  
  // User from "DE" → NOT ALLOWED
  // User from "US" → ALLOWED
}
```

#### Blocklist (Blacklist)
```typescript
if (offer.geo_mode === 'block') {
  // geo_list = countries WHERE service IS NOT available
  // Example: ["US", "CA"] = blocked countries
  
  // User from "US" → NOT ALLOWED
  // User from "DE" → ALLOWED
}
```

#### Validation
```typescript
function validateGeoRestrictions(offer: Offer, userCountry: string): boolean {
  if (!offer.geo_list || offer.geo_list.length === 0) {
    return true; // No restrictions
  }
  
  const isInList = offer.geo_list.includes(userCountry);
  
  if (offer.geo_mode === 'allow') {
    return isInList; // Must be in allowlist
  } else {
    return !isInList; // Must NOT be in blocklist
  }
}
```

---

### Rule 4: Multi-Phase Coherence

**Context**: Multi-step challenges have multiple `rulesets` rows

#### Phase Numbering
```typescript
// Phases must be sequential starting from 1
const phases = rulesets.sort((a, b) => a.phase_number - b.phase_number);

for (let i = 0; i < phases.length; i++) {
  if (phases[i].phase_number !== i + 1) {
    throw new Error(`Phase numbering must be sequential. Expected ${i + 1}, got ${phases[i].phase_number}`);
  }
}
```

#### Phase Names
```typescript
// Recommended phase names
const phaseNames = {
  1: 'Challenge', // or 'Phase 1', 'Step 1'
  2: 'Verification', // or 'Phase 2', 'Step 2'
  3: 'Phase 3', // or 'Step 3'
};
```

---

### Rule 5: Payout Eligibility

**Context**: `payout_terms.eligible_after_phase` determines when payouts start

#### Instant Funding
```typescript
if (program.category === 'instant_funding') {
  payout_terms.eligible_after_phase === 0; // Immediate
}
```

#### After Evaluation
```typescript
if (program.category === 'paid_evaluation') {
  // Usually after all evaluation phases
  const maxPhase = Math.max(...rulesets.map(r => r.phase_number));
  payout_terms.eligible_after_phase === maxPhase;
  
  // Example: 2-step challenge
  // Phase 1: Challenge
  // Phase 2: Verification
  // eligible_after_phase = 2 (after both phases)
}
```

---

### Rule 6: ID Strategy (Deterministic)

**Context**: IDs must be deterministic for UPSERT operations

#### Organizer IDs
```typescript
// Format: lowercase slug
// Examples: 'ftmo', 'fundednext', 'the5ers', 'e8markets', 'tradingview'

function generateOrganizerId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '') // Remove special chars
    .replace(/^the/, ''); // Remove "The" prefix
}

// "FTMO" → "ftmo"
// "FundedNext" → "fundednext"
// "The 5%ers" → "5ers"
// "E8 Markets" → "e8markets"
```

#### Program IDs
```typescript
// Format: {organizer_id}-{program_slug}
// Examples: 'ftmo-challenge', 'fundednext-stellar-lite', 'the5ers-highstakes'

function generateProgramId(organizerId: string, programName: string): string {
  const slug = programName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `${organizerId}-${slug}`;
}

// "FTMO Challenge" → "ftmo-challenge"
// "Stellar Lite" → "fundednext-stellar-lite"
// "High Stakes" → "the5ers-highstakes"
```

#### Offer IDs
```typescript
// Format: {program_id}-{account_size}k
// Examples: 'ftmo-challenge-10k', 'stellar-lite-5k', 'the-leap-q1-2026'

function generateOfferId(programId: string, accountSize?: number, edition?: string): string {
  if (accountSize) {
    const sizeK = Math.floor(accountSize / 1000);
    return `${programId}-${sizeK}k`;
  } else if (edition) {
    return `${programId}-${edition}`;
  } else {
    return programId;
  }
}

// FTMO $10,000 → "ftmo-challenge-10k"
// Stellar Lite $5,000 → "fundednext-stellar-lite-5k"
// The Leap Q1 2026 → "tradingview-the-leap-q1-2026"
```

#### Ruleset IDs
```typescript
// Format: {offer_id}-p{phase_number}
// Examples: 'ftmo-10k-p1', 'ftmo-10k-p2'

function generateRulesetId(offerId: string, phaseNumber: number): string {
  return `${offerId}-p${phaseNumber}`;
}
```

#### Payout/Market IDs
```typescript
// Format: {offer_id}-{suffix}
// Examples: 'ftmo-10k-payout', 'ftmo-10k-market'

function generatePayoutId(offerId: string): string {
  return `${offerId}-payout`;
}

function generateMarketId(offerId: string): string {
  return `${offerId}-market`;
}
```

---

## 📊 FIELD VALIDATION SCHEMAS (Zod)

### Organizer Schema
```typescript
import { z } from 'zod';

export const OrganizerSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+$/),
  name: z.string().min(1),
  organizer_type: z.enum(['prop_firm', 'broker', 'platform', 'exchange']),
  website_url: z.string().url(),
  founded_year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  headquarters: z.string().optional(),
  legal_status: z.enum(['active', 'paused', 'legal_issues', 'ceased']),
  legal_notes: z.string().optional(),
  logo_url: z.string().url().optional(),
  reputation_score: z.number().min(0).max(100).optional(),
  trustpilot_score: z.number().min(0).max(5).optional(),
  trustpilot_reviews: z.number().int().min(0).optional(),
  trustpilot_updated_at: z.string().optional(),
  total_paid_out: z.number().min(0).optional(),
  total_paid_currency: z.string().default('USD'),
  active_traders: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});
```

### Program Schema
```typescript
export const ProgramSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  organizer_id: z.string(),
  name: z.string().min(1),
  category: z.enum(['free_competition', 'paid_evaluation', 'instant_funding']),
  type: z.enum(['paper_trading', 'demo_contest', 'prop_challenge', 'tournament']),
  subtype: z.string().optional(),
  official_url: z.string().url(),
  terms_url: z.string().url().optional(),
  faq_url: z.string().url().optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'upcoming', 'ended', 'paused']),
  has_free_trial: z.boolean().default(false),
  free_trial_description: z.string().optional(),
  free_trial_url: z.string().url().optional(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  best_for: z.string().optional(),
  not_recommended_for: z.string().optional(),
});
```

### Offer Schema
```typescript
export const OfferSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  program_id: z.string(),
  offer_name: z.string().optional(),
  display_order: z.number().int().default(0),
  account_size: z.number().positive().optional(),
  account_currency: z.string().default('USD'),
  entry_fee: z.number().min(0).optional(),
  fee_currency: z.string().default('USD'),
  refundable: z.boolean().default(false),
  refund_conditions: z.string().optional(),
  prize_pool: z.number().min(0).optional(),
  scaling_max: z.number().positive().optional(),
  scaling_conditions: z.string().optional(),
  time_limit_days: z.number().int().positive().optional(),
  recurring: z.boolean().default(false),
  frequency: z.enum(['always_open', 'monthly', 'quarterly', 'annual', 'one_time']).default('always_open'),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  registration_deadline: z.string().optional(),
  next_edition_date: z.string().optional(),
  max_participants: z.number().int().positive().optional(),
  min_age: z.number().int().min(13).max(100).optional(),
  kyc_required: z.boolean().default(false),
  geo_mode: z.enum(['allow', 'block']).default('block'),
  geo_list: z.array(z.string()).optional(),
  is_featured: z.boolean().default(false),
  is_hot: z.boolean().default(false),
  badges: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
}).refine(
  (data) => {
    // FREE competitions must have entry_fee = 0
    if (data.entry_fee === 0) {
      return true; // Assume FREE
    }
    // PAID evaluations must have account_size
    if (data.entry_fee && data.entry_fee > 0) {
      return data.account_size && data.account_size > 0;
    }
    return true;
  },
  {
    message: 'PAID evaluations must have account_size',
  }
);
```

---

## 🔄 FRESHNESS MONITORING

### Automatic Status Update (Cron)

```typescript
// Run daily via Supabase Edge Function or external cron
async function updateSourceFreshness() {
  const { error } = await supabase.rpc('refresh_source_status');
  
  if (error) {
    console.error('Failed to refresh source status:', error);
  } else {
    console.log('✅ Source status refreshed');
  }
}

// Schedule: Every day at 00:00 UTC
```

### Manual Review Trigger

```typescript
// When freshness_days > 90, trigger manual review
async function getSourcesNeedingReview() {
  const { data, error } = await supabase
    .from('sources_with_freshness')
    .select('*')
    .eq('status', 'review_needed')
    .order('freshness_days', { ascending: false });
  
  return data;
}
```

---

## 📋 DATA INGESTION CHECKLIST

### Before Inserting Data

- [ ] Validate all required fields
- [ ] Check ID format (deterministic)
- [ ] Verify FREE vs PAID coherence
- [ ] Verify geo_mode semantic
- [ ] Verify phase numbering (sequential)
- [ ] Add source for critical fields
- [ ] Calculate reputation score (if organizer)

### After Inserting Data

- [ ] Verify foreign key relationships
- [ ] Check constraints (no violations)
- [ ] Verify data appears in views
- [ ] Test UI queries
- [ ] Create snapshot (if needed)

---

## 🚀 UPSERT PATTERN (Recommended)

```typescript
// Deterministic IDs allow safe UPSERT
async function upsertOffer(offer: Offer) {
  const { data, error } = await supabase
    .from('offers')
    .upsert(offer, {
      onConflict: 'id', // Use deterministic ID
      ignoreDuplicates: false, // Update if exists
    })
    .select();
  
  if (error) {
    throw new Error(`Failed to upsert offer: ${error.message}`);
  }
  
  return data[0];
}
```

---

## ✅ VALIDATION SUMMARY

| Rule | Validation | Error Message |
|------|-----------|---------------|
| FREE entry_fee | `entry_fee === 0` | "FREE competitions cannot have entry fee" |
| PAID account_size | `account_size > 0` | "PAID evaluations must have account size" |
| Target-based profit | `profit_target_pct !== null` | "Target-based rulesets must have profit target" |
| Phase sequential | `phase_number === i + 1` | "Phase numbering must be sequential" |
| Geo semantic | `geo_mode + geo_list` | "Invalid geo restrictions" |
| ID format | `/^[a-z0-9-]+$/` | "Invalid ID format" |

---

**Status**: ✅ Rules Defined  
**Next**: Implement validation in application layer  
**Estimated Time**: 1-2 hours for validation layer

