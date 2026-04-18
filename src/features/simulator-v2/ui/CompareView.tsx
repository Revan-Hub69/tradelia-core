'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, Info, Pencil, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/Helpers';

import { FOREX_PAIRS } from '../data/forex-pairs';
import type { BrokerResult, SimulatorInput } from '../state/useSimulatorState';
import { formatEURWhole } from '../utils/format';
import { BrokerCard } from './BrokerCard';
import { CurrencyFlag } from './CurrencyFlag';
import { TRANSITION } from './motion';
import { PairSelector } from './PairSelector';

type EditableField = 'capital' | 'lotSize' | 'tradesPerMonth' | 'exposureDaysPerMonth';

type CompareViewProps = {
  results: BrokerResult[];
  input: SimulatorInput;
  onSelectBrokerAction: (brokerId: string) => void;
  onBackAction: () => void;
  onCloseAction: () => void;
  onUpdateInputAction?: (patch: Partial<SimulatorInput>) => void;
};

export function CompareView({
  results,
  input,
  onSelectBrokerAction,
  onBackAction,
  onCloseAction,
  onUpdateInputAction,
}: CompareViewProps) {
  // Multi-expand: set di broker aperti. Winner aperto di default.
  const winnerId = results.find(r => r.isWinner)?.id;
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(winnerId ? [winnerId] : []),
  );
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [isEditingPair, setIsEditingPair] = useState(false);

  // Bottom dashboard editing state (mobile-only expand)
  const [bottomExpanded, setBottomExpanded] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const commitEdit = (field: EditableField, raw: string) => {
    setEditingField(null);
    if (!onUpdateInputAction) {
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
    onUpdateInputAction({ [field]: value });
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
    <div className="relative flex h-full flex-col overflow-hidden bg-background text-foreground">
      {/* Header fisso — minimal, no scroll-aware */}
      <div className="flex items-center justify-between border-b border-border/60 bg-card/80 px-4 py-3 backdrop-blur-md">
        <button
          type="button"
          onClick={onBackAction}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Torna al wizard"
        >
          <ChevronLeft className="size-4" />
          Modifica
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex size-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Risultati
          </p>
        </div>

        <button
          type="button"
          onClick={onCloseAction}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Chiudi"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Context recap — editable badges (desktop only, sticky) */}
      <div className="hidden border-b border-border/40 bg-muted/40 px-5 py-2.5 backdrop-blur-md lg:block">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          <EditableBadge
            label="Capitale"
            value={formatEURWhole(input.capital)}
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
            <EditablePairBadge
              value={input.pairSymbol}
              isEditing={isEditingPair}
              onStartEdit={() => setIsEditingPair(true)}
              onCancel={() => setIsEditingPair(false)}
            />
          )}
        </div>

        <AnimatePresence initial={false}>
          {isEditingPair && (
            <motion.div
              key="pair-editor"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={TRANSITION.standard}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-xl border border-border/60 bg-card/80 p-3 backdrop-blur-sm">
                <PairSelector
                  value={input.pairSymbol ?? null}
                  onSelectAction={(symbol) => {
                    setIsEditingPair(false);
                    if (symbol !== input.pairSymbol) {
                      onUpdateInputAction?.({ pairSymbol: symbol });
                    }
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cards list — scroll container */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
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
                onToggleAction={() => toggle(broker.id)}
                onOpenDetailAction={() => onSelectBrokerAction(broker.id)}
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
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
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
                  onToggleAction={() => {}}
                  onOpenDetailAction={() => onSelectBrokerAction(broker.id)}
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

      {/* Bottom Fixed Dashboard — mobile only (< lg)
          Pattern: compact summary bar che espande in editing overlay quando tap.
          Mantiene contesto sempre visibile mentre si confrontano i broker. */}
      <div className="border-t border-border/60 bg-card/95 backdrop-blur-md lg:hidden">
        {/* Collapsed state: compact param bar */}
        <AnimatePresence mode="wait">
          {!bottomExpanded && (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={TRANSITION.standard}
              className="flex items-center justify-between px-4 py-2.5"
            >
              <div className="flex items-center gap-3 overflow-x-auto">
                <CompactParam
                  icon={<span className="text-[10px]">💶</span>}
                  value={formatEURWhole(input.capital)}
                  onClick={() => {
 setBottomExpanded(true); setEditingField('capital');
}}
                />
                <CompactParam
                  icon={<span className="text-[10px]">📊</span>}
                  value={input.lotSize.toFixed(2)}
                  onClick={() => {
 setBottomExpanded(true); setEditingField('lotSize');
}}
                />
                <CompactParam
                  icon={<span className="text-[10px]">🔁</span>}
                  value={`${input.tradesPerMonth}`}
                  onClick={() => {
 setBottomExpanded(true); setEditingField('tradesPerMonth');
}}
                />
                <CompactParam
                  icon={<span className="text-[10px]">{input.exposureDaysPerMonth > 0 ? '🌙' : '☀️'}</span>}
                  value={input.exposureDaysPerMonth > 0 ? `${input.exposureDaysPerMonth}gg` : 'Intraday'}
                  onClick={() => {
 setBottomExpanded(true); setEditingField('exposureDaysPerMonth');
}}
                  highlight={input.exposureDaysPerMonth > 0}
                />
                {input.pairSymbol && (
                  <CompactParam
                    icon={(
                      <span className="flex -space-x-1">
                        <CurrencyFlag code={FOREX_PAIRS.find(p => p.symbol === input.pairSymbol)?.base ?? 'EUR'} size="xs" />
                        <CurrencyFlag code={FOREX_PAIRS.find(p => p.symbol === input.pairSymbol)?.quote ?? 'USD'} size="xs" />
                      </span>
                    )}
                    value={input.pairSymbol}
                    onClick={() => {
 setBottomExpanded(true); setIsEditingPair(true);
}}
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => setBottomExpanded(true)}
                className="ml-3 flex shrink-0 items-center gap-1 rounded-lg bg-muted px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Modifica parametri"
              >
                <SlidersHorizontal className="size-3.5" />
                <span className="hidden sm:inline">Modifica</span>
              </button>
            </motion.div>
          )}

          {/* Expanded state: inline editing drawer */}
          {bottomExpanded && (
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={TRANSITION.enter}
              className="overflow-hidden"
            >
              <div className="space-y-3 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Parametri simulazione
                  </span>
                  <button
                    type="button"
                    onClick={() => {
 setBottomExpanded(false); setEditingField(null); setIsEditingPair(false);
}}
                    className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Chiudi editing"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Grid editing pills */}
                <div className="grid grid-cols-2 gap-2">
                  <EditableBadge
                    label="Capitale"
                    value={formatEURWhole(input.capital)}
                    rawValue={String(input.capital)}
                    suffix="€"
                    isEditing={editingField === 'capital'}
                    onStartEdit={() => setEditingField('capital')}
                    onCommit={(raw) => {
 commitEdit('capital', raw); setBottomExpanded(false);
}}
                    onCancel={() => {
 setEditingField(null); setBottomExpanded(false);
}}
                  />
                  <EditableBadge
                    label="Lotto"
                    value={`${input.lotSize}`}
                    rawValue={String(input.lotSize)}
                    step={0.01}
                    isEditing={editingField === 'lotSize'}
                    onStartEdit={() => setEditingField('lotSize')}
                    onCommit={(raw) => {
 commitEdit('lotSize', raw); setBottomExpanded(false);
}}
                    onCancel={() => {
 setEditingField(null); setBottomExpanded(false);
}}
                  />
                  <EditableBadge
                    label="Trade/mese"
                    value={String(input.tradesPerMonth)}
                    rawValue={String(input.tradesPerMonth)}
                    step={1}
                    isEditing={editingField === 'tradesPerMonth'}
                    onStartEdit={() => setEditingField('tradesPerMonth')}
                    onCommit={(raw) => {
 commitEdit('tradesPerMonth', raw); setBottomExpanded(false);
}}
                    onCancel={() => {
 setEditingField(null); setBottomExpanded(false);
}}
                  />
                  <EditableBadge
                    label="Overnight"
                    value={input.exposureDaysPerMonth > 0 ? `${input.exposureDaysPerMonth}gg` : 'Intraday'}
                    rawValue={String(input.exposureDaysPerMonth)}
                    step={1}
                    highlight={input.exposureDaysPerMonth > 0}
                    isEditing={editingField === 'exposureDaysPerMonth'}
                    onStartEdit={() => setEditingField('exposureDaysPerMonth')}
                    onCommit={(raw) => {
 commitEdit('exposureDaysPerMonth', raw); setBottomExpanded(false);
}}
                    onCancel={() => {
 setEditingField(null); setBottomExpanded(false);
}}
                  />
                </div>

                {input.pairSymbol && (
                  <>
                    <EditablePairBadge
                      value={input.pairSymbol}
                      isEditing={isEditingPair}
                      onStartEdit={() => setIsEditingPair(true)}
                      onCancel={() => {
 setIsEditingPair(false); setBottomExpanded(false);
}}
                    />
                    <AnimatePresence initial={false}>
                      {isEditingPair && (
                        <motion.div
                          key="pair-editor-mobile"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={TRANSITION.standard}
                          className="overflow-hidden"
                        >
                          <div className="rounded-xl border border-border/60 bg-card/80 p-3 backdrop-blur-sm">
                            <PairSelector
                              value={input.pairSymbol ?? null}
                              onSelectAction={(symbol) => {
                                setIsEditingPair(false);
                                setBottomExpanded(false);
                                if (symbol !== input.pairSymbol) {
                                  onUpdateInputAction?.({ pairSymbol: symbol });
                                }
                              }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CompactParam({
  icon,
  value,
  onClick,
  highlight,
}: {
  icon: React.ReactNode;
  value: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 transition-colors',
        highlight
          ? 'border-primary/30 bg-primary/10'
          : 'border-border/60 bg-muted/50 hover:bg-muted',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      )}
    >
      <span className="leading-none">{icon}</span>
      <span className="text-[11px] font-semibold tabular-nums text-foreground">{value}</span>
    </button>
  );
}

type EditablePairBadgeProps = {
  value: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancel: () => void;
};

function EditablePairBadge({ value, isEditing, onStartEdit, onCancel }: EditablePairBadgeProps) {
  const pair = FOREX_PAIRS.find(p => p.symbol === value);

  return (
    <button
      type="button"
      onClick={isEditing ? onCancel : onStartEdit}
      className={cn(
        'group inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        isEditing
          ? 'border-primary/40 bg-primary/10'
          : 'border-transparent hover:border-border/60 hover:bg-card/60',
      )}
      aria-label="Modifica coppia"
      aria-expanded={isEditing}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Coppia
      </span>
      {pair && (
        <span className="flex items-center -space-x-1">
          <CurrencyFlag code={pair.base} size="sm" />
          <CurrencyFlag code={pair.quote} size="sm" />
        </span>
      )}
      <span className="font-mono text-xs font-semibold text-foreground">{value}</span>
      <Pencil className={cn(
        'size-3 transition-colors',
        isEditing ? 'text-primary' : 'text-muted-foreground',
      )}
      />
    </button>
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
        <span className={cn('text-[11px] font-semibold uppercase tracking-wider', highlight ? 'text-primary' : 'text-muted-foreground')}>
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
          className="w-16 rounded-sm bg-transparent text-xs font-semibold tabular-nums text-foreground outline-none ring-1 ring-primary/40 focus:ring-2 focus:ring-primary"
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
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'hover:border-border/60 hover:bg-card/60',
        highlight && 'border-primary/30 bg-primary/10 hover:border-primary/40',
      )}
      aria-label={`Modifica ${label}`}
    >
      <span className={cn('text-[11px] font-semibold uppercase tracking-wider', highlight ? 'text-primary' : 'text-muted-foreground')}>
        {label}
      </span>
      <span className={cn('text-xs font-semibold tabular-nums', highlight ? 'text-primary' : 'text-foreground')}>
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
