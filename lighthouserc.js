module.exports = {
  ci: {
    collect: {
      // ✅ TIER 1: Dashboard-specific URLs to audit
      url: [
        'http://localhost:3000/dashboard',
        'http://localhost:3000/dashboard/learn',
        'http://localhost:3000/dashboard/profile',
        'http://localhost:3000/dashboard/community',
      ],
      numberOfRuns: 3, // Multiple runs for accuracy
      settings: {
        // ✅ TIER 1: Chrome flags for consistent testing
        chromeFlags: '--no-sandbox --disable-dev-shm-usage --disable-gpu',
        // Focus on performance and accessibility audits
        skipAudits: process.env.CI ? ['installable-manifest', 'splash-screen', 'themed-omnibox', 'service-worker'] : ['installable-manifest', 'service-worker'],
      },
    },
    assert: {
      // ✅ TIER 1 2026: Performance budgets based on Core Web Vitals
      assertions: {
        // Core Web Vitals - 2026 Standards
        'categories:performance': ['error', { minScore: 0.9 }], // 90+ performance score
        'categories:accessibility': ['error', { minScore: 0.95 }], // 95+ accessibility
        'categories:best-practices': ['error', { minScore: 0.9 }], // 90+ best practices
        'categories:seo': ['warn', { minScore: 0.8 }], // SEO less critical for dashboard

        // Core Web Vitals 2026 (INP replaces FID)
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }], // < 1.5s FCP
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // < 2.5s LCP (Good)
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }], // < 0.1 CLS (Good)
        'total-blocking-time': ['error', { maxNumericValue: 300 }], // < 300ms TBT (proxy for INP)
        'speed-index': ['error', { maxNumericValue: 3000 }], // < 3s Speed Index
        'interactive': ['error', { maxNumericValue: 3500 }], // < 3.5s TTI
        'max-potential-fid': ['error', { maxNumericValue: 200 }], // < 200ms (INP target)

        // Bundle size budgets (2026)
        'total-byte-weight': ['warn', { maxNumericValue: 800000 }], // < 800KB total
        'unused-javascript': ['warn', { maxNumericValue: 80000 }], // < 80KB unused JS
        'uses-optimized-images': ['warn', { minScore: 0.9 }],
        'uses-text-compression': ['error', { minScore: 1 }],
        'uses-responsive-images': ['warn', { minScore: 0.9 }],

        // Security (important for financial dashboard)
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
