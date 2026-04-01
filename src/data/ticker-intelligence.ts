/*
 * TICKER INTELLIGENCE MOCK DATA
 * Complete dataset for Swing Trader Intelligence Terminal demo
 */

export type TickerType = 'CALL' | 'PUT';
export type ExecutionType = 'SWEEP' | 'PASSIVE' | 'SWING' | 'BLOCK';
export type BiasType = 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'VOLATILE';
export type FlowType = 'CALL_DOMINANT' | 'PUT_DOMINANT' | 'BALANCED' | 'MIXED';

export interface OptionsFlow {
  ticker: string;
  type: TickerType;
  size: number;
  strike: number;
  expiry_days: number;
  execution: ExecutionType;
  timestamp: string;
}

export interface TickerIntelligence {
  ticker: string;
  name: string;
  price: number;
  change: number;
  
  // Scenario Engine
  bias: BiasType;
  confidence: number;
  scenario_summary: string;
  
  // Options Positioning
  gex: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  gamma_flip: number | null;
  key_strikes: number[];
  
  // Flow Intelligence
  flow_3d: FlowType;
  recent_flows: OptionsFlow[];
  call_pressure: number;
  put_pressure: number;
  
  // Risk Layer
  invalidation_level: number | null;
  upcoming_events: string[];
  
  // Metadata
  last_updated: string;
  source: string;
}

// Mock flows for demo
const generateFlows = (ticker: string, bias: BiasType): OptionsFlow[] => {
  const flows: OptionsFlow[] = [];
  const baseTime = Date.now();
  
  const callTypes: TickerType[] = ['CALL', 'CALL', 'CALL', 'PUT'];
  const executions: ExecutionType[] = ['SWEEP', 'SWEEP', 'PASSIVE', 'BLOCK', 'SWING'];
  
  for (let i = 0; i < 5; i++) {
    const typeIndex = bias === 'BEARISH' ? 3 : (bias === 'BULLISH' ? 0 : Math.floor(Math.random() * 4));
    const execIndex = Math.floor(Math.random() * executions.length);
    flows.push({
      ticker,
      type: callTypes[typeIndex] as TickerType,
      size: Math.floor(Math.random() * 500000) + 100000,
      strike: Math.floor(Math.random() * 100) * 10 + 100,
      expiry_days: Math.floor(Math.random() * 14) + 1,
      execution: executions[execIndex] as ExecutionType,
      timestamp: new Date(baseTime - i * 3600000).toISOString(),
    });
  }
  
  return flows;
};

// Complete mock dataset (15 tickers)
export const TICKER_INTELLIGENCE_DATA: TickerIntelligence[] = [
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corp',
    price: 892.45,
    change: 3.2,
    
    bias: 'BULLISH',
    confidence: 82,
    scenario_summary: 'Call sweep dominance with gamma flip approaching. Institutional accumulation evident.',
    
    gex: 'POSITIVE',
    gamma_flip: 895,
    key_strikes: [900, 950, 1000],
    
    flow_3d: 'CALL_DOMINANT',
    recent_flows: generateFlows('NVDA', 'BULLISH'),
    call_pressure: 78,
    put_pressure: 22,
    
    invalidation_level: 850,
    upcoming_events: ['Q2 Earnings (Aug)', ' Blackwell Launch'],
    
    last_updated: new Date().toISOString(),
    source: 'UOA + Dark Pool',
  },
  {
    ticker: 'TSLA',
    name: 'Tesla Inc',
    price: 248.50,
    change: -1.8,
    
    bias: 'VOLATILE',
    confidence: 45,
    scenario_summary: 'Mixed signals. Recent put sweeps suggest hedging but call activity remains elevated.',
    
    gex: 'NEGATIVE',
    gamma_flip: 240,
    key_strikes: [250, 260, 280],
    
    flow_3d: 'MIXED',
    recent_flows: generateFlows('TSLA', 'VOLATILE'),
    call_pressure: 55,
    put_pressure: 45,
    
    invalidation_level: 230,
    upcoming_events: ['Delivery Data (Q2)', 'Robotaxi Event'],
    
    last_updated: new Date().toISOString(),
    source: 'UOA + Flow',
  },
  {
    ticker: 'AAPL',
    name: 'Apple Inc',
    price: 182.35,
    change: 0.5,
    
    bias: 'NEUTRAL',
    confidence: 65,
    scenario_summary: 'Balanced flow with moderate put support. Earnings upcoming creates uncertainty.',
    
    gex: 'NEUTRAL',
    gamma_flip: null,
    key_strikes: [180, 185, 190],
    
    flow_3d: 'BALANCED',
    recent_flows: generateFlows('AAPL', 'NEUTRAL'),
    call_pressure: 48,
    put_pressure: 52,
    
    invalidation_level: 175,
    upcoming_events: ['Q3 Earnings (July 25)', 'iPhone 16 Preview'],
    
    last_updated: new Date().toISOString(),
    source: 'Flow Analysis',
  },
  {
    ticker: 'AMD',
    name: 'Advanced Micro Devices',
    price: 178.20,
    change: 2.1,
    
    bias: 'BULLISH',
    confidence: 74,
    scenario_summary: 'Data center momentum driving call accumulation. Key resistance at 185.',
    
    gex: 'POSITIVE',
    gamma_flip: 180,
    key_strikes: [180, 190, 200],
    
    flow_3d: 'CALL_DOMINANT',
    recent_flows: generateFlows('AMD', 'BULLISH'),
    call_pressure: 68,
    put_pressure: 32,
    
    invalidation_level: 165,
    upcoming_events: ['Q2 Earnings (July 30)'],
    
    last_updated: new Date().toISOString(),
    source: 'UOA + Institutional',
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corp',
    price: 415.80,
    change: 1.2,
    
    bias: 'BULLISH',
    confidence: 88,
    scenario_summary: 'Strong institutional support. Cloud momentum continues. Protected at current levels.',
    
    gex: 'POSITIVE',
    gamma_flip: 420,
    key_strikes: [420, 440, 450],
    
    flow_3d: 'CALL_DOMINANT',
    recent_flows: generateFlows('MSFT', 'BULLISH'),
    call_pressure: 72,
    put_pressure: 28,
    
    invalidation_level: 400,
    upcoming_events: ['Q4 Earnings (July 30)'],
    
    last_updated: new Date().toISOString(),
    source: 'Institutional Flow',
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com Inc',
    price: 188.45,
    change: 0.8,
    
    bias: 'BULLISH',
    confidence: 70,
    scenario_summary: 'AWS growth accelerating. Call activity concentrated at 195 strike.',
    
    gex: 'POSITIVE',
    gamma_flip: 190,
    key_strikes: [190, 200, 210],
    
    flow_3d: 'CALL_DOMINANT',
    recent_flows: generateFlows('AMZN', 'BULLISH'),
    call_pressure: 65,
    put_pressure: 35,
    
    invalidation_level: 180,
    upcoming_events: ['Q2 Earnings (Aug 1)'],
    
    last_updated: new Date().toISOString(),
    source: 'UOA + Flow',
  },
  {
    ticker: 'META',
    name: 'Meta Platforms',
    price: 498.25,
    change: 1.5,
    
    bias: 'BULLISH',
    confidence: 80,
    scenario_summary: 'AI investments paying off. Strong call pressure at 520 strike.',
    
    gex: 'POSITIVE',
    gamma_flip: 510,
    key_strikes: [500, 520, 550],
    
    flow_3d: 'CALL_DOMINANT',
    recent_flows: generateFlows('META', 'BULLISH'),
    call_pressure: 74,
    put_pressure: 26,
    
    invalidation_level: 480,
    upcoming_events: ['Q2 Earnings (July 24)'],
    
    last_updated: new Date().toISOString(),
    source: 'Institutional',
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc',
    price: 178.90,
    change: 0.3,
    
    bias: 'NEUTRAL',
    confidence: 58,
    scenario_summary: 'Mixed flows. Cloud segment performing well but ad revenue concerns persist.',
    
    gex: 'NEUTRAL',
    gamma_flip: null,
    key_strikes: [175, 180, 185],
    
    flow_3d: 'BALANCED',
    recent_flows: generateFlows('GOOGL', 'NEUTRAL'),
    call_pressure: 50,
    put_pressure: 50,
    
    invalidation_level: 170,
    upcoming_events: ['Q2 Earnings (July 23)'],
    
    last_updated: new Date().toISOString(),
    source: 'Flow Analysis',
  },
  {
    ticker: 'SPY',
    name: 'S&P 500 ETF',
    price: 542.30,
    change: 0.4,
    
    bias: 'NEUTRAL',
    confidence: 62,
    scenario_summary: 'Macro uncertainty. Put writing at 540 provides base but upside limited.',
    
    gex: 'NEUTRAL',
    gamma_flip: null,
    key_strikes: [540, 550, 560],
    
    flow_3d: 'BALANCED',
    recent_flows: generateFlows('SPY', 'NEUTRAL'),
    call_pressure: 48,
    put_pressure: 52,
    
    invalidation_level: 530,
    upcoming_events: ['FOMC Meeting (July 30-31)', 'Jobs Report (Aug 2)'],
    
    last_updated: new Date().toISOString(),
    source: 'Macro Flow',
  },
  {
    ticker: 'QQQ',
    name: 'Nasdaq-100 ETF',
    price: 468.15,
    change: 0.6,
    
    bias: 'BULLISH',
    confidence: 68,
    scenario_summary: 'Tech sector leading. Call dominance at 480 strike suggests continued rally.',
    
    gex: 'POSITIVE',
    gamma_flip: 475,
    key_strikes: [470, 480, 490],
    
    flow_3d: 'CALL_DOMINANT',
    recent_flows: generateFlows('QQQ', 'BULLISH'),
    call_pressure: 62,
    put_pressure: 38,
    
    invalidation_level: 455,
    upcoming_events: ['Fed Meeting', 'Tech Earnings'],
    
    last_updated: new Date().toISOString(),
    source: 'Index Flow',
  },
  {
    ticker: 'PLTR',
    name: 'Palantir Technologies',
    price: 24.85,
    change: 5.2,
    
    bias: 'BULLISH',
    confidence: 72,
    scenario_summary: 'Momentum play with unusual call sweeps. High volatility expected to continue.',
    
    gex: 'POSITIVE',
    gamma_flip: 25,
    key_strikes: [25, 28, 30],
    
    flow_3d: 'CALL_DOMINANT',
    recent_flows: generateFlows('PLTR', 'BULLISH'),
    call_pressure: 82,
    put_pressure: 18,
    
    invalidation_level: 22,
    upcoming_events: ['Q2 Earnings (Aug 5)'],
    
    last_updated: new Date().toISOString(),
    source: 'UOA',
  },
  {
    ticker: 'SMCI',
    name: 'Super Micro Computer',
    price: 758.20,
    change: -2.4,
    
    bias: 'BEARISH',
    confidence: 58,
    scenario_summary: 'Accounting concerns weigh. Put spreads accumulating at current levels.',
    
    gex: 'NEGATIVE',
    gamma_flip: 740,
    key_strikes: [750, 700, 650],
    
    flow_3d: 'PUT_DOMINANT',
    recent_flows: generateFlows('SMCI', 'BEARISH'),
    call_pressure: 35,
    put_pressure: 65,
    
    invalidation_level: 780,
    upcoming_events: ['Q3 Earnings (July 30)'],
    
    last_updated: new Date().toISOString(),
    source: 'Flow + News',
  },
  {
    ticker: 'INTC',
    name: 'Intel Corp',
    price: 32.45,
    change: -0.8,
    
    bias: 'BEARISH',
    confidence: 64,
    scenario_summary: 'Turnaround uncertain. Heavy put activity at 30 strike for protection.',
    
    gex: 'NEGATIVE',
    gamma_flip: 30,
    key_strikes: [30, 35, 40],
    
    flow_3d: 'PUT_DOMINANT',
    recent_flows: generateFlows('INTC', 'BEARISH'),
    call_pressure: 28,
    put_pressure: 72,
    
    invalidation_level: 35,
    upcoming_events: ['Q2 Earnings (Aug 1)'],
    
    last_updated: new Date().toISOString(),
    source: 'Institutional',
  },
  {
    ticker: 'COIN',
    name: 'Coinbase Global',
    price: 228.50,
    change: 4.1,
    
    bias: 'VOLATILE',
    confidence: 40,
    scenario_summary: 'Bitcoin correlation driving moves. Extreme call sweeps alternating with puts.',
    
    gex: 'NEUTRAL',
    gamma_flip: null,
    key_strikes: [220, 240, 260],
    
    flow_3d: 'MIXED',
    recent_flows: generateFlows('COIN', 'VOLATILE'),
    call_pressure: 52,
    put_pressure: 48,
    
    invalidation_level: 200,
    upcoming_events: ['Bitcoin ETF Decision', 'Q2 Earnings'],
    
    last_updated: new Date().toISOString(),
    source: 'Crypto Flow',
  },
  {
    ticker: 'HOOD',
    name: 'Robinhood Markets',
    price: 18.75,
    change: 1.2,
    
    bias: 'BULLISH',
    confidence: 66,
    scenario_summary: 'Retail momentum building. Call sweeps at 20 strike indicate breakout potential.',
    
    gex: 'POSITIVE',
    gamma_flip: 19,
    key_strikes: [18, 20, 22],
    
    flow_3d: 'CALL_DOMINANT',
    recent_flows: generateFlows('HOOD', 'BULLISH'),
    call_pressure: 68,
    put_pressure: 32,
    
    invalidation_level: 17,
    upcoming_events: ['Q2 Earnings (July 30)'],
    
    last_updated: new Date().toISOString(),
    source: 'UOA + Retail Flow',
  },
];

// Utility functions

export type SectorType = 'Technology' | 'Healthcare' | 'Financials' | 'Consumer Discretionary' | 'Consumer Staples' | 'Energy' | 'Industrials' | 'Utilities' | 'Materials' | 'Real Estate' | 'Communication';

export interface SectorRotation {
  sector: SectorType;
  etf: string;
  dominance: number;
  delta: number;
  bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  volume: number;
  last_updated: string;
}

// Mock sector rotation data - compliant, no trading signals
// Shows where market is allocating pressure, not recommendations
export const SECTOR_ROTATION_DATA: SectorRotation[] = [
  {
    sector: 'Technology',
    etf: 'XLK',
    dominance: 0.72,
    delta: 0.05,
    bias: 'BULLISH',
    volume: 450000000,
    last_updated: new Date().toISOString(),
  },
  {
    sector: 'Financials',
    etf: 'XLF',
    dominance: 0.58,
    delta: 0.02,
    bias: 'BULLISH',
    volume: 320000000,
    last_updated: new Date().toISOString(),
  },
  {
    sector: 'Healthcare',
    etf: 'XLV',
    dominance: 0.51,
    delta: -0.02,
    bias: 'NEUTRAL',
    volume: 180000000,
    last_updated: new Date().toISOString(),
  },
  {
    sector: 'Consumer Discretionary',
    etf: 'XLY',
    dominance: 0.48,
    delta: -0.01,
    bias: 'NEUTRAL',
    volume: 210000000,
    last_updated: new Date().toISOString(),
  },
  {
    sector: 'Energy',
    etf: 'XLE',
    dominance: 0.42,
    delta: -0.03,
    bias: 'BEARISH',
    volume: 150000000,
    last_updated: new Date().toISOString(),
  },
  {
    sector: 'Industrials',
    etf: 'XLI',
    dominance: 0.55,
    delta: 0.01,
    bias: 'BULLISH',
    volume: 190000000,
    last_updated: new Date().toISOString(),
  },
  {
    sector: 'Utilities',
    etf: 'XLU',
    dominance: 0.45,
    delta: 0.00,
    bias: 'NEUTRAL',
    volume: 95000000,
    last_updated: new Date().toISOString(),
  },
  {
    sector: 'Materials',
    etf: 'XLB',
    dominance: 0.38,
    delta: -0.04,
    bias: 'BEARISH',
    volume: 85000000,
    last_updated: new Date().toISOString(),
  },
];

export const getSectorRotation = (): SectorRotation[] => {
  return [...SECTOR_ROTATION_DATA].sort((a, b) => b.dominance - a.dominance);
};

export const getTopSectors = (limit: number = 5): SectorRotation[] => {
  return getSectorRotation().slice(0, limit);
};

export const getSectorBiasColor = (bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL'): string => {
  switch (bias) {
    case 'BULLISH': return 'emerald';
    case 'BEARISH': return 'rose';
    case 'NEUTRAL': return 'neutral';
    default: return 'neutral';
  }
};

export const getDominanceThreshold = (dominance: number): 'BULLISH' | 'BEARISH' | 'NEUTRAL' => {
  if (dominance >= 0.6) return 'BULLISH';
  if (dominance <= 0.4) return 'BEARISH';
  return 'NEUTRAL';
};

export const formatSectorVolume = (volume: number): string => {
  if (volume >= 1000000000) {
    return `${(volume / 1000000000).toFixed(1)}B`;
  }
  return `${(volume / 1000000).toFixed(0)}M`;
};

export const formatDelta = (delta: number): string => {
  const sign = delta > 0 ? '+' : '';
  return `${sign}${(delta * 100).toFixed(0)}%`;
};
export const getTickerBySymbol = (symbol: string): TickerIntelligence | undefined => {
  return TICKER_INTELLIGENCE_DATA.find(t => t.ticker === symbol.toUpperCase());
};

export const getTickersByBias = (bias: BiasType): TickerIntelligence[] => {
  return TICKER_INTELLIGENCE_DATA.filter(t => t.bias === bias);
};

export const getTopBullish = (limit: number = 5): TickerIntelligence[] => {
  return TICKER_INTELLIGENCE_DATA
    .filter(t => t.bias === 'BULLISH')
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit);
};

export const getTopBearish = (limit: number = 5): TickerIntelligence[] => {
  return TICKER_INTELLIGENCE_DATA
    .filter(t => t.bias === 'BEARISH')
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit);
};

export const formatSize = (size: number): string => {
  if (size >= 1000000) {
    return `$${(size / 1000000).toFixed(1)}M`;
  }
  return `$${(size / 1000).toFixed(0)}K`;
};

export const getBiasColor = (bias: BiasType): string => {
  switch (bias) {
    case 'BULLISH': return 'emerald';
    case 'BEARISH': return 'rose';
    case 'NEUTRAL': return 'neutral';
    case 'VOLATILE': return 'amber';
    default: return 'neutral';
  }
};

export const getFlowIcon = (type: TickerType): string => {
  return type === 'CALL' ? '📈' : '📉';
};