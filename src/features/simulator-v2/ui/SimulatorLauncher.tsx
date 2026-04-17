'use client';

import '@/features/simulator-v2/styles/tokens.css';

import { ArrowRight } from 'lucide-react';

import { cn } from '@/utils/Helpers';

import { useSimulatorState } from '../state/useSimulatorState';
import { type AssetId, AssetSelector } from './AssetSelector';
import { SimulatorShell } from './SimulatorShell';

type SimulatorLauncherProps = {
  className?: string;
};

export function SimulatorLauncher({ className }: SimulatorLauncherProps) {
  const { state, open, close } = useSimulatorState();

  const handleAssetSelect = (assetId: AssetId) => {
    open(assetId);
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Toolbar */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative inline-flex size-2 rounded-full bg-primary">
            <span className="absolute inset-0 inline-flex size-2 animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
          </span>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Motore · live
          </p>
        </div>
        <p className="text-xs text-muted-foreground/70">
          Step 1 / 3
        </p>
      </div>

      {/* Prompt */}
      <p className="mb-4 text-sm text-muted-foreground">
        Seleziona un asset per avviare la simulazione
      </p>

      {/* Asset Grid */}
      <AssetSelector onSelect={handleAssetSelect} />

      {/* Footnote with enhanced styling */}
      <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground/80">
        <ArrowRight className="size-3.5 text-primary transition-transform duration-300 group-hover:translate-x-1" />
        <span className="font-medium">Wizard · confronto broker · breakdown costi</span>
      </div>

      {/* Simulator Shell */}
      <SimulatorShell isOpen={state.isOpen} onClose={close} />
    </div>
  );
}
