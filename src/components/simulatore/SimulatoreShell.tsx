'use client';

import React, { useState } from 'react';
import { useSimulatorEngine } from '@/hooks/useSimulatorEngine';
import { usePanelSheet } from '@/hooks/usePanelSheet';
import { ExposureInput } from './ExposureInput';
import { ScoreCardList } from './ScoreCardList';
import { SimResultsEmpty } from './SimResultsEmpty';
import { SimulatoreSkeleton } from './SimulatoreSkeleton';

/* ─── ASSET DATA ───────────────────────────────────────────────────────── */
const ASSET_TREE: Record<string, Record<string, string[]>> = {
  Forex: {
    Majors:   ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF'],
    Minors:   ['EUR/GBP', 'EUR/JPY', 'GBP/JPY'],
    Exotic:   ['USD/TRY', 'USD/ZAR', 'EUR/TRY'],
  },
  Crypto: {
    'Large Cap': ['BTC/USD', 'ETH/USD', 'BNB/USD'],
    'Mid Cap':   ['SOL/USD', 'ADA/USD', 'DOT/USD'],
    Stablecoin: ['USDT/USD', 'USDC/USD'],
  },
  Indici: {
    Europa:    ['DAX 40', 'FTSE 100', 'CAC 40'],
    'USA':     ['S&P 500', 'NASDAQ 100', 'DOW 30'],
    Asia:      ['Nikkei 225', 'Hang Seng'],
  },
  Azioni: {
    Tech:     ['Apple', 'Microsoft', 'NVIDIA', 'Meta'],
    Finance:  ['JPMorgan', 'Goldman Sachs', 'Visa'],
    Energy:   ['ExxonMobil', 'Shell', 'TotalEnergies'],
  },
  Materie: {
    Metalli:  ['Oro', 'Argento', 'Rame'],
    Energia:  ['Petrolio WTI', 'Gas Nat.', 'Brent'],
  },
};

/* ─── CHIP GROUP ───────────────────────────────────────────────────────── */
function ChipGroup<T extends string>({
  options, value, onChange, mono = false,
}: { options: T[]; value: T | null; onChange: (v: T) => void; mono?: boolean }) {
  return (
    <div className="sim-chips">
      {options.map(o => (
        <button
          key={o} type="button"
          className={mono ? 'sim-chip sim-chip--mono' : 'sim-chip'}
          data-active={value === o ? 'true' : 'false'}
          aria-pressed={value === o}
          onClick={() => onChange(o)}
        >{o}</button>
      ))}
    </div>
  );
}

/* ─── LEVA SLIDER ──────────────────────────────────────────────────────── */
const LEVA_STEPS = [1, 2, 5, 10, 20, 30, 50, 100, 200, 400, 500];
function LevaSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const idx = LEVA_STEPS.indexOf(value);
  return (
    <div className="sim-leva">
      <div className="sim-leva__track">
        <input
          type="range" min={0} max={LEVA_STEPS.length - 1}
          value={idx < 0 ? 0 : idx}
          onChange={e => onChange(LEVA_STEPS[+e.target.value]!)}
          className="sim-leva__slider"
          aria-label="Leva finanziaria"
        />
        <div className="sim-leva__fill" style={{ width: `${((idx < 0 ? 0 : idx) / (LEVA_STEPS.length - 1)) * 100}%` }} />
      </div>
      <div className="sim-leva__labels">
        <span className="sim-leva__label">1×</span>
        <span className="sim-leva__value">1:{value}</span>
        <span className="sim-leva__label">500×</span>
      </div>
      {value > 30 && (
        <p className="sim-leva__warning">⚠ Leva elevata — rischio perdite superiori al capitale</p>
      )}
    </div>
  );
}

/* ─── FREQUENZA OPERATIVA ──────────────────────────────────────────────── */
type FreqType = 'scalping' | 'intraday' | 'swing' | 'position';
const FREQ_OPTIONS: { id: FreqType; label: string; hint: string }[] = [
  { id: 'scalping',  label: 'Scalping',  hint: 'Sec/Min' },
  { id: 'intraday',  label: 'Intraday',  hint: 'Ore' },
  { id: 'swing',     label: 'Swing',     hint: '2–14 gg' },
  { id: 'position',  label: 'Position',  hint: '1 m+' },
];

/* ─── SIZE ACCOUNT PRESETS ──────────────────────────────────────────────── */
const SIZE_PRESETS = [500, 1_000, 5_000, 10_000, 25_000, 50_000, 100_000];

function fmt(n: number) {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000)     return `${n / 1_000}k`;
  return `${n}`;
}

/* ─── SECTION WRAPPER ──────────────────────────────────────────────────── */
function Section({ label, value, hint, children }: {
  label: string; value?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="sim-section">
      <div className="sim-section__header">
        <span className="sim-section__label">{label}</span>
        {value && <span className="sim-section__value sim-num">{value}</span>}
      </div>
      {hint && <p className="sim-section__hint">{hint}</p>}
      {children}
    </div>
  );
}

function BlockDivider({ label }: { label: string }) {
  return <div className="sim-block-divider">{label}</div>;
}

/* ─── SHELL ─────────────────────────────────────────────────────────────── */
export function SimulatoreShell() {
  const {
    exposure, setExposure,
    assetClass, setAssetClass,
    results, isComputing,
  } = useSimulatorEngine();

  // Livello 2 — sottogruppo
  const [subGroup, setSubGroup]     = useState<string | null>(null);
  // Livello 3 — asset specifico
  const [asset, setAsset]           = useState<string | null>(null);
  // Stile trading
  const [freq, setFreq]             = useState<FreqType>('intraday');
  const [holding, setHolding]       = useState<'1d' | '1w' | '1m'>('1d');
  // Rischio
  const [accountSize, setAccountSize] = useState<number>(10_000);
  const [leva, setLeva]             = useState<number>(10);

  const groups = assetClass ? Object.keys(ASSET_TREE[assetClass] ?? {}) : [];
  const assets = assetClass && subGroup ? (ASSET_TREE[assetClass]?.[subGroup] ?? []) : [];

  // reset cascade
  const handleGroupChange = (g: string) => {
    setAssetClass(g);
    setSubGroup(null);
    setAsset(null);
  };
  const handleSubChange = (s: string) => {
    setSubGroup(s);
    setAsset(null);
  };

  const { snap, toggle: toggleSheet, onTouchStart, onTouchMove, onTouchEnd, sheetRef } =
    usePanelSheet();

  const exposureSummary   = `€${exposure.toLocaleString('it-IT')}`;
  const assetSummary      = asset ?? subGroup ?? assetClass ?? '—';

  /* ── PANEL CONTENT ─────────────────────────────────────────────────── */
  const panelContent = (
    <>
      {/* ══ BLOCCO 1 — COSA ANALIZZI ══ */}
      <BlockDivider label="Strumento" />

      <Section
        label="Categoria"
        value={assetClass ?? '—'}
      >
        <ChipGroup
          options={Object.keys(ASSET_TREE) as string[]}
          value={assetClass}
          onChange={handleGroupChange}
        />
      </Section>

      {assetClass && (
        <Section
          label="Sottogruppo"
          value={subGroup ?? '—'}
        >
          <ChipGroup
            options={groups}
            value={subGroup}
            onChange={handleSubChange}
          />
        </Section>
      )}

      {subGroup && assets.length > 0 && (
        <Section
          label="Asset"
          value={asset ?? '—'}
          hint="Seleziona per confronto specifico"
        >
          <ChipGroup
            options={assets}
            value={asset}
            onChange={setAsset}
            mono
          />
        </Section>
      )}

      {/* ══ BLOCCO 2 — COME OPERI ══ */}
      <BlockDivider label="Stile operativo" />

      <Section
        label="Frequenza"
        value={FREQ_OPTIONS.find(o => o.id === freq)?.label}
        hint="Impatta spread effettivo e costi per operazione"
      >
        <div className="sim-chips">
          {FREQ_OPTIONS.map(o => (
            <button
              key={o.id} type="button"
              className="sim-chip"
              data-active={freq === o.id ? 'true' : 'false'}
              aria-pressed={freq === o.id}
              title={o.hint}
              onClick={() => setFreq(o.id)}
            >
              <span>{o.label}</span>
              <span className="sim-chip__hint">{o.hint}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section
        label="Orizzonte"
        value={holding === '1d' ? '1 giorno' : holding === '1w' ? '1 settimana' : '1 mese'}
        hint="Influisce sui costi overnight"
      >
        <div className="sim-holding">
          {(['1d', '1w', '1m'] as const).map(h => (
            <button
              key={h} type="button"
              className="sim-holding__chip"
              data-active={holding === h ? 'true' : 'false'}
              aria-pressed={holding === h}
              onClick={() => setHolding(h)}
            >
              {h === '1d' ? '1 gg' : h === '1w' ? '1 sett.' : '1 mese'}
            </button>
          ))}
        </div>
      </Section>

      {/* ══ BLOCCO 3 — QUANTO RISCHI ══ */}
      <BlockDivider label="Rischio" />

      <Section
        label="Esposizione"
        value={exposureSummary}
        hint="Capitale che vuoi esporre"
      >
        <ExposureInput value={exposure} onChange={setExposure} />
      </Section>

      <Section
        label="Size account"
        value={`€${fmt(accountSize)}`}
        hint="Capitale totale disponibile"
      >
        <div className="sim-chips">
          {SIZE_PRESETS.map(s => (
            <button
              key={s} type="button"
              className="sim-chip sim-chip--mono"
              data-active={accountSize === s ? 'true' : 'false'}
              aria-pressed={accountSize === s}
              onClick={() => setAccountSize(s)}
            >
              €{fmt(s)}
            </button>
          ))}
        </div>
      </Section>

      <Section
        label="Leva"
        value={`1:${leva}`}
        hint="Moltiplicatore di esposizione"
      >
        <LevaSlider value={leva} onChange={setLeva} />
      </Section>
    </>
  );

  /* ── RESULTS AREA ───────────────────────────────────────────────────── */
  const resultsArea = (
    <section className="sim-results" aria-label="Risultati simulazione" aria-live="polite">
      {!isComputing && results.length > 0 && (
        <div className="sim-results__header">
          <span className="sim-results__count">{results.length} strumenti analizzati</span>
          <div className="sim-results__legend">
            {[
              { label: 'Spread',    color: 'var(--s-ac)' },
              { label: 'Comm.',     color: 'var(--s-gold)' },
              { label: 'Overnight', color: 'var(--s-amber)' },
              { label: 'Slippage', color: 'var(--s-t3)' },
            ].map(l => (
              <span key={l.label} className="sim-results__legend-item">
                <span className="sim-results__legend-dot" style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
      )}
      {isComputing ? (
        <SimulatoreSkeleton count={4} />
      ) : results.length === 0 ? (
        <SimResultsEmpty />
      ) : (
        <ScoreCardList results={results} />
      )}
    </section>
  );

  return (
    <>
      {/* ── DESKTOP ≥861px ── panel fisso */}
      <aside className="sim-panel" aria-label="Parametri simulazione">
        <div className="sim-panel__content">
          {panelContent}
        </div>
      </aside>

      {resultsArea}

      {/* ── MOBILE ≤860px ── bottom sheet */}
      <div
        ref={sheetRef}
        className={`sim-sheet sim-sheet--${snap}`}
        aria-label="Parametri simulazione"
        role="complementary"
      >
        <div
          className="sim-sheet__handle-area"
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
          onClick={toggleSheet} role="button" tabIndex={0}
          aria-label={snap === 'collapsed' ? 'Apri parametri' : 'Chiudi parametri'}
          onKeyDown={e => e.key === 'Enter' && toggleSheet()}
        >
          <div className="sim-sheet__drag-bar" aria-hidden="true" />
          <div className="sim-sheet__status">
            <span className="sim-sheet__status-exposure">{exposureSummary}</span>
            <span className="sim-sheet__status-dot" aria-hidden="true" />
            <span className="sim-sheet__status-asset">{assetSummary}</span>
            <svg className={`sim-sheet__chevron sim-sheet__chevron--${snap}`}
              width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div
          className="sim-sheet__content"
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        >
          {panelContent}
        </div>
      </div>
    </>
  );
}
