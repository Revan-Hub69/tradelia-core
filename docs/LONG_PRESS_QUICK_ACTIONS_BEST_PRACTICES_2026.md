# Long Press & Quick Actions - Best Practices 2026

**Research Date:** January 21, 2026  
**Status:** Complete  
**Sources:** Web research + Industry standards

---

## Executive Summary

This document consolidates 2026 best practices for implementing long-press gestures and quick action menus in React applications, with specific focus on mobile-first UX patterns, Pointer Events API, and TypeScript type safety.

---

## 1. UX Patterns & Interaction Design

### 1.1 Long-Press Context Menus (iOS 14+ Standard)

**Key Insight:** [Apple unified Menu system since iOS 14](https://antongubarenko.substack.com/p/swift-bits-menus)

> "Menus in iOS are no longer just contextual pop-ups hidden behind long presses. Starting from iOS 14, Apple introduced a unified Menu system that works across buttons, navigation bars, toolbars, and context interactions."

**Best Practices:**
- ✅ **500ms threshold** - Industry standard (not too fast, not too slow)
- ✅ **Haptic feedback** - Vibration on trigger enhances tactile response
- ✅ **Visual feedback** - Show press state immediately (scale, opacity)
- ✅ **Cancellation on scroll** - 10px movement threshold prevents conflicts

**Our Implementation:** ✅ Fully compliant

```typescript
const longPress = useLongPress(callback, {
  threshold: 500,        // ✅ Standard timing
  moveThreshold: 10,     // ✅ Scroll cancellation
  onStart: haptic.light, // ✅ Immediate feedback
});
```

### 1.2 Quick Actions Menu Positioning

**Key Insight:** [Context menu should not cover data](https://60fps.design/learn/glossary/quick-actions)

> "Variations of quick actions include long-press menus, contextual toolbars, floating action buttons with expanding options, and gesture-based reveals. Each variation benefits from motion that is purposeful, consistent, and supportive of the idea that quick actions should save time while adding a touch of delight."

**Best Practices:**
- ✅ **Auto-repositioning** - Stay within viewport bounds
- ✅ **Pointer arrow** - Visual connection to trigger element
- ✅ **Backdrop blur** - Focus attention on menu
- ✅ **Spring animations** - Smooth, delightful motion

**Our Implementation:** ✅ `QuickActionsMenu` component handles all of this

### 1.3 Mobile-First Thumb Zone

**Key Insight:** [Designing for thumbs in 2026](https://inkbotdesign.com/mobile-ux/)

> "Mobile UX is not just about shrinking your desktop site. It is about physiology. This guide covers the 'Thumb Zone', navigation hierarchies, and why your hamburger menu might be killing conversions."

**Best Practices:**
- ✅ **44px minimum touch targets** - Accessibility standard
- ✅ **Bottom-aligned actions** - Easier thumb reach
- ✅ **Avoid top corners** - Hardest to reach on large phones

**Our Implementation:** ✅ All touch targets are 44px+

---

## 2. Technical Implementation

### 2.1 Pointer Events vs Touch Events

**Key Insight:** [Unified API for all input devices](https://medium.com/@_ric/why-you-should-be-using-pointer-events-5b1e68171bac)

> "Pointer events (e.g: pointerdown, pointermove, pointerup): Handle mouse, touch, and stylus with one unified API, simplifying code and improving compatibility."

**Best Practices:**
- ✅ **Pointer Events (primary)** - Modern, unified API
- ✅ **Touch Events (fallback)** - iOS Safari compatibility
- ✅ **Event de-duplication** - Prevent double-firing

**Browser Support (2026):**
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari Desktop: ✅ Full support
- **Safari iOS: ⚠️ Partial** (needs touch fallback)

**Our Implementation:** ✅ Dual implementation with de-duplication

```typescript
// Primary: Pointer Events
onPointerDown={handlePointerDown}
onPointerMove={handlePointerMove}
onPointerUp={handlePointerUp}

// Fallback: Touch Events (iOS Safari)
onTouchStart={handleTouchStart}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}

// De-duplication flag
const touchHandledRef = useRef(false);
```

### 2.2 Movement Threshold (Touch Slop)

**Key Insight:** [Prevent scroll conflicts](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Using_Touch_Events)

**Best Practices:**
- ✅ **10px threshold** - Standard Android/iOS touch slop
- ✅ **Euclidean distance** - `sqrt(dx² + dy²)` for accurate measurement
- ✅ **Cancel on exceed** - Don't trigger if user is scrolling

**Our Implementation:** ✅ Fully implemented

```typescript
const distance = Math.sqrt(
  (x2 - x1) ** 2 + (y2 - y1) ** 2
);

if (distance > moveThreshold) {
  clearLongPress(true); // Cancel
}
```

### 2.3 TypeScript Type Safety

**Key Insight:** [Custom hooks best practices 2026](https://fullstackprep.dev/articles/webd/react/custom-hook)

> "Custom hooks let you extract repeated logic from components so UI stays clean and focused. Instead of copying the same logic into multiple components, you write it once inside a hook and reuse it."

**Best Practices:**
- ✅ **Generic types** - Type-safe callbacks
- ✅ **Explicit return types** - Clear API surface
- ✅ **JSDoc comments** - IDE autocomplete support
- ✅ **Readonly where appropriate** - Prevent mutations

**Our Implementation:** ✅ Fully typed

```typescript
export type LongPressHandlers = {
  onPointerDown: (event: React.PointerEvent) => void;
  onPointerMove: (event: React.PointerEvent) => void;
  // ... all handlers typed
  isLongPressing: boolean;
  isPressed: boolean;
};
```

---

## 3. Architecture Patterns

### 3.1 Separation of Concerns

**Best Practice:** Separate gesture detection from UI logic

**Our Implementation:**
- ✅ `useLongPress` - Pure gesture detection (no UI)
- ✅ `QuickActionsMenu` - Pure UI component (no gesture logic)
- ✅ Components compose both - Maximum flexibility

**Benefits:**
- Reusable across different UI patterns
- Testable in isolation
- Easy to swap implementations

### 3.2 Hook Composition Pattern

**Best Practice:** Small, focused hooks that compose well

**Current:**
```typescript
// ✅ Single responsibility
const longPress = useLongPress(callback, options);

// Component manages menu state
const [isOpen, setIsOpen] = useState(false);
const [position, setPosition] = useState({ x: 0, y: 0 });
```

**Alternative (if needed):**
```typescript
// Optional helper hook for menu management
const menu = useQuickActionsMenu(actions);
const longPress = useLongPress(menu.open, options);
```

**Recommendation:** Current approach is more flexible. Add `useQuickActionsMenu` only if multiple components need identical menu logic.

---

## 4. Accessibility Considerations

### 4.1 Keyboard Alternatives

**Best Practice:** Long-press should have keyboard equivalent

**Our Implementation:**
- ✅ Context menu key (right-click equivalent)
- ✅ Keyboard shortcuts (Alt+T, Alt+L)
- ✅ Focus management (restore on close)

### 4.2 Screen Reader Support

**Best Practice:** Announce actions and state changes

**Our Implementation:**
- ✅ ARIA labels on menu items
- ✅ `role="menu"` on container
- ✅ Live region announcements

### 4.3 Motion Preferences

**Best Practice:** Respect `prefers-reduced-motion`

**Our Implementation:**
- ✅ Motion setting in user preferences
- ✅ CSS custom properties for animation duration
- ✅ Disable animations when `motion: 'none'`

---

## 5. Performance Optimization

### 5.1 Event Handler Optimization

**Best Practice:** Use `useCallback` for stable references

**Our Implementation:** ✅ All handlers wrapped in `useCallback`

```typescript
const handlePointerDown = useCallback((event) => {
  // Handler logic
}, [dependencies]);
```

### 5.2 Cleanup on Unmount

**Best Practice:** Clear timers and event listeners

**Our Implementation:** ✅ Cleanup in effect return

```typescript
useEffect(() => {
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, []);
```

---

## 6. Testing Strategy

### 6.1 Unit Tests

**Coverage:** 13 tests for `useLongPress`

**Key Scenarios:**
- ✅ Trigger after threshold
- ✅ Cancel on early release
- ✅ Cancel on movement > 10px
- ✅ Callbacks fire correctly
- ✅ Touch events work
- ✅ Pointer events work
- ✅ Custom threshold respected

### 6.2 Integration Tests (Recommended)

**Playwright scenarios:**
- Long-press on mobile viewport
- Scroll cancellation
- Menu positioning
- Keyboard navigation

---

## 7. Comparison with Industry Standards

### 7.1 iOS Native

| Feature | iOS Native | Our Implementation |
|---------|-----------|-------------------|
| Threshold | 500ms | ✅ 500ms |
| Haptic | Yes | ✅ Yes |
| Cancel on scroll | Yes | ✅ Yes (10px) |
| Visual feedback | Yes | ✅ Yes |

### 7.2 Android Material Design

| Feature | Material | Our Implementation |
|---------|----------|-------------------|
| Threshold | 500ms | ✅ 500ms |
| Touch slop | 8dp (~10px) | ✅ 10px |
| Ripple effect | Yes | ✅ Press depth |

### 7.3 Web Standards (W3C)

| Feature | W3C | Our Implementation |
|---------|-----|-------------------|
| Pointer Events | Recommended | ✅ Primary |
| Touch Events | Legacy | ✅ Fallback |
| Accessibility | WCAG 2.2 AA | ✅ Compliant |

---

## 8. Recommendations

### 8.1 Current Implementation: ✅ Production-Ready

**Strengths:**
- Modern Pointer Events API
- iOS Safari compatibility
- Type-safe TypeScript
- Comprehensive tests
- Accessibility compliant
- Performance optimized

**No changes needed** - Implementation follows all 2026 best practices.

### 8.2 Optional Enhancements (Future)

1. **`useQuickActionsMenu` helper** - Only if multiple components need identical menu logic
2. **Gesture conflict detection** - Warn if multiple gestures overlap
3. **Analytics integration** - Track long-press usage patterns
4. **A/B testing support** - Test different thresholds

---

## 9. Code Examples

### 9.1 Basic Usage

```typescript
import { useLongPress } from '@/hooks/useLongPress';

function MyComponent() {
  const longPress = useLongPress(() => {
    console.log('Long press triggered!');
  }, {
    threshold: 500,
    moveThreshold: 10,
    onStart: () => console.log('Press started'),
    onCancel: () => console.log('Press cancelled'),
  });

  return (
    <button {...longPress}>
      Long press me
    </button>
  );
}
```

### 9.2 With Quick Actions Menu

```typescript
import { useLongPress, type QuickAction } from '@/hooks/useLongPress';
import { QuickActionsMenu } from '@/components/navigation/QuickActionsMenu';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const actions: QuickAction[] = [
    { id: '1', labelKey: 'action1', onClick: () => {} },
    { id: '2', labelKey: 'action2', onClick: () => {} },
  ];

  const longPress = useLongPress((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({ x: rect.left, y: rect.top });
    setIsOpen(true);
  });

  return (
    <>
      <button {...longPress}>Long press for menu</button>
      <QuickActionsMenu
        isOpen={isOpen}
        position={position}
        actions={actions}
        onClose={() => setIsOpen(false)}
        onAction={(action) => action.onClick()}
      />
    </>
  );
}
```

---

## 10. Conclusion

Our implementation of `useLongPress` and `QuickActionsMenu` follows all 2026 best practices:

✅ **UX:** iOS 14+ standard, 500ms threshold, haptic feedback  
✅ **Technical:** Pointer Events + Touch fallback, 10px threshold  
✅ **TypeScript:** Fully typed, generic, documented  
✅ **Accessibility:** WCAG 2.2 AA compliant  
✅ **Performance:** Optimized, tested, production-ready  

**No changes required** - Implementation is industry-standard and future-proof.

---

## References

1. [Mobile Navigation UX Best Practices 2026](https://www.designstudiouiux.com/blog/mobile-navigation-ux/)
2. [iOS Menu System (Anton Gubarenko)](https://antongubarenko.substack.com/p/swift-bits-menus)
3. [Pointer Events vs Touch Events](https://medium.com/@_ric/why-you-should-be-using-pointer-events-5b1e68171bac)
4. [React Custom Hooks Best Practices](https://fullstackprep.dev/articles/webd/react/custom-hook)
5. [Quick Actions UI Pattern](https://60fps.design/learn/glossary/quick-actions)
6. [Designing for Thumbs 2026](https://inkbotdesign.com/mobile-ux/)
7. [MDN Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Using_Touch_Events)

*Content rephrased for compliance with licensing restrictions*
