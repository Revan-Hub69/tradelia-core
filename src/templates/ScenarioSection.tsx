"use client";

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';

import { SectionContainer } from '@/components/ui/SectionContainer';
import { SimulatorDrawer } from '@/templates/SimulatorDrawer';

export const ASSET_GROUPS = [
  { id: 'forex', label: 'Forex' },
  { id: 'indices', label: 'Indices & Volatility' },
  { id: 'equities', label: 'Equities' },
  { id: 'etf', label: 'ETF' },
  { id: 'commodities', label: 'Commodities' },
  { id: 'crypto', label: 'Crypto' },
];

export const UNDERLYING_GROUPS = [
  { id: 'fx_core', label: 'Major (Core)', group: 'forex', tooltip: 'EURUSD, GBPUSD, USDJPY. Ultra-tight spreads.' },
  { id: 'fx_cross', label: 'Cross', group: 'forex', tooltip: 'EURGBP, GBPJPY. G10 non-USD pairs.' },
  { id: 'fx_exotic', label: 'Exotic', group: 'forex', tooltip: 'USDTRY, USDMXN. Predatory spreads.' },
  { id: 'index_us', label: 'US Indices', group: 'indices', tooltip: 'SP500, NAS100, US30. 24h liquidity.' },
  { id: 'index_eu_core', label: 'EU Indices (No Tax)', group: 'indices', tooltip: 'DAX40. No government levy.' },
  { id: 'index_eu_tax', label: 'EU Indices (FTT)', group: 'indices', tooltip: 'FTSE MIB, IBEX. Tobin Tax applies.' },
  { id: 'index_asia', label: 'Asian Indices', group: 'indices', tooltip: 'Nikkei 225. Off-hours slippage.' },
  { id: 'index_volatility', label: 'Volatility (VIX)', group: 'indices', tooltip: 'Structural contango decay.' },
  { id: 'equity_us_large', label: 'US Large Cap', group: 'equities', tooltip: 'AAPL, MSFT, NVDA. Penny spreads.' },
  { id: 'equity_us_small', label: 'US Small Cap', group: 'equities', tooltip: 'Hard-to-borrow fees apply.' },
  { id: 'equity_eu_ftt', label: 'EU (With FTT)', group: 'equities', tooltip: 'Italy, France, Spain. Spot Tobin Tax.' },
  { id: 'equity_eu_core', label: 'EU (No Tax)', group: 'equities', tooltip: 'Germany, Netherlands. Pure broker costs.' },
  { id: 'equity_uk', label: 'UK (London)', group: 'equities', tooltip: '0.5% Stamp Duty on spot buy.' },
  { id: 'equity_adr', label: 'ADR', group: 'equities', tooltip: 'Foreign companies US listed. Pass-through fees.' },
  { id: 'commodity_metal', label: 'Metals (Spot)', group: 'commodities', tooltip: 'Gold, Silver. FX-like behaviour.' },
  { id: 'commodity_energy', label: 'Energy', group: 'commodities', tooltip: 'Oil, Gas. Monthly rollover cost.' },
  { id: 'commodity_agri', label: 'Agriculture', group: 'commodities', tooltip: 'Opening gap risk and high slippage.' },
  { id: 'etf_us_broad', label: 'US Broad Market', group: 'etf', tooltip: 'SPY, QQQ. Often commission-free.' },
  { id: 'etf_us_leveraged', label: 'Leveraged 2x/3x', group: 'etf', tooltip: 'Volatility drag over long term.' },
  { id: 'etf_ucits', label: 'UCITS (Europe)', group: 'etf', tooltip: 'Harmonised for EU residents.' },
  { id: 'crypto_major', label: 'Major', group: 'crypto', tooltip: 'BTC, ETH. Reasonable spreads.' },
  { id: 'crypto_altcoin', label: 'Altcoins', group: 'crypto', tooltip: 'Predatory retail spreads.' },
];

export const HORIZONS = [
  { id: 'scalping', label: 'Scalping', holdingDays: 0, tradesPerDay: 15 },
  { id: 'intraday', label: 'Intraday', holdingDays: 0, tradesPerDay: 3 },
  { id: 'swing', label: 'Swing Trading', holdingDays: 4, tradesPerDay: 0.5 },
  { id: 'position', label: 'Position / Hold', holdingDays: 45, tradesPerDay: 0.05 },
];

export const STRATEGY_MAP = {
  scalping: [
    { value: 'order_flow', label: 'Order Flow / DOM' },
    { value: 'micro_momentum', label: 'Micro Momentum' },
    { value: 'news_reaction', label: 'News Reaction' },
  ],
  intraday: [
    { value: 'breakout', label: 'Breakout' },
    { value: 'vwap_bounce', label: 'VWAP Reversion' },
    { value: 'trend_following_day', label: 'Trend Following Intraday' },
  ],
  swing: [
    { value: 'trend_following', label: 'Trend Following' },
    { value: 'range_trading', label: 'Range / Channel Trading' },
    { value: 'mean_reversion', label: 'Mean Reversion' },
  ],
  position: [
    { value: 'macro_trend', label: 'Macro Trend Play' },
    { value: 'carry_trade', label: 'Carry Trade (Swap Yield)' },
    { value: 'value_investing', label: 'Value / Dividend Capture' },
  ],
};

const TEASER_CHIPS = [
  { label: 'Forex · Crypto · Indices' },
  { label: 'Scalping → Position' },
  { label: 'Execution · Holding · Structure' },
  { label: 'Leverage analysis' },
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
