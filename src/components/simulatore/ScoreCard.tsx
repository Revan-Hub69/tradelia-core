'use client';

import { ScoreGauge } from './ScoreGauge';
import { FeasibilityBadge, type Feasibility } from './FeasibilityBadge';
import type { SimulatorResult } from '@/hooks/useSimulatorEngine';

export function ScoreCard({ result, rank }: { result: SimulatorResult; rank: number }) {
  const isOptimal = rank === 1;
  const totalCost = result.spreadCost + result.commissionCost + result.overnightCost + result.slippageCost;

  const segments = totalCost > 0 ? [
    { key: 'spread',    flex: result.spreadCost / totalCost,     cls: 'sim-card__cost-segment--spread' },
    { key: 'comm',      flex: result.commissionCost / totalCost, cls: 'sim-card__cost-segment--comm' },
    { key: 'overnight', flex: result.overnightCost / totalCost,  cls: 'sim-card__cost-segment--overnight' },
    { key: 'slippage',  flex: result.slippageCost / totalCost,   cls: 'sim-card__cost-segment--slippage' },
  ] : [];

  return (
    <article
      className={`sim-card${isOptimal ? ' sim-card--optimal' : ''}`}
      aria-label={`${result.instrumentName} — score ${result.score}`}
    >
      <div className="sim-card__rank">
        <span className="sim-card__rank-num">#{rank}</span>
        <ScoreGauge score={result.score} />
      </div>
      <div className="sim-card__body">
        <span className="sim-card__name">{result.instrumentName}</span>
        <span className="sim-card__broker">{result.brokerName}</span>
        <div className="sim-card__cost-bar" aria-hidden="true">
          {segments.map(s => (
            <div key={s.key} className={`sim-card__cost-segment ${s.cls}`} style={{ flex: s.flex }} />
          ))}
        </div>
      </div>
      <div className="sim-card__meta">
        <span
          className="sim-card__score sim-num"
          style={{ color: result.score >= 80 ? 'var(--sim-accent)' : result.score >= 60 ? 'var(--sim-success)' : 'var(--sim-gold)' }}
        >
          {result.score}
        </span>
        <FeasibilityBadge status={result.feasibility as Feasibility} />
      </div>
    </article>
  );
}
