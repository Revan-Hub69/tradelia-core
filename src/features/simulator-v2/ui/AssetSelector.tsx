'use client';

import '@/features/simulator-v2/styles/tokens.css';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Building2,
  Coins,
  Globe,
  Wheat,
} from 'lucide-react';

import { cn } from '@/utils/Helpers';

export type AssetId =
  | 'forex'
  | 'indices'
  | 'equities'
  | 'commodities'
  | 'crypto';

type Asset = {
  id: AssetId;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
};

const ASSETS: Asset[] = [
  {
    id: 'forex',
    label: 'Forex',
    desc: 'Major, Cross & Esotico',
    icon: Globe,
    color: 'text-[#10b981]',
    gradient: 'from-[#10b981]/20 to-[#14b8a6]/5',
  },
  {
    id: 'indices',
    label: 'Indici',
    desc: 'US, EU & Asia',
    icon: BarChart3,
    color: 'text-[#3b82f6]',
    gradient: 'from-[#3b82f6]/20 to-[#06b6d4]/5',
  },
  {
    id: 'equities',
    label: 'Azioni',
    desc: 'US, EU & Asia Large Cap',
    icon: Building2,
    color: 'text-[#8b5cf6]',
    gradient: 'from-[#8b5cf6]/20 to-[#06b6d4]/5',
  },
  {
    id: 'commodities',
    label: 'Commodity',
    desc: 'Metalli & Energia',
    icon: Wheat,
    color: 'text-[#f59e0b]',
    gradient: 'from-[#f59e0b]/20 to-[#ef4444]/5',
  },
  {
    id: 'crypto',
    label: 'Crypto',
    desc: 'Major & Altcoin',
    icon: Coins,
    color: 'text-[#ef4444]',
    gradient: 'from-[#ef4444]/20 to-[#8b5cf6]/5',
  },
];

type AssetSelectorProps = {
  onSelect: (asset: AssetId) => void;
  className?: string;
};

export function AssetSelector({ onSelect, className }: AssetSelectorProps) {
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
          onClick={() => onSelect(asset.id)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05, duration: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'group relative flex flex-col items-center gap-3 rounded-xl p-4',
            'border border-border/60 bg-card',
            'hover:border-border hover:bg-popover',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'transition-all duration-200 ease-out',
            'backdrop-blur-sm',
          )}
          aria-label={`Seleziona ${asset.label} - ${asset.desc}`}
          role="radio"
        >
          {/* Icon container */}
          <div
            className={cn(
              'rounded-lg bg-muted p-3',
              'transition-colors duration-200 group-hover:bg-secondary',
            )}
          >
            <asset.icon className={cn('size-6', asset.color)} />
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

          {/* Glow effect - SOTA 2026 brand glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(120px circle at 50% 50%, ${asset.id === 'forex' ? 'rgba(16, 185, 129, 0.15)' : asset.id === 'indices' ? 'rgba(59, 130, 246, 0.15)' : asset.id === 'equities' ? 'rgba(139, 92, 246, 0.15)' : asset.id === 'commodities' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)'}, transparent 60%)`,
            }}
            aria-hidden="true"
          />
        </motion.button>
      ))}
    </div>
  );
}
