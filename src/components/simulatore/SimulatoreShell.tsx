'use client';

import { useSimulatorEngine } from '@/hooks/useSimulatorEngine';
import { usePanelCollapse } from '@/hooks/usePanelCollapse';
import { usePanelSheet } from '@/hooks/usePanelSheet';
import { PanelAccordion } from './PanelAccordion';
import { ExposureInput } from './ExposureInput';
import { AssetSelector } from './AssetSelector';
import { ScoreCardList } from './ScoreCardList';
import { SimResultsEmpty } from './SimResultsEmpty';
import { SimulatoreSkeleton } from './SimulatoreSkeleton';

/**
 * SimulatoreShell
 *
 * Layout a 3 breakpoint:
 *   ≥1100px  — panel fisso 340px + accordion sezioni
 *   860-1100 — panel collassabile (icon rail 48px) via usePanelCollapse
 *   ≤860px   — results full-screen + bottom sheet 3-snap via usePanelSheet
 */
export function SimulatoreShell() {
  const {
    exposure, setExposure,
    assetClass, setAssetClass,
    results, isComputing,
  } = useSimulatorEngine();

  const { collapsed, toggle: togglePanel } = usePanelCollapse();
  const { snap, toggle: toggleSheet, onTouchStart, onTouchEnd, sheetRef } = usePanelSheet();

  const exposureSummary = `€${exposure.toLocaleString('it-IT')}`;
  const assetSummary = assetClass;

  // Contenuto del panel (riusato sia in desktop che in sheet mobile)
  const panelContent = (
    <>
      <PanelAccordion
        label="Esposizione target"
        hint="Capitale che vuoi esporre sul mercato"
        summary={exposureSummary}
        defaultOpen
      >
        <ExposureInput value={exposure} onChange={setExposure} />
      </PanelAccordion>

      <PanelAccordion
        label="Categoria strumento"
        hint="Asset class di riferimento per il confronto"
        summary={assetSummary}
      >
        <AssetSelector value={assetClass} onChange={setAssetClass} />
      </PanelAccordion>

      {/* Placeholder sezioni future */}
      <PanelAccordion label="Broker" summary="Tutti">
        <p className="sim-panel__hint" style={{ paddingBlock: '0.5rem' }}>
          Filtro broker — disponibile nella v1.1
        </p>
      </PanelAccordion>

      <PanelAccordion label="Profilo" summary="Retail">
        <p className="sim-panel__hint" style={{ paddingBlock: '0.5rem' }}>
          Holding period, frequenza, rischio — disponibile nella v1.1
        </p>
      </PanelAccordion>
    </>
  );

  // Area risultati comune
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
              { label: 'Spread',      color: 'var(--s-ac)' },
              { label: 'Comm.',       color: 'var(--s-gold)' },
              { label: 'Overnight',  color: 'var(--s-amber)' },
              { label: 'Slippage',   color: 'var(--s-t3)' },
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
      {/* ── DESKTOP (≥860px) ─────────────────────────────────── */}
      <aside
        className={`sim-panel${
          collapsed ? ' sim-panel--collapsed' : ''
        } sim-panel--desktop`}
        aria-label="Parametri simulazione"
      >
        {/* Toggle collapse — visibile solo 860-1100px */}
        <button
          type="button"
          className="sim-panel__collapse-btn"
          aria-label={collapsed ? 'Espandi parametri' : 'Comprimi parametri'}
          aria-expanded={!collapsed}
          onClick={togglePanel}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d={collapsed
                ? 'M5 3l4 4-4 4'   // chevron destra — espandi
                : 'M9 3l-4 4 4 4'  // chevron sinistra — comprimi
              }
              stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Contenuto panel — nascosto quando collapsed */}
        {!collapsed && panelContent}

        {/* Icon rail quando collapsed */}
        {collapsed && (
          <div className="sim-panel__icon-rail" aria-hidden="true">
            <span className="sim-panel__rail-icon" title="Esposizione">
              €
            </span>
            <span className="sim-panel__rail-icon" title={assetClass}>
              {assetClass[0]}
            </span>
          </div>
        )}
      </aside>

      {/* Risultati — desktop */}
      <div className="sim-panel--desktop" style={{ display: 'contents' }}>
        {resultsArea}
      </div>

      {/* ── MOBILE (≤860px) ──────────────────────────────────── */}
      {/* Results full-screen */}
      <div className="sim-mobile-results">
        {resultsArea}
      </div>

      {/* Bottom sheet */}
      <div
        ref={sheetRef}
        className={`sim-sheet sim-sheet--${snap}`}
        aria-label="Parametri simulazione"
        role="complementary"
      >
        {/* Drag handle + status bar */}
        <div
          className="sim-sheet__handle-area"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={toggleSheet}
          role="button"
          tabIndex={0}
          aria-label={snap === 'collapsed' ? 'Apri parametri' : 'Chiudi parametri'}
          onKeyDown={e => e.key === 'Enter' && toggleSheet()}
        >
          <div className="sim-sheet__drag-bar" aria-hidden="true" />
          <div className="sim-sheet__status">
            <span className="sim-sheet__status-pill">
              {exposureSummary}
            </span>
            <span className="sim-sheet__status-sep" aria-hidden="true">·</span>
            <span className="sim-sheet__status-pill">
              {assetSummary}
            </span>
            <svg
              className={`sim-sheet__chevron sim-sheet__chevron--${snap}`}
              width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
            >
              <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Contenuto sheet */}
        <div
          className="sim-sheet__content"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {panelContent}
        </div>
      </div>
    </>
  );
}
