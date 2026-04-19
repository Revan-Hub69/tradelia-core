'use client';

import { Building2, ExternalLink, Shield } from 'lucide-react';

import { cn } from '@/utils/Helpers';

import type { BrokerAccount } from '../../data/brokers';

type BlockSafetyProps = {
  account: BrokerAccount;
};

/**
 * Blocco 4 — Sicurezza e compliance dell'entità legale dove l'utente si iscrive.
 * Zero marketing, solo fatti verificabili sul registro del regolatore.
 */
export function BlockSafety({ account }: BlockSafetyProps) {
  const { entity, company } = account;

  if (!entity && !company) {
    return null;
  }

  const icfAmount = entity?.investorCompensationEur ?? 0;
  const hasIcf = icfAmount > 0;

  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Shield className="size-3" />
        Sicurezza e compliance
      </h2>

      <div className="space-y-2 rounded-xl border border-border/60 bg-card/40 p-3">
        {/* Entità legale */}
        {entity && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Entità dove apri il conto
            </p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              {entity.legalName}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {entity.jurisdictionCity}
              ,
              {' '}
              {entity.jurisdictionCountry}
            </p>
          </div>
        )}

        {/* Regolatore */}
        {entity && (
          <SafetyRow
            label="Regolatore"
            value={(
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground">{entity.regulator}</span>
                <span className="font-mono tabular-nums text-muted-foreground">
                  {entity.licenseNumber}
                </span>
                {entity.regulatorCheckUrl && (
                  <a
                    href={entity.regulatorCheckUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    title="Verifica sul registro ufficiale"
                  >
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </span>
            )}
          />
        )}

        {/* ICF */}
        {entity && (
          <SafetyRow
            label="Protezione investitori"
            value={
              hasIcf
                ? (
                    <span className="font-semibold text-foreground">
                      €
                      {icfAmount.toLocaleString('it-IT')}
                      {' '}
                      <span className="font-normal text-muted-foreground">per cliente</span>
                    </span>
                  )
                : <span className="text-muted-foreground">Non disponibile (entità offshore)</span>
            }
            highlight={!hasIcf}
          />
        )}

        {/* Segregazione */}
        {entity && (
          <SafetyRow
            label="Segregazione fondi"
            value={(
              <span className="text-foreground">
                {entity.segregatedFunds ? 'Sì' : 'No'}
                {entity.segregationBankName && ` · ${entity.segregationBankName}`}
              </span>
            )}
          />
        )}

        {/* NBP */}
        {entity && (
          <SafetyRow
            label="Protezione saldo negativo"
            value={
              entity.negativeBalanceProtection
                ? <span className="text-foreground">Sì</span>
                : <span className="text-muted-foreground">No</span>
            }
          />
        )}

        {/* Company */}
        {company && (
          <SafetyRow
            label="Broker"
            value={(
              <span className="flex flex-wrap items-baseline gap-x-1.5">
                <span className="flex items-center gap-1 text-foreground">
                  <Building2 className="size-3 text-muted-foreground" />
                  {company.brandName}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  ·
                  {' '}
                  fondato
                  {' '}
                  {company.foundedYear}
                </span>
                {company.publiclyListed && company.listedOn && (
                  <span className="rounded-full border border-border/60 px-1.5 py-0 text-[10px] text-muted-foreground">
                    {company.listedOn}
                  </span>
                )}
              </span>
            )}
          />
        )}
      </div>
    </section>
  );
}

function SafetyRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-t border-border/30 pt-2',
        highlight && 'text-amber-700 dark:text-amber-400',
      )}
    >
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <span className="min-w-0 flex-shrink text-right text-xs">{value}</span>
    </div>
  );
}
