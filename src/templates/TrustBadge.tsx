'use client';

import { Shield } from 'lucide-react';

import { FadeIn } from '@/components/ui/scroll-animations';

export const TrustBadge = () => (
  <FadeIn delay={600}>
    <div className="mt-6 flex items-center justify-center sm:mt-8">
      <div className="inline-flex items-center gap-2.5 rounded-full border border-border/40 bg-background/60 px-4 py-2 shadow-sm backdrop-blur-sm sm:gap-3 sm:px-5 sm:py-2.5">
        <div className="flex size-5 items-center justify-center rounded-full bg-emerald-500/10 sm:size-6">
          <Shield className="size-3 text-emerald-400 sm:size-3.5" />
        </div>
        <span className="text-xs font-medium text-muted-foreground sm:text-sm">
          Allineato con le linee guida ESMA 2026
        </span>
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
      </div>
    </div>
  </FadeIn>
);
