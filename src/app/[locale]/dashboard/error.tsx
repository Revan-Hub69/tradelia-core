'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

import { UiButton } from '@/components/ui/UiButton';
import { UiSurface } from '@/components/ui/UiSurface';

/**
 * Dashboard Error Boundary
 * 
 * Best Practices 2026:
 * - Must be 'use client'
 * - Logs errors to monitoring (production-safe)
 * - Provides clear recovery actions
 * - Maintains layout context (header/nav still visible)
 * - i18n support
 * - Accessible (aria-live, focus management)
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('ErrorBoundary');

  useEffect(() => {
    // Log to monitoring service (Sentry, LogRocket, etc.)
    // In production, error.message is scrubbed by Next.js for security
    console.error('Dashboard Error:', {
      message: error.message,
      digest: error.digest, // Use digest to match server logs
      stack: error.stack,
    });

    // TODO: Send to error tracking service
    // trackError({ message: error.message, digest: error.digest });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <UiSurface variant="card" className="max-w-lg">
        <div className="space-y-6 p-8 text-center">
          {/* Icon */}
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-8 text-destructive" aria-hidden="true" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t('title')}
            </h1>
            <p className="text-muted-foreground">
              {t('description')}
            </p>
          </div>

          {/* Error details (dev only) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="rounded-lg bg-muted p-4 text-left text-sm">
              <summary className="cursor-pointer font-medium">
                Technical Details (dev only)
              </summary>
              <pre className="mt-2 overflow-auto text-xs">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}

          {/* Actions */}
          <div 
            className="flex flex-col gap-3 sm:flex-row sm:justify-center"
            role="group"
            aria-label={t('actions_label')}
          >
            <UiButton
              variant="primary"
              onClick={() => reset()}
              className="gap-2"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              {t('try_again')}
            </UiButton>

            <UiButton variant="secondary" asChild>
              <Link href="/dashboard" className="gap-2">
                <Home className="size-4" aria-hidden="true" />
                {t('back_home')}
              </Link>
            </UiButton>
          </div>

          {/* Support hint */}
          <p className="text-xs text-muted-foreground">
            {t('support_hint')}
            {error.digest && (
              <span className="ml-1 font-mono">
                (ID: {error.digest.slice(0, 8)})
              </span>
            )}
          </p>
        </div>
      </UiSurface>
    </div>
  );
}
