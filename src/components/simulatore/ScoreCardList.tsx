'use client';

import { ScoreCard } from './ScoreCard';
import type { SimulatorResult } from '@/hooks/useSimulatorEngine';

export function ScoreCardList({ results }: { results: SimulatorResult[] }) {
  return (
    <>
      {results.map((r, i) => <ScoreCard key={r.id} result={r} rank={i + 1} />)}
    </>
  );
}
