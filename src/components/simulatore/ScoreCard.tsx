'use client';

import { ScoreGauge } from './ScoreGauge';
import { FeasibilityBadge, type Feasibility } from './FeasibilityBadge';
import type { SimulatorResult } from '@/hooks/useSimulatorEngine';

const fmt = (n: number) =>
  n < 0.01 ? '<0.01' : n.toFixed(2);

export function ScoreCard({ result, rank }: { result: SimulatorResult; rank: number }) {
  const isOptimal = rank === 1;
  const totalCost = result.spreadCost + result.commissionCost + result.overnightCost + result.slippageCost;

  const segs = totalCost > 0 ? [
    { key: 'spread',    flex: result.spreadCost / totalCost,     cls: 'sim-card__cost-segment--spread',    dot: 'var(--s-ac)',    label: 'Spread',     val: result.spreadCost },
    { key: 'comm',      flex: result.commissionCost / totalCost, cls: 'sim-card__cost-segment--comm',      dot: 'var(--s-gold)',  label: 'Comm',       val: result.commissionCost },
    { key: 'overnight', flex: result.overnightCost / totalCost,  cls: 'sim-card__cost-segment--overnight', dot: 'var(--s-amber)', label: 'Overnight',  val: result.overnightCost },
    { key: 'slippage',  flex: result.slippageCost / totalCost,   cls: 'sim-card__cost-segment--slippage',  dot: 'var(--s-t3)',   label: 'Slippage',   val: result.slippageCost },
  ].filter(s => s.val > 0) : [];

  const scoreColor =
    result.score >= 80 ? 'var(--s-ac)' :
    result.score >= 60 ? 'var(--s-green)' :
    result.score >= 40 ? 'var(--s-gold)' : 'var(--s-amber)';

  return (
    <article
      className={`sim-card${isOptimal ? ' sim-card--optimal' : ''}`}
      aria-label={`${result.instrumentName} — score ${result.score}/100`}
    >
      {/* Rank + Gauge */}
      <div className="sim-card__rank">
        <span className="sim-card__rank-num">#{rank}</span>
        <ScoreGauge score={result.score} />
      </div>

      {/* Body */}
      <div className="sim-card__body">
        <div className="sim-card__name-row">
          <span className="sim-card__name">{result.instrumentName}</span>
        </div>
        <span className="sim-card__broker">{result.brokerName}</span>

        {/* Cost breakdown bar */}
        <div className="sim-card__cost-bar" aria-hidden="true">
          {segs.map(s => (
            <div key={s.key} className={`sim-card__cost-segment ${s.cls}`} style={{ flex: s.flex }} />
          ))}
        </div>

        {/* Cost legend inline */}
        {segs.length > 0 && (
          <div className="sim-card__cost-detail" aria-label="Dettaglio costi">
            {segs.map(s => (
              <span key={s.key} className="sim-card__cost-item">
                <span className="sim-card__cost-dot" style={{ background: s.dot }} />
                <span>€{fmt(s.val)}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="sim-card__meta">
        <span className="sim-card__score sim-num" style={{ color: scoreColor }}>
          {result.score}
        </span>
        <span className="sim-card__score-label">/ 100</span>
        <FeasibilityBadge status={result.feasibility as Feasibility} />
        {result.deviationPct > 0 && (
          <span className="sim-card__deviation">
            Δ{result.deviationPct.toFixed(1)}%
          </span>
        )}
      </div>
    </article>
  );
}
