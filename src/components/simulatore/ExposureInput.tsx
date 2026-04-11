'use client';

const PRESETS = [500, 1_000, 5_000, 10_000, 25_000, 50_000];
const MIN = 100;
const MAX = 100_000;

type Props = { value: number; onChange: (v: number) => void; };

export function ExposureInput({ value, onChange }: Props) {
  const clamp = (v: number) => Math.min(MAX, Math.max(MIN, isNaN(v) ? MIN : v));
  const fillPct = ((value - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="sim-exposure">
      {/* Input numerico */}
      <div className="sim-exposure__field">
        <span className="sim-exposure__currency">€</span>
        <input
          type="number"
          className="sim-exposure__input"
          value={value}
          min={MIN} max={MAX} step={100}
          aria-label="Esposizione target in euro"
          onChange={e => onChange(clamp(Number(e.target.value)))}
        />
      </div>

      {/* Range con fill visivo */}
      <div className="sim-exposure__track">
        <div className="sim-exposure__track-bg" />
        <div
          className="sim-exposure__track-fill"
          style={{ width: `${fillPct}%` }}
          aria-hidden="true"
        />
        <input
          type="range"
          className="sim-exposure__slider"
          min={MIN} max={MAX} step={100}
          value={value}
          aria-hidden="true"
          tabIndex={-1}
          onChange={e => onChange(Number(e.target.value))}
        />
      </div>

      {/* Quick presets */}
      <div className="sim-exposure__presets" role="group" aria-label="Importi rapidi">
        {PRESETS.map(p => (
          <button
            key={p} type="button"
            className="sim-exposure__preset"
            data-active={value === p ? 'true' : 'false'}
            onClick={() => onChange(p)}
          >
            {p >= 1000 ? `${p / 1000}k` : String(p)}
          </button>
        ))}
      </div>
    </div>
  );
}
