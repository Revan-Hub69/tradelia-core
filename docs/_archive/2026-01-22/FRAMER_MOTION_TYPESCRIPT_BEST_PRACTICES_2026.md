# Framer Motion + TypeScript Best Practices 2026

**Date:** 2026-01-21  
**Status:** ✅ Research Complete  
**Priority:** P0 - Critical for Icon Development

---

## 🚨 PROBLEMA RISOLTO: TypeScript Ease Property

### Issue
TypeScript strict typing in Framer Motion causes errors when using `ease` property with certain transition configurations:

```typescript
// ❌ ERRORE: Type 'number[]' is not assignable to type 'Easing'
transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}

// ❌ ERRORE: Type 'string' is not assignable to type 'Easing'
transition={{ duration: 0.3, ease: 'easeInOut' }}
```

### Root Cause
Framer Motion has strict TypeScript typing for the `Easing` type. When used in certain transition contexts (especially with `repeat`, `repeatType`, or complex animation configurations), TypeScript cannot properly infer the type.

**Source:** [StackOverflow - Framer Motion Type Error](https://stackoverflow.com/questions/70232430/framer-motion-type-string-is-not-assignable-to-type-easing-ts232)

---

## ✅ SOLUZIONE: Simplified Transition Pattern

### Pattern 1: Omit Ease Property (Recommended)
```typescript
// ✅ CORRETTO: Let Framer Motion use default easing
const transition = {
  duration: 0.3,
  // No ease property - uses default smooth easing
};
```

### Pattern 2: Use String Ease Values (Alternative)
```typescript
// ✅ CORRETTO: Use predefined string values
const transition = {
  duration: 0.3,
  ease: 'easeInOut' as const, // Type assertion
};

// Valid string values:
// "linear" | "easeIn" | "easeOut" | "easeInOut" | 
// "circIn" | "circOut" | "circInOut" |
// "backIn" | "backOut" | "backInOut" | "anticipate"
```

### Pattern 3: Separate Ease for Different Properties
```typescript
// ✅ CORRETTO: Specify ease per property
const transition = {
  rotate: { duration: 0.3, ease: 'easeInOut' },
  scale: { duration: 0.2, ease: 'easeOut' },
};
```

---

## 🎯 TRADELIA ICON PATTERN (2026)

### Complete Icon Template

```typescript
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type MyIconProps = IconBaseProps & {
  isActive?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const MyIcon: React.FC<MyIconProps> = ({
  isActive = false,
  motionPreference,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const effectiveMotion = motionPreference || (prefersReducedMotion ? 'reduced' : 'full');

  // Variants for different motion levels
  const getVariants = () => {
    if (effectiveMotion === 'none') {
      return {
        initial: { rotate: 0, scale: 1 },
        animate: { rotate: 0, scale: 1 },
        hover: { rotate: 0, scale: 1 },
      };
    }
    if (effectiveMotion === 'reduced') {
      return {
        initial: { rotate: 0, scale: 1 },
        animate: { rotate: isActive ? 180 : 0, scale: 1 },
        hover: { scale: 1.05 },
      };
    }
    return {
      initial: { rotate: 0, scale: 1 },
      animate: { rotate: isActive ? 180 : 0, scale: 1 },
      hover: { scale: 1.1, rotate: isActive ? 195 : 15 },
    };
  };

  const variants = getVariants();
  
  // ✅ SIMPLIFIED TRANSITION: No ease property
  const transition = 
    effectiveMotion === 'none' 
      ? { duration: 0 } 
      : effectiveMotion === 'reduced' 
        ? { duration: 0.15 } 
        : { duration: 0.3 }; // No ease!

  return (
    <IconBase {...props}>
      <motion.g
        animate="animate"
        initial="initial"
        transition={transition}
        variants={variants}
        whileHover="hover"
        style={{ transformOrigin: 'center' }}
      >
        {/* SVG paths here */}
        <path d="M..." />
      </motion.g>
    </IconBase>
  );
};
```

---

## 🎨 ANIMATION PATTERNS

### 1. Rotation Animation
```typescript
// Simple rotation
animate: { rotate: isActive ? 180 : 0 }

// Continuous rotation
animate: { rotate: 360 }
transition: { duration: 20, repeat: Infinity }
```

### 2. Scale Animation
```typescript
// Hover scale
hover: { scale: 1.1 }

// Pulse effect
animate: { scale: [1, 1.1, 1] }
transition: { duration: 2, repeat: Infinity }
```

### 3. Opacity Animation
```typescript
// Fade in/out
animate: { opacity: [1, 0.8, 1] }
transition: { duration: 3, repeat: Infinity }
```

### 4. Complex Multi-Property
```typescript
// Different timing per property
transition: {
  rotate: { duration: 0.3 },
  scale: { duration: 0.2 },
  opacity: { duration: 0.15 },
}
```

### 5. Staggered Children
```typescript
// Parent
transition: { staggerChildren: 0.1 }

// Children
transition: { duration: 0.5 }
```

---

## 🚀 PERFORMANCE OPTIMIZATION

### GPU-Accelerated Properties
```typescript
// ✅ FAST: Use these properties
- transform (rotate, scale, translate)
- opacity
- filter (with caution)

// ❌ SLOW: Avoid these
- width, height
- top, left, right, bottom
- margin, padding
```

### Will-Change Optimization
```typescript
<motion.g
  style={{
    transformOrigin: 'center',
    willChange: 'transform', // Hint to browser
  }}
>
```

### 3D Transform Optimization
```typescript
<motion.g
  style={{
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden', // Smoother 3D
  }}
>
```

---

## ♿ ACCESSIBILITY

### Motion Preferences
```typescript
// Automatic detection
const prefersReducedMotion = useReducedMotion();

// Manual override
<MyIcon motionPreference="reduced" />

// Three levels:
// - "full": All signature animations
// - "reduced": Essential animations only (scale, fade)
// - "none": No animations (instant state changes)
```

### ARIA Labels
```typescript
<IconBase
  aria-label="Notifications"
  aria-hidden={false} // Make visible to screen readers
>
```

---

## 📋 CHECKLIST PER OGNI ICONA

### TypeScript
- [ ] No TypeScript errors
- [ ] Proper type exports
- [ ] Props interface extends IconBaseProps
- [ ] Import sorting correct (framer-motion before react)

### Animation
- [ ] Three motion levels (full/reduced/none)
- [ ] Variants pattern used
- [ ] Transition without ease property
- [ ] transformOrigin set correctly
- [ ] GPU-accelerated properties only

### Accessibility
- [ ] useReducedMotion() hook used
- [ ] motionPreference prop supported
- [ ] ARIA labels when needed
- [ ] Keyboard navigation friendly

### Performance
- [ ] willChange: transform
- [ ] No layout thrashing
- [ ] Smooth 60fps animations
- [ ] No memory leaks

### Design
- [ ] Follows Tradelia signature style
- [ ] Premium effects (glow, sparkles, etc.)
- [ ] Consistent with other icons
- [ ] Proper hover states

---

## 🔗 REFERENCES

- [Framer Motion Docs](https://www.framer.com/motion/)
- [StackOverflow - Easing Type Error](https://stackoverflow.com/questions/70232430/)
- [Cubic Bezier Curves](https://blog.maximeheckel.com/posts/cubic-bezier-from-math-to-motion/)
- [Motion Best Practices](https://motion.dev/blog/do-you-still-need-framer-motion)
- [SIGNATURE_ICONS_RESTORATION_2026.md](./SIGNATURE_ICONS_RESTORATION_2026.md)
- [SVG_ICONS_BEST_PRACTICES_2026.md](./SVG_ICONS_BEST_PRACTICES_2026.md)

---

## ✅ CONCLUSIONE

**Pattern Definitivo per Tradelia Icons 2026:**

1. ✅ **NO ease property** in transition objects
2. ✅ **Variants pattern** for different states
3. ✅ **Three motion levels** (full/reduced/none)
4. ✅ **GPU-accelerated** properties only
5. ✅ **Accessibility first** with useReducedMotion()
6. ✅ **TypeScript strict** mode compatible

Questo pattern è stato testato e funziona perfettamente con TypeScript strict mode e Framer Motion latest version.

---

*Documento creato: 2026-01-21*  
*Status: ✅ COMPLETE*  
*Next: Create remaining 29 icons using this pattern*
