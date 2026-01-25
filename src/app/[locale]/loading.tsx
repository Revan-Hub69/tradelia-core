/**
 * Landing Page Loading State
 * 
 * Streaming SSR: Shows skeleton while landing page loads
 * Provides instant feedback to users
 */

export default function LandingLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="h-8 w-32 animate-pulse rounded bg-muted/50" />

          <nav className="hidden items-center gap-6 md:flex">
            <div className="h-4 w-20 animate-pulse rounded bg-muted/30" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted/30" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted/30" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted/30" />
          </nav>

          <div className="h-10 w-24 animate-pulse rounded-lg bg-primary/20" />
        </div>
      </header>

      {/* Hero skeleton */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          {/* Title skeleton */}
          <div className="space-y-4">
            <div className="mx-auto h-14 w-full max-w-3xl animate-pulse rounded-xl bg-muted/50 md:h-16" />
            <div className="mx-auto h-14 w-full max-w-2xl animate-pulse rounded-xl bg-muted/40 md:h-16" />
          </div>

          {/* Description skeleton */}
          <div className="mx-auto max-w-2xl space-y-3">
            <div className="mx-auto h-6 w-full animate-pulse rounded-lg bg-muted/30" />
            <div className="mx-auto h-6 w-5/6 animate-pulse rounded-lg bg-muted/30" />
            <div className="mx-auto h-6 w-4/6 animate-pulse rounded-lg bg-muted/30" />
          </div>

          {/* CTA buttons skeleton */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="h-12 w-40 animate-pulse rounded-xl bg-primary/20" />
            <div className="h-12 w-40 animate-pulse rounded-xl bg-muted/30" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-3 gap-8 pt-12">
            {[1, 2, 3].map(i => (
              <div key={`landing-stat-skeleton-${i}`} className="space-y-2">
                <div className="mx-auto h-10 w-20 animate-pulse rounded-lg bg-muted/50" />
                <div className="mx-auto h-4 w-24 animate-pulse rounded bg-muted/30" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features skeleton */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-6xl">
          {/* Section title skeleton */}
          <div className="mb-12 space-y-4 text-center">
            <div className="mx-auto h-10 w-64 animate-pulse rounded-lg bg-muted/50" />
            <div className="mx-auto h-5 w-96 animate-pulse rounded bg-muted/30" />
          </div>

          {/* Feature cards skeleton */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={`landing-feature-skeleton-${i}`}
                className="space-y-4 rounded-2xl border border-border/50 bg-card/50 p-6"
              >
                <div className="size-12 animate-pulse rounded-xl bg-primary/20" />
                <div className="h-6 w-3/4 animate-pulse rounded bg-muted/50" />
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-muted/30" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-muted/30" />
                  <div className="h-4 w-4/6 animate-pulse rounded bg-muted/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
