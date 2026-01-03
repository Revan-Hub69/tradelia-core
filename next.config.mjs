/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    mdxRs: true,
    // optimizeCss: true, // Temporarily disabled - causing critters error
  },
  // Disable unnecessary polyfills for modern browsers
  transpilePackages: [],
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
  compress: true,
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    const connectSrc = buildConnectSrc({
      isDev,
      apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    });
    
    // CSP configuration - more permissive for Next.js compatibility
    const csp = isDev 
      ? `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src ${connectSrc}; frame-src 'none'; object-src 'none'; base-uri 'self';`
      : `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src ${connectSrc}; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';`;

    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
          // HTTP Strict Transport Security
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Content Type Options
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
          },
          // Legacy browser protection
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Performance headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          // Cross-Origin-Opener-Policy for security isolation
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          }
        ],
      },
      // Cache static assets
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot|otf)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
    ];
  },
};

function buildConnectSrc({ isDev, apiBaseUrl }) {
  const allow = new Set(["'self'"]);
  if (isDev) {
    allow.add('http://localhost:3000');
    allow.add('http://localhost:3001');
  }

  const normalized = normalizeUrl(apiBaseUrl);
  if (normalized) {
    allow.add(normalized.origin);
  }

  return Array.from(allow).join(' ');
}

function normalizeUrl(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim().replace(/\/+$/, '');
  if (!trimmed) return null;
  const withScheme = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`;
  try {
    return new URL(withScheme);
  } catch {
    return null;
  }
}

export default nextConfig;
