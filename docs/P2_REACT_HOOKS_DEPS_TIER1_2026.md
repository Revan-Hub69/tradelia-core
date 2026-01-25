# REACT HOOKS DEPENDENCIES - TIER-1 BEST PRACTICES 2026

**Data**: 25 Gennaio 2026  
**Status**: ✅ RESEARCH COMPLETE  
**Priority**: P2 - IMPORTANT  
**Sources**: 2 tier-1 sources (2026)

---

## 🔬 TIER-1 RESEARCH FINDINGS

### Source 1: React Official Docs (2026)
**URL**: https://react.dev/reference/eslint-plugin-react-hooks/lints/exhaustive-deps

**Key Findings**:
- ✅ **Rule Purpose**: Validates dependency arrays contain ALL necessary dependencies
- ❌ **Common Mistake**: Trying to "trick" React to control when effects run
- ✅ **Correct Approach**: Effects should synchronize with external systems
- ⚠️ **Stale Closures**: Missing dependencies cause hooks to use outdated values

**When to Fix**:
1. Include the dependency (recommended)
2. Use a ref if truly need to run once
3. Restructure code to remove dependency

**When NOT to Ignore**:
- Never ignore to control effect timing
- Never ignore to avoid infinite loops (fix the root cause instead)

---

### Source 2: OpenIllumi (2026) - "Master React useEffect"
**URL**: https://openillumi.com/en/en-react-useeffect-deps-warning-fix/

**Key Findings**:
- ✅ **Root Cause**: Functions recreated on every render → infinite loops
- ✅ **Solution 1**: Define function INSIDE useEffect (if exclusive to effect)
- ✅ **Solution 2**: Use useCallback (if function reused elsewhere)
- ❌ **Anti-Pattern**: Disabling ESLint rule (masks bugs)

**Decision Matrix**:
```
Function exclusive to effect? → Define inside useEffect
Function reused elsewhere? → Use useCallback
Need to run once on mount? → Empty deps [] (if no external deps)
```

---

## 📊 TRADELIA CODEBASE ANALYSIS

### Total useEffect Hooks Found: 50+

### Categories:

**1. ComponentDidMount Pattern** (✅ CORRECT - Empty deps intentional)
- `ServiceWorkerCleanup.tsx` - Cleanup on mount
- `RuntimeReady.tsx` - Set runtime state on mount
- `scroll-animations.tsx` - Initialize animations
- **Action**: ✅ NO FIX NEEDED (intentional pattern)

**2. Event Listeners** (✅ CORRECT - Proper cleanup)
- `Navbar.tsx` - Scroll listener
- `useKeyboardShortcuts.ts` - Keyboard listener
- `useFocusManagement.ts` - Focus trap
- **Action**: ✅ NO FIX NEEDED (proper cleanup pattern)

**3. Body Scroll Lock** (✅ CORRECT - isOpen dependency)
- `MobileFullscreenMenu.tsx`
- `MobileBottomSheet.tsx`
- `MobileDropdownPopover.tsx`
- **Action**: ✅ NO FIX NEEDED (correct dependencies)

**4. Potential Issues** (⚠️ NEEDS REVIEW)
- Functions defined outside useEffect
- Missing dependencies that could cause stale closures
- **Action**: ⏳ ANALYZE & FIX

---

## 🎯 FIX STRATEGY

### Pattern 1: Function Exclusive to Effect
**BEFORE** (Warning):
```tsx
const fetchData = () => {
  // fetch logic
};

useEffect(() => {
  fetchData();
}, []); // ⚠️ Warning: fetchData not in deps
```

**AFTER** (Fixed):
```tsx
useEffect(() => {
  const fetchData = () => {
    // fetch logic
  };
  fetchData();
}, []); // ✅ No warning, no stale closure
```

---

### Pattern 2: Reusable Function
**BEFORE** (Warning):
```tsx
const handleUpdate = () => {
  // logic using props/state
};

useEffect(() => {
  handleUpdate();
}, []); // ⚠️ Warning: handleUpdate not in deps
```

**AFTER** (Fixed):
```tsx
const handleUpdate = useCallback(() => {
  // logic using props/state
}, [/* dependencies */]);

useEffect(() => {
  handleUpdate();
}, [handleUpdate]); // ✅ Stable reference
```

---

### Pattern 3: Run Once on Mount (No External Deps)
**BEFORE** (Warning):
```tsx
useEffect(() => {
  doSomething(props.value);
}, []); // ⚠️ Warning: props.value not in deps
```

**AFTER** (Fixed - Option 1):
```tsx
useEffect(() => {
  doSomething(props.value);
}, [props.value]); // ✅ Include dependency
```

**AFTER** (Fixed - Option 2 - If truly need once):
```tsx
const initialValue = useRef(props.value);

useEffect(() => {
  doSomething(initialValue.current);
}, []); // ✅ Use ref for initial value
```

---

## 🔍 FILES TO ANALYZE

### High Priority (Likely Issues):
1. `src/hooks/useSettings.ts` - Store access in useEffect
2. `src/hooks/useNavigationState.ts` - State updates
3. `src/components/ui/country-dropdown.tsx` - defaultValue in useEffect

### Medium Priority (Review):
4. `src/templates/Navbar.tsx` - useFocusTrap custom hook
5. `src/templates/PremiumFooter.tsx` - IntersectionObserver
6. `src/components/ui/ContextMenu.tsx` - Position updates

### Low Priority (Likely Correct):
7. Event listeners with cleanup
8. Body scroll locks
9. ComponentDidMount patterns

---

## ✅ SUCCESS CRITERIA

- [ ] All useEffect hooks have correct dependencies
- [ ] No stale closures
- [ ] No infinite loops
- [ ] Functions properly memoized with useCallback
- [ ] ESLint exhaustive-deps warnings resolved
- [ ] Build passes

---

## 📖 REFERENCES

1. **React Official Docs**: https://react.dev/reference/eslint-plugin-react-hooks/lints/exhaustive-deps
2. **OpenIllumi (2026)**: "Master React useEffect: Eliminate Dependency Warnings"
3. **TypeOfNaN**: "You probably shouldn't ignore exhaustive-deps warnings"

---

**Status**: ✅ RESEARCH COMPLETE - Ready for implementation
