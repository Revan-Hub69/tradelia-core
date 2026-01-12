import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during build temporarily (import boundaries still work in dev)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: false, // Disabled temporarily due to critters module error
    optimizePackageImports: [
      '@radix-ui/react-slot', 
      '@radix-ui/react-dialog',
      '@radix-ui/react-tooltip',
      'class-variance-authority', 
      'clsx', 
      'tailwind-merge',
      '@supabase/supabase-js',
      '@tanstack/react-query'
    ],
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  
  // External packages
  serverExternalPackages: [],
  
  // SWC compiler options (Next.js 15+)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  
  // Turbopack configuration (Next.js 15+)
  turbopack: {},
  
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  
  // Bundle analyzer
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
      
      // Only apply production optimizations in production build
      if (!dev) {
        // Tree shaking optimization (production only)
        config.optimization.usedExports = true;
        config.optimization.sideEffects = false;
        
        // Remove unused imports (production only)
        config.optimization.providedExports = true;
        config.optimization.concatenateModules = true;
      }
      
      // More aggressive code splitting (works in both dev and prod)
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 200000, // Reduced from 244000
        cacheGroups: {
          // Separate vendor chunks
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'all',
            priority: 30,
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix',
            chunks: 'all',
            priority: 25,
          },
          tanstack: {
            test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
            name: 'tanstack',
            chunks: 'all',
            priority: 20,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }
    
    return config;
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Disable dangerous browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()'
          },
          // HSTS for HTTPS enforcement
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          // Cross-Origin Isolation headers
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin'
          },
          // Content Security Policy - Tradelia 2026 compliant
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com", // Allow Next.js and external libs
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Allow Tailwind and Google Fonts
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https:", // Allow images from CDN and data URLs
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.coingecko.com", // API endpoints
              "media-src 'self'",
              "object-src 'none'", // Disable plugins
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'", // Prevent embedding
              "upgrade-insecure-requests",
              "report-uri /api/security/csp-report" // CSP violation reporting
            ].join('; ')
          }
        ]
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8'
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'"
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          // API-specific security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0'
          }
        ]
      }
    ];
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      }
    ];
  },
  
  // Output configuration
  output: 'standalone',
  
  // Trailing slash
  trailingSlash: false,
  
  // Environment variables
  env: {
    SITE_URL: process.env.SITE_URL || 'https://tradelia.com',
    ANALYTICS_ID: process.env.ANALYTICS_ID || '',
  }
};

export default withNextIntl(nextConfig);