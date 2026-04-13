'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useSimulatorEngine } from '@/hooks/useSimulatorEngine';
import { usePanelSheet }      from '@/hooks/usePanelSheet';
import { useRovingTabIndex }  from '@/hooks/useRovingTabIndex';
import { useKbdHint }         from '@/hooks/useKbdHint';
import { useStepAutoScroll }  from '@/hooks/useStepAutoScroll';
import { KbdHintBar }         from './KbdHintBar';
import { ScoreCardList }      from './ScoreCardList';
import { SimResultsEmpty }    from './SimResultsEmpty';
import { SimulatoreSkeleton } from './SimulatoreSkeleton';
import type { AssetClass }    from './AssetSelector';
import {
  deriveEngineInput,
  toTradesPerMonth,
  PROFILE_PRESETS,
  type TradingProfile,
  type SizingMode,
  type FreqMode,
  type UserInput,
} from '@/lib/simulator/sizing';
import type { UnderlyingId } from '@/data/simulator/underlyings';

// ── Asset tree (solo FOREX per ora — altri gruppi avranno input set separati) ──
const FOREX_GROUPS: Record<string, string[]> = {
  Majors: ['EUR/USD','GBP/USD','USD/JPY','USD/CHF','AUD/USD','USD/CAD','NZD/USD'],
  Cross:  ['EUR/GBP','EUR/JPY','EUR/CHF','EUR/CAD','EUR/AUD','GBP/JPY','GBP/CHF','AUD/JPY','CAD/JPY'],
  Exotic: ['USD/TRY','EUR/TRY','USD/ZAR','EUR/ZAR','EUR/PLN','USD/PLN','USD/MXN','USD/SEK','USD/NOK'],
};

const ASSET_OPTIONS: { id: AssetClass; label: string }[] = [
  { id: 'FOREX',     label: 'Forex'         },
  { id: 'CRYPTO',    label: 'Crypto'        },
  { id: 'INDEX',     label: 'Indici'        },
  { id: 'EQUITY',    label: 'Azioni'        },
  { id: 'COMMODITY', label: 'Materie prime' },
];

// ── Sizing mode options ────────────────────────────────────────────────────
const SIZING_MODES: { id: SizingMode; label: string }[] = [
  { id: 'pct_capital',  label: '% capitale' },
  { id: 'lots',         label: 'Lotti'      },
  { id: 'exposure_eur', label: 'Espos. €'   },
];

const FREQ_MODES: { id: FreqMode; label: string }[] = [
  { id: 'per_day',   label: '/ giorno'    },
  { id: 'per_week',  label: '/ settimana' },
  { id: 'per_month', label: '/ mese'      },
];

// ── Profili preset ────────────────────────────────────────────────────────
const PROFILES: { id: TradingProfile; label: string }[] = [
  { id: 'scalper',    label: 'Scalper'     },
  { id: 'day_trader', label: 'Day Trader'  },
  { id: 'swing',      label: 'Swing'       },
];

const RADIOGROUP_DESC_ID = 'sim-radiogroup-desc';

// ── Helpers ───────────────────────────────────────────────────────────────

function fmtEUR(n: number): string {
  return n.toLocaleString('it-IT', { maximumFractionDigits: 0 });
}

function fmtLots(n: number): string {
  return n.toFixed(2);
}

/** Calcola esposizione nozionale in EUR da lotti */
function lotsToExposure(lots: number): number {
  return lots * 100_000;
}

/** Calcola lotti da % capitale (approssimazione visiva — usa SL interno 20 pips, pipValue 10) */
function pctToLots(pct: number, capital: number): number {
  const riskEUR = capital * (pct / 100);
  return Math.max(0.01, +(riskEUR / (20 * 10)).toFixed(2));
}

// ── AnimatedSection ────────────────────────────────────────────────────────
function AnimatedSection({ show, children }: { show: boolean; children: React.ReactNode }) {
  const [mounted,  setMounted]  = useState(show);
  const [visible,  setVisible]  = useState(show);
  useEffect(() => {
    if (show) {
      setMounted(true);
      const t = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(t);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 280);
      return () => clearTimeout(t);
    }
  }, [show]);
  if (!mounted) return null;
  return (
    <div style={{
      opacity:   visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 240ms cubic-bezier(0.16,1,0.3,1), transform 240ms cubic-bezier(0.16,1,0.3,1)',
    }}>
      {children}
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────
function Section({ label, value, children, done, groupId }: {
  label: string; value?: string;
  children: React.ReactNode; done?: boolean; groupId?: string;
}) {
  return (
    <div className={`sim-section${done ? ' sim-section--done' : ''}`}>
      <div className="sim-section__header">
        <span className="sim-section__label" id={groupId ? `${groupId}-label` : undefined}>{label}</span>
        {value
          ? <span className="sim-section__value sim-num">{value}</span>
          : <span className="sim-section__value--empty">—</span>
        }
      </div>
      {children}
    </div>
  );
}

function BlockDivider({ label }: { label: string }) {
  return <div className="sim-block-divider">{label}</div>;
}

// ── RadioChipGroup ─────────────────────────────────────────────────────────
function RadioChipGroup<T extends string>({
  id, options, value, onChange, mono,
}: {
  id: string;
  options: { id: T; label: string; hint?: string }[];
  value: T | null;
  onChange: (v: T) => void;
  mono?: boolean;
}) {
  const ids = options.map(o => o.id);
  const { getItemProps } = useRovingTabIndex(ids, value, onChange);
  return (
    <div role="radiogroup" aria-labelledby={`${id}-label`} aria-describedby={RADIOGROUP_DESC_ID} className="sim-chips">
      {options.map(o => {
        const itemProps = getItemProps(o.id);
        return (
          <button key={o.id} type="button"
            className={mono ? 'sim-chip sim-chip--mono' : 'sim-chip'}
            data-active={value === o.id ? 'true' : 'false'}
            {...itemProps}
          >
            <span>{o.label}</span>
            {o.hint && <span className="sim-chip__hint">{o.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ── ToggleModeBar — tab selector per modalità ──────────────────────────────
function ToggleModeBar<T extends string>({
  options, value, onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="sim-mode-bar" role="tablist">
      {options.map(o => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={value === o.id}
          className="sim-mode-bar__tab"
          data-active={value === o.id ? 'true' : 'false'}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── NumericStepper ─────────────────────────────────────────────────────────
function NumericStepper({
  value, onChange, min = 0.01, max = 9999, step = 1, placeholder,
}: {
  value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; placeholder?: string;
}) {
  const [raw, setRaw] = useState(String(value));

  useEffect(() => { setRaw(String(value)); }, [value]);

  function commit(v: number) {
    const clamped = Math.min(max, Math.max(min, v));
    onChange(+clamped.toFixed(2));
  }

  return (
    <div className="sim-stepper">
      <button type="button" className="sim-stepper__btn"
        onClick={() => commit(value - step)}
        aria-label="Diminuisci"
      >−</button>
      <input
        type="number" className="sim-stepper__input sim-num"
        value={raw}
        min={min} max={max} step={step}
        placeholder={placeholder}
        onChange={e => setRaw(e.target.value)}
        onBlur={e => {
          const n = parseFloat(e.target.value);
          if (!isNaN(n)) commit(n);
          else setRaw(String(value));
        }}
      />
      <button type="button" className="sim-stepper__btn"
        onClick={() => commit(value + step)}
        aria-label="Aumenta"
      >+</button>
    </div>
  );
}

// ── CapitalSlider ──────────────────────────────────────────────────────────
function CapitalSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  // Slider logaritmico: 500 → 50.000
  const MIN_LOG = Math.log(500);
  const MAX_LOG = Math.log(50_000);

  function sliderToCapital(s: number): number {
    return Math.round(Math.exp(MIN_LOG + (s / 100) * (MAX_LOG - MIN_LOG)));
  }

  function capitalToSlider(c: number): number {
    return ((Math.log(c) - MIN_LOG) / (MAX_LOG - MIN_LOG)) * 100;
  }

  return (
    <div className="sim-capital">
      <input
        type="range" min={0} max={100} step={0.5}
        value={capitalToSlider(value)}
        onChange={e => onChange(sliderToCapital(parseFloat(e.target.value)))}
        className="sim-capital__slider"
        aria-label="Capitale"
      />
      <div className="sim-capital__row">
        <span className="sim-capital__prefix">€</span>
        <input
          type="number" className="sim-capital__input sim-num"
          value={value} min={500} max={50_000}
          onChange={e => {
            const n = parseInt(e.target.value, 10);
            if (!isNaN(n) && n >= 500 && n <= 50_000) onChange(n);
          }}
        />
      </div>
    </div>
  );
}

// ── ProgressDots ───────────────────────────────────────────────────────────
function ProgressDots({ completed, total }: { completed: number; total: number }) {
  return (
    <div className="sim-progress" aria-label={`${completed} di ${total} campi compilati`}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className="sim-progress__dot" data-done={i < completed ? 'true' : 'false'} />
      ))}
      <span className="sim-progress__label">{completed}/{total}</span>
    </div>
  );
}

// ── Componente principale ──────────────────────────────────────────────────
export function SimulatoreShell() {
  const { setEngineInput, results, isComputing } = useSimulatorEngine();

  // ── Stato form ────────────────────────────────────────────────────────
  const [assetClass,   setAssetClass]   = useState<AssetClass | null>(null);
  const [subGroup,     setSubGroup]     = useState<string | null>(null);
  const [underlying,   setUnderlying]   = useState<string | null>(null);
  const [capital,      setCapital]      = useState<number>(2_000);
  const [sizingMode,   setSizingMode]   = useState<SizingMode>('pct_capital');
  const [sizingValue,  setSizingValue]  = useState<number>(1.0);
  const [freqMode,     setFreqMode]     = useState<FreqMode>('per_day');
  const [freqValue,    setFreqValue]    = useState<number>(1);
  const [activeProfile, setActiveProfile] = useState<TradingProfile | null>(null);

  // ── Preset handler ────────────────────────────────────────────────────
  const applyPreset = useCallback((profile: TradingProfile) => {
    const p = PROFILE_PRESETS[profile];
    setActiveProfile(profile);
    setSizingMode(p.sizingMode);
    setSizingValue(p.sizingValue);
    setFreqMode(p.freqMode);
    setFreqValue(p.freqValue);
  }, []);

  // ── Equivalenti visivi ────────────────────────────────────────────────
  const sizingEquiv = useMemo(() => {
    if (sizingMode === 'pct_capital') {
      const lots       = pctToLots(sizingValue, capital);
      const exposure   = lotsToExposure(lots);
      return `≈ ${fmtLots(lots)} lotti · €${fmtEUR(exposure)}`;
    }
    if (sizingMode === 'lots') {
      const exposure   = lotsToExposure(sizingValue);
      const approxPct  = capital > 0 ? ((sizingValue * 100_000 * 0.0001 * 20) / capital * 100).toFixed(1) : '—';
      return `≈ ${approxPct}% capitale · €${fmtEUR(exposure)}`;
    }
    if (sizingMode === 'exposure_eur') {
      const lots       = sizingValue / 100_000;
      return `≈ ${fmtLots(lots)} lotti`;
    }
    return '';
  }, [sizingMode, sizingValue, capital]);

  const freqEquiv = useMemo(() => {
    const monthly = toTradesPerMonth(freqValue, freqMode);
    if (freqMode === 'per_month') return '';
    return `≈ ${monthly} trade/mese`;
  }, [freqValue, freqMode]);

  // ── Propagazione al motore ────────────────────────────────────────────
  const isForex      = assetClass === 'FOREX';
  const hasMinParams = !!assetClass && !!underlying && capital > 0 && sizingValue > 0 && freqValue > 0;

  useEffect(() => {
    if (!hasMinParams || !assetClass || !underlying) return;

    const userInput: UserInput = {
      assetClass,
      underlyingId: underlying as UnderlyingId,
      capital,
      sizingMode,
      sizingValue,
      freqMode,
      freqValue,
      activeProfile,
    };

    const engineInput = deriveEngineInput(userInput);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sizingResult: _sr, ...cleanInput } = engineInput;
    setEngineInput(cleanInput);
  }, [assetClass, underlying, capital, sizingMode, sizingValue, freqMode, freqValue, activeProfile, hasMinParams, setEngineInput]);

  // ── Handlers con reset a cascata ──────────────────────────────────────
  const handleAssetClassChange = useCallback((ac: AssetClass) => {
    setAssetClass(ac);
    setSubGroup(null);
    setUnderlying(null);
  }, []);

  const handleSubGroupChange = useCallback((sg: string) => {
    setSubGroup(sg);
    setUnderlying(null);
  }, []);

  const groups  = isForex ? Object.keys(FOREX_GROUPS) : [];
  const assets  = isForex && subGroup ? (FOREX_GROUPS[subGroup] ?? []) : [];

  // ── Sheet / panel ─────────────────────────────────────────────────────
  const { snap, toggle: toggleSheet, sheetRef } = usePanelSheet('collapsed');
  const { visible: kbdVisible, show: showKbd }  = useKbdHint();
  const panelContentRef = useRef<HTMLDivElement>(null);
  const sheetContentRef = useRef<HTMLDivider>(null);

  const scrollTrigger = [assetClass, subGroup, underlying, sizingMode, freqMode].join('|');
  useStepAutoScroll(panelContentRef, scrollTrigger, true);
  useStepAutoScroll(sheetContentRef, scrollTrigger, snap === 'full');

  const handlePanelFocusIn = useCallback(() => showKbd(), [showKbd]);

  // ── Step count ────────────────────────────────────────────────────────
  const filledValues   = [assetClass, subGroup, underlying, capital > 0, sizingValue > 0, freqValue > 0];
  const completedSteps = filledValues.filter(Boolean).length;
  const STEPS          = 6;

  const statusLabel = underlying ?? subGroup ?? (assetClass ? ASSET_OPTIONS.find(a => a.id === assetClass)?.label : undefined) ?? '—';

  // ── Panel content (condiviso tra sidebar desktop e bottom sheet mobile)
  const panelContent = (
    <>
      <span id={RADIOGROUP_DESC_ID} className="sr-only">
        Usa le frecce ← → per navigare tra le opzioni, Spazio o Invio per selezionare.
      </span>

      {/* ── Blocco 1: Strumento ── */}
      <BlockDivider label="Strumento" />

      <Section label="Categoria" value={assetClass ?? undefined} done={!!assetClass} groupId="sim-cat">
        <RadioChipGroup
          id="sim-cat"
          options={ASSET_OPTIONS}
          value={assetClass}
          onChange={handleAssetClassChange}
        />
      </Section>

      <AnimatedSection show={isForex}>
        <Section label="Gruppo" value={subGroup ?? undefined} done={!!subGroup} groupId="sim-sub">
          <RadioChipGroup
            id="sim-sub"
            options={groups.map(g => ({ id: g, label: g }))}
            value={subGroup}
            onChange={handleSubGroupChange}
          />
        </Section>
      </AnimatedSection>

      <AnimatedSection show={isForex && !!subGroup && assets.length > 0}>
        <Section
          label="Coppia"
          value={underlying ?? undefined}
          done={!!underlying}
          groupId="sim-asset"
        >
          <RadioChipGroup
            id="sim-asset"
            options={assets.map(a => ({ id: a, label: a }))}
            value={underlying}
            onChange={setUnderlying}
            mono
          />
        </Section>
      </AnimatedSection>

      {/* ── Blocco 2: Il tuo profilo ── */}
      <AnimatedSection show={!!underlying}>
        <BlockDivider label="Il tuo profilo" />

        {/* Preset rapidi */}
        <div className="sim-presets">
          <span className="sim-presets__label">Preset rapido</span>
          <div className="sim-presets__chips">
            {PROFILES.map(p => (
              <button
                key={p.id}
                type="button"
                className="sim-preset-chip"
                data-active={activeProfile === p.id ? 'true' : 'false'}
                onClick={() => applyPreset(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Capitale */}
        <Section label="Capitale" value={`€ ${fmtEUR(capital)}`} done groupId="sim-capital">
          <CapitalSlider value={capital} onChange={v => { setCapital(v); setActiveProfile(null); }} />
        </Section>

        {/* Dimensione posizione */}
        <Section
          label="Dimensione posizione"
          value={sizingMode === 'pct_capital' ? `${sizingValue}%`
               : sizingMode === 'lots'        ? `${fmtLots(sizingValue)} lotti`
               :                               `€${fmtEUR(sizingValue)}`}
          done={sizingValue > 0}
          groupId="sim-sizing"
        >
          <ToggleModeBar
            options={SIZING_MODES}
            value={sizingMode}
            onChange={m => { setSizingMode(m); setActiveProfile(null); }}
          />
          <NumericStepper
            value={sizingValue}
            onChange={v => { setSizingValue(v); setActiveProfile(null); }}
            min={sizingMode === 'pct_capital' ? 0.1 : sizingMode === 'lots' ? 0.01 : 100}
            max={sizingMode === 'pct_capital' ? 100  : sizingMode === 'lots' ? 100  : 5_000_000}
            step={sizingMode === 'pct_capital' ? 0.1  : sizingMode === 'lots' ? 0.01 : 1_000}
          />
          {sizingEquiv && <p className="sim-section__equiv">{sizingEquiv}</p>}
        </Section>

        {/* Frequenza */}
        <Section
          label="Frequenza"
          value={`${freqValue} ${FREQ_MODES.find(f => f.id === freqMode)?.label ?? ''}`}
          done={freqValue > 0}
          groupId="sim-freq"
        >
          <ToggleModeBar
            options={FREQ_MODES}
            value={freqMode}
            onChange={m => { setFreqMode(m); setActiveProfile(null); }}
          />
          <NumericStepper
            value={freqValue}
            onChange={v => { setFreqValue(v); setActiveProfile(null); }}
            min={1}
            max={freqMode === 'per_day' ? 50 : freqMode === 'per_week' ? 30 : 200}
            step={1}
          />
          {freqEquiv && <p className="sim-section__equiv">{freqEquiv}</p>}
        </Section>

        <AnimatedSection show={hasMinParams}>
          <div className="sim-sheet__cta">
            <span className="sim-sheet__cta-icon" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Profilo completo — i risultati si aggiornano in automatico
          </div>
        </AnimatedSection>
      </AnimatedSection>
    </>
  );

  const showEmpty = !hasMinParams;

  const resultsArea = (
    <section className="sim-results" aria-label="Risultati simulazione" aria-live="polite">
      {!showEmpty && !isComputing && results.length > 0 && (
        <div className="sim-results__header">
          <span className="sim-results__count">{results.length} strumenti analizzati</span>
          <div className="sim-results__legend">
            {[
              { label: 'Spread',   color: 'var(--s-ac)'   },
              { label: 'Comm.',    color: 'var(--s-gold)'  },
              { label: 'Slippage', color: 'var(--s-t3)'   },
            ].map(l => (
              <span key={l.label} className="sim-results__legend-item">
                <span className="sim-results__legend-dot" style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
      )}
      {showEmpty ? (
        <SimResultsEmpty />
      ) : isComputing ? (
        <SimulatoreSkeleton count={4} />
      ) : (
        <ScoreCardList results={results} />
      )}
    </section>
  );

  return (
    <>
      <aside className="sim-panel" aria-label="Parametri simulazione" onFocusCapture={handlePanelFocusIn}>
        <div className="sim-panel__content" ref={panelContentRef}>
          {panelContent}
        </div>
        <KbdHintBar visible={kbdVisible} />
      </aside>

      {resultsArea}

      <div
        ref={sheetRef}
        className={`sim-sheet sim-sheet--${snap}`}
        role="complementary"
        aria-label="Parametri simulazione"
        onFocusCapture={handlePanelFocusIn}
      >
        <button type="button" className="sim-sheet__handle-area" onClick={toggleSheet}
          aria-expanded={snap === 'full'}
          aria-label={snap === 'collapsed' ? 'Apri parametri' : 'Chiudi parametri'}
        >
          <div className="sim-sheet__drag-bar" aria-hidden="true" />
          <div className="sim-sheet__status">
            <span className="sim-sheet__status-asset">{statusLabel}</span>
            <span className="sim-sheet__status-dot" aria-hidden="true" />
            <span className="sim-sheet__status-exposure">
              {sizingValue > 0
                ? sizingMode === 'pct_capital' ? `${sizingValue}%`
                : sizingMode === 'lots'        ? `${fmtLots(sizingValue)} lotti`
                :                               `€${fmtEUR(sizingValue)}`
                : 'Dimensione'}
            </span>
            <div className="sim-sheet__handle-right">
              <ProgressDots completed={completedSteps} total={STEPS} />
              <svg className={`sim-sheet__chevron sim-sheet__chevron--${snap}`}
                width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
              >
                <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </button>
        <div className="sim-sheet__content" ref={sheetContentRef}>
          {panelContent}
        </div>
        <KbdHintBar visible={kbdVisible} />
      </div>
    </>
  );
}
