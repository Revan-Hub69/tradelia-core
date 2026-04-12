// ============================================================
// useSimulation
// Orchestrator hook: input → recommend() → RecommendOutput
//
// NON contiene logica UI, validazione form, o side effects.
// È l'unico punto del sistema dove recommend() viene chiamata
// dal frontend.
//
// Usage:
//   const { run, reset, result, status } = useSimulation();
//   run(input);   // → status: 'running' → 'done' | 'error'
//   reset();      // → status: 'idle', result: null
// ============================================================

import { useState, useCallback, useRef } from 'react';
import { recommend }          from '@/lib/simulator/recommend';
import type { RecommendInput, RecommendOutput } from '@/lib/simulator/recommend';

export type SimulationStatus = 'idle' | 'running' | 'done' | 'error';

export interface SimulationState {
  status:  SimulationStatus;
  result:  RecommendOutput | null;
  error:   string | null;
  /** Input usato per l'ultima simulazione (per confronto scenario) */
  lastInput: RecommendInput | null;
}

export interface UseSimulationReturn extends SimulationState {
  /** Lancia la simulazione con i parametri forniti */
  run:   (input: RecommendInput) => void;
  /** Torna allo stato idle, azzera risultato */
  reset: () => void;
}

const INITIAL_STATE: SimulationState = {
  status:    'idle',
  result:    null,
  error:     null,
  lastInput: null,
};

export function useSimulation(): UseSimulationReturn {
  const [state, setState] = useState<SimulationState>(INITIAL_STATE);

  // runId permette di ignorare risultati stale se l'utente re-lancia
  // mentre la precedente è ancora in volo (futuro: async workers)
  const runIdRef = useRef(0);

  const run = useCallback((input: RecommendInput) => {
    const currentRunId = ++runIdRef.current;

    setState(prev => ({ ...prev, status: 'running', error: null, lastInput: input }));

    // recommend() è sincrona; setTimeout(0) cede il render frame
    // così lo spinner compare prima del calcolo
    setTimeout(() => {
      if (runIdRef.current !== currentRunId) return; // stale

      try {
        const result = recommend(input);
        setState({ status: 'done', result, error: null, lastInput: input });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Errore sconosciuto';
        setState(prev => ({ ...prev, status: 'error', error: message }));
      }
    }, 0);
  }, []);

  const reset = useCallback(() => {
    runIdRef.current++; // invalida run in corso
    setState(INITIAL_STATE);
  }, []);

  return { ...state, run, reset };
}
