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
          <span className="inline-flex size-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Motore · live
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Step 1 / 3
        </p>
      </div>

      {/* Prompt */}
      <p className="mb-4 text-sm text-muted-foreground">
        Scegli un'asset class CFD per avviare la simulazione
      </p>

      {/* Asset Grid */}
      <AssetSelector onSelect={handleAssetSelect} />

      {/* Footnote */}
      <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
        <ArrowRight className="size-3.5 text-primary" />
        <span>Wizard · confronto broker · breakdown costi</span>
      </div>

      {/* Simulator Shell */}
      <SimulatorShell isOpen={state.isOpen} onClose={close} />
    </div>
  );
}
