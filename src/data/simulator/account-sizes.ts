// ============================================================
// ACCOUNT SIZES — immutabile
// Range discreti di dimensione conto — input utente step 4
// ============================================================

export type AccountSizeId =
  | 'xs'   // 100 – 300€
  | 'sm'   // 300 – 1.000€
  | 'md'   // 1.000 – 3.000€
  | 'lg'   // 3.000 – 10.000€
  | 'xl';  // > 10.000€

export type AccountSize = {
  id: AccountSizeId;
  label: string;
  labelEn: string;
  rangeMin: number;        // EUR — estremo inferiore del range
  rangeMax: number | null; // EUR — null = illimitato (xl)
  rangeMid: number;        // EUR — valore centrale usato per calcoli
  icon: string;            // lucide icon name
};

export const ACCOUNT_SIZES: Record<AccountSizeId, AccountSize> = {
  xs: {
    id: 'xs',
    label: '100 – 300€',
    labelEn: '100 – 300€',
    rangeMin: 100,
    rangeMax: 300,
    rangeMid: 200,
    icon: 'Sprout',
  },
  sm: {
    id: 'sm',
    label: '300 – 1.000€',
    labelEn: '300 – 1,000€',
    rangeMin: 300,
    rangeMax: 1000,
    rangeMid: 650,
    icon: 'Wallet',
  },
  md: {
    id: 'md',
    label: '1.000 – 3.000€',
    labelEn: '1,000 – 3,000€',
    rangeMin: 1000,
    rangeMax: 3000,
    rangeMid: 2000,
    icon: 'BadgeEuro',
  },
  lg: {
    id: 'lg',
    label: '3.000 – 10.000€',
    labelEn: '3,000 – 10,000€',
    rangeMin: 3000,
    rangeMax: 10000,
    rangeMid: 6500,
    icon: 'TrendingUp',
  },
  xl: {
    id: 'xl',
    label: '> 10.000€',
    labelEn: '> 10,000€',
    rangeMin: 10000,
    rangeMax: null,
    rangeMid: 25000, // valore rappresentativo per calcoli
    icon: 'Landmark',
  },
} as const;

export const ACCOUNT_SIZE_IDS: AccountSizeId[] = ['xs', 'sm', 'md', 'lg', 'xl'];
