'use client';

import { motion } from 'framer-motion';
import { Check, ChevronLeft, Info, Pencil, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/Helpers';

import type { BrokerResult, SimulatorInput } from '../state/useSimulatorState';
import { BrokerCard } from './BrokerCard';

type EditableField = 'capital' | 'lotSize' | 'tradesPerMonth' | 'exposureDaysPerMonth';

type CompareViewProps = {
  results: BrokerResult[];
  input: SimulatorInput;
  onSelectBroker: (brokerId: string) => void;
  onBack: () => void;
  onClose: () => void;
  onUpdateInput?: (patch: Partial<SimulatorInput>) => void;
};

export function CompareView({
  results,
  input,
  onSelectBroker,
  onBack,
  onClose,
  onUpdateInput,
}: CompareViewProps) {
  // Multi-expand: set di broker aperti. Winner aperto di default.
  const winnerId = results.find(r => r.isWinner)?.id;
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(winnerId ? [winnerId] : []),
  );
  const [editingField, setEditingField] = useState<EditableField | null>(null);

  const commitEdit = (field: EditableField, raw: string) => {
    setEditingField(null);
    if (!onUpdateInput) {
      return;
    }
    const num = Number.parseFloat(raw.replace(',', '.'));
    if (Number.isNaN(num) || num < 0) {
      return;
    }
    // Clamp esposizione 0-25
    const value = field === 'exposureDaysPerMonth' ? Math.min(25, Math.max(0, Math.round(num))) : num;
    if (value === input[field]) {
      return;
    }
    onUpdateInput({ [field]: value });
  };

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const eligible = results.filter(r => r.isEligible);
  const locked = results.filter(r => !r.isEligible);

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 bg-card/80 px-5 py-3 backdrop-blur-sm">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Torna al wizard"
        >
          <ChevronLeft className="size-4" />
          Modifica
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex size-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Risultati
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Chiudi"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Context recap — ogni valore editabile inline via matita */}
      <div className="border-b border-border/40 bg-muted/20 px-5 py-2.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          <EditableBadge
            label="Capitale"
            value={`€${input.capital.toLocaleString('it-IT')}`}
            rawValue={String(input.capital)}
            suffix="€"
            isEditing={editingField === 'capital'}
            onStartEdit={() => setEditingField('capital')}
            onCommit={raw => commitEdit('capital', raw)}
            onCancel={() => setEditingField(null)}
          />
          <EditableBadge
            label="Lotto"
            value={`${input.lotSize}`}
            rawValue={String(input.lotSize)}
            step={0.01}
            isEditing={editingField === 'lotSize'}
            onStartEdit={() => setEditingField('lotSize')}
            onCommit={raw => commitEdit('lotSize', raw)}
            onCancel={() => setEditingField(null)}
          />
          <EditableBadge
            label="Trade/mese"
            value={String(input.tradesPerMonth)}
            rawValue={String(input.tradesPerMonth)}
            step={1}
            isEditing={editingField === 'tradesPerMonth'}
            onStartEdit={() => setEditingField('tradesPerMonth')}
            onCommit={raw => commitEdit('tradesPerMonth', raw)}
            onCancel={() => setEditingField(null)}
          />
          <EditableBadge
            label="Overnight"
            value={input.exposureDaysPerMonth > 0 ? `${input.exposureDaysPerMonth}gg` : 'Intraday'}
            rawValue={String(input.exposureDaysPerMonth)}
            step={1}
            highlight
            isEditing={editingField === 'exposureDaysPerMonth'}
            onStartEdit={() => setEditingField('exposureDaysPerMonth')}
            onCommit={raw => commitEdit('exposureDaysPerMonth', raw)}
            onCancel={() => setEditingField(null)}
          />
          {input.pairSymbol && (
            <Badge label="Coppia" value={input.pairSymbol} />
          )}
        </div>
      </div>

      {/* Cards list */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {eligible.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {eligible.map(broker => (
              <BrokerCard
                key={broker.id}
                broker={broker}
                isOpen={openIds.has(broker.id)}
                onToggle={() => toggle(broker.id)}
                onOpenDetail={() => onSelectBroker(broker.id)}
                lotSize={input.lotSize}
                tradesPerMonth={input.tradesPerMonth}
              />
            ))}
          </motion.div>
        )}

        {locked.length > 0 && (
          <div className="pt-2">
            <div className="mb-2 flex items-center gap-2 px-1">
              <div className="h-px flex-1 bg-border/40" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Non accessibili con il tuo capitale
              </span>
              <div className="h-px flex-1 bg-border/40" />
            </div>
            <div className="space-y-2">
              {locked.map(broker => (
                <BrokerCard
                  key={broker.id}
                  broker={broker}
                  isOpen={false}
                  onToggle={() => {}}
                  onOpenDetail={() => onSelectBroker(broker.id)}
                  lotSize={input.lotSize}
                  tradesPerMonth={input.tradesPerMonth}
                  locked
                />
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className={cn(
          'mt-2 flex items-start gap-2 rounded-xl border border-border/40 bg-muted/20 p-3',
          'text-[11px] leading-5 text-muted-foreground',
        )}
        >
          <Info className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/70" />
          <p>
            Costi calcolati su spread e commissioni tipiche
            {' '}
            <strong className="text-foreground/80">rilevate sui broker</strong>
            {' '}
            (snapshot aggregato, non real-time). Non include funding overnight, slippage e fee di deposito/prelievo — questi fattori sono riportati come
            {' '}
            <strong className="text-foreground/80">stime indicative</strong>
            {' '}
            nelle schede espanse.
          </p>
        </div>
      </div>
    </div>
  );
}

function Badge({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        highlight && 'rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5',
      )}
    >
      <span className={cn('text-muted-foreground/70', highlight && 'text-primary/80')}>{label}</span>
      <span className={cn('font-medium', highlight ? 'text-primary' : 'text-foreground')}>{value}</span>
    </span>
  );
}

type EditableBadgeProps = {
  label: string;
  value: string;
  rawValue: string;
  step?: number;
  suffix?: string;
  highlight?: boolean;
  isEditing: boolean;
  onStartEdit: () => void;
  onCommit: (raw: string) => void;
  onCancel: () => void;
};

function EditableBadge({
  label,
  value,
  rawValue,
  step = 1,
  highlight,
  isEditing,
  onStartEdit,
  onCommit,
  onCancel,
}: EditableBadgeProps) {
  const [draft, setDraft] = useState(rawValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setDraft(rawValue);
      // Focus + select on next tick
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [isEditing, rawValue]);

  if (isEditing) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full border px-2 py-0.5',
          highlight ? 'border-primary/40 bg-primary/10' : 'border-primary/30 bg-primary/5',
        )}
      >
        <span className={cn('text-[10px] uppercase tracking-wider', highlight ? 'text-primary/80' : 'text-muted-foreground/70')}>
          {label}
        </span>
        <input
          ref={inputRef}
          type="number"
          inputMode="decimal"
          step={step}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onCommit(draft);
            } else if (e.key === 'Escape') {
              onCancel();
            }
          }}
          onBlur={() => onCommit(draft)}
          className="w-16 bg-transparent text-xs font-semibold text-foreground outline-none"
        />
        <button
          type="button"
          onMouseDown={e => e.preventDefault()}
          onClick={() => onCommit(draft)}
          className="text-primary hover:text-primary/80"
          aria-label="Conferma"
        >
          <Check className="size-3" />
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onStartEdit}
      className={cn(
        'group inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-0.5 transition-colors',
        'hover:border-border/60 hover:bg-card/60',
        highlight && 'border-primary/30 bg-primary/10 hover:border-primary/40',
      )}
      aria-label={`Modifica ${label}`}
    >
      <span className={cn('text-[10px] uppercase tracking-wider', highlight ? 'text-primary/80' : 'text-muted-foreground/70')}>
        {label}
      </span>
      <span className={cn('text-xs font-semibold', highlight ? 'text-primary' : 'text-foreground')}>
        {value}
      </span>
      <Pencil className={cn(
        'size-3 transition-opacity group-hover:opacity-100',
        highlight ? 'text-primary/80' : 'text-muted-foreground',
      )}
      />
    </button>
  );
}
