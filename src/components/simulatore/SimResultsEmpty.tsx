'use client';

export function SimResultsEmpty() {
  return (
    <div className="sim-results__empty" role="status">

      {/* ── HEADER ───────────────────────────────────────────── */}
      <div className="sim-results__empty-header">
        <svg
          className="sim-results__empty-icon"
          width="36" height="36" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M3 3h18M3 9h18M3 15h12M3 21h8" />
        </svg>
        <p className="sim-results__empty-lead">
          Seleziona categoria, stile e account per avviare il confronto.
        </p>
      </div>

      {/* ── ENGINE GUIDE ─────────────────────────────────────── */}
      <div className="sim-results__guide">

        <h3 className="sim-results__guide-title">Come funziona il motore</h3>

        <div className="sim-results__guide-grid">

          <div className="sim-results__guide-block">
            <span className="sim-results__guide-label">Modello di costo</span>
            <p>
              Per ogni offerta il motore calcola quattro componenti:
              <strong> spread</strong> (costo d&apos;entrata/uscita),
              <strong> commissione</strong> (per lotto o contratto),
              <strong> overnight swap</strong> (maturato sui giorni di holding),
              <strong> slippage</strong> (stimato da execution type).
              La somma viene normalizzata in <em>basis points</em> sul nozionale.
            </p>
          </div>

          <div className="sim-results__guide-block">
            <span className="sim-results__guide-label">Sizing posizione</span>
            <p>
              CFD/Spot: lotti = capitale / 100.000 (standard FX lot).
              Futures: il motore seleziona la taglia contratto (micro / mini / full)
              massimizzando il nozionale con il 20% del capitale disponibile come margine,
              in linea con best practice 2026 per conti retail.
            </p>
          </div>

          <div className="sim-results__guide-block">
            <span className="sim-results__guide-label">Feasibility check</span>
            <p>
              Ogni offerta riceve un giudizio su tre assi:
              <strong> Access</strong> (nozionale ≥ minimo broker),
              <strong> CanTrade</strong> (capitale ≥ margine richiesto),
              <strong> Sustainable</strong> (rischio per trade &lt; 2% del capitale,
              secondo il Kelly Criterion conservativo standard ESMA).
            </p>
          </div>

          <div className="sim-results__guide-block">
            <span className="sim-results__guide-label">Score 1–100</span>
            <p>
              Score = 100 × e<sup>−k · totalBps</sup> con half-life a 20 bps.
              Un&apos;offerta a 0 bps vale 100, a 20 bps vale 50, a 40 bps vale 25.
              Il decadimento esponenziale riflette la sensibilità reale
              del rendimento netto al costo di transazione.
            </p>
          </div>

          <div className="sim-results__guide-block">
            <span className="sim-results__guide-label">Overnight e triple swap</span>
            <p>
              Lo swap è calcolato in pips/giorno × pip value × lotti × giorni.
              I mercoledì incorporano il triplo swap (T+2 settlement weekend).
              Carry positivo (swap ricevuto) non è dedotto in v1: stima conservativa.
            </p>
          </div>

          <div className="sim-results__guide-block">
            <span className="sim-results__guide-label">Dati e aggiornamenti</span>
            <p>
              Spread, commissioni e swap sono estratti dai siti ufficiali dei broker.
              I dati hanno data di rilevazione visibile su ogni offerta.
              Il motore non usa feed real-time: i valori sono medie storiche recenti.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
