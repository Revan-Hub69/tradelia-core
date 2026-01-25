# TAILWIND Z-INDEX - TIER-1 BEST PRACTICES 2026

**Data**: 25 Gennaio 2026  
**Status**: ✅ RESEARCH COMPLETE  
**Priority**: P2 - IMPORTANT  
**Source**: Smashing Magazine 2021 (still relevant 2026)

---

## 🔬 TIER-1 RESEARCH FINDINGS

### Source: Smashing Magazine - "Managing CSS Z-Index In Large Projects"
**Author**: Steven Frieson  
**URL**: https://www.smashingmagazine.com/2021/02/css-z-index-large-projects/

**Key Problems with Common Solutions**:
1. ❌ Magic numbers (why 1000? why 10 increments?)
2. ❌ Confusion about which value to use ("Is this a dropdown or popover?")
3. ❌ Insecurity about gaps (what if I need more than 9 values?)
4. ❌ No clear naming convention

**Recommended Solution**:
✅ **Semantic naming based on UI layers**
✅ **Small, predictable increments (10)**
✅ **Clear hierarchy**
✅ **No magic numbers**

---

## 📊 STANDARD Z-INDEX SCALE (2026)

Based on tier-1 research and modern UI patterns:

```typescript
zIndex: {
  // Base layer (default content)
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  
  // UI layers (semantic naming)
  auto: 'auto',
  base: '0',           // Default content
  dropdown: '1000',    // Dropdowns, select menus
  sticky: '1100',      // Sticky headers, floating elements
  fixed: '1200',       // Fixed position elements
  overlay: '1300',     // Modal backdrops
  modal: '1400',       // Modal dialogs
  popover: '1500',     // Popovers, tooltips
  toast: '1600',       // Toast notifications
}
```

---

## 🎯 TRADELIA SPECIFIC LAYERS

Based on current codebase analysis:

**Current Usage**:
- `z-60` → FloatingProgress component (should be `z-sticky` or `1100`)

**Recommended Mapping**:
```typescript
zIndex: {
  // Tailwind defaults (0-50)
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  
  // Tradelia semantic layers
  auto: 'auto',
  base: '0',
  dropdown: '1000',     // UserDropdown, NotificationsBell
  sticky: '1100',       // FloatingProgress, sticky headers
  fixed: '1200',        // Fixed navigation
  'modal-backdrop': '1300',  // Modal overlays
  modal: '1400',        // Modal content
  popover: '1500',      // Tooltips, popovers
  toast: '1600',        // Notifications
  'command-palette': '1700',  // Command palette (highest)
}
```

---

## 🔧 IMPLEMENTATION PLAN

### Step 1: Add to tailwind.config.ts
```typescript
extend: {
  zIndex: {
    // Tailwind defaults
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    
    // Semantic layers
    auto: 'auto',
    base: '0',
    dropdown: '1000',
    sticky: '1100',
    fixed: '1200',
    'modal-backdrop': '1300',
    modal: '1400',
    popover: '1500',
    toast: '1600',
    'command-palette': '1700',
  },
}
```

### Step 2: Replace Custom Values
```tsx
// BEFORE (BAD)
<div className="z-60 fixed ...">

// AFTER (GOOD)
<div className="z-sticky fixed ...">
```

---

## ✅ BENEFITS

### Clarity:
- ✅ Semantic names (z-dropdown, z-modal)
- ✅ No magic numbers
- ✅ Clear hierarchy

### Maintainability:
- ✅ Easy to add new layers
- ✅ Consistent across team
- ✅ Self-documenting

### Performance:
- ✅ No arbitrary values (better CSS optimization)
- ✅ Predictable stacking contexts

---

## 📖 REFERENCES

1. **Smashing Magazine**: "Managing CSS Z-Index In Large Projects" (2021)
2. **Tailwind CSS Docs**: Z-Index utilities
3. **Bootstrap**: Z-Index scale (reference, not recommended)

---

**Status**: ✅ RESEARCH COMPLETE - Ready for implementation
