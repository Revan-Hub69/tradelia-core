'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSimulatorEngine } from '@/hooks/useSimulatorEngine';
import { usePanelSheet } from '@/hooks/usePanelSheet';
import { useRovingTabIndex } from '@/hooks/useRovingTabIndex';
import { useKbdHint } from '@/hooks/useKbdHint';
import { useStepAutoScroll } from '@/hooks/useStepAutoScroll';
import { KbdHintBar } from './KbdHintBar';
import { ScoreCardList } from './ScoreCardList';
import { SimResultsEmpty } from './SimResultsEmpty';
import { SimulatoreSkeleton } from './SimulatoreSkeleton';

/* ─── ASSET TREE ──────────────────────────────────────────────────── */
const ASSET_TREE: Record<string, Record<string, string[]>> = {
  Forex: {
    Majors: [
      'EUR/USD','GBP/USD','USD/JPY','USD/CHF',
      'AUD/USD','USD/CAD','NZD/USD',
    ],
    Cross: [
      'EUR/GBP','EUR/JPY','EUR/CHF','EUR/CAD','EUR/AUD',
      'GBP/JPY','GBP/CHF',
      'AUD/JPY','CAD/JPY',
    ],
    Exotic: [
      'USD/TRY','EUR/TRY',
      'USD/ZAR','EUR/ZAR',
      'EUR/PLN','USD/PLN',
      'USD/MXN',
      'USD/SEK','USD/NOK',
    ],
  },
  Crypto:  { 'Large Cap': ['BTC/USD','ETH/USD','BNB/USD'], 'Mid Cap': ['SOL/USD','ADA/USD','DOT/USD'], Stablecoin: ['USDT/USD','USDC/USD'] },
  Indici:  { Europa: ['DAX 40','FTSE 100','CAC 40'], USA: ['S&P 500','NASDAQ 100','DOW 30'], Asia: ['Nikkei 225','Hang Seng'] },
  Azioni:  { Tech: ['Apple','Microsoft','NVIDIA','Meta'], Finance: ['JPMorgan','Goldman Sachs','Visa'], Energy: ['ExxonMobil','Shell','TotalEnergies'] },
  Materie: { Metalli: ['Oro','Argento','Rame'], Energia: ['Petrolio WTI','Gas Nat.','Brent'] },
};

/* ─── Categorie senza selettore leva (leva implicita nel prodotto) ── */
const NO_LEVA_CATEGORIES = new Set(['Forex']);

/* ─── Mapping account → exposure (punto medio range) ─────────────── */
const ACCOUNT_TO_EXPOSURE: Record<string, number> = {
  demo:    250,
  micro:   1_250,
  retail:  6_000,
  semipro: 30_000,
  pro:     100_000,
};

/* ─── DEFAULTS ────────────────────────────────────────────────────── */
const DEFAULT_CATEGORY  = 'Forex';
const DEFAULT_SUBGROUP  = 'Majors';
const DEFAULT_ASSET     = 'EUR/USD';
const DEFAULT_STYLE     = 'intraday'  as const;
const DEFAULT_FREQ      = 'mid'       as const;
const DEFAULT_ACCOUNT   = 'retail'    as const;
const DEFAULT_LEVA      = 'media'     as const;

/* ─── TYPES ───────────────────────────────────────────────────────── */
type StyleType   = 'scalping' | 'intraday' | 'swing' | 'position';
type FreqId      = 'low' | 'mid' | 'high';
type AccountType = 'demo' | 'micro' | 'retail' | 'semipro' | 'pro';
type LevaType    = 'nessuna' | 'bassa' | 'media' | 'alta';

/* Steps: leva è inclusa solo se la categoria la richiede */
const STEPS_WITH_LEVA    = ['categoria','sottogruppo','stile','frequenza','account','leva'] as const;
const STEPS_WITHOUT_LEVA = ['categoria','sottogruppo','stile','frequenza','account'] as const;

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

/* sr-only descrizione condivisa per tutti i radiogroup */
const RADIOGROUP_DESC_ID = 'sim-radiogroup-desc';

/* ─── ANIMATED SECTION ────────────────────────────────────────────── */
function AnimatedSection({ show, children }: { show: boolean; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(show);
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setMounted(true);
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
    <div style={{
      opacity:    visible ? 1 : 0,
      transform:  visible ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 240ms cubic-bezier(0.16,1,0.3,1), transform 240ms cubic-bezier(0.16,1,0.3,1)',
    }}>
      {children}
    </div>
  );
}

/* ─── SECTION ─────────────────────────────────────────────────────── */
function Section({ label, value, hint, children, done, groupId }: {
  label: string; value?: string; hint?: string;
  children: React.ReactNode; done?: boolean; groupId?: string;
}) {
  return (
    <div className={`sim-section${done ? ' sim-section--done' : ''}`}>
      <div className="sim-section__header">
        <span className="sim-section__label" id={groupId ? `${groupId}-label` : undefined}>
          {label}
        </span>
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

/* ─── RADIO CHIP GROUP (WAI-ARIA radiogroup + roving tabindex) ────── */
function RadioChipGroup<T extends string>({
  id, label, options, value, onChange, mono,
}: {
  id: string;
  label: string;
  options: { id: T; label: string; hint?: string }[];
  value: T | null;
  onChange: (v: T) => void;
  mono?: boolean;
}) {
  const ids = options.map(o => o.id);
  const { getItemProps } = useRovingTabIndex(ids, value, onChange);

  return (
    <div
      role="radiogroup"
      aria-labelledby={`${id}-label`}
      aria-describedby={RADIOGROUP_DESC_ID}
      className="sim-chips"
    >
      {options.map(o => {
        const itemProps = getItemProps(o.id);
        return (
          <button
            key={o.id}
            type="button"
            className={mono ? 'sim-chip sim-chip--mono' : 'sim-chip'}
            data-active={value === o.id ? 'true' : 'false'}
            {...itemProps}
          >
            <span>{o.label}</span>
            {o.hint && <span className="sim-chip__hint">{o.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

function RadioAccountGroup({
  id, value, onChange,
}: {
  id: string;
  value: AccountType | null;
  onChange: (v: AccountType) => void;
}) {
  const ids = ACCOUNT_OPTIONS.map(o => o.id);
  const { getItemProps } = useRovingTabIndex(ids, value, onChange);

  return (
    <div
      role="radiogroup"
      aria-labelledby={`${id}-label`}
      aria-describedby={RADIOGROUP_DESC_ID}
      className="sim-chips sim-chips--col"
    >
      {ACCOUNT_OPTIONS.map(o => {
        const itemProps = getItemProps(o.id);
        return (
          <button
            key={o.id}
            type="button"
            className="sim-chip sim-chip--row"
            data-active={value === o.id ? 'true' : 'false'}
            {...itemProps}
          >
            <span className="sim-chip__main">{o.label}</span>
            <span className="sim-chip__hint">{o.range}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── PROGRESS DOTS ───────────────────────────────────────────────── */
function ProgressDots({ completed, total }: { completed: number; total: number }) {
  return (
    <div className="sim-progress" aria-label={`${completed} di ${total} campi compilati`}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className="sim-progress__dot" data-done={i < completed ? 'true' : 'false'} />
      ))}
      <span className="sim-progress__label">{completed}/{total}</span>
    </div>
  );
}

/* ─── SHELL ───────────────────────────────────────────────────────── */
export function SimulatoreShell() {
  const { assetClass, setAssetClass, setExposure, setProfile, results, isComputing } = useSimulatorEngine();

  const [subGroup, setSubGroup] = useState<string | null>(DEFAULT_SUBGROUP);
  const [asset,    setAsset]    = useState<string | null>(DEFAULT_ASSET);
  const [style,    setStyle]    = useState<StyleType | null>(DEFAULT_STYLE);
  const [freq,     setFreq]     = useState<FreqId | null>(DEFAULT_FREQ);
  const [account,  setAccount]  = useState<AccountType | null>(DEFAULT_ACCOUNT);
  const [leva,     setLeva]     = useState<LevaType | null>(DEFAULT_LEVA);

  /* Leva non applicabile per alcune categorie (es. Forex) */
  const showLeva = !NO_LEVA_CATEGORIES.has(assetClass ?? '');

  /* Quando si cambia categoria e la nuova non ha leva, resettiamo lo stato leva */
  useEffect(() => {
    if (!showLeva) setLeva(null);
  }, [showLeva]);

  /* Sincronizza la categoria col motore usando il default all'avvio */
  useEffect(() => {
    if (!assetClass) setAssetClass(DEFAULT_CATEGORY);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Sincronizza profilo → motore ogni volta che cambia un parametro ── */
  useEffect(() => {
    const exposure = account ? (ACCOUNT_TO_EXPOSURE[account] ?? 6_000) : 6_000;
    setExposure(exposure);
    setProfile({ style, freq, account, leva: showLeva ? leva : null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style, freq, account, leva, showLeva]);

  const { snap, toggle: toggleSheet, sheetRef } = usePanelSheet('collapsed');
  const { visible: kbdVisible, show: showKbd }  = useKbdHint();

  const panelContentRef = useRef<HTMLDivElement>(null);
  const sheetContentRef = useRef<HTMLDivElement>(null);

  const groups = assetClass ? Object.keys(ASSET_TREE[assetClass] ?? {}) : [];
  const assets = assetClass && subGroup ? (ASSET_TREE[assetClass]?.[subGroup] ?? []) : [];

  const handleGroupChange = useCallback((g: string) => {
    setAssetClass(g); setSubGroup(null); setAsset(null);
  }, [setAssetClass]);

  const handleSubChange = useCallback((s: string) => {
    setSubGroup(s); setAsset(null);
  }, []);

  const handleStyleChange = useCallback((s: StyleType) => {
    setStyle(s); setFreq(null);
  }, []);

  const freqConfig  = style ? FREQ_BY_STYLE[style] : null;
  const freqCurrent = freqConfig && freq ? freqConfig.options.find(o => o.id === freq) : null;
  const freqLabel   = freqCurrent && freqConfig ? `${freqCurrent.hint} ${freqConfig.unit}` : undefined;
  const levaLabel   = leva ? (LEVA_OPTIONS.find(o => o.id === leva)?.hint ?? undefined) : undefined;

  /* Step e completamento dinamici in base alla categoria */
  const STEPS        = showLeva ? STEPS_WITH_LEVA : STEPS_WITHOUT_LEVA;
  const totalSteps   = STEPS.length;
  const filledValues = showLeva
    ? [assetClass, subGroup, style, freq, account, leva]
    : [assetClass, subGroup, style, freq, account];
  const completedSteps = filledValues.filter(Boolean).length;
  const isComplete     = completedSteps === totalSteps;
  const scrollTrigger  = filledValues.join('|');

  useStepAutoScroll(panelContentRef, scrollTrigger, true);
  useStepAutoScroll(sheetContentRef, scrollTrigger, snap === 'full');

  const handlePanelFocusIn = useCallback(() => showKbd(), [showKbd]);

  const statusAsset = asset ?? subGroup ?? assetClass ?? '—';

  /* ── PANEL CONTENT ─────────────────────────────────────────────── */
  const panelContent = (
    <>
      <span id={RADIOGROUP_DESC_ID} className="sr-only">
        Usa le frecce ← → per navigare tra le opzioni, Spazio o Invio per selezionare.
      </span>

      <BlockDivider label="Strumento" />

      <Section label="Categoria" value={assetClass ?? undefined} done={!!assetClass} groupId="sim-cat">
        <RadioChipGroup
          id="sim-cat"
          label="Categoria"
          options={Object.keys(ASSET_TREE).map(k => ({ id: k, label: k }))}
          value={assetClass}
          onChange={handleGroupChange}
        />
      </Section>

      <AnimatedSection show={!!assetClass}>
        <Section label="Sottogruppo" value={subGroup ?? undefined} done={!!subGroup} groupId="sim-sub">
          <RadioChipGroup
            id="sim-sub"
            label="Sottogruppo"
            options={groups.map(g => ({ id: g, label: g }))}
            value={subGroup}
            onChange={handleSubChange}
          />
        </Section>
      </AnimatedSection>

      <AnimatedSection show={!!subGroup && assets.length > 0}>
        <Section
          label="Asset specifico"
          value={asset ?? undefined}
          hint="Opzionale — lascia vuoto per confrontare tutto il gruppo"
          done={!!asset}
          groupId="sim-asset"
        >
          <RadioChipGroup
            id="sim-asset"
            label="Asset specifico"
            options={assets.map(a => ({ id: a, label: a }))}
            value={asset}
            onChange={setAsset}
            mono
          />
        </Section>
      </AnimatedSection>

      <AnimatedSection show={!!subGroup}>
        <BlockDivider label="Il tuo profilo" />

        <Section
          label="Stile operativo"
          value={style ? STYLE_OPTIONS.find(o => o.id === style)?.label : undefined}
          hint="Orizzonte temporale di ogni operazione"
          done={!!style}
          groupId="sim-style"
        >
          <RadioChipGroup
            id="sim-style"
            label="Stile operativo"
            options={STYLE_OPTIONS}
            value={style}
            onChange={handleStyleChange}
          />
        </Section>

        <AnimatedSection show={!!style && !!freqConfig}>
          <Section
            label={freqConfig ? `Operazioni ${freqConfig.unit}` : 'Frequenza'}
            value={freqLabel}
            hint="Quante operazioni apri in media"
            done={!!freq}
            groupId="sim-freq"
          >
            {freqConfig && (
              <RadioChipGroup
                id="sim-freq"
                label="Frequenza"
                options={freqConfig.options}
                value={freq}
                onChange={setFreq}
              />
            )}
          </Section>
        </AnimatedSection>

        <AnimatedSection show={!!freq}>
          <Section
            label="Dimensione account"
            value={account ? ACCOUNT_OPTIONS.find(o => o.id === account)?.range : undefined}
            hint="Capitale totale che gestisci"
            done={!!account}
            groupId="sim-account"
          >
            <RadioAccountGroup id="sim-account" value={account} onChange={setAccount} />
          </Section>
        </AnimatedSection>

        {/* Leva: visibile solo per categorie che la supportano (non Forex) */}
        {showLeva && (
          <AnimatedSection show={!!account}>
            <Section
              label="Leva finanziaria"
              value={levaLabel}
              hint="Moltiplicatore di esposizione"
              done={!!leva}
              groupId="sim-leva"
            >
              <RadioChipGroup
                id="sim-leva"
                label="Leva finanziaria"
                options={LEVA_OPTIONS}
                value={leva}
                onChange={setLeva}
              />
            </Section>
          </AnimatedSection>
        )}

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
      <aside
        className="sim-panel"
        aria-label="Parametri simulazione"
        onFocusCapture={handlePanelFocusIn}
      >
        <div className="sim-panel__content" ref={panelContentRef}>
          {panelContent}
        </div>
        <KbdHintBar visible={kbdVisible} />
      </aside>

      {resultsArea}

      {/* BOTTOM SHEET MOBILE */}
      <div
        ref={sheetRef}
        className={`sim-sheet sim-sheet--${snap}`}
        role="complementary"
        aria-label="Parametri simulazione"
        onFocusCapture={handlePanelFocusIn}
      >
        <button
          type="button"
          className="sim-sheet__handle-area"
          onClick={toggleSheet}
          aria-expanded={snap === 'full'}
          aria-label={snap === 'collapsed' ? 'Apri parametri' : 'Chiudi parametri'}
        >
          <div className="sim-sheet__drag-bar" aria-hidden="true" />
          <div className="sim-sheet__status">
            <span className="sim-sheet__status-asset">{statusAsset}</span>
            <span className="sim-sheet__status-dot" aria-hidden="true" />
            <span className="sim-sheet__status-exposure">
              {account ? ACCOUNT_OPTIONS.find(o => o.id === account)?.range : 'Account'}
            </span>
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
        <div className="sim-sheet__content" ref={sheetContentRef}>
          {panelContent}
        </div>
        <KbdHintBar visible={kbdVisible} />
      </div>
    </>
  );
}
