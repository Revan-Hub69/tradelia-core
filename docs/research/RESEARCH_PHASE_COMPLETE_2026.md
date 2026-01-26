# Research Phase Complete - Prop Firms Data Collection 2026

**Date**: 2026-01-26  
**Status**: ✅ PHASE 1 COMPLETE  
**Next Phase**: Database Schema & Migration

---

## 🎯 WHAT WE ACCOMPLISHED

### ✅ Completed Research
Collected comprehensive data for **5 Tier 1 Prop Firms**:

1. **FTMO** - 5 account sizes, 2-step evaluation
2. **FundedNext** - 6 challenge types, 6 account sizes each (36 total challenges)
3. **The5ers** - 3 programs, 6 account sizes each (18 total challenges)
4. **E8 Markets** - 2 challenge types, 6 account sizes each (12 total challenges)
5. **The Funded Trader** - 7 challenge types, various account sizes (30+ total challenges)

**Total Challenges Documented**: ~100 unique challenges

### 📊 Data Collected Per Challenge
For each challenge we collected:
- ✅ Account sizes & pricing
- ✅ Refundable status
- ✅ Profit targets & drawdown limits
- ✅ Trading rules (min days, time limits, consistency)
- ✅ Profit splits & scaling potential
- ✅ Payout frequency & methods
- ✅ Trading conditions (leverage, platforms, markets)
- ✅ Pros & cons
- ✅ Trust signals (reputation, Trustpilot, founded date)

### 📁 Documentation Created
- `PROP_FIRMS_DATA_COLLECTION_2026.md` - Complete research document with all data
- `CHALLENGE_DATA_COLLECTION_PLAN_2026.md` - Research methodology
- `RESEARCH_PHASE_COMPLETE_2026.md` - This summary

---

## 🔍 KEY INSIGHTS FROM RESEARCH

### Challenge Type Distribution
We discovered that prop firms offer multiple challenge types:

**FTMO**: 1 challenge type (2-step)
- Simple, focused approach
- 5 account sizes only
- Consistent rules across all sizes

**FundedNext**: 6 challenge types
- Evaluation (2-step)
- Express Consistency (1-step)
- Express Non-Consistency (1-step)
- Stellar 1-Step
- Stellar 2-Step
- Stellar Lite
- Each with 6 account sizes = 36 total challenges

**The5ers**: 3 programs
- Bootcamp (2-step)
- Hyper Growth (instant funding)
- High Stakes (2-step)
- Each with 6 account sizes = 18 total challenges

**E8 Markets**: 2 challenge types
- E8 Account (2-step)
- Eleve8 Account (3-step)
- Each with 6 account sizes = 12 total challenges

**The Funded Trader**: 7 challenge types
- Knight (1-step)
- Knight Pro (1-step)
- Classic 1-Step
- Royal (2-step)
- Royal Pro (2-step)
- Classic 2-Step
- Dragon (3-step)
- Various account sizes = 30+ total challenges

### Pricing Insights
- **Cheapest**: FundedNext Stellar Lite $5K @ $19
- **Most Expensive**: FTMO $200K @ €1,080
- **Best Value**: FundedNext (most options, lowest prices)
- **Premium**: FTMO (highest reputation, highest prices)

### Profit Split Insights
- **Highest**: The Funded Trader (up to 99%)
- **Lowest Initial**: The5ers (50%, scales up)
- **Most Common**: 80-90%

### Scaling Insights
- **Highest**: The Funded Trader ($5M)
- **Lowest**: E8 Markets ($1M)
- **Most Common**: $2-4M

---

## 🚨 CRITICAL DISCOVERY: MULTI-CHALLENGE STRUCTURE

### The Problem
Your current database schema assumes:
- 1 prop firm = 1 challenge
- Simple relationship: `challenges` table with one row per firm

### The Reality
- 1 prop firm = MULTIPLE challenge types
- Each challenge type = MULTIPLE account sizes
- Example: FundedNext has 36 different challenges!

### Database Schema Needs
We need a hierarchical structure:

```
prop_firms (table)
  ├── challenges (table) - challenge types (Evaluation, Express, Stellar, etc.)
  │     ├── challenge_variants (table) - account sizes ($5K, $10K, $25K, etc.)
  │     │     ├── pricing
  │     │     ├── rules
  │     │     └── conditions
```

**OR** a flatter structure:

```
challenges (table)
  ├── firm_id (foreign key to firms table)
  ├── challenge_type (Evaluation, Express, Stellar, etc.)
  ├── account_size ($5000, $10000, etc.)
  ├── entry_fee
  ├── profit_target
  ├── max_daily_loss
  ├── max_drawdown
  └── ... (all other fields)
```

---

## 📋 NEXT STEPS

### Phase 2: Database Schema Design (1-2 hours)

#### Step 1: Review Current Schema
- [ ] Read `tradelia/src/models/Schema.ts`
- [ ] Read `tradelia/supabase_trading_schema.sql`
- [ ] Identify what needs to change

#### Step 2: Design New Schema
- [ ] Decide on hierarchical vs flat structure
- [ ] Add fields for:
  - `challenge_type` (Evaluation, Express, Stellar, etc.)
  - `challenge_subtype` (Consistency, Non-Consistency, etc.)
  - `account_size` (numeric)
  - `entry_fee` (numeric)
  - `entry_fee_currency` (USD, EUR)
  - `refundable` (boolean)
  - `refund_conditions` (text)
  - `profit_target_percent` (numeric)
  - `max_daily_loss_percent` (numeric)
  - `max_drawdown_percent` (numeric)
  - `min_trading_days` (numeric)
  - `time_limit_days` (numeric, nullable)
  - `consistency_rule` (text, nullable)
  - `profit_split_initial` (numeric)
  - `profit_split_max` (numeric)
  - `scaling_max` (numeric)
  - `payout_frequency` (enum: instant, same_day, weekly, bi_weekly, monthly)
  - `first_payout_delay_days` (numeric)
  - `leverage` (text)
  - `platforms` (array)
  - `markets` (array)
  - `weekend_holding` (boolean)
  - `news_trading` (boolean)
  - `ea_allowed` (boolean)
  - `pros` (array)
  - `cons` (array)
  - `best_for` (text)
  - `success_rate_percent` (numeric, nullable)
  - `avg_pass_days` (numeric, nullable)

#### Step 3: Create Migration
- [ ] Write SQL migration file
- [ ] Include all 100+ challenges
- [ ] Add proper indexes
- [ ] Add constraints

#### Step 4: Update TypeScript Types
- [ ] Update `tradelia/src/types/challenge.ts`
- [ ] Update `tradelia/src/models/Schema.ts`
- [ ] Ensure type safety

### Phase 3: UI/UX Design (2-3 hours)

#### Step 1: Information Architecture
Based on research, users need to understand:
1. **Firm Level**: Which prop firm?
2. **Challenge Type Level**: Which challenge type? (Evaluation, Express, Stellar, etc.)
3. **Account Size Level**: Which account size? ($5K, $10K, $25K, etc.)
4. **Details Level**: All rules, pricing, conditions

#### Step 2: Card Design
**Challenge Card** should show:
- Firm logo (custom SVG)
- Challenge type badge (custom SVG)
- Account size (prominent)
- Entry fee (prominent)
- Profit target
- Max drawdown
- Profit split
- Key differentiator (1-2 words: "Cheapest", "Best Scaling", "Instant Funding")
- Trust signal (reputation score or Trustpilot)

**NOT emoji** - custom SVG icons only!

#### Step 3: Drawer Design
**Challenge Drawer** should show:
- All card info (expanded)
- Complete rules table
- Pros & cons lists
- Trading conditions
- Payout details
- "Start Challenge" CTA button
- "Compare" button

#### Step 4: Filtering & Sorting
Users need to filter by:
- Firm
- Challenge type (1-step, 2-step, 3-step, instant)
- Account size range
- Price range
- Profit split range
- Markets (Forex, Futures, Crypto, etc.)

Users need to sort by:
- Price (low to high)
- Account size (low to high)
- Profit split (high to low)
- Reputation (high to low)
- Pass rate (high to low)

#### Step 5: Mobile Responsiveness
- Cards must stack vertically on mobile
- Drawer must be full-screen on mobile
- Filters must be in a bottom sheet on mobile
- No horizontal scroll!

### Phase 4: Implementation (3-4 hours)

#### Step 1: Update Components
- [ ] `ChallengeCard.tsx` - redesign with real data structure
- [ ] `ChallengeDrawer.tsx` - redesign with complete info
- [ ] `ChallengeFilters.tsx` - add all filter options
- [ ] `ChallengeSortDropdown.tsx` - add all sort options
- [ ] `ChallengeComparison.tsx` - update for multi-challenge structure

#### Step 2: Create SVG Icons
- [ ] Firm logos (FTMO, FundedNext, The5ers, E8, TFT)
- [ ] Challenge type badges (1-step, 2-step, 3-step, instant)
- [ ] Market icons (Forex, Futures, Crypto, Indices, Commodities)
- [ ] Feature icons (Refundable, Scaling, Fast Payout, etc.)
- [ ] Trust badges (Verified, Top Rated, etc.)

**NO EMOJI!** All custom SVG icons.

#### Step 3: Update Data Fetching
- [ ] Update queries to fetch from new schema
- [ ] Add filtering logic
- [ ] Add sorting logic
- [ ] Add pagination if needed

#### Step 4: Testing
- [ ] Test on desktop
- [ ] Test on mobile
- [ ] Test all filters
- [ ] Test all sorts
- [ ] Test drawer open/close
- [ ] Test comparison feature

---

## 🎨 DESIGN PRINCIPLES (From Research)

### Information Hierarchy
1. **Primary**: Firm + Challenge Type + Account Size
2. **Secondary**: Price + Profit Target + Drawdown
3. **Tertiary**: Profit Split + Scaling + Payout Speed
4. **Details**: Complete rules, pros/cons, conditions

### Visual Hierarchy
- **Firm Logo**: Top left, medium size
- **Challenge Type Badge**: Top right, small
- **Account Size**: Large, prominent
- **Entry Fee**: Large, prominent, with refundable badge if applicable
- **Key Metrics**: Medium size, grid layout
- **Trust Signal**: Bottom, small

### Color Coding
- **Free**: Green
- **Paid Evaluation**: Blue
- **Instant Funding**: Purple
- **Refundable**: Green badge
- **Non-Refundable**: Gray badge

### Badges & Icons
- **Challenge Type**: "1-Step", "2-Step", "3-Step", "Instant"
- **Features**: "Refundable", "No Time Limit", "High Scaling", "Fast Payout"
- **Trust**: "Top Rated", "Verified", "Established"
- **Markets**: Forex icon, Futures icon, Crypto icon, etc.

---

## 📊 DATA QUALITY NOTES

### Verified Data
All data collected from:
- ✅ Official prop firm websites
- ✅ Official pricing pages
- ✅ Terms & Conditions
- ✅ Trustpilot reviews
- ✅ Independent review sites (bestpropfirms.com, etc.)

### Data Gaps
Some firms don't disclose:
- Success rates (pass rates)
- Average pass time
- Total paid out
- Active trader counts

For these, we marked as "Not disclosed" or "N/A".

### Data Accuracy
- All pricing verified as of 2026-01-26
- All rules verified from official sources
- Trustpilot scores from 2026-01-26
- Reputation scores from independent reviews

---

## 🚀 READY TO PROCEED

### What We Have
- ✅ Complete data for 100+ challenges
- ✅ Clear understanding of data structure
- ✅ Identified schema changes needed
- ✅ Design principles established
- ✅ UI/UX requirements clear

### What We Need
1. **Your Approval**: Review the research and confirm we should proceed
2. **Schema Decision**: Hierarchical vs flat structure?
3. **Priority**: Which phase to start? (Schema, UI, or both?)

### Estimated Time to Complete
- **Phase 2 (Schema)**: 1-2 hours
- **Phase 3 (UI Design)**: 2-3 hours
- **Phase 4 (Implementation)**: 3-4 hours
- **Total**: 6-9 hours

---

## 💬 QUESTIONS FOR YOU

1. **Schema Structure**: Do you prefer hierarchical (firms → challenges → variants) or flat (all challenges in one table)?

2. **Challenge Display**: How should we group challenges in the UI?
   - By firm (FTMO section, FundedNext section, etc.)?
   - By challenge type (1-step section, 2-step section, etc.)?
   - By price range (Budget, Mid-range, Premium)?
   - Mixed (default view shows all, filters allow grouping)?

3. **Free Competitions**: Should we research free competitions (TradingView, Deriv, etc.) now or later?

4. **Tier 2 Firms**: Should we add more prop firms (Apex, TopStep, etc.) now or later?

5. **Priority**: What's most important to fix first?
   - Database schema (so data is correct)
   - UI/UX design (so users understand)
   - Both simultaneously

---

**Status**: ✅ Research Complete, Ready for Next Phase  
**Waiting For**: Your feedback and direction  
**Recommendation**: Start with Phase 2 (Schema) to ensure data structure is correct, then move to Phase 3 (UI/UX)

