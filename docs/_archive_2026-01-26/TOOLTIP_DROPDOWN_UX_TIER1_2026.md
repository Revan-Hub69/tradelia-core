# Tooltip & Dropdown UX Best Practices - Tier-1 Research 2026

**Date**: January 24, 2026  
**Status**: ✅ Research Complete  
**Goal**: Implementare tooltip e dropdown secondo best practices mobile/desktop 2026

---

## 📚 Fonti Tier-1

### 1. **Mobile Tooltip Best Practices** (Flook, 2026)
- **URL**: https://flook.co/blog/posts/mobile-tooltip-best-practices
- **Credibilità**: UX design authority, comprehensive guide
- **Key Insights**:
  - **Mobile**: NO hover, only tap/behavior triggers
  - **Desktop**: Hover OK, but must be dismissible
  - Tooltips must disappear on click/action
  - Mobile users: tap to show, tap again to dismiss
  - Don't cover essential UI elements
  - Keep copy ultra-concise (1-2 lines max)

### 2. **Accessible Tooltips** (Aleph Accessibility, 2025)
- **URL**: https://www.alephaccessibility.net/resources/accessible-tooltips
- **Credibilità**: Accessibility expert guidelines
- **Key Insights**:
  - **Best practice**: Click to trigger (not hover)
  - Allow ESC key to dismiss
  - Allow clicking tooltip button again to close
  - Hover-only tooltips exclude mobile users

### 3. **Red Hat Design System** (Red Hat UX)
- **URL**: https://ux.redhat.com/elements/tooltip/guidelines/
- **Credibilità**: Enterprise design system
- **Key Insights**:
  - **Desktop**: Tooltip disappears when cursor/focus moves
  - **Mobile**: Tap to trigger, tap again to dismiss
  - Must be dismissible without moving mouse/focus
  - Content must remain visible until user action

### 4. **NHS Digital Accessibility** (UK Government)
- **URL**: https://nhsdigital.github.io/accessibility-checklist/
- **Credibilità**: Government accessibility standards
- **Key Insights**:
  - Tooltip must be keyboard operable
  - User must be able to dismiss without moving mouse
  - Content must remain visible until user moves focus
  - Hover-triggered content must also work with keyboard

---

## 🎯 Tooltip Best Practices 2026

### Desktop Behavior
```
✅ CORRECT:
- Hover to show (optional)
- Click to show (preferred)
- ESC to dismiss
- Click outside to dismiss
- Auto-dismiss when element loses focus
- Disappear after action (button click)

❌ WRONG:
- Hover-only (excludes keyboard users)
- No way to dismiss
- Stays visible after action
- Covers clickable elements
```

### Mobile Behavior
```
✅ CORRECT:
- NO tooltips on mobile (use alternative patterns)
- If needed: tap to show, tap again to dismiss
- Auto-dismiss after action
- Never block touch targets
- Use full-screen modals for complex info

❌ WRONG:
- Hover-based tooltips (don't work)
- Tooltips that stay after tap
- Small dismiss targets
- Covering buttons/inputs
```

### Universal Rules
1. **Dismiss on Action**: Tooltip MUST disappear when user clicks the button
2. **Concise Copy**: 1-2 lines maximum (10-15 words)
3. **Clear Positioning**: Never cover interactive elements
4. **Keyboard Support**: ESC key must work
5. **Screen Reader**: Proper ARIA labels

---

## 🎨 Language Dropdown Best Practices

### Current Problems
- Dropdown "brutto" (ugly)
- Not following iOS 26 Liquid Glass standards
- Inconsistent with header design

### iOS 26 Standards (from research)
```css
/* Language Dropdown - iOS 26 Liquid Glass */
.language-dropdown {
  /* Shape */
  border-radius: 12px; /* Smaller than panel (32px) */
  
  /* Material */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  
  /* Border */
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  /* Shadow - Elevated */
  box-shadow: 
    0 12px 24px rgba(0, 0, 0, 0.15),
    0 6px 12px rgba(0, 0, 0, 0.1);
  
  /* Animation */
  transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### Dropdown Item Design
```css
.language-dropdown-item {
  /* Spacing */
  padding: 12px 16px;
  
  /* Hover State */
  background: transparent;
  transition: background 150ms ease-out;
}

.language-dropdown-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

.language-dropdown-item:active {
  background: rgba(0, 0, 0, 0.08);
}

/* Selected State */
.language-dropdown-item[data-selected="true"] {
  background: rgba(var(--primary-rgb), 0.1);
  font-weight: 600;
}
```

---

## 📱 Mobile vs Desktop Strategy

### Tooltips

| Feature | Desktop | Mobile |
|---------|---------|--------|
| **Trigger** | Hover OR Click | NO tooltips (use alternatives) |
| **Dismiss** | ESC, Click outside, Focus loss | N/A |
| **After Action** | Auto-dismiss | N/A |
| **Alternative** | Tooltip | Inline help text, Modal, Bottom sheet |

### Dropdowns

| Feature | Desktop | Mobile |
|---------|---------|--------|
| **Trigger** | Click | Tap |
| **Style** | Floating dropdown | Bottom sheet OR floating |
| **Dismiss** | Click outside, ESC | Tap outside, Swipe down |
| **Max Height** | 400px with scroll | 60vh with scroll |

---

## 🔧 Implementation Plan

### Phase 1: Fix Tooltips (1-2 ore)
1. **Desktop**:
   - Keep hover behavior
   - Add click-to-dismiss
   - Auto-dismiss on button click
   - ESC key support

2. **Mobile**:
   - Disable all tooltips (< 768px)
   - Use `@media (hover: hover)` to detect
   - Alternative: aria-label for screen readers

3. **Code Pattern**:
```tsx
// Detect hover capability
const hasHover = window.matchMedia('(hover: hover)').matches;

// Only show tooltip on desktop
{hasHover && (
  <Tooltip content="...">
    <Button />
  </Tooltip>
)}

// Mobile: use aria-label instead
<Button aria-label="Theme switcher">
  <Icon />
</Button>
```

### Phase 2: Redesign Language Dropdown (2-3 ore)
1. **Apply iOS 26 Liquid Glass**:
   - 12px border radius
   - Blur 20px + saturate 180%
   - Multi-layer shadows
   - Smooth animations

2. **Improve Item Design**:
   - Better spacing (12px padding)
   - Hover states with spring physics
   - Selected state with primary color
   - Flag icons + language name

3. **Mobile Optimization**:
   - Consider bottom sheet on mobile
   - Larger touch targets (44px min)
   - Swipe-to-dismiss gesture

### Phase 3: Header Scroll Effect (1 ora)
1. **Make Effect More Visible**:
   - Increase blur change: 20px → 16px (not 18px)
   - Add subtle scale: 1.0 → 0.99
   - Increase shadow intensity
   - Add background opacity change

---

## ✅ Success Criteria

### Tooltips
- [ ] Desktop: Hover shows, click dismisses
- [ ] Desktop: ESC key dismisses
- [ ] Desktop: Auto-dismiss on button click
- [ ] Mobile: No tooltips shown (< 768px)
- [ ] Mobile: aria-label for accessibility
- [ ] Keyboard: Full navigation support

### Language Dropdown
- [ ] iOS 26 Liquid Glass design
- [ ] 12px border radius
- [ ] Multi-layer shadows
- [ ] Smooth hover animations
- [ ] Selected state visible
- [ ] Mobile: Bottom sheet OR optimized dropdown
- [ ] Touch targets: 44px minimum

### Header Scroll Effect
- [ ] Visible on desktop/tablet
- [ ] Blur: 20px → 16px at edges
- [ ] Subtle scale effect
- [ ] Shadow intensity increase
- [ ] Smooth spring animation

---

## 📊 Before vs After

### Tooltips
**Before**:
- ❌ Hover-only (excludes mobile)
- ❌ Stay visible after click
- ❌ No keyboard support
- ❌ Cover interactive elements

**After**:
- ✅ Desktop: Hover + Click
- ✅ Auto-dismiss on action
- ✅ ESC key support
- ✅ Mobile: Disabled (aria-label instead)

### Language Dropdown
**Before**:
- ❌ Generic dropdown style
- ❌ No Liquid Glass effect
- ❌ Inconsistent with header
- ❌ Poor mobile experience

**After**:
- ✅ iOS 26 Liquid Glass
- ✅ 12px radius, blur, shadows
- ✅ Consistent with design system
- ✅ Mobile-optimized (bottom sheet)

---

## 🔗 References

1. Flook - Mobile Tooltip Best Practices (2026)
2. Aleph Accessibility - Accessible Tooltips (2025)
3. Red Hat Design System - Tooltip Guidelines
4. NHS Digital - Accessibility Checklist
5. Apple HIG - iOS 26 Design Language
6. Material Design - Dropdown Patterns

---

**Conclusione**: Tooltips devono essere disabilitati su mobile e auto-dismiss su desktop dopo azione. Language dropdown deve seguire iOS 26 Liquid Glass con 12px radius, blur, e shadows. Header scroll effect deve essere più visibile con blur 20px → 16px.
