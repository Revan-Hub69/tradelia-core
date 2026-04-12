'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSimulatorEngine } from '@/hooks/useSimulatorEngine';
import { usePanelSheet } from '@/hooks/usePanelSheet';
import { ScoreCardList } from './ScoreCardList';
import { SimResultsEmpty } from './SimResultsEmpty';
import { SimulatoreSkeleton } from './SimulatoreSkeleton';

/* ─── ASSET TREE ──────────────────────────────────────────────────── */
const ASSET_TREE: Record<string, Record<string, string[]>> = {
  Forex:   {
    Majors: ['EUR/USD','GBP/USD','USD/JPY','USD/CHF','AUD/USD'],
    Cross:  ['EUR/GBP','EUR/JPY','GBP/JPY'],
    Exotic: ['USD/TRY','USD/ZAR','EUR/PLN'],
  },
  Crypto:  { 'Large Cap': ['BTC/USD','ETH/USD','BNB/USD'], 'Mid Cap': ['SOL/USD','ADA/USD','DOT/USD'], Stablecoin: ['USDT/USD','USDC/USD'] },
  Indici:  { Europa: ['DAX 40','FTSE 100','CAC 40'], USA: ['S&P 500','NASDAQ 100','DOW 30'], Asia: ['Nikkei 225','Hang Seng'] },
  Azioni:  { Tech: ['Apple','Microsoft','NVIDIA','Meta'], Finance: ['JPMorgan','Goldman Sachs','Visa'], Energy: ['ExxonMobil','Shell','TotalEnergies'] },
  Materie: { Metalli: ['Oro','Argento','Rame'], Energia: ['Petrolio WTI','Gas Nat.','Brent'] },
};

/* ─── TYPES ───────────────────────────────────────────────────────── */
type StyleType   = 'scalping' | 'intraday' | 'swing' | 'position';
type FreqId      = 'low' | 'mid' | 'high';
type AccountType = 'demo' | 'micro' | 'retail' | 'semipro' | 'pro';
type LevaType    = 'nessuna' | 'bassa' | 'media' | 'alta';

/* ─── STEPS ───────────────────────────────────────────────────────── */
// Step order usato dal progress indicator.
// Ogni step è "completato" quando il suo valore è != null.
const STEPS = [
  'categoria',
  'sottogruppo',
  'stile',
  'frequenza',
  'account',
  'leva',
] as const;
type StepId = typeof STEPS[number];

/* ─── OPTIONS ─────────────────────────────────────────────────────── */
const STYLE_OPTIONS: { id: StyleType; label: string; hint: string }[] = [
  { id: 'scalping',  label: 'Scalping',  hint: 'sec / min' },
  { id: 'intraday',  label: 'Intraday',  hint: 'ore'       },
  { id: 'swing',     label: 'Swing',     hint: '2–14 gg'   },
  { id: 'position',  label: 'Position',  hint: '1 mese+'   },
];

type FreqOption = { id: FreqId; label: string; hint: string };
type FreqConfig = { unit: string; options: FreqOption[] };

const FREQ_BY_STYLE: Record<StyleType, FreqConfig> = {
  scalping: { unit: 'al giorno', options: [
    { id: 'low',  label: 'Bassa',   hint: '5–10 trade'  },
    { id: 'mid',  label: 'Media',   hint: '20–50 trade' },
    { id: 'high', label: 'Intensa', hint: '100+ trade'  },
  ]},
  intraday: { unit: 'al giorno', options: [
    { id: 'low',  label: 'Bassa',   hint: '1–2 trade'  },
    { id: 'mid',  label: 'Media',   hint: '3–5 trade'  },
    { id: 'high', label: 'Intensa', hint: '10+ trade'  },
  ]},
  swing: { unit: 'a settimana', options: [
    { id: 'low',  label: 'Bassa',   hint: '1–2 trade'  },
    { id: 'mid',  label: 'Media',   hint: '3–5 trade'  },
    { id: 'high', label: 'Intensa', hint: '10+ trade'  },
  ]},
  position: { unit: 'al mese', options: [
    { id: 'low',  label: 'Bassa',   hint: '1–2 trade'  },
    { id: 'mid',  label: 'Media',   hint: '3–5 trade'  },
    { id: 'high', label: 'Intensa', hint: '10+ trade'  },
  ]},
};

const ACCOUNT_OPTIONS: { id: AccountType; label: string; range: string }[] = [
  { id: 'demo',    label: 'Demo / Test', range: '< €500'      },
  { id: 'micro',   label: 'Micro',       range: '€500 – €2k'  },
  { id: 'retail',  label: 'Retail',      range: '€2k – €10k'  },
  { id: 'semipro', label: 'Semi-pro',    range: '€10k – €50k' },
  { id: 'pro',     label: 'Pro',         range: '€50k+'       },
];

const LEVA_OPTIONS: { id: LevaType; label: string; hint: string }[] = [
  { id: 'nessuna', label: 'Nessuna', hint: '1:1'          },
  { id: 'bassa',   label: 'Bassa',   hint: '1:2 – 1:5'    },
  { id: 'media',   label: 'Media',   hint: '1:10 – 1:20'  },
  { id: 'alta',    label: 'Alta',    hint: '1:50 – 1:500' },
];

/* ─── CHIP GROUP ──────────────────────────────────────────────────── */
function ChipGroup<T extends string>({
  options, value, onChange,
}: {
  options: { id: T; label: string; hint?: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="sim-chips">
      {options.map(o => (
        <button
          key={o.id} type="button"
          className="sim-chip"
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

/* ─── ANIMATED SECTION ────────────────────────────────────────────── */
/**
 * Wrapper che monta il contenuto con una fade+slide-up animation
 * ogni volta che appare (grazie alla key che cambia).
 */
function AnimatedSection({ show, children }: { show: boolean; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(show);
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setMounted(true);
      // micro-delay per triggerare la transition
      const t = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(t);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 280);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!mounted) return null;
  return (
    <div
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 240ms cubic-bezier(0.16,1,0.3,1), transform 240ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {children}
    </div>
  );
}

/* ─── SECTION ─────────────────────────────────────────────────────── */
function Section({ label, value, hint, children, done }: {
  label: string; value?: string; hint?: string; children: React.ReactNode; done?: boolean;
}) {
  return (
    <div className={`sim-section${done ? ' sim-section--done' : ''}`}>
      <div className="sim-section__header">
        <span className="sim-section__label">{label}</span>
        {value
          ? <span className="sim-section__value sim-num">{value}</span>
          : <span className="sim-section__value--empty">—</span>
        }
      </div>
      {hint && <p className="sim-section__hint">{hint}</p>}
      {children}
    </div>
  );
}

function BlockDivider({ label }: { label: string }) {
  return <div className="sim-block-divider">{label}</div>;
}

/* ─── PROGRESS INDICATOR ──────────────────────────────────────────── */
function ProgressDots({ completed, total }: { completed: number; total: number }) {
  return (
    <div className="sim-progress" aria-label={`${completed} di ${total} campi compilati`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="sim-progress__dot"
          data-done={i < completed ? 'true' : 'false'}
        />
      ))}
      <span className="sim-progress__label">{completed}/{total}</span>
    </div>
  );
}

/* ─── SHELL ───────────────────────────────────────────────────────── */
export function SimulatoreShell() {
  const { assetClass, setAssetClass, results, isComputing } = useSimulatorEngine();

  const [subGroup, setSubGroup] = useState<string | null>(null);
  const [asset,    setAsset]    = useState<string | null>(null);
  const [style,    setStyle]    = useState<StyleType | null>(null);
  const [freq,     setFreq]     = useState<FreqId | null>(null);
  const [account,  setAccount]  = useState<AccountType | null>(null);
  const [leva,     setLeva]     = useState<LevaType | null>(null);

  const { snap, toggle: toggleSheet, sheetRef } = usePanelSheet('collapsed');

  const contentRef = useRef<HTMLDivElement>(null);

  const groups = assetClass ? Object.keys(ASSET_TREE[assetClass] ?? {}) : [];
  const assets = assetClass && subGroup ? (ASSET_TREE[assetClass]?.[subGroup] ?? []) : [];

  const handleGroupChange = (g: string) => { setAssetClass(g); setSubGroup(null); setAsset(null); };
  const handleSubChange   = (s: string) => { setSubGroup(s); setAsset(null); };
  const handleStyleChange = (s: StyleType) => { setStyle(s); setFreq(null); };

  const freqConfig  = style ? FREQ_BY_STYLE[style] : null;
  const freqCurrent = freqConfig && freq ? freqConfig.options.find(o => o.id === freq) : null;
  const freqLabel   = freqCurrent && freqConfig ? `${freqCurrent.hint} ${freqConfig.unit}` : undefined;
  const levaLabel   = leva ? (LEVA_OPTIONS.find(o => o.id === leva)?.hint ?? undefined) : undefined;

  // Progress: quanti step obbligatori sono compilati
  // Step obbligatori: categoria, sottogruppo, stile, frequenza, account, leva
  const completedSteps = [
    assetClass,
    subGroup,
    style,
    freq,
    account,
    leva,
  ].filter(Boolean).length;
  const totalSteps = STEPS.length; // 6

  // Quando un nuovo step viene completato e lo sheet è aperto,
  // scroll automatico al fondo per rivelare il prossimo campo
  useEffect(() => {
    if (snap === 'full' && contentRef.current) {
      const el = contentRef.current;
      // Piccolo delay per aspettare che AnimatedSection sia montato
      const t = setTimeout(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }, 280);
      return () => clearTimeout(t);
    }
  }, [completedSteps, snap]);

  const statusAsset   = asset ?? subGroup ?? assetClass ?? '—';
  const statusAccount = account ? (ACCOUNT_OPTIONS.find(o => o.id === account)?.label ?? '—') : '—';
  const isComplete    = completedSteps === totalSteps;

  /* ── PANEL/SHEET CONTENT (shared) ─────────────────────────────── */
  const panelContent = (
    <>
      <BlockDivider label="Strumento" />

      {/* Step 1 — sempre visibile */}
      <Section label="Categoria" value={assetClass ?? undefined} done={!!assetClass}>
        <StringChipGroup
          options={Object.keys(ASSET_TREE)}
          value={assetClass}
          onChange={handleGroupChange}
        />
      </Section>

      {/* Step 2 — appare dopo categoria */}
      <AnimatedSection show={!!assetClass}>
        <Section label="Sottogruppo" value={subGroup ?? undefined} done={!!subGroup}>
          <StringChipGroup options={groups} value={subGroup} onChange={handleSubChange} />
        </Section>
      </AnimatedSection>

      {/* Step 3 — asset opzionale, appare dopo sottogruppo */}
      <AnimatedSection show={!!subGroup && assets.length > 0}>
        <Section
          label="Asset specifico"
          value={asset ?? undefined}
          hint="Opzionale — lascia vuoto per confrontare tutto il gruppo"
          done={!!asset}
        >
          <StringChipGroup options={assets} value={asset} onChange={setAsset} mono />
        </Section>
      </AnimatedSection>

      <AnimatedSection show={!!subGroup}>
        <BlockDivider label="Il tuo profilo" />

        {/* Step 4 — stile */}
        <Section
          label="Stile operativo"
          value={style ? STYLE_OPTIONS.find(o => o.id === style)?.label : undefined}
          hint="Orizzonte temporale di ogni operazione"
          done={!!style}
        >
          <ChipGroup options={STYLE_OPTIONS} value={style} onChange={handleStyleChange} />
        </Section>

        {/* Step 5 — frequenza, appare dopo stile */}
        <AnimatedSection show={!!style && !!freqConfig}>
          <Section
            label={freqConfig ? `Operazioni ${freqConfig.unit}` : 'Frequenza'}
            value={freqLabel}
            hint="Quante operazioni apri in media"
            done={!!freq}
          >
            {freqConfig && <ChipGroup options={freqConfig.options} value={freq} onChange={setFreq} />}
          </Section>
        </AnimatedSection>

        {/* Step 6 — account, appare dopo frequenza */}
        <AnimatedSection show={!!freq}>
          <Section
            label="Dimensione account"
            value={account ? ACCOUNT_OPTIONS.find(o => o.id === account)?.range : undefined}
            hint="Capitale totale che gestisci"
            done={!!account}
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
        </AnimatedSection>

        {/* Step 7 — leva, appare dopo account */}
        <AnimatedSection show={!!account}>
          <Section
            label="Leva finanziaria"
            value={levaLabel}
            hint="Moltiplicatore di esposizione"
            done={!!leva}
          >
            <ChipGroup options={LEVA_OPTIONS} value={leva} onChange={setLeva} />
          </Section>
        </AnimatedSection>

        {/* CTA finale — appare solo quando tutto è compilato */}
        <AnimatedSection show={isComplete}>
          <div className="sim-sheet__cta">
            <span className="sim-sheet__cta-icon" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Profilo completo — i risultati si aggiornano in automatico
          </div>
        </AnimatedSection>
      </AnimatedSection>
    </>
  );

  /* ── RESULTS AREA ──────────────────────────────────────────────── */
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
      {/* SIDEBAR DESKTOP */}
      <aside className="sim-panel" aria-label="Parametri simulazione">
        <div className="sim-panel__content">{panelContent}</div>
      </aside>

      {resultsArea}

      {/* BOTTOM SHEET MOBILE — 2 snap: collapsed | full */}
      <div
        ref={sheetRef}
        className={`sim-sheet sim-sheet--${snap}`}
        role="complementary"
        aria-label="Parametri simulazione"
      >
        {/* ── Handle: UNICO punto di apertura/chiusura ── */}
        <button
          type="button"
          className="sim-sheet__handle-area"
          onClick={toggleSheet}
          aria-expanded={snap === 'full'}
          aria-label={snap === 'collapsed' ? 'Apri parametri' : 'Chiudi parametri'}
        >
          <div className="sim-sheet__drag-bar" aria-hidden="true" />

          <div className="sim-sheet__status">
            {/* Riepilogo sintetico */}
            <span className="sim-sheet__status-asset">{statusAsset}</span>
            <span className="sim-sheet__status-dot" aria-hidden="true" />
            <span className="sim-sheet__status-exposure">
              {account ? ACCOUNT_OPTIONS.find(o => o.id === account)?.range : 'Account'}
            </span>

            {/* Progress dots + chevron */}
            <div className="sim-sheet__handle-right">
              <ProgressDots completed={completedSteps} total={totalSteps} />
              <svg
                className={`sim-sheet__chevron sim-sheet__chevron--${snap}`}
                width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
              >
                <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </button>

        {/* ── Content: scroll libero, nessun touch handler ── */}
        <div className="sim-sheet__content" ref={contentRef}>
          {panelContent}
        </div>
      </div>
    </>
  );
}
