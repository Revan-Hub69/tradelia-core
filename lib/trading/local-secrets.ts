import "server-only";

import fs from "fs";
import os from "os";
import path from "path";

export type LocalSecrets = {
  groqApiKey?: string;
};

const SECRETS_DIR = path.join(os.homedir(), ".tradelia");
const SECRETS_PATH = path.join(SECRETS_DIR, "secrets.json");

export function getLocalSecretsPath() {
  return SECRETS_PATH;
}

export function readLocalSecrets(): LocalSecrets {
  try {
    const raw = fs.readFileSync(SECRETS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const obj = parsed as Record<string, unknown>;
    const groqApiKey = typeof obj.groqApiKey === "string" && obj.groqApiKey.trim().length > 0 ? obj.groqApiKey.trim() : undefined;
    return { groqApiKey };
  } catch {
    return {};
  }
}

export function writeLocalSecrets(next: LocalSecrets) {
  fs.mkdirSync(SECRETS_DIR, { recursive: true });
  const payload: LocalSecrets = {};
  if (typeof next.groqApiKey === "string" && next.groqApiKey.trim().length > 0) {
    payload.groqApiKey = next.groqApiKey.trim();
  }
  const raw = `${JSON.stringify(payload, null, 2)}\n`;
  fs.writeFileSync(SECRETS_PATH, raw, { encoding: "utf-8", mode: 0o600 });
}

export function getLocalGroqApiKey(): string | undefined {
  return readLocalSecrets().groqApiKey;
}

