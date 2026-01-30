import { createHash } from "node:crypto";
import { stableStringify } from "./stableStringify";
import type { DecisionStateCanonicalV1 } from "./canonicalizeDecisionState";

export function computeStateHash(canonical: DecisionStateCanonicalV1): string {
  const json = stableStringify(canonical);
  return createHash("sha256").update(json).digest("hex");
}
