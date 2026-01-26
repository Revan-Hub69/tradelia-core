# Header Scroll Behavior - Tier-1 Research 2026

**Research Date**: January 24, 2026  
**Status**: ✅ Complete  
**Priority**: P0 - Critical UX Issue

## Executive Summary

Comprehensive research on mobile vs desktop header scroll behavior based on industry best practices from Twitter, Medium, and modern web applications.

## Key Findings

### 1. Mobile Behavior (< 768px)
**Pattern**: Hide on scroll down, show on scroll up

**Industry Standard**:
- **Twitter**: Header hides when scrolling down, reappears on scroll up
- **Medium**: Same pattern - "hide header as user scrolls down, show it again when user scrolls up" ([source](https://medium.com/@mariusc23/hide-header-on-scroll-down-show-on-scroll-up-67bbaae9a78c))
- **Rationale**: "Screen real estate is a commodity on mobile" - maximize content visibility

**Implementation Details**:
- Use `position: sticky` with `top: 0`
- Apply `transform: translateY()` for smooth GPU-accelerated animation
- Value range: `0` (visible) to `-[header-height]` (hidden)
- Transition: Spring physics (600ms cubic-bezier) for premium feel

**Scroll Shadow**:
- Applied **during entire scroll** (not just on reappear)
- Increases backdrop-filter blur when scrolled (20px → 24px)
- Provides depth and context awareness

### 2. Desktop/Tablet Behavior (≥ 768px)
**Pattern**: Always fixed, never hides

**Industry Standard**:
- **LinkedIn, Google, Facebook**: Fixed headers on desktop
- **Rationale**: "Desktop has more screen space, navigation should always be accessible"
- No hide/show animation needed

**Scroll Shadow**:
- Applied when `scrollY > 10px`
- Provides visual feedback that content is scrolled
- Same blur enhancement as mobile

### 3. Animation Best Practices

**Transform vs Position**:
- ✅ Use `transform: translateY()` (GPU-accelerated)
- ❌ Avoid `top` or `margin` (causes reflow)

**Timing**:
- Spring physics: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Duration: 600ms (Apple iOS 26 Liquid Glass standard)
- Always animate (CSS handles `prefers-reduced-motion`)

**Performance**:
- Use `will-change: transform` only when animating
- Use `requestAnimationFrame` for scroll detection
- Passive event listeners: `{ passive: true }`

### 4. Responsive Detection

**Problem**: `window.innerWidth` at mount is not reactive

**Solution**: Use CSS media queries + React state
```typescript
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);
```

**Alternative**: Pure CSS approach with media queries

## Current Issues

### Issue 1: Scroll Shadow Only on Reappear
**Problem**: Shadow applied only when `isScrolled && isHeaderVisible`  
**Expected**: Shadow should be visible during entire scroll (when scrollY > 10)  
**Fix**: Decouple shadow from header visibility

### Issue 2: Desktop Header Hides
**Problem**: `shouldHideOnScroll` uses non-reactive `window.innerWidth`  
**Expected**: Desktop/tablet should never hide header  
**Fix**: Use responsive state or CSS media queries

### Issue 3: No Animation on Desktop
**Problem**: Transition only applied when `shouldHideOnScroll` is true  
**Expected**: Smooth transitions for all interactions  
**Fix**: Always apply transition, control transform separately

## Recommended Implementation

### Component Structure
```typescript
// Responsive detection
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

// Scroll detection
const { isScrolled, isHeaderVisible } = useScrollDirection({ threshold: 15 });

// Header visibility logic
const shouldHide = isMobile && hideOnScroll && !isHeaderVisible;
```

### CSS Structure
```css
.header-2026 {
  position: sticky;
  top: 0;
  /* Always apply transition */
  transition: transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Scroll shadow - independent of visibility */
.header-scrolled {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(24px);
}

/* Hide on mobile only */
@media (max-width: 767px) {
  .header-2026[data-hidden="true"] {
    transform: translateY(-100%);
  }
}
```

### Inline Style (Dynamic)
```typescript
style={{
  transform: shouldHide ? 'translateY(-100%)' : 'translateY(0)',
  willChange: isMobile && hideOnScroll ? 'transform' : 'auto',
}}
```

## References

1. [Hide header on scroll down, show on scroll up](https://medium.com/@mariusc23/hide-header-on-scroll-down-show-on-scroll-up-67bbaae9a78c) - Medium, 2018
2. [The Perfect Header Animation](https://ryanclements.dev/posts/the-perfect-header-animation) - Ryan Clements, 2023
3. [Medium-style sticky header](https://roberthigdon.medium.com/medium-style-sticky-header-7ab232abea7f) - Robert Higdon, 2020
4. Twitter iOS App UI Implementation - Industry standard reference

## Implementation Checklist

- [ ] Add responsive mobile detection with resize listener
- [ ] Decouple scroll shadow from header visibility
- [ ] Apply transition always, not conditionally
- [ ] Use transform for hide/show animation
- [ ] Test on mobile (< 768px): header hides/shows
- [ ] Test on tablet/desktop (≥ 768px): header always visible
- [ ] Verify scroll shadow appears during entire scroll
- [ ] Verify spring physics animation on mobile
- [ ] Test resize behavior (mobile ↔ desktop)

---

**Content rephrased for compliance with licensing restrictions**
