'use client';

export type Feasibility = 'OPTIMAL' | 'FEASIBLE' | 'WARNING' | 'INFEASIBLE';

const LABELS: Record<Feasibility, string> = {
  OPTIMAL:    'Ottimale',
  FEASIBLE:   'Fattibile',
  WARNING:    'Attenzione',
  INFEASIBLE: 'Non fattibile',
};

const CLASS_MAP: Record<Feasibility, string> = {
  OPTIMAL:    'sim-badge sim-badge--optimal',
  FEASIBLE:   'sim-badge sim-badge--feasible',
  WARNING:    'sim-badge sim-badge--warning',
  INFEASIBLE: 'sim-badge sim-badge--infeasible',
};

export function FeasibilityBadge({ status }: { status: Feasibility }) {
  return (
    <span className={CLASS_MAP[status]}>
      {LABELS[status]}
    </span>
  );
}
