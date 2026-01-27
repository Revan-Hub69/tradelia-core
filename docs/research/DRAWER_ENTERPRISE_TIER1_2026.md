# DRAWER ENTERPRISE REDESIGN - TIER 1 RESEARCH 2026

**Date**: 2026-01-27  
**Status**: RESEARCH COMPLETE  
**Priority**: CRITICAL - Enterprise Professional Standards

---

## PROBLEM STATEMENT

**User Feedback**: "eliminare qualsiasi icona o emoji infantile, proporzionare tutto bene, inserire tutto ciò che abbiamo deciso di inserire dinamicamente (challenge propfirm non ha le stesse metriche di torneo), portare tutto a livello enterprise reale"

### Current Issues

1. ❌ **Emoji Headers**: 🎯📊💰🔐📊🏢 - Infantile, non-professional
2. ❌ **Static Content**: Same sections for all challenge types
3. ❌ **No Adaptive Logic**: Prop firm vs tournament vs competition show same data
4. ❌ **Poor Proportions**: Inconsistent spacing, sizing
5. ❌ **Not Enterprise Level**: Doesn't match navbar/sidebar/header quality

---

## TIER-1 RESEARCH SOURCES

### 1. iOS 26 Sheet/Drawer Specifications

**Sources**: TechsWill, MacRumors, Wikipedia

#### Liquid Glass Sheets (visionOS Pattern)
- **Material**: Same as panels (blur 20px, saturate 180%)
- **Border Radius**: 32px top corners (sheet pattern)
- **Shadow**: Multi-layer depth (12px/24px, 6px/12px)
- **Animation**: Spring physics (damping 30, stiffness 300)
- **Backdrop**: Black/60% with blur 8px

#### Sheet Header Pattern
- **Height**: 64-72px (comfortable touch target)
- **Padding**: 20-24px horizontal, 16-20px vertical
- **Sticky**: Always visible during scroll
- **Glass Effect**: Backdrop blur increases on scroll
- **Border**: Bottom 1px on scroll only

#### Content Sections
- **Spacing**: 32px between major sections
- **Padding**: 24px horizontal (match header)
- **Typography**: Clear hierarchy (24px/18px/14px)
- **No Emoji**: Use icon system instead

---

### 2. Professional Icon Systems (No Emoji)

**Sources**: Untitled UI, Microsoft Fluent, Standardizing UI Icons

#### Enterprise Icon Standards

**Why No Emoji**:
- Emoji are inconsistent across platforms (iOS vs Android vs Windows)
- Lack professional appearance
- Accessibility issues (screen readers)
- Cultural interpretation differences
- Not part of design system

**Professional Alternatives**:
```tsx
// ❌ BAD: Emoji
<span>🎯</span> About Challenge

// ✅ GOOD: Icon System
<InfoIcon size={20} className="text-primary" /> About Challenge
```

#### Icon System Requirements
1. **Consistent Size**: 16px, 20px, 24px (8pt grid)
2. **Stroke Width**: 2px standard (1.5px for small, 2.5px for emphasis)
3. **Color**: Use design system colors (not random)
4. **Semantic**: Icon meaning matches content
5. **Accessible**: Proper aria-labels

#### Recommended Icon Sets
- **Lucide Icons**: Clean, consistent, 2px stroke
- **Heroicons**: Tailwind-native, professional
- **Fluent System Icons**: Microsoft enterprise standard
- **Phosphor Icons**: Flexible, modern

---

### 3. Adaptive Content Sections (Dynamic Data)

**Sources**: Datavire, TheBricks, Ampcome

#### Dynamic Dashboard Principles

**Core Concept**: "One dashboard to answer many different questions"

**Adaptive Mechanisms**:
1. **Variables**: Context-based data (challenge type, category)
2. **Filters**: Show/hide sections based on data availability
3. **Contextual Queries**: Different data for different types

#### Challenge Type Taxonomy

**Free Competition (Tournament/Ranking)**:
- Prize pool & distribution
- Ranking system
- Participant count & spots left
- Registration deadline
- Competition duration
- Leaderboard preview

**Paid Evaluation (Prop Firm)**:
- Phase structure & rules
- Profit targets & drawdown limits
- Payout terms & splits
- Scaling plan
- Evaluation criteria
- Pass rates

**Hybrid (Competition with Entry Fee)**:
- Both prize pool AND evaluation
- Entry fee + potential payout
- Ranking + performance criteria

#### Adaptive Section Logic

```typescript
// Section visibility based on challenge type
const sections = {
  keyMetrics: true, // Always show
  prizePool: category === 'free_competition',
  phaseRules: category === 'paid_evaluation',
  payoutTerms: payoutTerms !== null,
  rankingSystem: ruleset_mode === 'ranking_based',
  tradingPermissions: phase1Rules !== null,
  marketAccess: marketAccess !== null,
  about: program.description !== null,
  trust: true, // Always show
};
```

---

### 4. Enterprise Drawer Best Practices

**Sources**: DesignMonks, UInkits, Smashing Magazine

#### Drawer UX Principles

1. **Clear Purpose**: User knows why drawer opened
2. **Prioritization**: Most important info first
3. **Accessibility**: Keyboard nav, focus trap, ARIA
4. **Easy Closing**: Multiple ways (X, backdrop, ESC)
5. **Smooth Animation**: Spring physics, not linear

#### Content Hierarchy

**F-Pattern Reading**:
- Top-left: Most important (title, badges)
- Horizontal scan: Key metrics
- Vertical scan: Detailed sections
- Bottom: Actions (CTA)

**Progressive Disclosure**:
- Level 1: Overview (visible immediately)
- Level 2: Details (scroll to reveal)
- Level 3: Deep dive (expandable sections)

#### Mobile vs Desktop

**Mobile** (< 768px):
- Full width
- Bottom sheet pattern
- Swipe to dismiss
- Larger touch targets (48px)

**Desktop** (>= 768px):
- Fixed width (640px)
- Right side panel
- Click backdrop to dismiss
- Hover states

---

## ENTERPRISE DRAWER SPECIFICATION

### Header Design

```tsx
<header className="
  sticky top-0 z-10
  glass-panel
  border-b border-border/50
  backdrop-blur-xl
  px-6 py-5
">
  {/* Badge Row */}
  <div className="flex items-center gap-2 mb-3">
    <Badge variant="primary" />
    <TrustBadge icon={<StarIcon />} value={4.8} />
    <TrustBadge icon={<TrendingUpIcon />} value="68%" />
  </div>
  
  {/* Title */}
  <h2 className="text-2xl font-bold mb-2">
    {program.name}
  </h2>
  
  {/* Meta */}
  <div className="flex items-center gap-3 text-sm text-muted-foreground">
    <span>{organizer}</span>
    <span>•</span>
    <span>{traderCount} active traders</span>
  </div>
  
  {/* Close Button */}
  <button className="absolute top-5 right-6">
    <XIcon size={20} />
  </button>
</header>
```

### Section Headers (NO EMOJI)

```tsx
// ❌ OLD: Emoji
<h3 className="flex items-center gap-2">
  <span>📊</span>
  Key Metrics
</h3>

// ✅ NEW: Icon System
<h3 className="flex items-center gap-3 text-lg font-bold mb-6">
  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
    <BarChartIcon size={20} className="text-primary" />
  </div>
  <span>Key Metrics</span>
</h3>
```

### Icon Mapping (Professional)

| Old Emoji | New Icon | Component | Color |
|-----------|----------|-----------|-------|
| 📊 | `BarChartIcon` | Key Metrics | Primary |
| ⚠️ | `AlertTriangleIcon` | Risk Rules | Orange |
| 💰 | `DollarSignIcon` | Payout | Green |
| 🔐 | `ShieldCheckIcon` | Permissions | Blue |
| 📊 | `TrendingUpIcon` | Markets | Primary |
| 🎯 | `InfoIcon` | About | Muted |
| 🏢 | `BuildingIcon` | Trust | Primary |

### Adaptive Sections

```tsx
// Dynamic section rendering
{category === 'free_competition' && (
  <PrizePoolSection 
    prizePool={offer.prize_pool}
    firstPrize={offer.first_prize}
    distribution={prizeDistribution}
  />
)}

{category === 'paid_evaluation' && (
  <PhaseRulesSection 
    rulesets={rulesets}
    phases={phases}
  />
)}

{ruleset_mode === 'ranking_based' && (
  <RankingSystemSection 
    maxParticipants={offer.max_participants}
    currentParticipants={offer.current_participants}
    rankingCriteria={rankingCriteria}
  />
)}
```

### Spacing & Proportions

```css
/* Enterprise Drawer Tokens */
:root {
  /* Header */
  --drawer-header-height: 72px;
  --drawer-header-padding-x: 24px;
  --drawer-header-padding-y: 20px;
  
  /* Content */
  --drawer-content-padding-x: 24px;
  --drawer-content-padding-y: 32px;
  --drawer-section-gap: 32px;
  
  /* Section Headers */
  --drawer-section-header-size: 18px;
  --drawer-section-header-weight: 700;
  --drawer-section-header-margin: 24px;
  
  /* Icon Container */
  --drawer-icon-container-size: 40px;
  --drawer-icon-size: 20px;
  --drawer-icon-radius: 12px;
  
  /* Footer */
  --drawer-footer-height: 88px;
  --drawer-footer-padding: 24px;
  --drawer-footer-gap: 12px;
}
```

---

## IMPLEMENTATION PLAN

### Phase 1: Remove Emoji, Add Icon System
- [ ] Replace all emoji with professional icons
- [ ] Create icon container component
- [ ] Apply consistent sizing (40px container, 20px icon)
- [ ] Use design system colors

### Phase 2: Adaptive Content Logic
- [ ] Implement section visibility logic
- [ ] Create challenge type detection
- [ ] Build adaptive section components
- [ ] Add data availability checks

### Phase 3: Proportions & Spacing
- [ ] Update header height (64px → 72px)
- [ ] Increase section gaps (24px → 32px)
- [ ] Standardize padding (20px → 24px)
- [ ] Fix typography hierarchy

### Phase 4: Enterprise Polish
- [ ] Match header/sidebar glass effect
- [ ] Add scroll-based backdrop blur
- [ ] Implement spring physics
- [ ] Test accessibility

### Phase 5: Dynamic Sections
- [ ] Prize Pool Section (competitions)
- [ ] Phase Rules Section (evaluations)
- [ ] Ranking System Section (tournaments)
- [ ] Conditional rendering logic

---

## SECTION SPECIFICATIONS

### 1. Key Metrics (Always Show)

**Adaptive Fields**:
- **Free Competition**: Prize Pool, Entry Fee, Participants
- **Paid Evaluation**: Account Size, Profit Split, Entry Fee
- **Tournament**: Prize Pool, Ranking Points, Entry Fee

### 2. Prize Pool (Competitions Only)

```tsx
{category === 'free_competition' && (
  <section>
    <SectionHeader 
      icon={<TrophyIcon />}
      title="Prize Pool"
      color="amber"
    />
    <PrizeDistribution 
      total={prizePool}
      first={firstPrize}
      distribution={distribution}
    />
  </section>
)}
```

### 3. Phase Rules (Evaluations Only)

```tsx
{category === 'paid_evaluation' && (
  <section>
    <SectionHeader 
      icon={<LayersIcon />}
      title="Evaluation Phases"
      color="blue"
    />
    <PhaseTimeline 
      phases={rulesets}
      current={currentPhase}
    />
  </section>
)}
```

### 4. Ranking System (Tournaments Only)

```tsx
{ruleset_mode === 'ranking_based' && (
  <section>
    <SectionHeader 
      icon={<TrendingUpIcon />}
      title="Ranking System"
      color="green"
    />
    <RankingCriteria 
      criteria={rankingRules}
      leaderboard={topTraders}
    />
  </section>
)}
```

---

## DESIGN TOKENS

```css
/* drawer-enterprise-2026.css */

:root {
  /* Match Card System */
  --drawer-radius-top: 32px;
  --drawer-width-mobile: 100vw;
  --drawer-width-desktop: 640px;
  
  /* Glass Material - Match Header */
  --drawer-glass-bg: var(--glass-material-bg);
  --drawer-glass-border: var(--glass-material-border);
  --drawer-glass-blur: 20px;
  --drawer-glass-saturate: 180%;
  
  /* Shadows - Match Card */
  --drawer-shadow-umbra: 0 12px 24px rgba(0, 0, 0, 0.16);
  --drawer-shadow-penumbra: 0 6px 12px rgba(0, 0, 0, 0.12);
  
  /* Spring Physics - Match Header */
  --drawer-transition-spring: 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --drawer-damping: 30;
  --drawer-stiffness: 300;
  
  /* Icon System */
  --drawer-icon-container-bg: hsl(var(--primary) / 0.1);
  --drawer-icon-color: hsl(var(--primary));
  --drawer-icon-container-radius: 12px;
}

.dark {
  --drawer-shadow-umbra: 0 12px 24px rgba(0, 0, 0, 0.32);
  --drawer-shadow-penumbra: 0 6px 12px rgba(0, 0, 0, 0.24);
}
```

---

## REFERENCES

1. **iOS 26 Sheets**: [TechsWill](https://www.techswill.com/2025/07/13/ios-26-ui-patterns-developers-should-adopt-from-visionos/)
2. **Icon Systems**: [Untitled UI](https://www.untitledui.com/blog/icon-sets)
3. **Dynamic Dashboards**: [Datavire](https://www.datavire.com/blog/build-dynamic-grafana-dashboards)
4. **Drawer UX**: [DesignMonks](https://www.designmonks.co/blog/side-drawer-ui)
5. **Enterprise Standards**: [Microsoft Fluent](https://github.com/microsoft/fluentui-system-icons)

---

## NEXT STEPS

1. ✅ Complete research documentation
2. ⏳ Create icon mapping system
3. ⏳ Remove all emoji from sections
4. ⏳ Implement adaptive logic
5. ⏳ Update proportions & spacing
6. ⏳ Add dynamic sections
7. ⏳ Test all challenge types

---

**Research completed by**: Kiro AI  
**Implementation priority**: CRITICAL  
**Estimated effort**: 4-6 hours  
**Impact**: HIGH - Professional enterprise standard
