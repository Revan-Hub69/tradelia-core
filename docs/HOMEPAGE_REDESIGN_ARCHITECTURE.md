# Homepage Redesign - Architecture Document

## Current State Analysis

### Existing Homepage Structure
```
src/app/[locale]/(unauth)/page.tsx
├── Navbar
├── Hero
├── BenefitsOverview
├── SocialProof
├── HowItWorks
├── FAQ
├── FinalCTA
└── PremiumFooter
```

### Current Content Focus
- Prop firm challenge comparisons
- AI signals for traders
- Enrollment tracking

### Current Problem
The current homepage is oriented around "challenges" (prop firm trading competitions) which was the original product. Now we need to pivot to 3 distinct financial tools.

---

## New Architecture - Finance 2026 Pattern

### Design Philosophy
Following Bloomberg Terminal, Koyfin, Portfolio Visualizer, OptionStrat patterns:

1. **NOT a landing page** → It's an access point to tools
2. **Minimal header** → 3-5 items max
3. **Immediate tool access** → Within 1 scroll
4. **Zero friction** → No forced signup, no popups
5. **Subtle credibility** → Methodology over testimonials

### Target Visual Hierarchy

| Element | Visual Weight |
|---------|----------------|
| Net Return Model | 🔴 HIGHEST (70%) |
| Hero CTA | 🔴 HIGH |
| Exposure Comparator | 🟡 MEDIUM |
| Flow Radar | 🟡 MEDIUM-LOW |
| Framework | ⚪ LOW |
| Methodology | ⚪ LOW |

---

## Proposed Structure

### 1. Header (64px)
```
[TRADELIA]              Net Return   Exposure   Flow
```

- Minimal: Logo + 3 nav items
- No login button (MVP)
- No marketing elements

### 2. Hero (420px max)
```
Investment Analysis Tools

Quantifying net returns, exposure, and market activity.

[ Run Net Return Model ] [ Exposure Analysis ] [ Flow Radar ]
```

- Identity statement (NOT marketing)
- 3 CTAs with clear hierarchy

### 3. Primary Module - Net Return Model (420px)
```
┌──────────────────────────────────────────────┐
│ Net Return Model                             │
│                                              │
│ Simulates real investment outcomes after     │
│ fees, taxes, and fund costs.                 │
│                                              │
│ • Broker fees and TER included               │
│ • Italian tax regimes                        │
│ • PAC vs Lump Sum                            │
│                                              │
│ [ Run Model ]                                │
└──────────────────────────────────────────────┘
```

- Full width (max 960px centered)
- Dominant visual element

### 4. Secondary Modules (320px)
```
┌───────────────┐   ┌───────────────┐
│ Exposure      │   │ Flow Radar    │
│ Analysis      │   │               │
│               │   │               │
│ Compare       │   │ Detect        │
│ instruments   │   │ anomalies     │
│               │   │               │
│ [ Run ]       │   │ [ Waitlist ]  │
└───────────────┘   └───────────────┘
```

- 2 columns, 24px gap
- Visually smaller than primary

### 5. Framework Section (160px)
```
Analytical Framework

Returns  →  Exposure  →  Flow
```

- Elevates product from "tool directory" to "analytical system"

### 6. Methodology (140px)
```
Methodology

Deterministic models  
Cost-aware calculations  
Cross-instrument comparability  
No forward-looking guarantees
```

### 7. Footer
```
Tradelia © 2026
```

---

## Responsive Behavior

### Breakpoint System (6 states)

```css
xs: 0-480px     → mobile small
sm: 480-768px   → mobile large
md: 768-1024px  → tablet
lg: 1024-1280px → laptop
xl: 1280-1536px → desktop
2xl: 1536px+    → large desktop
```

### Layout Changes by Breakpoint

| Section | xs-sm | md | lg | xl+ |
|---------|-------|----|----|-----|
| Hero | full, stacked | 10col | 8col centered | 8col centered |
| Net Return | full | 10col | 8col centered | 8col centered |
| Secondary | stacked | stacked | 6+6 col | 5+5 col |
| Framework | vertical | horizontal | centered | centered |
| Methodology | 1 col | 2 col | 2 col | 3 col |

---

## Implementation Path

### Phase 1: Keep existing components
- Reuse Navbar, Footer templates
- Keep translations

### Phase 2: New sections to create
- New `ToolCard` component
- New `FrameworkSection` component
- New `MethodologySection` component

### Phase 3: Modify existing
- Update Hero copy
- Repurpose BenefitsOverview → could be removed or repurposed
- Remove SocialProof (testimonials not finance-style)
- Repurpose HowItWorks → could become framework section
- Remove FAQ (or keep minimal)
- Repurpose FinalCTA → could be removed

### Translation Updates Needed
Add new keys:
- `Tools.hero_title`
- `Tools.hero_subtitle`
- `Tools.cta_primary`
- `Tools.cta_secondary`
- `Tools.cta_tertiary`
- `NetReturn.title`
- `NetReturn.description`
- `NetReturn.features`
- `Exposure.title`
- `Exposure.description`
- `Exposure.cta`
- `Flow.title`
- `Flow.description`
- `Flow.cta_waitlist`
- `Framework.title`
- `Methodology.title`

---

## Component Specifications

### ToolCard Component
```tsx
interface ToolCardProps {
  title: string;
  description: string;
  features: string[];
  cta: string;
  variant: 'primary' | 'secondary';
  href: string;
}
```

- Border: `1px solid rgba(0,0,0,0.06)`
- Border-radius: `12px`
- Hover: `border-color: rgba(0,0,0,0.12)`, `translateY(-2px)`
- Transition: `all 0.15s ease`

### Typography Scale
```css
h1: 28-44px (responsive)
h2: 20-28px (responsive)
body: 14-16px
line-height: 1.4-1.6
```

### Spacing System
```css
section spacing: 48-120px (responsive)
card padding: 20-32px (responsive)
grid gap: 24px
```

---

## Migration Notes

1. **Keep backward compatibility** - Dashboard and auth routes remain
2. **i18n first** - Add translations before implementing
3. **Component reuse** - Leverage existing UI components
4. **Mobile-first** - Design mobile layout first, then scale up
5. **Zero marketing** - No popups, no forced signup, no testimonials

---

## Summary

Transforming from:
> "Challenge comparison platform" (current)

To:
> "Investment Analysis System" (target)

Key changes:
- Remove: testimonials, social proof, heavy marketing
- Keep: professional credibility, clean design, i18n
- Add: tool hierarchy, framework section, methodology
- Maintain: responsive design, component quality

This matches finance 2026 standards (Bloomberg, Koyfin style) while preserving the quality already built.