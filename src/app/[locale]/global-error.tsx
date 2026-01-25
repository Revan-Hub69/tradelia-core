'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

/**
 * Global Error Boundary
 *
 * Best Practices 2026:
 * - Catches errors not caught by error.tsx
 * - Must include <html> and <body> (replaces root layout)
 * - Minimal dependencies (app might be broken)
 * - No i18n (locale might be broken)
 * - Production-safe error logging
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Critical error logging
    console.error('Global Error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });

    // TODO: Send to error tracking service
    // trackCriticalError({ message: error.message, digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '32rem',
              textAlign: 'center',
              padding: '2rem',
              borderRadius: '1rem',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          >
            {/* Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '4rem',
                height: '4rem',
                margin: '0 auto 1.5rem',
                borderRadius: '9999px',
                backgroundColor: '#fee2e2',
              }}
            >
              <AlertTriangle
                style={{ width: '2rem', height: '2rem', color: '#dc2626' }}
              />
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}
            >
              Something went wrong
            </h1>

            {/* Description */}
            <p
              style={{
                color: '#6b7280',
                marginBottom: '1.5rem',
              }}
            >
              A critical error occurred. Please try again or contact support if the problem
              persists.
            </p>

            {/* Error details (dev only) */}
            {process.env.NODE_ENV === 'development' && (
              <details
                style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.5rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: '500' }}>
                  Technical Details (dev only)
                </summary>
                <pre
                  style={{
                    marginTop: '0.5rem',
                    overflow: 'auto',
                    fontSize: '0.75rem',
                  }}
                >
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}

            {/* Action */}
            <button
              type="button"
              onClick={() => reset()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: '600',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
            >
              <RefreshCw style={{ width: '1rem', height: '1rem' }} />
              Try again
            </button>

            {/* Support hint */}
            {error.digest && (
              <p
                style={{
                  marginTop: '1.5rem',
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                }}
              >
                Error ID:
                {' '}
                <code style={{ fontFamily: 'monospace' }}>{error.digest.slice(0, 8)}</code>
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
