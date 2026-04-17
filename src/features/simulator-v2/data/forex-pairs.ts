export type PairCategory = 'major' | 'cross' | 'exotic';

export type ForexPair = {
  symbol: string;
  base: string;
  quote: string;
  baseFlag: string;
  quoteFlag: string;
  name: string;
  category: PairCategory;
};

export const FOREX_PAIRS: ForexPair[] = [
  // Major — 75% del volume FX mondiale
  { symbol: 'EUR/USD', base: 'EUR', quote: 'USD', baseFlag: '🇪🇺', quoteFlag: '🇺🇸', name: 'Euro / Dollaro USA', category: 'major' },
  { symbol: 'GBP/USD', base: 'GBP', quote: 'USD', baseFlag: '🇬🇧', quoteFlag: '🇺🇸', name: 'Sterlina / Dollaro USA', category: 'major' },
  { symbol: 'USD/JPY', base: 'USD', quote: 'JPY', baseFlag: '🇺🇸', quoteFlag: '🇯🇵', name: 'Dollaro USA / Yen', category: 'major' },
  { symbol: 'USD/CHF', base: 'USD', quote: 'CHF', baseFlag: '🇺🇸', quoteFlag: '🇨🇭', name: 'Dollaro USA / Franco svizzero', category: 'major' },
  { symbol: 'AUD/USD', base: 'AUD', quote: 'USD', baseFlag: '🇦🇺', quoteFlag: '🇺🇸', name: 'Dollaro australiano / USA', category: 'major' },
  { symbol: 'USD/CAD', base: 'USD', quote: 'CAD', baseFlag: '🇺🇸', quoteFlag: '🇨🇦', name: 'Dollaro USA / canadese', category: 'major' },
  { symbol: 'NZD/USD', base: 'NZD', quote: 'USD', baseFlag: '🇳🇿', quoteFlag: '🇺🇸', name: 'Dollaro neozelandese / USA', category: 'major' },

  // Cross — no USD, tra le più liquide
  { symbol: 'EUR/GBP', base: 'EUR', quote: 'GBP', baseFlag: '🇪🇺', quoteFlag: '🇬🇧', name: 'Euro / Sterlina', category: 'cross' },
  { symbol: 'EUR/JPY', base: 'EUR', quote: 'JPY', baseFlag: '🇪🇺', quoteFlag: '🇯🇵', name: 'Euro / Yen', category: 'cross' },
  { symbol: 'GBP/JPY', base: 'GBP', quote: 'JPY', baseFlag: '🇬🇧', quoteFlag: '🇯🇵', name: 'Sterlina / Yen', category: 'cross' },
  { symbol: 'EUR/CHF', base: 'EUR', quote: 'CHF', baseFlag: '🇪🇺', quoteFlag: '🇨🇭', name: 'Euro / Franco svizzero', category: 'cross' },
  { symbol: 'AUD/JPY', base: 'AUD', quote: 'JPY', baseFlag: '🇦🇺', quoteFlag: '🇯🇵', name: 'Dollaro australiano / Yen', category: 'cross' },
  { symbol: 'CHF/JPY', base: 'CHF', quote: 'JPY', baseFlag: '🇨🇭', quoteFlag: '🇯🇵', name: 'Franco svizzero / Yen', category: 'cross' },

  // Esotiche — tra le più liquide
  { symbol: 'USD/TRY', base: 'USD', quote: 'TRY', baseFlag: '🇺🇸', quoteFlag: '🇹🇷', name: 'Dollaro USA / Lira turca', category: 'exotic' },
  { symbol: 'USD/ZAR', base: 'USD', quote: 'ZAR', baseFlag: '🇺🇸', quoteFlag: '🇿🇦', name: 'Dollaro USA / Rand sudafricano', category: 'exotic' },
  { symbol: 'USD/MXN', base: 'USD', quote: 'MXN', baseFlag: '🇺🇸', quoteFlag: '🇲🇽', name: 'Dollaro USA / Peso messicano', category: 'exotic' },
  { symbol: 'USD/SGD', base: 'USD', quote: 'SGD', baseFlag: '🇺🇸', quoteFlag: '🇸🇬', name: 'Dollaro USA / Dollaro di Singapore', category: 'exotic' },
  { symbol: 'USD/SEK', base: 'USD', quote: 'SEK', baseFlag: '🇺🇸', quoteFlag: '🇸🇪', name: 'Dollaro USA / Corona svedese', category: 'exotic' },
];

export const PAIR_CATEGORIES: { id: PairCategory; label: string; desc: string }[] = [
  { id: 'major', label: 'Major', desc: '7 coppie · 75% del volume FX' },
  { id: 'cross', label: 'Cross', desc: '6 coppie · no USD' },
  { id: 'exotic', label: 'Esotiche', desc: '5 coppie · mercati emergenti' },
];
