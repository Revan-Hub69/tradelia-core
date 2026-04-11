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

export function SimulatoreShell() {
  const {
    exposure, setExposure,
    assetClass, setAssetClass,
    results, isComputing,
  } = useSimulatorEngine();

  const { collapsed, toggle: togglePanel } = usePanelCollapse();
  const { snap, toggle: toggleSheet, onTouchStart, onTouchMove, onTouchEnd, sheetRef } = usePanelSheet();

  const exposureSummary = `€${exposure.toLocaleString('it-IT')}`;
  const assetSummary    = assetClass;

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
      {/* ── DESKTOP ≥861px ─────────────────────────────── */}
      <aside
        className={`sim-panel${collapsed ? ' sim-panel--collapsed' : ''}`}
        aria-label="Parametri simulazione"
      >
        {/*
          Collapse button inline nel panel header — pattern Linear/Figma 2026.
          NON più il tab che spunta dal bordo (pattern 2018).
          Visibile sempre su ≥861px, non solo 861-1100px.
        */}
        <div className="sim-panel__topbar">
          {!collapsed && (
            <span className="sim-panel__topbar-label">Parametri</span>
          )}
          <button
            type="button"
            className="sim-panel__collapse-btn"
            aria-label={collapsed ? 'Espandi pannello' : 'Comprimi pannello'}
            aria-expanded={!collapsed}
            onClick={togglePanel}
            title={collapsed ? 'Espandi' : 'Comprimi'}
          >
            <svg
              width="14" height="14" viewBox="0 0 14 14"
              fill="none" aria-hidden="true"
              className="sim-panel__collapse-btn-icon"
              style={{
                transform: collapsed ? 'rotate(180deg)' : 'none',
                transition: 'transform 200ms cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {/* Doppia freccia: sinistra quando espanso (comprimi), destra quando collapsed (espandi) */}
              <path
                d="M9 3L5 7l4 4M5 3l-4 4 4 4"
                stroke="currentColor" strokeWidth="1.4"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Icon rail quando collapsed */}
        {collapsed && (
          <div className="sim-panel__icon-rail" aria-hidden="true">
            <span className="sim-panel__rail-icon" title={`Esposizione: ${exposureSummary}`}>€</span>
            <span className="sim-panel__rail-icon" title={`Asset: ${assetClass}`}>{assetClass[0]}</span>
          </div>
        )}

        {/* Contenuto accordion */}
        {!collapsed && (
          <div className="sim-panel__content">
            {panelContent}
          </div>
        )}
      </aside>

      {resultsArea}

      {/* ── MOBILE ≤860px ── Bottom sheet */}
      <div
        ref={sheetRef}
        className={`sim-sheet sim-sheet--${snap}`}
        aria-label="Parametri simulazione"
        role="complementary"
      >
        {/* Handle area: drag + tap per ciclo snap */}
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

        {/* Contenuto scrollabile */}
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
