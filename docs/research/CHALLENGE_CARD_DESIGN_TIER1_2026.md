# Challenge Card & Drawer Design - Tier 1 Research 2026

**Date**: 2026-01-26  
**Research Focus**: Card UI best practices + Prop Firm challenge presentation  
**Sources**: Eleken, UXPin, FTMO, FundedNext, Material Design, Nielsen Norman Group

---

## 🎯 EXECUTIVE SUMMARY

After analyzing tier-1 sources and top prop firms, the current implementation needs significant improvements:

### ❌ Current Problems
1. **Too much information on cards** - Overwhelming, hard to scan
2. **Metrics not prioritized** - All data looks equally important
3. **No clear decision-making hierarchy** - Users can't quickly compare
4. **Drawer tabs feel forced** - Information architecture unclear
5. **Missing trust signals** - No social proof, ratings, or verification

### ✅ What We Should Do
1. **Simplify cards** - Show only decision-critical info
2. **Clear visual hierarchy** - Emphasize what matters most
3. **Progressive disclosure** - Details in drawer, not on card
4. **Trust signals** - Add ratings, success rate, trader count
5. **Better comparison** - Side-by-side key metrics

---

## 📊 CARD UI BEST PRACTICES (Tier 1 Sources)

### 1. **One Card = One Idea** (Nielsen Norman Group)
> "A card contains content and actions united by a single subject"

**Application for us**:
- Each card = ONE challenge opportunity
- Don't mix multiple concepts (free vs paid, different firms)
- Focus on the decision: "Should I try this challenge?"

### 2. **Visual Hierarchy is Critical** (Eleken, UXPin)
> "Good organization is key to an effective card design. Prioritize important information with headings, icons, and typography variations"

**Current Problem**: All metrics look equally important  
**Fix Needed**:
```
PRIORITY 1 (Largest, most prominent):
- Challenge type (FREE vs PAID)
- Entry fee / Prize pool
- Account size

PRIORITY 2 (Medium emphasis):
- Profit split
- Payout speed
- Success rate

PRIORITY 3 (Smallest, supporting):
- Markets
- Platforms
- Firm name
```

### 3. **Scannable Content** (Material Design)
> "Cards present information in a clear and accessible way, making it easier for users to browse content"

**Current Problem**: Too much text, hard to scan  
**Fix Needed**:
- Use icons + numbers (not just text)
- Color coding for quick recognition
- White space between elements
- Maximum 4-6 data points per card

### 4. **Clear Entry Points** (Eleken)
> "Cards often serve as entry points to a new page, guiding users through the content journey"

**Current Problem**: Two buttons compete for attention  
**Fix Needed**:
- ONE primary action: "View Details"
- Secondary action: Checkbox for comparison (subtle)
- Remove "Compare" button from card

### 5. **Consistent Padding & Spacing** (UXDWorld)
> "Maintain even padding inside the card. Avoid overcrowding and add enough space between edges and content"

**Current Implementation**: ✅ Good (p-6, gap-3)  
**Keep**: Current spacing is correct

---

## 🏆 PROP FIRM CHALLENGE PRESENTATION ANALYSIS

### What Traders Actually Need to Decide

Based on FTMO, FundedNext, The Funded Trader analysis:

#### **Decision-Critical Information** (Must be on card):
1. **Cost** - Entry fee (or FREE)
2. **Potential** - Account size
3. **Reward** - Profit split %
4. **Risk** - Max drawdown, daily loss
5. **Time** - Challenge duration
6. **Trust** - Success rate, firm reputation

#### **Supporting Information** (Can be in drawer):
- Detailed rules (profit target, min trading days)
- Platforms available
- Markets available
- Scaling potential
- Refund policy
- Payout schedule details
- Pros & cons

### Comparison Table Analysis

Top prop firm comparison sites show these columns:
1. Firm name + logo
2. Account size
3. Entry fee
4. Profit split
5. Max drawdown
6. Payout speed
7. Rating/Score

**Our current comparison**: ❌ Shows too much detail  
**Should show**: Only these 7 columns

---

## 🎨 RECOMMENDED CARD REDESIGN

### Card Structure (Simplified)

```
┌─────────────────────────────────────┐
│ [BADGE: FREE/PAID] [⭐ 4.8] [🔥 HOT]│
│                                     │
│ Challenge Name                      │
│ Firm Name                           │
│                                     │
│ ┌─────────┐ ┌─────────┐           │
│ │ $10,000 │ │   80%   │           │
│ │ Account │ │  Split  │           │
│ └─────────┘ └─────────┘           │
│                                     │
│ ┌─────────┐ ┌─────────┐           │
│ │  $155   │ │ 24-48h  │           │
│ │  Cost   │ │ Payout  │           │
│ └─────────┘ └─────────┘           │
│                                     │
│ ✓ 5% Daily Loss  ✓ 10% Max DD     │
│                                     │
│ [☐ Compare]    [View Details →]   │
└─────────────────────────────────────┘
```

### Key Changes:

1. **Top Section**:
   - Badges: Type + Rating + Status (Popular/New)
   - Title + Firm name (smaller)

2. **Metrics Grid** (2x2):
   - Account Size (largest number)
   - Profit Split (percentage)
   - Entry Fee (or FREE)
   - Payout Speed

3. **Risk Summary** (One line):
   - Daily loss limit
   - Max drawdown
   - (Most critical risk metrics)

4. **Actions**:
   - Checkbox: "Compare" (subtle, left)
   - Button: "View Details" (primary, right)

---

## 📱 DRAWER REDESIGN

### Current Problems:
1. **3 tabs feel arbitrary** - Why Overview/Rules/Pricing?
2. **Information scattered** - Hard to find what you need
3. **No clear flow** - Doesn't guide decision-making

### Recommended Structure:

#### **Single Scrollable View** (No tabs)

```
┌─────────────────────────────────────┐
│ [X]                                 │
│                                     │
│ Challenge Name                      │
│ Firm Name ⭐ 4.8 (2,341 traders)   │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ 📊 KEY METRICS                      │
│ ┌─────────┐ ┌─────────┐ ┌────────┐│
│ │ $10,000 │ │   80%   │ │ $155   ││
│ │ Account │ │  Split  │ │  Fee   ││
│ └─────────┘ └─────────┘ └────────┘│
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ ⚠️ RISK RULES                       │
│ • Max Daily Loss: 5%                │
│ • Max Drawdown: 10%                 │
│ • Profit Target: 10%                │
│ • Min Trading Days: 4               │
│ • Time Limit: 30 days               │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ 💰 PAYOUT DETAILS                   │
│ • Speed: 24-48 hours                │
│ • First Payout: 14 days             │
│ • Method: Bank, Crypto, PayPal      │
│ • Minimum: $50                      │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ 📈 SCALING & GROWTH                 │
│ • Max Account: $200,000             │
│ • Profit Split: 80% → 90%           │
│ • Scaling: Every $10k profit        │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ 🎯 BEST FOR                         │
│ "Experienced traders who can        │
│  handle strict daily loss limits"   │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ ✅ PROS                             │
│ • Fast payouts                      │
│ • High profit split                 │
│ • Refundable fee                    │
│                                     │
│ ⚠️ CONS                             │
│ • Strict daily loss                 │
│ • High entry fee                    │
│ • Limited markets                   │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ 🏢 ABOUT FIRM                       │
│ Founded: 2015                       │
│ Traders: 2,341 active               │
│ Total Paid: $45M                    │
│ Reputation: 4.8/5.0                 │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ 📊 MARKETS & PLATFORMS              │
│ Markets: Forex, Indices, Crypto     │
│ Platforms: MT4, MT5, cTrader        │
│                                     │
└─────────────────────────────────────┘
│ [Visit Website] [Start Challenge]  │
└─────────────────────────────────────┘
```

### Why This Works Better:

1. **Progressive Disclosure**: Most important info first
2. **Scannable Sections**: Clear emoji headers
3. **Decision Flow**: Guides from metrics → risks → rewards → trust
4. **No Cognitive Load**: No need to remember which tab has what
5. **Mobile Friendly**: Single scroll, no tab switching

---

## 🎯 TRUST SIGNALS (Missing!)

### Critical Addition: Social Proof

**Current**: No trust indicators  
**Needed**:

1. **Firm Reputation**:
   - Star rating (4.8/5.0)
   - Number of traders (2,341 active)
   - Total paid out ($45M)
   - Years in business (Founded 2015)

2. **Challenge Success Rate**:
   - "68% pass rate" (if available)
   - "Average pass time: 18 days"
   - "Most popular" badge

3. **User Reviews** (Future):
   - "4.8/5.0 from 1,234 reviews"
   - Top review snippet
   - Link to full reviews

---

## 📊 COMPARISON TABLE REDESIGN

### Current Problems:
- Too many rows
- Hard to scan
- Not mobile friendly

### Recommended Columns (Only 7):

| Firm | Account | Fee | Split | Drawdown | Payout | Rating |
|------|---------|-----|-------|----------|--------|--------|
| FTMO | $10k | $155 | 80% | 10% | 24-48h | ⭐ 4.8 |
| FundedNext | $15k | $99 | 90% | 8% | Same day | ⭐ 4.6 |
| The Funded | $25k | $199 | 95% | 12% | Weekly | ⭐ 4.5 |

**Mobile**: Horizontal scroll with sticky first column

---

## 🎨 VISUAL HIERARCHY PRINCIPLES

### Size Hierarchy:
```
XXXL: Account size number ($10,000)
XXL:  Entry fee / Prize (FREE / $155)
XL:   Profit split (80%)
L:    Challenge name
M:    Metrics labels, risk rules
S:    Supporting text, descriptions
XS:   Firm name, metadata
```

### Color Hierarchy:
```
PRIMARY (Green): FREE badges, success indicators
ACCENT (Blue): Paid badges, primary actions
WARNING (Orange): Risk metrics, daily loss
MUTED: Supporting text, metadata
```

### Weight Hierarchy:
```
BOLD: Numbers, key metrics, headings
SEMIBOLD: Labels, section titles
REGULAR: Body text, descriptions
```

---

## 🚀 IMPLEMENTATION PRIORITY

### Phase 1: Card Simplification (2-3 hours)
1. Remove markets from card
2. Simplify to 2x2 metrics grid
3. Add rating/trust signals
4. Single "View Details" button
5. Subtle comparison checkbox

### Phase 2: Drawer Redesign (3-4 hours)
1. Remove tabs
2. Create single scroll view
3. Add section headers with emojis
4. Reorganize content by priority
5. Add trust signals (firm info)

### Phase 3: Comparison Table (2 hours)
1. Reduce to 7 columns
2. Make mobile scrollable
3. Add sticky first column
4. Improve visual hierarchy

---

## 📚 SOURCES

1. **Eleken** - "17 Card UI Design Examples and Best Practices" (2024)
2. **Nielsen Norman Group** - Card UI Definition
3. **Material Design** - Card Component Guidelines
4. **UXPin** - "How to Design Card UI and Why They Matter"
5. **FTMO** - Challenge presentation analysis
6. **FundedNext** - Challenge comparison analysis
7. **The Funded Trader** - Information architecture analysis

---

## 💡 KEY TAKEAWAYS

1. **Less is More**: Cards should show 4-6 key metrics, not everything
2. **Visual Hierarchy**: Size, color, weight must guide the eye
3. **Progressive Disclosure**: Details in drawer, not on card
4. **Trust Signals**: Ratings, success rates, social proof are critical
5. **Single Scroll**: Tabs create cognitive load, single scroll is better
6. **Decision-Focused**: Every element should help the user decide

---

**Next Step**: Implement Phase 1 (Card Simplification) based on this research.
