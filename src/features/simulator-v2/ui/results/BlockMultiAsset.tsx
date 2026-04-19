'use client';

import { LayoutGrid } from 'lucide-react';

import type { BrokerAccount, CostContext } from '../../data/brokers';
import { estimateInstrumentMonthlyCost } from '../../data/brokers';
import { formatEUR, formatInt, formatNum2 } from '../../utils/format';

type BlockMultiAssetProps = {
  account: BrokerAccount;
  ctx: CostContext;
};

/**
 * Blocco 3 — Stesso setup operativo applicato a strumenti di riferimento.
 * Se instruments non presente: empty state con "rilevazione in corso".
 */
export function BlockMultiAsset({ account, ctx }: BlockMultiAssetProps) {
  const instruments = account.instruments;

  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <LayoutGrid className="size-3" />
        Stesso setup su altri strumenti
      </h2>

      {!instruments || instruments.length === 0
        ? (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-4 text-center">
              <p className="text-xs text-muted-foreground">
                Rilevazione dati multi-asset in corso per questo broker.
              </p>
            </div>
          )
        : (
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card/40">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-left">
                    <th className="px-3 py-2 font-semibold text-muted-foreground">Strumento</th>
                    <th className="p-2 text-right font-semibold text-muted-foreground">Spread</th>
                    <th className="p-2 text-right font-semibold text-muted-foreground">Comm.</th>
                    <th className="px-3 py-2 text-right font-semibold text-muted-foreground">€/mese</th>
                  </tr>
                </thead>
                <tbody>
                  {instruments.map((instr, idx) => {
                    const minComm = account.accountFees?.minCommissionPerOrderEur;
                    const cost = estimateInstrumentMonthlyCost(instr, ctx, minComm);
                    const isLast = idx === instruments.length - 1;
                    const unit = instr.assetClass === 'forex' ? 'pip' : 'pt';
                    return (
                      <tr
                        key={instr.symbol}
                        className={isLast ? '' : 'border-b border-border/30'}
                      >
                        <td className="px-3 py-2">
                          <div className="font-semibold text-foreground">{instr.label}</div>
                          <div className="text-[10px] text-muted-foreground">{instr.symbol}</div>
                        </td>
                        <td className="p-2 text-right tabular-nums text-muted-foreground">
                          {formatNum2(instr.spreadAvg)}
                          {' '}
                          {unit}
                        </td>
                        <td className="p-2 text-right tabular-nums text-muted-foreground">
                          {instr.commissionEurPerLotRoundTrip > 0
                            ? `${formatInt(instr.commissionEurPerLotRoundTrip)}€/lot`
                            : '—'}
                        </td>
                        <td className="px-3 py-2 text-right font-bold tabular-nums text-foreground">
                          {formatEUR(cost)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="border-t border-border/40 bg-muted/20 px-3 py-2">
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  Costi calcolati con lo stesso setup sopra (
                  {formatNum2(ctx.lotSize)}
                  {' '}
                  lot ×
                  {' '}
                  {formatInt(ctx.tradesPerMonth)}
                  {' '}
                  trade/mese
                  {(ctx.exposureDaysPerMonth ?? 0) > 0 && ` · ${ctx.exposureDaysPerMonth} gg`}
                  ). Rilevazioni autonome
                  {instruments[0]?.lastMeasuredAt && ` · ${instruments[0].lastMeasuredAt}`}
                  .
                </p>
              </div>
            </div>
          )}
    </section>
  );
}
