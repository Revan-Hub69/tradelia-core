'use client';

import React, { useState } from 'react';
import { useSimulatorEngine } from '@/hooks/useSimulatorEngine';
import { usePanelSheet } from '@/hooks/usePanelSheet';
import { ScoreCardList } from './ScoreCardList';
import { SimResultsEmpty } from './SimResultsEmpty';
import { SimulatoreSkeleton } from './SimulatoreSkeleton';

/* ─── ASSET TREE ──────────────────────────────────────────────────────── */
const ASSET_TREE: Record<string, Record<string, string[]>> = {
  Forex: {
    Majors: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF'],
    Minors: ['EUR/GBP', 'EUR/JPY', 'GBP/JPY'],
    Exotic: ['USD/TRY', 'USD/ZAR', 'EUR/TRY'],
  },
  Crypto: {
    'Large Cap': ['BTC/USD', 'ETH/USD', 'BNB/USD'],
    'Mid Cap':   ['SOL/USD', 'ADA/USD', 'DOT/USD'],
    Stablecoin:  ['USDT/USD', 'USDC/USD'],
  },
  Indici: {
    Europa: ['DAX 40', 'FTSE 100', 'CAC 40'],
    USA:    ['S&P 500', 'NASDAQ 100', 'DOW 30'],
    Asia:   ['Nikkei 225', 'Hang Seng'],
  },
  Azioni: {
    Tech:    ['Apple', 'Microsoft', 'NVIDIA', 'Meta'],
    Finance: ['JPMorgan', 'Goldman Sachs', 'Visa'],
    Energy:  ['ExxonMobil', 'Shell', 'TotalEnergies'],
  },
  Materie: {
    Metalli: ['Oro', 'Argento', 'Rame'],
    Energia: ['Petrolio WTI', 'Gas Nat.', 'Brent'],
  },
};

/* ─── TYPES ───────────────────────────────────────────────────────────── */
type StyleType     = 'scalping' | 'intraday' | 'swing' | 'position';
type IntensityType = 'raro' | 'regolare' | 'frequente';
type AccountType   = 'demo' | 'micro' | 'retail' | 'semipro' | 'pro';
type LevaType      = 'bassa' | 'media' | 'alta';

/* ─── OPTIONS ─────────────────────────────────────────────────────────── */
const STYLE_OPTIONS: { id: StyleType; label: string; hint: string }[] = [
  { id: 'scalping',  label: 'Scalping',  hint: 'sec / min' },
  { id: 'intraday',  label: 'Intraday',  hint: 'ore'       },
  { id: 'swing',     label: 'Swing',     hint: '2–14 gg'   },
  { id: 'position',  label: 'Position',  hint: '1 mese+'   },
];

const INTENSITY_OPTIONS: { id: IntensityType; label: string; hint: string }[] = [
  { id: 'raro',      label: 'Raro',      hint: '1–3 / sett.' },
  { id: 'regolare',  label: 'Regolare',  hint: '1–3 / giorno' },
  { id: 'frequente', label: 'Frequente', hint: '10+ / giorno'  },
];

const ACCOUNT_OPTIONS: { id: AccountType; label: string; range: string }[] = [
  { id: 'demo',    label: 'Demo / Test', range: '< €500'         },
  { id: 'micro',   label: 'Micro',       range: '€500 – €2k'     },
  { id: 'retail',  label: 'Retail',      range: '€2k – €10k'     },
  { id: 'semipro', label: 'Semi-pro',    range: '€10k – €50k'    },
  { id: 'pro',     label: 'Pro',         range: '€50k+'          },
];

const LEVA_OPTIONS: { id: LevaType; label: string; hint: string }[] = [
  { id: 'bassa',  label: 'Bassa',  hint: '1:2 – 1:5'   },
  { id: 'media',  label: 'Media',  hint: '1:10 – 1:20' },
  { id: 'alta',   label: 'Alta',   hint: '1:50 – 1:500' },
];

/* ─── CHIP GROUP ──────────────────────────────────────────────────────── */
function ChipGroup<T extends string>({
  options, value, onChange, mono = false,
}: {
  options: { id: T; label: string; hint?: string }[];
  value: T | null;
  onChange: (v: T) => void;
  mono?: boolean;
}) {
  return (
    <div className="sim-chips">
      {options.map(o => (
        <button
          key={o.id} type="button"
          className={mono ? 'sim-chip sim-chip--mono' : 'sim-chip'}
          data-active={value === o.id ? 'true' : 'false'}
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
        >
          <span>{o.label}</span>
          {o.hint && <span className="sim-chip__hint">{o.hint}</span>}
        </button>
      ))}
    </div>
  );
}

function StringChipGroup({
  options, value, onChange, mono,
}: {
  options: string[]; value: string | null; onChange: (v: string) => void; mono?: boolean;
}) {
  return (
    <div className="sim-chips">
      {options.map(o => (
        <button
          key={o} type="button"
          className={mono ? 'sim-chip sim-chip--mono' : 'sim-chip'}
          data-active={value === o ? 'true' : 'false'}
          aria-pressed={value === o}
          onClick={() => onChange(o)}
        >{o}</button>
      ))}
    </div>
  );
}

/* ─── SECTION + BLOCK DIVIDER ─────────────────────────────────────────── */
function Section({ label, value, hint, children }: {
  label: string; value?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="sim-section">
      <div className="sim-section__header">
        <span className="sim-section__label">{label}</span>
        {value && <span className="sim-section__value sim-num">{value}</span>}
      </div>
      {hint && <p className="sim-section__hint">{hint}</p>}
      {children}
    </div>
  );
}

function BlockDivider({ label }: { label: string }) {
  return <div className="sim-block-divider">{label}</div>;
}

/* ─── SHELL ───────────────────────────────────────────────────────────── */
export function SimulatoreShell() {
  const {
    assetClass, setAssetClass,
    results, isComputing,
  } = useSimulatorEngine();

  const [subGroup,   setSubGroup]   = useState<string | null>(null);
  const [asset,      setAsset]      = useState<string | null>(null);
  const [style,      setStyle]      = useState<StyleType>('intraday');
  const [intensity,  setIntensity]  = useState<IntensityType>('regolare');
  const [account,    setAccount]    = useState<AccountType>('retail');
  const [leva,       setLeva]       = useState<LevaType>('media');

  const groups = assetClass ? Object.keys(ASSET_TREE[assetClass] ?? {}) : [];
  const assets = assetClass && subGroup ? (ASSET_TREE[assetClass]?.[subGroup] ?? []) : [];

  const handleGroupChange = (g: string) => { setAssetClass(g); setSubGroup(null); setAsset(null); };
  const handleSubChange   = (s: string) => { setSubGroup(s);   setAsset(null); };

  const { snap, toggle: toggleSheet, onTouchStart, onTouchMove, onTouchEnd, sheetRef } =
    usePanelSheet();

  const statusAsset   = asset ?? subGroup ?? assetClass ?? '—';
  const statusAccount = ACCOUNT_OPTIONS.find(o => o.id === account)?.label ?? '—';

  /* ── PANEL CONTENT ──────────────────────────────────────────────────── */
  const panelContent = (
    <>
      {/* ══ BLOCCO 1 — STRUMENTO ══ */}
      <BlockDivider label="Strumento" />

      <Section label="Categoria" value={assetClass ?? '—'}>
        <StringChipGroup
          options={Object.keys(ASSET_TREE)}
          value={assetClass}
          onChange={handleGroupChange}
        />
      </Section>

      {assetClass && (
        <Section label="Sottogruppo" value={subGroup ?? '—'}>
          <StringChipGroup
            options={groups}
            value={subGroup}
            onChange={handleSubChange}
          />
        </Section>
      )}

      {subGroup && assets.length > 0 && (
        <Section label="Asset" value={asset ?? '—'} hint="Opzionale — per confronto specifico">
          <StringChipGroup
            options={assets}
            value={asset}
            onChange={setAsset}
            mono
          />
        </Section>
      )}

      {/* ══ BLOCCO 2 — IL TUO PROFILO ══ */}
      <BlockDivider label="Il tuo profilo" />

      <Section
        label="Stile operativo"
        value={STYLE_OPTIONS.find(o => o.id === style)?.label}
        hint="Determina l'orizzonte e i costi overnight"
      >
        <ChipGroup options={STYLE_OPTIONS} value={style} onChange={setStyle} />
      </Section>

      <Section
        label="Frequenza operazioni"
        value={INTENSITY_OPTIONS.find(o => o.id === intensity)?.label}
        hint="Quante operazioni apri nell'orizzonte scelto"
      >
        <ChipGroup options={INTENSITY_OPTIONS} value={intensity} onChange={setIntensity} />
      </Section>

      <Section
        label="Dimensione account"
        value={ACCOUNT_OPTIONS.find(o => o.id === account)?.range}
        hint="Capitale totale che gestisci"
      >
        <div className="sim-chips sim-chips--col">
          {ACCOUNT_OPTIONS.map(o => (
            <button
              key={o.id} type="button"
              className="sim-chip sim-chip--row"
              data-active={account === o.id ? 'true' : 'false'}
              aria-pressed={account === o.id}
              onClick={() => setAccount(o.id)}
            >
              <span className="sim-chip__main">{o.label}</span>
              <span className="sim-chip__hint">{o.range}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section
        label="Leva finanziaria"
        value={LEVA_OPTIONS.find(o => o.id === leva)?.hint}
        hint="Moltiplicatore di esposizione sul mercato"
      >
        <ChipGroup options={LEVA_OPTIONS} value={leva} onChange={setLeva} />
      </Section>
    </>
  );

  /* ── RESULTS AREA ───────────────────────────────────────────────────── */
  const resultsArea = (
    <section className="sim-results" aria-label="Risultati simulazione" aria-live="polite">
      {!isComputing && results.length > 0 && (
        <div className="sim-results__header">
          <span className="sim-results__count">{results.length} strumenti analizzati</span>
          <div className="sim-results__legend">
            {[
              { label: 'Spread',    color: 'var(--s-ac)'    },
              { label: 'Comm.',     color: 'var(--s-gold)'  },
              { label: 'Overnight', color: 'var(--s-amber)' },
              { label: 'Slippage', color: 'var(--s-t3)'    },
            ].map(l => (
              <span key={l.label} className="sim-results__legend-item">
                <span className="sim-results__legend-dot" style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
      )}
      {isComputing ? (
        <SimulatoreSkeleton count={4} />
      ) : results.length === 0 ? (
        <SimResultsEmpty />
      ) : (
        <ScoreCardList results={results} />
      )}
    </section>
  );

  return (
    <>
      {/* ── DESKTOP ≥861px ── */}
      <aside className="sim-panel" aria-label="Parametri simulazione">
        <div className="sim-panel__content">
          {panelContent}
        </div>
      </aside>

      {resultsArea}

      {/* ── MOBILE ≤860px ── bottom sheet */}
      <div
        ref={sheetRef}
        className={`sim-sheet sim-sheet--${snap}`}
        aria-label="Parametri simulazione"
        role="complementary"
      >
        <div
          className="sim-sheet__handle-area"
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
          onClick={toggleSheet} role="button" tabIndex={0}
          aria-label={snap === 'collapsed' ? 'Apri parametri' : 'Chiudi parametri'}
          onKeyDown={e => e.key === 'Enter' && toggleSheet()}
        >
          <div className="sim-sheet__drag-bar" aria-hidden="true" />
          <div className="sim-sheet__status">
            <span className="sim-sheet__status-exposure">{statusAccount}</span>
            <span className="sim-sheet__status-dot" aria-hidden="true" />
            <span className="sim-sheet__status-asset">{statusAsset}</span>
            <svg className={`sim-sheet__chevron sim-sheet__chevron--${snap}`}
              width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div
          className="sim-sheet__content"
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        >
          {panelContent}
        </div>
      </div>
    </>
  );
}
