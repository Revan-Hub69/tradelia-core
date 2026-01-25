/**
 * Auth Page Loading State
 *
 * Streaming SSR: Shows skeleton while auth page loads
 * Improves perceived performance with progressive loading
 */

export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header skeleton */}
        <div className="space-y-3 text-center">
          <div className="mx-auto h-10 w-48 animate-pulse rounded-lg bg-muted/50" />
          <div className="mx-auto h-5 w-72 animate-pulse rounded bg-muted/30" />
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-2 rounded-xl bg-muted/20 p-1">
          <div className="h-10 flex-1 animate-pulse rounded-lg bg-muted/50" />
          <div className="h-10 flex-1 animate-pulse rounded-lg bg-muted/30" />
          <div className="h-10 flex-1 animate-pulse rounded-lg bg-muted/30" />
        </div>

        {/* Form skeleton */}
        <div className="space-y-4 rounded-2xl border border-border/50 bg-card/50 p-6 shadow-lg backdrop-blur-sm">
          <div className="space-y-2">
            <div className="h-4 w-16 animate-pulse rounded bg-muted/50" />
            <div className="h-11 w-full animate-pulse rounded-lg bg-muted/30" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-muted/50" />
            <div className="h-11 w-full animate-pulse rounded-lg bg-muted/30" />
          </div>

          <div className="h-11 w-full animate-pulse rounded-lg bg-primary/20" />
        </div>

        {/* Divider skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-muted/30" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted/30" />
          <div className="h-px flex-1 bg-muted/30" />
        </div>

        {/* Social auth skeleton */}
        <div className="space-y-3">
          <div className="h-11 w-full animate-pulse rounded-lg bg-muted/30" />
          <div className="h-11 w-full animate-pulse rounded-lg bg-muted/30" />
        </div>

        {/* Footer skeleton */}
        <div className="space-y-2 text-center">
          <div className="mx-auto h-4 w-64 animate-pulse rounded bg-muted/30" />
        </div>
      </div>
    </div>
  );
}
