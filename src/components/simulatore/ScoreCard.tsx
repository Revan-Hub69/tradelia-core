'use client';

import { useState } from 'react';
import { ScoreGauge } from './ScoreGauge';
import { FeasibilityBadge, type Feasibility } from './FeasibilityBadge';
import type { EnrichedResult } from '@/hooks/useSimulatorEngine';

// ── Formatters ─────────────────────────────────────────────────────────────
const fmtEur = (n: number): string => {
  if (n < 0.01) return '<€0.01';
  if (n >= 1000) return `€${(n / 1000).toFixed(1)}k`;
  if (n < 1)     return `€${n.toFixed(2)}`;
  return `€${n.toFixed(0)}`;
};

const fmtPct = (n: number): string => `${Math.round(n * 100)}%`;

// ── ESMA disclaimer builder ────────────────────────────────────────────────
// Testo completo obbligatorio per normativa ESMA su strumenti derivati.
function buildEsmaText(
  riskPct:   number | null,
  legalName: string | null,
  brokerName: string,
  instrumentName: string,
): string {
  const name       = legalName ?? brokerName;
  const instrument = instrumentName.includes('futures') ? 'futures'
    : instrumentName.includes('spot')    ? 'strumenti derivati OTC'
    : 'CFD';

  if (riskPct == null) {
    return `I ${instrument} sono strumenti complessi che presentano un elevato rischio `
      + `di perdere rapidamente denaro a causa della leva finanziaria. `
      + `Assicurati di comprendere come funzionano e se puoi permetterti di assumere `
      + `l'alto rischio di perdere i tuoi soldi.`;
  }

  return `Il ${riskPct}% dei conti degli investitori retail perde denaro nel trading `
    + `di ${instrument} con ${name}. I ${instrument} sono strumenti complessi che `
    + `presentano un elevato rischio di perdere rapidamente denaro a causa della leva `
    + `finanziaria. Dovresti assicurarti di avere ben compreso come funzionano i `
    + `${instrument} e se puoi permetterti di assumerti l'alto rischio di perdere i tuoi soldi.`;
}

// ── Component ─────────────────────────────────────────────────────────────
export function ScoreCard({ result, rank }: { result: EnrichedResult; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const isOptimal = rank === 1;

  const totalMonth = result.totalMonth;

  // Segmenti costo per la bar e per il breakdown
  const segs = totalMonth > 0 ? [
    { key: 'spread',    label: 'Spread',       val: result.spreadMonth,     color: 'var(--s-ac)',    cssVar: '--s-ac'    },
    { key: 'comm',      label: 'Commissione',  val: result.commissionMonth, color: 'var(--s-gold)',  cssVar: '--s-gold'  },
    { key: 'overnight', label: 'Overnight',    val: result.overnightMonth,  color: 'var(--s-amber)', cssVar: '--s-amber' },
    { key: 'slippage',  label: 'Slippage',     val: result.slippageMonth,   color: 'var(--s-t3)',    cssVar: '--s-t3'    },
  ].filter(s => s.val > 0) : [];

  const scoreColor =
    result.score >= 80 ? 'var(--s-ac)' :
    result.score >= 60 ? 'var(--s-green)' :
    result.score >= 40 ? 'var(--s-gold)' : 'var(--s-amber)';

  // Volume display: trades × lot = totalLots/mese
  const totalLots = result.tradesPerMonth * result.lots;
  const lotDisplay = totalLots >= 1
    ? totalLots.toFixed(1)
    : totalLots.toFixed(2);
  const volumeLabel = `${result.tradesPerMonth} trade × ${result.lots.toFixed(2)} lot = ${lotDisplay} lot/mese`;

  // CTA URL: preferisce affiliateUrl, fallback website
  const ctaUrl = result.brokerMeta.affiliateUrl ?? result.brokerMeta.website;

  const esmaText = buildEsmaText(
    result.brokerMeta.esmaRiskPct,
    result.brokerMeta.esmaLegalName,
    result.brokerName,
    result.instrumentName,
  );

  return (
    <article
      className={[
        'sim-card',
        isOptimal  ? 'sim-card--optimal'  : '',
        expanded   ? 'sim-card--expanded' : '',
      ].filter(Boolean).join(' ')}
      aria-label={`${result.instrumentName} — score ${result.score}/100`}
    >
      {/* ── COLLAPSED ROW ── always visible ── */}
      <div className="sim-card__collapsed">

        {/* Rank + Gauge */}
        <div className="sim-card__rank">
          <span className="sim-card__rank-num">#{rank}</span>
          <ScoreGauge score={result.score} />
        </div>

        {/* Main info */}
        <div className="sim-card__body">
          <div className="sim-card__name-row">
            <span className="sim-card__name">{result.instrumentName}</span>
            <span className="sim-card__broker">{result.brokerName}</span>
          </div>

          {/* Cost bar */}
          <div className="sim-card__cost-bar" aria-hidden="true">
            {segs.map(s => (
              <div
                key={s.key}
                className={`sim-card__cost-segment sim-card__cost-segment--${s.key}`}
                style={{ flex: s.val / totalMonth }}
              />
            ))}
          </div>
        </div>

        {/* Right: score + total + expand */}
        <div className="sim-card__meta">
          <span className="sim-card__score sim-num" style={{ color: scoreColor }}>
            {result.score}<span className="sim-card__score-label">/100</span>
          </span>
          <span className="sim-card__total sim-num">{fmtEur(totalMonth)}<span className="sim-card__total-label">/mese</span></span>
          <FeasibilityBadge status={result.feasibility as Feasibility} />
        </div>

        {/* Expand toggle */}
        <button
          className="sim-card__expand-btn"
          aria-expanded={expanded}
          aria-label={expanded ? 'Chiudi dettaglio' : 'Espandi dettaglio'}
          onClick={() => setExpanded(v => !v)}
        >
          <svg
            width="14" height="14" viewBox="0 0 14 14"
            fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 200ms cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <path d="M2 5l5 4 5-4" />
          </svg>
        </button>
      </div>

      {/* ── EXPANDED DETAIL ── */}
      {expanded && (
        <div className="sim-card__detail">

          {/* Cost breakdown rows */}
          {segs.length > 0 && (
            <div className="sim-card__breakdown">
              {segs.map(s => {
                const pct = s.val / totalMonth;
                return (
                  <div key={s.key} className="sim-card__breakdown-row">
                    <span className="sim-card__breakdown-dot" style={{ background: s.color }} />
                    <span className="sim-card__breakdown-label">{s.label}</span>
                    <span className="sim-card__breakdown-bar-wrap" aria-hidden="true">
                      <span
                        className="sim-card__breakdown-bar-fill"
                        style={{ width: fmtPct(pct), background: s.color }}
                      />
                    </span>
                    <span className="sim-card__breakdown-pct sim-num">{fmtPct(pct)}</span>
                    <span className="sim-card__breakdown-val sim-num">{fmtEur(s.val)}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="sim-card__divider" />

          {/* Params + volume row */}
          <div className="sim-card__params">
            <span className="sim-card__params-item">
              Leva {result.feasibilityDetail.marginRequired > 0
                ? Math.round(result.achievableExposure / (result.feasibilityDetail.marginRequired))
                : '—'}:1
            </span>
            <span className="sim-card__params-sep">·</span>
            <span className="sim-card__params-item">{volumeLabel}</span>
          </div>

          {/* Affiliate warning — condizionale */}
          {result.brokerMeta.isAffiliate && (
            <div className="sim-card__affiliate">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M8 1l1.8 3.6 4 .6-2.9 2.8.7 4L8 10l-3.6 1.9.7-4L2.2 5.2l4-.6L8 1z" />
              </svg>
              <span>Potremmo ricevere commissioni se apri un conto tramite questo link.</span>
            </div>
          )}

          <div className="sim-card__divider" />

          {/* ESMA disclaimer — sempre presente */}
          <p className="sim-card__esma">{esmaText}</p>

          <div className="sim-card__divider" />

          {/* CTA */}
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sim-card__cta-btn"
          >
            Apri conto su {result.brokerName}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 10L10 2M5 2h5v5" />
            </svg>
          </a>
        </div>
      )}
    </article>
  );
}
