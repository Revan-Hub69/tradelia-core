import "server-only";

import { randomBytes } from "crypto";

let cachedDevSessionSecret: string | null = null;

export function getTradingSessionSecret(): string | null {
  const env = process.env.TRADING_SESSION_SECRET;
  if (env && env.trim().length > 0) return env;

  if (process.env.NODE_ENV !== "production") {
    if (!cachedDevSessionSecret) {
      cachedDevSessionSecret = randomBytes(32).toString("hex");
      process.stdout.write("[tradelia] DEV TRADING_SESSION_SECRET generated (set it in .env.local to persist).\n");
    }
    return cachedDevSessionSecret;
  }

  return null;
}

