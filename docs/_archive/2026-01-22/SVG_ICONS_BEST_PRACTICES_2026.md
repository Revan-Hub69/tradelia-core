# SVG Icons Best Practices 2026 - Tradelia

**Date:** January 21, 2026  
**Task:** P2.T2 - Create Homemade SVG Icons  
**Research Focus:** React SVG icons, accessibility, motion animations

---

## Research Summary

### 1. SVG in React Best Practices

**Inline SVG Components (Recommended for Tradelia)**
- Direct embedding in React components
- Full control via CSS/props
- Better performance than external files
- Dynamic color via `currentColor`
- Accessibility via ARIA attributes

**Key Principles:**
- Use `viewBox="0 0 24 24"` for consistent scaling
- Use `fill="none"` + `stroke="currentColor"` for theme integration
- Use `strokeLinecap="round"` + `strokeLinejoin="round"` for smooth edges
- Keep paths simple and optimized
- Avoid inline styles, use CSS classes

**Sources:**
- [Inline SVG in React](https://dmfrancisco.github.io/react-icons/)
- [SVG currentColor](https://trendmicro-frontend.github.io/tonic-ui/react/v0/svgicon)
- [React SVG Components](https://notanumber.in/blog/how-to-use-svg-as-react-component)

---

### 2. Accessibility Requirements

**ARIA Attributes:**
- `aria-hidden="true"` for decorative icons (default)
- `aria-label` when icon is interactive
- `role="img"` + `aria-label` for standalone icons

**Color Contrast:**
- Use `currentColor` to inherit text color
- Ensure 3:1 contrast ratio (WCAG 2.2 AA)
- Test with high contrast mode

**Keyboard Navigation:**
- Icons in buttons must be keyboard accessible
- Focus indicators on parent element
- No focus on icon itself

---

### 3. Motion & Animation

**Framer Motion Integration:**
- Use `motion.svg` for animated icons
- Respect `prefers-reduced-motion`
- Keep animations subtle (< 300ms)
- Use transform/opacity only (GPU-accelerated)

**Motion Preferences:**
```typescript
const reducedMotion = prefersReducedMotion();
const animation = reducedMotion ? {} : { rotate: 360 };
```

**Animation Types:**
- **Full Motion:** Rotate, scale, path morphing
- **Reduced Motion:** Opacity fade only
- **No Motion:** Instant state change

**Sources:**
- [Framer Motion Reduced Motion](https://www.framer.com/docs/use-reduced-motion/)
- [Accessible Animations](https://www.allyson.ai/blog/accessibility-first-animations)
- [prefers-reduced-motion](https://www.tatianamac.com/posts/prefers-reduced-motion)

---

## Tradelia Icon Design Signature

### Visual Style
- **Grid:** 24x24 viewBox
- **Stroke Width:** 1.75 (default), 1.5 (thin), 2 (bold)
- **Stroke Caps:** Round
- **Stroke Joins:** Round
- **Optical Balance:** Centered, visually balanced
- **Elegance:** Clean lines, minimal paths, refined details

### Technical Standards
- **Size Props:** 16, 20, 24 (default: 20)
- **State Props:** default, active, pressed, disabled
- **Color:** `currentColor` (inherits from parent)
- **Transitions:** `transition-transform duration-150 ease-out`
- **States:**
  - Default: `scale-100 opacity-100`
  - Active: `scale-110 opacity-100`
  - Pressed: `scale-95 opacity-90`
  - Disabled: `scale-100 opacity-40`

### IconBase Pattern
```typescript
export const MyIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      {/* SVG paths here */}
    </IconBase>
  );
};
```

---

## Implementation Plan - P2.T2

### Icons to Create

1. **BellIcon** (Notifications)
   - Bell shape with clapper
   - Optional badge indicator
   - Ring animation on new notification

2. **LockIcon** (Policy Locks)
   - Padlock with shackle
   - Closed state (locked)
   - Simple, recognizable

3. **MoreVerticalIcon** (Context Menu Trigger)
   - Three vertical dots
   - Evenly spaced
   - Minimal, clean

### Animation Strategy

**BellIcon:**
- Full Motion: Ring animation (rotate ±15deg, 3 cycles)
- Reduced Motion: Opacity pulse (100% → 80% → 100%)
- No Motion: Instant appearance

**LockIcon:**
- Full Motion: Subtle shake (±2px horizontal)
- Reduced Motion: Opacity fade
- No Motion: Instant appearance

**MoreVerticalIcon:**
- Full Motion: Scale pulse (100% → 110% → 100%)
- Reduced Motion: Opacity fade
- No Motion: Instant appearance

---

## Acceptance Criteria

✅ All icons follow IconBase pattern  
✅ All icons use currentColor  
✅ All icons have proper viewBox (0 0 24 24)  
✅ All icons support size prop (16, 20, 24)  
✅ All icons support state prop (default, active, pressed, disabled)  
✅ All icons respect motion preferences  
✅ All icons are accessible (aria-hidden by default)  
✅ No external icon libraries used  
✅ Consistent with Tradelia design signature  

---

## References

- [W3C SVG Accessibility](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)
- [Framer Motion SVG](https://www.framer.com/motion/component/)
- [React SVG Best Practices](https://refine.dev/blog/react-svg/)
- [Accessible Motion](https://www.smashingmagazine.com/2020/09/design-reduced-motion-sensitivities)

---

**Status:** Research Complete  
**Next:** Implement BellIcon, LockIcon, MoreVerticalIcon
