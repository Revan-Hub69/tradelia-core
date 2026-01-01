# Setup Engine v2 - Quick Start Guide

**Status**: ✅ SPECIFICATION COMPLETE  
**Ready**: YES - Ready for implementation  
**Timeline**: 12 days for complete implementation

## 📍 Where We Are

### Before (Incomplete System)
```
MCE ✅ → regime_signatures
UCM ✅ → universe_active  
MSF ✅ → msf_day_gates + msf_market_fits

Setup Engine ✅ → structure + liquidity + orderflow analysis

BUT: ❌ No capital management
     ❌ No L2 imbalance triggers
     ❌ No actual setup generation
```

### After (Complete System)
```
MCE ✅ → regime_signatures
UCM ✅ → universe_active
MSF ✅ → msf_day_gates + msf_market_fits

Setup Engine ✅ → structure + liquidity + orderflow analysis

NEW: Funding Manager ✅ → capital tracking + position sizing
NEW: L2 Imbalance Detector ✅ → order book analysis
NEW: Setup Trigger Engine ✅ → funding + L2 → setups

Paper Execution ✅ → execute + track P&L
```

## 🎯 The Three Components

### 1️⃣ Funding Manager
**What**: Tracks capital, manages positions, calculates available funds  
**Why**: Can't trade without knowing how much capital you have  
**Files**: `lib/setup/funding-manager.ts`  
**Timeline**: Days 1-2

```typescript
// Initialize with $10,000
fundingManager.initialize(10000);

// Track positions
fundingManager.allocateCapital(3500, 'position-1');

// Get available capital
const available = fundingManager.getAvailableCapital(); // $6,500

// Record trades
fundingManager.recordTrade({
  tradeId: 'trade-1',
  pnl: 300,
  outcome: 'WIN'
});
```

### 2️⃣ L2 Imbalance Detector
**What**: Analyzes order book for imbalances that signal opportunities  
**Why**: Imbalances show where smart money is positioning  
**Files**: `lib/setup/l2-imbalance-detector.ts`  
**Timeline**: Days 3-4

```typescript
// Fetch L2 book
const book = await detector.fetchL2Book('BTCUSDT', 20);

// Calculate imbalance
const imbalance = detector.calculateImbalance(book);
// {
//   topOfBookImbalance: 0.5,      // 50% more bids than asks
//   direction: 'BULLISH',
//   strength: 0.78,
//   persistenceDuration: 2.3      // seconds
// }

// Check if significant
if (detector.isSignificant(imbalance, config)) {
  // This is a trading opportunity!
}
```

### 3️⃣ Setup Trigger Engine
**What**: Combines funding + L2 imbalance to generate setups  
**Why**: This is where trading signals are actually created  
**Files**: `lib/setup/setup-trigger-engine.ts`  
**Timeline**: Days 5-6

```typescript
// Check for trigger
const setup = triggerEngine.checkTrigger(
  'BTCUSDT',
  imbalance,
  fundingState,
  config
);

// Returns:
// {
//   setupId: 'setup-123',
//   direction: 'LONG',
//   entry: 87900,
//   stop: 87500,
//   target: 88500,
//   positionSize: 1300,
//   confidence: 0.78,
//   capitalRequired: 114370000,
//   capitalAvailable: 6500000
// }
```

## 🔄 Complete Flow

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. Funding Manager                                         │
│     $10,000 starting capital                                │
│     -$3,500 in open positions                               │
│     = $6,500 available                                      │
│                                                             │
│  2. L2 Imbalance Detector                                   │
│     BTCUSDT: 1.5x imbalance (BULLISH)                       │
│     Strength: 0.78                                          │
│     Persistence: 2.3 seconds                                │
│                                                             │
│  3. Setup Trigger Engine                                    │
│     ✓ Imbalance significant                                 │
│     ✓ Capital available                                     │
│     ✓ Capital utilization OK                                │
│     → Generate setup                                        │
│                                                             │
│  4. Setup Validator (existing)                              │
│     ✓ R:R ratio OK                                          │
│     ✓ Execution feasible                                    │
│     ✓ No portfolio conflicts                                │
│                                                             │
│  5. Paper Execution (existing)                              │
│     Entry: $87,900                                          │
│     Exit: $88,200                                           │
│     P&L: +$300 (+23% ROI)                                   │
│                                                             │
│  6. Update Funding                                          │
│     Release $1,300 capital                                  │
│     New available: $7,800                                   │
│     Ready for next setup                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📊 What Gets Built

### Phase 1: Funding Manager (Days 1-2)
- [ ] Core implementation
- [ ] Property tests (allocation correctness)
- [ ] API endpoints
- [ ] Unit tests
- [ ] Checkpoint

### Phase 2: L2 Imbalance Detector (Days 3-4)
- [ ] Core implementation
- [ ] Property tests (bounds checking)
- [ ] API endpoints
- [ ] Unit tests
- [ ] Checkpoint

### Phase 3: Setup Trigger Engine (Days 5-6)
- [ ] Core implementation
- [ ] Property tests (consistency + capital constraints)
- [ ] API endpoints
- [ ] Unit tests
- [ ] Checkpoint

### Phase 4: Integration (Days 7-8)
- [ ] Integrate with Paper Execution
- [ ] End-to-end tests
- [ ] Dashboard components
- [ ] Checkpoint

### Phase 5: Performance & Hardening (Days 9-10)
- [ ] Performance optimization
- [ ] Circuit breakers
- [ ] Monitoring
- [ ] Stress tests
- [ ] Checkpoint

### Phase 6: Production Deployment (Days 11-12)
- [ ] Deployment guide
- [ ] Staging deployment
- [ ] Production deployment
- [ ] Final verification

## ✅ Success Criteria

| Component | Metric | Target |
|-----------|--------|--------|
| Funding Manager | Over-allocation | 0% |
| Funding Manager | P&L accuracy | ±0.01% |
| L2 Detector | Detection latency | <100ms |
| L2 Detector | Direction accuracy | >85% |
| Trigger Engine | Trigger latency | <50ms |
| Trigger Engine | Capital enforcement | 100% |
| End-to-End | Flow latency | <200ms |
| End-to-End | Setup generation | 100+ per day |

## 📁 Key Files

**Design Document** (1000+ lines)
- `.kiro/specs/setup-engine-intraday/design-v2-with-funding.md`
- Complete architecture, algorithms, interfaces

**Tasks Document** (300+ lines)
- `.kiro/specs/setup-engine-intraday/tasks-v2-with-funding.md`
- 30+ implementation tasks across 6 phases

**Summary Document** (400+ lines)
- `docs/setup-engine-v2-funding-integration-complete.md`
- Executive overview and key decisions

**This Quick Start** (this file)
- `docs/SETUP-ENGINE-V2-QUICK-START.md`
- Quick reference guide

## 🚀 How to Start

### Step 1: Review (Today)
```bash
# Read the design
cat .kiro/specs/setup-engine-intraday/design-v2-with-funding.md

# Read the tasks
cat .kiro/specs/setup-engine-intraday/tasks-v2-with-funding.md

# Read the summary
cat docs/setup-engine-v2-funding-integration-complete.md
```

### Step 2: Decide (Today)
Answer these key questions:
1. L2 imbalance threshold: 1.3x, 1.5x, or 2.0x?
2. Funding allocation: 10%, 20%, or 50% per setup?
3. Minimum persistence: 1s, 2s, or 5s?
4. Support leverage: 1x, 2x, or 5x?

### Step 3: Implement (Days 1-12)
Start with Phase 1 (Funding Manager):
```bash
# Create the file
touch lib/setup/funding-manager.ts

# Implement the class
# (See design document for full interface)

# Write tests
# (See tasks document for test requirements)

# Create API endpoints
# (See design document for endpoint specs)
```

## 💡 Key Insights

### Why These Three Components?

1. **Funding Manager** - Without it, you can't enforce risk management
2. **L2 Imbalance Detector** - Without it, you can't identify opportunities
3. **Setup Trigger Engine** - Without it, you can't generate actual signals

Together, they complete the system:
- MCE gives you market regime
- UCM gives you symbol selection
- MSF gives you market classification
- **Funding Manager gives you capital management** ← NEW
- **L2 Imbalance Detector gives you opportunity detection** ← NEW
- **Setup Trigger Engine gives you signal generation** ← NEW
- Paper Execution gives you validation

### Why Property-Based Testing?

Each component has correctness properties that must hold:
- Funding allocation must never exceed available capital
- L2 imbalance ratios must be bounded [-1.0, 1.0]
- Setup triggers must be deterministic
- Capital constraints must be enforced 100%

Property-based tests verify these properties across thousands of random inputs.

### Why 12 Days?

- Phase 1 (Funding): 2 days - Foundation
- Phase 2 (L2): 2 days - Data analysis
- Phase 3 (Trigger): 2 days - Signal generation
- Phase 4 (Integration): 2 days - Wiring together
- Phase 5 (Hardening): 2 days - Production ready
- Phase 6 (Deploy): 2 days - Live system

Each phase builds on the previous one, with checkpoints to validate progress.

## 🎓 What You'll Have After

A **complete, operational trading system** that:

✅ Analyzes real-time market data  
✅ Selects optimal symbols  
✅ Classifies market conditions  
✅ **Manages trading capital**  
✅ **Detects L2 imbalances**  
✅ **Generates trading setups**  
✅ Validates setup quality  
✅ Executes paper trades  
✅ Tracks performance  

## 🔗 Related Documents

- **Full Design**: `.kiro/specs/setup-engine-intraday/design-v2-with-funding.md`
- **Full Tasks**: `.kiro/specs/setup-engine-intraday/tasks-v2-with-funding.md`
- **Full Summary**: `docs/setup-engine-v2-funding-integration-complete.md`
- **Gap Analysis**: `docs/setup-engine-funding-gap-analysis.md`

## ❓ Questions?

See the "Key Decisions Needed" section in the full summary document for:
- L2 imbalance thresholds
- Funding allocation strategy
- Setup confidence weighting
- Paper execution simulation

---

**Ready to build the three missing components?**

Start with Phase 1: Funding Manager (Days 1-2)
