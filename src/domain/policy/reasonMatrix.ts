import type { PolicyDecision } from "../contracts/policyDecision";
import { ReasonCodes, type ReasonCode } from "../contracts/reasonCodes";

const startsWith = (s: string, prefix: string) => s.startsWith(prefix);

export function validateActionReasonMatrix(decision: PolicyDecision): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const reasonSet = new Set<ReasonCode>(Object.values(ReasonCodes) as ReasonCode[]);
  const rc = decision.reason_codes as ReasonCode[];

  for (const code of rc) {
    if (!reasonSet.has(code)) errors.push(`ReasonCode.UNKNOWN.${code}`);
  }

  if (decision.dominant_constraint !== "UNKNOWN" && !rc.includes(decision.dominant_constraint as ReasonCode)) {
    errors.push("DominantConstraint.NOT_IN_REASON_CODES");
  }

  const has = (pred: (x: string) => boolean) => rc.some(pred);
  const hasFail = has((x) => x.includes(".FAIL."));
  const hasExecHalt = has((x) => startsWith(x, "EXEC.HALT."));
  const hasRiskFail = has((x) => startsWith(x, "RISK.FAIL."));
  const hasTradeOk = has((x) => startsWith(x, "TRADE.OK."));
  const hasSetup = has((x) => startsWith(x, "SETUP."));
  const hasVenue = has((x) => startsWith(x, "VENUE."));

  if (decision.action === "TRADE") {
    if (!hasTradeOk) errors.push("TRADE requires TRADE.OK.* reason code");
    if (hasFail || hasExecHalt || hasRiskFail) errors.push("TRADE forbids *.FAIL.*, EXEC.HALT.*, RISK.FAIL.*");
  }

  if (decision.action === "DELAY") {
    const okDelay =
      has((x) => startsWith(x, "REGIME.REVIEW.")) ||
      has((x) => x === ReasonCodes.SESSION_FAIL_EVENT_BUFFER_ACTIVE) ||
      has((x) => x === ReasonCodes.RISK_RESTRICT_PACING_SLOW);
    if (!okDelay) errors.push("DELAY requires REGIME.REVIEW.* or SESSION.FAIL.EVENT_BUFFER_ACTIVE or RISK.RESTRICT.PACING_SLOW");
    if (hasExecHalt) errors.push("DELAY forbids EXEC.HALT.*");
    if (has((x) => startsWith(x, "DATA.FAIL."))) errors.push("DELAY forbids DATA.FAIL.*");
    if (has((x) => startsWith(x, "CONSTRAINT.HARD."))) errors.push("DELAY forbids CONSTRAINT.HARD.*");
  }

  if (decision.action === "SKIP") {
    const okSkip =
      has((x) => startsWith(x, "DATA.FAIL.")) ||
      has((x) => startsWith(x, "CONSTRAINT.")) ||
      has((x) => startsWith(x, "VENUE.FAIL.")) ||
      has((x) => startsWith(x, "SETUP.FAIL.")) ||
      has((x) => startsWith(x, "COST.FAIL."));
    if (!okSkip) errors.push("SKIP requires DATA.FAIL.* or CONSTRAINT.* or VENUE.FAIL.* or SETUP.FAIL.* or COST.FAIL.*");
    if (hasTradeOk) errors.push("SKIP forbids TRADE.OK.*");
    if (hasExecHalt) errors.push("SKIP forbids EXEC.HALT.* (HALT should be used)");
  }

  if (decision.action === "HALT") {
    if (!hasExecHalt) errors.push("HALT requires EXEC.HALT.*");
    if (hasTradeOk || hasSetup || hasVenue) errors.push("HALT forbids TRADE.OK.*, SETUP.*, VENUE.*");
  }

  if (decision.action === "HALT" && decision.trade_gate !== "CLOSED") errors.push("HALT requires trade_gate=CLOSED");
  if (decision.action === "TRADE" && decision.trade_gate !== "OPEN") errors.push("TRADE requires trade_gate=OPEN");
  if (decision.action === "DELAY" && decision.trade_gate === "CLOSED") errors.push("DELAY forbids trade_gate=CLOSED");

  if (decision.action === "TRADE" && !decision.selected_setup_id) errors.push("TRADE requires selected_setup_id");
  if ((decision.action === "SKIP" || decision.action === "HALT") && decision.selected_setup_id !== null) {
    errors.push("SKIP/HALT requires selected_setup_id=null");
  }

  return { ok: errors.length === 0, errors };
}
