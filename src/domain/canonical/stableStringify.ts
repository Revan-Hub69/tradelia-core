const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return Object.prototype.toString.call(value) === "[object Object]";
};

const normalize = (value: unknown): unknown => {
  if (value === undefined) return null;

  if (Array.isArray(value)) {
    return value.map((item) => normalize(item));
  }

  if (isPlainObject(value)) {
    const sortedKeys = Object.keys(value).sort((a, b) => a.localeCompare(b));
    const out: Record<string, unknown> = {};
    for (const key of sortedKeys) {
      out[key] = normalize((value as Record<string, unknown>)[key]);
    }
    return out;
  }

  return value;
};

export function stableStringify(value: unknown): string {
  const normalized = normalize(value);
  return JSON.stringify(normalized);
}
