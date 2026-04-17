'use client';

import { motion } from 'framer-motion';

import { cn } from '@/utils/Helpers';

type CostItem = {
  label: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
};

type CostBreakdownChartProps = {
  costs: CostItem[];
  total: number;
  currency?: string;
  className?: string;
};

export function CostBreakdownChart({
  costs,
  total,
  currency = '€',
  className,
}: CostBreakdownChartProps) {
  const maxValue = Math.max(...costs.map(c => c.value), 1);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with total */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#a1a1aa]">Costo totale stimato</span>
        <span className="text-lg font-bold tabular-nums text-[#fafafa]">
          {currency}
          {total.toFixed(2)}
        </span>
      </div>

      {/* Horizontal bar chart */}
      <div className="space-y-3">
        {costs.map((cost, idx) => {
          const percentage = (cost.value / maxValue) * 100;
          const isSignificant = cost.value > total * 0.1;

          return (
            <div key={cost.label} className="space-y-1.5">
              {/* Label row */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {cost.icon && (
                    <span style={{ color: cost.color }}>{cost.icon}</span>
                  )}
                  <span className="text-[#d4d4d8]">{cost.label}</span>
                </div>
                <span
                  className={cn(
                    'tabular-nums',
                    isSignificant
                      ? 'text-[#fafafa] font-medium'
                      : 'text-[#a1a1aa]',
                  )}
                >
                  {currency}
                  {cost.value.toFixed(2)}
                </span>
              </div>

              {/* Bar */}
              <div className="h-2 overflow-hidden rounded-full bg-[#27272a]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{
                    delay: idx * 0.1,
                    duration: 0.5,
                    ease: 'easeOut',
                  }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: cost.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Percentage breakdown */}
      <div className="border-t border-[#27272a] pt-3">
        <div className="flex flex-wrap gap-2">
          {costs.map((cost) => {
            const pct = total > 0 ? (cost.value / total) * 100 : 0;
            if (pct < 1) {
 return null;
}

            return (
              <div
                key={`legend-${cost.label}`}
                className="flex items-center gap-1.5 rounded-md bg-[#18181b] px-2 py-1"
              >
                <div
                  className="size-2 rounded-full"
                  style={{ backgroundColor: cost.color }}
                />
                <span className="text-xs text-[#a1a1aa]">
                  {pct.toFixed(0)}
%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
