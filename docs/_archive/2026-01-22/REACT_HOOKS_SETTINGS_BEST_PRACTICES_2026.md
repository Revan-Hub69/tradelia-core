# React Hooks for Settings Management - Best Practices 2026

**Research Date:** 2026-01-21  
**Task:** P1.T6 - useSettings Hook Implementation  
**Sources:** OpenIllumi, OneUpTime, BetterStack, React Official Docs

---

## Executive Summary

This document outlines industry best practices for implementing React hooks that manage settings with debouncing, retry logic, and offline support. Key patterns include proper useEffect cleanup, useRef for function persistence, exponential backoff with jitter, and localStorage-based offline resilience.

---

## 1. Debouncing in React Hooks

### The Problem with Traditional Debounce

Traditional JavaScript debounce functions fail in React functional components because:

1. **Function Re-creation:** Component re-renders create new function instances
2. **Lost Timer State:** New instances don't know about previous timers
3. **clearTimeout Fails:** Cannot cancel pending executions from previous instances

### Solution: useEffect + Cleanup Pattern

**Pattern for Value Debouncing (Recommended):**

```typescript
useEffect(() => {
  const delayDebounceFn = setTimeout(() => {
    if (value) {
      // Execute delayed logic here
    }
  }, 500);

  return () => clearTimeout(delayDebounceFn);
}, [value]);
```

**Key Principles:**
- Use `useEffect` with dependency array
- Return cleanup function to cancel pending timers
- Timer ID persists across renders via closure

### Alternative: useRef for Function Persistence

For complex scenarios requiring function stability:

```typescript
const debouncedFn = useRef<NodeJS.Timeout>();

const handleChange = (value: string) => {
  if (debouncedFn.current) {
    clearTimeout(debouncedFn.current);
  }
  
  debouncedFn.current = setTimeout(() => {
    // Execute logic
  }, 500);
};

// Cleanup on unmount
useEffect(() => {
  return () => {
    if (debouncedFn.current) {
      clearTimeout(debouncedFn.current);
    }
  };
}, []);
```

---

## 2. Exponential Backoff with Jitter

### Why Exponential Backoff?

| Strategy | Problem | Use Case |
|----------|---------|----------|
| Immediate retry | Overloads failing service | ❌ Never use |
| Fixed interval | Synchronized retries cause spikes | ❌ Thundering herd |
| Exponential backoff | Gradually reduces pressure | ✅ Good |
| Exponential + jitter | Desynchronizes retries | ✅ Best |

### Jitter Strategies

**Full Jitter (Recommended):**
```typescript
function calculateDelay(baseDelay: number, attempt: number, maxDelay: number): number {
  const exponentialDelay = Math.min(
    baseDelay * Math.pow(2, attempt - 1),
    maxDelay
  );
  
  // Random between 0 and exponentialDelay
  return Math.random() * exponentialDelay;
}
```

**Equal Jitter (More Predictable):**
```typescript
function calculateDelay(baseDelay: number, attempt: number, maxDelay: number): number {
  const exponentialDelay = Math.min(
    baseDelay * Math.pow(2, attempt - 1),
    maxDelay
  );
  
  // Half fixed, half random
  return exponentialDelay / 2 + (Math.random() * exponentialDelay / 2);
}
```

### Retry Implementation Pattern

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    factor?: number;
    jitter?: 'full' | 'equal';
    retryIf?: (error: any) => boolean;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 5,
    initialDelay = 3000,
    maxDelay = 30000,
    factor = 2,
    jitter = 'full',
    retryIf = () => true,
  } = options;

  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on last attempt or non-retryable errors
      if (attempt === maxAttempts || !retryIf(error)) {
        throw error;
      }

      // Calculate delay with jitter
      const baseDelay = Math.min(
        initialDelay * Math.pow(factor, attempt - 1),
        maxDelay
      );
      
      const delay = jitter === 'full'
        ? Math.random() * baseDelay
        : baseDelay / 2 + (Math.random() * baseDelay / 2);

      console.log(`[Retry] Attempt ${attempt} failed, retrying in ${delay}ms...`);

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
```

**Retryable Error Detection:**
```typescript
function isRetryableError(error: any): boolean {
  // Network errors
  if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') {
    return true;
  }
  
  // HTTP status codes
  if (error.status === 408 || error.status === 429 || error.status === 503) {
    return true;
  }
  
  // Supabase-specific errors
  if (error.message?.includes('timeout') || error.message?.includes('network')) {
    return true;
  }
  
  return false;
}
```

---

## 3. useEffect Cleanup Best Practices

### Memory Leak Prevention

**Problem:** Async operations updating state after unmount

**Solution:** Cleanup function + abort signal

```typescript
useEffect(() => {
  let isMounted = true;
  const abortController = new AbortController();

  async function fetchData() {
    try {
      const response = await fetch(url, { signal: abortController.signal });
      const data = await response.json();
      
      if (isMounted) {
        setState(data);
      }
    } catch (error) {
      if (error.name !== 'AbortError' && isMounted) {
        setError(error);
      }
    }
  }

  fetchData();

  return () => {
    isMounted = false;
    abortController.abort();
  };
}, [url]);
```

### Timer Cleanup

```typescript
useEffect(() => {
  const timerId = setTimeout(() => {
    // Logic
  }, delay);

  return () => clearTimeout(timerId);
}, [delay]);
```

### Subscription Cleanup

```typescript
useEffect(() => {
  const subscription = observable.subscribe(data => {
    setState(data);
  });

  return () => subscription.unsubscribe();
}, [observable]);
```

---

## 4. Offline Support Patterns

### localStorage-Based Dirty Flag

```typescript
interface OfflineState {
  dirty: boolean;
  pendingUpdatedAt: string;
  pendingChanges: Record<string, any>;
}

function persistOfflineState(state: OfflineState) {
  localStorage.setItem('settings:offline', JSON.stringify(state));
}

function loadOfflineState(): OfflineState | null {
  const stored = localStorage.getItem('settings:offline');
  return stored ? JSON.parse(stored) : null;
}

function clearOfflineState() {
  localStorage.removeItem('settings:offline');
}
```

### Online/Offline Detection

```typescript
useEffect(() => {
  function handleOnline() {
    console.log('[Settings] Back online, syncing...');
    syncPendingChanges();
  }

  function handleOffline() {
    console.log('[Settings] Offline mode');
  }

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);
```

---

## 5. Conflict Resolution

### Server-Authoritative Timestamp

```typescript
async function resolveConflict(
  localSettings: UserSettingsV1,
  localUpdatedAt: string,
  serverSettings: UserSettingsV1,
  serverUpdatedAt: string
): Promise<UserSettingsV1> {
  const localTime = new Date(localUpdatedAt).getTime();
  const serverTime = new Date(serverUpdatedAt).getTime();

  if (serverTime > localTime) {
    console.log('[Conflict] Server wins (newer timestamp)');
    return serverSettings;
  } else {
    console.log('[Conflict] Local wins (newer timestamp), pushing to server');
    return localSettings;
  }
}
```

---

## 6. Hook Architecture Pattern

### Separation of Concerns

```typescript
// ✅ Good: Separate local and remote persistence
function useSettings() {
  const store = useSettingsStore();

  // Local persistence (immediate)
  const applyLocalSettings = (path: SettingsPath, value: any) => {
    store.updateSetting(path, value);
    // localStorage write happens in store
  };

  // Remote persistence (debounced)
  const syncRemoteSettings = useMemo(
    () => debounce(async () => {
      await store.saveSettings();
    }, 500),
    []
  );

  return { applyLocalSettings, syncRemoteSettings };
}
```

### Single Responsibility

- **Store:** State management + localStorage
- **Hook:** React integration + database sync + retry logic
- **Component:** UI rendering + user interaction

---

## 7. Testing Considerations

### Mock Timer Functions

```typescript
import { vi } from 'vitest';

it('should debounce updates', async () => {
  vi.useFakeTimers();

  const { result } = renderHook(() => useSettings());

  act(() => {
    result.current.updateSetting('appearance.theme', 'dark');
  });

  // Fast-forward time
  act(() => {
    vi.advanceTimersByTime(500);
  });

  expect(mockSaveToDatabase).toHaveBeenCalledTimes(1);

  vi.useRealTimers();
});
```

### Mock Network Conditions

```typescript
it('should handle offline mode', async () => {
  // Simulate offline
  vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false);

  const { result } = renderHook(() => useSettings());

  await act(async () => {
    result.current.updateSetting('appearance.theme', 'dark');
  });

  // Should persist to localStorage but not call database
  expect(localStorage.getItem).toHaveBeenCalled();
  expect(mockSaveToDatabase).not.toHaveBeenCalled();
});
```

---

## 8. Performance Optimization

### Avoid Unnecessary Re-renders

```typescript
// ✅ Good: Memoize selectors
const theme = useSettingsStore(state => state.settings.appearance.theme);

// ❌ Bad: Subscribes to entire store
const store = useSettingsStore();
const theme = store.settings.appearance.theme;
```

### Debounce Expensive Operations

```typescript
// ✅ Good: Debounce database writes
const debouncedSync = useMemo(
  () => debounce(syncToDatabase, 500),
  []
);

// ❌ Bad: Sync on every keystroke
onChange={(value) => syncToDatabase(value)}
```

---

## 9. Error Handling

### User-Friendly Error Messages

```typescript
function getErrorMessage(error: any, attempt: number, maxAttempts: number): string {
  if (attempt < maxAttempts) {
    return ''; // Silent retry
  }
  
  if (error.code === 'ETIMEDOUT') {
    return 'Connection timeout. Please check your internet connection.';
  }
  
  if (error.status === 429) {
    return 'Too many requests. Please try again later.';
  }
  
  return 'Failed to save settings. Your changes are saved locally and will sync when possible.';
}
```

### Graceful Degradation

```typescript
try {
  await syncToDatabase(settings);
} catch (error) {
  console.error('[Settings] Sync failed:', error);
  
  // Still usable with localStorage
  toast.warning('Settings saved locally. Will sync when connection is restored.');
  
  // Mark as dirty for later sync
  persistOfflineState({
    dirty: true,
    pendingUpdatedAt: new Date().toISOString(),
    pendingChanges: settings,
  });
}
```

---

## 10. Implementation Checklist

### Core Functionality
- ✅ Wrap Zustand store with React hook
- ✅ Implement debounced database sync (500ms)
- ✅ Implement exponential backoff retry (3s, 10s, 30s + jitter)
- ✅ Implement offline support (dirty flag + localStorage)
- ✅ Implement conflict resolution (server-authoritative timestamp)

### Error Handling
- ✅ Silent logging for retries
- ✅ User notification only after max retry
- ✅ Graceful degradation to localStorage-only mode

### Performance
- ✅ Memoize debounced functions
- ✅ Use selective Zustand subscriptions
- ✅ Cleanup timers and subscriptions

### Testing
- ✅ Unit tests for debouncing
- ✅ Unit tests for retry logic
- ✅ Integration tests for offline mode
- ✅ Integration tests for conflict resolution

---

## References

1. **OpenIllumi** - React Hooks Debounce Guide (2026)
2. **OneUpTime** - Node.js Retry with Exponential Backoff (2026)
3. **BetterStack** - Mastering Exponential Backoff in Distributed Systems (2024)
4. **React Official Docs** - useEffect Hook Cleanup

---

**Content was rephrased for compliance with licensing restrictions**
