import '@testing-library/jest-dom/vitest';

// Set up environment variables for testing
process.env.BILLING_PLAN_ENV = 'test';

// Mock window.matchMedia for all tests (only in browser/jsdom environment)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    }),
  });
}
