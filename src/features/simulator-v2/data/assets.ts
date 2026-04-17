import {
  BarChart3,
  Building2,
  Coins,
  Globe,
  Wheat,
} from 'lucide-react';

export type AssetId =
  | 'forex'
  | 'indices'
  | 'equities'
  | 'commodities'
  | 'crypto';

export type Asset = {
  id: AssetId;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  available: boolean;
};

export const ASSETS: Asset[] = [
  {
    id: 'forex',
    label: 'Forex',
    desc: 'Major, Cross & Esotico',
    icon: Globe,
    color: 'text-[#10b981]',
    gradient: 'from-[#10b981]/20 to-[#14b8a6]/5',
    available: true,
  },
  {
    id: 'indices',
    label: 'Indici',
    desc: 'US, EU & Asia',
    icon: BarChart3,
    color: 'text-[#3b82f6]',
    gradient: 'from-[#3b82f6]/20 to-[#06b6d4]/5',
    available: false,
  },
  {
    id: 'equities',
    label: 'Azioni',
    desc: 'US, EU & Asia Large Cap',
    icon: Building2,
    color: 'text-[#8b5cf6]',
    gradient: 'from-[#8b5cf6]/20 to-[#06b6d4]/5',
    available: false,
  },
  {
    id: 'commodities',
    label: 'Commodity',
    desc: 'Metalli & Energia',
    icon: Wheat,
    color: 'text-[#f59e0b]',
    gradient: 'from-[#f59e0b]/20 to-[#ef4444]/5',
    available: false,
  },
  {
    id: 'crypto',
    label: 'Crypto',
    desc: 'Major & Altcoin',
    icon: Coins,
    color: 'text-[#ef4444]',
    gradient: 'from-[#ef4444]/20 to-[#8b5cf6]/5',
    available: false,
  },
];
