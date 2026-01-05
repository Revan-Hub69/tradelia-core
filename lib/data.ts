import { TrendingIcon, TargetIcon, BotIcon, RefreshIcon, ScaleIcon, ToolIcon, AlertIcon, ShieldIcon } from '@/components/Icons';

export const errorPatterns = [
  'Strumenti non coerenti con l\'obiettivo',
  'Confusione tra investimento, trading e speculazione', 
  'Uso della leva fuori contesto',
  'Esposizione eccessiva nelle prime fasi',
  'Decisioni emotive (FOMO, panico, overconfidence)'
];

export const evidenceData = [
  {
    error: 'Usare leva o derivati pensando di fare "lungo periodo"',
    evidence: 'Report su clienti retail in perdita – ESMA · SEC · FINRA',
    icon: TrendingIcon
  },
  {
    error: 'Confondere investimento, trading e speculazione',
    evidence: 'Barber & Odean (2000–2001): overconfidence e overtrading',
    icon: TargetIcon
  },
  {
    error: 'Seguire segnali o bot non verificabili', 
    evidence: 'Consumer & scam warnings – FCA',
    icon: BotIcon
  },
  {
    error: 'Cambiare approccio ogni volta che il mercato si muove',
    evidence: 'Regret aversion · Noise trading (De Bondt, Thaler; Shiller)',
    icon: RefreshIcon
  },
  {
    error: 'Sovra-esporsi troppo presto (capitale o rischio)',
    evidence: 'Overconfidence bias · Illusione di controllo (Kahneman & Tversky)',
    icon: ScaleIcon
  }
];

export const dashboardFeatures = [
  { text: 'Il percorso coerente con ciò che vuoi fare', icon: TargetIcon },
  { text: 'Strumenti crypto adatti al tuo profilo', icon: ToolIcon },
  { text: 'Analisi di coerenza obiettivo-strumento', icon: AlertIcon },
  { text: 'Monitoraggio continuo anti-errore', icon: ShieldIcon }
];