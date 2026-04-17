'use client';

import '@/features/simulator-v2/styles/tokens.css';

import { motion } from 'framer-motion';
import { Calculator, Shield, Sparkles, TrendingUp } from 'lucide-react';

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
    <div className={className}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div
          className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2"
          style={{
            background:
              'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(20, 184, 166, 0.1))',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
        >
          <Sparkles className="size-4 text-[#10b981]" />
          <span className="text-sm font-medium text-[#14b8a6]">
            Simulatore 2026
          </span>
        </div>

        <h2 className="mb-3 text-2xl font-bold text-[#fafafa] sm:text-3xl">
          Confronta i costi di trading
        </h2>
        <p className="mx-auto max-w-lg text-[#a1a1aa]">
          Seleziona un asset per iniziare. Analizzeremo spread, commissioni e
          slippage per trovare il broker più conveniente per il tuo stile di
          trading.
        </p>
      </motion.div>

      {/* Asset Grid */}
      <AssetSelector onSelect={handleAssetSelect} />

      {/* Info cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <InfoCard
          icon={Calculator}
          title="Costi reali"
          description="Calcoliamo spread, commissioni, slippage e swap per ogni broker"
          color="#10b981"
        />
        <InfoCard
          icon={TrendingUp}
          title="Personalizzato"
          description="Inserisci capitale, frequenza e dimensione per risultati su misura"
          color="#8b5cf6"
        />
        <InfoCard
          icon={Shield}
          title="Imparziale"
          description="Algoritmo indipendente. Nessun broker paga per essere primo"
          color="#3b82f6"
        />
      </motion.div>

      {/* Simulator Shell */}
      <SimulatorShell isOpen={state.isOpen} onClose={close} />
    </div>
  );
}

type InfoCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
};

function InfoCard({ icon: Icon, title, description, color }: InfoCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#27272a] bg-[#18181b] p-4 transition-colors duration-200 hover:border-[#3f3f46]">
      <div className="rounded-lg p-2" style={{ backgroundColor: `${color}20` }}>
        <Icon className="size-4" style={{ color }} />
      </div>
      <div>
        <h4 className="mb-1 text-sm font-medium text-[#fafafa]">{title}</h4>
        <p className="text-xs leading-relaxed text-[#a1a1aa]">{description}</p>
      </div>
    </div>
  );
}
