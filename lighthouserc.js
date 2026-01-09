/**
 * Lighthouse CI Configuration
 * @see https://github.com/GoogleChrome/lighthouse-ci
 */

module.exports = {
  ci: {
    collect: {
      // URLs to test
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/dashboard',
      ],
      // Number of runs per URL
      numberOfRuns: 3,
      // Start server command
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready',
      startServerReadyTimeout: 30000,
    },
    assert: {
      // Assertions for Core Web Vitals and accessibility
      assertions: {
        // Performance
        'categories:performance': ['warn', { minScore: 0.9 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
        
        // Accessibility
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'color-contrast': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'meta-viewport': 'error',
        'bypass': 'error', // Skip link
        'heading-order': 'warn',
        'link-name': 'error',
        'button-name': 'error',
        'image-alt': 'error',
        
        // Best Practices
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'errors-in-console': 'warn',
        'deprecations': 'warn',
        
        // SEO
        'categories:seo': ['warn', { minScore: 0.9 }],
        'meta-description': 'error',
        'document-title': 'error',
        'robots-txt': 'warn',
        'canonical': 'warn',
        
        // PWA (optional)
        'categories:pwa': ['warn', { minScore: 0.8 }],
      },
    },
    upload: {
      // Upload to temporary public storage (for CI)
      target: 'temporary-public-storage',
    },
  },
};
