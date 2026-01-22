/*
 * LIGHTHOUSE CI CONFIGURATION - PHASE 3C IMPLEMENTATION
 * 
 * Tier 1 Research Implementation:
 * - Google Chrome Lighthouse CI Official
 * - Performance budgets based on research
 * - Automated regression detection
 * - CI/CD integration ready
 * 
 * Expected Impact: Automated performance monitoring
 */

module.exports = {
  ci: {
    collect: {
      // ✅ TIER 1: URLs to audit
      url: [
        'http://localhost:3000',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/dashboard/learn',
        'http://localhost:3000/lesson-0',
      ],
      numberOfRuns: 3, // Multiple runs for accuracy
      settings: {
        // ✅ TIER 1: Chrome flags for consistent testing
        chromeFlags: '--no-sandbox --disable-dev-shm-usage --disable-gpu',
        // Disable PWA audits in CI (can be flaky)
        skipAudits: process.env.CI ? ['installable-manifest', 'splash-screen', 'themed-omnibox'] : [],
      },
    },
    assert: {
      // ✅ TIER 1: Performance budgets based on research
      assertions: {
        // Core Web Vitals - Tier 1 targets
        'categories:performance': ['error', { minScore: 0.9 }], // 90+ performance score
        'categories:accessibility': ['error', { minScore: 0.95 }], // 95+ accessibility
        'categories:best-practices': ['error', { minScore: 0.9 }], // 90+ best practices
        'categories:seo': ['error', { minScore: 0.9 }], // 90+ SEO
        
        // Specific metrics - Based on tier 1 research
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }], // < 2s FCP
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // < 2.5s LCP
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }], // < 0.1 CLS
        'total-blocking-time': ['error', { maxNumericValue: 300 }], // < 300ms TBT
        'speed-index': ['error', { maxNumericValue: 3000 }], // < 3s Speed Index
        
        // Bundle size budgets
        'total-byte-weight': ['warn', { maxNumericValue: 1000000 }], // < 1MB total
        'unused-javascript': ['warn', { maxNumericValue: 100000 }], // < 100KB unused JS
        
        // PWA requirements
        'installable-manifest': process.env.CI ? 'off' : ['warn', { minScore: 1 }],
        'service-worker': process.env.CI ? 'off' : ['warn', { minScore: 1 }],
        
        // Security
        'is-on-https': process.env.CI ? 'off' : ['error', { minScore: 1 }],
        'redirects-http': process.env.CI ? 'off' : ['error', { minScore: 1 }],
      },
    },
    upload: {
      // ✅ TIER 1: Upload to temporary public storage for CI
      target: 'temporary-public-storage',
    },
    server: {
      // ✅ TIER 1: Server configuration for CI
      port: 9001,
      storage: '.lighthouseci',
    },
  },
};