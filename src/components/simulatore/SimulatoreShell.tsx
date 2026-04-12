'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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

const STEPS = ['categoria','sottogruppo','stile','frequenza','account','leva'] as const;

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

/* ─── HOOK: useStepAutoScroll ─────────────────────────────────────── */
/**
 * Quando `trigger` cambia (nuovo step completato), aspetta che
 * AnimatedSection finisca di montarsi (280ms) poi scrolla smooth
 * al bottom del container — funziona sia per panel che per sheet.
 *
 * Strategia: invece di scrollare al fondo assoluto (che mostrerebbe
 * il prossimo step a metà), scrolliamo l'ultimo elemento figlio
 * del container in view con scrollIntoView, così il nuovo campo
 * appare sempre in cima al viewport scrollabile.
 */
function useStepAutoScroll(
  containerRef: React.RefObject<HTMLElement | null>,
  trigger: unknown,
  enabled = true,
) {
  const prevTrigger = useRef(trigger);

  useEffect(() => {
    // Scolla solo se il trigger è davvero cambiato (non al mount)
    if (!enabled || prevTrigger.current === trigger) return;
    prevTrigger.current = trigger;

    const container = containerRef.current;
    if (!container) return;

    // Delay = AnimatedSection transition (240ms) + margine
    const t = setTimeout(() => {
      // Trova l'ultimo figlio visibile e portalo in view
      const children = container.querySelectorAll<HTMLElement>(
        '.sim-section, .sim-block-divider, .sim-sheet__cta'
      );
      const last = children[children.length - 1];
      if (last) {
        last.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    }, 300);

    return () => clearTimeout(t);
  }, [trigger, enabled, containerRef]);
}

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
    <div
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(8px)',
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
  const { assetClass, setAssetClass, results, isComputing } = useSimulatorEngine();

  const [subGroup, setSubGroup] = useState<string | null>(null);
  const [asset,    setAsset]    = useState<string | null>(null);
  const [style,    setStyle]    = useState<StyleType | null>(null);
  const [freq,     setFreq]     = useState<FreqId | null>(null);
  const [account,  setAccount]  = useState<AccountType | null>(null);
  const [leva,     setLeva]     = useState<LevaType | null>(null);

  const { snap, toggle: toggleSheet, sheetRef } = usePanelSheet('collapsed');

  // Ref separati per i due container scrollabili
  const panelContentRef = useRef<HTMLDivElement>(null); // sidebar desktop
  const sheetContentRef = useRef<HTMLDivElement>(null); // sheet mobile

  const groups = assetClass ? Object.keys(ASSET_TREE[assetClass] ?? {}) : [];
  const assets = assetClass && subGroup ? (ASSET_TREE[assetClass]?.[subGroup] ?? []) : [];

  const handleGroupChange = (g: string) => { setAssetClass(g); setSubGroup(null); setAsset(null); };
  const handleSubChange   = (s: string) => { setSubGroup(s); setAsset(null); };
  const handleStyleChange = (s: StyleType) => { setStyle(s); setFreq(null); };

  const freqConfig  = style ? FREQ_BY_STYLE[style] : null;
  const freqCurrent = freqConfig && freq ? freqConfig.options.find(o => o.id === freq) : null;
  const freqLabel   = freqCurrent && freqConfig ? `${freqCurrent.hint} ${freqConfig.unit}` : undefined;
  const levaLabel   = leva ? (LEVA_OPTIONS.find(o => o.id === leva)?.hint ?? undefined) : undefined;

  const completedSteps = [assetClass, subGroup, style, freq, account, leva].filter(Boolean).length;
  const totalSteps     = STEPS.length;
  const isComplete     = completedSteps === totalSteps;

  // Trigger per l'auto-scroll: stringa che cambia ad ogni step completato
  // Usare la stringa precisa evita falsi trigger su re-render
  const scrollTrigger = [assetClass, subGroup, style, freq, account, leva].join('|');

  // Auto-scroll su sidebar desktop — sempre attivo
  useStepAutoScroll(panelContentRef, scrollTrigger, true);

  // Auto-scroll su sheet mobile — solo quando aperto
  useStepAutoScroll(sheetContentRef, scrollTrigger, snap === 'full');

  const statusAsset   = asset ?? subGroup ?? assetClass ?? '—';

  /* ── PANEL CONTENT ─────────────────────────────────────────────── */
  const panelContent = (
    <>
      <BlockDivider label="Strumento" />

      <Section label="Categoria" value={assetClass ?? undefined} done={!!assetClass}>
        <StringChipGroup
          options={Object.keys(ASSET_TREE)}
          value={assetClass}
          onChange={handleGroupChange}
        />
      </Section>

      <AnimatedSection show={!!assetClass}>
        <Section label="Sottogruppo" value={subGroup ?? undefined} done={!!subGroup}>
          <StringChipGroup options={groups} value={subGroup} onChange={handleSubChange} />
        </Section>
      </AnimatedSection>

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

        <Section
          label="Stile operativo"
          value={style ? STYLE_OPTIONS.find(o => o.id === style)?.label : undefined}
          hint="Orizzonte temporale di ogni operazione"
          done={!!style}
        >
          <ChipGroup options={STYLE_OPTIONS} value={style} onChange={handleStyleChange} />
        </Section>

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
      {/* SIDEBAR DESKTOP — ref proprio per l'auto-scroll */}
      <aside className="sim-panel" aria-label="Parametri simulazione">
        <div className="sim-panel__content" ref={panelContentRef}>
          {panelContent}
        </div>
      </aside>

      {resultsArea}

      {/* BOTTOM SHEET MOBILE */}
      <div
        ref={sheetRef}
        className={`sim-sheet sim-sheet--${snap}`}
        role="complementary"
        aria-label="Parametri simulazione"
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

        {/* ref separato per lo sheet */}
        <div className="sim-sheet__content" ref={sheetContentRef}>
          {panelContent}
        </div>
      </div>
    </>
  );
}
