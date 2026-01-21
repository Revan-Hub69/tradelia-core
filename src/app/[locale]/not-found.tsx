import { useTranslations } from 'next-intl';
import { FileQuestion, Home, Search } from 'lucide-react';
import Link from 'next/link';

import { UiButton } from '@/components/ui/UiButton';
import { UiSurface } from '@/components/ui/UiSurface';

/**
 * 404 Not Found Page
 * 
 * Best Practices 2026:
 * - Server component (async, can fetch data)
 * - i18n support
 * - Helpful recovery actions
 * - Suggests popular pages
 * - Professional, not playful (educational context)
 */
export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <UiSurface variant="card" className="max-w-2xl">
        <div className="space-y-6 p-8 text-center">
          {/* Icon */}
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="size-10 text-muted-foreground" aria-hidden="true" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">404</h1>
            <h2 className="text-2xl font-semibold">{t('title')}</h2>
            <p className="text-muted-foreground">{t('description')}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <UiButton variant="primary" asChild>
              <Link href="/dashboard" className="gap-2">
                <Home className="size-4" aria-hidden="true" />
                {t('back_dashboard')}
              </Link>
            </UiButton>

            <UiButton variant="secondary" asChild>
              <Link href="/lesson-0" className="gap-2">
                <Search className="size-4" aria-hidden="true" />
                {t('start_learning')}
              </Link>
            </UiButton>
          </div>

          {/* Helpful links */}
          <div className="border-t pt-6">
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              {t('popular_pages')}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/dashboard"
                className="rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/learn"
                className="rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
              >
                {t('learn')}
              </Link>
              <Link
                href="/dashboard/tools"
                className="rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
              >
                {t('tools')}
              </Link>
              <Link
                href="/dashboard/community"
                className="rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
              >
                {t('community')}
              </Link>
            </div>
          </div>
        </div>
      </UiSurface>
    </div>
  );
}
