import { z } from "zod";

export const CalibrationSnapshotSchema = z.object({
  timestamp_utc_iso: z.string(),
  arena: z.enum(["FOREX", "CRYPTO", "FUTURES", "EQUITIES_NEWS"]),
  symbol: z.string(),
  p95_spread: z.number().min(0),
  p99_slippage: z.number().min(0),
  source: z.enum(["PROXY", "SIM", "LIVE"]),
  version: z.string(),
  sample_size: z.number().int().min(0).nullable(),
});

export type CalibrationSnapshot = z.infer<typeof CalibrationSnapshotSchema>;
