/**
 * ISO 3166-1 alpha-2 Country Codes
 * Complete list of all countries for registration
 */

export interface Country {
  code: string
  name: string
  nameIt: string  // Italian name for i18n
}

// All countries sorted alphabetically by English name
export const ALL_COUNTRIES: Country[] = [
  { code: 'AF', name: 'Afghanistan', nameIt: 'Afghanistan' },
  { code: 'AL', name: 'Albania', nameIt: 'Albania' },
  { code: 'DZ', name: 'Algeria', nameIt: 'Algeria' },
  { code: 'AD', name: 'Andorra', nameIt: 'Andorra' },
  { code: 'AO', name: 'Angola', nameIt: 'Angola' },
  { code: 'AG', name: 'Antigua and Barbuda', nameIt: 'Antigua e Barbuda' },
  { code: 'AR', name: 'Argentina', nameIt: 'Argentina' },
  { code: 'AM', name: 'Armenia', nameIt: 'Armenia' },
  { code: 'AU', name: 'Australia', nameIt: 'Australia' },
  { code: 'AT', name: 'Austria', nameIt: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan', nameIt: 'Azerbaigian' },
  { code: 'BS', name: 'Bahamas', nameIt: 'Bahamas' },
  { code: 'BH', name: 'Bahrain', nameIt: 'Bahrein' },
  { code: 'BD', name: 'Bangladesh', nameIt: 'Bangladesh' },
  { code: 'BB', name: 'Barbados', nameIt: 'Barbados' },
  { code: 'BY', name: 'Belarus', nameIt: 'Bielorussia' },
  { code: 'BE', name: 'Belgium', nameIt: 'Belgio' },
  { code: 'BZ', name: 'Belize', nameIt: 'Belize' },
  { code: 'BJ', name: 'Benin', nameIt: 'Benin' },
  { code: 'BT', name: 'Bhutan', nameIt: 'Bhutan' },
  { code: 'BO', name: 'Bolivia', nameIt: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina', nameIt: 'Bosnia ed Erzegovina' },
  { code: 'BW', name: 'Botswana', nameIt: 'Botswana' },
  { code: 'BR', name: 'Brazil', nameIt: 'Brasile' },
  { code: 'BN', name: 'Brunei', nameIt: 'Brunei' },
  { code: 'BG', name: 'Bulgaria', nameIt: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso', nameIt: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi', nameIt: 'Burundi' },
  { code: 'CV', name: 'Cabo Verde', nameIt: 'Capo Verde' },
  { code: 'KH', name: 'Cambodia', nameIt: 'Cambogia' },
  { code: 'CM', name: 'Cameroon', nameIt: 'Camerun' },
  { code: 'CA', name: 'Canada', nameIt: 'Canada' },
  { code: 'CF', name: 'Central African Republic', nameIt: 'Repubblica Centrafricana' },
  { code: 'TD', name: 'Chad', nameIt: 'Ciad' },
  { code: 'CL', name: 'Chile', nameIt: 'Cile' },
  { code: 'CN', name: 'China', nameIt: 'Cina' },
  { code: 'CO', name: 'Colombia', nameIt: 'Colombia' },
  { code: 'KM', name: 'Comoros', nameIt: 'Comore' },
  { code: 'CG', name: 'Congo', nameIt: 'Congo' },
  { code: 'CD', name: 'Congo (DRC)', nameIt: 'Congo (RDC)' },
  { code: 'CR', name: 'Costa Rica', nameIt: 'Costa Rica' },
  { code: 'HR', name: 'Croatia', nameIt: 'Croazia' },
  { code: 'CU', name: 'Cuba', nameIt: 'Cuba' },
  { code: 'CY', name: 'Cyprus', nameIt: 'Cipro' },
  { code: 'CZ', name: 'Czechia', nameIt: 'Repubblica Ceca' },
  { code: 'DK', name: 'Denmark', nameIt: 'Danimarca' },
  { code: 'DJ', name: 'Djibouti', nameIt: 'Gibuti' },
  { code: 'DM', name: 'Dominica', nameIt: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic', nameIt: 'Repubblica Dominicana' },
  { code: 'EC', name: 'Ecuador', nameIt: 'Ecuador' },
  { code: 'EG', name: 'Egypt', nameIt: 'Egitto' },
  { code: 'SV', name: 'El Salvador', nameIt: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea', nameIt: 'Guinea Equatoriale' },
  { code: 'ER', name: 'Eritrea', nameIt: 'Eritrea' },
  { code: 'EE', name: 'Estonia', nameIt: 'Estonia' },
  { code: 'SZ', name: 'Eswatini', nameIt: 'Eswatini' },
  { code: 'ET', name: 'Ethiopia', nameIt: 'Etiopia' },
  { code: 'FJ', name: 'Fiji', nameIt: 'Figi' },
  { code: 'FI', name: 'Finland', nameIt: 'Finlandia' },
  { code: 'FR', name: 'France', nameIt: 'Francia' },
  { code: 'GA', name: 'Gabon', nameIt: 'Gabon' },
  { code: 'GM', name: 'Gambia', nameIt: 'Gambia' },
  { code: 'GE', name: 'Georgia', nameIt: 'Georgia' },
  { code: 'DE', name: 'Germany', nameIt: 'Germania' },
  { code: 'GH', name: 'Ghana', nameIt: 'Ghana' },
  { code: 'GR', name: 'Greece', nameIt: 'Grecia' },
  { code: 'GD', name: 'Grenada', nameIt: 'Grenada' },
  { code: 'GT', name: 'Guatemala', nameIt: 'Guatemala' },
  { code: 'GN', name: 'Guinea', nameIt: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau', nameIt: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana', nameIt: 'Guyana' },
  { code: 'HT', name: 'Haiti', nameIt: 'Haiti' },
  { code: 'HN', name: 'Honduras', nameIt: 'Honduras' },
  { code: 'HU', name: 'Hungary', nameIt: 'Ungheria' },
  { code: 'IS', name: 'Iceland', nameIt: 'Islanda' },
  { code: 'IN', name: 'India', nameIt: 'India' },
  { code: 'ID', name: 'Indonesia', nameIt: 'Indonesia' },
  { code: 'IR', name: 'Iran', nameIt: 'Iran' },
  { code: 'IQ', name: 'Iraq', nameIt: 'Iraq' },
  { code: 'IE', name: 'Ireland', nameIt: 'Irlanda' },
  { code: 'IL', name: 'Israel', nameIt: 'Israele' },
  { code: 'IT', name: 'Italy', nameIt: 'Italia' },
  { code: 'CI', name: 'Ivory Coast', nameIt: 'Costa d\'Avorio' },
  { code: 'JM', name: 'Jamaica', nameIt: 'Giamaica' },
  { code: 'JP', name: 'Japan', nameIt: 'Giappone' },
  { code: 'JO', name: 'Jordan', nameIt: 'Giordania' },
  { code: 'KZ', name: 'Kazakhstan', nameIt: 'Kazakistan' },
  { code: 'KE', name: 'Kenya', nameIt: 'Kenya' },
  { code: 'KI', name: 'Kiribati', nameIt: 'Kiribati' },
  { code: 'KP', name: 'North Korea', nameIt: 'Corea del Nord' },
  { code: 'KR', name: 'South Korea', nameIt: 'Corea del Sud' },
  { code: 'KW', name: 'Kuwait', nameIt: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan', nameIt: 'Kirghizistan' },
  { code: 'LA', name: 'Laos', nameIt: 'Laos' },
  { code: 'LV', name: 'Latvia', nameIt: 'Lettonia' },
  { code: 'LB', name: 'Lebanon', nameIt: 'Libano' },
  { code: 'LS', name: 'Lesotho', nameIt: 'Lesotho' },
  { code: 'LR', name: 'Liberia', nameIt: 'Liberia' },
  { code: 'LY', name: 'Libya', nameIt: 'Libia' },
  { code: 'LI', name: 'Liechtenstein', nameIt: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania', nameIt: 'Lituania' },
  { code: 'LU', name: 'Luxembourg', nameIt: 'Lussemburgo' },
  { code: 'MG', name: 'Madagascar', nameIt: 'Madagascar' },
  { code: 'MW', name: 'Malawi', nameIt: 'Malawi' },
  { code: 'MY', name: 'Malaysia', nameIt: 'Malesia' },
  { code: 'MV', name: 'Maldives', nameIt: 'Maldive' },
  { code: 'ML', name: 'Mali', nameIt: 'Mali' },
  { code: 'MT', name: 'Malta', nameIt: 'Malta' },
  { code: 'MH', name: 'Marshall Islands', nameIt: 'Isole Marshall' },
  { code: 'MR', name: 'Mauritania', nameIt: 'Mauritania' },
  { code: 'MU', name: 'Mauritius', nameIt: 'Mauritius' },
  { code: 'MX', name: 'Mexico', nameIt: 'Messico' },
  { code: 'FM', name: 'Micronesia', nameIt: 'Micronesia' },
  { code: 'MD', name: 'Moldova', nameIt: 'Moldavia' },
  { code: 'MC', name: 'Monaco', nameIt: 'Monaco' },
  { code: 'MN', name: 'Mongolia', nameIt: 'Mongolia' },
  { code: 'ME', name: 'Montenegro', nameIt: 'Montenegro' },
  { code: 'MA', name: 'Morocco', nameIt: 'Marocco' },
  { code: 'MZ', name: 'Mozambique', nameIt: 'Mozambico' },
  { code: 'MM', name: 'Myanmar', nameIt: 'Myanmar' },
  { code: 'NA', name: 'Namibia', nameIt: 'Namibia' },
  { code: 'NR', name: 'Nauru', nameIt: 'Nauru' },
  { code: 'NP', name: 'Nepal', nameIt: 'Nepal' },
  { code: 'NL', name: 'Netherlands', nameIt: 'Paesi Bassi' },
  { code: 'NZ', name: 'New Zealand', nameIt: 'Nuova Zelanda' },
  { code: 'NI', name: 'Nicaragua', nameIt: 'Nicaragua' },
  { code: 'NE', name: 'Niger', nameIt: 'Niger' },
  { code: 'NG', name: 'Nigeria', nameIt: 'Nigeria' },
  { code: 'MK', name: 'North Macedonia', nameIt: 'Macedonia del Nord' },
  { code: 'NO', name: 'Norway', nameIt: 'Norvegia' },
  { code: 'OM', name: 'Oman', nameIt: 'Oman' },
  { code: 'PK', name: 'Pakistan', nameIt: 'Pakistan' },
  { code: 'PW', name: 'Palau', nameIt: 'Palau' },
  { code: 'PS', name: 'Palestine', nameIt: 'Palestina' },
  { code: 'PA', name: 'Panama', nameIt: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea', nameIt: 'Papua Nuova Guinea' },
  { code: 'PY', name: 'Paraguay', nameIt: 'Paraguay' },
  { code: 'PE', name: 'Peru', nameIt: 'Perù' },
  { code: 'PH', name: 'Philippines', nameIt: 'Filippine' },
  { code: 'PL', name: 'Poland', nameIt: 'Polonia' },
  { code: 'PT', name: 'Portugal', nameIt: 'Portogallo' },
  { code: 'QA', name: 'Qatar', nameIt: 'Qatar' },
  { code: 'RO', name: 'Romania', nameIt: 'Romania' },
  { code: 'RU', name: 'Russia', nameIt: 'Russia' },
  { code: 'RW', name: 'Rwanda', nameIt: 'Ruanda' },
  { code: 'KN', name: 'Saint Kitts and Nevis', nameIt: 'Saint Kitts e Nevis' },
  { code: 'LC', name: 'Saint Lucia', nameIt: 'Santa Lucia' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', nameIt: 'Saint Vincent e Grenadine' },
  { code: 'WS', name: 'Samoa', nameIt: 'Samoa' },
  { code: 'SM', name: 'San Marino', nameIt: 'San Marino' },
  { code: 'ST', name: 'Sao Tome and Principe', nameIt: 'São Tomé e Príncipe' },
  { code: 'SA', name: 'Saudi Arabia', nameIt: 'Arabia Saudita' },
  { code: 'SN', name: 'Senegal', nameIt: 'Senegal' },
  { code: 'RS', name: 'Serbia', nameIt: 'Serbia' },
  { code: 'SC', name: 'Seychelles', nameIt: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone', nameIt: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore', nameIt: 'Singapore' },
  { code: 'SK', name: 'Slovakia', nameIt: 'Slovacchia' },
  { code: 'SI', name: 'Slovenia', nameIt: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands', nameIt: 'Isole Salomone' },
  { code: 'SO', name: 'Somalia', nameIt: 'Somalia' },
  { code: 'ZA', name: 'South Africa', nameIt: 'Sudafrica' },
  { code: 'SS', name: 'South Sudan', nameIt: 'Sudan del Sud' },
  { code: 'ES', name: 'Spain', nameIt: 'Spagna' },
  { code: 'LK', name: 'Sri Lanka', nameIt: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan', nameIt: 'Sudan' },
  { code: 'SR', name: 'Suriname', nameIt: 'Suriname' },
  { code: 'SE', name: 'Sweden', nameIt: 'Svezia' },
  { code: 'CH', name: 'Switzerland', nameIt: 'Svizzera' },
  { code: 'SY', name: 'Syria', nameIt: 'Siria' },
  { code: 'TW', name: 'Taiwan', nameIt: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan', nameIt: 'Tagikistan' },
  { code: 'TZ', name: 'Tanzania', nameIt: 'Tanzania' },
  { code: 'TH', name: 'Thailand', nameIt: 'Thailandia' },
  { code: 'TL', name: 'Timor-Leste', nameIt: 'Timor Est' },
  { code: 'TG', name: 'Togo', nameIt: 'Togo' },
  { code: 'TO', name: 'Tonga', nameIt: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago', nameIt: 'Trinidad e Tobago' },
  { code: 'TN', name: 'Tunisia', nameIt: 'Tunisia' },
  { code: 'TR', name: 'Turkey', nameIt: 'Turchia' },
  { code: 'TM', name: 'Turkmenistan', nameIt: 'Turkmenistan' },
  { code: 'TV', name: 'Tuvalu', nameIt: 'Tuvalu' },
  { code: 'UG', name: 'Uganda', nameIt: 'Uganda' },
  { code: 'UA', name: 'Ukraine', nameIt: 'Ucraina' },
  { code: 'AE', name: 'United Arab Emirates', nameIt: 'Emirati Arabi Uniti' },
  { code: 'GB', name: 'United Kingdom', nameIt: 'Regno Unito' },
  { code: 'US', name: 'United States', nameIt: 'Stati Uniti' },
  { code: 'UY', name: 'Uruguay', nameIt: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan', nameIt: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu', nameIt: 'Vanuatu' },
  { code: 'VA', name: 'Vatican City', nameIt: 'Città del Vaticano' },
  { code: 'VE', name: 'Venezuela', nameIt: 'Venezuela' },
  { code: 'VN', name: 'Vietnam', nameIt: 'Vietnam' },
  { code: 'YE', name: 'Yemen', nameIt: 'Yemen' },
  { code: 'ZM', name: 'Zambia', nameIt: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe', nameIt: 'Zimbabwe' }
]

// Helper to get country name by locale
export function getCountryName(code: string, locale: 'en' | 'it' = 'it'): string {
  const country = ALL_COUNTRIES.find(c => c.code === code)
  if (!country) return code
  return locale === 'it' ? country.nameIt : country.name
}

// Helper to search countries
export function searchCountries(query: string, locale: 'en' | 'it' = 'it'): Country[] {
  const q = query.toLowerCase().trim()
  if (!q) return ALL_COUNTRIES
  
  return ALL_COUNTRIES.filter(c => {
    const name = locale === 'it' ? c.nameIt : c.name
    return name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
  })
}

// Get sorted countries with Italy first (for Italian users)
export function getCountriesSortedByLocale(locale: 'en' | 'it' = 'it'): Country[] {
  const sorted = [...ALL_COUNTRIES].sort((a, b) => {
    const nameA = locale === 'it' ? a.nameIt : a.name
    const nameB = locale === 'it' ? b.nameIt : b.name
    return nameA.localeCompare(nameB, locale)
  })
  
  // Move Italy to top for Italian locale
  if (locale === 'it') {
    const italyIndex = sorted.findIndex(c => c.code === 'IT')
    if (italyIndex > 0) {
      const italy = sorted[italyIndex]
      if (italy) {
        sorted.splice(italyIndex, 1)
        sorted.unshift(italy)
      }
    }
  }
  
  return sorted
}
