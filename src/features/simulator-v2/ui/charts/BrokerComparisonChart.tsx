'use client';

import { motion } from 'framer-motion';

import { cn } from '@/utils/Helpers';

type BrokerData = {
  id: string;
  name: string;
  totalCost: number;
  spreadCost: number;
  commissionCost: number;
  fundingCost: number;
  otherCost: number;
  isWinner?: boolean;
};

type BrokerComparisonChartProps = {
  brokers: BrokerData[];
  currency?: string;
  className?: string;
};

export function BrokerComparisonChart({
  brokers,
  currency = '€',
  className,
}: BrokerComparisonChartProps) {
  const sortedBrokers = [...brokers].sort((a, b) => a.totalCost - b.totalCost);
  const maxCost = Math.max(...brokers.map(b => b.totalCost), 1);
  const minCost = Math.min(...brokers.map(b => b.totalCost));

  return (
    <div className={cn('space-y-4', className)}>
      <h4 className="text-sm font-medium text-[#fafafa]">
        Confronto costi mensili
      </h4>

      <div className="space-y-3">
        {sortedBrokers.map((broker, idx) => {
          const barWidth = (broker.totalCost / maxCost) * 100;
          const savings = broker.totalCost - minCost;

          return (
            <motion.div
              key={broker.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                'relative p-3 rounded-xl border',
                broker.isWinner
                  ? 'bg-[#10b981]/10 border-[#10b981]/30'
                  : 'bg-[#18181b] border-[#27272a]',
              )}
            >
              {/* Winner badge */}
              {broker.isWinner && (
                <div className="absolute -top-2 left-3 rounded-full bg-[#10b981] px-2 py-0.5 text-xs font-bold text-[#09090b]">
                  Miglior scelta
                </div>
              )}

              {/* Broker name and cost */}
              <div className="mb-2 flex items-center justify-between">
                <span
                  className={cn(
                    'font-medium',
                    broker.isWinner ? 'text-[#10b981]' : 'text-[#fafafa]',
                  )}
                >
                  {broker.name}
                </span>
                <div className="text-right">
                  <span className="text-lg font-bold tabular-nums text-[#fafafa]">
                    {currency}
                    {broker.totalCost.toFixed(0)}
                  </span>
                  <span className="text-xs text-[#71717a]">/mese</span>
                </div>
              </div>

              {/* Stacked bar */}
              <div className="flex h-3 overflow-hidden rounded-full bg-[#27272a]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(broker.spreadCost / broker.totalCost) * barWidth}%`,
                  }}
                  transition={{ delay: idx * 0.1 + 0.2, duration: 0.4 }}
                  className="h-full bg-[#3b82f6]"
                  title="Spread"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(broker.commissionCost / broker.totalCost) * barWidth}%`,
                  }}
                  transition={{ delay: idx * 0.1 + 0.3, duration: 0.4 }}
                  className="h-full bg-[#8b5cf6]"
                  title="Commissioni"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(broker.fundingCost / broker.totalCost) * barWidth}%`,
                  }}
                  transition={{ delay: idx * 0.1 + 0.4, duration: 0.4 }}
                  className="h-full bg-[#f59e0b]"
                  title="Funding / overnight"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(broker.otherCost / broker.totalCost) * barWidth}%`,
                  }}
                  transition={{ delay: idx * 0.1 + 0.5, duration: 0.4 }}
                  className="h-full bg-[#ef4444]"
                  title="Altri costi"
                />
              </div>

              {/* Savings indicator (for non-winners) */}
              {!broker.isWinner && savings > 0 && (
                <div className="mt-2 text-xs text-[#ef4444]">
                  +
{currency}
                  {savings.toFixed(0)}
{' '}
rispetto al migliore
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-2">
        <LegendItem color="#3b82f6" label="Spread" />
        <LegendItem color="#8b5cf6" label="Commissioni" />
        <LegendItem color="#f59e0b" label="Funding" />
        <LegendItem color="#ef4444" label="Altri" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs text-[#a1a1aa]">{label}</span>
    </div>
  );
}
