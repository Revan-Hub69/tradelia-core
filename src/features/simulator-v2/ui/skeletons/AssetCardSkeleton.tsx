'use client';

import { motion } from 'framer-motion';

import { cn } from '@/utils/Helpers';

type AssetCardSkeletonProps = {
  count?: number;
  className?: string;
};

export function AssetCardSkeleton({
  count = 5,
  className,
}: AssetCardSkeletonProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3',
        className,
      )}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: idx * 0.05 }}
          className={cn(
            'flex flex-col items-center gap-3 p-4 rounded-xl',
            'bg-[#18181b] border border-[#27272a]',
            'animate-pulse',
          )}
        >
          {/* Icon placeholder */}
          <div className="rounded-lg bg-[#27272a] p-3">
            <div className="size-6 rounded bg-[#3f3f46]" />
          </div>

          {/* Text placeholders */}
          <div className="space-y-2 text-center">
            <div className="mx-auto h-4 w-16 rounded bg-[#27272a]" />
            <div className="mx-auto h-3 w-20 rounded bg-[#3f3f46]" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
