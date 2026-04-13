// ============================================================
// COMPREHENSIVE ASSET DATABASE
// All tradable instruments organized by category with search metadata
// ============================================================

import type { UnderlyingId } from './underlyings';
import type { InstrumentTypeId } from './instrument-types';

// Forex pairs (from existing underlyings.ts)
export const FOREX_ASSETS = {
  Majors: [
    { id: 'eurusd', symbol: 'EUR/USD', label: 'Euro / Dollaro USA', category: 'forex' },
    { id: 'gbpusd', symbol: 'GBP/USD', label: 'Sterlina / Dollaro USA', category: 'forex' },
    { id: 'usdjpy', symbol: 'USD/JPY', label: 'Dollaro USA / Yen Giapponese', category: 'forex' },
    { id: 'usdchf', symbol: 'USD/CHF', label: 'Dollaro USA / Franco Svizzero', category: 'forex' },
    { id: 'audusd', symbol: 'AUD/USD', label: 'Dollaro Australiano / Dollaro USA', category: 'forex' },
    { id: 'usdcad', symbol: 'USD/CAD', label: 'Dollaro USA / Dollaro Canadese', category: 'forex' },
    { id: 'nzdusd', symbol: 'NZD/USD', label: 'Dollaro Neozelandese / Dollaro USA', category: 'forex' }
  ],
  Minors: [
    { id: 'eurgbp', symbol: 'EUR/GBP', label: 'Euro / Sterlina', category: 'forex' },
    { id: 'eurjpy', symbol: 'EUR/JPY', label: 'Euro / Yen Giapponese', category: 'forex' },
    { id: 'gbpjpy', symbol: 'GBP/JPY', label: 'Sterlina / Yen Giapponese', category: 'forex' },
    { id: 'eurchf', symbol: 'EUR/CHF', label: 'Euro / Franco Svizzero', category: 'forex' },
    { id: 'eurcad', symbol: 'EUR/CAD', label: 'Euro / Dollaro Canadese', category: 'forex' },
    { id: 'euraud', symbol: 'EUR/AUD', label: 'Euro / Dollaro Australiano', category: 'forex' },
    { id: 'audjpy', symbol: 'AUD/JPY', label: 'Dollaro Australiano / Yen Giapponese', category: 'forex' }
  ],
  Exotics: [
    { id: 'usdtry', symbol: 'USD/TRY', label: 'Dollaro USA / Lira Turca', category: 'forex' },
    { id: 'usdmxn', symbol: 'USD/MXN', label: 'Dollaro USA / Peso Messicano', category: 'forex' },
    { id: 'usdzar', symbol: 'USD/ZAR', label: 'Dollaro USA / Rand Sudafricano', category: 'forex' },
    { id: 'eurtry', symbol: 'EUR/TRY', label: 'Euro / Lira Turca', category: 'forex' },
    { id: 'usdsgd', symbol: 'USD/SGD', label: 'Dollaro USA / Dollaro di Singapore', category: 'forex' },
    { id: 'usdhkd', symbol: 'USD/HKD', label: 'Dollaro USA / Dollaro di Hong Kong', category: 'forex' }
  ]
};

// Crypto assets (major cryptocurrencies)
export const CRYPTO_ASSETS = [
  { id: 'btcusd', symbol: 'BTC/USD', label: 'Bitcoin / Dollaro USA', category: 'crypto' },
  { id: 'ethusd', symbol: 'ETH/USD', label: 'Ethereum / Dollaro USA', category: 'crypto' },
  { id: 'bnbusd', symbol: 'BNB/USD', label: 'Binance Coin / Dollaro USA', category: 'crypto' },
  { id: 'xausd', symbol: 'XAU/USD', label: 'Oro / Dollaro USA', category: 'crypto' }, // Gold as crypto-like asset
  { id: 'xagusd', symbol: 'XAG/USD', label: 'Argento / Dollaro USA', category: 'crypto' }, // Silver
  { id: 'ltcusd', symbol: 'LTC/USD', label: 'Litecoin / Dollaro USA', category: 'crypto' },
  { id: 'bchusd', symbol: 'BCH/USD', label: 'Bitcoin Cash / Dollaro USA', category: 'crypto' },
  { id: 'xrp_usd', symbol: 'XRP/USD', label: 'XRP / Dollaro USA', category: 'crypto' },
  { id: 'ada_usd', symbol: 'ADA/USD', label: 'Cardano / Dollaro USA', category: 'crypto' },
  { id: 'dot_usd', symbol: 'DOT/USD', label: 'Polkadot / Dollaro USA', category: 'crypto' },
  { id: 'link_usd', symbol: 'LINK/USD', label: 'Chainlink / Dollaro USA', category: 'crypto' },
  { id: 'matic_usd', symbol: 'MATIC/USD', label: 'Polygon / Dollaro USA', category: 'crypto' },
  { id: 'sol_usd', symbol: 'SOL/USD', label: 'Solana / Dollaro USA', category: 'crypto' },
  { id: 'doge_usd', symbol: 'DOGE/USD', label: 'Dogecoin / Dollaro USA', category: 'crypto' },
  { id: 'shib_usd', symbol: 'SHIB/USD', label: 'Shiba Inu / Dollaro USA', category: 'crypto' },
  { id: 'unusd', symbol: 'UNI/USD', label: 'Uniswap / Dollaro USA', category: 'crypto' }
];

// Equity assets (major stocks/indices)
export const EQUITY_ASSETS = {
  US_Stocks: [
    { id: 'aapl', symbol: 'AAPL', label: 'Apple Inc.', category: 'equity' },
    { id: 'msft', symbol: 'MSFT', label: 'Microsoft Corporation', category: 'equity' },
    { id: 'googl', symbol: 'GOOGL', label: 'Alphabet Inc. (Google)', category: 'equity' },
    { id: 'amzn', symbol: 'AMZN', label: 'Amazon.com Inc.', category: 'equity' },
    { id: 'tsla', symbol: 'TSLA', label: 'Tesla Inc.', category: 'equity' },
    { id: 'meta', symbol: 'META', label: 'Meta Platforms Inc.', category: 'equity' },
    { id: 'nvda', symbol: 'NVDA', label: 'NVIDIA Corporation', category: 'equity' },
    { id: 'jpm', symbol: 'JPM', label: 'JPMorgan Chase & Co.', category: 'equity' },
    { id: 'v', symbol: 'V', label: 'Visa Inc.', category: 'equity' },
    { id: 'wmt', symbol: 'WMT', label: 'Walmart Inc.', category: 'equity' },
    { id: 'dis', symbol: 'DIS', label: 'The Walt Disney Company', category: 'equity' },
    { id: 'nke', symbol: 'NKE', label: 'Nike Inc.', category: 'equity' },
    { id: 'pg', symbol: 'PG', label: 'Procter & Gamble Co.', category: 'equity' },
    { id: 'johnson_johnson', symbol: 'JNJ', label: 'Johnson & Johnson', category: 'equity' },
    { id: 'pfizer', symbol: 'PFE', label: 'Pfizer Inc.', category: 'equity' }
  ],
  EU_Stocks: [
    { id: 'asml', symbol: 'ASML', label: 'ASML Holding NV', category: 'equity' },
    { id: 'sap', symbol: 'SAP', label: 'SAP SE', category: 'equity' },
    { id: 'allianz', symbol: 'ALV', label: 'Allianz SE', category: 'equity' },
    { id: 'siemens', symbol: 'SIEMENS', label: 'Siemens AG', category: 'equity' },
    { id: 'lvmh', symbol: 'MC', label: 'LVMH Moët Hennessy Louis Vuitton', category: 'equity' },
    { id: 'total', symbol: 'TTE', label: 'TotalEnergies SE', category: 'equity' },
    { id: 'sanofi', symbol: 'SAN', label: 'Sanofi', category: 'equity' },
    { id: 'air_liquide', symbol: 'AI', label: 'Air Liquide SA', category: 'equity' },
    { id: 'deutsche_bank', symbol: 'DB', label: 'Deutsche Bank AG', category: 'equity' },
    { id: 'bnp_paribas', symbol: 'BNP', label: 'BNP Paribas SA', category: 'equity' }
  ],
  Indices: [
    { id: 'spx', symbol: 'SPX', label: 'S&P 500 Index', category: 'index' },
    { id: 'dji', symbol: 'DJI', label: 'Dow Jones Industrial Average', category: 'index' },
    { id: 'nasdaq', symbol: 'NDX', label: 'Nasdaq-100 Index', category: 'index' },
    { id: 'russell_2000', symbol: 'RUT', label: 'Russell 2000 Index', category: 'index' },
    { id: 'ftse_100', symbol: 'UKX', label: 'FTSE 100 Index', category: 'index' },
    { id: 'dax', symbol: 'DAX', label: 'DAX Index', category: 'index' },
    { id: 'cac_40', symbol: 'CAC40', label: 'CAC 40 Index', category: 'index' },
    { id: 'nikkei_225', symbol: 'NKY', label: 'Nikkei 225 Index', category: 'index' },
    { id: 'hang_seng', symbol: 'HSI', label: 'Hang Seng Index', category: 'index' },
    { id: 'shanghai_comp', symbol: 'SSE', label: 'Shanghai Composite Index', category: 'index' }
  ]
};

// Commodities (energy, metals, agriculture)
export const COMMODITY_ASSETS = {
  Energy: [
    { id: 'wti', symbol: 'WTI', label: 'West Texas Intermediate Crude Oil', category: 'commodity' },
    { id: 'brent', symbol: 'BRENT', label: 'Brent Crude Oil', category: 'commodity' },
    { id: 'natgas', symbol: 'NATGAS', label: 'Natural Gas', category: 'commodity' },
    { id: 'heating_oil', symbol: 'HO', label: 'Heating Oil', category: 'commodity' },
    { id: 'gasoline', symbol: 'RB', label: 'Reformulated Blendstock for Oxygenate', category: 'commodity' }
  ],
  Metals: [
    { id: 'gold', symbol: 'GC', label: 'Gold Futures', category: 'commodity' },
    { id: 'silver', symbol: 'SI', label: 'Silver Futures', category: 'commodity' },
    { id: 'platinum', symbol: 'PL', label: 'Platinum Futures', category: 'commodity' },
    { id: 'palladium', symbol: 'PA', label: 'Palladium Futures', category: 'commodity' },
    { id: 'copper', symbol: 'HG', label: 'Copper Futures', category: 'commodity' },
    { id: 'aluminum', symbol: 'ALI', label: 'Aluminum Futures', category: 'commodity' }
  ],
  Agriculture: [
    { id: 'corn', symbol: 'ZC', label: 'Corn Futures', category: 'commodity' },
    { id: 'wheat', symbol: 'ZW', label: 'Wheat Futures', category: 'commodity' },
    { id: 'soybeans', symbol: 'ZS', label: 'Soybeans Futures', category: 'commodity' },
    { id: 'sugar', symbol: 'SB', label: 'Sugar Futures', category: 'commodity' },
    { id: 'cotton', symbol: 'CT', label: 'Cotton Futures', category: 'commodity' },
    { id: 'coffee', symbol: 'KC', label: 'Coffee Futures', category: 'commodity' }
  ]
};

// Combined flat list for searching
export const ALL_ASSETS = [
  ...FOREX_ASSETS.Majors,
  ...FOREX_ASSETS.Minors,
  ...FOREX_ASSETS.Exotics,
  ...CRYPTO_ASSETS,
  ...EQUITY_ASSETS.US_Stocks,
  ...EQUITY_ASSETS.EU_Stocks,
  ...EQUITY_ASSETS.Indices,
  ...COMMODITY_ASSETS.Energy,
  ...COMMODITY_ASSETS.Metals,
  ...COMMODITY_ASSETS.Agriculture
];

// Search helpers
export function getAssetById(id: string) {
  return ALL_ASSETS.find(asset => asset.id === id) ?? null;
}

export function getAssetsByCategory(category: string) {
  return ALL_ASSETS.filter(asset => asset.category === category);
}

export function getAssetsByQuery(query: string) {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return ALL_ASSETS;
  
  return ALL_ASSETS.filter(asset => 
    asset.id.toLowerCase().includes(lowerQuery) ||
    asset.symbol.toLowerCase().includes(lowerQuery) ||
    asset.label.toLowerCase().includes(lowerQuery)
  );
}

export function getPopularAssets(limit: number = 10) {
  // Return most commonly traded assets as defaults
  const popular = [
    'eurusd', 'gbpusd', 'usdjpy', // Forex majors
    'btcusd', 'ethusd',           // Crypto
    'aapl', 'msft', 'googl',      // US stocks
    'spx', 'nasdaq',              // Indices
    'wti', 'gold'                 // Commodities
  ];
  
  return popular
    .map(id => getAssetById(id))
    .filter(Boolean)
    .slice(0, limit);
}

// Helper functions for backward compatibility
export function getAssetClassFromId(id: string): AssetClass | null {
  const asset = getAssetById(id);
  if (!asset) return null;
  
  // Map category to AssetClass type
  switch (asset.category) {
    case 'forex': return 'FOREX';
    case 'crypto': return 'CRYPTO';
    case 'equity': return 'EQUITY';
    case 'index': return 'INDEX';
    case 'commodity': return 'COMMODITY';
    default: return null;
  }
}

export function getSubGroupFromId(id: string): string | null {
  const asset = getAssetById(id);
  if (!asset) return null;
  
  // For forex, determine group based on symbol patterns
  if (asset.category === 'forex') {
    // Major pairs (common patterns)
    const majorPairs = ['eurusd', 'gbpusd', 'usdjpy', 'usdchf', 'audusd', 'usdcad', 'nzdusd'];
    if (majorPairs.includes(id)) return 'Majors';
    
    // Minor pairs (crosses)
    const minorPairs = ['eurgbp', 'eurjpy', 'gbpjpy', 'eurchf', 'eurcad', 'euraud', 'audjpy'];
    if (minorPairs.includes(id)) return 'Cross';
    
    // Everything else is exotic
    return 'Exotic';
  }
  
  // For other categories, return the category as subgroup
  return asset.category.toUpperCase();
}