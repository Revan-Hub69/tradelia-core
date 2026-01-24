# CSS HOVER PERFORMANCE AUDIT 2026

**Date**: 2026-01-23  
**Focus**: Hover states causing layout shifts and slow transitions  
**Status**: 🔴 CRITICAL ISSUES FOUND

---

## 🚨 CRITICAL ISSUES

### 1. BORDER CHANGES ON HOVER = LAYOUT SHIFT

**Problem**: Changing `border` on hover causes layout reflow

#### ❌ BAD - Landing CSS
```css
.card-interactive:hover {
  @apply border-primary/50 shadow-lg;
}
```

**Issue**: 
- Changes border COLOR on hover
- If border wasn't there before → adds 1px → layout shift
- Causes reflow + repaint

#### ❌ BAD - Dashboard CSS
```css
.card-interactive:hover {
  @apply border-primary/50 shadow-lg;
}
```

**Same issue**: Duplicate class, same problem

---

### 2. BACKDROP-FILTER ON HOVER = GPU KILLER

**Problem**: Changing `backdrop-filter` on hover is EXPENSIVE

#### ❌ BAD - Signature Icons
```css
.signature-icon--signature:hover {
  filter: var(--signature-glass-medium);
  backdrop-filter: blur(6px); /* Enhanced from 4px */
}

.signature-icon--premium:hover {
  filter: var(--signature-glass-medium);
  backdrop-filter: blur(8px);
}
```

**Issue**:
- `backdrop-filter` changes trigger GPU recalculation
- Blur radius change = expensive operation
- NOT compositor-only property
- Causes jank on 60fps devices

---

### 3. FILTER CHANGES ON HOVER = SLOW

**Problem**: Changing `filter` on hover is NOT compositor-only

#### ❌ BAD - Signature Icons
```css
.signature-icon--signature:hover {
  filter: var(--signature-glass-medium);
  backdrop-filter: blur(6px);
}
```

**Issue**:
- `filter` is NOT compositor-only
- Triggers repaint on every hover
- Especially bad with `drop-shadow()`

---

### 4. OPACITY CHANGES = ACCEPTABLE BUT OVERUSED

#### ⚠️ ACCEPTABLE - Educational Hover
```css
.educational-hover:hover {
  transform: translateY(var(--lift-educational)) scale(var(--scale-educational-hover));
  opacity: 0.9;
}
```

**Issue**:
- `opacity` IS compositor-only ✅
- BUT combined with `transform` = double work
- Overused across codebase

---

## 📊 PERFORMANCE ANALYSIS

### Compositor-Only Properties (FAST ✅)
- `transform`
- `opacity`

### Layout-Triggering Properties (SLOW ❌)
- `border` (changes)
- `width` / `height`
- `padding` / `margin`

### Paint-Triggering Properties (MEDIUM ⚠️)
- `filter`
- `backdrop-filter`
- `box-shadow` (sometimes)
- `background-color`

---

## 🔍 FOUND ISSUES BY FILE

### `landing.css`
```css
/* ❌ LAYOUT SHIFT */
.card-interactive:hover {
  @apply border-primary/50 shadow-lg;
}

/* ✅ OK - Transform only */
.hover-lift:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* ✅ OK - Transform only */
.hover-lift-subtle:hover {
  transform: translate3d(0, -0.5px, 0);
  box-shadow: 0 2px 12px rgba(var(--primary-rgb), 0.15);
}

/* ✅ OK - Transform only */
.hover-scale:hover {
  transform: translate3d(0, 0, 0) scale(1.01);
}

/* ⚠️ MEDIUM - Transform + shadow + background */
.hover-glow:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.25);
  background-color: rgba(var(--primary-rgb), 0.05);
}
```

---

### `dashboard.css`
```css
/* ✅ OK - Transform only */
.hover-lift:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* ✅ OK - Transform only */
.nav-item-hover:hover {
  transform: translate3d(0, -1px, 0) scale(1.01);
  box-shadow: 0 4px 16px rgba(var(--primary-rgb), 0.2);
  background-color: rgba(var(--primary-rgb), 0.08);
}

/* ❌ LAYOUT SHIFT */
.card-interactive:hover {
  @apply border-primary/50 shadow-lg;
}
```

---

### `glass-effects-tokens.css`
```css
/* ✅ OK - Transform only */
.header-icon:hover {
  transform: translateY(-1px) scale(1.01);
  opacity: var(--icon-primary-opacity);
}

/* ⚠️ MEDIUM - Background change */
.glass-button:hover {
  background-color: var(--glass-button-hover);
}

/* ✅ OK - Transform only */
.glass-toggle:hover {
  box-shadow: var(--toggle-glass-hover-shadow);
  transform: translateY(-1px) scale(1.01);
}

/* ✅ OK - Transform only */
.avatar-liquid-glass-2026:hover {
  transform: translateZ(0) scale(1.01);
  box-shadow: var(--avatar-glass-hover-shadow);
}
```

---

### `premium-icons.css`
```css
/* ✅ OK - Opacity only */
.signature-icon--minimal:hover {
  opacity: 1;
}

/* ❌ GPU KILLER - Filter + backdrop-filter */
.signature-icon--signature:hover {
  filter: var(--signature-glass-medium);
  backdrop-filter: blur(6px);
  transform: scale(1.01);
}

/* ❌ GPU KILLER - Filter + backdrop-filter */
.signature-icon--premium:hover {
  filter: var(--signature-glass-medium);
  backdrop-filter: blur(8px);
}

/* ⚠️ MEDIUM - will-change on hover */
.signature-icon:hover {
  will-change: transform, filter, backdrop-filter;
}
```

---

### `premium-spring-physics.css`
```css
/* ⚠️ MEDIUM - Transform + opacity */
.educational-hover:hover {
  transform: translateY(var(--lift-educational)) scale(var(--scale-educational-hover));
  opacity: 0.9;
  border-color: rgba(59, 130, 246, 0.2);
}

/* ✅ OK - Transform only */
.avatar-educational:hover {
  transform: scale(var(--scale-educational-focus));
}
```

---

### `performance-optimizations.css`
```css
/* ✅ OK - Transform only */
.signature-hover-optimized:hover {
  transform: translate3d(0, -2px, 0) scale(1.01);
  box-shadow: 0 8px 25px rgba(var(--primary-rgb), 0.15);
}
```

---

### `motion-tokens.css`
```css
/* ✅ OK - Transform only */
.hover-anticipation:hover {
  transform: scale(1.01) translateY(-1px);
  transition-delay: 0ms;
}
```

---

## 🎯 RECOMMENDATIONS

### 1. FIX BORDER LAYOUT SHIFTS

#### ❌ BEFORE
```css
.card-interactive:hover {
  @apply border-primary/50 shadow-lg;
}
```

#### ✅ AFTER
```css
.card-interactive {
  border: 1px solid transparent; /* Always present */
  transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
}

.card-interactive:hover {
  border-color: hsl(var(--primary) / 0.5);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

**Why**: Border always exists, only COLOR changes = no layout shift

---

### 2. REMOVE BACKDROP-FILTER CHANGES

#### ❌ BEFORE
```css
.signature-icon--signature:hover {
  filter: var(--signature-glass-medium);
  backdrop-filter: blur(6px);
  transform: scale(1.01);
}
```

#### ✅ AFTER
```css
.signature-icon--signature {
  backdrop-filter: blur(6px); /* Always on */
  transition: transform 200ms ease-out, opacity 200ms ease-out;
}

.signature-icon--signature:hover {
  transform: scale(1.01);
  opacity: 0.9;
}
```

**Why**: 
- `backdrop-filter` stays constant = no GPU recalc
- Only `transform` + `opacity` change = compositor-only

---

### 3. REMOVE FILTER CHANGES

#### ❌ BEFORE
```css
.signature-icon--signature:hover {
  filter: var(--signature-glass-medium);
}
```

#### ✅ AFTER
```css
.signature-icon--signature {
  filter: var(--signature-glass-medium); /* Always on */
  transition: transform 200ms ease-out;
}

.signature-icon--signature:hover {
  transform: scale(1.01);
}
```

**Why**: `filter` stays constant = no repaint

---

### 4. OPTIMIZE WILL-CHANGE USAGE

#### ❌ BEFORE
```css
.signature-icon:hover {
  will-change: transform, filter, backdrop-filter;
}
```

#### ✅ AFTER
```css
.signature-icon {
  will-change: transform; /* Only compositor-only property */
}

.signature-icon:not(:hover):not(:focus):not(:active) {
  will-change: auto; /* Cleanup */
}
```

**Why**: 
- `will-change` should only include compositor-only properties
- Cleanup when not needed = memory efficient

---

## 📈 EXPECTED IMPROVEMENTS

### Before
- Border changes: **Layout shift** (worst)
- Backdrop-filter changes: **GPU recalc** (bad)
- Filter changes: **Repaint** (bad)
- Multiple properties: **Compound jank**

### After
- Transform only: **Compositor-only** (best)
- Opacity only: **Compositor-only** (best)
- No layout shifts: **Smooth 60fps**
- Reduced GPU load: **Battery friendly**

---

## 🔧 IMPLEMENTATION PRIORITY

### P0 - CRITICAL (Fix immediately)
1. ❌ `.card-interactive:hover` border changes (2 files)
2. ❌ `.signature-icon--signature:hover` backdrop-filter changes
3. ❌ `.signature-icon--premium:hover` backdrop-filter changes

### P1 - HIGH (Fix soon)
4. ⚠️ `.hover-glow:hover` background-color changes
5. ⚠️ `.educational-hover:hover` opacity + transform
6. ⚠️ `.glass-button:hover` background-color changes

### P2 - MEDIUM (Optimize later)
7. 🔄 Cleanup `will-change` usage across all files
8. 🔄 Consolidate duplicate `.card-interactive` classes
9. 🔄 Remove unused hover classes

---

## 🎬 NEXT STEPS

1. **Fix P0 issues** (border + backdrop-filter)
2. **Test on 60fps device** (verify no jank)
3. **Measure with Chrome DevTools** (Performance tab)
4. **Verify with Lighthouse** (Performance score)

---

**Audit Complete**: 2026-01-23  
**Critical Issues**: 5  
**High Priority**: 3  
**Medium Priority**: 3
