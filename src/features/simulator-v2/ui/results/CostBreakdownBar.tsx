'use client';

import { motion } from 'framer-motion';

import { cn } from '@/utils/Helpers';

type Segment = {
  key: string;
  label: string;
  value: number;
  colorClass: string;
};

type CostBreakdownBarProps = {
  segments: Segment[];
  /** Mostra le label sotto la barra. Default true. */
  showLegend?: boolean;
  /** Altezza della barra in pixel. Default 8. */
  height?: number;
  className?: string;
};

/**
 * Barra segmentata proporzionale per breakdown costi (spread / commissioni / swap).
 * Le percentuali sono calcolate sulla somma dei valori.
 */
export function CostBreakdownBar({
  segments,
  showLegend = true,
  height = 8,
  className,
}: CostBreakdownBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const visible = segments.filter(s => s.value > 0);

  if (total === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className="flex overflow-hidden rounded-full bg-muted/40"
        style={{ height: `${height}px` }}
        role="img"
        aria-label={`Breakdown costi: ${visible.map(s => `${s.label} ${Math.round((s.value / total) * 100)}%`).join(', ')}`}
      >
        {visible.map((seg, idx) => {
          const pct = (seg.value / total) * 100;
          return (
            <motion.div
              key={seg.key}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{
                duration: 0.7,
                delay: 0.15 + idx * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn('h-full', seg.colorClass)}
            />
          );
        })}
      </div>

      {showLegend && (
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {visible.map((seg) => {
            const pct = Math.round((seg.value / total) * 100);
            return (
              <div
                key={seg.key}
                className="flex items-center gap-1.5 text-[11px] tabular-nums text-muted-foreground"
              >
                <span className={cn('size-2 rounded-full', seg.colorClass)} />
                <span className="font-medium text-foreground">{seg.label}</span>
                <span>
                  {pct}
                  %
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
