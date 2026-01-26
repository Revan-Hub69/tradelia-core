'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  Info,
  TrendingUp,
} from 'lucide-react';

import type { Challenge } from '@/types/challenge';

type ChallengeCardProps = {
  challenge: Challenge;
  onViewDetails: (challenge: Challenge) => void;
  onCompareToggle: (id: string) => void;
  isComparing: boolean;
}

export function ChallengeCard({ 
  challenge, 
  onViewDetails, 
  onCompareToggle,
  isComparing 
}: ChallengeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatAccountSize = (size: number) => {
    if (size >= 1000000) return `$${(size / 1000000).toFixed(1)}M`;
    if (size >= 1000) return `$${(size / 1000).toFixed(0)}K`;
    return `$${size}`;
  };

  const getPayoutSpeedLabel = (speed: string) => {
    const labels: Record<string, string> = {
      instant: 'Instant',
      same_day: 'Same Day',
      '24_hours': '24h',
      weekly: 'Weekly',
      bi_weekly: 'Bi-weekly',
    };
    return labels[speed] || speed;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Card Container */}
      <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
        
        {/* Free Badge */}
        {challenge.is_free && (
          <div className="absolute right-4 top-4 z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg"
            >
              FREE
            </motion.div>
          </div>
        )}

        {/* Compare Checkbox */}
        <div className="absolute left-4 top-4 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCompareToggle(challenge.id)}
            className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all ${
              isComparing
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background/80 backdrop-blur-sm hover:border-primary'
            }`}
          >
            {isComparing && <CheckCircle2 className="h-4 w-4" />}
          </motion.button>
        </div>

        {/* Card Content */}
        <div className="p-6 pt-14">
          
          {/* Prop Firm Logo & Name */}
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              {/* Placeholder logo - replace with actual logo */}
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {challenge.prop_firms.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Award className="h-3 w-3" />
                <span>{challenge.prop_firms.reputation}% reputation</span>
              </div>
            </div>
          </div>

          {/* Challenge Name */}
          <h4 className="mb-2 line-clamp-2 text-lg font-bold text-foreground">
            {challenge.name}
          </h4>

          {/* Description */}
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {challenge.description}
          </p>

          {/* Key Metrics Grid */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            
            {/* Account Size */}
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                <span>Account</span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {formatAccountSize(challenge.account_size)}
              </div>
            </div>

            {/* Entry Fee */}
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Entry</span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {challenge.is_free 
                  ? 'FREE' 
                  : formatCurrency(challenge.entry_fee!, challenge.currency)
                }
              </div>
            </div>

            {/* Profit Split */}
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="mb-1 text-xs text-muted-foreground">
                Profit Split
              </div>
              <div className="text-lg font-bold text-foreground">
                {challenge.profit_split.initial}%
                {challenge.profit_split.scaled && (
                  <span className="text-sm text-muted-foreground">
                    {' '}→ {challenge.profit_split.scaled}%
                  </span>
                )}
              </div>
            </div>

            {/* Payout Speed */}
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="mb-1 text-xs text-muted-foreground">
                Payout
              </div>
              <div className="text-sm font-bold text-foreground">
                {getPayoutSpeedLabel(challenge.payout_speed)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewDetails(challenge)}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <span className="flex items-center justify-center gap-2">
                <Info className="h-4 w-4" />
                Details
              </span>
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={challenge.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
            >
              <ExternalLink className="h-4 w-4" />
            </motion.a>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent"
        />
      </div>
    </motion.div>
  );
}
