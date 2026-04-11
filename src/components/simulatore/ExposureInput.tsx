'use client';

const PRESETS = [500, 1000, 5000, 10000, 25000, 50000];
const MIN = 100;
const MAX = 100000;

type Props = { value: number; onChange: (v: number) => void; };

export function ExposureInput({ value, onChange }: Props) {
  const clamp = (v: number) => Math.min(MAX, Math.max(MIN, v));
  return (
    <div className="sim-exposure">
      <div className="sim-exposure__value-row">
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
      <input
        type="range"
        className="sim-exposure__slider"
        min={MIN} max={MAX} step={100}
        value={value}
        aria-hidden="true"
        onChange={e => onChange(Number(e.target.value))}
      />
      <div className="sim-exposure__presets" role="group" aria-label="Importi rapidi">
        {PRESETS.map(p => (
          <button
            key={p} type="button"
            className="sim-exposure__preset"
            data-active={value === p ? 'true' : 'false'}
            onClick={() => onChange(p)}
          >
            {p >= 1000 ? `${p / 1000}k` : p}
          </button>
        ))}
      </div>
    </div>
  );
}
