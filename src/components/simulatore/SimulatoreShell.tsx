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
      <aside className="sim-panel" aria-label="Parametri simulazione">
        <div className="sim-panel__section">
          <span className="sim-panel__label">Esposizione target</span>
          <ExposureInput value={exposure} onChange={setExposure} />
        </div>
        <div className="sim-panel__section">
          <span className="sim-panel__label">Categoria</span>
          <AssetSelector value={assetClass} onChange={setAssetClass} />
        </div>
      </aside>
      <section className="sim-results" aria-label="Risultati simulazione" aria-live="polite">
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
