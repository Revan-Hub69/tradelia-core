'use client';

import { Suspense } from 'react';
import { SimulatoreHeader } from '@/components/simulatore/SimulatoreHeader';
import { SimulatoreShell } from '@/components/simulatore/SimulatoreShell';
import { SimulatoreSkeleton } from '@/components/simulatore/SimulatoreSkeleton';

/**
 * Pagina standalone del simulatore.
 * Layout: header fisso + main a due colonne (panel | results).
 * Il sim-root + data-theme="dark" è gestito nel layout.tsx padre.
 */
export default function SimulatorePage() {
  return (
    <>
      <SimulatoreHeader />
      <main className="sim-main" id="sim-main" aria-label="Simulatore Tradelia">
        <Suspense
          fallback={
            <>
              {/* Placeholder panel sinistro durante SSR */}
              <div className="sim-panel" aria-hidden="true">
                <div className="sim-panel__section">
                  <div className="sim-skeleton" style={{ height: 12, width: '40%', marginBottom: 12 }} />
                  <div className="sim-skeleton" style={{ height: 44, borderRadius: 8 }} />
                  <div className="sim-skeleton" style={{ height: 20, marginTop: 8 }} />
                </div>
                <div className="sim-panel__section">
                  <div className="sim-skeleton" style={{ height: 12, width: '35%', marginBottom: 12 }} />
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {[80, 60, 90, 70, 55].map(w => (
                      <div key={w} className="sim-skeleton" style={{ height: 28, width: w, borderRadius: 4 }} />
                    ))}
                  </div>
                </div>
              </div>
              {/* Placeholder results */}
              <SimulatoreSkeleton count={4} />
            </>
          }
        >
          <SimulatoreShell />
        </Suspense>
      </main>
    </>
  );
}
