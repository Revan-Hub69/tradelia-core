import { cn } from '@/utils/Helpers';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

function NavigationSkeleton({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={`nav-skeleton-${i}`} className="flex items-center space-x-3 px-3 py-2">
          <Skeleton className="size-5" />
          {!isCollapsed && <Skeleton className="h-4 w-20" />}
        </div>
      ))}
    </div>
  );
}

export { NavigationSkeleton, Skeleton };
