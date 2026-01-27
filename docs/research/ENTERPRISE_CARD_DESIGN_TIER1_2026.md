# ENTERPRISE CARD DESIGN - TIER 1 RESEARCH 2026

**Date**: 2026-01-27  
**Status**: RESEARCH COMPLETE  
**Priority**: CRITICAL - Card Footer Visibility Issue

---

## PROBLEM STATEMENT

**User Report**: "il footer delle schede non è visibile"

The card footer containing the primary actions (Compare + View Details) is not clearly visible or distinguishable from the card body, preventing users from accessing the drawer functionality.

---

## TIER-1 RESEARCH SOURCES

### 1. UXPin - Card Design UI Best Practices

**Source**: [UXPin Studio Blog](https://www.uxpin.com/studio/blog/card-design-ui/)

#### Card Anatomy (Essential Elements)
1. **Container**: Every card must have a clear container with proper separation
2. **Thumbnail**: Avatar, logo, or icon for ownership/relation
3. **Header text**: Card name or title
4. **Subheading**: Additional info (date, location)
5. **Media**: Relevant image or video
6. **Supporting text**: Summary or description
7. **Buttons**: CTAs with text (Read more, Add to cart, etc.)
8. **Icons**: Action icons (like, share, etc.)

#### 7 Best Practices for Card UI

1. **Negative Space**: Use sufficient padding and borders to avoid cluttered screens
2. **One Card, One Concept**: Don't add too much complexity
3. **Suitable Images**: Use clear, properly cropped images
4. **Simple Typography**: Maintain legibility with simple fonts
5. **Be Unique**: Stand out with video, animation, or color schemes
6. **Consistent Grid**: Same spacing between cards with proper breakpoints
7. **Apply Fitt's Law**: Entire card should be clickable, not just image/text

#### Visual Hierarchy Rules

- **Most important content**: High or large as possible
- **Color, whitespace, fonts**: Create separation and hierarchy
- **Product cards**: Large image → Title → CTA → Price (with whitespace)
- **Minimize content**: Max 100 characters or 3 lines of text
- **Differentiate actions**: 
  - Primary action: Filled button
  - Secondary action: Text or flat button

#### Material Design Action Guidelines

- **Primary action**: The card itself (clickable)
- **Supplemental actions**: Belong in card footer
- **Max 2 actions visible**: Use overflow menu for more

---

### 2. Material Design 3 - Elevation System

**Source**: Material Design Guidelines

#### Elevation Levels for Cards

- **Level 0 (Flat)**: `box-shadow: none` - Minimal emphasis
- **Level 1 (Resting)**: `0 1px 3px rgba(0,0,0,0.06)` - Subtle depth
- **Level 2 (Default Cards)**: 
  ```css
  box-shadow: 
    0 4px 12px rgba(0,0,0,0.08),  /* Umbra */
    0 2px 4px rgba(0,0,0,0.04);   /* Penumbra */
  ```
- **Level 3 (Hover/Raised)**: 
  ```css
  box-shadow: 
    0 8px 16px rgba(0,0,0,0.12),  /* Umbra */
    0 4px 8px rgba(0,0,0,0.06);   /* Penumbra */
  ```

#### Dark Mode Adjustments

- Increase shadow opacity by 2-3x
- Add subtle border: `rgba(255,255,255,0.1)`
- Use tonal elevation (surface tint) instead of shadows when possible

---

### 3. Apple HIG - iOS Spacing & Typography

**Source**: Apple Human Interface Guidelines

#### Spacing System (8pt Grid)

- **Minimum touch target**: 44x44pt (iOS standard)
- **Card padding**: 16-24pt depending on content density
- **Inter-card spacing**: 12-20pt depending on viewport
- **Line height**: 1.5x font size minimum
- **Letter spacing**: Adjust for different font styles

#### Typography Hierarchy

- **Primary text**: 17pt (San Francisco font)
- **Body text minimum**: 16pt (11pt on iOS)
- **Padding between elements**: Minimum 8pt
- **Card title**: 18-20pt, bold, tracking-tight
- **Subtext**: 12-14pt, medium weight

---

### 4. Enterprise Card Design Patterns 2026

**Sources**: Multiple enterprise UI/UX articles

#### Container Requirements

1. **Border Radius**: 16-32px (modern, premium feel)
2. **Border**: 1px solid with subtle color (not harsh black)
3. **Background**: Slightly elevated from page background
4. **Backdrop Filter**: Optional blur for glass effect (premium)

#### Footer Specifications

**CRITICAL**: Footer must be visually distinct from body

1. **Separation**: 
   - Border-top: 1px solid with subtle color
   - OR Background color change (5-10% darker/lighter)
   - OR Padding increase (8-12pt top padding)

2. **Visual Weight**:
   - Footer should "anchor" the card
   - Buttons should have clear affordance
   - Primary action must stand out (color, size, position)

3. **Button Hierarchy**:
   - Primary: Filled button, brand color, 100% width OR flex-1
   - Secondary: Outline button, neutral color, auto width
   - Tertiary: Text button or icon button

4. **Spacing**:
   - Footer padding: 16-20pt
   - Button gap: 8-12pt
   - Button padding: 12-16pt vertical, 16-24pt horizontal

#### Interaction States

1. **Hover** (desktop only):
   - Lift card: `translateY(-4px)`
   - Increase shadow: Level 3 elevation
   - Scale: `scale(1.01-1.02)` subtle
   - Transition: 300ms cubic-bezier (spring physics)

2. **Active** (all devices):
   - Press down: `scale(0.98)`
   - Quick transition: 150ms ease-out

3. **Focus** (accessibility):
   - Outline: 2px solid primary color
   - Outline offset: 2px
   - High contrast mode compatible

---

## CURRENT IMPLEMENTATION ISSUES

### Problem Analysis

Looking at `ProgramCard.tsx` line 280-320 (Actions section):

```tsx
{/* Actions */}
<div className="flex gap-2 border-t border-border/50 pt-3">
  {/* Compare Checkbox */}
  <button ... />
  
  {/* View Details - PRIMARY ACTION */}
  <button ... />
</div>
```

**Issues Identified**:

1. ❌ **Insufficient Visual Separation**: 
   - `border-t border-border/50` is too subtle
   - Only `pt-3` (12px) padding - should be 16-20px
   - No background color change

2. ❌ **Footer Not Distinct**: 
   - Blends into card body
   - No clear "anchor" effect
   - Border color too transparent (50% opacity)

3. ❌ **Button Sizing Issues**:
   - Compare button too small on mobile
   - Text hidden on small screens (`hidden sm:inline`)
   - Primary button might not be prominent enough

4. ❌ **Spacing Issues**:
   - `gap-2` (8px) between buttons is minimum
   - Should be 12px for better touch targets
   - Button padding might be insufficient

---

## SOLUTION SPECIFICATION

### Footer Design (Enterprise Premium)

```tsx
{/* Footer - ENTERPRISE PREMIUM DESIGN */}
<div className="
  mt-auto                          /* Push to bottom */
  border-t-2                       /* Thicker border */
  border-border/80                 /* More visible */
  bg-muted/30                      /* Subtle background */
  px-5 py-4                        /* Generous padding */
  -mx-6 -mb-6                      /* Bleed to edges */
  rounded-b-[32px]                 /* Match card radius */
  backdrop-blur-sm                 /* Premium glass effect */
">
  <div className="flex gap-3">     {/* Larger gap */}
    {/* Buttons here */}
  </div>
</div>
```

### Button Specifications

#### Primary Button (View Details)
```tsx
<button className="
  flex-1                           /* Fill available space */
  flex items-center justify-center
  gap-2                            /* Icon spacing */
  rounded-xl                       /* Concentric corners */
  bg-gradient-to-r from-primary to-primary/90
  px-4 py-3                        /* 12px vertical */
  text-sm font-semibold
  text-primary-foreground
  shadow-lg shadow-primary/25
  transition-all duration-300
  hover:shadow-xl hover:shadow-primary/35
  hover:scale-[1.02]
  active:scale-[0.98]
  focus-visible:outline-2
  focus-visible:outline-offset-2
  focus-visible:outline-primary
">
  <span>View Details</span>
  <ArrowRightIcon className="size-4" />
</button>
```

#### Secondary Button (Compare)
```tsx
<button className="
  flex items-center justify-center
  gap-2
  rounded-xl
  border-2 border-border
  bg-background/50
  px-4 py-3
  text-sm font-semibold
  transition-all duration-300
  hover:border-primary/50
  hover:bg-muted/50
  active:scale-[0.98]
  data-[selected=true]:border-primary
  data-[selected=true]:bg-primary
  data-[selected=true]:text-primary-foreground
  data-[selected=true]:shadow-lg
  data-[selected=true]:shadow-primary/20
">
  <CheckboxIcon />
  <span className="hidden sm:inline">Compare</span>
</button>
```

### Card Height Adjustment

Current: `h-[320px]` - might be too short with new footer

Options:
1. Increase to `h-[340px]` or `h-[360px]`
2. Use `min-h-[320px]` with `flex flex-col`
3. Let content determine height naturally

**Recommendation**: Use `min-h-[340px] flex flex-col` for flexibility

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Footer Visual Separation
- [ ] Increase border thickness: `border-t` → `border-t-2`
- [ ] Increase border opacity: `border-border/50` → `border-border/80`
- [ ] Add background: `bg-muted/30`
- [ ] Increase padding: `pt-3` → `py-4 px-5`
- [ ] Add backdrop blur: `backdrop-blur-sm`
- [ ] Bleed to edges: `-mx-6 -mb-6`
- [ ] Match border radius: `rounded-b-[32px]`

### Phase 2: Button Improvements
- [ ] Increase button gap: `gap-2` → `gap-3`
- [ ] Increase button padding: `py-2` → `py-3`
- [ ] Make primary button flex-1
- [ ] Add hover scale effects
- [ ] Improve focus states
- [ ] Test touch targets (min 44x44px)

### Phase 3: Card Layout
- [ ] Change height: `h-[320px]` → `min-h-[340px]`
- [ ] Add `flex flex-col` to card
- [ ] Add `mt-auto` to footer (push to bottom)
- [ ] Test with varying content lengths

### Phase 4: Accessibility
- [ ] Test keyboard navigation
- [ ] Test screen reader announcements
- [ ] Test high contrast mode
- [ ] Test reduced motion
- [ ] Verify WCAG 2.1 AA compliance

### Phase 5: Responsive Testing
- [ ] Mobile (320px-767px)
- [ ] Tablet (768px-1023px)
- [ ] Desktop (1024px+)
- [ ] Touch vs mouse interactions

---

## DESIGN TOKENS

Add to `card-ios-26.css`:

```css
:root {
  /* Footer Specific */
  --card-footer-border-width: 2px;
  --card-footer-border-color: hsl(var(--border) / 0.8);
  --card-footer-bg: hsl(var(--muted) / 0.3);
  --card-footer-padding-x: 20px;
  --card-footer-padding-y: 16px;
  --card-footer-gap: 12px;
  
  /* Button Specific */
  --card-button-padding-x: 16px;
  --card-button-padding-y: 12px;
  --card-button-radius: 12px;
  --card-button-min-height: 44px;
}
```

---

## REFERENCES

1. **UXPin**: [Card Design UI](https://www.uxpin.com/studio/blog/card-design-ui/)
2. **Material Design**: [Elevation & Shadows](https://material.io/design/environment/elevation.html)
3. **Apple HIG**: [iOS Spacing Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
4. **WCAG 2.1**: [Touch Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
5. **Fitt's Law**: [Interaction Design](https://www.interaction-design.org/literature/article/fitts-s-law)

---

## GOLDEN RULE 2026 ⭐

**Pattern Name**: Anchored Action Zone

**Rule**: If a card opens something larger than itself (drawer, modal, compare layer), it MUST have a dedicated and stable action zone.

### Requirements for Anchored Action Zone:

1. ✅ **Visual Separation**: Clear border-top or background change
2. ✅ **Distinct Background**: 5-10% darker/lighter than card body
3. ✅ **Large Touch Targets**: Minimum 44x44px (iOS standard)
4. ✅ **Clear Hierarchy**: Primary/secondary actions visually distinct
5. ✅ **Anchored Position**: `mt-auto` to push to bottom, stable placement
6. ✅ **Bleed to Edges**: Negative margins to reach card edges
7. ✅ **Backdrop Blur**: Premium glass effect for depth

### Why This Matters:

- **Discoverability**: Users must immediately see how to interact
- **Stability**: Actions don't move as content changes
- **Affordance**: Clear visual cue that "this opens something"
- **Accessibility**: Large targets for motor impairments
- **Premium Feel**: Polished, professional appearance

### Anti-Pattern (What NOT to Do):

❌ Actions floating in card body  
❌ Subtle borders that blend in  
❌ Small buttons (<44px height)  
❌ Unclear primary/secondary hierarchy  
❌ Actions that move based on content length

---

## NEXT STEPS

1. ✅ Complete research documentation
2. ✅ Implement footer visual separation
3. ✅ Improve button hierarchy and sizing
4. ⏳ Test across all viewports
5. ⏳ Verify accessibility compliance
6. ⏳ Update design system documentation

---

**Research completed by**: Kiro AI  
**Implementation priority**: CRITICAL  
**Estimated effort**: 2-3 hours  
**Impact**: HIGH - Blocks drawer access  
**Status**: IMPLEMENTED - Ready for testing
