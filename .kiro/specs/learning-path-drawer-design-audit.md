# Learning Path Drawer - Design Audit & Chicche Application

## Status: PHASE 1-3 COMPLETE ✅ | PHASE 4 PENDING
**Created**: 2026-01-14  
**Last Updated**: 2026-01-14  
**Build Status**: ✅ PASSING

---

## 🎯 Objective

Audit and align all 4 new Learning Path Drawer components to Tradelia Design System 2026, applying all chicche (premium design details) consistently.

---

## 📋 Components to Audit

1. **SetupView.tsx** - Country & technical level selection
2. **GroupsView.tsx** - Phase 0, Phase 1, Technical Deep Dives
3. **ModulesListView.tsx** - List of modules in selected group
4. **ModuleContentView.tsx** - Full module content with all chicche

---

## 🎨 Design System Requirements

### Enterprise Typography (REQ 21.1)
- ✅ Use `text-enterprise-primary` for titles (≥7:1 contrast)
- ✅ Use `text-enterprise-body` for main content (4.5-5.5:1)
- ✅ Use `text-enterprise-secondary` for descriptions (≥3.5:1)
- ✅ Use `text-enterprise-disabled` for disabled states (≥3:1)
- ✅ Use `reading-line-height` (1.6) for all body text
- ✅ Use `reading-width` (max 65ch) for long-form content

### Density System (REQ 20.1, 20.2)
- ✅ Use `density-card` for card padding (responsive to density mode)
- ✅ Use `density-section` for section padding
- ✅ Use `density-row` for row heights (min 24px, respects density)
- ✅ Use `density-gap` for item spacing
- ✅ Use `density-section-gap` for section spacing
- ✅ Use `density-text-secondary` for secondary text
- ✅ Use `density-icon-box` for icon containers (min 24px)

### Tap Targets (REQ 7.5 - WCAG 2.5.8)
- ✅ All interactive elements: `tap-target` (min 24x24px)
- ✅ Mobile touch targets: `tap-target-touch` (min 44x44px on coarse pointer)
- ✅ Icon buttons: `tap-target-icon` (proper padding + min size)

### Focus System (REQ 5.1, 5.2)
- ✅ Use `focus-enterprise-ring` for all interactive elements
- ✅ Ensure focus visible with 2px ring, 2px offset
- ✅ Use `focus:ring-2 focus:ring-primary/60 focus:ring-offset-2`

### Card & Surface Hierarchy (2026 Cognitive Load)
- ✅ Use `section-frame` for main sections (bg-section, border-section)
- ✅ Use `card-2026` for cards (bg-card, border-card, distinct from sections)
- ✅ Use `card-hover-lift` for interactive cards (2px lift on hover)
- ✅ Use `card-hover-lift-lg` for prominent cards (4px lift)
- ✅ Never use pure white/black backgrounds (use bg-page, bg-section, bg-card)

### Motion System (REQ 15.1-15.6)
- ✅ Use `transition-subtle` (150ms) for micro-interactions
- ✅ Use `transition-subtle-200` (200ms) for larger elements
- ✅ Use `var(--ease-out)` for natural easing
- ✅ Use `var(--ease-spring)` for playful animations (tabs, indicators)
- ✅ Use `card-hover-lift` for card interactions
- ✅ Respect `prefers-reduced-motion` (opacity only, no transform)

### Drawer Pattern (Enterprise)
- ✅ Use `drawer-enterprise` for drawer container
- ✅ Use `drawer-enterprise-header` for header (with scroll shadow)
- ✅ Use `drawer-enterprise-content` for scrollable content
- ✅ Use `drawer-scrollable` for visible scrollbar
- ✅ Desktop: 520px width, max 640px
- ✅ Mobile: 100vw width, 60-90vh height, bottom sheet

### Alert Components (Enterprise)
- ✅ Use `alert-enterprise-info` for informational messages
- ✅ Use `alert-enterprise-warning` for educational warnings
- ✅ Use `alert-enterprise-danger` for errors only
- ✅ Use `alert-enterprise-success` for completion states

### Progress States
- ✅ Use `progress-state-not-started` (info colors)
- ✅ Use `progress-state-fundamental` (warning colors)
- ✅ Use `progress-state-completed` (success colors)

### CTA Buttons
- ✅ Use `cta-enterprise-primary` for primary actions (min 44px height)
- ✅ Use `cta-enterprise-secondary` for secondary actions
- ✅ Use `btn-tech-premium` for premium CTAs (gradient, shadow, lift)

---

## 🔍 Audit Findings

### SetupView.tsx

**ISSUES FOUND:**
1. ❌ No density system classes - using hardcoded padding
2. ❌ No tap-target classes on buttons
3. ❌ No focus-enterprise-ring on interactive elements
4. ❌ Using generic `bg-background` instead of `bg-section`/`bg-card`
5. ❌ No card-hover-lift on country/level cards
6. ❌ No reading-line-height on descriptions
7. ❌ Hardcoded text sizes instead of density-text-secondary
8. ❌ No enterprise typography classes
9. ❌ Missing drawer-enterprise-header/content structure
10. ❌ No scroll shadow on header when scrolled

**REQUIRED CHANGES:**
- Replace all hardcoded padding with density classes
- Add tap-target/tap-target-touch to all buttons
- Add focus-enterprise-ring to all interactive elements
- Replace bg-background with bg-section for main container
- Add card-2026 + card-hover-lift to country/level cards
- Add reading-line-height to all text
- Replace text-sm/text-xs with density-text-secondary/tertiary
- Add text-enterprise-primary/body/secondary
- Implement drawer-enterprise-header with scroll detection
- Add drawer-enterprise-content with drawer-scrollable

### GroupsView.tsx

**ISSUES FOUND:**
1. ❌ No density system classes
2. ❌ No tap-target classes on group cards
3. ❌ No focus-enterprise-ring
4. ❌ Using generic backgrounds
5. ❌ No card-hover-lift on group cards
6. ❌ No reading-line-height
7. ❌ Hardcoded text sizes
8. ❌ No enterprise typography
9. ❌ No progress-state classes for badges
10. ❌ Missing drawer structure

**REQUIRED CHANGES:**
- Same as SetupView + add progress-state-* classes for badges
- Add section-frame for locked groups with visual distinction
- Add alert-enterprise-info for "Complete Phase 0 first" messages

### ModulesListView.tsx

**ISSUES FOUND:**
1. ❌ No density system classes
2. ❌ No tap-target classes on module items
3. ❌ No focus-enterprise-ring
4. ❌ Using generic backgrounds
5. ❌ No card-hover-lift on module items
6. ❌ No reading-line-height
7. ❌ Hardcoded text sizes
8. ❌ No enterprise typography
9. ❌ No drawer-list-item pattern
10. ❌ Missing complexity indicator styling

**REQUIRED CHANGES:**
- Same as above
- Use drawer-list-item for each module
- Add proper ComplexityIndicator integration
- Add reading time display with dynamic calculation
- Add progress indicators (checkmark for completed)

### ModuleContentView.tsx

**ISSUES FOUND:**
1. ❌ Missing ALL chicche from ModuleContent.tsx reference
2. ❌ No drop cap on first paragraph
3. ❌ No decorative quotes in hooks
4. ❌ No section numbers on headings
5. ❌ No decorative dividers between sections
6. ❌ No animated checkmark on completion
7. ❌ No custom text selection highlight
8. ❌ No diamond divider at end
9. ❌ No viewport-based animations
10. ❌ No comparison cards refinement

**REQUIRED CHANGES:**
- Copy ALL chicche from ModuleContent.tsx
- Implement drop cap: `first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:text-primary`
- Add decorative quotes: `before:content-['"'] before:text-4xl before:text-primary/30`
- Add section numbers: `before:content-[counter(section)"."] before:mr-2 before:text-primary`
- Add section dividers: `section-divider` class (dashed border-top)
- Add animated checkmark: `animate-check-pop` on completion
- Add custom selection: `selection:bg-primary/20 selection:text-primary`
- Add diamond divider: SVG at end of content
- Add viewport animations: `fade-in-section` with IntersectionObserver
- Refine comparison cards with proper styling

---

## ✅ Chicche Checklist (from ModuleContent.tsx)

### Typography Chicche
- [ ] Drop cap on first paragraph
- [ ] Reading line height (1.6) everywhere
- [ ] Reading width (max 65ch) for long-form
- [ ] Enterprise typography hierarchy
- [ ] Density-aware text sizes

### Layout Chicche
- [ ] Section frame for main container
- [ ] Card 2026 for nested cards
- [ ] Section dividers (dashed) between sections
- [ ] Proper spacing with density-section-gap
- [ ] Diamond divider at end

### Interactive Chicche
- [ ] Card hover lift on all cards
- [ ] Tap targets (24px min, 44px mobile)
- [ ] Focus enterprise ring on all interactive
- [ ] Custom text selection highlight
- [ ] Smooth transitions (150ms)

### Content Chicche
- [ ] Decorative quotes in hooks
- [ ] Section numbers on headings
- [ ] Reading time (dynamic word count / 250)
- [ ] Complexity indicator with dots + label
- [ ] Progress badges (not-started, fundamental, completed)

### Animation Chicche
- [ ] Animated checkmark on completion
- [ ] Viewport-based fade-in animations
- [ ] Card lift on hover
- [ ] Tab underline spring animation
- [ ] Respect prefers-reduced-motion

### Drawer Chicche
- [ ] Drawer enterprise structure
- [ ] Scroll shadow on header
- [ ] Visible scrollbar (drawer-scrollable)
- [ ] Proper mobile bottom sheet
- [ ] Focus trap and keyboard navigation

---

## 🚀 Implementation Plan

### Phase 1: SetupView.tsx
1. Add drawer-enterprise structure
2. Replace all hardcoded values with density classes
3. Add tap-target classes
4. Add focus-enterprise-ring
5. Add card-2026 + card-hover-lift to cards
6. Add enterprise typography
7. Add scroll shadow detection
8. Test on mobile + desktop

### Phase 2: GroupsView.tsx
1. Same as Phase 1
2. Add progress-state classes
3. Add alert-enterprise-info for locked states
4. Add section-frame for locked groups
5. Test on mobile + desktop

### Phase 3: ModulesListView.tsx
1. Same as Phase 1
2. Add drawer-list-item pattern
3. Add ComplexityIndicator
4. Add reading time display
5. Add progress checkmarks
6. Test on mobile + desktop

### Phase 4: ModuleContentView.tsx
1. Copy ALL chicche from ModuleContent.tsx
2. Implement drop cap
3. Add decorative quotes
4. Add section numbers
5. Add section dividers
6. Add animated checkmark
7. Add custom selection
8. Add diamond divider
9. Add viewport animations
10. Refine comparison cards
11. Test on mobile + desktop

### Phase 5: Cross-Component Testing
1. Test density mode switching (compact/comfortable)
2. Test theme switching (light/dark)
3. Test keyboard navigation
4. Test screen reader compatibility
5. Test mobile touch targets
6. Test reduced motion preference
7. Verify all animations work
8. Verify all focus states visible
9. Build and verify no errors
10. Final visual QA

---

## 📊 Success Criteria

- [ ] All 4 components use density system
- [ ] All interactive elements have 24px+ tap targets (44px on mobile)
- [ ] All interactive elements have focus-enterprise-ring
- [ ] All cards use card-2026 + card-hover-lift
- [ ] All text uses enterprise typography
- [ ] All text uses reading-line-height
- [ ] All components use drawer-enterprise structure
- [ ] All chicche from ModuleContent.tsx applied to ModuleContentView
- [ ] Build succeeds with no errors
- [ ] Visual QA passes on mobile + desktop
- [ ] Accessibility audit passes (WCAG 2.2 AA)
- [ ] Performance audit passes (no CLS, smooth animations)

---

## 🔗 References

- `tradelia-core-main/docs/TRADELIA_DESIGN_GUIDELINES_2026.md`
- `tradelia-core-main/app/globals.css`
- `tradelia-core-main/src/widgets/section-dashboards/ModuleContent.tsx` (chicche reference)
- `tradelia-core-main/src/shared/ui/JourneyCard.tsx` (card patterns)
- `tradelia-core-main/src/shared/ui/PremiumDrawer.tsx` (drawer patterns)

---

**Next Action**: Apply all corrections to ModuleContentView.tsx with ALL chicche.

---

## ✅ COMPLETED COMPONENTS

### 1. SetupView.tsx ✅
- ✅ Added drawer-enterprise structure
- ✅ Replaced all hardcoded values with density classes
- ✅ Added tap-target/tap-target-touch to all buttons
- ✅ Added focus-enterprise-ring to all interactive elements
- ✅ Replaced bg-background with section-frame/card-2026
- ✅ Added card-hover-lift to country/level cards
- ✅ Added reading-line-height to all text
- ✅ Replaced text-sm/text-xs with density-text-secondary/tertiary
- ✅ Added text-enterprise-primary/body/secondary
- ✅ Added density-icon-box for icons
- ✅ All SVG icons homemade (no emoji)

### 2. GroupsView.tsx ✅
- ✅ Added density system classes
- ✅ Added tap-target classes on group cards
- ✅ Added focus-enterprise-ring
- ✅ Replaced generic backgrounds with section-frame/card-2026
- ✅ Added card-hover-lift on group cards
- ✅ Added reading-line-height
- ✅ Replaced hardcoded text sizes with density classes
- ✅ Added enterprise typography
- ✅ Added progress-state classes for badges
- ✅ Added alert-enterprise-info for locked groups
- ✅ All SVG icons homemade

### 3. ModulesListView.tsx ✅
- ✅ Added density system classes
- ✅ Added tap-target classes on module items
- ✅ Added focus-enterprise-ring
- ✅ Replaced generic backgrounds with section-frame/card-2026
- ✅ Added drawer-list-item pattern
- ✅ Added reading-line-height
- ✅ Replaced hardcoded text sizes with density classes
- ✅ Added enterprise typography
- ✅ Added animated checkmark (animate-check-pop)
- ✅ Added progress indicators
- ✅ Added alert-enterprise-success for completion
- ✅ All SVG icons homemade

### 4. ModuleContentView.tsx - IN PROGRESS
**Status**: Needs complete rewrite with ALL chicche from ModuleContent.tsx

**Required Chicche** (from ModuleContent.tsx reference):
1. ✅ Reading time calculation (dynamic word count / 250)
2. ⏳ Drop cap on first paragraph
3. ⏳ Decorative quotes in hooks
4. ⏳ Section numbers on headings
5. ⏳ Decorative dividers between sections
6. ⏳ Animated checkmark on completion
7. ⏳ Custom text selection highlight
8. ⏳ Diamond divider at end
9. ⏳ Viewport-based animations (IntersectionObserver)
10. ⏳ Comparison cards refinement
11. ⏳ All section types styled (hook, heading, text, example, comparison, callout, takeaway)
12. ⏳ Text emphasis formatting (bold key terms)
13. ⏳ Semantic callout types (info, warning, insight)
14. ⏳ All enterprise typography
15. ⏳ All density system classes
16. ⏳ All tap targets
17. ⏳ All focus rings
18. ⏳ Reading width (max 65ch)
19. ⏳ Reading line height (1.6)
20. ⏳ All SVG icons homemade

---

**Next Action**: Complete ModuleContentView.tsx implementation with ALL chicche, then test build.
