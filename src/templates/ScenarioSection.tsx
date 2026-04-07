"use client";

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';

import { useTranslations } from 'next-intl';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SimulatorDrawer } from '@/templates/SimulatorDrawer';

const t = useTranslations('Simulator');

const ASSET_GROUPS = [
  { id: 'forex', label: t('assetGroups.forex') },
  { id: 'indices', label: t('assetGroups.indices') },
  { id: 'equities', label: t('assetGroups.equities') },
  { id: 'etf', label: t('assetGroups.etf') },
  { id: 'commodities', label: t('assetGroups.commodities') },
  { id: 'crypto', label: t('assetGroups.crypto') },
];

const UNDERLYING_GROUPS = [
  { id: 'fx_core', label: t('underlyingGroups.fx_core'), group: 'forex', tooltip: t('underlyingGroups.fx_core_tooltip') },
  { id: 'fx_cross', label: t('underlyingGroups.fx_cross'), group: 'forex', tooltip: t('underlyingGroups.fx_cross_tooltip') },
  { id: 'fx_exotic', label: t('underlyingGroups.fx_exotic'), group: 'forex', tooltip: t('underlyingGroups.fx_exotic_tooltip') },
  { id: 'index_us', label: t('underlyingGroups.index_us'), group: 'indices', tooltip: t('underlyingGroups.index_us_tooltip') },
  { id: 'index_eu_core', label: t('underlyingGroups.index_eu_core'), group: 'indices', tooltip: t('underlyingGroups.index_eu_core_tooltip') },
  { id: 'index_eu_tax', label: t('underlyingGroups.index_eu_tax'), group: 'indices', tooltip: t('underlyingGroups.index_eu_tax_tooltip') },
  { id: 'index_asia', label: t('underlyingGroups.index_asia'), group: 'indices', tooltip: t('underlyingGroups.index_asia_tooltip') },
  { id: 'index_volatility', label: t('underlyingGroups.index_volatility'), group: 'indices', tooltip: t('underlyingGroups.index_volatility_tooltip') },
  { id: 'equity_us_large', label: t('underlyingGroups.equity_us_large'), group: 'equities', tooltip: t('underlyingGroups.equity_us_large_tooltip') },
  { id: 'equity_us_small', label: t('underlyingGroups.equity_us_small'), group: 'equities', tooltip: t('underlyingGroups.equity_us_small_tooltip') },
  { id: 'equity_eu_ftt', label: t('underlyingGroups.equity_eu_ftt'), group: 'equities', tooltip: t('underlyingGroups.equity_eu_ftt_tooltip') },
  { id: 'equity_eu_core', label: t('underlyingGroups.equity_eu_core'), group: 'equities', tooltip: t('underlyingGroups.equity_eu_core_tooltip') },
  { id: 'equity_uk', label: t('underlyingGroups.equity_uk'), group: 'equities', tooltip: t('underlyingGroups.equity_uk_tooltip') },
  { id: 'equity_adr', label: t('underlyingGroups.equity_adr'), group: 'equities', tooltip: t('underlyingGroups.equity_adr_tooltip') },
  { id: 'commodity_metal', label: t('underlyingGroups.commodity_metal'), group: 'commodities', tooltip: t('underlyingGroups.commodity_metal_tooltip') },
  { id: 'commodity_energy', label: t('underlyingGroups.commodity_energy'), group: 'commodities', tooltip: t('underlyingGroups.commodity_energy_tooltip') },
  { id: 'commodity_agri', label: t('underlyingGroups.commodity_agri'), group: 'commodities', tooltip: t('underlyingGroups.commodity_agri_tooltip') },
  { id: 'etf_us_broad', label: t('underlyingGroups.etf_us_broad'), group: 'etf', tooltip: t('underlyingGroups.etf_us_broad_tooltip') },
  { id: 'etf_us_leveraged', label: t('underlyingGroups.etf_us_leveraged'), group: 'etf', tooltip: t('underlyingGroups.etf_us_leveraged_tooltip') },
  { id: 'etf_ucits', label: t('underlyingGroups.etf_ucits'), group: 'etf', tooltip: t('underlyingGroups.etf_ucits_tooltip') },
  { id: 'crypto_major', label: t('underlyingGroups.crypto_major'), group: 'crypto', tooltip: t('underlyingGroups.crypto_major_tooltip') },
  { id: 'crypto_altcoin', label: t('underlyingGroups.crypto_altcoin'), group: 'crypto', tooltip: t('underlyingGroups.crypto_altcoin_tooltip') },
];

const HORIZONS = [
  { id: 'scalping', label: t('horizons.scalping'), holdingDays: 0, tradesPerDay: 15 },
  { id: 'intraday', label: t('horizons.intraday'), holdingDays: 0, tradesPerDay: 3 },
  { id: 'swing', label: t('horizons.swing'), holdingDays: 4, tradesPerDay: 0.5 },
  { id: 'position', label: t('horizons.position'), holdingDays: 45, tradesPerDay: 0.05 },
];

const STRATEGY_MAP = {
  scalping: [
    { value: 'order_flow', label: t('strategy.scalping.order_flow') },
    { value: 'micro_momentum', label: t('strategy.scalping.micro_momentum') },
    { value: 'news_reaction', label: t('strategy.scalping.news_reaction') },
  ],
  intraday: [
    { value: 'breakout', label: t('strategy.intraday.breakout') },
    { value: 'vwap_bounce', label: t('strategy.intraday.vwap_bounce') },
    { value: 'trend_following_day', label: t('strategy.intraday.trend_following_day') },
  ],
  swing: [
    { value: 'trend_following', label: t('strategy.swing.trend_following') },
    { value: 'range_trading', label: t('strategy.swing.range_trading') },
    { value: 'mean_reversion', label: t('strategy.swing.mean_reversion') },
  ],
  position: [
    { value: 'macro_trend', label: t('strategy.position.macro_trend') },
    { value: 'carry_trade', label: t('strategy.position.carry_trade') },
    { value: 'value_investing', label: t('strategy.position.value_investing') },
  ],
};

const TEASER_CHIPS = [
  { label: t('teaserChips.forexCryptoIndices') },
  { label: t('teaserChips.scalpingToPosition') },
  { label: t('teaserChips.executionHoldingStructure') },
  { label: t('teaserChips.leverageAnalysis') },
];

const drawerVariants: Variants = {
  open: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  closed: {
    opacity: 0,
    x: '100%',
    transition: { type: 'tween', duration: 0.2 },
  },
};

export const ScenarioSection = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <section className="scroll-mt-32 border-t border-border/40 bg-gradient-to-b from-background to-muted/20 py-14 sm:py-16 lg:py-20">
        <SectionContainer size="wide">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground/60">
              Scenario Simulator
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              Build Your Trading Scenario
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Customize your trading simulation with precise parameters
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {TEASER_CHIPS.map((chip) => (
                <span
                  key={chip.label}
                  className="rounded-full border border-border/50 bg-muted/40 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
                >
                  {chip.label}
                </span>
              ))}
            </div>
            <div className="mt-10">
              <motion.button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-foreground px-6 py-3.5 text-sm font-medium text-background shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />
                </svg>
                Open Simulator
              </motion.button>
              <p className="mt-4 text-xs text-muted-foreground/50">Preview only - full features available in simulator</p>
            </div>
          </div>
        </SectionContainer>
      </section>
      <motion.div variants={drawerVariants} animate={drawerOpen ? 'open' : 'closed'}>
        <SimulatorDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </motion.div>
    </>
  );
};
