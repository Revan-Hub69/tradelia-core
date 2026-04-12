// ============================================================
// SIMULATOR ENGINE v3.2
//
// CHANGES v3.2:
//   fix: CFD exposure = capital × ESMA_LEVERAGE[ugId]
//        (was: exposure = capital, leva non applicata)
//   fix: minPositionEUR check usa l'exposure post-leva
//   add: spot_fx branch → calcSpotFxCosts
//        - commission per lotto (per_lot_ecn)
//        - overnight tom-next in pip + rollover triplo
//   refactor: isCfd / isSpotFx / isFutures flag espliciti
// ============================================================

import { INSTRUMENT_OFFERS } from '@/data/simulator/market-data/instrument-offers';
import { BROKERS }           from '@/data/simulator/catalog/brokers';
import { UNDERLYINGS }       from '@/data/simulator/underlyings';
import type { UnderlyingId } from '@/data/simulator/underlyings';
import type { InstrumentOffer } from '@/data/simulator/schema/offer.types';
import type { AssetClass }  from '@/components/simulatore/AssetSelector';

const USD_TO_EUR        = 0.92;
const LOT_SIZE          = 100_000;
const SCORE_HALF_LIFE   = 20;
const k                 = Math.LN2 / SCORE_HALF_LIFE;
const MAX_RISK_PCT      = 0.02;
const FUTURES_CAPITAL_RATIO = 0.20;

// ── ESMA leverage cap per underlying group ──────────────────────
// Fonte: ESMA product intervention (2018), confermato MiFID II.
// Usato per calcolare l'exposure CFD/Spot partendo dal capitale.
const ESMA_LEVERAGE: Record<string, number> = {
  ug_fx_major:            30,
  ug_fx_minor:            20,
  ug_fx_exotic:           20,
  ug_crypto_major:         2,
  ug_indices_eu:          20,
  ug_indices_us:          20,
  ug_equity_us:            5,
  ug_equity_eu:            5,
  ug_commodities_energy:  10,
  ug_commodities_metals:  10,
};

const FUTURES_PARAMS: Record<'micro' | 'mini' | 'full', {
  nominalEUR:    number;
  marginEUR:     number;
  tickValueUSD:  number;
  ticksInSpread: number;
}> = {
  micro: { nominalEUR: 12_500,  marginEUR: 250,   tickValueUSD: 1.25,  ticksInSpread: 1 },
  mini:  { nominalEUR: 62_500,  marginEUR: 1_250,  tickValueUSD: 6.25,  ticksInSpread: 1 },
  full:  { nominalEUR: 125_000, marginEUR: 2_500,  tickValueUSD: 12.50, ticksInSpread: 1 },
};

export type Feasibility = 'OPTIMAL' | 'FEASIBLE' | 'WARNING' | 'INFEASIBLE';

export type FeasibilityDetail = {
  access:           boolean;
  canTrade:         boolean;
  sustainable:      boolean;
  label:            Feasibility;
  marginRequired:   number;
  riskPerTradePct:  number;
};

export type CostBreakdown = {
  spreadEUR:       number;
  commissionEUR:   number;
  overnightEUR:    number;
  exchangeFeeEUR:  number;
  rollEUR:         number;
  totalEUR:        number;
  spreadBps:       number;
  commissionBps:   number;
  overnightBps:    number;
  exchangeFeeBps:  number;
  rollBps:         number;
  totalBps:        number;
};

export type SimulatorResult = {
  id:                string;
  instrumentName:    string;
  brokerName:        string;
  accountTypeName:   string;
  score:             number;
  feasibility:       Feasibility;
  feasibilityDetail: FeasibilityDetail;
  costBreakdown:     CostBreakdown;
  lots:              number;
  contracts:         number;
  contractSize:      'micro' | 'mini' | 'full' | null;
  spreadCostBps:      number;
  commissionCostBps:  number;
  overnightCostBps:   number;
  totalCostBps:       number;
  spreadCost:         number;
  commissionCost:     number;
  overnightCost:      number;
  slippageCost:       number;
  achievableExposure: number;
  deviationPct:       number;
};

export type TradeDirection = 'long' | 'short';

export type EngineInput = {
  exposure?:      number;  // opzionale: se assente viene derivato da capital × leva
  capital?:       number;
  assetClass:     AssetClass;
  underlyingId?:  UnderlyingId;
  direction?:     TradeDirection;
  nDaysOpen?:     number;
  nTrades?:       number;
  stopLossPips?:  number;
  riskPct?:       number;
};

// ── Helpers ─────────────────────────────────────────────────────

function ugIdsForAssetClass(ac: AssetClass): string[] {
  switch (ac) {
    case 'FOREX':     return ['ug_fx_major', 'ug_fx_minor', 'ug_fx_exotic'];
    case 'CRYPTO':    return ['ug_crypto_major'];
    case 'INDEX':     return ['ug_indices_eu', 'ug_indices_us'];
    case 'EQUITY':    return ['ug_equity_us', 'ug_equity_eu'];
    case 'COMMODITY': return ['ug_commodities_energy', 'ug_commodities_metals'];
    default:          return [];
  }
}

/** Leva ESMA massima per un'offerta, basata sugli ugIds dell'offer. */
function esmaLeverageForOffer(offer: InstrumentOffer): number {
  const leverages = offer.ugIds.map(ug => ESMA_LEVERAGE[ug] ?? 1);
  return Math.max(...leverages);
}

function pipValueEURPerLot(quoteCurrency: string): number {
  const pipSize = quoteCurrency === 'JPY' ? 0.01 : 0.0001;
  return pipSize * LOT_SIZE * USD_TO_EUR;
}

function toBps(eur: number, reference: number): number {
  return reference > 0 ? (eur / reference) * 10_000 : 0;
}

// ── Overnight shared (CFD + Spot FX) ────────────────────────────
function calcOvernightEUR(
  offer:         InstrumentOffer,
  underlyingId:  UnderlyingId | undefined,
  direction:     TradeDirection,
  effectiveDays: number,
  lots:          number,
): number {
  if (effectiveDays === 0 || !underlyingId) return 0;

  const underlying = UNDERLYINGS[underlyingId];
  const overrides  = offer.underlyingOverrides?.[underlyingId];
  const quoteCcy   = underlying?.quoteCurrency ?? 'USD';

  const pipsPerDay = direction === 'long'
    ? (overrides?.overnightLongPipsPerDay  ?? offer.overnightLongPipsPerDay  ?? underlying?.overnightLongPipsPerDay  ?? 0)
    : (overrides?.overnightShortPipsPerDay ?? offer.overnightShortPipsPerDay ?? underlying?.overnightShortPipsPerDay ?? 0);

  if (pipsPerDay === 0) return 0;

  const tripleMultiplier = offer.overnightTripleMultiplier ?? 3;
  const extraNights      = effectiveDays >= 7
    ? Math.floor(effectiveDays / 7) * (tripleMultiplier - 1)
    : 0;
  const totalNights = effectiveDays + extraNights;

  const pipValEUR = pipValueEURPerLot(quoteCcy);
  const costEUR   = Math.abs(pipsPerDay) * totalNights * pipValEUR * lots;
  return pipsPerDay < 0 ? costEUR : 0;
}

function calcRiskPerTradePct(
  lots:         number,
  capital:      number,
  underlyingId: UnderlyingId | undefined,
  stopLossPips: number,
): number {
  if (capital <= 0 || lots <= 0) return 1;
  const quoteCcy  = underlyingId ? (UNDERLYINGS[underlyingId]?.quoteCurrency ?? 'USD') : 'USD';
  const pipValEUR = pipValueEURPerLot(quoteCcy);
  return (stopLossPips * pipValEUR * lots) / capital;
}

function calcScore(totalCostBps: number): number {
  return Math.max(1, Math.round(100 * Math.exp(-k * totalCostBps)));
}

function calcFeasibility(
  offer:        InstrumentOffer,
  exposure:     number,
  capital:      number,
  lots:         number,
  underlyingId: UnderlyingId | undefined,
  totalCostBps: number,
  stopLossPips: number,
): FeasibilityDetail {
  const marginRequired  = (offer.marginRequirementPct / 100) * exposure;
  // check su exposure post-leva (non sul capital raw)
  const access          = offer.minPositionEUR <= exposure;
  const canTrade        = capital >= marginRequired;
  const riskPerTradePct = calcRiskPerTradePct(lots, capital, underlyingId, stopLossPips);
  const sustainable     = riskPerTradePct < MAX_RISK_PCT;
  void totalCostBps;

  let label: Feasibility;
  if (!access || !canTrade)   label = 'INFEASIBLE';
  else if (!sustainable)      label = 'WARNING';
  else if (totalCostBps < 15) label = 'OPTIMAL';
  else if (totalCostBps < 40) label = 'FEASIBLE';
  else                        label = 'WARNING';

  return { access, canTrade, sustainable, label, marginRequired, riskPerTradePct };
}

// ── CFD cost calculator ──────────────────────────────────────────
function calcCFDCosts(
  offer:        InstrumentOffer,
  underlyingId: UnderlyingId | undefined,
  exposure:     number,
  direction:    TradeDirection,
  nDaysOpen:    number,
  nTrades:      number,
): CostBreakdown {
  const lots = exposure / LOT_SIZE;

  let spreadBps = offer.spreadAvgBps;
  if (underlyingId && offer.underlyingOverrides?.[underlyingId]?.spreadAvgBps != null) {
    spreadBps = offer.underlyingOverrides[underlyingId]!.spreadAvgBps!;
  }
  const spreadEUR = (spreadBps / 10_000) * exposure * nTrades;

  let commissionEUR = 0;
  if (offer.commissionPerLotUSD != null) {
    commissionEUR = offer.commissionPerLotUSD * lots * nTrades * USD_TO_EUR;
  } else if (offer.commissionPerLotEUR != null) {
    commissionEUR = offer.commissionPerLotEUR * lots * nTrades;
  }

  const effectiveDays = (
    offer.compatibleHorizons.includes('intraday') && nDaysOpen <= 1
  ) ? 0 : nDaysOpen;
  const overnightEUR = calcOvernightEUR(offer, underlyingId, direction, effectiveDays, lots);

  const totalEUR = spreadEUR + commissionEUR + overnightEUR;

  return {
    spreadEUR, commissionEUR, overnightEUR,
    exchangeFeeEUR: 0, rollEUR: 0, totalEUR,
    spreadBps:      toBps(spreadEUR,     exposure),
    commissionBps:  toBps(commissionEUR, exposure),
    overnightBps:   toBps(overnightEUR,  exposure),
    exchangeFeeBps: 0, rollBps: 0,
    totalBps:       toBps(totalEUR,      exposure),
  };
}

// ── Spot FX cost calculator ──────────────────────────────────────
// Differenze rispetto a CFD:
//   - commission: sempre per_lot_ecn (commissionPerLotEUR/USD)
//   - overnight:  tom-next in pip, stessa formula CFD ma swapType semanticamente diverso
//   - exposure:   capital × ESMA_LEVERAGE (identico CFD, ma leva è del broker non fissa)
function calcSpotFxCosts(
  offer:        InstrumentOffer,
  underlyingId: UnderlyingId | undefined,
  exposure:     number,
  direction:    TradeDirection,
  nDaysOpen:    number,
  nTrades:      number,
): CostBreakdown {
  const lots = exposure / LOT_SIZE;

  // Spread (raw ECN — tipicamente near-zero su major)
  let spreadBps = offer.spreadAvgBps;
  if (underlyingId && offer.underlyingOverrides?.[underlyingId]?.spreadAvgBps != null) {
    spreadBps = offer.underlyingOverrides[underlyingId]!.spreadAvgBps!;
  }
  const spreadEUR = (spreadBps / 10_000) * exposure * nTrades;

  // Commission per lotto (round-trip: già incluso nel valore se definito RT)
  let commissionEUR = 0;
  if (offer.commissionPerLotEUR != null) {
    commissionEUR = offer.commissionPerLotEUR * lots * nTrades;
  } else if (offer.commissionPerLotUSD != null) {
    commissionEUR = offer.commissionPerLotUSD * lots * nTrades * USD_TO_EUR;
  }

  // Overnight tom-next: identico CFD in formula, diverso in origine dei dati
  // (i pip vengono da overnightLongPipsPerDay / overnightShortPipsPerDay dell'offer)
  // Spot non ha "intraday exemption" — se nDaysOpen > 0 si paga sempre
  const overnightEUR = nDaysOpen > 0
    ? calcOvernightEUR(offer, underlyingId, direction, nDaysOpen, lots)
    : 0;

  const totalEUR = spreadEUR + commissionEUR + overnightEUR;

  return {
    spreadEUR, commissionEUR, overnightEUR,
    exchangeFeeEUR: 0, rollEUR: 0, totalEUR,
    spreadBps:      toBps(spreadEUR,     exposure),
    commissionBps:  toBps(commissionEUR, exposure),
    overnightBps:   toBps(overnightEUR,  exposure),
    exchangeFeeBps: 0, rollBps: 0,
    totalBps:       toBps(totalEUR,      exposure),
  };
}

// ── Futures cost calculator ──────────────────────────────────────
function calcFuturesCosts(
  offer:     InstrumentOffer,
  capital:   number,
  nDaysOpen: number,
  nTrades:   number,
): { breakdown: CostBreakdown; contracts: number; contractSize: 'micro' | 'mini' | 'full' | null } {
  const usableCapital = capital * FUTURES_CAPITAL_RATIO;

  const sizes = (['full', 'mini', 'micro'] as const).filter(sz =>
    (offer.availableContractSizes?.includes(sz) ?? false) &&
    usableCapital >= FUTURES_PARAMS[sz].marginEUR,
  );

  if (sizes.length === 0) {
    return {
      contracts: 0, contractSize: null,
      breakdown: {
        spreadEUR: 0, commissionEUR: 0, overnightEUR: 0,
        exchangeFeeEUR: 0, rollEUR: 0, totalEUR: 0,
        spreadBps: 0, commissionBps: 0, overnightBps: 0,
        exchangeFeeBps: 0, rollBps: 0, totalBps: 0,
      },
    };
  }

  const selectedSize = sizes[0];
  const params       = FUTURES_PARAMS[selectedSize];
  const contracts    = Math.max(1, Math.floor(usableCapital / params.marginEUR));
  const nominalEUR   = contracts * params.nominalEUR;

  const spreadEUR = contracts * params.tickValueUSD * params.ticksInSpread * USD_TO_EUR * nTrades;

  let commissionEUR = 0;
  if (offer.commissionPerContractEUR != null) {
    commissionEUR = offer.commissionPerContractEUR * contracts * nTrades;
  } else if (offer.commissionPerContractUSD != null) {
    commissionEUR = offer.commissionPerContractUSD * contracts * nTrades * USD_TO_EUR;
  }

  let exchangeFeeEUR = 0;
  if (offer.exchangeFeePerContractEUR != null) {
    exchangeFeeEUR = offer.exchangeFeePerContractEUR * contracts * nTrades;
  } else if (offer.exchangeFeePerContractUSD != null) {
    exchangeFeeEUR = offer.exchangeFeePerContractUSD * contracts * nTrades * USD_TO_EUR;
  }

  let rollEUR = 0;
  if (offer.rollSpreadBps != null && offer.rollFrequencyDays != null && nDaysOpen > offer.rollFrequencyDays) {
    const rolls = Math.floor(nDaysOpen / offer.rollFrequencyDays);
    rollEUR     = (offer.rollSpreadBps / 10_000) * nominalEUR * rolls;
  }

  const totalEUR = spreadEUR + commissionEUR + exchangeFeeEUR + rollEUR;

  return {
    contracts,
    contractSize: selectedSize,
    breakdown: {
      spreadEUR, commissionEUR, overnightEUR: 0,
      exchangeFeeEUR, rollEUR, totalEUR,
      spreadBps:      toBps(spreadEUR,      nominalEUR),
      commissionBps:  toBps(commissionEUR,  nominalEUR),
      overnightBps:   0,
      exchangeFeeBps: toBps(exchangeFeeEUR, nominalEUR),
      rollBps:        toBps(rollEUR,        nominalEUR),
      totalBps:       toBps(totalEUR,       nominalEUR),
    },
  };
}

// ── Main engine ──────────────────────────────────────────────────
export function runEngine({
  exposure:     exposureInput,
  capital,
  assetClass,
  underlyingId,
  direction    = 'long',
  nDaysOpen    = 1,
  nTrades      = 1,
  stopLossPips = 20,
  riskPct      = 0.01,
}: EngineInput): SimulatorResult[] {
  if (nTrades === 0) return [];

  const effectiveCapital = capital ?? exposureInput ?? 0;
  if (effectiveCapital <= 0) return [];

  const ugIds = ugIdsForAssetClass(assetClass);

  const compatibleOffers = INSTRUMENT_OFFERS.filter(offer =>
    offer.ugIds.some(ug => ugIds.includes(ug)),
  );

  if (compatibleOffers.length === 0) return [];

  void riskPct;

  const results: SimulatorResult[] = compatibleOffers.flatMap(offer => {
    const broker      = BROKERS[offer.brokerId];
    const isFutures   = offer.instrumentTypeId === 'futures_std';
    const isSpotFx    = offer.instrumentTypeId === 'spot_fx';
    // isCfd = tutto ciò che non è futures né spot (cfd_dd, cfd_ecn)
    const isCfd       = !isFutures && !isSpotFx;

    let breakdown:    CostBreakdown;
    let contracts     = 0;
    let contractSize: 'micro' | 'mini' | 'full' | null = null;
    let lots          = 0;
    let exposure      = 0;

    if (isFutures) {
      // Futures: leva implicita nel margine CME, capital non serve per exposure
      const res    = calcFuturesCosts(offer, effectiveCapital, nDaysOpen, nTrades);
      breakdown    = res.breakdown;
      contracts    = res.contracts;
      contractSize = res.contractSize;
      if (contracts === 0) return [];
      exposure = contracts * FUTURES_PARAMS[contractSize ?? 'micro'].nominalEUR;

    } else if (isSpotFx || isCfd) {
      // CFD e Spot FX: exposure = capital × leva ESMA (cap regolatorio)
      // Se l'utente ha passato un exposureInput esplicito lo usiamo direttamente,
      // altrimenti deriviamo dalla leva ESMA.
      const leverage = esmaLeverageForOffer(offer);
      exposure = exposureInput != null && exposureInput > 0
        ? exposureInput
        : effectiveCapital * leverage;

      if (exposure < 100) return [];

      // minPositionEUR check sull'exposure post-leva
      if (offer.minPositionEUR > exposure) return [];

      lots = exposure / LOT_SIZE;

      breakdown = isSpotFx
        ? calcSpotFxCosts(offer, underlyingId, exposure, direction, nDaysOpen, nTrades)
        : calcCFDCosts(offer, underlyingId, exposure, direction, nDaysOpen, nTrades);
    } else {
      return [];
    }

    const totalCostBps = breakdown.totalBps;
    const feasDetail   = calcFeasibility(
      offer, exposure, effectiveCapital, lots, underlyingId, totalCostBps, stopLossPips,
    );
    const score = calcScore(totalCostBps);

    const achievableExposure = isFutures
      ? contracts * FUTURES_PARAMS[contractSize ?? 'micro'].nominalEUR
      : exposure;

    return [{
      id:                `${offer.brokerId}_${offer.accountTypeId}_${offer.instrumentTypeId}`,
      instrumentName:    offer.instrumentTypeId,
      brokerName:        broker?.name ?? offer.brokerId,
      accountTypeName:   offer.accountTypeId,
      score,
      feasibility:       feasDetail.label,
      feasibilityDetail: feasDetail,
      costBreakdown:     breakdown,
      lots,
      contracts,
      contractSize,
      spreadCostBps:      breakdown.spreadBps,
      commissionCostBps:  breakdown.commissionBps,
      overnightCostBps:   breakdown.overnightBps,
      totalCostBps,
      spreadCost:         breakdown.spreadEUR,
      commissionCost:     breakdown.commissionEUR,
      overnightCost:      breakdown.overnightEUR,
      slippageCost:       0,
      achievableExposure,
      deviationPct:       0,
    }] satisfies SimulatorResult[];
  });

  return results.sort((a, b) => b.score - a.score);
}
