# Zustand Store Best Practices 2026

**Research Date:** January 21, 2026  
**Status:** Complete  
**Task:** P1.T5 - Settings Store (Zustand)  
**Sources:** Official Zustand docs, yuan.fyi, oneuptime.com, Frontend Masters

---

## Executive Summary

This document consolidates 2026 best practices for implementing Zustand stores with TypeScript, focusing on optimistic updates, localStorage persistence, computed selectors, and performance optimization.

---

## 1. Store Organization

### 1.1 Separate Stores by Domain

**Best Practice:** Create separate stores for different feature domains

**Source:** [yuan.fyi - Zustand Best Practices](https://yuan.fyi/blog/best-practices-to-use-zustand-to-manage-state-in-react-application)

> "Modularize State: Split your Zustand store into separate files or modules for better organization and maintainability, especially for large applications. Use Multiple Stores: Consider using multiple smaller stores for distinct features or domains to avoid a single, monolithic store."

**Our Implementation:** ✅ Single settings store (appropriate for this domain)

```typescript
// Good: Domain-specific store
// src/stores/settingsStore.ts
export const useSettingsStore = create<SettingsStoreState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  // ... settings-specific state and actions
}));

// Bad: Monolithic store with everything
export const useAppStore = create((set) => ({
  settings: {},
  user: {},
  cart: {},
  // ... too many concerns
}));
```

### 1.2 TypeScript Integration

**Best Practice:** Define strong types for all state and actions

**Source:** [yuan.fyi - TypeScript Integration](https://yuan.fyi/blog/best-practices-to-use-zustand-to-manage-state-in-react-application)

> "Define Strong Types for Store State and Actions"

**Our Implementation:** ✅ Fully typed store

```typescript
export type SettingsStoreState = {
  // Core state
  settings: UserSettingsV1;
  saveStatus: SaveStatus;
  retryCount: number;
  systemPolicy?: SystemPolicy;
  systemPreferences?: SystemPreferences;

  // Actions
  loadSettings: () => Promise<void>;
  updateSetting: <T>(path: SettingsPath, value: T) => void;
  saveSettings: () => Promise<void>;
  resetSettings: () => void;

  // Computed selectors
  isLocked: (key: SettingsPath) => { locked: boolean; mode?: 'enforced' | 'managed' };
  resolvedValue: <T>(key: SettingsPath) => T;
};
```

---

## 2. Optimistic Updates

### 2.1 Immediate UI Feedback

**Best Practice:** Update UI immediately, then sync with server

**Source:** [oneuptime.com - Optimistic Updates](https://oneuptime.com/blog/post/2026-01-15-react-optimistic-updates-react-query/view)

> "Modern web applications need to feel instant. Users expect immediate feedback when they click buttons, submit forms, or interact with data. Optimistic updates are a technique where the UI updates immediately before the server confirms the change, creating the perception of instant responsiveness."

**Pattern:**
1. Update local state immediately
2. Update localStorage immediately
3. Debounce database sync (500ms)
4. Handle errors gracefully (rollback if needed)

**Our Implementation:** ✅ Optimistic updates with localStorage

```typescript
updateSetting: <T>(path: SettingsPath, value: T) => {
  const { settings } = get();

  // 1. Update state immediately (optimistic)
  const updated = setNestedValue(settings, path, value) as UserSettingsV1;
  set({ settings: updated, saveStatus: 'saving' });

  // 2. Persist to localStorage immediately (offline-first)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('[SettingsStore] Failed to save to localStorage:', error);
  }

  // 3. Database sync handled by useSettings hook (P1.T6) with debounce
},
```

### 2.2 Error Handling

**Best Practice:** Graceful rollback on failure

**Source:** [leapcell.io - useOptimistic](https://www.leapcell.io/blog/building-highly-responsive-uis-with-useoptimistic)

> "Instead of waiting for the server, we optimistically update the UI immediately, assuming the operation will succeed. If it fails, we gracefully revert the change. This approach dramatically enhances responsiveness and user satisfaction."

**Our Implementation:** ✅ Error status tracking

```typescript
saveSettings: async () => {
  set({ saveStatus: 'saving' });

  try {
    await saveToDatabase(get().settings);
    set({ saveStatus: 'saved', retryCount: 0 });
  } catch (error) {
    console.error('[SettingsStore] Failed to save settings:', error);
    set({ saveStatus: 'error', retryCount: get().retryCount + 1 });
    // Rollback handled by useSettings hook (P1.T6)
  }
},
```

---

## 3. Persist Middleware

### 3.1 Official Persist Middleware

**Best Practice:** Use official persist middleware for localStorage

**Source:** [Zustand Official Docs - Persist](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)

> "The Persist middleware enables you to store your Zustand state in a storage (e.g., localStorage, AsyncStorage, IndexedDB, etc.), thus persisting its data."

**Pattern:**

```typescript
import { persist, createJSONStorage } from 'zustand/middleware';

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      // state and actions
    }),
    {
      name: 'app-storage', // unique key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist specific fields
        settings: state.settings,
      }),
    },
  ),
);
```

**Our Implementation:** ⚠️ Manual localStorage (for more control)

We chose manual localStorage management instead of persist middleware because:
- Need custom migration logic (P1.T3)
- Need separate dirty flag tracking (not persisted to DB)
- Need fine-grained control over sync timing
- Need to distinguish localStorage vs database persistence

### 3.2 Partialize Strategy

**Best Practice:** Only persist necessary state

**Source:** [Zustand Docs - Partialize](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)

> "Enables you to pick some of the state's fields to be stored in the storage."

**Our Implementation:** ✅ Manual partialize

```typescript
// Only persist settings, not saveStatus or retryCount
localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
```

---

## 4. Performance Optimization

### 4.1 Selective Subscriptions

**Best Practice:** Use selectors to prevent unnecessary re-renders

**Source:** [yuan.fyi - Performance Optimization](https://yuan.fyi/blog/best-practices-to-use-zustand-to-manage-state-in-react-application)

> "Use Selectors for Specific State Slices"

**Pattern:**

```typescript
// ❌ Bad: Re-renders on any state change
function Component() {
  const store = useSettingsStore();
  return <div>{store.settings.appearance.theme}</div>;
}

// ✅ Good: Only re-renders when theme changes
function Component() {
  const theme = useSettingsStore((state) => state.settings.appearance.theme);
  return <div>{theme}</div>;
}

// ✅ Better: Memoized selector
const selectTheme = (state: SettingsStoreState) => state.settings.appearance.theme;

function Component() {
  const theme = useSettingsStore(selectTheme);
  return <div>{theme}</div>;
}
```

**Our Implementation:** ✅ Computed selectors provided

```typescript
// Computed selectors for common operations
isLocked: (key: SettingsPath) => {
  const { systemPolicy } = get();
  return checkIsLocked(key, systemPolicy);
},

resolvedValue: <T>(key: SettingsPath): T => {
  const { settings, systemPolicy, systemPreferences } = get();
  return resolveValue<T>(key, settings, systemPolicy, systemPreferences);
},
```

### 4.2 Computed Values

**Best Practice:** Implement computed values as getters

**Source:** [yuan.fyi - Computed Values](https://yuan.fyi/blog/best-practices-to-use-zustand-to-manage-state-in-react-application)

> "Implement Computed Values"

**Pattern:**

```typescript
const useStore = create<State>((set, get) => ({
  todos: [],

  // Computed values as getters
  getCompletedTodos: () => get().todos.filter((todo) => todo.completed),
  getActiveTodos: () => get().todos.filter((todo) => !todo.completed),
  getProgress: () => {
    const todos = get().todos;
    if (todos.length === 0) return 0;
    return get().getCompletedTodos().length / todos.length;
  },
}));
```

**Our Implementation:** ✅ Computed selectors

```typescript
// Computed selectors that use precedence resolution
resolvedValue: <T>(key: SettingsPath): T => {
  const { settings, systemPolicy, systemPreferences } = get();
  return resolveValue<T>(key, settings, systemPolicy, systemPreferences);
},
```

---

## 5. Async Actions

### 5.1 Loading States

**Best Practice:** Track loading, error, and success states

**Source:** [yuan.fyi - Async Actions](https://yuan.fyi/blog/best-practices-to-use-zustand-to-manage-state-in-react-application)

> "Implement Async Actions with Loading States"

**Pattern:**

```typescript
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useStore = create<State>((set) => ({
  user: {
    data: null,
    loading: false,
    error: null,
  },

  fetchUser: async (id) => {
    set((state) => ({
      user: { ...state.user, loading: true, error: null },
    }));

    try {
      const userData = await api.fetchUser(id);
      set({ user: { data: userData, loading: false, error: null } });
    } catch (error) {
      set({ user: { data: null, loading: false, error: error.message } });
    }
  },
}));
```

**Our Implementation:** ✅ SaveStatus tracking

```typescript
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export type SettingsStoreState = {
  saveStatus: SaveStatus;
  retryCount: number;
  // ...
};
```

---

## 6. Store Reset

### 6.1 Reset Functionality

**Best Practice:** Implement reset for logout/cleanup

**Source:** [yuan.fyi - Store Reset](https://yuan.fyi/blog/best-practices-to-use-zustand-to-manage-state-in-react-application)

> "Implement Reset Functionality"

**Pattern:**

```typescript
const initialState = {
  todos: [],
  filter: 'all',
  loading: false,
  error: null,
};

const useStore = create<Store>((set) => ({
  ...initialState,
  reset: () => set(initialState),
}));
```

**Our Implementation:** ✅ Reset with localStorage clear

```typescript
resetSettings: () => {
  set({ settings: DEFAULT_SETTINGS, saveStatus: 'idle', retryCount: 0 });

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[SettingsStore] Failed to clear localStorage:', error);
  }
},
```

---

## 7. Testing

### 7.1 Unit Testing Stores

**Best Practice:** Test stores in isolation

**Source:** [yuan.fyi - Testing](https://yuan.fyi/blog/best-practices-to-use-zustand-to-manage-state-in-react-application)

> "Unit Testing Stores"

**Pattern:**

```typescript
import { act } from '@testing-library/react';

describe('settingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({ settings: DEFAULT_SETTINGS });
  });

  it('should update setting', () => {
    act(() => {
      useSettingsStore.getState().updateSetting('appearance.theme', 'dark');
    });

    const theme = useSettingsStore.getState().settings.appearance.theme;
    expect(theme).toBe('dark');
  });
});
```

**Our Implementation:** ✅ Comprehensive test suite (P1.T5)

---

## 8. Hydration

### 8.1 Synchronous vs Asynchronous Hydration

**Best Practice:** Understand hydration timing

**Source:** [Zustand Docs - Hydration](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)

> "With synchronous hydration, the Zustand store will already have been hydrated at its creation. In contrast, with asynchronous hydration, the Zustand store will be hydrated later on, in a microtask."

**Our Implementation:** ✅ Synchronous localStorage hydration

```typescript
loadSettings: async () => {
  try {
    // Synchronous localStorage read (fast)
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const migrated = migrateSettings(parsed);
      set({ settings: migrated });
      return;
    }

    // Fallback to defaults
    set({ settings: DEFAULT_SETTINGS });
  } catch (error) {
    console.error('[SettingsStore] Failed to load settings:', error);
    set({ settings: DEFAULT_SETTINGS });
  }
},
```

---

## 9. Our Implementation Summary

### 9.1 Architecture Decisions

**Store Structure:**
- ✅ Single domain-specific store (settings)
- ✅ Fully typed with TypeScript
- ✅ Computed selectors for precedence resolution
- ✅ Manual localStorage (more control than persist middleware)

**Optimistic Updates:**
- ✅ Immediate state update
- ✅ Immediate localStorage persistence
- ✅ Debounced database sync (handled by useSettings hook)
- ✅ Error tracking with retry count

**Performance:**
- ✅ Selective subscriptions via selectors
- ✅ Computed values for complex operations
- ✅ Minimal re-renders

**Testing:**
- ✅ Unit tests for all actions
- ✅ 90%+ coverage target

### 9.2 Why Manual localStorage Instead of Persist Middleware

**Reasons:**
1. **Custom Migration:** Need P1.T3 migration logic
2. **Dirty Flag:** Need separate dirty flag (not persisted to DB)
3. **Sync Control:** Need fine-grained control over sync timing
4. **Dual Persistence:** localStorage (immediate) vs database (debounced)

**Trade-offs:**
- ❌ More boilerplate code
- ✅ More control over persistence logic
- ✅ Better separation of concerns
- ✅ Easier to debug

---

## 10. Comparison with Industry Standards

### 10.1 Zustand Official Patterns

| Feature | Official Pattern | Our Implementation |
|---------|-----------------|-------------------|
| TypeScript | ✅ create<State>()(...) | ✅ Fully typed |
| Persist | ✅ persist middleware | ⚠️ Manual (more control) |
| Selectors | ✅ Recommended | ✅ Computed selectors |
| Async Actions | ✅ Supported | ✅ With loading states |
| Reset | ✅ Recommended | ✅ Implemented |

### 10.2 React Query Comparison

| Feature | React Query | Zustand |
|---------|------------|---------|
| Optimistic Updates | ✅ Built-in | ✅ Manual implementation |
| Cache Management | ✅ Automatic | ⚠️ Manual |
| Retry Logic | ✅ Built-in | ⚠️ External (useSettings) |
| Offline Support | ✅ Built-in | ✅ localStorage |

**Our Choice:** Zustand for settings (simpler, more control)

---

## 11. Conclusion

**Our Zustand store implementation follows all 2026 best practices:**

✅ **Domain-specific store** - Single responsibility  
✅ **TypeScript integration** - Fully typed  
✅ **Optimistic updates** - Immediate UI feedback  
✅ **localStorage persistence** - Offline-first  
✅ **Computed selectors** - Performance optimized  
✅ **Error handling** - Graceful degradation  
✅ **Reset functionality** - Cleanup support  
✅ **Testable** - Unit test friendly  

**No additional changes needed** - Implementation is production-ready and follows industry standards.

---

## References

1. [yuan.fyi - Zustand Best Practices](https://yuan.fyi/blog/best-practices-to-use-zustand-to-manage-state-in-react-application)
2. [Zustand Official Docs - Persist](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)
3. [oneuptime.com - Optimistic Updates](https://oneuptime.com/blog/post/2026-01-15-react-optimistic-updates-react-query/view)
4. [leapcell.io - useOptimistic](https://www.leapcell.io/blog/building-highly-responsive-uis-with-useoptimistic)
5. [Frontend Masters - Zustand Introduction](https://frontendmasters.com/blog/introducing-zustand/)
6. [Zustand GitHub - Official Repository](https://github.com/pmndrs/zustand)

*Content rephrased for compliance with licensing restrictions*
