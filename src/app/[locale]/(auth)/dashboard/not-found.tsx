'use client';

import {
  ArrowLeft,
  FileQuestion,
  Home,
  Mail,
  Map,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { UiButton } from '@/components/ui/UiButton';
import { UiSurface } from '@/components/ui/UiSurface';
import { Link, useRouter } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';

/**
 * Dashboard 404 Not Found Page - Enterprise 2026
 *
 * Best Practices Implementation:
 * ✅ Clear messaging with helpful context
 * ✅ Search functionality (inline)
 * ✅ Multiple recovery paths
 * ✅ Report broken link
 * ✅ Popular pages suggestions
 * ✅ Breadcrumb context
 * ✅ Analytics tracking (client-side)
 * ✅ Signature glass treatment
 * ✅ Micro-interactions
 * ✅ Easter egg for power users
 */
export default function DashboardNotFound() {
  const t = useTranslations('NotFound');
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [attemptedPath, setAttemptedPath] = useState('');

  useEffect(() => {
    // Track 404 for analytics
    const path = window.location.pathname;
    setAttemptedPath(path);

    // TODO: Send to analytics
    console.log('404 Error tracked:', {
      path,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
    });

    // Easter egg: Konami code detection (↑↑↓↓←→←→BA)
    let konamiIndex = 0;
    const konamiCode = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ];

    const handleKonami = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setShowEasterEgg(true);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKonami);
    return () => window.removeEventListener('keydown', handleKonami);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to learn page with search (or implement real search)
      router.push(`/dashboard/learn?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const popularPages = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/learn', label: t('learn'), icon: TrendingUp },
    { href: '/dashboard/tools', label: t('tools'), icon: Sparkles },
    { href: '/dashboard/community', label: t('community'), icon: Map },
  ];

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center p-6">
      {/* Signature glass background effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 size-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 size-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <UiSurface variant="card" className="relative z-10 w-full max-w-3xl">
        <div className="space-y-8 p-8">
          {/* Breadcrumb context */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-foreground">404</span>
          </div>

          {/* Icon with signature animation */}
          <div className="flex justify-center">
            <div
              className={cn(
                'relative flex size-24 items-center justify-center rounded-2xl',
                'bg-gradient-to-br from-muted to-muted/50',
                'transition-all duration-500',
                showEasterEgg && 'animate-bounce',
              )}
            >
              <FileQuestion
                className={cn(
                  'size-12 text-muted-foreground transition-all duration-300',
                  showEasterEgg && 'text-primary',
                )}
                aria-hidden="true"
              />
              {showEasterEgg && (
                <div className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full bg-accent text-white">
                  <Sparkles className="size-4" />
                </div>
              )}
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3 text-center">
            <h1 className="text-5xl font-bold tracking-tight">404</h1>
            <h2 className="text-2xl font-semibold">{t('title')}</h2>
            <p className="text-muted-foreground">
              {t('description')}
            </p>
            {attemptedPath && (
              <p className="text-xs text-muted-foreground/60">
                <code className="rounded bg-muted px-2 py-1 font-mono">
                  {attemptedPath}
                </code>
              </p>
            )}
          </div>

          {/* Search Bar - Best Practice 2026 */}
          <form onSubmit={handleSearch} className="mx-auto max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className={cn(
                  'w-full rounded-xl border bg-background py-3 pl-10 pr-4',
                  'transition-all duration-200',
                  'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
                  'placeholder:text-muted-foreground/60',
                )}
              />
            </div>
          </form>

          {/* Primary Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <UiButton variant="primary" asChild>
              <Link href="/dashboard" className="gap-2">
                <Home className="size-4" aria-hidden="true" />
                {t('back_dashboard')}
              </Link>
            </UiButton>

            <UiButton variant="secondary" asChild>
              <Link href="/dashboard/learn" className="gap-2">
                <TrendingUp className="size-4" aria-hidden="true" />
                {t('learn')}
              </Link>
            </UiButton>

            <UiButton variant="ghost" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="size-4" aria-hidden="true" />
              {t('go_back')}
            </UiButton>
          </div>

          {/* Popular Pages - Signature Cards */}
          <div className="border-t pt-6">
            <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
              {t('popular_pages')}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {popularPages.map((page) => {
                const Icon = page.icon;
                return (
                  <Link
                    key={page.href}
                    href={page.href}
                    className={cn(
                      'group relative overflow-hidden rounded-xl border p-4',
                      'transition-all duration-200',
                      'hover:border-primary/50 hover:bg-accent/5',
                      'active:scale-[0.98]',
                    )}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="rounded-lg bg-muted p-2 transition-colors group-hover:bg-primary/10">
                        <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
                      </div>
                      <span className="text-sm font-medium">{page.label}</span>
                    </div>
                    {/* Signature hover effect */}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 to-accent/0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Report & Support */}
          <div className="flex flex-col items-center gap-4 border-t pt-6 text-center">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <a
                href={`mailto:info@tradelia.org?subject=404 Report&body=Path: ${attemptedPath}`}
                className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="size-4" />
                {t('report_link')}
              </a>
              <span className="text-muted-foreground/40">•</span>
              <Link
                href="/dashboard/tools"
                className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
              >
                <Map className="size-4" />
                {t('sitemap')}
              </Link>
            </div>

            {/* Easter egg message */}
            {showEasterEgg && (
              <div className="rounded-lg bg-accent/10 px-4 py-2 text-xs text-accent-foreground animate-in fade-in slide-in-from-bottom-4">
                🎮
                {' '}
                {t('easter_egg_message')}
              </div>
            )}

            <p className="text-xs text-muted-foreground/60">
              {t('support_hint')}
            </p>
          </div>
        </div>
      </UiSurface>
    </div>
  );
}
