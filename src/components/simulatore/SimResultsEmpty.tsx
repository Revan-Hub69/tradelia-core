'use client';

import { useEffect, useState } from 'react';

const DEMO_RESULTS = [
  {
    broker: 'Tickmill Pro',
    account: 'RAW ECN',
    score: 94,
    feasibility: 'OPTIMAL' as const,
    spread: 0.9,
    comm: 5.5,
    overnight: 0,
    total: 6.4,
  },
  {
    broker: 'IC Markets',
    account: 'Raw Spread',
    score: 71,
    feasibility: 'FEASIBLE' as const,
    spread: 12,
    comm: 0,
    overnight: 0,
    total: 12,
  },
];

const FEASIBILITY_LABEL: Record<string, string> = {
  OPTIMAL: 'Ottimale',
  FEASIBLE: 'Fattibile',
  WARNING: 'Attenzione',
  INFEASIBLE: 'Non accessibile',
};

function ScoreDial({ score, animate }: { score: number; animate: boolean }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const pct = animate ? score / 100 : 0;
  const color =
    score >= 80 ? 'var(--s-ac)' : score >= 50 ? 'var(--s-gold)' : 'var(--s-amber)';
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r={r} fill="none" stroke="var(--s-divider)" strokeWidth="3" />
      <circle
        cx="24" cy="24" r={r}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={c - pct * c}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
        style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.16,1,0.3,1)' }}
      />
      <text x="24" y="28" textAnchor="middle" fontSize="11" fontWeight="600"
        fill="var(--s-text)" fontFamily="var(--font-mono, ui-monospace, monospace)">
        {animate ? score : '—'}
      </text>
    </svg>
  );
}

function CostBar({ spread, comm, overnight, total, animate }: {
  spread: number; comm: number; overnight: number; total: number; animate: boolean;
}) {
  const w = (v: number) =>
    animate ? `${Math.max(2, (v / (total || 1)) * 100)}%` : '0%';
  return (
    <div className="sim-empty__bar-wrap">
      <div className="sim-empty__bar">
        <div className="sim-empty__bar-seg" data-type="spread"
          style={{ width: w(spread), transition: 'width 700ms cubic-bezier(0.16,1,0.3,1) 200ms' }} />
        <div className="sim-empty__bar-seg" data-type="comm"
          style={{ width: w(comm), transition: 'width 700ms cubic-bezier(0.16,1,0.3,1) 350ms' }} />
        <div className="sim-empty__bar-seg" data-type="overnight"
          style={{ width: w(overnight), transition: 'width 700ms cubic-bezier(0.16,1,0.3,1) 500ms' }} />
      </div>
      <span className="sim-empty__bar-total sim-num">
        {animate ? `${total.toFixed(1)} €` : '—'}
      </span>
    </div>
  );
}

export function SimResultsEmpty() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="sim-empty" role="status">

      <div className="sim-empty__intro">
        <p className="sim-empty__intro-label">Anteprima risultati</p>
        <p className="sim-empty__intro-desc">
          Seleziona categoria, stile e account per calcolare i costi reali sul tuo profilo.
        </p>
      </div>

      <div className="sim-empty__cards" aria-hidden="true">
        {DEMO_RESULTS.map((r, i) => (
          <div
            key={r.broker}
            className="sim-empty__card"
            style={{
              opacity: animate ? (i === 0 ? 1 : 0.5) : 0,
              transform: animate ? 'translateY(0)' : 'translateY(10px)',
              transition:
                `opacity 360ms ease ${i * 100}ms,` +
                `transform 360ms cubic-bezier(0.16,1,0.3,1) ${i * 100}ms`,
            }}
          >
            <div className="sim-empty__card-left">
              <ScoreDial score={r.score} animate={animate} />
              <div>
                <p className="sim-empty__card-broker">{r.broker}</p>
                <p className="sim-empty__card-account">{r.account}</p>
              </div>
            </div>

            <div className="sim-empty__card-right">
              <span
                className="sim-empty__card-badge"
                data-feasibility={r.feasibility.toLowerCase()}
              >
                {FEASIBILITY_LABEL[r.feasibility]}
              </span>
              <CostBar
                spread={r.spread}
                comm={r.comm}
                overnight={r.overnight}
                total={r.total}
                animate={animate}
              />
              <div className="sim-empty__card-legend">
                <span data-type="spread">Spread</span>
                <span data-type="comm">Comm.</span>
                <span data-type="overnight">Swap</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="sim-empty__overlay"
        style={{
          opacity: animate ? 1 : 0,
          transition: 'opacity 280ms ease 580ms',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>Imposta il profilo per sbloccare i risultati reali</span>
      </div>

    </div>
  );
}
