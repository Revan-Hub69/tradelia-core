/**
 * Countries Configuration
 * 
 * Tier 1 (5): Full localization - taxation, regulation, platforms, examples
 * Tier 2 (10): Partial localization - regional content, translated
 * Tier 3 (15+): Minimal localization - global content only
 */

export interface Country {
  code: string
  name: string
  nameEn: string
  flag: string
  tier: 1 | 2 | 3
  region: 'europe' | 'americas' | 'asia' | 'oceania' | 'africa'
  taxRegime: 'simple' | 'complex'
  regulationLevel: 'strict' | 'moderate' | 'flexible'
  currency: string
  currencySymbol: string
}

export const countries: Country[] = [
  // TIER 1 - Full Localization (5 countries)
  {
    code: 'IT',
    name: 'Italia',
    nameEn: 'Italy',
    flag: '🇮🇹',
    tier: 1,
    region: 'europe',
    taxRegime: 'complex',
    regulationLevel: 'strict',
    currency: 'EUR',
    currencySymbol: '€'
  },
  {
    code: 'US',
    name: 'Stati Uniti',
    nameEn: 'United States',
    flag: '🇺🇸',
    tier: 1,
    region: 'americas',
    taxRegime: 'complex',
    regulationLevel: 'moderate',
    currency: 'USD',
    currencySymbol: '$'
  },
  {
    code: 'GB',
    name: 'Regno Unito',
    nameEn: 'United Kingdom',
    flag: '🇬🇧',
    tier: 1,
    region: 'europe',
    taxRegime: 'complex',
    regulationLevel: 'strict',
    currency: 'GBP',
    currencySymbol: '£'
  },
  {
    code: 'DE',
    name: 'Germania',
    nameEn: 'Germany',
    flag: '🇩🇪',
    tier: 1,
    region: 'europe',
    taxRegime: 'complex',
    regulationLevel: 'strict',
    currency: 'EUR',
    currencySymbol: '€'
  },
  {
    code: 'FR',
    name: 'Francia',
    nameEn: 'France',
    flag: '🇫🇷',
    tier: 1,
    region: 'europe',
    taxRegime: 'complex',
    regulationLevel: 'strict',
    currency: 'EUR',
    currencySymbol: '€'
  },
  
  // TIER 2 - Partial Localization (10 countries)
  {
    code: 'ES',
    name: 'Spagna',
    nameEn: 'Spain',
    flag: '🇪🇸',
    tier: 2,
    region: 'europe',
    taxRegime: 'simple',
    regulationLevel: 'moderate',
    currency: 'EUR',
    currencySymbol: '€'
  },
  {
    code: 'PT',
    name: 'Portogallo',
    nameEn: 'Portugal',
    flag: '🇵🇹',
    tier: 2,
    region: 'europe',
    taxRegime: 'simple',
    regulationLevel: 'flexible',
    currency: 'EUR',
    currencySymbol: '€'
  },
  {
    code: 'CH',
    name: 'Svizzera',
    nameEn: 'Switzerland',
    flag: '🇨🇭',
    tier: 2,
    region: 'europe',
    taxRegime: 'complex',
    regulationLevel: 'moderate',
    currency: 'CHF',
    currencySymbol: 'CHF'
  },
  {
    code: 'NL',
    name: 'Paesi Bassi',
    nameEn: 'Netherlands',
    flag: '🇳🇱',
    tier: 2,
    region: 'europe',
    taxRegime: 'simple',
    regulationLevel: 'flexible',
    currency: 'EUR',
    currencySymbol: '€'
  },
  {
    code: 'BE',
    name: 'Belgio',
    nameEn: 'Belgium',
    flag: '🇧🇪',
    tier: 2,
    region: 'europe',
    taxRegime: 'complex',
    regulationLevel: 'strict',
    currency: 'EUR',
    currencySymbol: '€'
  },
  {
    code: 'AT',
    name: 'Austria',
    nameEn: 'Austria',
    flag: '🇦🇹',
    tier: 2,
    region: 'europe',
    taxRegime: 'complex',
    regulationLevel: 'strict',
    currency: 'EUR',
    currencySymbol: '€'
  },
  {
    code: 'CA',
    name: 'Canada',
    nameEn: 'Canada',
    flag: '🇨🇦',
    tier: 2,
    region: 'americas',
    taxRegime: 'complex',
    regulationLevel: 'moderate',
    currency: 'CAD',
    currencySymbol: 'C$'
  },
  {
    code: 'AU',
    name: 'Australia',
    nameEn: 'Australia',
    flag: '🇦🇺',
    tier: 2,
    region: 'oceania',
    taxRegime: 'simple',
    regulationLevel: 'moderate',
    currency: 'AUD',
    currencySymbol: 'A$'
  },
  {
    code: 'JP',
    name: 'Giappone',
    nameEn: 'Japan',
    flag: '🇯🇵',
    tier: 2,
    region: 'asia',
    taxRegime: 'complex',
    regulationLevel: 'strict',
    currency: 'JPY',
    currencySymbol: '¥'
  },
  {
    code: 'KR',
    name: 'Corea del Sud',
    nameEn: 'South Korea',
    flag: '🇰🇷',
    tier: 2,
    region: 'asia',
    taxRegime: 'complex',
    regulationLevel: 'strict',
    currency: 'KRW',
    currencySymbol: '₩'
  },
  
  // TIER 3 - Minimal Localization (15+ countries)
  {
    code: 'BR',
    name: 'Brasile',
    nameEn: 'Brazil',
    flag: '🇧🇷',
    tier: 3,
    region: 'americas',
    taxRegime: 'complex',
    regulationLevel: 'moderate',
    currency: 'BRL',
    currencySymbol: 'R$'
  },
  {
    code: 'MX',
    name: 'Messico',
    nameEn: 'Mexico',
    flag: '🇲🇽',
    tier: 3,
    region: 'americas',
    taxRegime: 'simple',
    regulationLevel: 'flexible',
    currency: 'MXN',
    currencySymbol: 'MX$'
  },
  {
    code: 'AR',
    name: 'Argentina',
    nameEn: 'Argentina',
    flag: '🇦🇷',
    tier: 3,
    region: 'americas',
    taxRegime: 'complex',
    regulationLevel: 'flexible',
    currency: 'ARS',
    currencySymbol: 'AR$'
  },
  {
    code: 'SG',
    name: 'Singapore',
    nameEn: 'Singapore',
    flag: '🇸🇬',
    tier: 3,
    region: 'asia',
    taxRegime: 'simple',
    regulationLevel: 'flexible',
    currency: 'SGD',
    currencySymbol: 'S$'
  },
  {
    code: 'HK',
    name: 'Hong Kong',
    nameEn: 'Hong Kong',
    flag: '🇭🇰',
    tier: 3,
    region: 'asia',
    taxRegime: 'simple',
    regulationLevel: 'flexible',
    currency: 'HKD',
    currencySymbol: 'HK$'
  },
  {
    code: 'IN',
    name: 'India',
    nameEn: 'India',
    flag: '🇮🇳',
    tier: 3,
    region: 'asia',
    taxRegime: 'complex',
    regulationLevel: 'strict',
    currency: 'INR',
    currencySymbol: '₹'
  },
  {
    code: 'SE',
    name: 'Svezia',
    nameEn: 'Sweden',
    flag: '🇸🇪',
    tier: 3,
    region: 'europe',
    taxRegime: 'simple',
    regulationLevel: 'moderate',
    currency: 'SEK',
    currencySymbol: 'kr'
  },
  {
    code: 'NO',
    name: 'Norvegia',
    nameEn: 'Norway',
    flag: '🇳🇴',
    tier: 3,
    region: 'europe',
    taxRegime: 'simple',
    regulationLevel: 'moderate',
    currency: 'NOK',
    currencySymbol: 'kr'
  },
  {
    code: 'DK',
    name: 'Danimarca',
    nameEn: 'Denmark',
    flag: '🇩🇰',
    tier: 3,
    region: 'europe',
    taxRegime: 'simple',
    regulationLevel: 'moderate',
    currency: 'DKK',
    currencySymbol: 'kr'
  },
  {
    code: 'FI',
    name: 'Finlandia',
    nameEn: 'Finland',
    flag: '🇫🇮',
    tier: 3,
    region: 'europe',
    taxRegime: 'simple',
    regulationLevel: 'moderate',
    currency: 'EUR',
    currencySymbol: '€'
  },
  {
    code: 'PL',
    name: 'Polonia',
    nameEn: 'Poland',
    flag: '🇵🇱',
    tier: 3,
    region: 'europe',
    taxRegime: 'simple',
    regulationLevel: 'moderate',
    currency: 'PLN',
    currencySymbol: 'zł'
  },
  {
    code: 'CZ',
    name: 'Repubblica Ceca',
    nameEn: 'Czech Republic',
    flag: '🇨🇿',
    tier: 3,
    region: 'europe',
    taxRegime: 'simple',
    regulationLevel: 'moderate',
    currency: 'CZK',
    currencySymbol: 'Kč'
  },
  {
    code: 'IE',
    name: 'Irlanda',
    nameEn: 'Ireland',
    flag: '🇮🇪',
    tier: 3,
    region: 'europe',
    taxRegime: 'simple',
    regulationLevel: 'flexible',
    currency: 'EUR',
    currencySymbol: '€'
  },
  {
    code: 'NZ',
    name: 'Nuova Zelanda',
    nameEn: 'New Zealand',
    flag: '🇳🇿',
    tier: 3,
    region: 'oceania',
    taxRegime: 'simple',
    regulationLevel: 'moderate',
    currency: 'NZD',
    currencySymbol: 'NZ$'
  },
  {
    code: 'ZA',
    name: 'Sudafrica',
    nameEn: 'South Africa',
    flag: '🇿🇦',
    tier: 3,
    region: 'africa',
    taxRegime: 'simple',
    regulationLevel: 'moderate',
    currency: 'ZAR',
    currencySymbol: 'R'
  }
]

// Helper functions
export function getCountryByCode(code: string): Country | undefined {
  return countries.find(c => c.code === code)
}

export function getCountriesByTier(tier: 1 | 2 | 3): Country[] {
  return countries.filter(c => c.tier === tier)
}

export function getCountriesByRegion(region: Country['region']): Country[] {
  return countries.filter(c => c.region === region)
}

export function searchCountries(query: string, locale: 'it' | 'en' = 'it'): Country[] {
  const searchLower = query.toLowerCase()
  return countries.filter(country => {
    const name = locale === 'it' ? country.name : country.nameEn
    return (
      name.toLowerCase().includes(searchLower) ||
      country.code.toLowerCase().includes(searchLower)
    )
  })
}
