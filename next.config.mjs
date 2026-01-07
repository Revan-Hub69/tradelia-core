/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge'],
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  
  // External packages
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // SWC compiler options (Next.js 16+)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  
  // Modern browser target
  target: 'es2022',
  
  // Turbopack configuration (Next.js 16+)
  turbopack: {},
  
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  
  // Bundle analyzer
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
      // Tree shaking optimization
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      // Code splitting with aggressive chunking
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
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
      // Remove unused imports
      config.optimization.providedExports = true;
      config.optimization.concatenateModules = true;
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
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
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

export default nextConfig;