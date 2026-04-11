'use client';

import { useSimulatorEngine } from '@/hooks/useSimulatorEngine';
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

  return (
    <>
      {/* Panel sinistro */}
      <aside className="sim-panel" aria-label="Parametri simulazione">
        <div className="sim-panel__section">
          <span className="sim-panel__label">Esposizione target</span>
          <p className="sim-panel__hint">Capitale che vuoi esporre sul mercato</p>
          <ExposureInput value={exposure} onChange={setExposure} />
        </div>

        <div className="sim-panel__section">
          <span className="sim-panel__label">Categoria strumento</span>
          <p className="sim-panel__hint">Asset class di riferimento per il confronto</p>
          <AssetSelector value={assetClass} onChange={setAssetClass} />
        </div>
      </aside>

      {/* Area risultati */}
      <section className="sim-results" aria-label="Risultati simulazione" aria-live="polite">
        {!isComputing && results.length > 0 && (
          <div className="sim-results__header">
            <span className="sim-results__count">{results.length} strumenti analizzati</span>
            <div className="sim-results__legend">
              {[
                { label: 'Spread',    color: 'var(--s-ac)' },
                { label: 'Commissione', color: 'var(--s-gold)' },
                { label: 'Overnight', color: 'var(--s-amber)' },
                { label: 'Slippage',  color: 'var(--s-t3)' },
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
    </>
  );
}
