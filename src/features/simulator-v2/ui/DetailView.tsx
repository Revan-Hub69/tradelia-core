'use client';

import {
  ChevronLeft,
  Clock,
  ExternalLink,
  Shield,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';

import { cn } from '@/utils/Helpers';

import type { MockResult } from '../state/useSimulatorState';

type DetailViewProps = {
  broker: MockResult;
  onBack: () => void;
  onClose: () => void;
};

// Mock breakdown data
const MOCK_BREAKDOWN = {
  spread: { eur: 1.8, bps: 1.2, percent: 40 },
  commission: { eur: 0.7, bps: 0.5, percent: 15 },
  slippage: { eur: 1.2, bps: 0.8, percent: 25 },
  other: { eur: 0.6, bps: 0.4, percent: 20 },
};

export function DetailView({ broker, onBack, onClose }: DetailViewProps) {
  return (
    <div className="flex h-full flex-col bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg p-2 transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="size-5 text-slate-400" />
        </button>

        <h2 className="font-semibold text-white">Dettaglio</h2>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 transition-colors hover:bg-white/10"
        >
          <svg
            className="size-5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="p-6 pb-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-bold text-white">
              {broker.brokerName.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {broker.brokerName}
              </h1>
              <p className="text-sm text-slate-400">
                {broker.accountType}
{' '}
Account
              </p>
            </div>
          </div>

          {/* Score badge */}
          <div className="mb-4 flex items-center gap-2">
            <div
              className={cn(
                'px-3 py-1 rounded-full text-sm font-semibold',
                broker.score >= 90
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : broker.score >= 70
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-amber-500/20 text-amber-400',
              )}
            >
              Score
{' '}
{broker.score}
/100
            </div>
            {broker.rank === 1 && (
              <div className="rounded-full bg-amber-500/20 px-3 py-1 text-sm font-semibold text-amber-400">
                Best Choice
              </div>
            )}
          </div>
        </div>

        {/* Cost Overview */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/5 bg-slate-800/50 p-4">
              <p className="mb-1 text-xs text-slate-400">Costo mensile</p>
              <p className="text-2xl font-bold text-white">
                €
{broker.costPerMonth}
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-slate-800/50 p-4">
              <p className="mb-1 text-xs text-slate-400">A trade</p>
              <p className="text-2xl font-bold text-white">
                €
{broker.costPerTrade}
              </p>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="px-6 pb-6">
          <h3 className="mb-3 text-sm font-semibold text-white">
            Breakdown costi
          </h3>
          <div className="space-y-3">
            <CostBar
              label="Spread"
              value={MOCK_BREAKDOWN.spread}
              icon={TrendingUp}
              color="bg-blue-500"
            />
            <CostBar
              label="Commissioni"
              value={MOCK_BREAKDOWN.commission}
              icon={Wallet}
              color="bg-violet-500"
            />
            <CostBar
              label="Slippage"
              value={MOCK_BREAKDOWN.slippage}
              icon={Clock}
              color="bg-amber-500"
            />
            <CostBar
              label="Altro"
              value={MOCK_BREAKDOWN.other}
              icon={TrendingDown}
              color="bg-slate-500"
            />
          </div>
        </div>

        {/* Info cards */}
        <div className="space-y-3 px-6 pb-6">
          <InfoCard
            title="Margin Requirement"
            value="3.33%"
            subtitle="€333 per €10k exposure"
            icon={Shield}
          />
          <InfoCard
            title="Overnight/Swap"
            value="-0.5 pips"
            subtitle="Long position daily cost"
            icon={Clock}
          />
        </div>

        {/* CTA */}
        <div className="p-6 pt-2">
          <button
            type="button"
            className={cn(
              'w-full flex items-center justify-center gap-2 py-4 px-6',
              'rounded-xl font-semibold text-slate-900',
              'bg-gradient-to-r from-emerald-400 to-teal-400',
              'hover:from-emerald-300 hover:to-teal-300',
              'transition-all shadow-lg shadow-emerald-500/20',
            )}
          >
            Apri Conto
{' '}
{broker.brokerName}
            <ExternalLink className="size-4" />
          </button>

          <button
            type="button"
            onClick={onBack}
            className="mt-3 w-full py-3 text-sm text-slate-400 transition-colors hover:text-white"
          >
            Torna ai risultati
          </button>
        </div>
      </div>
    </div>
  );
}

type CostBarProps = {
  label: string;
  value: { eur: number; bps: number; percent: number };
  icon: React.ElementType;
  color: string;
};

function CostBar({ label, value, icon: Icon, color }: CostBarProps) {
  return (
    <div className="rounded-lg border border-white/5 bg-slate-800/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-slate-400" />
          <span className="text-sm text-slate-300">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-white">
€
{value.eur}
          </span>
          <span className="ml-1 text-xs text-slate-500">
(
{value.bps}
{' '}
bps)
          </span>
        </div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-700">
        <div
          className={cn('h-full rounded-full', color)}
          style={{ width: `${value.percent}%` }}
        />
      </div>
    </div>
  );
}

type InfoCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
};

function InfoCard({ title, value, subtitle, icon: Icon }: InfoCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-slate-800/30 p-3">
      <div className="rounded-lg bg-slate-700/50 p-2">
        <Icon className="size-4 text-slate-400" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-400">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-white">{value}</span>
          <span className="text-xs text-slate-500">{subtitle}</span>
        </div>
      </div>
    </div>
  );
}
