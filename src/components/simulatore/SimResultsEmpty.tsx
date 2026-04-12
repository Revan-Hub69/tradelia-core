'use client';

export function SimResultsEmpty() {
  return (
    <div className="sim-results__empty" role="status">
      <p className="sim-results__empty-lead">
        Seleziona categoria, stile e account per avviare il confronto.
      </p>
      <dl className="sim-results__guide">
        <div>
          <dt>Costo totale</dt>
          <dd>Spread + commissione + overnight swap, normalizzati in basis points sul nozionale.</dd>
        </div>
        <div>
          <dt>Score 1–100</dt>
          <dd>Decadimento esponenziale: 0 bps → 100, 20 bps → 50, 40 bps → 25.</dd>
        </div>
        <div>
          <dt>Feasibility</dt>
          <dd>Access · CanTrade · Sustainable (rischio/trade &lt; 2% capitale, soglia ESMA).</dd>
        </div>
        <div>
          <dt>Dati</dt>
          <dd>Spread, commissioni e swap estratti dai siti broker. Medie storiche recenti, non real-time.</dd>
        </div>
      </dl>
    </div>
  );
}
