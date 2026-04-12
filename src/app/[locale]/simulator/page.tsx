'use client';

// ============================================================
// /simulator — entry point del decision engine
//
// Layout:
//   [form 360px] | [risultati flex-1]
//
// Data flow:
//   SimulatorInputForm → onSubmit → useSimulation.run()
//                                 → recommend()
//                                 → InstrumentRankingTable
// ============================================================

import React from 'react';
import { useSimulation }          from '@/features/simulator/hooks/useSimulation';
import { SimulatorInputForm }     from '@/features/simulator/components/SimulatorInputForm';
import { InstrumentRankingTable } from '@/features/simulator/components';

// ── Empty / idle state ─────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-900/30">
        <svg className="h-7 w-7 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Inserisci i parametri</p>
      <p className="mt-1 text-sm text-gray-400">Il confronto broker apparirà qui</p>
    </div>
  );
}

// ── Running state ──────────────────────────────────────────────────────────────

function RunningState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" aria-hidden="true" />
      <p className="text-sm text-gray-500">Calcolo in corso…</p>
    </div>
  );
}

// ── Error state ────────────────────────────────────────────────────────────────

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
      <strong>Errore:</strong> {message}
    </div>
  );
}

// ── Result summary strip ─────────────────────────────────────────────────────

function ResultSummary({
  totalBrokers,
  bestBroker,
  bestCost,
}: {
  totalBrokers: number;
  bestBroker:   string;
  bestCost:     string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg bg-teal-50 px-4 py-3 text-sm dark:bg-teal-900/20">
      <span className="text-gray-500 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-gray-100">{totalBrokers}</strong> broker analizzati
      </span>
      <span className="text-gray-500 dark:text-gray-400">
        Migliore: <strong className="text-teal-700 dark:text-teal-400">{bestBroker}</strong>
      </span>
      <span className="text-gray-500 dark:text-gray-400">
        Costo minimo: <strong className="text-teal-700 dark:text-teal-400">{bestCost}/mese</strong>
      </span>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function SimulatorPage() {
  const { run, reset, result, status, error } = useSimulation();

  const bestCostFormatted = result?.bestOverall
    ? new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
        .format(result.bestOverall.monthlyCostEUR)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Page header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-screen-xl items-baseline gap-3">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Simulatore costi</h1>
          <span className="text-sm text-gray-400">Confronto broker per tipo strumento</span>
        </div>
      </header>

      {/* Main grid */}
      <main className="mx-auto grid max-w-screen-xl gap-6 p-6 md:grid-cols-[360px_1fr]">

        {/* LEFT — form */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Parametri</h2>
            <SimulatorInputForm
              onSubmit={run}
              onReset={reset}
              isRunning={status === 'running'}
            />
          </div>
        </aside>

        {/* RIGHT — results */}
        <section className="flex flex-col gap-4">

          {/* Summary strip */}
          {status === 'done' && result && result.bestOverall && bestCostFormatted && (
            <ResultSummary
              totalBrokers={result.globalRanking.length}
              bestBroker={`${result.bestOverall.brokerName} ${result.bestOverall.accountTypeName}`}
              bestCost={bestCostFormatted}
            />
          )}

          {/* Error */}
          {status === 'error' && error && <ErrorState message={error} />}

          {/* States */}
          {status === 'idle'    && <EmptyState />}
          {status === 'running' && <RunningState />}

          {/* Results */}
          {status === 'done' && result && (
            <InstrumentRankingTable
              data={result.rankingTable}
              suggestETF={result.suggestCurrencyETF}
            />
          )}

          {/* Rejected (collapsed, secondary) */}
          {status === 'done' && result && result.rejected.length > 0 && (
            <details className="rounded-xl border border-gray-200 dark:border-gray-700">
              <summary className="cursor-pointer px-4 py-3 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                {result.rejected.length} broker non accessibili (capitale insufficiente)
              </summary>
              <ul className="divide-y divide-gray-100 px-4 pb-3 text-sm dark:divide-gray-700">
                {result.rejected.map(r => (
                  <li key={r.raw.id} className="py-2 text-gray-500 dark:text-gray-400">
                    {r.brokerName} — {r.accountTypeName}
                    <span className="ml-2 text-xs text-red-500">{r.feasibilityDetail.reason ?? 'non accessibile'}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>
      </main>
    </div>
  );
}
