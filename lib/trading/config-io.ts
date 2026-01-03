import "server-only";

import fs from "fs";
import path from "path";

import type { RegimeConfig } from "@/engines/regime4h";

export type ScreenerConfig = {
  version: "screener-v1";
  filters: {
    excludeTransition: boolean;
    excludeStress: boolean;
    maxSpreadBps: number;
    minQuoteVolume24h: number;
  };
};

export type SymbolsConfig = {
  version: "symbols-v1";
  symbols: string[];
};

export function readRegimeConfig(): RegimeConfig {
  const config = readJsonFile<RegimeConfig>(resolveConfigPath("regime.json"));
  assertRegimeConfig(config);
  return config;
}

export function writeRegimeConfig(value: unknown): RegimeConfig {
  assertRegimeConfig(value);
  writeJsonFile(resolveConfigPath("regime.json"), value);
  return value;
}

export function readScreenerConfig(): ScreenerConfig {
  const config = readJsonFile<ScreenerConfig>(resolveConfigPath("screener.json"));
  assertScreenerConfig(config);
  return config;
}

export function writeScreenerConfig(value: unknown): ScreenerConfig {
  assertScreenerConfig(value);
  writeJsonFile(resolveConfigPath("screener.json"), value);
  return value;
}

export function readSymbolsConfig(): SymbolsConfig {
  const config = readJsonFile<SymbolsConfig>(resolveConfigPath("symbols.json"));
  const normalized = normalizeSymbolsConfig(config);
  return normalized;
}

export function writeSymbolsConfig(value: unknown): SymbolsConfig {
  const normalized = normalizeSymbolsConfig(value);
  writeJsonFile(resolveConfigPath("symbols.json"), normalized);
  return normalized;
}

function resolveConfigPath(filename: string) {
  return path.join(process.cwd(), "config", filename);
}

function readJsonFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function writeJsonFile(filePath: string, value: unknown) {
  const raw = `${JSON.stringify(value, null, 2)}\n`;
  fs.writeFileSync(filePath, raw, "utf-8");
}

function assertRegimeConfig(value: unknown): asserts value is RegimeConfig {
  if (!isPlainObject(value)) throw new Error("Regime config must be an object.");
  if (value.version !== "regime-4h-config-v1") throw new Error("Invalid regime config version.");
  if (!isPlainObject(value.windows)) throw new Error("Invalid regime config.windows.");
  if (!isPlainObject(value.thresholds)) throw new Error("Invalid regime config.thresholds.");

  assertFinitePositive(value.windows.atr14, "windows.atr14");
  assertFinitePositive(value.windows.ema20, "windows.ema20");
  assertFinitePositive(value.windows.ema50, "windows.ema50");
  assertFinitePositive(value.windows.ema200, "windows.ema200");
  assertFinitePositive(value.windows.returnsStd20, "windows.returnsStd20");
  assertFinitePositive(value.windows.rangeHHLL50, "windows.rangeHHLL50");

  assertFinitePositive(value.thresholds.stressTrueRangeToAtr, "thresholds.stressTrueRangeToAtr");
  assertFinitePositive(value.thresholds.enterTrend?.trendStrengthMin, "thresholds.enterTrend.trendStrengthMin");
  assertFinitePositive(value.thresholds.enterTrend?.rangeRatioMin, "thresholds.enterTrend.rangeRatioMin");
  assertFinitePositive(value.thresholds.exitTrend?.trendStrengthMin, "thresholds.exitTrend.trendStrengthMin");
  assertFinitePositive(value.thresholds.exitTrend?.rangeRatioMin, "thresholds.exitTrend.rangeRatioMin");

  assertFinitePositive(value.thresholds.enterRange?.trendStrengthMax, "thresholds.enterRange.trendStrengthMax");
  assertFinitePositive(value.thresholds.enterRange?.rangeRatioMin, "thresholds.enterRange.rangeRatioMin");
  assertFinitePositive(value.thresholds.exitRange?.trendStrengthMax, "thresholds.exitRange.trendStrengthMax");
  assertFinitePositive(value.thresholds.exitRange?.rangeRatioMin, "thresholds.exitRange.rangeRatioMin");
}

function assertScreenerConfig(value: unknown): asserts value is ScreenerConfig {
  if (!isPlainObject(value)) throw new Error("Screener config must be an object.");
  if (value.version !== "screener-v1") throw new Error("Invalid screener config version.");
  if (!isPlainObject(value.filters)) throw new Error("Invalid screener config.filters.");

  assertBoolean(value.filters.excludeTransition, "filters.excludeTransition");
  assertBoolean(value.filters.excludeStress, "filters.excludeStress");
  assertFinitePositive(value.filters.maxSpreadBps, "filters.maxSpreadBps");
  assertFiniteNonNegative(value.filters.minQuoteVolume24h, "filters.minQuoteVolume24h");
}

function normalizeSymbolsConfig(value: unknown): SymbolsConfig {
  if (!isPlainObject(value)) throw new Error("Symbols config must be an object.");
  if (value.version !== "symbols-v1") throw new Error("Invalid symbols config version.");
  if (!Array.isArray(value.symbols)) throw new Error("Invalid symbols config.symbols.");

  const out: string[] = [];
  const seen = new Set<string>();

  for (const entry of value.symbols) {
    if (typeof entry !== "string") continue;
    const symbol = entry.trim().toUpperCase();
    if (!/^[A-Z0-9]{5,20}$/.test(symbol)) continue;
    if (seen.has(symbol)) continue;
    seen.add(symbol);
    out.push(symbol);
  }

  if (out.length === 0) throw new Error("symbols must include at least one valid symbol.");
  return { version: "symbols-v1", symbols: out };
}

function assertFinitePositive(value: unknown, pathLabel: string) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`Invalid number: ${pathLabel}`);
  }
}

function assertFiniteNonNegative(value: unknown, pathLabel: string) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(`Invalid number: ${pathLabel}`);
  }
}

function assertBoolean(value: unknown, pathLabel: string) {
  if (typeof value !== "boolean") {
    throw new Error(`Invalid boolean: ${pathLabel}`);
  }
}

function isPlainObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

