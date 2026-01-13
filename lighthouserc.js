/**
 * Lighthouse CI Configuration - Tradelia 2026
 * 
 * Realistic thresholds for development phase.
 * Tighten these as the app matures.
 * 
 * @see https://github.com/GoogleChrome/lighthouse-ci
 */

module.exports = {
  ci: {
    collect: {
      // URLs to test
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/en/dashboard',
      ],
      // Number of runs per URL
      numberOfRuns: 3,
      // Start server command
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready',
      startServerReadyTimeout: 60000,
    },
    assert: {
      // Realistic assertions for development phase
      assertions: {
        // Performance - relaxed for dev, tighten later
        'categories:performance': ['warn', { minScore: 0.6 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.25 }],
        'total-blocking-time': ['warn', { maxNumericValue: 500 }],
        
        // Accessibility - important but allow some gaps
        'categories:accessibility': ['warn', { minScore: 0.7 }],
        'color-contrast': 'warn',
        'document-title': 'warn',
        'html-has-lang': 'warn',
        'meta-viewport': 'warn',
        'bypass': 'warn',
        'heading-order': 'warn',
        'link-name': 'warn',
        'button-name': 'warn',
        'image-alt': 'warn',
        
        // Best Practices
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'errors-in-console': 'warn',
        'deprecations': 'warn',
        
        // SEO
        'categories:seo': ['warn', { minScore: 0.8 }],
        'meta-description': 'warn',
        'robots-txt': 'warn',
        'canonical': 'warn',
        
        // PWA - optional for now
        'categories:pwa': 'off',
      },
    },
    upload: {
      // Upload to temporary public storage (for CI)
      target: 'temporary-public-storage',
    },
  },
};
