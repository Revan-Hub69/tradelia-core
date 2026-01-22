# Context Menu W3C APG - Best Practices 2026

**Research Date:** 2026-01-21  
**Task:** P2.T1 - ContextMenu Component (W3C APG Pattern)  
**Sources:** W3C ARIA Authoring Practices Guide, React accessibility patterns, viewport overflow handling

---

## Executive Summary

This document outlines industry best practices for implementing accessible context menus following W3C ARIA Authoring Practices Guide (APG). Key patterns include roving tabindex for keyboard navigation, auto-repositioning to prevent viewport overflow, and proper ARIA attributes for screen reader support.

---

## 1. W3C APG Menu Pattern

### Core Requirements

**ARIA Roles:**
- `role="menu"` - Container for menu items
- `role="menuitem"` - Individual actionable items
- `role="menuitemradio"` - Radio button items (optional)
- `role="menuitemcheckbox"` - Checkbox items (optional)
- `role="separator"` - Visual dividers (optional)

**ARIA Attributes:**
- `aria-haspopup="menu"` - On trigger element
- `aria-expanded="true|false"` - Menu open/closed state
- `aria-controls="menu-id"` - Links trigger to menu
- `aria-label` or `aria-labelledby` - Menu description
- `aria-disabled="true"` - Disabled items

**Source:** [W3C ARIA Authoring Practices Guide - Menu Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)

---

## 2. Roving Tabindex Pattern

### What is Roving Tabindex?

A keyboard navigation pattern where **only one item in a group has `tabindex="0"`** at a time. All other items have `tabindex="-1"`. This allows:
- Single Tab stop for the entire menu (faster navigation)
- Arrow keys to navigate within the menu
- Focus memory (last focused item remembered)

### Implementation

```typescript
// State management
const [focusedIndex, setFocusedIndex] = useState(0);

// Render items
items.map((item, index) => (
  <button
    role="menuitem"
    tabIndex={index === focusedIndex ? 0 : -1}
    onFocus={() => setFocusedIndex(index)}
    onKeyDown={handleKeyDown}
  >
    {item.label}
  </button>
));
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| **Tab** | Move focus to/from menu (single stop) |
| **↑ Arrow** | Move focus to previous item (wrap to last) |
| **↓ Arrow** | Move focus to next item (wrap to first) |
| **Home** | Move focus to first item |
| **End** | Move focus to last item |
| **Enter** | Activate focused item |
| **Space** | Activate focused item |
| **Escape** | Close menu, restore focus to trigger |

**Source:** [Building Keyboard Accessible Custom Menu using Roving Tabindex](https://dev.to/srijans38/building-a-keyboard-accessible-custom-menu-using-roving-tabindex-4h0a/)

---

## 3. Auto-Repositioning (Viewport Overflow)

### Problem

Context menus can overflow viewport boundaries, making content inaccessible.

### Solution

Dynamically reposition menu based on available space:

```typescript
function calculatePosition(
  triggerRect: DOMRect,
  menuRect: DOMRect,
  viewport: { width: number; height: number }
): { x: number; y: number } {
  let x = triggerRect.left;
  let y = triggerRect.bottom + 4; // 4px gap
  
  // Check right overflow
  if (x + menuRect.width > viewport.width) {
    x = viewport.width - menuRect.width - 8; // 8px margin
  }
  
  // Check bottom overflow
  if (y + menuRect.height > viewport.height) {
    y = triggerRect.top - menuRect.height - 4; // Above trigger
  }
  
  // Ensure minimum margins
  x = Math.max(8, x);
  y = Math.max(8, y);
  
  return { x, y };
}
```

### Performance Target

- **< 16ms** - Repositioning must complete within 1 frame @ 60fps
- Use `requestAnimationFrame` for smooth updates
- Avoid layout thrashing (batch DOM reads/writes)

**Source:** [Custom Context Menus - Auto-repositioning](https://www.cssscript.com/context-menu-touch-desktop/)

---

## 4. Focus Management

### Focus Restoration

When menu closes, focus **must** return to the trigger element:

```typescript
const triggerRef = useRef<HTMLButtonElement>(null);

const closeMenu = () => {
  setIsOpen(false);
  // Restore focus after DOM update
  requestAnimationFrame(() => {
    triggerRef.current?.focus();
  });
};
```

### Focus Trap

While menu is open, focus should stay within menu:

```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Tab') {
    e.preventDefault(); // Prevent Tab from leaving menu
    // Optionally: cycle through items with Tab
  }
};
```

**Source:** [React Accessibility Best Practices - Focus Management](https://www.allaccessible.org/blog/react-accessibility-best-practices-guide)

---

## 5. Click Outside to Close

### Implementation

```typescript
useEffect(() => {
  if (!isOpen) return;
  
  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      closeMenu();
    }
  };
  
  // Use capture phase to handle before other handlers
  document.addEventListener('mousedown', handleClickOutside, true);
  
  return () => {
    document.removeEventListener('mousedown', handleClickOutside, true);
  };
}, [isOpen]);
```

### Touch Support

```typescript
// Also handle touch events for mobile
document.addEventListener('touchstart', handleClickOutside, true);
```

---

## 6. Disabled Items

### Visual & Functional

Disabled items should:
- Have reduced opacity (0.5)
- Not be focusable (`tabIndex="-1"`)
- Not respond to clicks
- Have `aria-disabled="true"`
- Still be announced by screen readers

```typescript
<button
  role="menuitem"
  aria-disabled={item.disabled}
  tabIndex={item.disabled ? -1 : (index === focusedIndex ? 0 : -1)}
  onClick={item.disabled ? undefined : item.action}
  className={item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
>
  {item.label}
</button>
```

---

## 7. Separators

### Semantic Dividers

```typescript
<div role="separator" className="my-1 h-px bg-border" />
```

- Use `role="separator"` for semantic meaning
- Not focusable
- Announced by screen readers as "separator"

---

## 8. Animation & Motion

### Respect Motion Preferences

```typescript
// CSS
.context-menu {
  animation: menu-appear 150ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .context-menu {
    animation: none;
  }
}

// Framer Motion
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.15 }}
  // Respect user preference
  {...(prefersReducedMotion && { initial: false, animate: false, exit: false })}
>
```

---

## 9. Touch Targets

### WCAG 2.2 AA Requirements

- **Minimum size:** 44x44 CSS pixels
- **Spacing:** 8px between targets (or 44px center-to-center)
- **Exception:** Inline text links

```typescript
// Menu items
className="min-h-11 px-3" // 44px height minimum
```

**Source:** [WCAG 2.2 - Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

---

## 10. Screen Reader Announcements

### Menu State Changes

```typescript
// Announce when menu opens
<div
  role="menu"
  aria-label="Quick actions"
  aria-live="polite" // Announce changes
>
```

### Action Feedback

```typescript
// After action execution
const announce = (message: string) => {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.className = 'sr-only';
  liveRegion.textContent = message;
  document.body.appendChild(liveRegion);
  
  setTimeout(() => liveRegion.remove(), 1000);
};

// Usage
onClick={() => {
  item.action();
  announce(`${item.label} executed`);
  closeMenu();
}}
```

---

## 11. Tradelia Design System Integration

### Visual Signature

```typescript
// Surface
className="bg-popover/95 backdrop-blur-xl border border-border/20"

// Shadow
className="shadow-xl"

// Border radius
className="rounded-xl" // 12px (--radius)

// Spacing
className="p-1" // 4px padding around items

// Items
className="rounded-lg px-3 py-2.5 min-h-11" // 44px touch target
```

### Motion Signature

```typescript
// Entrance
initial={{ opacity: 0, y: -8, scale: 0.96 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }} // Tradelia easing

// Hover
className="hover:bg-primary/10 transition-colors duration-150"
```

---

## 12. Implementation Checklist

### ARIA & Semantics
- ✅ `role="menu"` on container
- ✅ `role="menuitem"` on items
- ✅ `aria-haspopup="menu"` on trigger
- ✅ `aria-expanded` reflects state
- ✅ `aria-controls` links trigger to menu
- ✅ `aria-label` describes menu purpose
- ✅ `aria-disabled` on disabled items

### Keyboard Navigation
- ✅ Roving tabindex (single Tab stop)
- ✅ Arrow keys navigate items
- ✅ Home/End jump to first/last
- ✅ Enter/Space activate item
- ✅ Escape closes menu
- ✅ Tab trapped within menu (optional)

### Focus Management
- ✅ Focus moves to first item on open
- ✅ Focus restored to trigger on close
- ✅ Disabled items not focusable
- ✅ Focus visible (3:1 contrast)

### Positioning
- ✅ Auto-repositions on viewport overflow
- ✅ Repositioning < 16ms (1 frame)
- ✅ Minimum 8px margin from edges
- ✅ Prefers bottom-right, falls back intelligently

### Interaction
- ✅ Click outside closes menu
- ✅ Touch outside closes menu (mobile)
- ✅ Action execution closes menu
- ✅ Disabled items don't respond

### Visual
- ✅ Touch targets ≥ 44px
- ✅ Focus indicator 3:1 contrast
- ✅ Disabled items 0.5 opacity
- ✅ Animations respect prefers-reduced-motion
- ✅ Follows Tradelia design system

---

## 13. Testing Strategy

### Manual Testing
1. **Keyboard only** - Navigate entire menu without mouse
2. **Screen reader** - Test with NVDA (Windows) or VoiceOver (macOS)
3. **Touch device** - Test on actual mobile device
4. **Viewport overflow** - Test near all edges
5. **Reduced motion** - Enable OS setting, verify no animations

### Automated Testing
```typescript
describe('ContextMenu', () => {
  it('has correct ARIA attributes', () => {
    // Check role, aria-haspopup, aria-expanded, etc.
  });
  
  it('supports keyboard navigation', () => {
    // Simulate Arrow keys, Enter, Escape
  });
  
  it('repositions on viewport overflow', () => {
    // Mock getBoundingClientRect, verify position
  });
  
  it('closes on click outside', () => {
    // Simulate mousedown outside menu
  });
  
  it('restores focus on close', () => {
    // Verify focus returns to trigger
  });
});
```

---

## 14. Performance Considerations

### Optimization Techniques

1. **Lazy rendering** - Only render menu when open
2. **Portal rendering** - Render at document root to avoid z-index issues
3. **Memoization** - Memoize item components
4. **Debounce repositioning** - On window resize
5. **Virtual scrolling** - For menus with 50+ items (rare)

```typescript
// Portal rendering
import { createPortal } from 'react-dom';

return createPortal(
  <div className="context-menu">...</div>,
  document.body
);
```

---

## 15. Common Pitfalls

### ❌ Don't
- Use `role="menu"` for navigation menus (use `<nav>` instead)
- Forget to restore focus on close
- Allow Tab to leave menu (breaks roving tabindex)
- Use `pointer-events: none` on disabled items (breaks screen readers)
- Hardcode positions (always calculate dynamically)

### ✅ Do
- Use semantic HTML where possible
- Test with actual assistive technologies
- Respect user motion preferences
- Provide visual focus indicators
- Handle edge cases (viewport overflow, disabled items)

---

## References

1. **W3C ARIA Authoring Practices Guide** - Menu Pattern specification
2. **React Accessibility Best Practices** - Focus management and ARIA
3. **WCAG 2.2** - Target size and contrast requirements
4. **Roving Tabindex Pattern** - Keyboard navigation best practices
5. **Context Menu Auto-repositioning** - Viewport overflow handling

---

**Content was rephrased for compliance with licensing restrictions**

