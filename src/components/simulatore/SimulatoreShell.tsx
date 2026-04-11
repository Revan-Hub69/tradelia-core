'use client';

import { useSimulatorEngine } from '@/hooks/useSimulatorEngine';
import { usePanelSheet } from '@/hooks/usePanelSheet';
import { ExposureInput } from './ExposureInput';
import { AssetSelector } from './AssetSelector';
import { ScoreCardList } from './ScoreCardList';
import { SimResultsEmpty } from './SimResultsEmpty';
import { SimulatoreSkeleton } from './SimulatoreSkeleton';

/**
 * Holding period selector — chip inline.
 * Impatta direttamente i costi overnight nel motore.
 */
type HoldingPeriod = '1d' | '1w' | '1m';
const HOLDING_OPTIONS: { id: HoldingPeriod; label: string; hint: string }[] = [
  { id: '1d', label: '1 giorno',     hint: 'Intraday / day trading' },
  { id: '1w', label: '1 settimana',  hint: 'Swing trading' },
  { id: '1m', label: '1 mese',       hint: 'Posizione medio termine' },
];

function HoldingPeriodSelector({
  value, onChange,
}: { value: HoldingPeriod; onChange: (v: HoldingPeriod) => void }) {
  return (
    <div className="sim-holding" role="group" aria-label="Durata posizione">
      {HOLDING_OPTIONS.map(o => (
        <button
          key={o.id}
          type="button"
          className="sim-holding__chip"
          data-active={value === o.id ? 'true' : 'false'}
          aria-pressed={value === o.id}
          title={o.hint}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * SimulatoreShell — v3
 *
 * Sidebar parametri: sezioni FLAT, nessun accordion.
 * Ogni sezione è sempre visibile — zero click per aprire contenuti.
 * Pattern: .sim-section con label + hint (opzionale) + controllo.
 *
 * Struttura sidebar:
 *   § Esposizione target  — ExposureInput
 *   § Categoria           — AssetSelector chips
 *   § Durata posizione    — HoldingPeriodSelector chips
 *   § Broker / Profilo    — fieldset disabilitato + badge Presto
 */
export function SimulatoreShell() {
  const {
    exposure, setExposure,
    assetClass, setAssetClass,
    results, isComputing,
  } = useSimulatorEngine();

  // Holding period locale — sarà integrato in useSimulatorEngine nella v1.1
  const [holdingPeriod, setHoldingPeriod] = React.useState<HoldingPeriod>('1d');

  const { snap, toggle: toggleSheet, onTouchStart, onTouchMove, onTouchEnd, sheetRef } =
    usePanelSheet();

  const exposureSummary = `€${exposure.toLocaleString('it-IT')}`;
  const assetSummary    = assetClass;

  /* ── PANEL CONTENT — sidebar flat ────────────────────────────── */
  const panelContent = (
    <>
      {/* § 1 — Esposizione */}
      <div className="sim-section">
        <div className="sim-section__header">
          <span className="sim-section__label">Esposizione target</span>
          <span className="sim-section__value sim-num">{exposureSummary}</span>
        </div>
        <p className="sim-section__hint">
          Capitale che vuoi esporre sul mercato
        </p>
        <ExposureInput value={exposure} onChange={setExposure} />
      </div>

      {/* § 2 — Categoria strumento */}
      <div className="sim-section">
        <div className="sim-section__header">
          <span className="sim-section__label">Categoria</span>
          <span className="sim-section__value sim-num">{assetSummary}</span>
        </div>
        <AssetSelector value={assetClass} onChange={setAssetClass} />
      </div>

      {/* § 3 — Durata posizione */}
      <div className="sim-section">
        <div className="sim-section__header">
          <span className="sim-section__label">Durata posizione</span>
          <span className="sim-section__value sim-num">
            {HOLDING_OPTIONS.find(o => o.id === holdingPeriod)?.label}
          </span>
        </div>
        <p className="sim-section__hint">
          Influisce sui costi overnight e sulla capitalizzazione
        </p>
        <HoldingPeriodSelector value={holdingPeriod} onChange={setHoldingPeriod} />
      </div>

      {/* § 4 — Broker + Profilo (coming soon) */}
      <div className="sim-section sim-section--disabled">
        <div className="sim-section__header">
          <span className="sim-section__label">Broker &amp; Profilo</span>
          <span className="sim-section__badge-soon">Presto</span>
        </div>
        <p className="sim-section__hint">
          Filtro broker specifico e profilo rischio retail/pro —
          disponibili nella versione 1.1
        </p>
        {/* Chip disabilitati — preview visuale */}
        <div className="sim-chips" aria-hidden="true">
          {['eToro', 'Degiro', 'IBKR', 'XTB'].map(b => (
            <button key={b} className="sim-chip" disabled style={{ opacity: 0.35, cursor: 'not-allowed' }}>{b}</button>
          ))}
        </div>
      </div>
    </>
  );

  /* ── RESULTS AREA ─────────────────────────────────────────────── */
  const resultsArea = (
    <section
      className="sim-results"
      aria-label="Risultati simulazione"
      aria-live="polite"
    >
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
      <aside
        className="sim-panel"
        aria-label="Parametri simulazione"
      >
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
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={toggleSheet}
          role="button"
          tabIndex={0}
          aria-label={snap === 'collapsed' ? 'Apri parametri' : 'Chiudi parametri'}
          onKeyDown={e => e.key === 'Enter' && toggleSheet()}
        >
          <div className="sim-sheet__drag-bar" aria-hidden="true" />
          <div className="sim-sheet__status">
            <span className="sim-sheet__status-exposure">{exposureSummary}</span>
            <span className="sim-sheet__status-dot" aria-hidden="true" />
            <span className="sim-sheet__status-asset">{assetSummary}</span>
            <svg
              className={`sim-sheet__chevron sim-sheet__chevron--${snap}`}
              width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
            >
              <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div
          className="sim-sheet__content"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {panelContent}
        </div>
      </div>
    </>
  );
}

import React from 'react';
