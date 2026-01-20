import * as React from 'react';

import { cn } from '@/utils/Helpers';

export type StreakCounterProps = {
  days: number;
  label: string; // i18n - "giorno" o "giorni" passato dal parent
  showIcon?: boolean;
  className?: string;
};

const FlameIcon = ({ className, active }: { className?: string; active: boolean }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    {active
      ? (
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        )
      : (
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        )}
  </svg>
);

export function StreakCounter({ days, label, showIcon = true, className }: StreakCounterProps) {
  const isActive = days > 0;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
        isActive
          ? 'bg-warning/10 text-warning'
          : 'bg-muted text-muted-foreground',
        className,
      )}
    >
      {showIcon && <FlameIcon className="size-4" active={isActive} />}
      <span className="tabular-nums">{days}</span>
      <span>{label}</span>
    </div>
  );
}
