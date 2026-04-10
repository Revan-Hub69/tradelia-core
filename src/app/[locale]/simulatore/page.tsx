'use client';

import { SimulatoreHeader } from '@/components/simulatore/SimulatoreHeader';

/**
 * Pagina standalone del Simulatore TradeScope.
 * Client component — tutto il motore è client-side.
 */
export default function SimulatorePage() {
  return (
    <main className="sim-page">
      <SimulatoreHeader />

      {/* INPUT PANEL + RESULTS — da costruire nei prossimi step */}
      <div className="sim-body">
        <aside className="sim-panel-input">
          {/* Step 1: ExposureInput */}
          {/* Step 2: AssetSelector */}
          {/* Step 3: BrokerSelector */}
        </aside>

        <section className="sim-panel-results">
          {/* InstrumentScoreCard list */}
          {/* CostBreakdownBar */}
          {/* DeviationMatrix */}
        </section>
      </div>
    </main>
  );
}
