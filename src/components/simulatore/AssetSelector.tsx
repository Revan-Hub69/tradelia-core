'use client';

export type AssetClass = 'FOREX' | 'CRYPTO' | 'EQUITY' | 'COMMODITY' | 'INDEX';

const ASSETS: { id: AssetClass; label: string }[] = [
  { id: 'FOREX',     label: 'Forex' },
  { id: 'CRYPTO',    label: 'Crypto' },
  { id: 'EQUITY',    label: 'Azioni' },
  { id: 'INDEX',     label: 'Indici' },
  { id: 'COMMODITY', label: 'Materie prime' },
];

type Props = {
  value: AssetClass;
  onChange: (v: AssetClass) => void;
};

export function AssetSelector({ value, onChange }: Props) {
  return (
    <div className="sim-chips" role="group" aria-label="Seleziona categoria strumento">
      {ASSETS.map(a => (
        <button
          key={a.id}
          type="button"
          className="sim-chip"
          data-active={value === a.id ? 'true' : 'false'}
          aria-pressed={value === a.id}
          onClick={() => onChange(a.id)}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
