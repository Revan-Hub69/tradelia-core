'use client';

import '@/features/simulator-v2/styles/tokens.css';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/utils/Helpers';

import { type AssetId, ASSETS } from '../data/assets';

export type { AssetId };

type AssetSelectorProps = {
  onSelectAction: (asset: AssetId) => void;
  className?: string;
};

export function AssetSelector({ onSelectAction, className }: AssetSelectorProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3',
        className,
      )}
      role="radiogroup"
      aria-label="Seleziona categoria asset"
    >
      {ASSETS.map((asset, idx) => (
        <motion.button
          key={asset.id}
          type="button"
          onClick={() => asset.available && onSelectAction(asset.id)}
          disabled={!asset.available}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05, duration: 0.3 }}
          whileHover={asset.available ? { scale: 1.02, y: -2 } : {}}
          whileTap={asset.available ? { scale: 0.98 } : {}}
          className={cn(
            'group relative flex flex-col items-center gap-3 rounded-xl p-4',
            'border border-border/60 bg-card/80',
            asset.available && 'hover:border-primary/30 hover:bg-popover',
            !asset.available && 'cursor-not-allowed opacity-60',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'transition-all duration-300 ease-out',
            'backdrop-blur-sm',
            asset.available && 'shadow-sm hover:shadow-lg hover:shadow-primary/5',
          )}
          aria-label={asset.available ? `Seleziona ${asset.label} - ${asset.desc}` : `${asset.label} - In arrivo`}
          role="radio"
          aria-disabled={!asset.available}
        >
          {/* Icon container with premium hover glow */}
          <div
            className={cn(
              'relative rounded-xl bg-muted p-3',
              'transition-all duration-300 ease-out',
              'group-hover:bg-secondary group-hover:scale-110',
              'group-hover:shadow-lg',
            )}
          >
            <asset.icon className={cn('size-6 transition-transform duration-300 group-hover:scale-105', asset.color)} />
            {/* Subtle glow on icon hover */}
            <div
              className="pointer-events-none absolute inset-0 rounded-xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-50"
              style={{
                background: `radial-gradient(circle at center, ${asset.id === 'forex' ? 'rgba(16, 185, 129, 0.4)' : asset.id === 'indices' ? 'rgba(59, 130, 246, 0.4)' : asset.id === 'equities' ? 'rgba(139, 92, 246, 0.4)' : asset.id === 'commodities' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(239, 68, 68, 0.4)'}, transparent 70%)`,
              }}
              aria-hidden="true"
            />
          </div>

          {/* Label */}
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">
              {asset.label}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{asset.desc}</p>
          </div>

          {/* Hover arrow */}
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute bottom-3 right-3"
            aria-hidden="true"
          >
            <ArrowRight className="size-4 text-muted-foreground/70 transition-colors group-hover:text-muted-foreground" />
          </motion.div>

          {/* Card glow effect - premium iOS 26 style */}
          {asset.available && (
            <div
              className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-all duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(140px circle at 50% 30%, ${asset.id === 'forex' ? 'rgba(16, 185, 129, 0.12)' : asset.id === 'indices' ? 'rgba(59, 130, 246, 0.12)' : asset.id === 'equities' ? 'rgba(139, 92, 246, 0.12)' : asset.id === 'commodities' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.12)'}, transparent 70%)`,
              }}
              aria-hidden="true"
            />
          )}

          {/* Coming Soon overlay for unavailable assets */}
          {!asset.available && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/40 backdrop-blur-[2px]"
              aria-hidden="true"
            >
              <span className="rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-lg">
                In arrivo
              </span>
            </div>
          )}
        </motion.button>
      ))}
    </div>
  );
}
