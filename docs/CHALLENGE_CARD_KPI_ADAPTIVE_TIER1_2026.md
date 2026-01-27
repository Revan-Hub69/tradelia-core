# Challenge Card - KPI Adattivi per 3 Categorie (Tier-1 Analysis)

**Data**: 2026-01-27  
**Status**: 🔴 ANALISI CRITICA - KPI NON ADATTIVI  
**Problema**: Card mostra sempre "Account Size" ma serve adattarsi alle 3 categorie

---

## 🚨 PROBLEMA IDENTIFICATO

### Current Implementation (WRONG)
```tsx
// ❌ SEMPRE gli stessi 3 KPI
<div>Account Size: $10,000</div>
<div>Profit Split: 80%</div>
<div>Entry Fee: €155</div>
```

**Problema**:
- ✅ OK per **Paid Evaluations** (prop firms)
- ❌ WRONG per **Free Competitions** (no account size, serve prize pool)
- ❌ WRONG per **Tournaments** (no account size, serve ranking info)

---

## 📊 3 CATEGORIE - KPI DECISION-CRITICAL

### 1. FREE COMPETITIONS (Gratuite)
**Esempi**: TradingView The Leap, Deriv Tournaments, Gate.io Demo

**Decision-Critical KPI**:
1. **Prize Pool** (non Account Size!) - "What can I win?"
2. **Entry Fee** - "FREE" (sempre)
3. **Participants** - "vs 2,341 traders" (competition intensity)

**Secondary Info** (Quick Facts):
- Start Date / End Date
- Registration Deadline
- Max Participants (if limited)
- Status: "Always Open" | "Closing Soon" | "Starts Feb 1"

**Card Layout**:
```
┌─────────────────────────────────┐
│ [FREE] [⭐ 4.8] [🔥 Popular]    │
│ [🟢 Always Open]                │
│                                 │
│ TradingView The Leap            │
│ TradingView                     │
│                                 │
│ ┌─────────┐ ┌─────────┐        │
│ │ $50,000 │ │  FREE   │        │
│ │  Prize  │ │  Entry  │        │
│ └─────────┘ └─────────┘        │
│                                 │
│ ┌─────────┐                    │
│ │vs 2,341 │                    │
│ │ Traders │                    │
│ └─────────┘                    │
│                                 │
│ ✓ Paper Trading  ✓ 30 days    │
│                                 │
│ [☐ Compare]  [Details →]       │
└─────────────────────────────────┘
```

---

### 2. PAID EVALUATIONS (Challenge Prop Firm)
**Esempi**: FTMO, FundedNext, The5ers

**Decision-Critical KPI**:
1. **Account Size** - "How much capital?"
2. **Profit Split** - "What's my cut?"
3. **Entry Fee** - "What's the cost?"

**Secondary Info** (Quick Facts):
- Max Daily Loss
- Max Drawdown
- Time Limit (or "∞")
- Platforms

**Card Layout** (CURRENT - OK ✅):
```
┌─────────────────────────────────┐
│ [PAID] [⭐ 4.8] [🔥 68%]        │
│ [🟢 Always Open]                │
│                                 │
│ FTMO Challenge                  │
│ FTMO Trading                    │
│                                 │
│ ┌─────────┐ ┌─────────┐        │
│ │ $10,000 │ │   80%   │        │
│ │ Account │ │  Split  │        │
│ └─────────┘ └─────────┘        │
│                                 │
│ ┌─────────┐                    │
│ │  €155   │                    │
│ │  Cost   │                    │
│ └─────────┘                    │
│                                 │
│ ✓ 5% Daily  ✓ 10% DD  ✓ MT4   │
│                                 │
│ [☐ Compare]  [Details →]       │
└─────────────────────────────────┘
```

---

### 3. TOURNAMENTS (Ranking-Based)
**Esempi**: Binance Futures Demo, Gate.io Trading Competition

**Decision-Critical KPI**:
1. **Prize Pool** - "Total prizes available"
2. **Top Prize** - "1st place wins $10,000"
3. **Entry Fee** - Usually "FREE" or small fee

**Secondary Info** (Quick Facts):
- Ranking System (PnL, ROI, Volume)
- Duration
- Max Participants
- Status: "Live" | "Upcoming" | "Ended"

**Card Layout**:
```
┌─────────────────────────────────┐
│ [TOURNAMENT] [⭐ 4.8] [🔥 Live] │
│ [🔴 Ends in 5 days]             │
│                                 │
│ Binance Futures Demo            │
│ Binance                         │
│                                 │
│ ┌─────────┐ ┌─────────┐        │
│ │$100,000 │ │ $10,000 │        │
│ │  Pool   │ │ 1st Prize│       │
│ └─────────┘ └─────────┘        │
│                                 │
│ ┌─────────┐                    │
│ │  FREE   │                    │
│ │  Entry  │                    │
│ └─────────┘                    │
│                                 │
│ ✓ ROI Ranking  ✓ 30 days      │
│                                 │
│ [☐ Compare]  [Details →]       │
└─────────────────────────────────┘
```

---

## 🎯 AVAILABILITY STATUS BADGE (CRITICAL!)

### Research: Nielsen Norman Group - Status Indicators
**Source**: [Status Indicators UX](https://www.nngroup.com/articles/indicators-validations-notifications/)

**Best Practices**:
1. **Color-coded** - Green (active), Yellow (closing soon), Red (ended)
2. **Action-oriented** - "Always Open" vs "Closes Feb 1"
3. **Urgency signals** - "5 spots left", "Ends in 3 days"

### Status Types

#### For FREE COMPETITIONS & TOURNAMENTS
```tsx
// Always Open (recurring)
<Badge color="green">🟢 Always Open</Badge>

// Upcoming
<Badge color="blue">🔵 Starts Feb 1</Badge>

// Live (active)
<Badge color="green">🟢 Live - 5 days left</Badge>

// Closing Soon
<Badge color="yellow">🟡 Closing Soon - 2 days</Badge>

// Registration Deadline
<Badge color="orange">🟠 Register by Jan 31</Badge>

// Ended
<Badge color="gray">⚫ Ended</Badge>

// Limited Spots
<Badge color="red">🔴 5 spots left</Badge>
```

#### For PAID EVALUATIONS
```tsx
// Always Open (most common)
<Badge color="green">🟢 Always Open</Badge>

// Temporarily Paused
<Badge color="yellow">🟡 Temporarily Unavailable</Badge>

// Coming Soon
<Badge color="blue">🔵 Coming Soon</Badge>
```

---

## 🔄 ADAPTIVE KPI LOGIC

### TypeScript Implementation

```tsx
type Category = 'free_competition' | 'paid_evaluation' | 'ranking_based';

type AdaptiveKPI = {
  label: string;
  value: string | number;
  color?: string;
  icon?: React.ReactNode;
};

function getAdaptiveKPIs(
  category: Category,
  offer: Offer,
  kpis: KPIs
): [AdaptiveKPI, AdaptiveKPI, AdaptiveKPI] {
  
  switch (category) {
    case 'free_competition':
      return [
        {
          label: 'Prize Pool',
          value: offer.prize_pool 
            ? `$${offer.prize_pool.toLocaleString()}` 
            : 'TBD',
          color: 'text-green-600',
        },
        {
          label: 'Entry Fee',
          value: 'FREE',
          color: 'text-green-600',
        },
        {
          label: 'Participants',
          value: `vs ${offer.max_participants?.toLocaleString() || '∞'}`,
          color: 'text-blue-600',
        },
      ];
      
    case 'ranking_based':
      return [
        {
          label: 'Prize Pool',
          value: offer.prize_pool 
            ? `$${offer.prize_pool.toLocaleString()}` 
            : 'TBD',
          color: 'text-purple-600',
        },
        {
          label: '1st Prize',
          value: offer.first_prize 
            ? `$${offer.first_prize.toLocaleString()}` 
            : 'TBD',
          color: 'text-amber-600',
        },
        {
          label: 'Entry Fee',
          value: offer.entry_fee 
            ? `$${offer.entry_fee}` 
            : 'FREE',
          color: offer.entry_fee ? 'text-blue-600' : 'text-green-600',
        },
      ];
      
    case 'paid_evaluation':
    default:
      return [
        {
          label: 'Account Size',
          value: `${offer.account_currency}${
            offer.account_size >= 1000
              ? `${offer.account_size / 1000}K`
              : offer.account_size
          }`,
        },
        {
          label: 'Profit Split',
          value: `${kpis.profit_split_max}%`,
          color: 'text-green-600',
        },
        {
          label: 'Entry Fee',
          value: offer.entry_fee 
            ? `${offer.fee_currency}${offer.entry_fee}` 
            : 'FREE',
          color: offer.entry_fee ? 'text-blue-600' : 'text-green-600',
        },
      ];
  }
}
```

### Availability Status Logic

```tsx
type AvailabilityStatus = {
  label: string;
  color: 'green' | 'blue' | 'yellow' | 'orange' | 'red' | 'gray';
  icon: string;
  urgency: 'low' | 'medium' | 'high';
};

function getAvailabilityStatus(offer: Offer): AvailabilityStatus | null {
  const now = new Date();
  
  // Always Open (recurring, no dates)
  if (offer.frequency === 'always_open') {
    return {
      label: 'Always Open',
      color: 'green',
      icon: '🟢',
      urgency: 'low',
    };
  }
  
  // Ended
  if (offer.end_date && new Date(offer.end_date) < now) {
    return {
      label: 'Ended',
      color: 'gray',
      icon: '⚫',
      urgency: 'low',
    };
  }
  
  // Upcoming
  if (offer.start_date && new Date(offer.start_date) > now) {
    const startDate = new Date(offer.start_date);
    const daysUntil = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      label: `Starts ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      color: 'blue',
      icon: '🔵',
      urgency: 'low',
    };
  }
  
  // Live (active)
  if (offer.start_date && offer.end_date) {
    const endDate = new Date(offer.end_date);
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Closing Soon (< 7 days)
    if (daysLeft <= 7) {
      return {
        label: `Ends in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
        color: daysLeft <= 3 ? 'red' : 'yellow',
        icon: daysLeft <= 3 ? '🔴' : '🟡',
        urgency: daysLeft <= 3 ? 'high' : 'medium',
      };
    }
    
    // Live
    return {
      label: `Live - ${daysLeft} days left`,
      color: 'green',
      icon: '🟢',
      urgency: 'low',
    };
  }
  
  // Registration Deadline
  if (offer.registration_deadline) {
    const deadline = new Date(offer.registration_deadline);
    const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil <= 7 && daysUntil > 0) {
      return {
        label: `Register by ${deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        color: 'orange',
        icon: '🟠',
        urgency: 'medium',
      };
    }
  }
  
  // Limited Spots
  if (offer.max_participants && offer.current_participants) {
    const spotsLeft = offer.max_participants - offer.current_participants;
    
    if (spotsLeft <= 10 && spotsLeft > 0) {
      return {
        label: `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`,
        color: 'red',
        icon: '🔴',
        urgency: 'high',
      };
    }
  }
  
  return null;
}
```

---

## 📋 DATABASE SCHEMA UPDATES NEEDED

### Add to `offers` table:
```sql
ALTER TABLE offers ADD COLUMN IF NOT EXISTS prize_pool NUMERIC;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS first_prize NUMERIC;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS current_participants INT DEFAULT 0;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS ranking_system TEXT; -- 'pnl' | 'roi' | 'volume' | 'points'
```

### Add to `programs` table:
```sql
ALTER TABLE programs ADD COLUMN IF NOT EXISTS ruleset_mode TEXT; -- 'target_based' | 'ranking_based'
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Adaptive KPI Logic (2 ore)
- [ ] Creare `getAdaptiveKPIs()` function
- [ ] Aggiornare `ProgramCard.tsx` per usare adaptive KPIs
- [ ] Testare con 3 categorie diverse
- [ ] Aggiornare traduzioni (prize pool, participants, etc.)

### Phase 2: Availability Status (1 ora)
- [ ] Creare `getAvailabilityStatus()` function
- [ ] Creare `AvailabilityBadge` component
- [ ] Integrare in `ProgramCard.tsx`
- [ ] Testare con date diverse

### Phase 3: Database Updates (30 min)
- [ ] Aggiungere campi mancanti a `offers`
- [ ] Aggiungere `ruleset_mode` a `programs`
- [ ] Migrare dati esistenti

### Phase 4: UI Polish (1 ora)
- [ ] Color-code per urgency
- [ ] Animazioni per "Closing Soon"
- [ ] Responsive design
- [ ] Accessibility (ARIA labels)

---

## 🎨 DESIGN TOKENS

### Colors for Availability
```css
/* Green - Active/Open */
--status-active: hsl(142, 76%, 36%);
--status-active-bg: hsl(142, 76%, 96%);

/* Blue - Upcoming */
--status-upcoming: hsl(217, 91%, 60%);
--status-upcoming-bg: hsl(217, 91%, 96%);

/* Yellow - Closing Soon */
--status-warning: hsl(45, 93%, 47%);
--status-warning-bg: hsl(45, 93%, 96%);

/* Orange - Registration Deadline */
--status-urgent: hsl(25, 95%, 53%);
--status-urgent-bg: hsl(25, 95%, 96%);

/* Red - Critical (spots left, ending) */
--status-critical: hsl(0, 84%, 60%);
--status-critical-bg: hsl(0, 84%, 96%);

/* Gray - Ended */
--status-ended: hsl(0, 0%, 60%);
--status-ended-bg: hsl(0, 0%, 96%);
```

---

## 📊 EXAMPLES

### Example 1: Free Competition (TradingView)
```tsx
{
  category: 'free_competition',
  name: 'The Leap',
  organizer: 'TradingView',
  prize_pool: 50000,
  entry_fee: null,
  max_participants: null, // unlimited
  frequency: 'always_open',
  
  // Adaptive KPIs:
  // 1. Prize Pool: $50,000
  // 2. Entry Fee: FREE
  // 3. Participants: vs ∞
  
  // Status: 🟢 Always Open
}
```

### Example 2: Tournament (Binance)
```tsx
{
  category: 'ranking_based',
  name: 'Binance Futures Demo',
  organizer: 'Binance',
  prize_pool: 100000,
  first_prize: 10000,
  entry_fee: null,
  max_participants: 10000,
  current_participants: 8543,
  start_date: '2026-01-20',
  end_date: '2026-02-20',
  
  // Adaptive KPIs:
  // 1. Prize Pool: $100,000
  // 2. 1st Prize: $10,000
  // 3. Entry Fee: FREE
  
  // Status: 🟢 Live - 24 days left
}
```

### Example 3: Paid Evaluation (FTMO)
```tsx
{
  category: 'paid_evaluation',
  name: 'FTMO Challenge',
  organizer: 'FTMO',
  account_size: 10000,
  entry_fee: 155,
  profit_split_max: 80,
  frequency: 'always_open',
  
  // Adaptive KPIs:
  // 1. Account Size: $10K
  // 2. Profit Split: 80%
  // 3. Entry Fee: €155
  
  // Status: 🟢 Always Open
}
```

---

## 🚀 NEXT STEPS

1. **Implement Adaptive KPI Logic** (Priority: P0)
2. **Implement Availability Status** (Priority: P0)
3. **Update Database Schema** (Priority: P1)
4. **Update Translations** (Priority: P1)
5. **Quality Audit** (Priority: P1)

---

**Status**: 🔴 NEEDS IMPLEMENTATION  
**Estimated Time**: 4-5 hours  
**Priority**: P0 - CRITICAL

