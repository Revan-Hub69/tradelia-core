// ============================================================
// SimulatorInputForm
// Form controllato per i parametri di simulazione.
//
// Responsabilità:
//   - raccoglie i campi di RecommendInput
//   - valida inline (capitale, stop loss)
//   - chiama onSubmit(input) quando valido
//   - chiama onReset() per azzerare
//
// NON chiama recommend() direttamente.
// ============================================================

import React, { useState, useId } from 'react';
import type { RecommendInput } from '@/lib/simulator/recommend';

// ── Tipi ──────────────────────────────────────────────────────────────────

type FormValues = {
  exposure:       string;
  capital:        string;
  underlyingId:   string;
  direction:      'long' | 'short';
  stopLossPips:   string;
  tradesPerMonth: string;
  avgHoldingDays: string;
};

const DEFAULTS: FormValues = {
  exposure:       '10000',
  capital:        '10000',
  underlyingId:   'eurusd',
  direction:      'long',
  stopLossPips:   '20',
  tradesPerMonth: '10',
  avgHoldingDays: '1',
};

const ASSETS = [
  { id: 'eurusd',  label: 'EUR/USD' },
  { id: 'gbpusd',  label: 'GBP/USD' },
  { id: 'usdjpy',  label: 'USD/JPY' },
  { id: 'gbpjpy',  label: 'GBP/JPY' },
  { id: 'eurjpy',  label: 'EUR/JPY' },
  { id: 'audusd',  label: 'AUD/USD' },
  { id: 'usdcad',  label: 'USD/CAD' },
  { id: 'usdchf',  label: 'USD/CHF' },
];

export interface SimulatorInputFormProps {
  onSubmit:  (input: RecommendInput) => void;
  onReset?:  () => void;
  isRunning?: boolean;
}

// ── Sub-components ────────────────────────────────────────────────────────

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium text-gray-600 dark:text-gray-400">
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600 dark:text-red-400">{message}</p>;
}

function NumberInput({
  id, value, onChange, min, max, step = '1', placeholder,
}: {
  id: string; value: string; onChange: (v: string) => void;
  min?: string; max?: string; step?: string; placeholder?: string;
}) {
  return (
    <input
      id={id}
      type="number"
      inputMode="numeric"
      value={value}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
    />
  );
}

// ── Validation ─────────────────────────────────────────────────────────────

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const exposure  = parseFloat(values.exposure);
  const capital   = parseFloat(values.capital);
  const sl        = parseFloat(values.stopLossPips);
  const trades    = parseInt(values.tradesPerMonth, 10);
  const holding   = parseInt(values.avgHoldingDays, 10);

  if (!exposure || exposure <= 0)   errors.exposure       = 'Inserisci un valore positivo';
  if (!capital  || capital  <= 0)   errors.capital        = 'Inserisci un valore positivo';
  if (capital > exposure)           errors.capital        = 'Il capitale non può superare l\'esposizione';
  if (!sl || sl <= 0)               errors.stopLossPips   = 'Stop loss deve essere > 0';
  if (!trades || trades <= 0)       errors.tradesPerMonth = 'Almeno 1 trade al mese';
  if (!holding || holding <= 0)     errors.avgHoldingDays = 'Almeno 1 giorno';

  return errors;
}

// ── Main form ──────────────────────────────────────────────────────────────

export function SimulatorInputForm({ onSubmit, onReset, isRunning }: SimulatorInputFormProps) {
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  const [values, setValues]       = useState<FormValues>(DEFAULTS);
  const [errors, setErrors]       = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function set(field: keyof FormValues, value: string) {
    setValues(prev => {
      const next = { ...prev, [field]: value };
      if (submitted) setErrors(validate(next));
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({
      assetClass:     'FOREX',
      underlyingId:   values.underlyingId,
      direction:      values.direction,
      exposure:       parseFloat(values.exposure),
      capital:        parseFloat(values.capital),
      stopLossPips:   parseFloat(values.stopLossPips),
      tradesPerMonth: parseInt(values.tradesPerMonth, 10),
      avgHoldingDays: parseInt(values.avgHoldingDays, 10),
    });
  }

  function handleReset() {
    setValues(DEFAULTS);
    setErrors({});
    setSubmitted(false);
    onReset?.();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

      {/* ---- Asset ---- */}
      <div>
        <FieldLabel htmlFor={id('asset')}>Coppia valutaria</FieldLabel>
        <select
          id={id('asset')}
          value={values.underlyingId}
          onChange={e => set('underlyingId', e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        >
          {ASSETS.map(a => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>
      </div>

      {/* ---- Direction ---- */}
      <div>
        <FieldLabel htmlFor={id('direction')}>Direzione</FieldLabel>
        <div className="mt-1 flex gap-2">
          {(['long', 'short'] as const).map(d => (
            <button
              key={d}
              type="button"
              onClick={() => set('direction', d)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                values.direction === d
                  ? d === 'long'
                    ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                    : 'border-red-400 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  : 'border-gray-300 bg-white text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {d === 'long' ? '▲ Long' : '▼ Short'}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Exposure ---- */}
      <div>
        <FieldLabel htmlFor={id('exposure')}>Esposizione (EUR)</FieldLabel>
        <div className="mt-1">
          <NumberInput id={id('exposure')} value={values.exposure} onChange={v => set('exposure', v)} min="1" placeholder="10000" />
          <FieldError message={errors.exposure} />
        </div>
      </div>

      {/* ---- Capital ---- */}
      <div>
        <FieldLabel htmlFor={id('capital')}>Capitale disponibile (EUR)</FieldLabel>
        <div className="mt-1">
          <NumberInput id={id('capital')} value={values.capital} onChange={v => set('capital', v)} min="1" placeholder="10000" />
          <FieldError message={errors.capital} />
        </div>
      </div>

      {/* ---- Stop Loss ---- */}
      <div>
        <FieldLabel htmlFor={id('sl')}>Stop Loss (pips)</FieldLabel>
        <div className="mt-1">
          <NumberInput id={id('sl')} value={values.stopLossPips} onChange={v => set('stopLossPips', v)} min="1" step="0.5" placeholder="20" />
          <FieldError message={errors.stopLossPips} />
        </div>
      </div>

      {/* ---- Strategy ---- */}
      <fieldset className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <legend className="px-1 text-xs font-medium text-gray-500 dark:text-gray-400">Strategia</legend>
        <div className="flex flex-col gap-4">
          <div>
            <FieldLabel htmlFor={id('trades')}>Trade/mese</FieldLabel>
            <div className="mt-1">
              <NumberInput id={id('trades')} value={values.tradesPerMonth} onChange={v => set('tradesPerMonth', v)} min="1" max="200" placeholder="10" />
              <FieldError message={errors.tradesPerMonth} />
            </div>
          </div>
          <div>
            <FieldLabel htmlFor={id('holding')}>Holding medio (giorni)</FieldLabel>
            <div className="mt-1">
              <NumberInput id={id('holding')} value={values.avgHoldingDays} onChange={v => set('avgHoldingDays', v)} min="1" max="30" placeholder="1" />
              <p className="mt-1 text-xs text-gray-400">
                {parseInt(values.avgHoldingDays, 10) === 1 ? 'Intraday (no overnight)' : `Swing — overnight su ${values.avgHoldingDays}g`}
              </p>
              <FieldError message={errors.avgHoldingDays} />
            </div>
          </div>
        </div>
      </fieldset>

      {/* ---- Actions ---- */}
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={isRunning}
          className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRunning ? 'Calcolo…' : 'Simula'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
